import { Component, OnInit, Input, HostBinding, ViewChild, ElementRef, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { StickyDirective } from '../../../../../core/_base/layout';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 're-portlet-header',
  templateUrl: './portlet-header.component.html',
  styleUrls: ['./portlet-header.component.scss']
})
export class PortletHeaderComponent implements OnInit {

  // Public properties
	// append html class to the portlet header
	@Input() class: string;
	// a simple title text
	@Input() title: string;
	// icon name to be added to the i tag
	@Input() icon: string;
	// remove title container
	@Input() noTitle: boolean;
	// enable sticky portlet header
	@Input() sticky: boolean;
  // enable loading to display
  @HostBinding('class') classes = 'kt-portlet__head';
	@HostBinding('attr.ktSticky') stickyDirective: StickyDirective;

	@ViewChild('refIcon', {static: true}) refIcon: ElementRef;
	hideIcon: boolean;

	@ViewChild('refTools', {static: true}) refTools: ElementRef;
  hideTools: boolean;

  
  private lastScrollTop = 0;
	//private subscriptions: Subscription[] = [];
	private isScrollDown = false;

  constructor(private el: ElementRef, @Inject(PLATFORM_ID) private platformId: string) { 
    this.stickyDirective = new StickyDirective(this.el, this.platformId);
  }

  ngOnInit() {
    if (this.sticky) {
			this.stickyDirective.ngOnInit();
		}
  }

  ngAfterViewInit(): void {
		// append custom class
		this.classes += this.class ? ' ' + this.class : '';

		// hide icon's parent node if no icon provided
		this.hideIcon = this.refIcon.nativeElement.children.length === 0;

		// hide tools' parent node if no tools template is provided
		this.hideTools = this.refTools.nativeElement.children.length === 0;

		if (this.sticky) {
			this.updateStickyPosition();
			this.stickyDirective.ngAfterViewInit();
		}

		

  }
  
  ngOnDestroy(): void {
		//this.subscriptions.forEach(sb => sb.unsubscribe());
		if (this.sticky) {
			this.stickyDirective.ngOnDestroy();
		}
	}

  @HostListener('window:resize', ['$event'])
	onResize() {
		this.updateStickyPosition();
	}

	@HostListener('window:scroll', ['$event'])
	onScroll() {
		this.updateStickyPosition();
		const st = window.pageYOffset || document.documentElement.scrollTop;
		this.isScrollDown = st > this.lastScrollTop;
		this.lastScrollTop = st <= 0 ? 0 : st;
	}

	updateStickyPosition() {
		if (this.sticky) {
			Promise.resolve(null).then(() => {
				// get boundary top margin for sticky header
				const headerElement = document.querySelector('.kt-header') as HTMLElement;
				const subheaderElement = document.querySelector('.kt-subheader') as HTMLElement;
				const headerMobileElement = document.querySelector('.kt-header-mobile') as HTMLElement;

				let height = 0;

				if (headerElement != null) {
					// mobile header
					if (window.getComputedStyle(headerElement).height === '0px') {
						height += headerMobileElement.offsetHeight;
					} else {
						// desktop header
						if (document.body.classList.contains('kt-header--minimize-topbar')) {
							// hardcoded minimized header height
							height = 60;
						} else {
							// normal fixed header
							if (document.body.classList.contains('kt-header--fixed')) {
								height += headerElement.offsetHeight;
							}
							if (document.body.classList.contains('kt-subheader--fixed')) {
								height += subheaderElement.offsetHeight;
							}
						}
					}
				}

				this.stickyDirective.marginTop = height;
			});
		}
	}

}
