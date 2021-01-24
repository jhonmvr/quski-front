import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// Auth
import { ModuleGuard } from '../../../../core/auth';
// Material
import {
	MatSliderModule,
	MatInputModule,
	MatFormFieldModule,
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';

// Component
import { ExcepcionesClienteComponent } from './excepciones-cliente/excepciones-cliente.component';
import { ExcepcionesCoberturaComponent } from './excepciones-cobertura/excepciones-cobertura.component';
import { ExcepcionesRiesgoComponent } from './excepciones-riesgo/excepciones-riesgo.component';
import { PartialsModule } from '../../../partials/partials.module';
import { ExcepcionesComponent } from './excepciones.component';
import { ErrorCargaInicialComponent } from '../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { CreditoNuevoModule } from '../credito-nuevo/credito-nuevo.module';

const routes: Routes = [
	{
		path: '',
		component: ExcepcionesComponent,
		children: [
			{
				path: '',
				redirectTo: 'excepciones',
				pathMatch: 'full'
			},
			{
				path: 'excepciones',
				component: ExcepcionesComponent
			},
			{
				path: 'excepcion-cliente/:id',
				component: ExcepcionesClienteComponent
			},
			{
				path: 'excepcion-cobertura/:id',
				component: ExcepcionesCoberturaComponent
			},
			{
				path: 'excepcion-riesgo/:id',
				component: ExcepcionesRiesgoComponent
			}
		]
	}
];
@NgModule({
	imports: [CreditoNuevoModule,

		CommonModule,
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
		MatSliderModule,
		MatFormFieldModule,
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
	declarations: [
		ExcepcionesComponent,
		ExcepcionesClienteComponent,
		ExcepcionesCoberturaComponent,
		ExcepcionesRiesgoComponent,
	],
	entryComponents: [
		ErrorCargaInicialComponent,




	]
})
export class ExcepcionesModule { }
