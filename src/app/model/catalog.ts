import {Injectable} from 'angular2/core';
import {MagentoService} from '../services/magento.service';
import {Product} from './../typings/product';

@Injectable()
export class Catalog {
  private _items: Array<any>;

  constructor(private _magento: MagentoService) {
  }

  getItems(): Promise<Array<Product>> {

    if (this._items) {

      return Promise.resolve(this._items);

    } else {

      return new Promise(resolve => {
        this._magento.getSwaggerClient().then(api => {

          api.catalogProductRepositoryV1.catalogProductRepositoryV1GetListGet({
            'searchCriteria[filter_groups][0][filters][0][field]'         : 'visibility',
            'searchCriteria[filter_groups][0][filters][0][value]'         : '4',
            'searchCriteria[filter_groups][0][filters][0][condition_type]': 'equal',
            'searchCriteria[pageSize]'                                    : 24,
            'searchCriteria[currentPage]'                                 : 1,
          }).then((data: any) => {
            console.log('Products:', data.obj);

            // Find the product image
            data.obj.items.forEach((product: any) => {
              product.custom_attributes.forEach((attr: any) => {
                if (attr.attribute_code === 'small_image') {
                  product.imgSrc = this._magento.baseUrl + 'media/catalog/product' + attr.value;
                }
              });

              product.isAdding = false;
            });

            this._items = data.obj.items;
            resolve(this._items);

          });

        });
      });

    }
  }
}
