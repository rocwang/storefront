import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {Shipping} from '../../model/shipping';

@Component({
  selector   : 'shipping-address',
  templateUrl: 'app/components/shipping-address/shipping-address.component.html',
})
export class ShippingAddressComponent implements OnInit {

  constructor(public shipping: Shipping, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }
}
