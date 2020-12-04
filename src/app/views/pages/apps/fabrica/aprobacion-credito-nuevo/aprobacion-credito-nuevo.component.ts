import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { AprobacionWrapper } from '../../../../../core/model/wrapper/AprobacionWrapper';
import { CatalogosWrapper } from './../../../../../core/model/wrapper/CatalogosWrapper';
import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { ProcesoService } from './../../../../../core/services/quski/proceso.service';
import { OperacionAprobar } from '../../../../../core/model/softbank/OperacioAprobar';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { DatosRegistro } from '../../../../../core/model/softbank/DatosRegistro';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoPatrimonio } from '../../../../../core/model/quski/TbQoPatrimonio';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-aprobacion-credito-nuevo',
  templateUrl: './aprobacion-credito-nuevo.component.html',
  styleUrls: ['./aprobacion-credito-nuevo.component.scss']
})
export class AprobacionCreditoNuevoComponent implements OnInit {
  // VARIABLES PUBLICAS  
  public loading;
  public usuario: string;
  public agencia: number;
  public fechaActual: string;

  public loadingSubject = new BehaviorSubject<boolean>(false);
  public crediW: AprobacionWrapper;
  public catalogos: CatalogosWrapper;
  catMotivoDevolucionAprobacion: any;


  /** @OPERACION */
  public formDisable: FormGroup = new FormGroup({});
  public codigoBpm = new FormControl('', []);
  public proceso = new FormControl('', []);
  public nombresCompletoCliente = new FormControl('', []);

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
  public ubicacionLaboral= new FormControl('', []);
  public referenciaUbicacionLaboral= new FormControl('', []);
  public callePrincipalLaboral= new FormControl('', []);
  public numeracionLaboral= new FormControl('', []);
  public barrioLaboral= new FormControl('', []);
  public calleSecundariaLaboral= new FormControl('', []);
  public tipoViviendaLaboral= new FormControl('', []);
  public sectorLaboral= new FormControl('', []);
  public actividadEconomicaEmpresa = new FormControl('', []);
  public actividadEconomicaMupi = new FormControl('', []);
  public nombreEmpresa = new FormControl('', []);
  public origenIngresos = new FormControl('', []);
  public profesion = new FormControl('', []);
  public ocupacion = new FormControl('', []);
  public cargo = new FormControl('', []);
  public relacionDependencia = new FormControl('');

