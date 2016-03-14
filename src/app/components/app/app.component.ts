import {Component, ViewChild, ChangeDetectorRef} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {CatalogComponent} from '../catalog/catalog.component';
import {MagentoService} from '../../services/magento.service';
import {CartComponent} from '../cart/cart.component';
import {CartService} from '../../services/cart.service';
import {CheckoutComponent} from '../checkout/checkout.component';
import {MeComponent} from '../me/me.component';
import {CatalogService} from '../../services/catalog.service';
import {FeaturedComponent} from '../featured/featured.component';
import {FeaturedService} from '../../services/featured.service';
import {NavComponent} from '../nav/navigation.component';
import {ShippingService} from '../../services/shipping.service';
import {PaymentService} from '../../services/payment.service';

declare var Elevator: any;

@Component({
  selector   : 'app',
  templateUrl: 'app/components/app/app.component.html',
  styleUrls  : ['app/components/app/app.component.css'],
  directives : [ROUTER_DIRECTIVES, CartComponent, NavComponent],
  providers  : [
    ROUTER_PROVIDERS,
    MagentoService,
    CartService,
    ChangeDetectorRef,
    CatalogService,
    FeaturedService,
    ShippingService,
    PaymentService,
    HTTP_PROVIDERS,
  ],
})
@RouteConfig([
  {path: '/featured', name: 'Featured', component: FeaturedComponent, useAsDefault: true},
  {path: '/catalog', name: 'Catalog', component: CatalogComponent},
  {path: '/checkout', name: 'Checkout', component: CheckoutComponent},
  {path: '/me', name: 'Me', component: MeComponent},
])
export class AppComponent {
  name = 'Storefront';

  @ViewChild(CartComponent)
  private _cartComponent: CartComponent;


  constructor(private _router: Router, private _magento: MagentoService) {
  }

  toggleCart() {
    this._cartComponent.toggle();
  }

  backToTop() {

    // Simple elevator usage.
    var elevator = new Elevator({
      mainAudio: '/audio/elevator.mp3', // Music from http://www.bensound.com/
      endAudio : '/audio/ding.mp3'
    });
    elevator.elevate();

  }
}
