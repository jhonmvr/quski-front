// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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
import { DevolucionComponent } from './devolucion.component';
import { SolicitudDevolucionComponent } from './solicitud-devolucion/solicitud-devolucion.component';
import { PartialsModule } from '../../../../views/partials/partials.module';
import { SeleccionFechaComponent } from './seleccion-fecha/seleccion-fecha.component';
import { ListaPendientesComponent } from './lista-pendientes/lista-pendientes.component';
import { AprobacionSolicitudComponent } from './aprobacion-solicitud/aprobacion-solicitud.component';
import { EntregaRecepcionComponent } from './entrega-recepcion/entrega-recepcion.component';
import { DetalleDevolucionComponent } from './detalle-devolucion/detalle-devolucion.component';
import { CancelacionSolicitudDevolucionComponent } from './cancelacion-solicitud-devolucion/cancelacion-solicitud-devolucion.component';
import { AprobacionCancelacionComponent } from './aprobacion-cancelacion/aprobacion-cancelacion.component';
import { VerificacionFirmaComponent } from './verificacion-firma/verificacion-firma.component';

import { ModuleGuard } from '../../../../../app/core/auth';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ReporteEntregaGarantiaComponent } from './reporte-entrega-garantia/reporte-entrega-garantia.component';

const routes: Routes = [
	{
		path: '',
		component: DevolucionComponent,
		children: [
			{
				path: '',
				redirectTo: 'pendientes-arribo',
				pathMatch: 'full'
			},{
				path: 'solicitud-devolucion/:cod/:item',
				component: SolicitudDevolucionComponent
			},
			{
				path: 'aprobar-solicitud-devolucion/:item',
				component: AprobacionSolicitudComponent
			},
			{
				path: 'set-arribo',
				component: SeleccionFechaComponent,
				canActivate: [ModuleGuard],
			},
			{
				path: 'lista-pendientes',
				component: ListaPendientesComponent
			},
			{
				path: 'entrega-recepcion/:item',
				component: EntregaRecepcionComponent
			},
			{
				path: 'detalle-devolucion/:item',
				component: DetalleDevolucionComponent
			},
			{
				path: 'cancelacion-solicitud/:item',
				component: CancelacionSolicitudDevolucionComponent
			},
			{
				path: 'aprobacion-cancelacion-solicitud/:item',
				component: AprobacionCancelacionComponent
			},	
			{
				path: 'verificacion-firmas/:item',
				component: VerificacionFirmaComponent
			},	
			{
				path: 'reporte-entrega/:item',
				component: ReporteEntregaGarantiaComponent
			},	
			{
				path: 'reporte-entrega',
				component: ReporteEntregaGarantiaComponent
			}
		]
	}
];

@NgModule({
  declarations: [SolicitudDevolucionComponent, DevolucionComponent, SeleccionFechaComponent, ListaPendientesComponent, AprobacionSolicitudComponent, ListaPendientesComponent, EntregaRecepcionComponent, DetalleDevolucionComponent, CancelacionSolicitudDevolucionComponent, AprobacionCancelacionComponent, VerificacionFirmaComponent, ReporteEntregaGarantiaComponent],
  imports: [
    CommonModule,MatTableExporterModule,
		RouterModule.forChild(routes),
		PartialsModule,
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
  
  entryComponents: []
})
export class DevolucionModule { }
