import {RadioButtonState} from '@angular/common';

export interface PaymentMethod {
  code: string;
  title: string;
  state: RadioButtonState;
}
