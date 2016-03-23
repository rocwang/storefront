import {Component, OnInit} from 'angular2/core';
import {PaymentService} from '../../services/payment.service';

@Component({
  selector   : 'payment',
  templateUrl: 'app/components/payment/payment.component.html',
})
export class PaymentComponent implements OnInit {

  constructor(public payment: PaymentService) {
  }

  ngOnInit() {
    this.payment.getMethods();
  }
}
