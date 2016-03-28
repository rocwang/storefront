import {Injectable} from 'angular2/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {PaymentMethod} from '../typings/payment-method.d';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {RadioButtonState} from 'angular2/common';
import {EventEmitter} from 'angular2/core';

@Injectable()
export class PaymentService {
  availableMethods: PaymentMethod[] = [];
  isLoading = false;
  isPlacingOrder = false;
  isSaved = false;
  isOrderPlaced = false;
  email = '';
  orderPlacedEvent: EventEmitter<any> = new EventEmitter();
  orderId = 0;

  constructor(private _magento: MagentoService, private _cart: CartService, private _http: Http) {
  }

  saveAndPlaceOrder() {

    this._cart.isConfirmed = true;
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
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
      });
      let options = new RequestOptions({headers: headers});

      this._http.post(
        'http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/payment-information',
        body,
        options
      ).map(response => response.json())
        .subscribe(data => {

          console.log('Order Id:', data);
          this._cart.reset();
          this.isPlacingOrder = false;
          this.isOrderPlaced = true;
          this.orderId = data;
          this.orderPlacedEvent.emit(data);

        });

      // setTimeout(() => {
      //   this.isPlacingOrder = false;
      //   this.isOrderPlaced = true;
      //   this.orderId = 111;
      //   this.orderPlacedEvent.emit(this.orderId);
      // }, 3000);
    });

  }

  save() {

    this.isLoading = true;

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
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
      });
      let options = new RequestOptions({headers: headers});

      this._http.post(
        'http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/set-payment-information',
        body,
        options
      ).map(response => response.json())
        .subscribe(isSaved => {

          this.isLoading = false;
          this.isSaved = isSaved;

        });

    });

  }

  loadMethods() {

    this.isLoading = true;

    this._cart.getCardId().subscribe(cartId => {

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
      });
      let options = new RequestOptions({headers: headers});

      return this._http.get('http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/payment-methods', options)
        .map(response => response.json())
        .subscribe((data: PaymentMethod[]) => {

          console.log('Available Payment Methods: ', data);

          data.forEach((currentValue: PaymentMethod) => {
            // Exclude the "free" payment method
            if (currentValue.code === 'free') {
              return;
            }

            currentValue.state = new RadioButtonState(
              false,
              currentValue.code
            );

            this.availableMethods.push(currentValue);
          });

          this.isLoading = false;

        });
    });

  }
}
