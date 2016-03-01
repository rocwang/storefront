import {Component, ChangeDetectorRef} from 'angular2/core';
import {MagentoService} from '../../services/magento.service';

@Component({
  selector   : 'checkout',
  templateUrl: 'app/components/checkout/checkout.component.html',

})
export class CheckoutComponent {
  constructor(private _magento: MagentoService,
              private _changeDetectorRef: ChangeDetectorRef) {
  }
}
