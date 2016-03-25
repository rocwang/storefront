import {Component, OnInit, ChangeDetectorRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CartService} from '../../services/cart.service';

@Component({
  selector   : 'nav',
  templateUrl: 'app/components/nav/nav.component.html',
  styleUrls  : ['app/components/nav/nav.component.css'],
  directives : [ROUTER_DIRECTIVES],
})
export class NavComponent implements OnInit {
  private _timeoutHandle: number;

  constructor(public cart: CartService, public router: Router, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cart.refreshEvent.subscribe(() => this.showSummary());

    $('#nav-checkout').popup({
      position  : 'top center',
      transition: 'fade up',
    }).popup('show');
  }

  showSummary() {
    this._changeDetectorRef.detectChanges();

    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }

    $('#nav-checkout').popup('show');

    this._timeoutHandle = setTimeout(function () {
      $('#nav-checkout').popup('hide');
    }, 3000);
  }
}
