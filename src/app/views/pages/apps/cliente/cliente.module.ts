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
	MatTreeModule,
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
import { ClienteComponent } from './cliente.component';
import { ListClienteComponent } from './list-cliente/list-cliente.component';
import { AddFotoComponent } from '../../../../views/partials/custom/fotos/add-foto/add-foto.component';
import { PartialsModule } from '../../../partials/partials.module';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DialogHabilitanteClienteComponent } from './list-cliente/dialog-habilitante-cliente/dialog-habilitante-cliente.component';

const routes: Routes = [
	{
		path: '',
		component: ClienteComponent,
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'lista-cliente',
				pathMatch: 'full'
			},
			{
				path: 'lista-cliente',
				component: ListClienteComponent,
				canActivate: [ModuleGuard],
			},
			{
				path: 'lista-cliente/:id',
				component: ListClienteComponent
			},
			{
				path: 'gestion-cliente',
				redirectTo: 'lista-cliente',
				pathMatch: 'full'
			}
		]
	}
];


@NgModule({
	imports: [
	CommonModule,MatTableExporterModule,
    	RouterModule.forChild(routes),
    	MatDialogModule,
    	CommonModule,
		MatTreeModule,
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
		MatTreeModule,
		PartialsModule,
		MatStepperModule,
		PartialsModule
  ],
  providers:[
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
    ClienteComponent,
    ListClienteComponent,
    DialogHabilitanteClienteComponent,
    

  ],
  entryComponents: [
	AddFotoComponent,
	DialogHabilitanteClienteComponent
  ]
})
export class ClienteModule {}
