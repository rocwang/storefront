import {Injectable, EventEmitter} from 'angular2/core';
import {MagentoService} from './magento.service';
import {Product} from './../typings/product.d';
import {Totals} from '../typings/totals.d';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

@Injectable()
export class CartService {
  private _STORAGE_KEY = 'cart-id';

  refreshEvent: EventEmitter<any> = new EventEmitter();
  isRefreshing = false;
  totals: Totals;

  constructor(private _magento: MagentoService, private _http: Http) {
    this.refresh();
  }

  reset() {
    localStorage.removeItem(this._STORAGE_KEY);
    this.refresh();
  }

  add(product: Product) {
    return new Observable<Product[]>((observer: Subscriber<any>) => {

      this.getCardId().subscribe(cartId => {

        let body = JSON.stringify({
          cartItem: {
            quote_id: cartId,
            sku     : product.sku,
            qty     : 1,
          }
        });

        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        return this._http.post('http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/items', body, options)
          .subscribe(response => {

            var cartItem = response.json();
            console.log('Add to cart: ', cartItem);

            observer.next(cartItem);

          });
      });

    });
  }

  getCardId(): Observable<string> {
    var cartId = localStorage.getItem(this._STORAGE_KEY);

    if (cartId) {

      return Observable.of(cartId);

    } else {

      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      return this._http.post('http://m2.rocwang.me/rest/V1/guest-carts', '', options)
        .map(res => {

          var cartId = res.text().replace(/"/g, '');
          console.log('Cart Id:', cartId);
          localStorage.setItem(this._STORAGE_KEY, cartId);

          return cartId;

        }).catch(this._handleError);

    }
  }

  refresh(triggerEvent = false) {
    this.isRefreshing = true;

    return new Observable<Totals>((observer: Subscriber<Totals>) => {

      this.getCardId().subscribe(cartId => {

        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        return this._http.get('http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/totals', options)
          .map(res => <Totals>res.json())
          .catch(this._handleError)
          .subscribe(totals => {

            observer.next(totals);

          });
      });
    }).subscribe(totals => {

      this.totals = totals;
      console.log('Totals:', this.totals);

      if (triggerEvent) {
        this.refreshEvent.emit(this.totals);
      }

      this.isRefreshing = false;

    });
  }

  private _handleError(error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error.json());
    return Observable.throw(error.json() || 'Server error');
  }
}
