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
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MatStepperModule,
	MatDialogRef,
} from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxPermissionsModule } from 'ngx-permissions';
// Component
import { CrearRenovacionComponent } from './crear-renovacion/crear-renovacion.component';
import { NovacionComponent } from './novacion.component';
import { PartialsModule } from '../../../partials/partials.module';
import { ErrorCargaInicialComponent } from '../../../../views/partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { ListaExcepcionesComponent } from '../../../../views/partials/custom/popups/lista-excepciones/lista-excepciones.component';
import { ReasignarUsuarioComponent } from '../../../../views/partials/custom/popups/reasignar-usuario/reasignar-usuario.component';
const routes: Routes = [
	{
		path: '',
		component: NovacionComponent,
		children: [
			{
				path: '',
				redirectTo: 'crear-novacion',
				pathMatch: 'full'
			},
			{
				path: 'crear-novacion/:numeroOperacion',
				component: CrearRenovacionComponent
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
		MatRadioModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		MatButtonToggleModule,
		MatProgressBarModule,
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
		CrearRenovacionComponent,
		NovacionComponent
	],
	entryComponents: [	
		ErrorCargaInicialComponent,
		ListaExcepcionesComponent,
		ReasignarUsuarioComponent
	]
})
export class NovacionModule { }
