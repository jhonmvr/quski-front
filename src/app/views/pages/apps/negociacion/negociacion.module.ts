
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// Auth
import { ModuleGuard } from '../../../../core/auth';

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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';

// Component
import { NegociacionComponent } from './negociacion.component';
import { PartialsModule } from '../../../partials/partials.module';
import { GestionNegociacionComponent } from './gestion-negociacion/gestion-negociacion.component';
import { ErrorCargaInicialComponent } from '../../../../views/partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { VerCotizacionesComponent } from '../../../../views/partials/custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { BandejaOperacionesProcesoComponent } from './bandeja-operaciones-proceso/bandeja-operaciones-proceso.component';
import { ListaExcepcionesComponent } from '../../../../views/partials/custom/popups/lista-excepciones/lista-excepciones.component';
import { ReasignarUsuarioComponent } from '../../../../views/partials/custom/popups/reasignar-usuario/reasignar-usuario.component';
import { DetalleNegociacionComponent } from './detalle-negociacion/detalle-negociacion.component';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { CreditoNuevoModule } from '../credito-nuevo/credito-nuevo.module';

const routes: Routes = [
	{
		path: '',
		component: NegociacionComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'bandeja-operaciones',
				pathMatch: 'full'
			},{
				path: 'gestion-negociacion',
				component: GestionNegociacionComponent
			},{
				path: 'detalle-negociacion/:id',
				component: DetalleNegociacionComponent
			},{
				path: 'bandeja-operaciones',
				component: BandejaOperacionesProcesoComponent
			},
			{
				path: 'gestion-negociacion/:origen/:id',
				component: GestionNegociacionComponent
			}

		]
	}
];


@NgModule({
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
		GestionNegociacionComponent,
		NegociacionComponent,
		BandejaOperacionesProcesoComponent,
		DetalleNegociacionComponent
	],
	entryComponents: [	
		ErrorCargaInicialComponent,
		VerCotizacionesComponent,
		ListaExcepcionesComponent,
		ReasignarUsuarioComponent
	]
})
export class NegociacionModule { }