  displayedColumnsActivo = ['Activo', 'Avaluo'];
  displayedColumnsPasivo = ['Pasivo', 'Avaluo'];
  dataSourcePatrimonioActivo: MatTableDataSource<TbQoPatrimonio>;
  dataSourcePatrimonioPasivo: MatTableDataSource<TbQoPatrimonio>;
  displayedColumnsII = ['Is', 'Valor'];
  dataSourceIngresoEgreso: MatTableDataSource<TbQoIngresoEgresoCliente>;
  displayedColumnsReferencia = ['N', 'nombresRef', 'apellidosRef', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSourceReferencia = new MatTableDataSource<TbReferencia>();

  /** @DATOS_NEGOCIACION */
  public tipoProceso = new FormControl('', []);
  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();
  displayedColumnsTasacion = ['NumeroPiezas', 'TipoOro', 'TipoJoya', 'EstadoJoya', 'Descripcion','PesoBruto', 'DescuentoPesoPiedra', 'DescuentoSuelda', 'PesoNeto', 'precioOro', 'ValorAvaluo', 'ValorAplicable', 'ValorRealizacion', 'tienePiedras', 'detallePiedras', 'ValorOro'];
  public numeroFunda = new FormControl('', []);
  public tipoFunda = new FormControl('', []);

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

  /** @INSTRUCCION_OPERATIVA */
  public tipoCuenta = new FormControl('', []);
  public numeroCuenta = new FormControl('', []);
  public firmaRegularizada = new FormControl('', []);
  public diaPagoFijo = new FormControl('', []);
  public firmadaOperacion = new FormControl('', []);
  public tipoCliente = new FormControl('', []);

  /** @OPERACION_NUEVA */
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

  /** @RESULTADO_OPERACION */
  public formResultadoOperacion: FormGroup = new FormGroup({});
  public motivoDevolucion  = new FormControl('', []);
  public codigoCash  = new FormControl('', []);
  public observacionAprobador = new FormControl('', [Validators.required]);

  constructor(
    private cne: CreditoNegociacionService,
    private sof: SoftbankService,
    private pro: ProcesoService,
    private sinNotSer: ReNoticeService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private subheaderService: SubheaderService
  ) {
    this.formDisable.addControl( "codigoBpm", this.codigoBpm );
    this.formDisable.addControl( "proceso", this.proceso );
    this.formDisable.addControl( "nombresCompletoCliente", this.nombresCompletoCliente );
    this.formDisable.addControl( "identificacion", this.identificacion );
    this.formDisable.addControl( "aprobacionMupi", this.aprobacionMupi );
    this.formDisable.addControl( "nombresCompletos", this.nombresCompletos );
    this.formDisable.addControl( "primerNombre", this.primerNombre );
    this.formDisable.addControl( "segundoNombre", this.segundoNombre );
    this.formDisable.addControl( "apellidoPaterno", this.apellidoPaterno );
    this.formDisable.addControl( "apellidoMaterno", this.apellidoMaterno );
    this.formDisable.addControl( "separacionDeBienes", this.separacionDeBienes );
    this.formDisable.addControl( "genero", this.genero );
    this.formDisable.addControl( "estadoCivil", this.estadoCivil );
    this.formDisable.addControl( "cargaFamiliar", this.cargaFamiliar );
    this.formDisable.addControl( "nacionalidad", this.nacionalidad );
    this.formDisable.addControl( "lugarDeNacimiento", this.lugarDeNacimiento );
    this.formDisable.addControl( "edad", this.edad );
    this.formDisable.addControl( "fechaNacimiento", this.fechaNacimiento );
    this.formDisable.addControl( "nivelEducacion", this.nivelEducacion );
    this.formDisable.addControl( "actividadEconomica", this.actividadEconomica );
    this.formDisable.addControl( "fechaUltimaActualizazion", this.fechaUltimaActualizazion );
    this.formDisable.addControl( "telefonoDomicilio", this.telefonoDomicilio );
    this.formDisable.addControl( "telefonoMovil", this.telefonoMovil );
    this.formDisable.addControl( "telefonoOficina", this.telefonoOficina );
    this.formDisable.addControl( "correo", this.correo );
    this.formDisable.addControl( "direccionLegalDomicilio", this.direccionLegalDomicilio );
    this.formDisable.addControl( "direccionCorreoDomicilio", this.direccionCorreoDomicilio );
    this.formDisable.addControl( "ubicacion", this.ubicacion );
    this.formDisable.addControl( "barrio", this.barrio );
    this.formDisable.addControl( "sector", this.sector );
    this.formDisable.addControl( "callePrincipal", this.callePrincipal );
    this.formDisable.addControl( "numeracion", this.numeracion );
    this.formDisable.addControl( "calleSecundaria", this.calleSecundaria );
    this.formDisable.addControl( "referenciaUbicacion", this.referenciaUbicacion );
    this.formDisable.addControl( "tipoVivienda", this.tipoVivienda );
    this.formDisable.addControl( "direccionCorreoLaboral", this.direccionCorreoLaboral );
    this.formDisable.addControl( "direccionLegalLaboral", this.direccionLegalLaboral );
    this.formDisable.addControl( "ubicacionLaboral", this.ubicacionLaboral);
    this.formDisable.addControl( "referenciaUbicacionLaboral", this.referenciaUbicacionLaboral);
    this.formDisable.addControl( "callePrincipalLaboral", this.callePrincipalLaboral);
    this.formDisable.addControl( "numeracionLaboral", this.numeracionLaboral);
    this.formDisable.addControl( "barrioLaboral", this.barrioLaboral);
    this.formDisable.addControl( "calleSecundariaLaboral", this.calleSecundariaLaboral);
    this.formDisable.addControl( "tipoViviendaLaboral", this.tipoViviendaLaboral);
    this.formDisable.addControl( "sectorLaboral", this.sectorLaboral);
    this.formDisable.addControl( "actividadEconomicaEmpresa", this.actividadEconomicaEmpresa );
    this.formDisable.addControl( "actividadEconomicaMupi", this.actividadEconomicaMupi );
    this.formDisable.addControl( "nombreEmpresa", this.nombreEmpresa );
    this.formDisable.addControl( "origenIngresos", this.origenIngresos );
    this.formDisable.addControl( "profesion", this.profesion );
    this.formDisable.addControl( "ocupacion", this.ocupacion );
    this.formDisable.addControl( "cargo", this.cargo );
    this.formDisable.addControl( "relacionDependencia", this.relacionDependencia );
    this.formDisable.addControl( "tipoProceso", this.tipoProceso );
    this.formDisable.addControl( "numeroFunda", this.numeroFunda );
    this.formDisable.addControl( "tipoFunda", this.tipoFunda );
    this.formDisable.addControl( "plazo", this.plazo );
    this.formDisable.addControl( "tipoOferta", this.tipoOferta );
    this.formDisable.addControl( "costoCustodia", this.costoCustodia );
    this.formDisable.addControl( "formaPagoCustodia", this.formaPagoCustodia );
    this.formDisable.addControl( "costoTransporte", this.costoTransporte );
    this.formDisable.addControl( "formaPagoTransporte", this.formaPagoTransporte );
    this.formDisable.addControl( "costoValoracion", this.costoValoracion );
    this.formDisable.addControl( "formaPagoValoracion", this.formaPagoValoracion );
    this.formDisable.addControl( "costoTasacion", this.costoTasacion );
    this.formDisable.addControl( "formaPagoTasacion", this.formaPagoTasacion );
    this.formDisable.addControl( "costoResguardo", this.costoResguardo );
    this.formDisable.addControl( "formaPagoResguardo", this.formaPagoResguardo );
    this.formDisable.addControl( "costoSeguro", this.costoSeguro );
    this.formDisable.addControl( "formaPagoSeguro", this.formaPagoSeguro );
    this.formDisable.addControl( "solca", this.solca );
    this.formDisable.addControl( "formaPagoSolca", this.formaPagoSolca );
    this.formDisable.addControl( "aPagarCliente", this.aPagarCliente );
    this.formDisable.addControl( "aRecibirCliente", this.aRecibirCliente );
    this.formDisable.addControl( "totalCostoNuevaOperacion", this.totalCostoNuevaOperacion );
    this.formDisable.addControl( "tipoCuenta", this.tipoCuenta );
    this.formDisable.addControl( "numeroCuenta", this.numeroCuenta );
    this.formDisable.addControl( "firmaRegularizada", this.firmaRegularizada );
    this.formDisable.addControl( "diaPagoFijo", this.diaPagoFijo );
    this.formDisable.addControl( "firmadaOperacion", this.firmadaOperacion );
    this.formDisable.addControl( "tipoCliente", this.tipoCliente );
    this.formDisable.addControl( "tipoCartera", this.tipoCartera );
    this.formDisable.addControl( "tablaAmortizacion", this.tablaAmortizacion );
    this.formDisable.addControl( "numeroOperacion", this.numeroOperacion );
    this.formDisable.addControl( "descripcionProducto", this.descripcionProducto );
    this.formDisable.addControl( "estadoOperacion", this.estadoOperacion );
    this.formDisable.addControl( "fechaVencimiento", this.fechaVencimiento );
    this.formDisable.addControl( "fechaEfectiva", this.fechaEfectiva );
    this.formDisable.addControl( "valorDesembolso", this.valorDesembolso );
    this.formDisable.addControl( "montoFinanciado", this.montoFinanciado );
    this.formDisable.addControl( "cuota", this.cuota );
    this.formDisable.addControl( "totalInteres", this.totalInteres );

  }

  ngOnInit() {
    this.subheaderService.setTitle('Aprobación De Credito');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = 2;
    this.traerFecha();
    this.traerCreditoNegociacion();
    this.formDisable.disable();
  }
  private traerCatalogos() {
    this.loadingSubject.next(true);
    this.sof.traerCatalogos().subscribe((data: any) => {
      console.log('Catalogos --> ', data.entidad);
      if (data.entidad) {
        this.catalogos = data.entidad;
        this.catMotivoDevolucionAprobacion = this.catalogos.catMotivoDevolucionAprobacion;
        this.setearValores(this.crediW);     
       }else{
        this.loadingSubject.next(false);
        this.sinNotSer.setNotice('ERROR AL CARGAR CATALOGOS', 'error');
      }
    });
  }
  private traerCreditoNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        this.loadingSubject.next(true);
        this.cne.traerCreditoNegociacionExistente(data.params.id).subscribe((data: any) => {
          console.log('Credito --> ', data.entidad);
          if (!data.entidad.existeError) {
            this.crediW = data.entidad;
            this.traerCatalogos();
          }else{
            this.loadingSubject.next(false);
            this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO: '+ data.entidad.mensaje, 'error');
          }
        });
      } else {
        this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO', 'error');
      }
    });
  }
  private traerFecha(){
    this.sof.getSystemDate().subscribe( (hora: any) =>{
      if (hora.entidad) {
        this.fechaActual = hora.entidad;
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
    this.aprobacionMupi.setValue(ap.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi);
    this.nombresCompletos.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    this.primerNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.primerNombre);
    this.segundoNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.segundoNombre);
    this.apellidoPaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoPaterno);
    this.apellidoMaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoMaterno);
    this.separacionDeBienes.setValue(ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes ? ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes : 'NO APLICA' );
    this.genero.setValue(ap.credito.tbQoNegociacion.tbQoCliente.genero);
    this.estadoCivil.setValue(ap.credito.tbQoNegociacion.tbQoCliente.estadoCivil);
    this.cargaFamiliar.setValue(ap.credito.tbQoNegociacion.tbQoCliente.cargasFamiliares);
    this.nacionalidad.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nacionalidad);
    this.lugarDeNacimiento.setValue(ap.credito.tbQoNegociacion.tbQoCliente.lugarNacimiento);
    this.edad.setValue(ap.credito.tbQoNegociacion.tbQoCliente.edad);
    this.fechaNacimiento.setValue(ap.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento);
    this.nivelEducacion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nivelEducacion);
    this.actividadEconomica.setValue(ap.credito.tbQoNegociacion.tbQoCliente.actividadEconomica);
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
          this.ubicacionLaboral.setValue(this.catalogos.catDivicionPolitica.find(x => x.id == e.divisionPolitica));
          this.tipoViviendaLaboral.setValue(this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda));
          this.callePrincipalLaboral.setValue(e.callePrincipal.toUpperCase());
          this.barrioLaboral.setValue(e.barrio ? e.barrio.toUpperCase() : null);
          this.numeracionLaboral.setValue(e.numeracion.toUpperCase());
          this.calleSecundariaLaboral.setValue(e.calleSegundaria.toUpperCase());
          this.referenciaUbicacionLaboral.setValue(e.referenciaUbicacion.toUpperCase());
          this.sectorLaboral.setValue(this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector));
          this.direccionLegalLaboral.setValue(e.direccionLegal);
          this.direccionCorreoLaboral.setValue(e.direccionEnvioCorrespondencia);
        }
        if (e.tipoDireccion == "DOM") {
          this.ubicacion.setValue(this.catalogos.catDivicionPolitica.find(x => x.id == e.divisionPolitica));
          this.tipoVivienda.setValue(this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda));
          this.callePrincipal.setValue(e.callePrincipal);
          this.numeracion.setValue(e.numeracion);
          this.calleSecundaria.setValue(e.calleSegundaria);
          this.referenciaUbicacion.setValue(e.referenciaUbicacion);
          this.sector.setValue(this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector));
          this.barrio.setValue(e.barrio);
          this.direccionLegalDomicilio.setValue(e.direccionLegal);
          this.direccionCorreoDomicilio.setValue(e.direccionEnvioCorrespondencia);
        }
    });
    !ap.trabajos ? null : ap.trabajos.forEach( e=>{
      this.origenIngresos.setValue(this.catalogos.catOrigenIngreso.find(x => x.codigo == e.origenIngreso));
      this.relacionDependencia.setValue(e.esRelacionDependencia ? "SI" : "NO");
      this.nombreEmpresa.setValue(e.nombreEmpresa);
      this.cargo.setValue(this.catalogos.catCargo.find(x => x.codigo == e.cargo));
      this.ocupacion.setValue(this.catalogos.catOcupacion.find(x => x.codigo == e.ocupacion));
      this.actividadEconomicaMupi.setValue( this.catalogos.catActividadEconomicaMupi.find(x => x.codigo == e.actividadEconomicaMupi ));
      this.actividadEconomicaEmpresa.setValue(this.catalogos.catActividadEconomica.find(x => x.id.toString() == e.actividadEconomica));
      this.profesion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.profesion);
    });
    this.dataSourcePatrimonioActivo = new  MatTableDataSource<TbQoPatrimonio>();
    this.dataSourcePatrimonioPasivo = new  MatTableDataSource<TbQoPatrimonio>();
    this.dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();
    this.dataSourcePatrimonioActivo.data.push( new TbQoPatrimonio(ap.credito.tbQoNegociacion.tbQoCliente.activos, true) );
    this.dataSourcePatrimonioPasivo.data.push( new TbQoPatrimonio(ap.credito.tbQoNegociacion.tbQoCliente.pasivos, false) );
    this.dataSourceIngresoEgreso.data.push( new TbQoIngresoEgresoCliente( ap.credito.tbQoNegociacion.tbQoCliente.ingresos, true) );
    this.dataSourceIngresoEgreso.data.push( new TbQoIngresoEgresoCliente( ap.credito.tbQoNegociacion.tbQoCliente.egresos, false) );
    this.dataSourceReferencia.data = ap.referencias;
    this.numeroFunda.setValue( ap.credito.numeroFunda ) ;
    this.tipoFunda.setValue( ap.credito.codigoTipoFunda );
    this.dataSourceTasacion.data = ap.joyas;
    this.tipoProceso.setValue( ap.proceso.proceso );

    /** @DATOS_CREDITO_NUEVO */
    this.plazo.setValue( ap.credito.plazoCredito);
    this.tipoOferta.setValue( ap.credito.tipoOferta == "N" ? 'NUEVO' : ap.credito.tipoOferta);
    this.costoCustodia.setValue( ap.credito.costoCustodia);
    this.formaPagoCustodia.setValue( ap.credito.formaPagoCustodia);
    this.costoTransporte.setValue( ap.credito.costoTransporte);
    this.formaPagoTransporte.setValue( ap.credito.formaPagoTransporte);
    this.costoValoracion.setValue( ap.credito.costoValoracion);
    this.formaPagoValoracion.setValue( ap.credito.formaPagoValoracion);
    this.costoTasacion.setValue( ap.credito.costoTasacion);
    this.formaPagoTasacion.setValue( ap.credito.formaPagoTasador);
    this.costoResguardo.setValue( ap.credito);
    this.formaPagoResguardo.setValue( ap.credito);
    this.costoSeguro.setValue( ap.credito.costoSeguro);
    this.formaPagoSeguro.setValue( ap.credito.formaPagoSeguro);
    this.solca.setValue( ap.credito.impuestoSolca);
    this.formaPagoSolca.setValue( ap.credito.formaPagoImpuestoSolca);
    this.aPagarCliente.setValue( ap.credito.aPagarCliente);
    this.aRecibirCliente.setValue( ap.credito.aRecibirCliente);
    this.totalCostoNuevaOperacion.setValue( ap.credito.totalCostoNuevaOperacion);

    /** @DATOS_INSTRUCCION_OPERATIVA */
    this.tipoCuenta.setValue( ap.cuenta.banco );
    this.numeroCuenta.setValue( ap.cuenta.cuenta );
    this.firmaRegularizada.setValue( "No tengo" );
    this.diaPagoFijo.setValue( ap.credito.pagoDia );
    this.firmadaOperacion.setValue( ap.credito.firmanteOperacion );
    this.tipoCliente.setValue( "DEUDOR" );

    /** @OPERACION_NUEVA */
    this.tipoCartera.setValue( ap.credito.tipoCarteraQuski );
    this.tablaAmortizacion.setValue( ap.credito.tablaAmortizacion );
    this.numeroOperacion.setValue(  ap.credito.numeroOperacion );
    this.descripcionProducto.setValue( ap.credito.descripcionProducto );
    this.estadoOperacion.setValue( ap.credito.estadoSoftbank );
    this.fechaVencimiento.setValue( ap.credito.fechaVencimiento );
    this.fechaEfectiva.setValue( ap.credito.fechaEfectiva );
    this.valorDesembolso.setValue( ap.credito.montoDesembolso );
    this.montoFinanciado.setValue(  ap.credito.montoFinanciado );
    this.cuota.setValue( ap.credito.cuota );
    this.totalInteres.setValue(  ap.credito.saldoInteres );


    this.loadingSubject.next(false);
  }
  public aprobar(){
    if( this.observacionAprobador.value && this.codigoCash.value ){
      let mensaje = "Aprobar el credito: " + this.crediW.credito.codigo + ".";
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        this.loadingSubject.next(true);
        if(r){
          let datos  = new DatosRegistro( this.fechaActual, this.usuario, this.agencia );
          let wrapper: OperacionAprobar = new OperacionAprobar( this.crediW.credito.numeroOperacion, datos );
          this.sof.operacionAprobarCS( wrapper ).subscribe( (data: any) =>{
            if(!data.existeError){
              this.pro.cambiarEstadoProceso(this.crediW.credito.tbQoNegociacion.id,"NUEVO","APROBADO").subscribe( (data: any) =>{
                if(data.entidad){
                  console.log('El nuevo estado -> ',data.entidad.estadoProceso);
                  this.loadingSubject.next(false);
                  this.router.navigate(['aprobador']);  
                }else{
                  this.loadingSubject.next(false);
                  this.sinNotSer.setNotice('ERROR INTERNO','error');
                }
              });
            }else{
              this.loadingSubject.next(false);
              this.sinNotSer.setNotice('ERROR EN SOFTBANK','error');
            }
          }, error =>{
            this.loadingSubject.next(false);
            this.sinNotSer.setNotice('ERROR EN SOFTBANK','error');
          });
          
        }else{
          this.loadingSubject.next(false);
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','error');
        }
      });
    }else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS DE RESULTADO DE OPERACION CORRECTAMENTE','error');
    }
  }
  public devolver(){
    if( this.observacionAprobador.value && this.motivoDevolucion.value ){
      let mensaje = "Devolver a la negociacion el credito: " + this.crediW.credito.codigo + ".";
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        this.loadingSubject.next(true);
        if(r){
          this.pro.cambiarEstadoProceso(this.crediW.credito.tbQoNegociacion.id,"NUEVO","DEVUELTO").subscribe( (data: any) =>{
            if(data.entidad){
              console.log('El nuevo estado -> ',data.entidad.estadoProceso);
              this.loadingSubject.next(false);
              this.router.navigate(['aprobador']);  
            }
          });
        }else{
          this.loadingSubject.next(false);
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','error');
        }
      });
    }else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS DE RESULTADO DE OPERACION CORRECTAMENTE','error');
    }
  }
}