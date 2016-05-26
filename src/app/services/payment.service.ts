import {Injectable} from '@angular/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {PaymentMethod} from '../typings/payment-method.d';
import {AddtionalData} from '../typings/additional-data.d';
import {Http, Headers, RequestOptions} from '@angular/http';
import {RadioButtonState} from '@angular/common';
import {EventEmitter} from '@angular/core';

@Injectable()
export class PaymentService {
  availableMethods: PaymentMethod[] = [];

  isLoading = false;
  isPlacingOrder = false;
  isSaved = false;
  isOrderPlaced = false;

  orderPlacedEvent: EventEmitter<any> = new EventEmitter();

  email = '';
  orderId = 0;
  cc_cid = '';

  additionalData: AddtionalData = {
    cc_exp_month        : '',
    cc_exp_year         : '',
    cc_last4            : '',
    cc_token            : null,
    cc_type             : 'VI',
    device_data         : '',
    payment_method_nonce: 'fake-valid-nonce',
    store_in_vault      : true
  };

  constructor(private _magento: MagentoService, private _cart: CartService, private _http: Http) {
  }

  get selectedMethod() {
    let methodCode = '';

    this.availableMethods.forEach((currentValue: PaymentMethod) => {
      if (currentValue.state.checked) {
        methodCode = currentValue.code;
      }
    });

    return methodCode;
  }

  set ccLast4(ccNumber: string) {
    this.additionalData.cc_last4 = ccNumber.slice(-4);
  }

  get cclast4() {
    return this.additionalData.cc_last4;
  }

  saveAndPlaceOrder() {
    console.log(this.additionalData);

    this._cart.isConfirmed = true;
    this.isPlacingOrder = true;

    this._cart.getCardId().subscribe(cartId => {

      let body = JSON.stringify({
        email        : this.email,
        paymentMethod: {
          poNumber      : null,
          method        : this.selectedMethod,
          additionalData: this.additionalData,
        }
      });
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
      });
      let options = new RequestOptions({headers: headers});

      this._http.post(
        'https://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/payment-information',
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

    this._cart.getCardId().subscribe(cartId => {

      let body = JSON.stringify({
        email        : this.email,
        paymentMethod: {
          poNumber      : null,
          method        : this.selectedMethod,
          additionalData: this.additionalData,
        }
      });
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
      });
      let options = new RequestOptions({headers: headers});

      this._http.post(
        'https://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/set-payment-information',
        body,
        options
      ).map(response => response.json())
        .subscribe(isSaved => {

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

      return this._http.get('https://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/payment-methods', options)
        .map(response => response.json())
        .subscribe((data: PaymentMethod[]) => {

          console.log('Available Payment Methods: ', data);

          this.availableMethods = [];
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
