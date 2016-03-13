import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
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

@Component({
  selector   : 'nav',
  templateUrl: 'app/components/nav/nav.component.html',
  styleUrls: ['app/components/nav/nav.component.css'],
  directives : [ROUTER_DIRECTIVES],
})
export class NavComponent implements OnInit {
  private _timeoutHandle: number;

  constructor(public cart: CartService, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cart.refreshEvent.subscribe(() => this.showSummary());

    $('#nav-checkout').popup({
      position  : 'top center',
      transition: 'fade up',
    }).popup('show');
  }

  showSummary() {
    this._changeDetectorRef.detectChanges();

    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }

    $('#nav-checkout').popup('show');

    this._timeoutHandle = setTimeout(function() {
      $('#nav-checkout').popup('hide');
    }, 3000);
  }
}
