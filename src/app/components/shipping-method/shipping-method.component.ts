import {Component, OnInit} from 'angular2/core';
import {ShippingService} from '../../services/shipping.service';

@Component({
  selector   : 'shipping-method',
  templateUrl: 'app/components/shipping-method/shipping-method.component.html',
})
export class ShippingMethodComponent implements OnInit {

  constructor(public shipping: ShippingService) {
  }

  ngOnInit() {
    // Todo: Only call the following when having a shipping address in quote
    // this.shipping.getShippingMethodsByCart();
  }
}
