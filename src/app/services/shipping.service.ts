import {Injectable} from 'angular2/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {ShippingMethod} from '../typings/shipping-method.d';
import {PaymentService} from './payment.service';
import {Address} from '../typings/adress.d';
import {Http, Headers, RequestOptions} from 'angular2/http';

@Injectable()
export class ShippingService {
  selectedAddress: Address = {
    region: '',
    regionId: 0,
    countryId: 'us',
    postcode: '',
    street: ['', ''],
    telephone: '',
    city: '',
    firstname: '',
    lastname: '',
    methodCode: '',
    carrayCode: '',
    company: ''
  };
  availableAddress: Address[] = [];
  
  selectedMethod: ShippingMethod;
  availableMethods: ShippingMethod[] = [];

  constructor(private _magento: MagentoService,
              private _cart: CartService,
              private _payment: PaymentService,
              private _http: Http) {
  }

  getShippingMethodsByAddr() {

    this._cart.getCardId().subscribe(cartId => {

      let body = JSON.stringify({
        address: {
          region: this.selectedAddress.region,
          // regionId : 0,
          countryId: this.selectedAddress.countryId,
          postcode: this.selectedAddress.postcode,
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
          this.availableMethods = data;

        });
    });

  }

  getShippingMethodsByCart() {

    this._cart.getCardId().subscribe(cartId => {

      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      return this._http.get('http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/shipping-methods', options)
        .map(response => response.json())
        .subscribe((data: ShippingMethod[]) => {

          console.log('Shipping methods by Cart: ', data);
          this.availableMethods = data;
        });
    });

  }


  saveShippingInfoAndGetPaymentMethods() {

    this._cart.getCardId().subscribe(cartId => {

      let body = JSON.stringify({
        addressInformation: {
          shippingAddress: this.selectedAddress,
          billingAddress: this.selectedAddress,
          shippingMethodCode: this.selectedMethod.method_code,
          shippingCarrierCode: this.selectedMethod.carrier_code
        }
      });
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});

      this._http.post(
        'http://m2.rocwang.me/rest/V1/guest-carts/' + cartId + '/shipping-information',
        body,
        options
      ).map(response => response.json())
        .subscribe((data: any) => {

          console.log('Available Payment Methods: ', data);
          this._payment.availableMethods = data.payment_methods;
          this._cart.totals = data.totals;

        });
    });

  }
}
