

// Angular
import { RouterModule } from '@angular/router';
import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatTabsModule,
	MatTooltipModule,
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatTreeModule,
	MatListModule
} from '@angular/material';
// NgBootstrap
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Core module
import { CoreModule } from '../../core/core.module';
// CRUD Partials
import {
	ActionNotificationComponent,
	AlertComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
	ContextMenu2Component,
	ContextMenuComponent,
	LanguageSelectorComponent,
	NotificationComponent,
	QuickActionComponent,
	QuickPanelComponent,
	ScrollTopComponent,
	SearchDefaultComponent,
	SearchDropdownComponent,
	SearchResultComponent,
	SplashScreenComponent,
	StickyToolbarComponent,
	Subheader1Component,
	Subheader2Component,
	Subheader3Component,
	Subheader4Component,
	Subheader5Component,
	SubheaderSearchComponent,
	UserProfile2Component,
	UserProfile3Component,
	UserProfileComponent,
} from './layout';
// General
import { NoticeComponent } from './custom/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
// Errpr
import { ErrorComponent } from './content/general/error/error.component';
// Extra module
import { WidgetModule } from './content/widgets/widget.module';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
import { CartComponent } from './layout/topbar/cart/cart.component';

import { TranslateModule } from '@ngx-translate/core';

import { ArchivoComponent } from './custom/archivo/archivo.component';
import { AddFotoComponent } from './custom/fotos/add-foto/add-foto.component';
import { ArchivoUploadDialogComponent } from './custom/archivo/archivo-upload-dialog/archivo-upload-dialog.component';
import { CargarFotoDialogComponent } from './custom/fotos/cargar-foto-dialog/cargar-foto-dialog.component';
import { SolicitudAutorizacionDialogComponent } from './custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';

import { WebcamModule } from 'ngx-webcam';
import { ReMessageComponent } from './custom/re-message/re-message.component';

import { PortletComponent } from './custom/portlet/portlet.component';
import { PortletHeaderComponent } from './custom/portlet/portlet-header/portlet-header.component';
import { PortletBodyComponent } from './custom/portlet/portlet-body/portlet-body.component';
import { PortletFooterComponent } from './custom/portlet/portlet-footer/portlet-footer.component';

import { AuthDialogComponent } from './custom/auth-dialog/auth-dialog.component';
import { HabilitanteComponent } from './custom/habilitante/habilitante.component';
import { HabilitanteDialogComponent } from './custom/habilitante/habilitante-dialog/habilitante-dialog.component';
import { MensajeExcepcionComponent } from './custom/popups/mensaje-excepcion-component/mensaje-excepcion-component';
import { ErrorCargaInicialComponent } from './custom/popups/error-carga-inicial/error-carga-inicial.component';
import { VerCotizacionesComponent } from './custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { DetallesComponent } from './custom/popups/ver-cotizaciones/detalles/detalles.component';
import { TablaDetalleCreditoComponent } from './custom/secciones-generales/tabla-detalle-credito/tabla-detalle-credito.component';
import { TablaRiesgoAcumuladoComponent } from './custom/secciones-generales/tabla-riesgo-acumulado/tabla-riesgo-acumulado.component';
import { TablaTasacionComponent } from './custom/secciones-generales/tabla-tasacion/tabla-tasacion.component';
import { TablaVariablesCrediticiasComponent } from './custom/secciones-generales/tabla-variables-crediticias/tabla-variables-crediticias.component';
import { TablaOfertaCalculadoraComponent } from './custom/secciones-generales/tabla-oferta-calculadora/tabla-oferta-calculadora.component';
import { RiesgoAcumuladoComponent } from './custom/popups/riesgo-acumulado/riesgo-acumulado.component';

import { TablaOfertaCreditoComponent } from './custom/secciones-generales/tabla-oferta-credito/tabla-oferta-credito.component';
import { MensajeEdadComponent } from './custom/popups/mensaje-edad/mensaje-edad.component';
import { SolicitudDeExcepcionesComponent } from './custom/popups/solicitud-de-excepciones/solicitud-de-excepciones.component';
import { ListaExcepcionesComponent } from './custom/secciones-generales/lista-excepciones/lista-excepciones.component';
import { ReasignarUsuarioComponent } from './custom/popups/reasignar-usuario/reasignar-usuario.component';
import { ConfirmarAccionComponent } from './custom/popups/confirmar-accion/confirmar-accion.component';

