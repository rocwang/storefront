import {Component, ChangeDetectorRef} from 'angular2/core';
import {MagentoService} from '../../services/magento.service';

@Component({
  selector   : 'me',
  templateUrl: 'app/components/me/me.component.html',

})
export class MeComponent {
  constructor(private _magento: MagentoService,
              private _changeDetectorRef: ChangeDetectorRef) {
  }
}
