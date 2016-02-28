import {Component, ChangeDetectorRef, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {MagentoService} from '../../services/magento.service';
import {Product} from '../../product';
import {CartComponent} from '../cart/cart.component';

@Component({
  selector: 'catalog',
  templateUrl: 'app/components/catalog/catalog.component.html',
  directives: [CartComponent],
})
export class CatalogComponent implements OnInit {
  products: Product[];
  title = 'Catalog';

  constructor(private _router: Router,
              private _magento: MagentoService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _cart: CartComponent) {
  }

  ngOnInit() {
    this.getProducts();
  }

  addToCart(product: Product) {
    product.isAdding = true;
    this._cart.add(product).then(() => {
      product.isAdding = false;
    });
  }

  getProducts() {
    this._magento.getSwaggerClient().then(api => {

      api.catalogProductRepositoryV1.catalogProductRepositoryV1GetListGet({
        'searchCriteria[filter_groups][0][filters][0][field]': 'visibility',
        'searchCriteria[filter_groups][0][filters][0][value]': '4',
        'searchCriteria[filter_groups][0][filters][0][condition_type]': 'like',
        'searchCriteria[pageSize]': 24,
        'searchCriteria[currentPage]': 1,
      }).then(data => {
        console.log('Products:', data.obj);

        // Find the product image
        data.obj.items.forEach(function (product) {
          product.custom_attributes.forEach(function (attr) {
            if (attr.attribute_code === 'small_image') {
              product.imgSrc = 'http://m2.dev/media/catalog/product' + attr.value;
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
