import {Injectable} from 'angular2/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {ShippingMethod} from '../typings/shipping-method.d';
import {PaymentService} from './payment.service';
import {Address} from '../typings/adress.d';

@Injectable()
export class ShippingService {
  selectedMethod: ShippingMethod;
  selectedAddress: Address = {
    region    : '',
    regionId  : 0,
    countryId : 'us',
    postcode  : '',
    street    : ['', ''],
    telephone : '',
    city      : '',
    firstname : '',
    lastname  : '',
    methodCode: '',
    carrayCode: '',
    company   : ''
  };
  availableMethods: Array<ShippingMethod> = [];

  constructor(private _magento: MagentoService, private _cart: CartService, private _payment: PaymentService) {
  }

  getShippingMethodsByAddr(): Promise<any> {

    return new Promise(resolve => {
      this._cart.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {
          api.quoteGuestShippingMethodManagementV1.quoteGuestShippingMethodManagementV1EstimateByAddressPost({

            cartId: cartId,
            $body : {
              address: {
                region   : this.selectedAddress.region,
                // regionId : 0,
                countryId: this.selectedAddress.countryId,
                postcode : this.selectedAddress.postcode,
              }
            }

          }).then((data: any) => {

            console.log('Shipping methods: ', data.obj);
            this.availableMethods = data.obj;
            resolve(this.availableMethods);

          });
        });
      });
    });

  }

  getShippingMethodsByCart(): Promise<any> {

    return new Promise(resolve => {
      this._cart.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {
          api.quoteGuestShippingMethodManagementV1.quoteGuestShippingMethodManagementV1GetListGet({

            cartId: cartId,

          }).then((data: any) => {

            console.log('Shipping methods by Cart: ', data.obj);
            this.availableMethods = data.obj;
            resolve(this.availableMethods);

          });
        });
      });
    });

  }


  saveShippingInfoAndGetPaymentMethods(): Promise<any> {

    return new Promise(resolve => {
      this._cart.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {
          api.checkoutGuestShippingInformationManagementV1.checkoutGuestShippingInformationManagementV1SaveAddressInformationPost({
            cartId: cartId,
            $body : {
              addressInformation: {
                shippingAddress    : this.selectedAddress,
                billingAddress     : this.selectedAddress,
                shippingMethodCode : this.selectedMethod.method_code,
                shippingCarrierCode: this.selectedMethod.carrier_code
              }
            }
          }).then((data: any) => {

            console.log('Available Payment Methods: ', data.obj);

            this._payment.availableMethods = data.obj.payment_methods;
            this._cart.totals = data.obj.totals;

          });
        });
      });
    });

  }
}
