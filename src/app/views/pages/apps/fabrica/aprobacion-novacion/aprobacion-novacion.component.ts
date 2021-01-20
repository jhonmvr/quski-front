import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { AprobacionWrapper } from '../../../../../core/model/wrapper/AprobacionWrapper';
import { OperacionAprobar } from '../../../../../core/model/softbank/OperacioAprobar';
import { CatalogosWrapper } from '../../../../../core/model/wrapper/CatalogosWrapper';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { DatosRegistro } from '../../../../../core/model/softbank/DatosRegistro';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoPatrimonio } from '../../../../../core/model/quski/TbQoPatrimonio';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { environment } from '../../../../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';


@Component({
  selector: 'kt-aprobacion-novacion',
  templateUrl: './aprobacion-novacion.component.html',
  styleUrls: ['./aprobacion-novacion.component.scss']
})
export class AprobacionNovacionComponent implements OnInit {
  /** @VARIABLES_GLOBALES */
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public usuario: string;
  public agencia: any;
  public fechaActual: string;
  public catalogos: CatalogosWrapper;
  public crediW: AprobacionWrapper;
  public formDisable: FormGroup = new FormGroup({});
  public totalNumeroJoya: number;
  public totalPesoB: number;
  public totalPesoN: number;
  public totalValorA: number;
  public totalValorR: number;
  public totalValorC: number;
  public totalValorO: number;

