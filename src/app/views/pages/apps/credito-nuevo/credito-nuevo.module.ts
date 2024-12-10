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
import { ListCreditoComponent } from './list-credito/list-credito.component';
import { RegistrarPagoComponent } from './registrar-pago/registrar-pago.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { DetalleCreditoComponent } from './detalle-credito/detalle-credito.component';
import { ModuleGuard } from '../../../../../app/core/auth';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { VentanaPrecancelacionComponent } from '../../../partials/custom/popups/ventana-precancelacion/ventana-precancelacion.component';
import { BloquearCreditoComponent } from './bloquear-credito/bloquear-credito.component';
import { AprobacionCompromisoPagoComponent } from '../aprobador/aprobacion-compromiso-pago/aprobacion-compromiso-pago.component';
import { AprobadorModule } from '../aprobador/aprobador.module';



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
				path: 'detalle-credito/:numeroOperacion',
				component: DetalleCreditoComponent
			},

			{
				path: 'lista-credito',
				component: ListCreditoComponent
			},
			{
				path: 'registrar-pago/:item',
				component: RegistrarPagoComponent
			},
			{
				path: 'gestion-credito/bloquear-credito',
				component: BloquearCreditoComponent
			},
		]
	}
];

@NgModule({
  declarations: [CreditoNuevoComponent,
	  ListCreditoComponent,
	  RegistrarPagoComponent,
	  UploadFileComponent,
	  DetalleCreditoComponent,
	  BloquearCreditoComponent
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
	PartialsModule,
	AprobadorModule
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
	UploadFileComponent,
	VentanaPrecancelacionComponent
]
})


export class CreditoNuevoModule { }
