import {Component, ViewChild, ChangeDetectorRef} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {CatalogComponent} from '../catalog/catalog.component';
import {MagentoService} from '../../services/magento.service';
import {CartComponent} from '../cart/cart.component';
import {Cart} from '../../model/cart';
import {CheckoutComponent} from '../checkout/checkout.component';
import {MeComponent} from '../me/me.component';
import {Catalog} from '../../model/catalog';
import {FeaturedComponent} from '../featured/featured.component';
import {Featured} from '../../model/featured';
import {NavComponent} from '../nav/navigation.component';
import {Shipping} from '../../model/shipping';
import {Payment} from '../../model/payment';

@Component({
  selector   : 'app',
  templateUrl: 'app/components/app/app.component.html',
  styleUrls: ['app/components/app/app.component.css'],
  directives : [ROUTER_DIRECTIVES, CartComponent, NavComponent],
  providers  : [
    ROUTER_PROVIDERS,
    MagentoService,
    Cart,
    ChangeDetectorRef,
    Catalog,
    Featured,
    Shipping,
    Payment,
  ],
})
@RouteConfig([
  {path: '/featured', name: 'Featured', component: FeaturedComponent, useAsDefault: true},
  {path: '/catalog', name: 'Catalog', component: CatalogComponent},
  {path: '/checkout', name: 'Checkout', component: CheckoutComponent},
  {path: '/me', name: 'Me', component: MeComponent},
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
