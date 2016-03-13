import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {PaymentService} from '../../services/payment.service';

@Component({
  selector   : 'payment-method',
  templateUrl: 'app/components/payment-method/payment-method.component.html',
})
export class PaymentMethodComponent implements OnInit {

  constructor(public payment: PaymentService, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.payment.getMethods().then(() => {
      this._changeDetectorRef.detectChanges();
    });
  }
}
