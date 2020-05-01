import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 're-portlet-body',
  templateUrl: './portlet-body.component.html',
  styleUrls: ['./portlet-body.component.scss']
})
export class PortletBodyComponent implements OnInit {

  // Public properties
	@HostBinding('class') classList = 'kt-portlet__body';
	@Input() class: string;

  constructor() { }

  ngOnInit() {
    if (this.class) {
			this.classList += ' ' + this.class;
		}
  }

}
