import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
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

declare var $: any;

@Component({
  selector   : 'nav',
  templateUrl: 'app/components/nav/nav.component.html',
  directives : [ROUTER_DIRECTIVES, CartComponent],
})
export class NavComponent implements OnInit {
  constructor(public cart: Cart, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cart.refreshEvent.subscribe(() => this.showSummary());
  }

  showSummary() {
    this._changeDetectorRef.detectChanges();

    $('#nav-checkout') .popup({
      closable  : true,
      position  : 'top center',
      transition: 'fade up'
    }).popup('show');
  }

  hideSummary() {
    $('#nav-checkout').popup('hide');
  }
}
