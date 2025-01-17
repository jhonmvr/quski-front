import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { ObjectStorageService } from '../../../../../core/services/object-storage.service';

import { AprobacionWrapper } from '../../../../../core/model/wrapper/AprobacionWrapper';
import { CatalogosWrapper } from '../../../../../core/model/wrapper/CatalogosWrapper';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { TrackingUtil } from '../../../../../core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../environments/environment';
import { TbQoPatrimonio } from '../../../../../core/model/quski/TbQoPatrimonio';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { LayoutConfigService } from '../../../../../core/_base/layout';

export interface CatalogoWrapper {
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-aprobacion-credito-nuevo',
  templateUrl: './aprobacion-credito-nuevo.component.html',
  styleUrls: ['./aprobacion-credito-nuevo.component.scss']
})
export class AprobacionCreditoNuevoComponent  extends TrackingUtil implements OnInit {
  // VARIABLES PUBLICAS  
  private divicionPolitica: CatalogoWrapper[];
  dataHistoricoObservacion;
  dataHistoricoOperativa;
  public usuario: string;
  srcFunda;
  srcJoya;
  public agencia: any;
  public fechaActual: string;
  public item;
  public varHabilitante = {proceso:'',referencia:''};
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public crediW: AprobacionWrapper;
  public catalogos: CatalogosWrapper;
  public catDivisionPoliticaByPais: Array<any>;
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
  public detalleWebMupi = new FormControl('', []);
  public lugarDeNacimiento = new FormControl('', []);
  public edad = new FormControl('', []);
  public fechaNacimiento = new FormControl('', []);
  public nivelEducacion = new FormControl('', []);
  public actividadEconomica = new FormControl('', []);
  public fechaUltimaActualizazion = new FormControl('', []);
  public telefonoDomicilio = new FormControl('', []);
  public telefonoMovil = new FormControl('', []);
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
  nombreApoderado = new FormControl('');
  identificacionApoderado = new FormControl('');
  fechaNacimientoApoderado = new FormControl('');
  nombreCodeudor = new FormControl('');
  identificacionCodeudor = new FormControl('');

