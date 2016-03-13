import {Component, OnInit, Input, ChangeDetectorRef} from 'angular2/core';
import {Cart} from '../../model/cart';

@Component({
  selector   : 'cart',
  templateUrl: 'app/components/cart/cart.component.html',
  styleUrls: ['app/components/cart/cart.component.css'],
})
export class CartComponent implements OnInit {

  constructor(public cart: Cart, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    // this.cart.refreshEvent.subscribe(() => this.show());
  }

  show() {
    this._changeDetectorRef.detectChanges();
    $('.ui.sidebar')
      .sidebar('setting', 'transition', 'push')
      .sidebar('setting', 'mobileTransition', 'push')
      .sidebar('show');
  }

  toggle() {
    $('.ui.sidebar')
      .sidebar('setting', 'transition', 'push')
      .sidebar('setting', 'mobileTransition', 'push')
      .sidebar('toggle');
  }
}
