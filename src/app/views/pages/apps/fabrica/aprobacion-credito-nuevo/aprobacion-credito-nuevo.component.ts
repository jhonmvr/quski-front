import { ProcesoEnum } from './../../../../../core/enum/ProcesoEnum';
import { TbQoCreditoNegociacion } from './../../../../../core/model/quski/TbQoCreditoNegociacion';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource, MatStepper } from '@angular/material';
import { TbQoPatrimonioCliente } from '../../../../../core/model/quski/TbQoPatrimonioCliente';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { constructor } from 'lodash';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { TbQoNegociacion } from '../../../../../core/model/quski/TbQoNegociacion';
import { AprobacionWrapper } from '../../../../../core/model/wrapper/AprobacionWrapper';
import { FormControl, FormGroup } from '@angular/forms';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../../../../../../../src/environments/environment';
import { AuthDialogComponent } from './../../../../partials/custom/auth-dialog/auth-dialog.component';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { TbQoDireccionCliente } from '../../../../../core/model/quski/TbQoDireccionCliente';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { throwIfEmpty } from 'rxjs/operators';


@Component({
  selector: 'app-aprobacion-credito-nuevo',
  templateUrl: './aprobacion-credito-nuevo.component.html',
  styleUrls: ['./aprobacion-credito-nuevo.component.scss']
})
export class AprobacionCreditoNuevoComponent implements OnInit {
  // VARIABLES PUBLICAS  
  public loading;
  public usuario: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);

  // ENTIDADES

  public componenteVariable: boolean;
  public componenteRiesgo: boolean;

  public crediNegoW: AprobacionWrapper = null;
  private entidadCliente: TbQoCliente = null;
  private entidadProceso: TbQoProceso = null;
  private entidadNegociacion: TbQoNegociacion = null;
  private entidadExcepcion: TbQoExcepcion = null;
  private entidadDirecciones = new Array<TbQoDireccionCliente>();
  private entdidadPatrimonio = new Array<TbQoPatrimonioCliente>();
  private entidadIngresoEgreso = new Array<TbQoIngresoEgresoCliente>();
  private entidadReferencias = new Array<TbReferencia>();
  public entidadVariables = new Array<TbQoVariablesCrediticia>();
  private entidadRiesgos = new Array<TbQoRiesgoAcumulado>();
  private entidadJoyas = new Array<TbQoTasacion>();
  private entidadCreditoNegociacion: TbQoCreditoNegociacion = null;
  //private entidadTasacion: TbQoTasacion = null;

  // TABLA DE PATRIMONIO ACTIVO
  displayedColumnsPatrimonio = ['Accion', 'Activo', 'Avaluo', 'Pasivo', 'Ifis', 'Infocorp'];
  dataSourcePatrimonio = new MatTableDataSource<TbQoPatrimonioCliente>();

  // TABLA DE INGRESO EGRESO
  displayedColumnsII = ['Accion', 'Ingreso', 'Egreso'];
  dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();


  // TABLA DE REFERENCIAS PERSONALES
  displayedColumnsReferencia = ['Accion', 'N', 'NombresCompletos', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSourceReferencia = new MatTableDataSource<TbReferencia>();

  // TABLA DE VARIABLES CREDITICIAS
  public displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
  public dataSourceVariablesCrediticias = new MatTableDataSource<TbQoVariablesCrediticia>();

  // TABLA TASACION
  displayedColumnsTasacion = ['NumeroPiezas', 'TipoOro', 'TipoJoya', 'Estado', 'Descripcion', 'PesoBruto', 'DescuentoPiedra', 'DescuentoSuelda', 'PesoNeto', 'ValorAvaluo', 'ValorComercial', 'ValorRealizacion', 'ValorOro'];
  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();

  //

  // FORMULARIO INFORMACION OPERACION
  public formOperacion: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('', []);
  public proceso = new FormControl('', []);
  public cliente = new FormControl('', []);



  //  // FORMULARIO BUSQUEDA
  public formHabilitantes: FormGroup = new FormGroup({});



  //FORMULARIO DATOS PERSONALES CLIENTE 
  public formDatosPersonalesCliente: FormGroup = new FormGroup({});
  public tipoIdentificacion = new FormControl('', []);
  public ruc = new FormControl('', []);
  public aprobadoWeb = new FormControl('', []);
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

  //FORMULARIO DE CONTACTO DE CLIENTES
  public formDatosContactoCliente: FormGroup = new FormGroup({});
  public telefonoDomicilio = new FormControl('', []);
  public telefonoAdicional = new FormControl('', []);
  public telefonoMovil = new FormControl('', []);
  public telefonoOficina = new FormControl('', []);
  public correo = new FormControl('', []);

  // FORM DIRECCION DOMICILIO
  public formDatosDireccionDomicilio: FormGroup = new FormGroup({});
  public direccionLegal = new FormControl('', []);
  public direccionEnvioCorrespondencia = new FormControl('', []);
  public ubicacion = new FormControl('', []);
  public callePrincipal = new FormControl('', []);
  public numeracion = new FormControl('', []);
  public calleSecundaria = new FormControl('', []);
  public referencia = new FormControl('', []);
  public barrio = new FormControl('', []);
  public sector = new FormControl('', []);

  //FORM DIRECCION LABORAL
  public formDatosDireccionLaboral: FormGroup = new FormGroup({});
  public direccionLegalLaboral = new FormControl('', []);
  public direccionEnvioCorrespondenciaLaboral = new FormControl('', []);
  public ubicacionLaboral = new FormControl('', []);
  public callePrincipalLaboral = new FormControl('', []);
  public numeracionLaboral = new FormControl('', []);
  public calleSecundariaLaboral = new FormControl('', []);
  public referenciaLaboral = new FormControl('', []);
  public barrioLaboral = new FormControl('', []);
  public sectorLaboral = new FormControl('', []);
  public correoLaboral = new FormControl('', []);

  //FORM DATOS ECONOMICOS CLIENTE

  public formDatosEconomicosCliente: FormGroup = new FormGroup({});
  public origenIngresos = new FormControl('', []);
  public nombreEmpresa = new FormControl('', []);
  public actividadEconomicaCliente = new FormControl('', []);
  public relacionDependencia = new FormControl('', []);
  public cargo = new FormControl('', []);
  public profesion = new FormControl('', []);
  public ocupacion = new FormControl('', []);


  //FORM DATOS ADICIONALES DE LA OPERACION

  public formDatosAdicionalesOperacion: FormGroup = new FormGroup({});
  public tipoProceso = new FormControl('', []);
  public calificacionMupi = new FormControl('', []);
  public apareceraExcepciones = new FormControl('', []);

  //FORM DATOS TASACION CLIENTE

  public formTasacion: FormGroup = new FormGroup({});
  public numeroFunda = new FormControl('', []);
  public pesoFunda = new FormControl('', []);
  public pesoNeto = new FormControl('', []);
  public totalPesoBruto = new FormControl('', []);
  public totalPesoBrutoFunda = new FormControl('', []);
  public totalRealizacion = new FormControl('', []);
  public totalValorAvaluo = new FormControl('', []);
  public totalValorComercial = new FormControl('', []);


  //FORM DATOS CREDITO NUEVO

  public formCreditoNuevo: FormGroup = new FormGroup({});
  public montoPreaprobado = new FormControl('', []);
  public montoSolicitado = new FormControl('', []);
  public montoDiferido = new FormControl('', []);
  public plazo = new FormControl('', []);
  public tipoOperacion = new FormControl('', []);
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
  public montoDesembolsoBallon = new FormControl('', []);
  public aPagarCliente = new FormControl('', []);
  public riesgoTotalCliente = new FormControl('', []);
  public aRecibirCliente = new FormControl('', []);
  public netoAlCliente = new FormControl('', []);

  //FORM INSTRUCCION OPERATIVA
  public formInstruccionOperativa: FormGroup = new FormGroup({});
  public tipoCuenta = new FormControl('', []);
  public numeroCuenta = new FormControl('', []);
  public firmaRegularizada = new FormControl('', []);
  public diaPagoFijo = new FormControl('', []);
  public firmadaOperacion = new FormControl('', []);
  public tipoCliente = new FormControl('', []);


  //FORM DATOS DE LA OPERCION NUEVA
  public formDatosOperacionNueva: FormGroup = new FormGroup({});
  public tipoCartera = new FormControl('', []);
  public numeroOperacion = new FormControl('', []);
  public descripcionProducto = new FormControl('', []);
  public destinoOperacion = new FormControl('', []);
  public estadoOperacion = new FormControl('', []);
  public tipoOperacionNueva = new FormControl('', []);
  public plazoNueva = new FormControl('', []);
  public fechaVencimiento = new FormControl('', []);
  public fechaEfectiva = new FormControl('', []);
  public valorDesembolso = new FormControl('', []);
  public montoFinanciado = new FormControl('', []);
  public cuota = new FormControl('', []);
  public totalInteres = new FormControl('', []);
  public fechaTrabajoGad = new FormControl('', []);
  public capitalInteres = new FormControl('', []);

  //FORM RESULTADO OPERACION

  public formResultadoOperacion: FormGroup = new FormGroup({});
  public motivoDevolucion = new FormControl('', []);
  public codigoCash = new FormControl('', []);
  public observacionAsesor = new FormControl('', []);
  public observacionAprobador = new FormControl('', []);
  public radioB = new FormControl('', []);


  //OTROS
  cedula: any;

  fechaDeNacimiento: any;
  movil: any;

  email: any;
  campania: any;
  publicidad: any;
  aprobacionMupi: any;

  dataSourceCreditoNegociacion: MatTableDataSource<unknown>;


  idCreditoNegociacion: any;
  neg: any;
  cedulaCliente: any;
  cli: any;
  idCliente: any;
  identificacion: any;
  identificacionC: any;
  aprobadoWebMupi: any;





  ultimaFechaDeActualizacionDeCliente: any;
  dataPopup: any;


  motivoNoAceptacion: any;
  calificadoMupi: any;


  constructor(
    private cneg: CreditoNegociacionService,
    private sinNotSer: ReNoticeService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private noticeService: ReNoticeService,
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService
  ) {
    this.formOperacion.addControl('codigoOperacion', this.codigoOperacion);
    this.formOperacion.addControl('proceso', this.proceso);
    this.formOperacion.addControl('cliente', this.cliente);
  }

  ngOnInit() {
    // this.subheaderService.setTitle('Aprobación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.creditoNegociacion();
    // this.validarCreditoNegociacion(id);
    this.componenteVariable = false;
    this.componenteRiesgo = false;
  }


  creditoNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      data.params.id
      if (data.params.id) {
        this.idCreditoNegociacion = data.params.id;
        console.log('PARAMETRO=====> ', this.idCreditoNegociacion);
        this.cneg.traerCreditoNegociacionExistente(this.idCreditoNegociacion).subscribe((wrapper: any) => {
          console.log('NEGOCIACION traerCreditoNegociacionExistente ', JSON.stringify(wrapper));
          if (wrapper.entidad) {
            this.crediNegoW = wrapper.entidad;
            const situacion = this.crediNegoW.proceso.estadoProceso;

            console.log('ingresa al if creditoNegociacion')
            this.setearValores(this.crediNegoW);


          }












          this.entidadNegociacion = data.entidad;


          if (data.entidad) {



            this.cedulaCliente = data.entidad.tbQoCliente.cedulaCliente;
            this.cli.findClienteByIdentificacion(this.cedulaCliente).subscribe((data: any) => {
              // console.log('VALOR DE LA DATA==> findClienteByIdentificacion ', JSON.stringify(data));
              this.entidadCliente = data.entidad;
              this.loadingSubject.next(false);
              if (data) {
                // FORM OPERACION
                this.nombresCompletos.setValue(this.entidadCliente.primerNombre + ' ' + this.entidadCliente.segundoNombre
                  + ' ' + this.entidadCliente.apellidoPaterno + ' ' + this.entidadCliente.apellidoMaterno);
                this.idCliente = data.id;
                this.identificacion.setValue(this.entidadCliente.cedulaCliente);
                // this.buscarMensaje();
                // FORM CLIENTE
                this.identificacionC.setValue(this.entidadCliente.cedulaCliente);
                this.aprobadoWebMupi.setValue(this.entidadCliente.aprobacionMupi)
                this.primerNombre.setValue(this.entidadCliente.primerNombre);
                this.segundoNombre.setValue(this.entidadCliente.segundoNombre);
                this.separacionDeBienes.setValue(this.entidadCliente.separacionBienes);
                this.apellidoPaterno.setValue(this.entidadCliente.apellidoPaterno);
                this.apellidoMaterno.setValue(this.entidadCliente.apellidoMaterno);
                this.cargaFamiliar.setValue(this.entidadCliente.cargasFamiliares);
                this.genero.setValue(this.entidadCliente.genero);
                this.estadoCivil.setValue(this.entidadCliente.estadoCivil);
                this.lugarDeNacimiento.setValue(this.entidadCliente.lugarNacimiento);
                this.fechaDeNacimiento.setValue(new Date(this.entidadCliente.fechaNacimiento));
                this.nacionalidad.setValue(this.entidadCliente.nacionalidad);
                this.edad.setValue(this.entidadCliente.edad);
                this.nivelEducacion.setValue(this.entidadCliente.nivelEducacion);
                this.actividadEconomica.setValue(this.entidadCliente.actividadEconomica);
                this.ultimaFechaDeActualizacionDeCliente.setValue(new Date(this.entidadCliente.fechaActualizacion));

                // INPUT VARIABLES CREDITICIAS

                //INPUT RIESGO ACUMULADO

                // FORM CONTACTO
                this.telefonoDomicilio.setValue(this.entidadCliente.telefonoFijo);
                this.telefonoAdicional.setValue(this.entidadCliente.telefonoAdicional);
                this.telefonoMovil.setValue(this.entidadCliente.telefonoMovil);
                this.telefonoOficina.setValue(this.entidadCliente.telefonoTrabajo);
                this.correo.setValue(this.entidadCliente.email);
                //FORM DATOS NEGOCIACION
                //this.motivoNoAceptacion.setValue(this.entidadNegociacion.situacion);
                this.calificadoMupi.setValue(this.entidadCliente.aprobacionMupi);
              } else {
                this.sinNoticeService.setNotice('ERROR AL CARGAR CLIENTE 1', 'error');
              }
            }, error => {
              this.loadingSubject.next(false);
              if (JSON.stringify(error).indexOf("codError") > 0) {
                let b = error.error;
                this.sinNoticeService.setNotice(b.msgError, 'error');
              } else {
                this.sinNoticeService.setNotice('ERROR AL CARGAR CLIENTE 2', 'error');
              }
            });
          } else {
            this.sinNoticeService.setNotice('ERROR AL CARGAR NEGOCIACION', 'error');


          }
        });
      } else {
        this.sinNoticeService.setNotice('ERROR AL CARGAR EXCEPCION', 'error');


      }
    });
  }


  private setearValores(aprob: AprobacionWrapper) {
    //console.log('APRBACION EN SETEAR DATOS ==>', aprob.riesgos);

    this.entidadCliente = aprob.credito.tbQoNegociacion.tbQoCliente;
    this.entidadProceso = aprob.proceso;
    this.entidadDirecciones = aprob.direcciones;
    this.entdidadPatrimonio = aprob.patrimonios;
    this.entidadIngresoEgreso = aprob.ingresosEgresos;
    this.entidadReferencias = aprob.referencias;
    this.entidadVariables = aprob.variables;
    this.entidadRiesgos = aprob.riesgos;
    this.entidadJoyas = aprob.joyas;
    this.entidadCreditoNegociacion = aprob.credito;
    console.log('ENTIDAD JOYA=====>', this.entidadJoyas)
    //SETEO INFORMACION OPERACION 
    this.codigoOperacion.setValue(aprob.credito.codigo);
    this.proceso.setValue(aprob.proceso.proceso);
    this.cliente.setValue(aprob.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    // SETEO DE DATOS DE CONTACTO CLIENTE 
    this.tipoIdentificacion.setValue(this.entidadCliente.cedulaCliente);
    this.aprobadoWeb.setValue(this.entidadCliente.aprobacionMupi);
    this.nombresCompletos.setValue(this.entidadCliente.nombreCompleto);
    this.primerNombre.setValue(this.entidadCliente.primerNombre);
    this.segundoNombre.setValue(this.entidadCliente.segundoNombre);
    this.apellidoPaterno.setValue(this.entidadCliente.apellidoPaterno);
    this.apellidoMaterno.setValue(this.entidadCliente.apellidoMaterno);
    this.separacionDeBienes.setValue(this.entidadCliente.separacionBienes);
    this.genero.setValue(this.entidadCliente.genero);
    this.estadoCivil.setValue(this.entidadCliente.estadoCivil);
    this.cargaFamiliar.setValue(this.entidadCliente.cargasFamiliares);
    this.nacionalidad.setValue(this.entidadCliente.nacionalidad);
    this.lugarDeNacimiento.setValue(this.entidadCliente.lugarNacimiento);
    this.edad.setValue(this.entidadCliente.edad);
    this.fechaNacimiento.setValue(this.entidadCliente.fechaNacimiento);
    this.nivelEducacion.setValue(this.entidadCliente.nivelEducacion);
    this.actividadEconomica.setValue(this.entidadCliente.actividadEconomica);
    this.fechaUltimaActualizazion.setValue(this.entidadCliente.fechaActualizacion);

    //DATOS CONTACTO CLIENTE 

    this.telefonoDomicilio.setValue(this.entidadCliente.telefonoFijo);
    this.telefonoAdicional.setValue(this.entidadCliente.telefonoAdicional);
    this.telefonoMovil.setValue(this.entidadCliente.telefonoMovil);
    this.telefonoOficina.setValue(this.entidadCliente.telefonoTrabajo);
    this.correo.setValue(this.entidadCliente.email);

    //DIRECCION DOMICILIO Y LABORAL

    this.direccionLegal.setValue


    this.entidadDirecciones.forEach(e => {
      if (e.tipoDireccion == 'DOMICILIO') {
        this.direccionLegal.setValue(e.direccionLegal);
        this.direccionEnvioCorrespondencia.setValue(e.direccionEnvioCorrespondencia);
        //this.ubicacion.setValue(e.ubicacion);
        this.callePrincipal.setValue(e.callePrincipal);
        this.numeracion.setValue(e.numeracion);
        this.callePrincipal.setValue(e.callePrincipal);
        this.referencia.setValue(e.referenciaUbicacion);
        this.barrio.setValue(e.barrio);
        this.sector.setValue(e.sector);

      } else {
        this.direccionLegalLaboral.setValue(e.direccionLegal);
        this.direccionEnvioCorrespondenciaLaboral.setValue(e.direccionEnvioCorrespondencia);
        //this.ubicacion.setValue(e.ubicacion);
        this.callePrincipalLaboral.setValue(e.callePrincipal);
        this.numeracionLaboral.setValue(e.numeracion);
        this.callePrincipalLaboral.setValue(e.callePrincipal);
        this.referenciaLaboral.setValue(e.referenciaUbicacion);
        this.barrioLaboral.setValue(e.barrio);
        this.sectorLaboral.setValue(e.sector);
        console.log('VALORES DEL ARREGLO', e.tipoDireccion);
      }
    });

    //DATOS ECONOMICOS DEL CLIENTE
    this.origenIngresos.setValue(this.entidadCliente.origenIngreso);
    this.nombreEmpresa.setValue(this.entidadCliente.nombreEmpresa);
    this.actividadEconomicaCliente.setValue(this.entidadCliente.actividadEconomica);
    this.relacionDependencia.setValue(this.entidadCliente.relacionDependencia);
    this.cargo.setValue(this.entidadCliente.cargo);
    this.profesion.setValue(this.entidadCliente.profesion);
    this.ocupacion.setValue(this.entidadCliente.ocupacion);

    //DATOS PATRIMONIOS

    this.dataSourcePatrimonio = new MatTableDataSource(this.entdidadPatrimonio);

    //DATOS INGRESOS EGRESSOS

    this.dataSourceIngresoEgreso = new MatTableDataSource(this.entidadIngresoEgreso);

    //DATOS REFERENCIAS

    this.dataSourceReferencia = new MatTableDataSource(this.entidadReferencias);

    //DATOS VARIABLES
    this.componenteVariable = this.entidadVariables != null ? true : false;

    //DATOS RIESGO ACUMULADO
    this.componenteRiesgo = this.entidadRiesgos != null ? true : false;

    //DATOS TASACION

    this.dataSourceTasacion = new MatTableDataSource(this.entidadJoyas);
    //DATOS CREDITO NUEVO 
    this.montoPreaprobado.setValue(this.entidadCreditoNegociacion.montoPreaprobado);
    this.montoSolicitado.setValue(this.entidadCreditoNegociacion.montoSolicitado);
    this.montoDiferido.setValue(this.entidadCreditoNegociacion.montoDiferido);
    this.plazo.setValue(this.entidadCreditoNegociacion.plazoCredito);
    this.tipoOperacion.setValue(this.entidadCreditoNegociacion.tipo);
    this.tipoOferta.setValue(this.entidadProceso.proceso);
/*     this.costoCustodia.setValue(this.entidadCreditoNegociacion.costoCustodia);
    this.formaPagoCustodia.setValue(this.entidadCreditoNegociacion.formaPagoCustodia);
    this.costoTransporte.setValue(this.entidadCreditoNegociacion.costoTransporte);
    this.formaPagoTransporte.setValue(this.entidadCreditoNegociacion.formaPagoTransporte);
    this.costoValoracion.setValue(this.entidadCreditoNegociacion.costoValoracion);
    this.formaPagoValoracion.setValue(this.entidadCreditoNegociacion.formaPagoValoracion);
    this.costoTasacion.setValue(this.entidadCreditoNegociacion.costoTasacion);
    this.formaPagoTasacion.setValue(this.entidadCreditoNegociacion.formaPagoTasacion);
    this.costoResguardo.setValue(this.entidadCreditoNegociacion.costoResguardo);
    this.formaPagoResguardo.setValue(this.entidadCreditoNegociacion.formaPagoResguardo);
    this.costoSeguro.setValue(this.entidadCreditoNegociacion.costoSeguro);
    this.formaPagoSeguro.setValue(this.entidadCreditoNegociacion.formaPagoSeguro);
    this.solca.setValue(this.entidadCreditoNegociacion.solca);
    this.formaPagoSolca.setValue(this.entidadCreditoNegociacion.formaPagoSolca);
    this.montoDesembolsoBallon.setValue(this.entidadCreditoNegociacion.montoDesembolsoBallon); */
    this.aPagarCliente.setValue(this.entidadCreditoNegociacion.apagarCliente);
    this.riesgoTotalCliente.setValue(this.entidadCreditoNegociacion.riesgoTotalCliente);
    this.aRecibirCliente.setValue(this.entidadCreditoNegociacion.arecibirCliente);
    this.netoAlCliente.setValue(this.entidadCreditoNegociacion.netoAlCliente);






  }






  private validarCreditoNegociacion(id) {
    this.cneg.traerCreditoNegociacionExistente(id).subscribe((wrapper: any) => {
      if (wrapper.entidad.respuesta) {
        this.crediNegoW = wrapper.entidad;
        /* const situacion = this.crediNegoW.credito.tbQoNegociacion.situacion;
        if (situacion == SituacionEnum.EN_PROCESO) {
          // this.setearValores();
  
        } else {
          this.sinNotSer.setNotice('reintentando cerrar negoacion');
        } */
      }

    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar Credito Negociacion', 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: 'Error ' + error.statusText + ' - ' + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice('Error al cargar tipo oro', 'error');
      }
    });







  }








}



