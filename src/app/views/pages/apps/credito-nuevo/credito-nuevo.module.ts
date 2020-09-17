// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// Auth


// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MatStepperModule,
	MatDialogRef,
	MatButtonToggleGroup,
} from '@angular/material';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';


// Component
import { CreditoNuevoComponent } from './credito-nuevo.component';


import { PartialsModule } from '../../../partials/partials.module';
import { GenerarCreditoComponent } from './generar-credito/generar-credito.component';
import { GestionCreditoComponent } from './gestion-credito/gestion-credito.component';
import { ListCreditoComponent } from './list-credito/list-credito.component';
import { RegistrarPagoComponent } from './gestion-credito/registrar-pago/registrar-pago.component';
import { RegistarPagoDialogComponent } from './gestion-credito/registrar-pago/registar-pago-dialog/registar-pago-dialog';
import { BloquearCreditoComponent } from './gestion-credito/bloquear-credito/bloquear-credito.component';
import { DialogoBloquearCreditoComponent } from './gestion-credito/bloquear-credito/dialogo-bloquear-credito/dialogo-bloquear-credito.component';
import { AprobarBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/aprobar-bloqueo-fondos.component';
import { DialogoBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/dialogo-bloqueo-fondos/dialogo-bloqueo-fondos.component';
import { AprobarPagosComponent } from './gestion-credito/aprobar-pagos/aprobar-pagos.component';
import { DialogoAprobarPagosComponent } from './gestion-credito/aprobar-pagos/dialogo-aprobar-pagos/dialogo-aprobar-pagos.component';



const routes: Routes = [
	{
		path: '',
		component: CreditoNuevoComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'generar-credito',
				pathMatch: 'full'
			},
			{
				path: 'generar-credito',
				component: GenerarCreditoComponent
			},

			{
				path: 'lista-credito',
				component: ListCreditoComponent
			},
			{
				path: 'gestion-credito',
				component: GestionCreditoComponent
			},
			{
				path: 'gestion-credito/registrar-pago',
				component: RegistrarPagoComponent
			},
			{
				path: 'gestion-credito/bloquear-credito',
				component: BloquearCreditoComponent
			},
			{
				path: 'gestion-credito/aprobar-bloqueo-fondos',
				component: AprobarBloqueoFondosComponent
			},
			{
				path: 'gestion-credito/aprobar-pagos',
				component: AprobarPagosComponent
			},
		]
	}
];
@NgModule({
  declarations: [CreditoNuevoComponent,
	RegistarPagoDialogComponent,
	 GenerarCreditoComponent, 
	 GestionCreditoComponent,
	  ListCreditoComponent,
	  RegistrarPagoComponent,
	  BloquearCreditoComponent,
	  DialogoBloquearCreditoComponent,
	  AprobarBloqueoFondosComponent,
	  DialogoBloqueoFondosComponent,
	  AprobarPagosComponent,
	  DialogoAprobarPagosComponent],
  
  imports: [
	CommonModule,
	RouterModule.forChild(routes),
	MatDialogModule,
	CommonModule,
	NgxPermissionsModule.forChild(),
	RouterModule.forChild(routes),
	FormsModule,
	ReactiveFormsModule,
	TranslateModule.forChild(),
	MatButtonModule,
	MatMenuModule,
	MatSelectModule,
	MatInputModule,
	MatTableModule,
	MatAutocompleteModule,
	MatRadioModule,
	MatIconModule,
	MatNativeDateModule,
	MatProgressBarModule,
	MatDatepickerModule,
	MatCardModule,
	MatPaginatorModule,
	MatSortModule,
	MatCheckboxModule,
	MatProgressSpinnerModule,
	MatSnackBarModule,
	MatTabsModule,
	MatTooltipModule,
	MatButtonToggleModule,
	NgbProgressbarModule,
	
	MatStepperModule,
	PartialsModule
],
providers:[

], 

entryComponents: [RegistarPagoDialogComponent, DialogoBloquearCreditoComponent,DialogoBloqueoFondosComponent,DialogoAprobarPagosComponent]
})


export class CreditoNuevoModule { }
