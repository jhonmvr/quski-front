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

const routes: Routes = [
	{
		path: '',
		component: DevolucionComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'solicitud-devolucion',
				pathMatch: 'full'
			},{
				path: 'solicitud-devolucion',
				component: SolicitudDevolucionComponent
			},
			{
				path: 'aprobar-solicitud-devolucion',
				component: AprobacionSolicitudComponent
			},
			{
				path: 'aprobar-solicitud-devolucion/:idDevolucion',
				component: AprobacionSolicitudComponent
			},
			{
				path: 'set-arribo',
				component: SeleccionFechaComponent
			},
			{
				path: 'pendientes-arribo',
				component: ListaPendientesComponent
			},

			{
				path: 'entrega-recepcion',
				component: EntregaRecepcionComponent
			},
			{
				path: 'entrega-recepcion/:idDevolucion',
				component: EntregaRecepcionComponent
			},
			
			{
				path: 'detalle-devolucion/:idDevolucion',
				component: DetalleDevolucionComponent
			},
			{
				path: 'detalle-devolucion',
				component: DetalleDevolucionComponent
			},

			{
				path: 'cancelacion-solicitud',
				component: CancelacionSolicitudDevolucionComponent
			},
			{
				path: 'cancelacion-solicitud/:idDevolucion',
				component: CancelacionSolicitudDevolucionComponent
			},
			{
				path: 'aprobacion-cancelacion-solicitud/:idDevolucion',
				component: AprobacionCancelacionComponent
			},	{
				path: 'aprobacion-cancelacion-solicitud',
				component: AprobacionCancelacionComponent
			},
			{
				path: 'verificacion-firmas/:idDevolucion',
				component: VerificacionFirmaComponent
			},	{
				path: 'verificacion-firmas',
				component: VerificacionFirmaComponent
			},


		

		]
	}
];

@NgModule({
  declarations: [SolicitudDevolucionComponent, DevolucionComponent, SeleccionFechaComponent, ListaPendientesComponent, AprobacionSolicitudComponent, ListaPendientesComponent, EntregaRecepcionComponent, DetalleDevolucionComponent, CancelacionSolicitudDevolucionComponent, AprobacionCancelacionComponent, VerificacionFirmaComponent],
  imports: [
    CommonModule,
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
  providers:[

  ], 
  
  entryComponents: []
})
export class DevolucionModule { }
