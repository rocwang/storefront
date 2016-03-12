import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {Shipping} from '../../model/shipping';

@Component({
  selector   : 'shipping-method',
  templateUrl: 'app/components/shipping-method/shipping-method.component.html',
})
export class ShippingMethodComponent implements OnInit {

  constructor(public shipping: Shipping, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.shipping.getShippingMethodsByCart().then(() => {
      this._changeDetectorRef.detectChanges();
    });
  }
}
