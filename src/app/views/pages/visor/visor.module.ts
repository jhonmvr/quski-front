import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// Auth
import { AuthGuard, ModuleGuard } from '../../../core/auth';
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

import { PartialsModule } from '../../partials/partials.module';
import { VisorComponent } from './visor.component';
import { ErrorCargaInicialComponent } from '../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { PickDateAdapter, PICK_FORMATS } from '../../../core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { VisorArchivosComponent } from './visor-archivos/visor-archivos.component';
import { CoreModule } from '../../../../app/core/core.module';

const routes: Routes = [
	{
		path: '',
		component: VisorComponent,
		children: [
			{
				path: '',
				redirectTo: 'archivo',
				pathMatch: 'full'
			},
			{
				path: 'archivo/:item',
				component: VisorArchivosComponent
			},
		]
	}
];
@NgModule({
	imports: [
		MatTableExporterModule,
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
		PartialsModule,
		CoreModule
	],
	providers: [
		AuthGuard,
		
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
		VisorComponent,
		VisorArchivosComponent
	],
	entryComponents: [
		ErrorCargaInicialComponent,




	]
})
export class VisorModule { }
