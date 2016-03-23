import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {ShippingComponent} from '../shipping/shipping.component';
import {PaymentComponent} from '../payment/payment.component';
import {CartComponent} from '../cart/cart.component';

@Component({
  selector   : 'checkout',
  templateUrl: 'app/components/checkout/checkout.component.html',
  styleUrls  : ['app/components/checkout/checkout.component.css'],
  directives : [CartComponent, ShippingComponent, PaymentComponent],
})
export class CheckoutComponent implements OnInit {
  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }
}
