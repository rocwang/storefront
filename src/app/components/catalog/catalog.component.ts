import {Component, ChangeDetectorRef, OnInit, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';
import {MagentoService} from '../../services/magento.service';
import {Product} from '../../product';
import {Cart} from '../../model/cart';

@Component({
  selector   : 'catalog',
  templateUrl: 'app/components/catalog/catalog.component.html',
})
export class CatalogComponent implements OnInit {
  products: Product[];
  title = 'Catalog';

  constructor(private _router: Router,
              private _magento: MagentoService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _cart: Cart) {
  }

  ngOnInit() {
    this.getProducts();
  }

  add(product: Product) {
    if (!product.isAdding) {
      product.isAdding = true;
      this._cart.add(product).then(() => {
        product.isAdding = false;
      });
    }
  }

  getProducts() {
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

        this.products = data.obj.items;

        this._changeDetectorRef.detectChanges();
      });

    });
  }
}