import { AddFechaComponent } from './custom/add-fecha/add-fecha.component';
import { TablaAmortizacionComponent } from './custom/popups/tabla-amortizacion/tabla-amortizacion.component';
import { DevolucionCreditoComponent } from './custom/popups/devolucion-credito/devolucion-credito.component';
import { PopupPagoComponent } from './custom/popups/popup-pago/popup-pago.component';
import { SubirComprobanteComponent } from './custom/popups/popup-pago/subir-comprobante/subir-comprobante.component';
import { CreditoDialogComponent } from './custom/secciones-generales/credito-dialog/credito-dialog.component';
import { RelativeDatePipe } from '../../../app/core/_base/layout/pipes/date-relative.pipe';
import { LoaderComponent } from './custom/loader/loader.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { TablaCustomComponent } from './custom/secciones-generales/tabla-custom/tabla-custom.component';
import { TablePagoComponent } from './custom/secciones-generales/tabla-custom/table-pago/table-pago.component';
import { RelativeNumberPipe } from '../../../app/core/_base/layout/pipes/number-relative.pipe';
import { ImpuestosComTableComponent } from './custom/secciones-generales/impuestos-com-table/impuestos-com-table.component';
import { VentanaPrecancelacionComponent } from './custom/popups/ventana-precancelacion/ventana-precancelacion.component';
import { AlertaTiempoAprobadorComponent } from './custom/alerta-tiempo-aprobador/alerta-tiempo-aprobador.component';
import { HistoricoObservacionComponent } from './custom/secciones-generales/historico-observacion/historico-observacion.component';
import { RelativeTimePipe } from '../../../app/core/_base/layout/pipes/time-relative.pipe';
import { HistoricoOperativaComponent } from './custom/secciones-generales/historico-operativa/historico-operativa.component';
import { HitoricoObservacionEntregaComponent } from './custom/secciones-generales/hitorico-observacion-entrega/hitorico-observacion-entrega.component';
import { UsuariosPerfilTableComponent } from './custom/usuarios-perfil-table/usuarios-perfil-table.component';
import { ExploradorComponent } from './custom/explorador/explorador.component';
import { ArbolComponent } from './custom/arbol/arbol.component';
import { ContenidoComponent } from './custom/contenido/contenido.component';
import { PathComponent } from './custom/path/path.component';
import { ValidacionDocumentoComponent } from './custom/secciones-generales/validacion-documento/validacion-documento.component';
import { ComprobanteDesembolsoComponent } from './custom/comprobante-desembolso/comprobante-desembolso.component';
import { ExcepcionesOperativasListComponent } from './custom/excepciones-operativas-list/excepciones-operativas-list.component';
import { ComprobantePagoComponent } from './custom/comprobante-pago/comprobante-pago.component';
import { HabilitanteOperacionComponent } from './custom/secciones-generales/HabilitanteOperacion/habilitante-operacion';





const DEFAULT_CURRENCY_CODE: InjectionToken<string> = new InjectionToken<string>('USD');

