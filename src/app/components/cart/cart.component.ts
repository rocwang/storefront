import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {PaymentService} from '../../services/payment.service';

@Component({
  selector   : 'cart',
  templateUrl: 'app/components/cart/cart.component.html',
  styleUrls  : ['app/components/cart/cart.component.css'],
})
export class CartComponent implements OnInit {

  constructor(public cart: CartService, public payment: PaymentService) {
  }

  ngOnInit() {
  }
}
