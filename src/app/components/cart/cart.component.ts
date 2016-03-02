import {Component, OnInit, Input, ChangeDetectorRef} from 'angular2/core';
import {Cart} from '../../model/cart';

declare var $: any;


@Component({
  selector   : 'cart',
  templateUrl: 'app/components/cart/cart.component.html',
})
export class CartComponent implements OnInit {
  title = 'Cart';

  constructor(public cart: Cart, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cart.refresh(false);
    this.cart.refreshEvent.subscribe(() => this.show());
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
