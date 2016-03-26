import {Injectable} from 'angular2/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {PaymentMethod} from '../typings/payment-method.d';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {RadioButtonState} from 'angular2/common';

@Injectable()
export class PaymentService {
  availableMethods: PaymentMethod[] = [];
  isLoading = false;
  isPlacingOrder = false;
  email = '';

  constructor(private _magento: MagentoService, private _cart: CartService, private _http: Http) {
  }

  saveAndPlaceOrder() {

    this.isPlacingOrder = true;

    this._cart.getCardId().subscribe(cartId => {

      let methodCode = '';
      this.availableMethods.forEach((currentValue: PaymentMethod) => {
        if (currentValue.state.checked) {
          methodCode = currentValue.code;
        }
      });

      let body = JSON.stringify({
        email        : this.email,
        paymentMethod: {
          poNumber      : null,
          method        : methodCode,
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

          console.log('Order Id', data);
          this._cart.reset();
          this.isPlacingOrder = false;

        });
    });

  }

  loadMethods() {

    this.isLoading = true;

    this._cart.getCardId().subscribe(cartId => {

      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      return this._http.get('http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/payment-methods', options)
        .map(response => response.json())
        .subscribe((data: PaymentMethod[]) => {

          console.log('Available Payment Methods: ', data);
          this.availableMethods = data;

          this.availableMethods.forEach((currentValue: PaymentMethod) => {
            currentValue.state = new RadioButtonState(
              false,
              currentValue.code
            );
          });

          this.isLoading = false;

        });
    });

  }
}
