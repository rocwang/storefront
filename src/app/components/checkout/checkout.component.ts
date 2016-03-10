import {Component, OnInit, Input, ChangeDetectorRef} from 'angular2/core';
import {Cart} from '../../model/cart';
import {MagentoService} from '../../services/magento.service';

@Component({
  selector   : 'checkout',
  templateUrl: 'app/components/checkout/checkout.component.html',

})
export class CheckoutComponent implements OnInit {
  constructor(public cart: Cart, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    //this.cart.refresh(false);
  }
}
