import {Component, OnInit} from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {ShippingService} from '../../services/shipping.service';

declare var Card: any;

@Component({
  selector   : 'payment',
  templateUrl: 'app/components/payment/payment.component.html',
  styleUrls  : ['app/components/payment/payment.component.css'],
})
export class PaymentComponent implements OnInit {

  card: any;

  constructor(public payment: PaymentService, public shipping: ShippingService) {
  }

  ngOnInit() {
    if (!this.payment.availableMethods.length) {
      this.payment.loadMethods();
    }

    this.payment.orderPlacedEvent.subscribe(() => {
      $('#order-placed').modal('show');
    });

    this.initializeCard();
  }

  save() {
    setTimeout(() => this.payment.save(), 300);
  }

  initializeCard() {

    // Clear the container, this way is much faster than ".innerHTML = ''".
    // See http://stackoverflow.com/a/3955238
    var cardContainer = document.getElementById('cc_card');
    while (cardContainer.firstChild) {
      cardContainer.removeChild(cardContainer.firstChild);
    }

    this.card = new Card({
      // a selector or DOM element for the form where users will
      // be entering their information
      form     : '#cc_form', // *required*
      // a selector or DOM element for the container
      // where you want the card to appear
      container: '#cc_card', // *required*

      formSelectors: {
        numberInput: '#cc_number', // optional — default input[name="number"]
        expiryInput: '#cc_exp_month, #cc_exp_year', // optional — default input[name="expiry"]
        cvcInput   : '#cc_cid', // optional — default input[name="cvc"]
        nameInput  : '#cc_name' // optional - defaults input[name="name"]
      },

      width     : 357, // optional — default 350px
      formatting: true, // optional - default true

      // Strings for translation - optional
      messages: {
        validDate: 'EXPIRE\nEND OF', // optional - default 'valid\nthru'
        monthYear: 'mm/yyyy', // optional - default 'month/year'
      },

      // Default placeholders for rendered fields - optional
      placeholders: {
        number: '•••• •••• •••• ••••',
        name  : 'Jhon Doe',
        expiry: '••/••••',
        cvc   : '•••'
      },

      // if true, will log helpful messages for setting up Card
      debug: false // optional - default false
    });
  }
}
