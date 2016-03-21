import {Injectable} from 'angular2/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {PaymentMethod} from '../typings/payment-method.d';
import {Http, Headers, RequestOptions} from 'angular2/http';

@Injectable()
export class PaymentService {
  availableMethods: PaymentMethod[];
  selectedMethod: PaymentMethod;

  constructor(private _magento: MagentoService, private _cart: CartService, private _http: Http) {
  }

  savePaymentInforAndPlaceOrderPost(email: string, paymentMethodCode: string) {

    this._cart.getCardId().subscribe(cartId => {

      let body = JSON.stringify({
        email: email,
        paymentMethod: {
          poNumber: null,
          method: paymentMethodCode,
          additionalData: null,
        }
      });
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      this._http.post(
        'http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/payment-information',
        body,
        options
      ).map(response => response.json())
        .subscribe(data => {

          console.log('Place order: ', data);
          this._cart.reset();
          alert('Order placed!');

        });
    });

  }

  getMethods() {

    this._cart.getCardId().subscribe(cartId => {

      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      return this._http.get('http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/payment-methods', options)
        .map(response => response.json())
        .subscribe((data: PaymentMethod[]) => {

          console.log('Available Payment Methods: ', data);
          this.availableMethods = data;

        });
    });

  }
}
