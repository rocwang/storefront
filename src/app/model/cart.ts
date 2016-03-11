import {Injectable, EventEmitter} from 'angular2/core';
import {MagentoService} from '../services/magento.service';
import {Product} from './product';

@Injectable()
export class Cart {
  refreshEvent: EventEmitter<any> = new EventEmitter();
  isRefreshing = false;

  base_currency_code: string;
  base_discount_amount: number;
  base_grand_total: number;
  base_shipping_amount: number;
  base_shipping_discount_amount: number;
  base_shipping_incl_tax: number;
  base_shipping_tax_amount: number;
  base_subtotal: number;
  base_subtotal_with_discount: number;
  base_tax_amount: number;
  discount_amount: number;
  grand_total: number;
  items: Array<any> = [];
  items_qty: number;
  quote_currency_code: string;
  shipping_amount: number;
  shipping_discount_amount: number;
  shipping_incl_tax: number;
  shipping_tax_amount: number;
  subtotal: number;
  subtotal_incl_tax: number;
  subtotal_with_discount: number;
  tax_amount: number;
  total_segments: Array<any> = [];
  weee_tax_applied_amount: number;

  constructor(private _magento: MagentoService) {
    this.refresh(false);
  }

  getCardId(): Promise<string> {
    var cartId = localStorage.getItem('cartId');

    if (cartId) {

      return Promise.resolve(cartId);

    } else {

      return new Promise<string>(resolve => {
        this._magento.getSwaggerClient().then(api => {
          api.quoteGuestCartManagementV1.quoteGuestCartManagementV1CreateEmptyCartPost().then((data: any) => {
            console.log('Cart Id:', data);
            var cartId = data.data.replace(/"/g, '');
            localStorage.setItem('cartId', cartId);
            resolve(cartId);
          });
        });
      });
    }
  }

  add(product: Product) {
    product.isAdding = true;

    return new Promise(resolve => {

      this.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {
          api.quoteGuestCartItemRepositoryV1.quoteGuestCartItemRepositoryV1SavePost({
            cartId: cartId,
            $body : {
              'cartItem': {
                'quote_id': cartId,
                'sku'     : product.sku,
                'qty'     : 1,
              }
            }
          }).then((data: any) => {
            console.log('Add to cart: ', data.obj);
            product.isAdding = false;
            resolve();
          });
        });
      });

    });
  }

  // Refresh cart
  refresh(triggerEvent: boolean) {
    this.isRefreshing = true;
    return new Promise(resolve => {

      this.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {

          api.quoteGuestCartTotalRepositoryV1.quoteGuestCartTotalRepositoryV1GetGet({
            cartId: cartId,
          }).then((data: any) => {
            console.log('Cart:', data.obj);

            for (var key in data.obj) {
              this[key] = data.obj[key];
            }

            if (triggerEvent) {
              this.refreshEvent.emit(null);
            }

            this.isRefreshing = false;

            resolve();

          });
        });
      });

    });
  }
}
