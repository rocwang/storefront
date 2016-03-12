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
    $('#country').dropdown('set selected', this.shipping.selectedAddress.countryId);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.shipping.selectedAddress); }

  onCountryChange(e: Event) {
    console.log('on country change:', e);
    var value = (<HTMLInputElement> e.target).value;
    this.shipping.selectedAddress.countryId = value;
    $('#country').dropdown('set selected', value);
  }
}
