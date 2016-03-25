import {Component, OnInit} from 'angular2/core';
import {ShippingService} from '../../services/shipping.service';
import {CountryComponent} from '../country/country.component';

@Component({
  selector   : 'shipping',
  templateUrl: 'app/components/shipping/shipping.component.html',
  styleUrls  : ['app/components/shipping/shipping.component.css'],
  directives : [CountryComponent],
})
export class ShippingComponent implements OnInit {

  constructor(public shipping: ShippingService) {
  }

  ngOnInit() {
    this.shipping.getShippingMethodsByAddr();
  }
}