  displayedColumnsActivo = ['Activo', 'Avaluo'];
  displayedColumnsPasivo = ['Pasivo', 'Avaluo'];
  dataSourcePatrimonioActivo: MatTableDataSource<TbQoPatrimonio>;
  dataSourcePatrimonioPasivo: MatTableDataSource<TbQoPatrimonio>;
  displayedColumnsII = ['Is', 'Valor'];
  dataSourceIngresoEgreso: MatTableDataSource<TbQoIngresoEgresoCliente>;
  displayedColumnsReferencia = ['N', 'nombresRef', 'apellidosRef', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSourceReferencia = new MatTableDataSource<TbReferencia>();

  /** @DATOS_NEGOCIACION */
  observacionAsesor = new FormControl('', []);
  public tipoProceso = new FormControl('', []);
  public numeroFunda = new FormControl('', []);
  public tipoFunda = new FormControl('', []);
  public totalPesoBrutoFunda = new FormControl('');

  /** @CREDITO_NUEVO */
  public plazo = new FormControl('', []);
  public tipoOferta = new FormControl('', []);
  public costoCustodia = new FormControl('', []);
  public formaPagoFideicomiso = new FormControl('', []);
  public costoFideicomiso = new FormControl('', []);

  public formaPagoCustodia = new FormControl('', []);
  public costoTransporte = new FormControl('', []);
  public formaPagoTransporte = new FormControl('', []);
  public costoValoracion = new FormControl('', []);
  public formaPagoValoracion = new FormControl('', []);
  public costoTasacion = new FormControl('', []);
  public formaPagoTasacion = new FormControl('', []);
  public custodiaDevengada = new FormControl('', []);
  public formaPagoCustodiaDevengada = new FormControl('', []);
  public costoSeguro = new FormControl('', []);
  public formaPagoSeguro = new FormControl('', []);
  public solca = new FormControl('', []);
  public formaPagoSolca = new FormControl('', []);
  public aPagarCliente = new FormControl('', []);
  public aRecibirCliente = new FormControl('', []);
  public totalCostoNuevaOperacion = new FormControl('', []);

  /** @INSTRUCCION_OPERATIVA */
  public tipoCuenta = new FormControl('', []);
  public excepcionOperativa = new FormControl('', []);
  public numeroCuenta = new FormControl('', []);
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
  fechaSistema = new FormControl('', []);
  /** @COMPROBANTES_DE_DESEMBOLSO */
  public institucionFinanciera: FormControl = new FormControl();
  public tipoDeCuenta: FormControl = new FormControl();
  public numeroDeCuenta: FormControl = new FormControl();
  /** @RESULTADO_OPERACION */
  public formResultadoOperacion: FormGroup = new FormGroup({});
  public motivoDevolucion  = new FormControl('', []);
  public codigoCash  = new FormControl('', []);
  public observacionAprobador = new FormControl('', [Validators.required]);

  constructor(
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private pro: ProcesoService,
    private layouteService: LayoutConfigService,
    private doc: DocumentoHabilitanteService,
    private obj: ObjectStorageService,
    private sinNotSer: ReNoticeService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    public tra: TrackingService
  ) {
    super(tra);
    this.cre.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();
    this.doc.setParameter();
    this.obj.setParameter();
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
    this.formDisable.addControl( "detalleWebMupi", this.detalleWebMupi );
    this.formDisable.addControl( "lugarDeNacimiento", this.lugarDeNacimiento );
    this.formDisable.addControl( "edad", this.edad );
    this.formDisable.addControl( "fechaNacimiento", this.fechaNacimiento );
    this.formDisable.addControl( "nivelEducacion", this.nivelEducacion );
    this.formDisable.addControl( "actividadEconomica", this.actividadEconomica );
    this.formDisable.addControl( "fechaUltimaActualizazion", this.fechaUltimaActualizazion );
    this.formDisable.addControl( "telefonoDomicilio", this.telefonoDomicilio );
    this.formDisable.addControl( "telefonoMovil", this.telefonoMovil );
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
    this.formDisable.addControl( "formaPagoFideicomiso", this.formaPagoFideicomiso );
    this.formDisable.addControl( "costoFideicomiso", this.costoFideicomiso );
    this.formDisable.addControl( "costoTransporte", this.costoTransporte );
    this.formDisable.addControl( "formaPagoTransporte", this.formaPagoTransporte );
    this.formDisable.addControl( "costoValoracion", this.costoValoracion );
    this.formDisable.addControl( "formaPagoValoracion", this.formaPagoValoracion );
    this.formDisable.addControl( "costoTasacion", this.costoTasacion );
    this.formDisable.addControl( "formaPagoTasacion", this.formaPagoTasacion );
    this.formDisable.addControl( "custodiaDevengada", this.custodiaDevengada );
    this.formDisable.addControl( "formaPagoCustodiaDevengada", this.formaPagoCustodiaDevengada );
    this.formDisable.addControl( "costoSeguro", this.costoSeguro );
    this.formDisable.addControl( "formaPagoSeguro", this.formaPagoSeguro );
    this.formDisable.addControl( "solca", this.solca );
    this.formDisable.addControl( "formaPagoSolca", this.formaPagoSolca );
    this.formDisable.addControl( "aPagarCliente", this.aPagarCliente );
    this.formDisable.addControl( "aRecibirCliente", this.aRecibirCliente );
    this.formDisable.addControl( "totalCostoNuevaOperacion", this.totalCostoNuevaOperacion );
    this.formDisable.addControl( "tipoCuenta", this.tipoCuenta );
    this.formDisable.addControl( "numeroCuenta", this.numeroCuenta );
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
    this.formDisable.addControl( "excepcionOperativa", this.excepcionOperativa );
    this.formDisable.addControl( "institucionFinanciera", this.institucionFinanciera );
    this.formDisable.addControl( "tipoDeCuenta", this.tipoDeCuenta );
    this.formDisable.addControl( "numeroDeCuenta", this.numeroDeCuenta );

  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();
    this.subheaderService.setTitle('Aprobación De Credito');
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );
    this.traerCreditoNegociacion();
    this.formDisable.disable();
    this.sof.fechasistema( this.agencia ).subscribe( ( data: any) =>{
      if( !data.existeError ){
        this.fechaSistema.setValue( data.fechaSistema  );
      }
    });
  }
  private traerCatalogos() {
    this.loadingSubject.next(true);
    this.sof.traerCatalogos().subscribe((data: any) => {
      //console.log('Catalogos --> ', data.entidad);
      if (data.entidad) {
        this.catalogos = data.entidad;
        this.catMotivoDevolucionAprobacion = this.catalogos.catMotivoDevolucionAprobacion;
        const localizacion = this.catalogos.catDivicionPolitica;
        let bprovinces = localizacion.filter(e => e.tipoDivision == 'PROVINCIA');
        let bCantons = localizacion.filter(e => e.tipoDivision == 'CANTON');
        let bParroqui = localizacion.filter(e => e.tipoDivision == 'PARROQUIA');
        this.divicionPolitica = bParroqui.map(parro => {
          const cant = bCantons.find(c => c.id == parro.idPadre) || {};
          const pro = bprovinces.find(p => p.id == cant.idPadre) || {};
          return { nombre: parro.nombre + " / " + cant.nombre + " / " + pro.nombre, id: parro.id };
        });
        this.sof.consultarDivicionPoliticabyIdPais(this.crediW.credito.tbQoNegociacion.tbQoCliente.nacionalidad, true).subscribe((data: any) => {
          this.catDivisionPoliticaByPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.setearValores(this.crediW);
        });
       }else{
        this.loadingSubject.next(false);
        this.sinNotSer.setNotice('ERROR AL CARGAR CATALOGOS', 'error');
      }
    });
  }

