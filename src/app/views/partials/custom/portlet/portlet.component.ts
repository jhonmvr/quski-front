import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { PortletHeaderComponent } from './portlet-header/portlet-header.component';
import { PortletBodyComponent } from './portlet-body/portlet-body.component';
import { PortletFooterComponent } from './portlet-footer/portlet-footer.component';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LayoutConfigService } from '../../../../core/_base/layout';
import { Observable } from 'rxjs/internal/Observable';


export interface PortletOptions {
	test?: any;
}


@Component({
  selector: 're-portlet',
  templateUrl: './portlet.component.html',
  styleUrls: ['./portlet.component.scss']
})
export class PortletComponent implements OnInit,AfterViewInit {

	
  	// portlet extra options
	@Input() options: PortletOptions;
	// portlet root classes
  @Input() class: string;
  @ViewChild('portlet', {static: true}) portlet: ElementRef;

	// portlet header component template
	@ViewChild(PortletHeaderComponent, {static: true}) header: PortletHeaderComponent;
	// portlet body component template
	@ViewChild(PortletBodyComponent, {static: true}) body: PortletBodyComponent;
	// portlet footer component template
	@ViewChild(PortletFooterComponent, {static: true}) footer: PortletFooterComponent;
	

  constructor(private el: ElementRef, public loader: LoadingBarService) {
      this.loader.complete();
     }

  ngOnInit() {
  }
  /**
	 * After view init
	 */
	ngAfterViewInit() {
	}

}
