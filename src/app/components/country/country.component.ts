import {Component, OnInit, Input, Output, ElementRef, EventEmitter} from 'angular2/core';

@Component({
  selector   : 'country',
  templateUrl: 'app/components/country/country.component.html',
})
export class CountryComponent implements OnInit {
  @Input() countryId: string;
  @Output() countryIdChange = new EventEmitter();

  $element: JQuery;

  constructor(private _elementRef: ElementRef) {
  }

  ngOnInit() {
    this.$element = $(this._elementRef.nativeElement).find('.ui.dropdown');

    this.$element.dropdown('set selected', this.countryId);
    this.$element.dropdown({
      onChange: (value: string, text: string, $choice: JQuery) => {
        this.countryIdChange.emit(value);
      }
    });
  }
}
