import {Injectable} from 'angular2/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {ShippingMethod} from '../typings/shipping-method.d';
import {PaymentService} from './payment.service';
import {Address} from '../typings/adress.d';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {RadioButtonState} from 'angular2/common';

@Injectable()
export class ShippingService {
  selectedAddress: Address = {
    region   : '',
    regionId : 0,
    countryId: 'us',
    postcode : '',
    street   : ['', ''],
    telephone: '',
    city     : '',
    firstname: '',
    lastname : '',
    company  : ''
  };
  availableAddresses: Address[] = [];
  availableMethods: ShippingMethod[] = [];
  isLoadingMethods = false;

  constructor(private _magento: MagentoService,
              private _cart: CartService,
              private _payment: PaymentService,
              private _http: Http) {
  }

  loadMethodsByAddress() {

    this.isLoadingMethods = true;

    this._cart.getCardId().subscribe(cartId => {

      let body = JSON.stringify({
        address: {
          region   : this.selectedAddress.region,
          // regionId : 0,
          countryId: this.selectedAddress.countryId,
          postcode : this.selectedAddress.postcode,
        }
      });

      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      this._http.post(
        'http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/estimate-shipping-methods',
        body,
        options
      ).map(response => response.json())
        .subscribe((data) => {

          console.log('Shipping methods: ', data);

          data.forEach((currentValue: ShippingMethod) => {
            currentValue.state = new RadioButtonState(
              false,
              currentValue.carrier_code + '_' + currentValue.method_code
            );
          });

          this.availableMethods = data;
          this.isLoadingMethods = false;

        });
    });

  }

  loadMethodsByCart() {

    this._cart.getCardId().subscribe(cartId => {

      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      return this._http.get('http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/shipping-methods', options)
        .map(response => response.json())
        .subscribe((data: ShippingMethod[]) => {

          console.log('Shipping methods by Cart: ', data);
          this.availableMethods = data;

          this.availableMethods.forEach((currentValue: ShippingMethod) => {
            currentValue.state = new RadioButtonState(
              false,
              currentValue.carrier_code + '_' + currentValue.method_code
            );
          });

        });
    });

  }

  save() {

    this._cart.getCardId().subscribe(cartId => {

      let carrierCode = '';
      let methodCode = '';
      this.availableMethods.forEach((currentValue: ShippingMethod) => {
        if (currentValue.state.checked) {
          carrierCode = currentValue.carrier_code;
          methodCode = currentValue.method_code;
        }
      });

      let body = JSON.stringify({
        addressInformation: {
          shippingAddress    : this.selectedAddress,
          billingAddress     : this.selectedAddress,
          shippingCarrierCode: carrierCode,
          shippingMethodCode : methodCode,
        }
      });
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      this._cart.isLoading = true;
      this._http.post(
        'http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/shipping-information',
        body,
        options
      ).map(response => response.json())
        .subscribe((data: any) => {

          console.log('Available Payment Methods: ', data);
          // this._payment.availableMethods = data.payment_methods;
          this._cart.totals = data.totals;
          this._cart.isLoading = false;

        });
    });

  }
}
