import {Component, OnInit, ViewChild} from 'angular2/core';
import {Router} from 'angular2/router';
import {MagentoService} from '../../services/magento.service';
import {Product} from '../../model/product';
import {Cart} from '../../model/cart';
import {Catalog} from '../../model/catalog';

@Component({
  selector   : 'catalog',
  templateUrl: 'app/components/catalog/catalog.component.html',
})
export class CatalogComponent implements OnInit {
  products: Product[];
  title = 'Catalog';

  constructor(private catalog: Catalog,
              private _cart: Cart) {
  }

  ngOnInit() {
    this.catalog.getItems().then((products: Array<Product>) => {
      this.products = products;
    });
  }

  add(product: Product) {
    if (!product.isAdding) {
      product.isAdding = true;
      this._cart.add(product).then(() => {
        product.isAdding = false;
      });
    }
  }
}
