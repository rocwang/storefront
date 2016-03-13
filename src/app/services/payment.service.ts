import {Injectable} from 'angular2/core';
import {MagentoService} from './magento.service';
import {CartService} from './cart.service';
import {PaymentMethod} from '../typings/payment-method.d';

@Injectable()
export class PaymentService {
  code: string;
  title: string;
  availableMethods: Array<PaymentMethod>;
  selectedMethod: PaymentMethod;

  constructor(private _magento: MagentoService, private _cart: CartService) {
  }

  savePaymentInforAndPlaceOrderPost(email: string, paymentMethodCode: string): Promise<any> {

    return new Promise(resolve => {
      this._cart.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {
          api.checkoutGuestPaymentInformationManagementV1.checkoutGuestPaymentInformationManagementV1SavePaymentInformationAndPlaceOrderPost({

            cartId: cartId,
            $body : {
              email        : email,
              paymentMethod: {
                poNumber      : null,
                method        : paymentMethodCode,
                additionalData: null,
              }
            }

          }).then((data: any) => {

            console.log('Place order: ', data.obj);
            this._cart.reset();
            resolve(data.obj);
            alert('Order placed!');

          });
        });
      });
    });

  }

  getMethods(): Promise<Array<PaymentMethod>> {

    return new Promise(resolve => {
      this._cart.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {
          api.quoteGuestPaymentMethodManagementV1.quoteGuestPaymentMethodManagementV1GetListGet({
            cartId: cartId,
          }).then((data: any) => {

            console.log('Available Payment Methods: ', data.obj);
            this.availableMethods = data.obj;
            resolve(this.availableMethods);

          });
        });
      });
    });

  }
}

