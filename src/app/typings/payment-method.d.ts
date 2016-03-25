import {RadioButtonState} from 'angular2/common';

export interface PaymentMethod {
  code: string;
  title: string;
  state: RadioButtonState;
}
