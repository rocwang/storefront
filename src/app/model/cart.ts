import {Injectable, EventEmitter} from 'angular2/core';
import {MagentoService} from '../services/magento.service';
import {Product} from './../typings/product';
import {Totals} from '../typings/totals';

@Injectable()
export class Cart {
  private _STORAGE_KEY = 'cart-id';

  refreshEvent: EventEmitter<any> = new EventEmitter();
  isRefreshing = false;
  totals: Totals;

  constructor(private _magento: MagentoService) {
    this.refresh();
  }

  reset() {
      localStorage.removeItem(this._STORAGE_KEY);
      this.refresh();
  }

  getCardId(): Promise<string> {
    var cartId = localStorage.getItem(this._STORAGE_KEY);

    if (cartId) {

      return Promise.resolve(cartId);

    } else {

      return new Promise<string>(resolve => {
        this._magento.getSwaggerClient().then(api => {
          api.quoteGuestCartManagementV1.quoteGuestCartManagementV1CreateEmptyCartPost().then((data: any) => {
            console.log('Cart Id:', data);
            var cartId = data.data.replace(/"/g, '');
            localStorage.setItem(this._STORAGE_KEY, cartId);
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
  refresh(triggerEvent = false) {
    this.isRefreshing = true;
    return new Promise(resolve => {

      this.getCardId().then(cartId => {
        this._magento.getSwaggerClient().then(api => {

          api.quoteGuestCartTotalRepositoryV1.quoteGuestCartTotalRepositoryV1GetGet({
            cartId: cartId,
          }).then((data: any) => {
            console.log('Cart:', data.obj);

            this.totals = data.obj;

            if (triggerEvent) {
              this.refreshEvent.emit(null);
            }

            this.isRefreshing = false;

            resolve(this.totals);

          });
        });
      });

    });
  }
}
