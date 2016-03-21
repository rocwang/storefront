import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {CartService} from '../../services/cart.service';

@Component({
  selector   : 'cart',
  templateUrl: 'app/components/cart/cart.component.html',
  styleUrls: ['app/components/cart/cart.component.css'],
})
export class CartComponent implements OnInit {

  constructor(public cart: CartService, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }
}
