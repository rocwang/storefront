import {Component, ChangeDetectorRef} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {CatalogComponent} from '../catalog/catalog.component';
import {MagentoService} from '../../services/magento.service';
import {CartComponent} from '../cart/cart.component';

@Component({
  selector: 'app',
  templateUrl: 'app/components/app/app.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    MagentoService,
    ChangeDetectorRef,
    CartComponent,
  ]
})
@RouteConfig([
  {
    path: '/catalog',
    name: 'Catalog',
    component: CatalogComponent,
    useAsDefault: true,
  },
])
export class AppComponent {
  title = 'Storefront';

  constructor(private _router: Router, private _magento: MagentoService) {
  }
}
