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
import { CreditoNuevoModule } from './credito-nuevo/credito-nuevo.module';
import { CreditoNuevoComponent } from './credito-nuevo/credito-nuevo.component';

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
		CreditoNuevoModule,
		//MailModule,
		//ECommerceModule,
		ClienteModule,
		UserManagementModule,
	],
	providers: []
})
export class PagesModule {
}
