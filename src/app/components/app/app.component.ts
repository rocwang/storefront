import {Component, ViewChild, ChangeDetectorRef} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {CatalogComponent} from '../catalog/catalog.component';
import {MagentoService} from '../../services/magento.service';
import {CartComponent} from '../cart/cart.component';
import {Cart} from '../../model/cart';
import {CheckoutComponent} from '../checkout/checkout.component';
import {MeComponent} from '../me/me.component';

@Component({
  selector   : 'body',
  templateUrl: 'app/components/app/app.component.html',
  directives : [ROUTER_DIRECTIVES, CartComponent],
  providers  : [
    ROUTER_PROVIDERS,
    MagentoService,
    Cart,
    ChangeDetectorRef,
  ]
})
@RouteConfig([
  {
    path        : '/catalog',
    name        : 'Catalog',
    component   : CatalogComponent,
    useAsDefault: true,
  },
  {
    path     : '/checkout',
    name     : 'Checkout',
    component: CheckoutComponent,
  },
  {
    path     : '/me',
    name     : 'Me',
    component: MeComponent,
  },
])
export class AppComponent {
  title = 'Storefront';

  @ViewChild(CartComponent)
  private _cartComponent: CartComponent;


  constructor(private _router: Router, private _magento: MagentoService) {
  }

  toggleCart() {
    this._cartComponent.toggle();
  }
}
