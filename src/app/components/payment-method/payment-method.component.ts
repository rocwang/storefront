import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {Payment} from '../../model/payment';

@Component({
  selector   : 'payment-method',
  templateUrl: 'app/components/payment-method/payment-method.component.html',
})
export class PaymentMethodComponent implements OnInit {

  constructor(public payment: Payment, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.payment.getMethods().then(() => {
      this._changeDetectorRef.detectChanges();
    });
  }
}
