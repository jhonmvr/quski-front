import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 're-portlet-footer',
  templateUrl: './portlet-footer.component.html',
  styleUrls: ['./portlet-footer.component.scss']
})
export class PortletFooterComponent implements OnInit {

  // Public properties
	@HostBinding('class') classList = 'kt-portlet__foot';
	@Input() class: string;

  constructor() { }

  ngOnInit() {
    if (this.class) {
			this.classList += ' ' + this.class;
		}
  }

}
