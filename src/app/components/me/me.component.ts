import {Component, ChangeDetectorRef} from 'angular2/core';

@Component({
  selector: 'me',
  templateUrl: 'app/components/me/me.component.html',
})
export class MeComponent {
  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }
}
