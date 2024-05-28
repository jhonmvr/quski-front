
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
	MatTreeModule,
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
import { ListaExcepcionesComponent } from '../../../partials/custom/secciones-generales/lista-excepciones/lista-excepciones.component';
import { ReasignarUsuarioComponent } from '../../../../views/partials/custom/popups/reasignar-usuario/reasignar-usuario.component';
import { DetalleNegociacionComponent } from './detalle-negociacion/detalle-negociacion.component';
import { PickDateAdapter, PICK_FORMATS } from '../../../../../app/core/util/pick-date-adapter';
import { MatTableExporterModule } from 'mat-table-exporter';
import { BandejaProcesoGerenciaComponent } from './bandeja-proceso-gerencia/bandeja-proceso-gerencia.component';
import { GenerarCreditoComponent } from './generar-credito/generar-credito.component';
import { NovacionHabilitanteComponent } from './novacion-habilitante/novacion-habilitante.component';
import { GestionClienteComponent } from './gestion-cliente/gestion-cliente.component';
import { DialogCargarHabilitanteComponent } from './gestion-cliente/dialog-cargar-habilitante/dialog-cargar-habilitante.component';
import { PopUpNacimientoComponent } from './gestion-cliente/pop-up-nacimiento/pop-up-nacimiento.component';
import { CrearRenovacionComponent } from './crear-renovacion/crear-renovacion.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { DetalleBloqueoComponent } from './detalle-bloqueo/detalle-bloqueo.component';
import { DialogCargarAutorizacionComponent } from './gestion-negociacion/dialog-cargar-autorizacion/dialog-cargar-autorizacion.component';
import { ExcepcionOperativaListComponent } from './excepcion-operativa-list/excepcion-operativa-list.component';
import { AprobadorExcepcionOperativaComponent } from './excepcion-operativa-list/aprobador-excepcion-operativa/aprobador-excepcion-operativa.component';
import { AprobacionFabricaComponent } from './excepcion-operativa-list/aprobacion-fabrica/aprobacion-fabrica.component';
import { BandejaRegularizacionDocumentosComponent } from './bandeja-regularizacion-documentos/bandeja-regularizacion-documentos.component';
import { AprodadorRegularizacionDocumentosComponent } from './bandeja-regularizacion-documentos/aprodador-regularizacion-documentos/aprodador-regularizacion-documentos.component';
import { DetalleRegularizacionDocumentosComponent } from './bandeja-regularizacion-documentos/detalle-regularizacion-documentos/detalle-regularizacion-documentos.component';
import { ComprobanteDesembolsoComponent } from './generar-credito/comprobante-desembolso/comprobante-desembolso.component';

const routes: Routes = [
	{
		path: '',
		component: NegociacionComponent,
		canActivate: [ModuleGuard],
		data: { moduleName: ['gestion-negociacion','bandeja-operaciones','crear-novacion'] },
		children: [
			{
				path: '',
				redirectTo: 'bandeja-operaciones',
				pathMatch: 'full'
			},
			{
				path: 'gestion-negociacion',
				component: GestionNegociacionComponent
			},
			{
				path: 'detalle-negociacion/:id',
				component: DetalleNegociacionComponent
			},
			{
				path: 'bandeja-operaciones',
				component: BandejaOperacionesProcesoComponent
			},
			{
				path: 'bandeja-administracion',
				component: BandejaProcesoGerenciaComponent,
			},
			{
				path: 'gestion-negociacion/:origen/:id',
				component: GestionNegociacionComponent
			},
			{
				path: 'bandeja-operaciones/:item',
				component: BandejaOperacionesProcesoComponent
			},
			{
				path: 'generar-credito',
				component: GenerarCreditoComponent
			},
			{
				path: 'generar-credito/:id',
				component: GenerarCreditoComponent
			},
			{
				path: 'novacion-habilitante/:idNegociacion',
				component: NovacionHabilitanteComponent
			},
			{
				path: 'gestion-cliente/:origen/:item',     // Ejem:  /NEG/130
				component: GestionClienteComponent		   // Ejem:  /CED/1760451987
			},
			{
				path: 'crear-novacion/:codigo/:item',
				component: CrearRenovacionComponent
			},
			{
				path: 'pago/detalle-bloqueo/:id',
				component: DetalleBloqueoComponent
			},
			{
				path: 'pago/detalle-pago/:id',
				component: DetallePagoComponent
			},
			{
				path: 'excepcion-operativa/list',
				component: ExcepcionOperativaListComponent
			},
			{
				path: 'excepcion-operativa/list/aprobador/:id',
				component: AprobadorExcepcionOperativaComponent
			},
			{
				path: 'excepcion-operativa/list/aprobadorFabrica/:id',
				component: AprobacionFabricaComponent
			},
			{
				path: 'regularizacion-documentos/list',
				component: BandejaRegularizacionDocumentosComponent
			},
			{
				path: 'regularizacion-documentos/list/detalle/:id',
				component: DetalleRegularizacionDocumentosComponent
			},
			{
				path: 'regularizacion-documentos/list/aprobador/:id',
				component: AprodadorRegularizacionDocumentosComponent
			},
			




		]
	}
];


@NgModule({
	imports: [
		MatTableExporterModule,
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
		MatTreeModule
	],
	providers: [
		ModuleGuard,

		{ provide: DateAdapter, useClass: PickDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
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
		DetalleNegociacionComponent,
		BandejaProcesoGerenciaComponent,
		GenerarCreditoComponent,
		NovacionHabilitanteComponent,
		GestionClienteComponent,
		DialogCargarHabilitanteComponent,
		PopUpNacimientoComponent,
		CrearRenovacionComponent,
		DetallePagoComponent,
		DetalleBloqueoComponent,
		DialogCargarAutorizacionComponent,
  ExcepcionOperativaListComponent,
  AprobadorExcepcionOperativaComponent,
  AprobacionFabricaComponent,
  BandejaRegularizacionDocumentosComponent,
  AprodadorRegularizacionDocumentosComponent,
  DetalleRegularizacionDocumentosComponent,
  ComprobanteDesembolsoComponent
	],
	entryComponents: [
		ErrorCargaInicialComponent,
		VerCotizacionesComponent,
		ListaExcepcionesComponent,
		ReasignarUsuarioComponent,
		DialogCargarHabilitanteComponent,
		PopUpNacimientoComponent,
		DialogCargarAutorizacionComponent
	]
})
export class NegociacionModule { }
