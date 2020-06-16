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
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';

// Component
import { ClienteComponent } from './cliente.component';
import { ListClienteComponent } from './list-cliente/list-cliente.component';
import { GestionClienteComponent } from './gestion-cliente/gestion-cliente.component';
import { AddFotoComponent } from '../../../../views/partials/custom/fotos/add-foto/add-foto.component';
import {PartialsModule} from '../../../partials/partials.module';
import { DialogCargarHabilitanteComponent } from './gestion-cliente/dialog-cargar-habilitante/dialog-cargar-habilitante.component'
const routes: Routes = [
	{
		path: '',
		component: ClienteComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'lista-cliente',
				pathMatch: 'full'
			},
			{
				path: 'lista-cliente',
				component: ListClienteComponent
			},
			{
				path: 'gestion-cliente',
				component: GestionClienteComponent
			},
			{
				path: 'gestion-cliente/:id',
				component: GestionClienteComponent
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
  providers:[
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
    ClienteComponent,
    ListClienteComponent,
    GestionClienteComponent,
    DialogCargarHabilitanteComponent,
  ],
  entryComponents: [
	AddFotoComponent,
	DialogCargarHabilitanteComponent
  ]
})
export class ClienteModule {}
