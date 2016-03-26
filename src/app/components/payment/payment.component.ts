import {Component, OnInit} from 'angular2/core';
import {PaymentService} from '../../services/payment.service';
import {ShippingService} from '../../services/shipping.service';

@Component({
  selector   : 'payment',
  templateUrl: 'app/components/payment/payment.component.html',
  styleUrls  : ['app/components/payment/payment.component.css'],
})
export class PaymentComponent implements OnInit {

  constructor(public payment: PaymentService, public shipping: ShippingService) {
  }

  ngOnInit() {
    if (!this.payment.availableMethods.length) {
      this.payment.loadMethods();
    }
  }

  save() {
    setTimeout(() => this.payment.save(), 100);
  }
}