  private findHistoricoObservacionByCredito(idCredito){
    this.cre.findHistoricoObservacionByIdCredito(idCredito).subscribe(result=>{
      this.dataHistoricoObservacion = result.entidades;
    });
  }
  private traerCreditoNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      this.pro.getCabecera(data.params.id,'NUEVO').subscribe(datosCabecera=>{
        this.layouteService.setDatosContrato(datosCabecera);
      });
      if (data.params.id) {
        this.item = data.params.id;
        this.varHabilitante.referencia= this.item;
        this.varHabilitante.proceso='NUEVO,FUNDA';
        this.loadingSubject.next(true);
        this.cre.findHistoricoOperativaByidNegociacion(data.params.id).subscribe((data: any) => {
          this.dataHistoricoOperativa = data.entidades;
        });
        this.cre.traerCreditoNegociacionExistente(data.params.id).subscribe((data: any) => {
          this.crediW = data.entidad;
          if(data.entidad && data.entidad.credito && data.entidad.credito.id){
            this.findHistoricoObservacionByCredito(data.entidad.credito.id);
          }
          this.traerCatalogos();
          if (data.entidad.existeError) {
            this.sinNotSer.setNotice('FALTAN DATOS EN EL CREDITO: '+ data.entidad.mensaje, 'warning');
          }
        });
      } else {
        this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO', 'error');
      }
    });
  }
  nombreCiudadSelect(nodo) {
    if (this.lugarDeNacimiento.value) {
      this.lugarDeNacimiento.setValue(this.lugarDeNacimiento.value + '/' + nodo.nombre);
    } else {
      let pais = (this.catalogos.catPais.find(x => x.id == this.crediW.credito.tbQoNegociacion.tbQoCliente.nacionalidad) ? this.catalogos.catPais.find(x => x.id == this.crediW.credito.tbQoNegociacion.tbQoCliente.nacionalidad).nombre : '') + '/';
      this.lugarDeNacimiento.setValue(pais + nodo.nombre);
    }
    if (nodo.hijo && nodo.hijo.length > 0) {
      this.nombreCiudadSelect(nodo.hijo[0]);
    }
  }
  findTreeByNode(node) {
    const x = this.catDivisionPoliticaByPais.find(p => p.id == node.idPadre);
    if (x) {
      let element = {
        id: x.id,
        idPadre: x.idPadre,
        nombre: x.nombre,
        codigo: x.codigo,
        tipoDivision: x.tipoDivision,
        hijo: [node]
      }
      return this.findTreeByNode(element)
    } else {
      return node;
    }
  }
  private consultarLugarDeNacimiento(idLugar) {
    let lugar = this.catDivisionPoliticaByPais.find(x => x.id == idLugar);
    if(idLugar && lugar){
      let tree = this.findTreeByNode( lugar );
      this.nombreCiudadSelect( tree );
      return;
    }
  }
  private setearValores(ap: AprobacionWrapper) {
    /** @OPERACION */
    this.codigoBpm.setValue(ap.credito.codigo);
    this.proceso.setValue(ap.proceso.proceso);
    this.nombresCompletoCliente.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    /** @TRACKING */
    this.guardarTraking('NUEVO',
    ap ? ap.credito ? ap.credito.codigo : null : null, 
    ['Información Operación','Datos Del Cliente','Datos De Negociación','Datos de crédito nuevo','Habilitantes','Resultado de la operación'], 
    0, 'APROBACION CREDITO NUEVO',
    ap ? ap.credito ? ap.credito.numeroOperacion : null : null )
    /** @DATOS_CLIENTE */
    this.nacionalidad.setValue(this.catalogos.catPais.find(c => c.id == ap.credito.tbQoNegociacion.tbQoCliente.nacionalidad) ? 
    this.catalogos.catPais.find(c => c.id == ap.credito.tbQoNegociacion.tbQoCliente.nacionalidad).nombre : 'Error de catalogo');
    this.consultarLugarDeNacimiento( ap.credito.tbQoNegociacion.tbQoCliente.lugarNacimiento );
    this.identificacion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.cedulaCliente);
    this.aprobacionMupi.setValue(ap.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi == 'S'? 'SI': 'NO' );
    this.detalleWebMupi.setValue(ap.credito.tbQoNegociacion.tbQoCliente.detalleWebMupi);
    this.nombresCompletos.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    this.primerNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.primerNombre);
    this.segundoNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.segundoNombre);
    this.apellidoPaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoPaterno);
    this.apellidoMaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoMaterno);
    this.separacionDeBienes.setValue(ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes ? ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes : 'NO APLICA' );
    this.genero.setValue( this.catalogos.catSexo.find( c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.genero).nombre );
    this.estadoCivil.setValue( this.catalogos.catEstadoCivil.find( c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.estadoCivil).nombre );
    this.cargaFamiliar.setValue(ap.credito.tbQoNegociacion.tbQoCliente.cargasFamiliares);
    this.edad.setValue(ap.credito.tbQoNegociacion.tbQoCliente.edad);
    this.fechaActual = ap.credito.fechaCreacion.toString();
    this.fechaNacimiento.setValue(ap.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento);
    this.nivelEducacion.setValue(this.catalogos.catEducacion.find( c => c.codigo ==  ap.credito.tbQoNegociacion.tbQoCliente.nivelEducacion).nombre);
    this.actividadEconomica.setValue( this.catalogos.catActividadEconomica.find(c => c.id == ap.credito.tbQoNegociacion.tbQoCliente.actividadEconomica ) ? 
    this.catalogos.catActividadEconomica.find(c => c.id == ap.credito.tbQoNegociacion.tbQoCliente.actividadEconomica ).nombre  : 'Error de catalogo');
    this.fechaUltimaActualizazion.setValue( ap.credito.tbQoNegociacion.tbQoCliente.fechaActualizacion );
    this.correo.setValue(ap.credito.tbQoNegociacion.tbQoCliente.email);
    !ap.telefonos ? null : ap.telefonos.forEach(e => {
      if (e.tipoTelefono == "CEL") {
        this.telefonoMovil.setValue(e.numero);
      }
      if (e.tipoTelefono == "DOM") {
        this.telefonoDomicilio.setValue(e.numero);
      }
    });
    !ap.direcciones ? null : ap.direcciones.forEach(e => {
        if (e.tipoDireccion == "OFI") {
          this.ubicacionLaboral.setValue(this.divicionPolitica.find(x => x.id == e.divisionPolitica) ?
          this.divicionPolitica.find(x => x.id == e.divisionPolitica).nombre : 'Error de catalogo');
          this.tipoViviendaLaboral.setValue(this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda) ?
          this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda).nombre : 'Error de catalogo');
          this.callePrincipalLaboral.setValue(e.callePrincipal.toUpperCase());
          this.barrioLaboral.setValue(e.barrio ? e.barrio.toUpperCase() : null);
          this.numeracionLaboral.setValue(e.numeracion.toUpperCase());
          this.calleSecundariaLaboral.setValue(e.calleSegundaria.toUpperCase());
          this.referenciaUbicacionLaboral.setValue(e.referenciaUbicacion.toUpperCase());
          this.sectorLaboral.setValue(this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector) ?
          this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector).nombre : 'Error de catalogo');
          this.direccionLegalLaboral.setValue(e.direccionLegal);
          this.direccionCorreoLaboral.setValue(e.direccionEnvioCorrespondencia);
        }
        if (e.tipoDireccion == "DOM") {
          this.ubicacion.setValue(this.divicionPolitica.find(x => x.id == e.divisionPolitica) ?
          this.divicionPolitica.find(x => x.id == e.divisionPolitica).nombre : 'Error de catalogo');
          this.tipoVivienda.setValue(this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda) ?
          this.catalogos.catTipoVivienda.find(x => x.codigo == e.tipoVivienda).nombre : 'Error de catalogo');
          this.callePrincipal.setValue(e.callePrincipal);
          this.numeracion.setValue(e.numeracion);
          this.calleSecundaria.setValue(e.calleSegundaria);
          this.referenciaUbicacion.setValue(e.referenciaUbicacion);
          this.sector.setValue(this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector) ?
          this.catalogos.catSectorvivienda.find(x => x.codigo == e.sector).nombre : 'Error de catalogo');
          this.barrio.setValue(e.barrio);
          this.direccionLegalDomicilio.setValue(e.direccionLegal);
          this.direccionCorreoDomicilio.setValue(e.direccionEnvioCorrespondencia);
        }
    });
    !ap.trabajos ? null : ap.trabajos.forEach( e=>{
      this.origenIngresos.setValue(this.catalogos.catOrigenIngreso.find(x => x.codigo == e.origenIngreso) ?
      this.catalogos.catOrigenIngreso.find(x => x.codigo == e.origenIngreso).nombre : 'Error de catalogo');
      this.relacionDependencia.setValue(e.esRelacionDependencia ? "SI" : "NO");
      this.nombreEmpresa.setValue(e.nombreEmpresa);
      this.cargo.setValue(this.catalogos.catCargo.find(x => x.codigo == e.cargo) ? 
      this.catalogos.catCargo.find(x => x.codigo == e.cargo).nombre: 'Error de catalogo');
      this.ocupacion.setValue(this.catalogos.catOcupacion.find(x => x.codigo == e.ocupacion) ? 
      this.catalogos.catOcupacion.find(x => x.codigo == e.ocupacion).nombre: 'Error de catalogo');
      this.actividadEconomicaMupi.setValue( this.catalogos.catActividadEconomicaMupi.find(x => x.codigo == e.actividadEconomicaMupi ) ? 
      this.catalogos.catActividadEconomicaMupi.find(x => x.codigo == e.actividadEconomicaMupi ).nombre: 'Error de catalogo');
      this.actividadEconomicaEmpresa.setValue(this.catalogos.catActividadEconomica.find(x => x.id.toString() == e.actividadEconomica) ? 
      this.catalogos.catActividadEconomica.find(x => x.id.toString() == e.actividadEconomica).nombre: 'Error de catalogo');
      this.profesion.setValue(this.catalogos.catProfesion.find( c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.profesion) ? 
      this.catalogos.catProfesion.find( c => c.codigo == ap.credito.tbQoNegociacion.tbQoCliente.profesion).nombre : 'Error de catalogo');
    });
    this.dataSourcePatrimonioActivo = new  MatTableDataSource<TbQoPatrimonio>();
    this.dataSourcePatrimonioPasivo = new  MatTableDataSource<TbQoPatrimonio>();
    this.dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();
    this.dataSourcePatrimonioActivo.data.push( new TbQoPatrimonio(ap.credito.tbQoNegociacion.tbQoCliente.activos, true) );
    this.dataSourcePatrimonioPasivo.data.push( new TbQoPatrimonio(ap.credito.tbQoNegociacion.tbQoCliente.pasivos, false) );
    this.dataSourceIngresoEgreso.data.push( new TbQoIngresoEgresoCliente( ap.credito.tbQoNegociacion.tbQoCliente.ingresos, true) );
    this.dataSourceIngresoEgreso.data.push( new TbQoIngresoEgresoCliente( ap.credito.tbQoNegociacion.tbQoCliente.egresos, false) );
    this.dataSourceReferencia.data = ap.referencias;
    this.dataSourceReferencia.data.forEach( e=>{
      e.parentesco = this.catalogos ? 
        this.catalogos.catTipoReferencia ?
          this.catalogos.catTipoReferencia.find(x => x.codigo == e.parentesco) ? 
            this.catalogos.catTipoReferencia.find( x => x.codigo == e.parentesco ).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
    });
    this.numeroFunda.setValue( ap.credito.numeroFunda ) ;
 
    this.tipoFunda.setValue( ap.credito.codigoTipoFunda ? this.catalogos ? this.catalogos.catTipoFunda ? this.catalogos.catTipoFunda.find(x => x.codigo==ap.credito.codigoTipoFunda ) ? this.catalogos.catTipoFunda.find(x => x.codigo == ap.credito.codigoTipoFunda ).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo');
    
    try{
      const x = Number(ap?ap.credito? ap.credito.codigoTipoFunda: 0: 0)+ Number(this.crediW.joyas.map(t=>t['pesoBruto']).reduce((r, n) =>r+n,0)) ;
      
      this.totalPesoBrutoFunda.setValue( x.toFixed(2) );
     }catch(e){
       console.log("error en la suma de funda y peso bruto");

     }
    this.tipoProceso.setValue( ap.proceso.proceso );
    /** @DATOS_CREDITO_NUEVO */
    this.plazo.setValue( ap.credito.plazoCredito);
    this.tipoOferta.setValue( ap.credito.tipoOferta == "N" ? 'NUEVO' : ap.credito.tipoOferta);
    this.costoCustodia.setValue( ap.credito.costoCustodia);
    this.formaPagoCustodia.setValue( ap.credito.formaPagoCustodia);
    this.formaPagoFideicomiso.setValue( ap.credito.formaPagoFideicomiso);
    this.costoFideicomiso.setValue( ap.credito.costoFideicomiso);
    this.costoTransporte.setValue( ap.credito.costoTransporte);
    this.formaPagoTransporte.setValue( ap.credito.formaPagoTransporte);
    this.costoValoracion.setValue( ap.credito.costoValoracion);
    this.formaPagoValoracion.setValue( ap.credito.formaPagoValoracion);
    this.costoTasacion.setValue( ap.credito.costoTasacion);
    this.formaPagoTasacion.setValue( ap.credito.formaPagoTasador);
    this.custodiaDevengada.setValue(ap.credito.custodiaDevengada);
    this.formaPagoCustodiaDevengada.setValue( ap.credito.formaPagoCustodiaDevengada);
    this.costoSeguro.setValue( ap.credito.costoSeguro);
    this.formaPagoSeguro.setValue( ap.credito.formaPagoSeguro);
    this.solca.setValue( ap.credito.impuestoSolca);
    this.formaPagoSolca.setValue( ap.credito.formaPagoImpuestoSolca);
    this.aPagarCliente.setValue( ap.credito.aPagarCliente);
    this.aRecibirCliente.setValue( ap.credito.aRecibirCliente);
    this.totalCostoNuevaOperacion.setValue( ap.credito.totalGastosNuevaOperacion);
    this.observacionAsesor.setValue(ap.credito.tbQoNegociacion.observacionAsesor);
    /** @DATOS_INSTRUCCION_OPERATIVA */
    this.tipoCuenta.setValue( ap.cuenta.banco ? this.catalogos ? this.catalogos.catBanco ? this.catalogos.catBanco.find( x => x.id == ap.cuenta.banco ) ? this.catalogos.catBanco.find( x => x.id == ap.cuenta.banco ).nombre : 'Error en catalogo' : 'Error en catalogo' : 'Error en catalogo' : 'Error en catalogo' );
    this.numeroCuenta.setValue( ap.cuenta.cuenta  );
    this.diaPagoFijo.setValue( ap.credito.pagoDia ? new Date(ap.credito.pagoDia) : 'No aplica');
    this.firmadaOperacion.setValue( ap.credito.firmanteOperacion ? ap.credito.firmanteOperacion  :  'Falta valdiar' );

    /** @OPERACION_NUEVA */
    this.tipoCartera.setValue( ap.credito.tipoCarteraQuski );
    this.tablaAmortizacion.setValue( ap.credito.tablaAmortizacion );
    this.numeroOperacion.setValue(  ap.credito.numeroOperacion );
    this.descripcionProducto.setValue( ap.credito.descripcionProducto );
    this.estadoOperacion.setValue( ap.credito.estadoSoftbank );
    this.fechaVencimiento.setValue( ap.credito.fechaVencimiento );
    this.fechaEfectiva.setValue( ap.credito.fechaEfectiva );
    this.valorDesembolso.setValue( ap.credito.aRecibirCliente );
    this.montoFinanciado.setValue(  ap.credito.montoFinanciado );
    this.cuota.setValue( ap.credito.cuota );
    this.totalInteres.setValue(  ap.credito.totalInteresVencimiento );
    this.nombreApoderado.setValue(ap.credito.nombreCompletoApoderado);
    this.identificacionApoderado.setValue(ap.credito.identificacionApoderado);
    this.fechaNacimientoApoderado.setValue(ap.credito.fechaNacimientoApoderado);
    this.nombreCodeudor.setValue(ap.credito.nombreCompletoCodeudor);
    this.identificacionCodeudor.setValue(ap.credito.identificacionCodeudor);
    /** @COMPROBANTE_DESEMBOLSO */
    console.log(this.catalogos.catBanco.find( x => x.id == ap.credito.desembolsoInstitucionFinanciera));
    this.institucionFinanciera.setValue(this.catalogos.catBanco.find( x => x.id == ap.credito.desembolsoInstitucionFinanciera)?this.catalogos.catBanco.find( x => x.id == ap.credito.desembolsoInstitucionFinanciera).nombre:'');
    this.tipoDeCuenta.setValue(ap.credito.desembolsoTipoCuenta);
    this.numeroDeCuenta.setValue(ap.credito.desembolsoNumeroCuenta);
    this.cargarFotoHabilitante('6','FUNDA',ap.credito.tbQoNegociacion.id ).subscribe(data=>{
      this.srcJoya = data;
    });
    this.cargarFotoHabilitante('7','FUNDA',ap.credito.tbQoNegociacion.id ).subscribe(data=>{
      this.srcFunda = data;
    });
    this.loadingSubject.next(false);
  }
  public enviarRespuesta( aprobar ){
    if( !this.observacionAprobador.value ){
      this.sinNotSer.setNotice('INGRESE LA OBSERVACION DEL APROBADOR','warning');
      return;
    }
    if( aprobar && !this.codigoCash.value ){
        this.sinNotSer.setNotice('INGRESE EL CODIGO CASH','warning');
        return;
    }
    if( !aprobar && !this.motivoDevolucion.value ){
      this.sinNotSer.setNotice('INGRESE EL MOTIVO DE DEVOLUCION','warning');
      return;
    }
    let mensaje = aprobar ? "Aprobar el credito: " + this.crediW.credito.codigo + "." : "Devolver a la negociacion el credito: " + this.crediW.credito.codigo + ".";
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        this.cre.aprobarNuevo(
          this.crediW.credito.id, 
          this.observacionAprobador.value, 
          aprobar? this.codigoCash.value: null,
          this.agencia,
          this.usuario,
          aprobar? null:  this.motivoDevolucion.value?JSON.stringify(this.motivoDevolucion.value.map((p) => {return p.nombre})):null,
          aprobar ).subscribe( (data: any) =>{
            if(!data.entidad){
              this.sinNotSer.setNotice('ERROR ENVIANDO LA RESPUESTA: ' + data.entidad, 'error');
            }
            if(aprobar && data.entidad && data.entidad.estadoProceso == 'APROBADO'){
              this.sinNotSer.setNotice(this.crediW.credito.codigo + ' FUE APROBADO.', 'success');
              this.router.navigate(['aprobador']);
            }
            if(!aprobar && data.entidad && data.entidad.estadoProceso == 'DEVUELTO'){
              this.sinNotSer.setNotice(this.crediW.credito.codigo + ' FUE DEVUELTO AL ASESOR.', 'success');
              this.router.navigate(['aprobador']);
            }


          });
      }else{
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','warning');
      }
    });
  }

  public regresar(){
    this.router.navigate(['aprobador']);  
  }

  cambiarHabilitantes(proceso,referencia){
    this.varHabilitante = {proceso:'',referencia:''};
    this.varHabilitante = {
      proceso:proceso,
      referencia:referencia
    };

  }

  private cargarFotoHabilitante(tipoDocumento, proceso, referencia):Observable<String> {
    //console.log("cargar documentos fotos",tipoDocumento, proceso, referencia);
    return this.doc.getHabilitanteByReferenciaTipoDocumentoProceso(tipoDocumento, proceso, referencia).pipe(switchMap(data=> 
         this.obj.getObjectById(data.entidad.objectId, this.obj.mongoDb, environment.mongoHabilitanteCollection).pipe(switchMap((dataDos: any) => {
          let file = JSON.parse( atob( dataDos.entidad ) );
          return of(file?file.fileBase64:'');
        }))
    ));
  }
}