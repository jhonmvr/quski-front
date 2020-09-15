
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

const routes: Routes = [
	{
		path: '',
		component: NegociacionComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'gestion-negociacion',
				pathMatch: 'full'
			},{
				path: 'gestion-negociacion',
				component: GestionNegociacionComponent
			},
			{
				path: 'gestion-negociacion/:id',
				component: GestionNegociacionComponent
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
		GestionNegociacionComponent
	],
	entryComponents: [	
		ErrorCargaInicialComponent,
		VerCotizacionesComponent

	]
})
export class NegociacionModule { }
