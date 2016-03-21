import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {ShippingMethodComponent} from '../shipping-method/shipping-method.component';
import {ShippingAddressComponent} from '../shipping-address/shipping-address.component';
import {PaymentMethodComponent} from '../payment-method/payment-method.component';
import {CartComponent} from '../cart/cart.component';

@Component({
  selector   : 'checkout',
  templateUrl: 'app/components/checkout/checkout.component.html',
  styleUrls  : ['app/components/checkout/checkout.component.css'],
  directives : [CartComponent, ShippingAddressComponent, ShippingMethodComponent, PaymentMethodComponent],
})
export class CheckoutComponent implements OnInit {
  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }
}