@NgModule({
	declarations: [
		HabilitanteOperacionComponent,
		ComprobanteDesembolsoComponent,
		RelativeNumberPipe,
		RelativeDatePipe,
		RelativeTimePipe,
		MensajeExcepcionComponent,
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,
		CreditoDialogComponent,
		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		LoaderComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		UserProfile2Component,
		UserProfile3Component,
		CartComponent,

		ErrorComponent,
		ReMessageComponent,
		PortletComponent,
		PortletHeaderComponent,
		PortletBodyComponent,
		PortletFooterComponent,
		AuthDialogComponent,
		SolicitudAutorizacionDialogComponent,
		ArchivoUploadDialogComponent,
		CargarFotoDialogComponent,
		ArchivoComponent,
		AddFotoComponent,
		HabilitanteComponent,
		HabilitanteDialogComponent,
		ErrorCargaInicialComponent,
		VerCotizacionesComponent,
		DetallesComponent,
		TablaDetalleCreditoComponent,
		TablaVariablesCrediticiasComponent,
		TablaOfertaCalculadoraComponent,
		TablaOfertaCreditoComponent,
		TablaRiesgoAcumuladoComponent,
		TablaTasacionComponent,
		RiesgoAcumuladoComponent,
		TablaOfertaCreditoComponent,
		MensajeEdadComponent,
		SolicitudDeExcepcionesComponent,
		ListaExcepcionesComponent,
		ReasignarUsuarioComponent,
		ConfirmarAccionComponent,
		AddFechaComponent,
		TablaAmortizacionComponent,
		DevolucionCreditoComponent,
		PopupPagoComponent,
		SubirComprobanteComponent,
		TablaCustomComponent,
		TablePagoComponent,
		ImpuestosComTableComponent,
		VentanaPrecancelacionComponent,
		AlertaTiempoAprobadorComponent,
		HistoricoObservacionComponent,
		HistoricoOperativaComponent,
		HitoricoObservacionEntregaComponent,
		UsuariosPerfilTableComponent,
		ExploradorComponent,
		ArbolComponent,
		ContenidoComponent,
		PathComponent,
		ValidacionDocumentoComponent,
		ExcepcionesOperativasListComponent,
		ComprobantePagoComponent


	],
	exports: [
		HabilitanteOperacionComponent,
		ComprobantePagoComponent,
		ExcepcionesOperativasListComponent,
		ComprobanteDesembolsoComponent,
		HitoricoObservacionEntregaComponent,
		HistoricoOperativaComponent,
		HistoricoObservacionComponent,
		ListaExcepcionesComponent,
		ImpuestosComTableComponent,
		TablaCustomComponent,
		WidgetModule,
		PortletModule,
		RelativeDatePipe,
		RelativeTimePipe,
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,
		TablaDetalleCreditoComponent,
		TablaVariablesCrediticiasComponent,
		TablaOfertaCalculadoraComponent,
		TablaRiesgoAcumuladoComponent,
		TablaTasacionComponent,
		TablaOfertaCreditoComponent,
		MensajeEdadComponent,
		LoaderComponent,
		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		AddFechaComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		SubheaderSearchComponent,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		UserProfile2Component,
		UserProfile3Component,
		CartComponent,

		ErrorComponent,
		ReMessageComponent,
		PortletComponent,
		PortletHeaderComponent,
		PortletBodyComponent,
		PortletFooterComponent,
		AuthDialogComponent,
		HabilitanteComponent,
		HabilitanteDialogComponent,
		ErrorCargaInicialComponent,
		DetallesComponent,
		SolicitudDeExcepcionesComponent,
		VentanaPrecancelacionComponent,
		AlertaTiempoAprobadorComponent,
		UsuariosPerfilTableComponent,
		ExploradorComponent,
		ArbolComponent,
		ContenidoComponent,
		PathComponent,
		ValidacionDocumentoComponent

	],
	imports: [

		MatTableExporterModule,
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		PerfectScrollbarModule,
		InlineSVGModule,
		CoreModule,
		PortletModule,
		WidgetModule,

		// angular material modules
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
		MatDialogModule,
		MatTreeModule,
		MatListModule,



		// ng-bootstrap modules
		NgbDropdownModule,
		NgbTabsetModule,
		NgbTooltipModule,

		TranslateModule,
		WebcamModule
	],
	providers: [
		{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD '},
		{ provide: MatDialogRef, useValue: {} },
		{ provide: MAT_DIALOG_DATA, useValue: [] },
	],
	entryComponents: [
		CreditoDialogComponent,
		RiesgoAcumuladoComponent,
		AuthDialogComponent,
		HabilitanteDialogComponent,
		SolicitudAutorizacionDialogComponent,
		MensajeExcepcionComponent,
		MensajeEdadComponent,
		DevolucionCreditoComponent,
		CargarFotoDialogComponent,
		DetallesComponent,
		TablaDetalleCreditoComponent,
		TablaVariablesCrediticiasComponent,
		TablaOfertaCalculadoraComponent,
		TablaRiesgoAcumuladoComponent,
		TablaOfertaCreditoComponent,
		SolicitudDeExcepcionesComponent,
		TablaTasacionComponent,
		TablaOfertaCreditoComponent,
		AddFechaComponent,
		TablaAmortizacionComponent,
		PopupPagoComponent,
		SubirComprobanteComponent,
		TablePagoComponent

	]
})
export class PartialsModule {
}
