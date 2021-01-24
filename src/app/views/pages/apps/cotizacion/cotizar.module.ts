// Angular
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
import { CotizarComponent } from './cotizar.component';
import { ListCotizarComponent } from './list-cotizar/list-cotizar.component';
import { DetalleCotizacionComponent } from './detalle-cotizacion/detalle-cotizacion.component';
import { AddFotoComponent } from '../../../../views/partials/custom/fotos/add-foto/add-foto.component';
import { PartialsModule } from '../../../partials/partials.module';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { CreditoNuevoModule } from '../credito-nuevo/credito-nuevo.module';

const routes: Routes = [
	{
		path: '',
		component: CotizarComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'lista-cotizacion',
				pathMatch: 'full'
			},
			{
				path: 'lista-cotizacion',
				component: ListCotizarComponent
			},
			{
				path: 'lista-cotizacion/:id',
				component: ListCotizarComponent
			},
			{
				path: 'detalle-cotizacion',
				component: DetalleCotizacionComponent
			},
			{
				path: 'detalle-cotizacion/:id',
				component: DetalleCotizacionComponent
			}
		]
	}
];


@NgModule({
	imports: [CreditoNuevoModule,

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
		PartialsModule,
	],
	providers: [
		ModuleGuard,
		
		{provide: DateAdapter, useClass: PickDateAdapter},
		{provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
		DatePipe,
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
		CotizarComponent,
		ListCotizarComponent,
		DetalleCotizacionComponent,
	],
	entryComponents: [
		AddFotoComponent,
	]
})
export class CotizarModule { }