  /** @OPERACION */
  public codigoBpm = new FormControl('', []);
  public proceso = new FormControl('', []);
  public nombresCompletoCliente = new FormControl('', []);
  public displayedColumnsHabilitante = ['descripcion', 'archivo'];
  public dataSourceHabilitante = new MatTableDataSource<any>();
  /** @DATOS_PERSONALES */
  public identificacion = new FormControl('', []);
  public aprobacionMupi = new FormControl('', []);
  public nombresCompletos = new FormControl('', []);
  public primerNombre = new FormControl('', []);
  public segundoNombre = new FormControl('', []);
  public apellidoPaterno = new FormControl('', []);
  public apellidoMaterno = new FormControl('', []);
  public separacionDeBienes = new FormControl('', []);
  public genero = new FormControl('', []);
  public estadoCivil = new FormControl('', []);
  public cargaFamiliar = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public lugarDeNacimiento = new FormControl('', []);
  public edad = new FormControl('', []);
  public fechaNacimiento = new FormControl('', []);
  public nivelEducacion = new FormControl('', []);
  public actividadEconomica = new FormControl('', []);
  public fechaUltimaActualizazion = new FormControl('', []);
  public telefonoDomicilio = new FormControl('', []);
  public telefonoMovil = new FormControl('', []);
  public telefonoOficina = new FormControl('', []);
  public correo = new FormControl('', []);
  public direccionLegalDomicilio = new FormControl('', []);
  public direccionCorreoDomicilio = new FormControl('', []);
  public ubicacion = new FormControl('', []);
  public barrio = new FormControl('', []);
  public sector = new FormControl('', []);
  public callePrincipal = new FormControl('', []);
  public numeracion = new FormControl('', []);
  public calleSecundaria = new FormControl('', []);
  public referenciaUbicacion = new FormControl('', []);
  public tipoVivienda = new FormControl('', []);
  public direccionCorreoLaboral = new FormControl('', []);
  public direccionLegalLaboral = new FormControl('', []);
  public ubicacionLaboral = new FormControl('', []);
  public referenciaUbicacionLaboral = new FormControl('', []);
  public callePrincipalLaboral = new FormControl('', []);
  public numeracionLaboral = new FormControl('', []);
  public barrioLaboral = new FormControl('', []);
  public calleSecundariaLaboral = new FormControl('', []);
  public tipoViviendaLaboral = new FormControl('', []);
  public sectorLaboral = new FormControl('', []);
  public actividadEconomicaEmpresa = new FormControl('', []);
  public actividadEconomicaMupi = new FormControl('', []);
  public nombreEmpresa = new FormControl('', []);
  public origenIngresos = new FormControl('', []);
  public profesion = new FormControl('', []);
  public ocupacion = new FormControl('', []);
  public cargo = new FormControl('', []);
  public relacionDependencia = new FormControl('');
  public displayedColumnsActivo = ['Activo', 'Avaluo'];
  public displayedColumnsPasivo = ['Pasivo', 'Avaluo'];
  public dataSourcePatrimonioActivo: MatTableDataSource<TbQoPatrimonio>;
  public dataSourcePatrimonioPasivo: MatTableDataSource<TbQoPatrimonio>;
  public displayedColumnsII = ['Is', 'Valor'];
  public dataSourceIngresoEgreso: MatTableDataSource<TbQoIngresoEgresoCliente>;
  public displayedColumnsReferencia = ['N', 'nombresRef', 'apellidosRef', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  public dataSourceReferencia = new MatTableDataSource<TbReferencia>();
  /** @INSTRUCCION_OPERATIVA */
  public tipoProceso = new FormControl('', []);
  public displayedColumns = ['total', 'numeroPiezas', 'tipoOro', 'tipoJoya', 'estadoJoya', 'descripcion', 'pesoBruto', 'tieneDescuento', 'descuentoPesoPiedra', 'descuentoSuelda', 'pesoNeto', 'valorOro', 'valorAvaluo', 'valorComercial', 'valorRealizacion'];
  public dataSource = new MatTableDataSource<TbQoTasacion>();
  public numeroFunda = new FormControl('', []);
  public tipoFunda = new FormControl('', []);
  public tipoCuenta = new FormControl('', []);
  public numeroCuenta = new FormControl('', []);
  public firmaRegularizada = new FormControl('', []);
  public diaPagoFijo = new FormControl('', []);
  public firmadaOperacion = new FormControl('', []);
  public tipoCliente = new FormControl('', []);
  /** @CREDITO_NUEVO */
  public plazo = new FormControl('', []);
  public tipoOferta = new FormControl('', []);
  public costoCustodia = new FormControl('', []);
  public formaPagoCustodia = new FormControl('', []);
  public costoTransporte = new FormControl('', []);
  public formaPagoTransporte = new FormControl('', []);
  public costoValoracion = new FormControl('', []);
  public formaPagoValoracion = new FormControl('', []);
  public costoTasacion = new FormControl('', []);
  public formaPagoTasacion = new FormControl('', []);
  public costoResguardo = new FormControl('', []);
  public formaPagoResguardo = new FormControl('', []);
  public costoSeguro = new FormControl('', []);
  public formaPagoSeguro = new FormControl('', []);
  public solca = new FormControl('', []);
  public formaPagoSolca = new FormControl('', []);
  public aPagarCliente = new FormControl('', []);
  public aRecibirCliente = new FormControl('', []);
  public totalCostoNuevaOperacion = new FormControl('', []);
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['intitucionFinanciera', 'cuenta', 'fechaPago', 'numeroDeDeposito', 'valorDepositado', 'descargarComprobante'];
  public tipoCartera = new FormControl('', []);
  public tablaAmortizacion = new FormControl('', []);
  public numeroOperacion = new FormControl('', []);
  public descripcionProducto = new FormControl('', []);
  public estadoOperacion = new FormControl('', []);
  public fechaVencimiento = new FormControl('', []);
  public fechaEfectiva = new FormControl('', []);
  public valorDesembolso = new FormControl('', []);
  public montoFinanciado = new FormControl('', []);
  public cuota = new FormControl('', []);
  public totalInteres = new FormControl('', []);
  /** @OPERACION_ANTERIOR */
  public antNumeroOperacion = new FormControl('', []);
  public antReferenciaMupi = new FormControl('', []);
  public antOperacionMadre = new FormControl('', []);
  public antPlazo = new FormControl('', []);
  public antTipoCredito = new FormControl('', []);
  public antEstadoOperacion = new FormControl('', []);
  public antFechaEfectiva = new FormControl('', []);
  public antFechaVecimiento = new FormControl('', []);
  public antFechaCompraCartera = new FormControl('', []);
  public antMontoFinanciado = new FormControl('', []);
  public antCuota = new FormControl('', []);
  public antUltimaCuotaPagada = new FormControl('', []);
  public antSaldoCapital = new FormControl('', []);
  public antSaldoInteres = new FormControl('', []);
  public antSaldoMora = new FormControl('', []);
  public antGastoCobranza = new FormControl('', []);
  public antCustodiaVencida = new FormControl('', []);
  public antValorPrecancelacion = new FormControl('', []);
  /** @RESULTADO_OPERACION */
  public formResultadoOperacion: FormGroup = new FormGroup({});
  public motivoDevolucion = new FormControl('', []);
  public codigoCash = new FormControl('', []);
  public observacionAprobador = new FormControl('', [Validators.required]);
  constructor(
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private pro: ProcesoService,
    private sinNotSer: ReNoticeService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private subheaderService: SubheaderService

  ) {
    this.cre.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();
    this.formDisable.addControl("codigoBpm", this.codigoBpm);
    this.formDisable.addControl("proceso", this.proceso);
    this.formDisable.addControl("nombresCompletoCliente", this.nombresCompletoCliente);
    this.formDisable.addControl("identificacion", this.identificacion);
    this.formDisable.addControl("aprobacionMupi", this.aprobacionMupi);
    this.formDisable.addControl("nombresCompletos", this.nombresCompletos);
    this.formDisable.addControl("primerNombre", this.primerNombre);
    this.formDisable.addControl("segundoNombre", this.segundoNombre);
    this.formDisable.addControl("apellidoPaterno", this.apellidoPaterno);
    this.formDisable.addControl("apellidoMaterno", this.apellidoMaterno);
    this.formDisable.addControl("separacionDeBienes", this.separacionDeBienes);
    this.formDisable.addControl("genero", this.genero);
    this.formDisable.addControl("estadoCivil", this.estadoCivil);
    this.formDisable.addControl("cargaFamiliar", this.cargaFamiliar);
    this.formDisable.addControl("nacionalidad", this.nacionalidad);
    this.formDisable.addControl("lugarDeNacimiento", this.lugarDeNacimiento);
    this.formDisable.addControl("edad", this.edad);
    this.formDisable.addControl("fechaNacimiento", this.fechaNacimiento);
    this.formDisable.addControl("nivelEducacion", this.nivelEducacion);
    this.formDisable.addControl("actividadEconomica", this.actividadEconomica);
    this.formDisable.addControl("fechaUltimaActualizazion", this.fechaUltimaActualizazion);
    this.formDisable.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formDisable.addControl("telefonoMovil", this.telefonoMovil);
    this.formDisable.addControl("telefonoOficina", this.telefonoOficina);
    this.formDisable.addControl("correo", this.correo);
    this.formDisable.addControl("direccionLegalDomicilio", this.direccionLegalDomicilio);
    this.formDisable.addControl("direccionCorreoDomicilio", this.direccionCorreoDomicilio);
    this.formDisable.addControl("ubicacion", this.ubicacion);
    this.formDisable.addControl("barrio", this.barrio);
    this.formDisable.addControl("sector", this.sector);
    this.formDisable.addControl("callePrincipal", this.callePrincipal);
    this.formDisable.addControl("numeracion", this.numeracion);
    this.formDisable.addControl("calleSecundaria", this.calleSecundaria);
    this.formDisable.addControl("referenciaUbicacion", this.referenciaUbicacion);
    this.formDisable.addControl("tipoVivienda", this.tipoVivienda);
    this.formDisable.addControl("direccionCorreoLaboral", this.direccionCorreoLaboral);
    this.formDisable.addControl("direccionLegalLaboral", this.direccionLegalLaboral);
    this.formDisable.addControl("ubicacionLaboral", this.ubicacionLaboral);
    this.formDisable.addControl("referenciaUbicacionLaboral", this.referenciaUbicacionLaboral);
    this.formDisable.addControl("callePrincipalLaboral", this.callePrincipalLaboral);
    this.formDisable.addControl("numeracionLaboral", this.numeracionLaboral);
    this.formDisable.addControl("barrioLaboral", this.barrioLaboral);
    this.formDisable.addControl("calleSecundariaLaboral", this.calleSecundariaLaboral);
    this.formDisable.addControl("tipoViviendaLaboral", this.tipoViviendaLaboral);
    this.formDisable.addControl("sectorLaboral", this.sectorLaboral);
    this.formDisable.addControl("actividadEconomicaEmpresa", this.actividadEconomicaEmpresa);
    this.formDisable.addControl("actividadEconomicaMupi", this.actividadEconomicaMupi);
    this.formDisable.addControl("nombreEmpresa", this.nombreEmpresa);
    this.formDisable.addControl("origenIngresos", this.origenIngresos);
    this.formDisable.addControl("profesion", this.profesion);
    this.formDisable.addControl("ocupacion", this.ocupacion);
    this.formDisable.addControl("cargo", this.cargo);
    this.formDisable.addControl("relacionDependencia", this.relacionDependencia);
    this.formDisable.addControl("tipoProceso", this.tipoProceso);
    this.formDisable.addControl("numeroFunda", this.numeroFunda);
    this.formDisable.addControl("tipoFunda", this.tipoFunda);
    this.formDisable.addControl("plazo", this.plazo);
    this.formDisable.addControl("tipoOferta", this.tipoOferta);
    this.formDisable.addControl("costoCustodia", this.costoCustodia);
    this.formDisable.addControl("formaPagoCustodia", this.formaPagoCustodia);
    this.formDisable.addControl("costoTransporte", this.costoTransporte);
    this.formDisable.addControl("formaPagoTransporte", this.formaPagoTransporte);
    this.formDisable.addControl("costoValoracion", this.costoValoracion);
    this.formDisable.addControl("formaPagoValoracion", this.formaPagoValoracion);
    this.formDisable.addControl("costoTasacion", this.costoTasacion);
    this.formDisable.addControl("formaPagoTasacion", this.formaPagoTasacion);
    this.formDisable.addControl("costoResguardo", this.costoResguardo);
    this.formDisable.addControl("formaPagoResguardo", this.formaPagoResguardo);
    this.formDisable.addControl("costoSeguro", this.costoSeguro);
    this.formDisable.addControl("formaPagoSeguro", this.formaPagoSeguro);
    this.formDisable.addControl("solca", this.solca);
    this.formDisable.addControl("formaPagoSolca", this.formaPagoSolca);
    this.formDisable.addControl("aPagarCliente", this.aPagarCliente);
    this.formDisable.addControl("aRecibirCliente", this.aRecibirCliente);
    this.formDisable.addControl("totalCostoNuevaOperacion", this.totalCostoNuevaOperacion);
    this.formDisable.addControl("tipoCuenta", this.tipoCuenta);
    this.formDisable.addControl("numeroCuenta", this.numeroCuenta);
    this.formDisable.addControl("firmaRegularizada", this.firmaRegularizada);
    this.formDisable.addControl("diaPagoFijo", this.diaPagoFijo);
    this.formDisable.addControl("firmadaOperacion", this.firmadaOperacion);
    this.formDisable.addControl("tipoCliente", this.tipoCliente);
    this.formDisable.addControl("tipoCartera", this.tipoCartera);
    this.formDisable.addControl("tablaAmortizacion", this.tablaAmortizacion);
    this.formDisable.addControl("numeroOperacion", this.numeroOperacion);
    this.formDisable.addControl("descripcionProducto", this.descripcionProducto);
    this.formDisable.addControl("estadoOperacion", this.estadoOperacion);
    this.formDisable.addControl("fechaVencimiento", this.fechaVencimiento);
    this.formDisable.addControl("fechaEfectiva", this.fechaEfectiva);
    this.formDisable.addControl("valorDesembolso", this.valorDesembolso);
    this.formDisable.addControl("montoFinanciado", this.montoFinanciado);
    this.formDisable.addControl("cuota", this.cuota);
    this.formDisable.addControl("totalInteres", this.totalInteres);
    this.formDisable.addControl("antNumeroOperacion", this.antNumeroOperacion);
    this.formDisable.addControl("antReferenciaMupi", this.antReferenciaMupi);
    this.formDisable.addControl("antOperacionMadre", this.antOperacionMadre);
    this.formDisable.addControl("antPlazo", this.antPlazo);
    this.formDisable.addControl("antTipoCredito", this.antTipoCredito);
    this.formDisable.addControl("antEstadoOperacion", this.antEstadoOperacion);
    this.formDisable.addControl("antFechaEfectiva", this.antFechaEfectiva);
    this.formDisable.addControl("antFechaVecimiento", this.antFechaVecimiento);
    this.formDisable.addControl("antFechaCompraCartera", this.antFechaCompraCartera);
    this.formDisable.addControl("antMontoFinanciado", this.antMontoFinanciado);
    this.formDisable.addControl("antCuota", this.antCuota);
    this.formDisable.addControl("antUltimaCuotaPagada", this.antUltimaCuotaPagada);
    this.formDisable.addControl("antSaldoCapital", this.antSaldoCapital);
    this.formDisable.addControl("antSaldoInteres", this.antSaldoInteres);
    this.formDisable.addControl("antSaldoMora", this.antSaldoMora);
    this.formDisable.addControl("antGastoCobranza", this.antGastoCobranza);
    this.formDisable.addControl("antCustodiaVencida", this.antCustodiaVencida);
    this.formDisable.addControl("antValorPrecancelacion", this.antValorPrecancelacion);
  }

  ngOnInit() {

    this.traerCatalogos();
    this.cre.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();
    this.subheaderService.setTitle('Aprobación De Credito');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );
    this.formDisable.disable();
  }
  public descargarComprobante(row) {
    saveAs(row.comprobante.fileBase64, row.comprobante.name);
  }
  public descargar(row) { }
  public regresar() {
    this.router.navigate(['aprobador']);
  }
  private traerCatalogos() {
    this.sof.traerCatalogos().subscribe((data: any) => {
      data.entidad ? this.catalogos = data.entidad : this.sinNotSer.setNotice('ERROR AL CARGAR CATALOGOS', 'error');
      this.traerCreditoNegociacion();
    });
  }
  private traerCreditoNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.idNegociacion) {
        this.loadingSubject.next(true);
        this.cre.traerCreditonovacionPorAprobar(data.params.idNegociacion).subscribe((data: any) => {
          if (data.entidad) {
            this.crediW = data.entidad;
            this.setearValores(this.crediW);
          } else {
            this.loadingSubject.next(false);
            this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO: ' + data.entidad.mensaje, 'error');
          }
        });
      } else {
        this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO', 'error');
      }
    });
  }
  private setearValores(ap: AprobacionWrapper) {
    /** @OPERACION */
    this.codigoBpm.setValue(ap.credito.codigo);
    this.proceso.setValue(ap.proceso.proceso);
    this.nombresCompletoCliente.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    /** @DATOS_CLIENTE */
    this.identificacion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.cedulaCliente);
    this.aprobacionMupi.setValue(ap.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi == 'S' ? 'SI' : 'NO');
    this.nombresCompletos.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    this.primerNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.primerNombre);
    this.segundoNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.segundoNombre);
    this.apellidoPaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoPaterno);
    this.apellidoMaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoMaterno);
    this.separacionDeBienes.setValue(ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes ? ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes : 'NO APLICA');
    this.genero.setValue(this.catalogos.catSexo.find(c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.genero).nombre);
    this.estadoCivil.setValue(this.catalogos.catEstadoCivil.find(c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.estadoCivil).nombre);
    this.cargaFamiliar.setValue(ap.credito.tbQoNegociacion.tbQoCliente.cargasFamiliares);
    this.nacionalidad.setValue(this.catalogos.catPais.find(c => c.id == ap.credito.tbQoNegociacion.tbQoCliente.nacionalidad).nombre);
    this.lugarDeNacimiento.setValue(this.catalogos.catDivicionPolitica.find(c => c.id == ap.credito.tbQoNegociacion.tbQoCliente.lugarNacimiento).nombre);
    this.edad.setValue(ap.credito.tbQoNegociacion.tbQoCliente.edad);
    this.fechaActual = ap.credito.fechaCreacion.toString();
    this.fechaNacimiento.setValue(ap.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento);
    this.nivelEducacion.setValue(this.catalogos.catEducacion.find(c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.nivelEducacion).nombre);
    this.actividadEconomica.setValue(this.catalogos.catActividadEconomica.find(c => c.id == ap.credito.tbQoNegociacion.tbQoCliente.actividadEconomica).nombre);
    this.fechaUltimaActualizazion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.fechaActualizacion);
    this.correo.setValue(ap.credito.tbQoNegociacion.tbQoCliente.email);
    !ap.telefonos ? null : ap.telefonos.forEach(e => {
      if (e.tipoTelefono == "M") {
        this.telefonoMovil.setValue(e.numero);
      }
      if (e.tipoTelefono == "F") {
        this.telefonoDomicilio.setValue(e.numero);
      }
      if (e.tipoTelefono == "CEL") {
        this.telefonoOficina.setValue(e.numero);
      }
    });
    !ap.direcciones ? null : ap.direcciones.forEach(e => {
      if (e.tipoDireccion == "OFI") {
        this.ubicacionLaboral.setValue(this.catalogos.catDivicionPolitica.find(x => x.id == e.divisionPolitica).nombre);
        this.tipoViviendaLaboral.setValue(this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda).nombre);
        this.callePrincipalLaboral.setValue(e.callePrincipal.toUpperCase());
        this.barrioLaboral.setValue(e.barrio ? e.barrio.toUpperCase() : null);
        this.numeracionLaboral.setValue(e.numeracion.toUpperCase());
        this.calleSecundariaLaboral.setValue(e.calleSegundaria.toUpperCase());
        this.referenciaUbicacionLaboral.setValue(e.referenciaUbicacion.toUpperCase());
        this.sectorLaboral.setValue(this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector).nombre);
        this.direccionLegalLaboral.setValue(e.direccionLegal);
        this.direccionCorreoLaboral.setValue(e.direccionEnvioCorrespondencia);
      }
      if (e.tipoDireccion == "DOM") {
        this.ubicacion.setValue(this.catalogos.catDivicionPolitica.find(x => x.id == e.divisionPolitica).nombre);
        this.tipoVivienda.setValue(this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda).nombre);
        this.callePrincipal.setValue(e.callePrincipal);
        this.numeracion.setValue(e.numeracion);
        this.calleSecundaria.setValue(e.calleSegundaria);
        this.referenciaUbicacion.setValue(e.referenciaUbicacion);
        this.sector.setValue(this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector).nombre);
        this.barrio.setValue(e.barrio);
        this.direccionLegalDomicilio.setValue(e.direccionLegal);
        this.direccionCorreoDomicilio.setValue(e.direccionEnvioCorrespondencia);
      }
    });
    !ap.trabajos ? null : ap.trabajos.forEach(e => {
      this.origenIngresos.setValue(this.catalogos.catOrigenIngreso.find(x => x.codigo == e.origenIngreso).nombre);
      this.relacionDependencia.setValue(e.esRelacionDependencia ? "SI" : "NO");
      this.nombreEmpresa.setValue(e.nombreEmpresa);
      this.cargo.setValue(this.catalogos.catCargo.find(x => x.codigo == e.cargo).nombre);
      this.ocupacion.setValue(this.catalogos.catOcupacion.find(x => x.codigo == e.ocupacion).nombre);
      this.actividadEconomicaMupi.setValue(this.catalogos.catActividadEconomicaMupi.find(x => x.codigo == e.actividadEconomicaMupi).nombre);
      this.actividadEconomicaEmpresa.setValue(this.catalogos.catActividadEconomica.find(x => x.id.toString() == e.actividadEconomica).nombre);
      this.profesion.setValue(this.catalogos.catProfesion.find(c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.profesion).nombre);
    });
    this.dataSourcePatrimonioActivo = new MatTableDataSource<TbQoPatrimonio>();
    this.dataSourcePatrimonioPasivo = new MatTableDataSource<TbQoPatrimonio>();
    this.dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();
    this.dataSourcePatrimonioActivo.data.push(new TbQoPatrimonio(ap.credito.tbQoNegociacion.tbQoCliente.activos, true));
    this.dataSourcePatrimonioPasivo.data.push(new TbQoPatrimonio(ap.credito.tbQoNegociacion.tbQoCliente.pasivos, false));
    this.dataSourceIngresoEgreso.data.push(new TbQoIngresoEgresoCliente(ap.credito.tbQoNegociacion.tbQoCliente.ingresos, true));
    this.dataSourceIngresoEgreso.data.push(new TbQoIngresoEgresoCliente(ap.credito.tbQoNegociacion.tbQoCliente.egresos, false));
    this.dataSourceReferencia.data = ap.referencias;
    this.numeroFunda.setValue(ap.credito.numeroFunda);
    this.tipoFunda.setValue(ap.credito.codigoTipoFunda);
    this.dataSource.data = ap.joyas;

    this.tipoProceso.setValue(ap.proceso.proceso);
    this.calcular();
    /** @DATOS_CREDITO_NUEVO */
    this.plazo.setValue(ap.credito.plazoCredito);
    this.tipoOferta.setValue(ap.credito.tipoOferta == "N" ? 'NUEVO' : ap.credito.tipoOferta);
    this.costoCustodia.setValue(ap.credito.costoCustodia);
    this.formaPagoCustodia.setValue(ap.credito.formaPagoCustodia);
    this.costoTransporte.setValue(ap.credito.costoTransporte);
    this.formaPagoTransporte.setValue(ap.credito.formaPagoTransporte);
    this.costoValoracion.setValue(ap.credito.costoValoracion);
    this.formaPagoValoracion.setValue(ap.credito.formaPagoValoracion);
    this.costoTasacion.setValue(ap.credito.costoTasacion);
    this.formaPagoTasacion.setValue(ap.credito.formaPagoTasador);
    this.costoResguardo.setValue(ap.credito);
    this.formaPagoResguardo.setValue(ap.credito);
    this.costoSeguro.setValue(ap.credito.costoSeguro);
    this.formaPagoSeguro.setValue(ap.credito.formaPagoSeguro);
    this.solca.setValue(ap.credito.impuestoSolca);
    this.formaPagoSolca.setValue(ap.credito.formaPagoImpuestoSolca);
    this.aPagarCliente.setValue(ap.credito.aPagarCliente);
    this.aRecibirCliente.setValue(ap.credito.aRecibirCliente);
    this.totalCostoNuevaOperacion.setValue(ap.credito.totalCostoNuevaOperacion);

    /** @DATOS_INSTRUCCION_OPERATIVA */
    //this.tipoCuenta.setValue( ap.cuenta.banco );
    //this.numeroCuenta.setValue( ap.cuenta.cuenta );
    this.firmaRegularizada.setValue("No tengo");
    this.diaPagoFijo.setValue(ap.credito.pagoDia);
    this.firmadaOperacion.setValue(ap.credito.firmanteOperacion);
    this.tipoCliente.setValue("DEUDOR");

    /** @OPERACION_NUEVA */
    this.tipoCartera.setValue(ap.credito.tipoCarteraQuski);
    this.tablaAmortizacion.setValue(ap.credito.tablaAmortizacion);
    this.numeroOperacion.setValue(ap.credito.numeroOperacion);
    this.descripcionProducto.setValue(ap.credito.descripcionProducto);
    this.estadoOperacion.setValue(ap.credito.estadoSoftbank);
    this.fechaVencimiento.setValue(ap.credito.fechaVencimiento);
    this.fechaEfectiva.setValue(ap.credito.fechaEfectiva);
    this.valorDesembolso.setValue(ap.credito.montoDesembolso);
    this.montoFinanciado.setValue(ap.credito.montoFinanciado);
    this.cuota.setValue(ap.credito.cuota);
    this.totalInteres.setValue(ap.credito.saldoInteres);
    /** @OPERACION_ANTERIOR */

    this.antNumeroOperacion.setValue( ap.creditoAnterior.credito.numeroOperacion );
    this.antReferenciaMupi.setValue( "No tengo.");
    this.antOperacionMadre.setValue( ap.creditoAnterior.credito.numeroOperacionMadre ? ap.creditoAnterior.credito.numeroOperacionMadre : 'No aplica' );
    this.antPlazo.setValue( ap.creditoAnterior.credito.plazo );
    this.antTipoCredito.setValue( ap.creditoAnterior.credito.tipoCredito );
    this.antEstadoOperacion.setValue( ap.creditoAnterior.credito.codigoEstadoOperacion );
    this.antFechaEfectiva.setValue( ap.creditoAnterior.credito.fechaAprobacion );
    this.antFechaVecimiento.setValue( ap.creditoAnterior.credito.fechaVencimiento );
    this.antFechaCompraCartera.setValue( "No tengo.");
    this.antMontoFinanciado.setValue( ap.creditoAnterior.credito.montoFinanciado );
    this.antCuota.setValue( ap.creditoAnterior.credito.numeroCuotas );
    this.antUltimaCuotaPagada.setValue( "No tengo.");
    this.antSaldoCapital.setValue( ap.creditoAnterior.credito.saldo );
    this.antSaldoInteres.setValue( "No tengo.");
    this.antSaldoMora.setValue( "No tengo.");
    this.antGastoCobranza.setValue( "No tengo.");
    this.antCustodiaVencida.setValue( "No tengo.");
    this.antValorPrecancelacion.setValue( "No tengo.");

    this.loadingSubject.next(false);
  }
  private calcular() {
    this.totalPesoN = 0;
    this.totalPesoB = 0;
    this.totalValorR = 0;
    this.totalValorA = 0;
    this.totalValorC = 0;
    this.totalValorO = 0;
    this.totalNumeroJoya = 0
    if (this.dataSource.data) {
      this.dataSource.data.forEach(element => {
        this.totalPesoN = Number(this.totalPesoN) + Number(element.pesoNeto);
        this.totalPesoB = Number(this.totalPesoB) + Number(element.pesoBruto);
        this.totalValorR = Number(this.totalValorR) + Number(element.valorRealizacion);
        this.totalValorA = Number(this.totalValorA) + Number(element.valorAvaluo);
        this.totalValorC = Number(this.totalValorC) + Number(element.valorComercial);
        this.totalValorO = Number(this.totalValorO) + Number(element.valorOro);
        this.totalNumeroJoya = Number(this.totalNumeroJoya) + Number(element.numeroPiezas);
      });
    }
  }
  public aprobar() {
    if (this.observacionAprobador.value && this.codigoCash.value) {
      let mensaje = "Aprobar el credito: " + this.crediW.credito.codigo + ".";
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        this.loadingSubject.next(true);
        if (r) {
          let datos = new DatosRegistro(this.fechaActual, this.usuario, this.agencia);
          let wrapper: OperacionAprobar = new OperacionAprobar(this.crediW.credito.numeroOperacion, datos);
          this.sof.operacionAprobarCS(wrapper).subscribe((data: any) => {
            if (!data.existeError) {
              this.pro.cambiarEstadoProceso(this.crediW.credito.tbQoNegociacion.id, "RENOVACION", "APROBADO").subscribe((data: any) => {
                if (data.entidad) {
                  this.cre.devolverAprobar(this.crediW.credito.id, this.codigoCash.value, this.observacionAprobador.value, this.motivoDevolucion.value.codigo).subscribe((data: any) => {
                    this.loadingSubject.next(false);
                    if (data.entidad) {
                      //console.log('El nuevo estado -> ',data.entidad.estadoProceso);
                      this.router.navigate(['aprobador']);
                    } else {
                      this.sinNotSer.setNotice('Error actualizando el credito', 'error');
                    }
                  });
                } else {
                  this.loadingSubject.next(false);
                  this.sinNotSer.setNotice('ERROR INTERNO', 'error');
                }
              });
            } else {
              this.loadingSubject.next(false);
              this.sinNotSer.setNotice('ERROR EN SOFTBANK', 'error');
            }
          }, error => {
            this.loadingSubject.next(false);
            this.sinNotSer.setNotice('ERROR EN SOFTBANK', 'error');
          });

        } else {
          this.loadingSubject.next(false);
          this.sinNotSer.setNotice('SE CANCELO LA ACCION', 'error');
        }
      });
    } else {
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS DE RESULTADO DE OPERACION CORRECTAMENTE', 'error');
    }
  }
  public devolver() {
    if (this.observacionAprobador.value && this.motivoDevolucion.value) {
      let mensaje = "Devolver a la negociacion el credito: " + this.crediW.credito.codigo + ".";
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        this.loadingSubject.next(true);
        if (r) {
          this.pro.cambiarEstadoProceso(this.crediW.credito.tbQoNegociacion.id, "RENOVACION", "DEVUELTO").subscribe((data: any) => {
            if (data.entidad) {
              this.cre.devolverAprobar(this.crediW.credito.id, this.codigoCash.value, this.observacionAprobador.value, this.motivoDevolucion.value.codigo).subscribe((data: any) => {
                this.loadingSubject.next(false);
                if (data.entidad) {
                  //console.log('El nuevo estado -> ',data.entidad.estadoProceso);
                  this.router.navigate(['aprobador']);
                } else {
                  this.sinNotSer.setNotice('Error actualizando el credito', 'error');
                }
              });
            }
          });
        } else {
          this.loadingSubject.next(false);
          this.sinNotSer.setNotice('SE CANCELO LA ACCION', 'error');
        }
      });
    } else {
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS DE RESULTADO DE OPERACION CORRECTAMENTE', 'error');
    }
  }
}