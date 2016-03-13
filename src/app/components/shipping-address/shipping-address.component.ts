import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {ShippingService} from '../../services/shipping.service';
import {CountryComponent} from '../country/country.component';

@Component({
  selector   : 'shipping-address',
  templateUrl: 'app/components/shipping-address/shipping-address.component.html',
  directives : [CountryComponent],
})
export class ShippingAddressComponent implements OnInit {

  constructor(public shipping: ShippingService, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  getShippingMethods() {
    this.shipping.getShippingMethodsByAddr();
  }
}
