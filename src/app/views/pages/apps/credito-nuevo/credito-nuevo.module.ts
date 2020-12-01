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
import { AprobarPagosComponent } from './gestion-credito/aprobar-pagos/aprobar-pagos.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { DialogoAprobarPagosComponent } from './gestion-credito/aprobar-pagos/dialogo-aprobar-pagos/dialogo-aprobar-pagos.component';
import { DialogoRechazarPagosComponent } from './gestion-credito/aprobar-pagos/dialogo-rechazar-pagos/dialogo-rechazar-pagos.component';
import { DialogoAprobarBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/dialogo-aprobar-bloqueo-fondos/dialogo-aprobar-bloqueo-fondos.component';
import { DialogoRechazarBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/dialogo-rechazar-bloqueo-fondos/dialogo-rechazar-bloqueo-fondos.component';
import { DetalleCreditoComponent } from './detalle-credito/detalle-credito.component';



const routes: Routes = [
	{
		path: '',
		component: CreditoNuevoComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'lista-credito',
				pathMatch: 'full'
			},
			{
				path: 'generar-credito',
				component: GenerarCreditoComponent
			},
			{
				path: 'generar-credito/:id',
				component: GenerarCreditoComponent
			},
			{
				path: 'detalle-credito/:numeroOperacion',
				component: DetalleCreditoComponent
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
				path: 'gestion-credito/aprobar-bloqueo-fondos/:id',
				component: AprobarBloqueoFondosComponent
			},
			/*{
				path: 'gestion-credito/aprobar-pagos',
				component: AprobarPagosComponent
			},*/
			{
				path: 'gestion-credito/aprobar-pagos/:id',
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
	  AprobarPagosComponent,
	  DialogoAprobarPagosComponent,
	  UploadFileComponent,
	  DialogoRechazarPagosComponent,
	  DialogoAprobarBloqueoFondosComponent,
	  DialogoRechazarBloqueoFondosComponent,
	  DetalleCreditoComponent
	],
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

entryComponents: [RegistarPagoDialogComponent, DialogoBloquearCreditoComponent,DialogoAprobarBloqueoFondosComponent,DialogoRechazarBloqueoFondosComponent,
	DialogoAprobarPagosComponent, UploadFileComponent,DialogoRechazarPagosComponent]
})


export class CreditoNuevoModule { }
