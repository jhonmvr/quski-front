// Angular
import { NgModule } from '@angular/core';
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
import {CotizarModule} from './apps/cotizacion/cotizar.module';


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
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		//MailModule,
		//ECommerceModule,
		ClienteModule,
<<<<<<< HEAD
		TrackingModule,
=======
		CotizarModule,
>>>>>>> 6660b688b4dc9efd5dd8135362d76ff5304a706d
		UserManagementModule,
	],
	providers: []
})
export class PagesModule {
}
