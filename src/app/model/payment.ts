import {Injectable} from 'angular2/core';
import {MagentoService} from '../services/magento.service';
import {Cart} from './cart';
import {PaymentMethod} from '../typings/payment-method';

@Injectable()
export class Payment {
  code: string;
  title: string;
  availableMethods: Array<PaymentMethod>;

  constructor(private _magento: MagentoService, private _cart: Cart) {
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
}

