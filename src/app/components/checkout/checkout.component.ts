import {Component, OnInit, Input, ChangeDetectorRef} from 'angular2/core';
import {Cart} from '../../model/cart';
import {MagentoService} from '../../services/magento.service';
import {ShippingMethodComponent} from '../shipping-method/shipping-method.component';
import {ShippingAddressComponent} from '../shipping-address/shipping-address.component';
import {PaymentMethodComponent} from '../payment-method/payment-method.component';
import {CartComponent} from '../cart/cart.component';

@Component({
  selector   : 'checkout',
  templateUrl: 'app/components/checkout/checkout.component.html',
  directives : [CartComponent, ShippingAddressComponent, ShippingMethodComponent, PaymentMethodComponent],
})
export class CheckoutComponent implements OnInit {
  constructor(public cart: Cart, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }
}
