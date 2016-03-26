import {Component, OnInit} from 'angular2/core';
import {ShippingComponent} from '../shipping/shipping.component';
import {PaymentComponent} from '../payment/payment.component';
import {CartComponent} from '../cart/cart.component';
import {ShippingService} from '../../services/shipping.service';
import {PaymentService} from '../../services/payment.service';
import {CartService} from '../../services/cart.service';

@Component({
  selector   : 'checkout',
  templateUrl: 'app/components/checkout/checkout.component.html',
  styleUrls  : ['app/components/checkout/checkout.component.css'],
  directives : [CartComponent, ShippingComponent, PaymentComponent],
})
export class CheckoutComponent implements OnInit {
  constructor(public shipping: ShippingService, public payment: PaymentService, public cart: CartService) {
  }

  ngOnInit() {
  }
}
