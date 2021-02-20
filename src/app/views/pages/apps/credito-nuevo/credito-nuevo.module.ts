// Angular
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
	DateAdapter,
	MAT_DATE_FORMATS,
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
import { BloquearCreditoComponent } from './gestion-credito/bloquear-credito/bloquear-credito.component';
import { DialogoBloquearCreditoComponent } from './gestion-credito/bloquear-credito/dialogo-bloquear-credito/dialogo-bloquear-credito.component';
import { AprobarBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/aprobar-bloqueo-fondos.component';
import { AprobarPagosComponent } from './gestion-credito/aprobar-pagos/aprobar-pagos.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { DialogoAprobarBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/dialogo-aprobar-bloqueo-fondos/dialogo-aprobar-bloqueo-fondos.component';
import { DialogoRechazarBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/dialogo-rechazar-bloqueo-fondos/dialogo-rechazar-bloqueo-fondos.component';
import { DetalleCreditoComponent } from './detalle-credito/detalle-credito.component';
import { DialogoBloqueoFondosComponent } from './gestion-credito/aprobar-bloqueo-fondos/dialogo-bloqueo-fondos/dialogo-bloqueo-fondos.component';
import { ModuleGuard } from '../../../../../app/core/auth';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';



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
				path: 'registrar-pago/:item',
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
	 GenerarCreditoComponent, 
	 GestionCreditoComponent,
	  ListCreditoComponent,
	  RegistrarPagoComponent,
	  BloquearCreditoComponent,
	  DialogoBloquearCreditoComponent,
	  AprobarBloqueoFondosComponent,
	  AprobarPagosComponent,
	  UploadFileComponent,
	  DialogoAprobarBloqueoFondosComponent,
	  DialogoRechazarBloqueoFondosComponent,
	  DetalleCreditoComponent,
	  DialogoBloqueoFondosComponent,
	],
  imports: [
	CommonModule,MatTableExporterModule,
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
providers: [
	ModuleGuard,
	
	{provide: DateAdapter, useClass: PickDateAdapter},
	{provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
	{ provide: MatDialogRef, useValue: {} },
	{
		provide: MAT_DIALOG_DEFAULT_OPTIONS,
		useValue: {
			hasBackdrop: true,
			panelClass: 'kt-mat-dialog-container__wrapper',
			height: 'auto',
			width: '900px'
		}
	},
],
exports:[],
entryComponents: [
	DialogoBloquearCreditoComponent,
	DialogoBloqueoFondosComponent,
	DialogoAprobarBloqueoFondosComponent,
	DialogoRechazarBloqueoFondosComponent,
	UploadFileComponent,
]
})


export class CreditoNuevoModule { }
