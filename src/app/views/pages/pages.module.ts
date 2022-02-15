// Angular
import { InjectionToken, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';

import { UserManagementModule } from './user-management/user-management.module';

import { ClienteModule } from './apps/cliente/cliente.module';
import { TrackingModule } from './apps/tracking/tracking.module';
import { CotizarModule } from './apps/cotizacion/cotizar.module';
import { CreditoNuevoModule } from './apps/credito-nuevo/credito-nuevo.module';
import { NegociacionModule } from './apps/negociacion/negociacion.module';
import { VisorModule } from './visor/visor.module';
import { AprobadorModule } from './apps/aprobador/aprobador.module';
import { NovacionModule } from './apps/novacion/novacion.module';


const DEFAULT_CURRENCY_CODE: InjectionToken<string> = new InjectionToken<string>('USD');
const RELATIVE_DATE_FORMATS = {
	parse: {
		dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
	},
	display: {
		// dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
		dateInput: 'input',
		monthYearLabel: { year: 'numeric', month: 'short' },
		dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
		monthYearA11yLabel: { year: 'numeric', month: 'long' }
	}
};

@NgModule({
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		CreditoNuevoModule,
		//MailModule,
		//ECommerceModule,
		ClienteModule,
		TrackingModule,
		CotizarModule,
		NegociacionModule,
		VisorModule,
		UserManagementModule,
		AprobadorModule,
		NovacionModule
	],
	providers: [
		{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD '},
	]
})
export class PagesModule {
}
