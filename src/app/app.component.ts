import { Subscription } from 'rxjs';
// Angular
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// Layout
import { LayoutConfigService, SplashScreenService, TranslationService } from './core/_base/layout';
// language list
import { locale as enLang } from './core/_config/i18n/en';
import { locale as chLang } from './core/_config/i18n/ch';
import { locale as esLang } from './core/_config/i18n/es';
import { locale as jpLang } from './core/_config/i18n/jp';
import { locale as deLang } from './core/_config/i18n/de';
import { locale as frLang } from './core/_config/i18n/fr';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { MatDialog } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SesionCaducadaComponent } from './sesion-caducada/sesion-caducada.component';
import { environment } from '../environments/environment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[kt-root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
	// Public properties
	title = 'Metronic';
	loader: boolean;
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	idleState = 'STARTED';
	messageState='INICIA TIMER IDLE'
	timedOut = false;
	lastPing?: Date = null;
	


	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 */
	constructor(private translationService: TranslationService,
				         private router: Router,
				         private layoutConfigService: LayoutConfigService,
				         private splashScreenService: SplashScreenService,
						 private idle: Idle, private keepalive: Keepalive,private dialog: MatDialog,) {

		// register translations
		this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);
		
		// sets an idle timeout of 5 seconds, for testing purposes.
		idle.setIdle(environment.idleTime);
		// sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
		idle.setTimeout(environment.idleTimeOut);
		// sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
		idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
	
		

		idle.onIdleStart.subscribe(() =>{
			this.idleState = 'IDLE';
			console.log("====>>>onIdleStart");
			this.loadSessionTimeout();
		} );

		
	
		// sets the ping interval to 15 seconds
		keepalive.interval(15);
	
		keepalive.onPing.subscribe(() => this.lastPing = new Date());
	
		//this.reset();
	}

	reset() {
		this.idle.watch();
		this.idleState = 'Started.';
		this.timedOut = false;
	}

	loadSessionTimeout() {
		  
		  const dialogRef = this.dialog.open(SesionCaducadaComponent, {
			width: '500px',
			height: 'auto',
			data: {message:"HA SUPERADO SU TIEMPO DE INACTIVIDAD", timeOut:environment.idleTimeOut}
		  });
		  dialogRef.afterClosed().subscribe(r => {
			
		  });
	  }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		// enable/disable loader
		this.loader = this.layoutConfigService.getConfig('loader.enabled');

		const routerSubscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				// hide splash screen
				this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);

				// to display back the body content
				setTimeout(() => {
					document.body.classList.add('kt-page--loaded');
				}, 500);
			}
		});
		this.unsubscribe.push(routerSubscription);
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}
