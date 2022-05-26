import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { RouterModule, Routes } from '@angular/router';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../../../../app/views/partials/partials.module';
import { ModuleGuard } from '../../../../../app/core/auth';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { AddFotoComponent } from '../../../../../app/views/partials/custom/fotos/add-foto/add-foto.component';
import { TevcolComponent } from './tevcol.component';
import { EnvioGarantiasComponent } from './envio-garantias/envio-garantias.component';
import { PendienteEnvioComponent } from './pendiente-envio/pendiente-envio.component';
import { RecepcionEnvioComponent } from './recepcion-envio/recepcion-envio.component';
const routes: Routes = [
	{
		path: '',
		component: TevcolComponent,
		// data: { moduleName: 'ecommerce' },
		children: [
			
			{
				path: 'envio-garantias',
				component: EnvioGarantiasComponent
			},
			{
				path: 'pendiente-envio',
				component: PendienteEnvioComponent
			},
			{
				path: 'recepcion-envio',
				component: RecepcionEnvioComponent
			}
		]
	}
];
@NgModule({
	imports: [
	CommonModule,
  MatTableExporterModule,
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
   
  TevcolComponent,
   
  EnvioGarantiasComponent,
   
  PendienteEnvioComponent,
   
  RecepcionEnvioComponent],
  entryComponents: [
	AddFotoComponent
  ]
})
export class TevcolModule { }
