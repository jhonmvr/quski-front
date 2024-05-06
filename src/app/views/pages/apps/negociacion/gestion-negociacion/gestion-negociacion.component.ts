import { SolicitudAutorizacionDialogComponent } from './../../../../partials/custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { SolicitudDeExcepcionesComponent } from './../../../../partials/custom/popups/solicitud-de-excepciones/solicitud-de-excepciones.component';
import { ErrorCargaInicialComponent } from './../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { DevolucionCreditoComponent } from './../../../../partials/custom/popups/devolucion-credito/devolucion-credito.component';
import { ListaExcepcionesComponent } from '../../../../partials/custom/secciones-generales/lista-excepciones/lista-excepciones.component';
import { VerCotizacionesComponent } from './../../../../partials/custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { TbQoVariablesCrediticia } from './../../../../../core/model/quski/TbQoVariablesCrediticia';
import { DataInjectExcepciones } from './../../../../../core/model/wrapper/DataInjectExcepciones';
import { TbQoCreditoNegociacion } from './../../../../../core/model/quski/TbQoCreditoNegociacion';
import { MatDialog, MatTableDataSource, MatStepper, MatVerticalStepper } from '@angular/material';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { NegociacionService } from './../../../../../core/services/quski/negociacion.service';
import { CalculadoraService } from './../../../../../core/services/quski/calculadora.service';
import { NegociacionWrapper } from './../../../../../core/model/wrapper/NegociacionWrapper';
import { ParametroService } from './../../../../../core/services/quski/parametro.service';
import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { TasacionService } from './../../../../../core/services/quski/tasacion.service';
import { RelativeDateAdapter } from './../../../../../core/util/relative.dateadapter';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { EstadoExcepcionEnum } from './../../../../../core/enum/EstadoExcepcionEnum';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { TbQoTasacion } from './../../../../../core/model/quski/TbQoTasacion';
import { YearMonthDay } from './../../../../../core/model/quski/YearMonthDay';
import { ValidateDecimal } from '../../../../../core/util/validator.decimal';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutConfigService } from '../../../../../../app/core/_base/layout/services/layout-config.service';
import { ProcesoService } from '../../../../../../app/core/services/quski/proceso.service';
import { runInThisContext } from 'vm';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DialogCargarAutorizacionComponent } from './dialog-cargar-autorizacion/dialog-cargar-autorizacion.component';
import { DocumentoHabilitanteService } from '../../../../../../app/core/services/quski/documento-habilitante.service';
import { Page } from "../../../../../../app/core/model/page";
import { ConfirmarAccionComponent } from '../../../../../../app/views/partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { ExcepcionOperativaService } from '../../../../../../app/core/services/quski/excepcion-operativa.service';


@Component({
  selector: 'kt-gestion-negociacion',
  templateUrl: './gestion-negociacion.component.html',
  styleUrls: ['./gestion-negociacion.component.scss']
})
export class GestionNegociacionComponent extends TrackingUtil implements OnInit {

  //excepciones
  excepciones = new Array();;
  // VARIABLES PUBLICAS
  selection = new SelectionModel<any>(true, []);
  public loadingTasacion;
  public usuario: string;
  public agencia: string;
  public loadTasacion = new BehaviorSubject<boolean>(false);
  public loadOpciones = new BehaviorSubject<boolean>(false);
  public loadBusqueda = new BehaviorSubject<boolean>(false);
  public loadVariables = new BehaviorSubject<boolean>(false);
  public validMupiButton = new BehaviorSubject<boolean>(false);
  

  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  // ENTIDADES
  negoW: NegociacionWrapper;
  public componenteVariable: boolean;
  public componenteRiesgo: boolean;
  // CATALOGOS
  public catPublicidad: Array<any> = ["--"];
  public catTipoJoya: Array<any>;
  public catTipoOro: Array<any>;
  public catEstadoJoya: Array<any>;
  catPais;
  catEstadoCredito;
  catMotivo;
  private catMotivoDevolucion: Array<any>;
  filteredPais: Observable<Pais[]>;
  public totalNumeroJoya: number;
  public totalPesoB: any;
  public totalPesoN: any;
  public totalDescgr: any;
  public totalValorA: number;
  public totalValorR: number;
  public totalValorC: number;
  public totalValorO: number;
  public codigoError: number;

  opcionCredito;

  // FORMULARIO BUSQUEDA
  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  // FORMULARIO CLIENTE
  public formDatosCliente: FormGroup = new FormGroup({});
  public cedula = new FormControl('', []);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public publicidad = new FormControl('', [Validators.required]);
  public fechaDeNacimiento = new FormControl('', [Validators.required]);
  motivo = new FormControl('', [Validators.required]);
  estadoCredito = new FormControl('', [Validators.required]);
  public edad = new FormControl('', [Validators.required, Validators.max(75), Validators.min(18)]);
  public edadCodeudor = new FormControl('', [Validators.required, Validators.max(64), Validators.min(18)]);
  public nacionalidad = new FormControl('', [Validators.required]);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public nombreReferido = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public telefonoReferido = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public email = new FormControl('', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)]);
  public campania = new FormControl('');
  public aprobacionMupi = new FormControl('', [Validators.required]);
  public detalleWebMupi= new FormControl('', []);
  public tipoCliente = new FormControl('', [Validators.required]);
  public identificacionApoderado = new FormControl('', [Validators.required]);
  public nombreApoderado = new FormControl('', [Validators.required]);
  public fechaNacimientoApoderado = new FormControl('', [Validators.required]);
  public fechaNacimientoCodeudor = new FormControl('', [Validators.required]);
  
  public identificacionCodeudor = new FormControl('', [Validators.required]);
  public nombreCodeudor = new FormControl('', [Validators.required]);
  // FORMULARIO TASACION
  public formTasacion: FormGroup = new FormGroup({});
  public tipoOro = new FormControl('', [Validators.required]);
  public pesoNeto = new FormControl('', [Validators.required, ValidateDecimal, Validators.min(0.1)]);
  public pesoBruto = new FormControl('', [Validators.required, ValidateDecimal]);
  public numeroPiezas = new FormControl('', [Validators.required, Validators.max(60)]);
  public tipoJoya = new FormControl('', [Validators.required]);
  public estado = new FormControl('', [Validators.required]);
  public descuentoPiedra = new FormControl('', [Validators.required, ValidateDecimal]);
  public descuentoSuelda = new FormControl('', [Validators.required, ValidateDecimal]);
  public valorOro = new FormControl('', [Validators.required]);
  public tienePiedras = new FormControl('', [Validators.required]);
  public detallePiedras = new FormControl('', [Validators.required]);
  public valorAplicable = new FormControl('', [Validators.required]);
  public valorAvaluo = new FormControl('', []);
  public valorRealizacion = new FormControl('', []);
  public descripcion = new FormControl('', [Validators.required]);
  public catTipoCliente;
  public formOpcionesCredito: FormGroup = new FormGroup({});
  public montoSolicitado = new FormControl('', [Validators.required, ValidateDecimal, Validators.min(0.01)]);
  public descuentoServicios = new FormControl('', [Validators.required, ValidateDecimal, Validators.min(0.01)]);

  public formOperacion: FormGroup = new FormGroup({});

  public tbQoCliente;
  clienteBloqueado = false;
  telefonoMovil;
  telefonoFijo;
  private elementJoya;

  dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>();
  displayedColumnsCreditoNegociacion = ['Accion', 'plazo', 'periodicidadPlazo', 'tipooferta', 'montoFinanciado', 'valorARecibir', 'cuota', 'totalGastosNuevaOperacion', 'costoCustodia', 'costoTransporte', 'costoTasacion', 'costoSeguro', 'costoFideicomiso', 'impuestoSolca'];
  riesgoTotal: any;
  coberturaExcepcionada;
  bloquearBusqueda: boolean;


  constructor(
    private sof: SoftbankService,
    private par: ParametroService,
    private cal: CalculadoraService,
    private neg: NegociacionService,
    private tas: TasacionService,
    private route: ActivatedRoute,
    private dh: DocumentoHabilitanteService,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService,
    private laytoutService: LayoutConfigService,
    private procesoService: ProcesoService,
    public tra: TrackingService,
    private excepcionOperativaService: ExcepcionOperativaService
  ) {
    super(tra);
    this.sof.setParameter();
    this.par.setParameter();
    this.cal.setParameter();
    this.neg.setParameter();
    this.tas.setParameter();
    this.dh.setParameter();
    this.procesoService.setParameter();
    //  RELACIONANDO FORMULARIO DE BUSQUEDA
    this.formBusqueda.addControl("identificacion", this.identificacion);
    //  RELACIONANDO FORMULARIO DE CLIENTE
    this.formDatosCliente.addControl("cedula", this.cedula);
    this.formDatosCliente.addControl("fechaNacimiento", this.fechaDeNacimiento);
    this.formDatosCliente.addControl("nombresCompletos", this.nombresCompletos);
    this.formDatosCliente.addControl("edad", this.edad);
    this.formDatosCliente.addControl("nacionalidad", this.nacionalidad);
    this.formDatosCliente.addControl("movil", this.movil);
    this.formDatosCliente.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formDatosCliente.addControl("email", this.email);
    this.formDatosCliente.addControl("campania", this.campania);
    this.formDatosCliente.addControl("publicidad", this.publicidad);
    this.formDatosCliente.addControl("tipoCliente",this.tipoCliente);
    //this.formDatosCliente.addControl("nombreReferido", this.nombreReferido);
    //this.formDatosCliente.addControl("telefonoReferido", this.telefonoReferido);
    this.formDatosCliente.addControl("aprobacionMupi", this.aprobacionMupi);
    //  RELACIONANDO FORMULARIO DE TASACION
    this.formTasacion.addControl("numeroPiezas", this.numeroPiezas);
    this.formTasacion.addControl("tipoOro", this.tipoOro);
    this.formTasacion.addControl("tipoJoya", this.tipoJoya);
    this.formTasacion.addControl("estado", this.estado);
    this.formTasacion.addControl("pesoBruto", this.pesoBruto);
    this.formTasacion.addControl("descuentoPiedra", this.descuentoPiedra);
    this.formTasacion.addControl("descuentoSuelda", this.descuentoSuelda);
    this.formTasacion.addControl("descripcion", this.descripcion);
    this.formTasacion.addControl("pesoNeto", this.pesoNeto);
    this.formTasacion.addControl("valorOro", this.valorOro);
    this.formTasacion.addControl("tienePiedras", this.tienePiedras);
    this.formTasacion.addControl("detallePiedras", this.detallePiedras);


    this.formOpcionesCredito.addControl("montoSolicitado", this.montoSolicitado);
  }


  ngOnInit() {
    this.sof.setParameter();
    this.par.setParameter();
    this.cal.setParameter();
    this.neg.setParameter();
    this.tas.setParameter();
    this.procesoService.setParameter();
    this.subheaderService.setTitle('Negociación');
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem('idAgencia');
    this.loadCatalogo();
   // this.obtenerCatalogosCore();
    this.componenteVariable = false;
    this.componenteRiesgo = false;
    this.desactivarCampos();
    this.inicioDeFlujo();

  }
  public loadCatalogo() {
    
    this.neg.getAllPublicidad().subscribe((data:any)=>{
      if (data.list) {
        data.list.forEach(element => {
          this.catPublicidad.push(element);
        });
      } else {
        this.catPublicidad.push("CATALOGO NO CARGADO");
      }
    });

    this.par.findByTipo('CREDITO_ESTADO').subscribe( (data: any)=>{ 
      this.catEstadoCredito = data.entidades;
    },error=>{

      this.catEstadoCredito = null;
    });
    this.sof.consultarPaisCS().subscribe((data: any) => {
      this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarMotivoDevolucionAprobacionCS().subscribe((data: any) => {
      this.catMotivoDevolucion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarTipoJoyaCS().subscribe((data: any) => {
      this.catTipoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarEstadoJoyaCS().subscribe((data: any) => {
      this.catEstadoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarTipoClienteCS().subscribe( data =>{
      this.catTipoCliente = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
  }
  /** ********************************************* @ENTRADA ********************* **/

  cargarMotivo(estadoCredito){
    this.par.findByTipo(estadoCredito.value? estadoCredito.value.valor:'').subscribe( (data: any)=>{ 
      this.catMotivo = data.entidades;
      this.motivo.enable();
      this.motivo = new FormControl('', [Validators.required]);
    },error=>{
      this.sinNotSer.setNotice('NO TIENE MOTIVOS','clear');
      this.catMotivo = null;
      this.motivo.disable();
    });
  }
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.id && json.params.origen) {
        this.myStepper.selectedIndex = 1;
        
        if (json.params.origen == "NEG") {
          this.validarNegociacion(json.params.id);
          this.procesoService.getCabecera(json.params.id,'NUEVO').subscribe(datos=>{
            this.laytoutService.setDatosContrato(datos);
          });
        } else if (json.params.origen == "COT") {
          //this.iniciarNegociacionFromCot(json.params.id);
        } else {
          this.salirDeGestion("Error al intentar ingresar a la Negociacion.");
        }
      }
    });
  }
  private validarNegociacion(id) {
    this.neg.traerNegociacionExistente(id).subscribe((wrapper: any) => {
      
      if (wrapper.entidad.respuesta) {
        this.negoW = wrapper.entidad;
        this.consultarHabilitanteAutoricacion(this.negoW.credito.tbQoNegociacion.id);

        if(this.negoW.proceso.estadoProceso == 'CREADO'){
            if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 3) {
            this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false,true));
            //return;
          } else   if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 1) {
            this.clienteBloqueado = true;
            const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
              width: "800px",
              height: "auto",
              data: {
                mensaje: this.negoW.excepcionBre
                , titulo: 'CODIGO DE ERROR BRE: ' +this.negoW.codigoExcepcionBre
              }
            });
          
          }
        }
        
        //this.negoW.proceso.proceso == 'NUEVO' ? null : 
        this.negoW.proceso.estadoProceso == 'DEVUELTO' ? this.popupDevolucion() : null;
        this.negoW.proceso.estadoProceso == 'EXCEPCIONADO' ? this.validarExcepciones(this.negoW):'';
        this.negoW.proceso.estadoProceso == 'EXCEPCIONADO_OPERATIVA' ? this.validarExcepcionesOperativa(this.negoW):'';
        this.negoW.proceso.estadoProceso == 'PENDIENTE_EXCEPCION' ? this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.') :
        this.negoW.proceso.estadoProceso == 'PENDIENTE_EXCEPCION_OPERATIVA' ? this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.') :
          this.negoW.proceso.estadoProceso == 'PENDIENTE_APROBACION' ? this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.') : 
          this.negoW.proceso.estadoProceso == 'PENDIENTE_APROBACION_DEVUELTO' ? this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.') :
          this.negoW.proceso.estadoProceso == 'CADUCADO' ? this.salirDeGestion('CADUCADO.') : '';
        this.cargarValores(this.negoW, true);
      } else {
        this.salirDeGestion("La negociacion que esta buscando, no existe, fue cerrada o cancelada");
      }
    });
  }
  private validarExcepciones(tmp: NegociacionWrapper) {
    if (tmp.excepciones && tmp.excepciones.length > 0) {
      let listPendientes: TbQoExcepcion[] = null;
      let listInPendientes: TbQoExcepcion[] = null;
      tmp.excepciones.forEach(e => {
        if (e.estado == 'ACT' && e.estadoExcepcion == EstadoExcepcionEnum.NEGADO && e.tipoExcepcion == 'EXCEPCION_CLIENTE') {
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: 'Observacion Asesor: ' + e.observacionAsesor
                + '\n' + 'Observacion Aprobador: ' + e.observacionAprobador
              , titulo: 'EXCEPCION DE CLIENTE NEGADA'
            }
          });
          dialogRef.afterClosed().subscribe(r => {
            this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false,true));
            return;
          });
        } else if (e.estado == 'ACT' && e.estadoExcepcion == EstadoExcepcionEnum.NEGADO && e.tipoExcepcion == 'EXCEPCION_RIESGO') {
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: 'Observacion Asesor: ' + e.observacionAsesor
                + '\n' + 'Observacion Aprobador: ' + e.observacionAprobador
              , titulo: 'EXCEPCION DE RIESGO NEGADA'
            }
          });
          dialogRef.afterClosed().subscribe(r => {
            this.abrirPopupExcepcionesCliente(new DataInjectExcepciones(false, true, false,true,  e.mensajeBre));
            return;
          });
        } else if (e.estado == 'ACT' && e.estadoExcepcion == EstadoExcepcionEnum.NEGADO && e.tipoExcepcion == 'EXCEPCION_COBERTURA') {
         
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: 'Observacion Asesor: ' + e.observacionAsesor
                + '\n' + 'Observacion Aprobador: ' + e.observacionAprobador
              , titulo: 'EXCEPCION DE COBERTURA NEGADA'
            }
          });
          if(e.mensajeBre !== 'No aplica'){
            dialogRef.afterClosed().subscribe(r => {
              this.abrirPopupExcepcionesCliente(new DataInjectExcepciones(true, false, false, true, e.mensajeBre));
              return;
            });
          }
        } else if (e.estado == 'ACT' && e.estadoExcepcion == EstadoExcepcionEnum.APROBADO && e.tipoExcepcion == 'EXCEPCION_COBERTURA') {
          this.coberturaExcepcionada = tmp.credito.cobertura;
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: 'Observacion Asesor: ' + e.observacionAsesor
                + '\n' + 'Observacion Aprobador: ' + e.observacionAprobador
              , titulo: 'EXCEPCION DE COBERTURA'
            }
          });
          dialogRef.afterClosed().subscribe(r => {
            this.calcularOpciones(null);
          });
        } else if (e.estado == 'ACT' && e.estadoExcepcion == EstadoExcepcionEnum.APROBADO && e.tipoExcepcion == 'EXCEPCION_RIESGO') {
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: 'Observacion Asesor: ' + e.observacionAsesor
                + '\n' + 'Observacion Aprobador: ' + e.observacionAprobador
              , titulo: 'EXCEPCION DE RIESGO APROBADA'
            }
          });
          dialogRef.afterClosed().subscribe(r => {
            this.riesgoTotal = 0;
            this.calcularOpciones(null);
          });
        } else if (e.estado == 'ACT' && e.estadoExcepcion == EstadoExcepcionEnum.APROBADO && e.tipoExcepcion == 'EXCEPCION_CLIENTE') {
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: 'Observacion Asesor: ' + e.observacionAsesor
                + '\n' + 'Observacion Aprobador: ' + e.observacionAprobador
              , titulo: 'EXCEPCION DE CLIENTE APROBADA'
            }
          });
        }
      });
    }
  }
  private validarExcepcionesOperativa(tmp: NegociacionWrapper) {
    this.excepcionOperativaService.findByNegociacionAndTipo(tmp.credito.tbQoNegociacion.id,'Cobranza y servicios','APROBADO').subscribe(e=>{
      const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
        width: "800px",
        height: "auto",
        data: {
          mensaje: 'Observacion Aprobador: ' + e.observacionAprobador,
           titulo: 'EXCEPCION ' +e. estadoExcepcion
        }
      });
      dialogRef.afterClosed().subscribe(r => {
        //this.calcularOpciones(null);
        this.descuentoServicios.setValue(e.montoInvolucrado);
      });
    });
    
  }

  private iniciarNegociacionFromCot(id: number) {
    this.neg.iniciarNegociacionFromCot(id, this.usuario, this.agencia).subscribe((wrapper: any) => {
      if (wrapper.entidad.respuesta) {
        this.negoW = wrapper.entidad;
        if(this.negoW && this.negoW.credito && this.negoW.credito.tbQoNegociacion){
          this.procesoService.getCabecera(this.negoW.credito.tbQoNegociacion.id,'NUEVO').subscribe(datos=>{
            this.laytoutService.setDatosContrato(datos);
          });
        }
        if (!this.negoW.excepcionBre) {
          this.cargarValores(this.negoW, true);
        } else {
          this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false,true));
        }
      } else {
        this.limpiarCamposBusqueda();
        this.sinNotSer.setNotice('NO SE PUDO INICIAR NEGOCIACION, CLIENTE NO ENCONTRADO EN EQUIFAX', 'error')
      }
    });
  }
  /** ********************************************* @PARTE_1 ********************* **/
  public buscarCliente() {
    console.log("this.formBusqueda",this.formBusqueda);
    if (this.formBusqueda.invalid) {
      this.sinNotSer.setNotice('INGRESE UN NUMERO DE CEDULA VALIDO', 'warning');
     // return;
    }
    this.loadBusqueda.next(true);
    this.neg.iniciarNegociacion(this.identificacion.value, this.usuario, this.agencia).subscribe((wrapper: any) => {
      if (wrapper.entidad.respuesta) {
        this.limpiarNegociacion();
        this.loadBusqueda.next(false);
        this.negoW = wrapper.entidad;
        this.cargarValores(this.negoW, false);
        this.myStepper.selectedIndex = 1;
        this.cargarComponenteHabilitante();
        if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 3) {
          this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false,true));
          return;
        } else   if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 1) {
          this.clienteBloqueado = true;
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: this.negoW.excepcionBre
              , titulo: 'CODIGO DE ERROR BRE: ' +this.negoW.codigoExcepcionBre
            }
          });
         
        }
      } else {
        this.limpiarCamposBusqueda();
        this.sinNotSer.setNotice('NO SE PUDO INICIAR NEGOCIACION, CLIENTE NO ENCONTRADO EN EQUIFAX', 'error')
        
      }
    });
  }
  private iniciarNegociacionEquifax(cedula: string) {
    this.neg.iniciarNegociacionEquifax(cedula, this.usuario, this.agencia).subscribe((wrapper: any) => {
      if (wrapper.entidad.respuesta) {
        this.limpiarNegociacion();
        this.negoW = wrapper.entidad;
        this.myStepper.selectedIndex = 1;
        if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 3) {
          this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false,true));
          return;
        } else   if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 3) {
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {
              mensaje: this.negoW.excepcionBre
              , titulo: 'CODIGO DE ERROR BRE: ' +this.negoW.codigoExcepcionBre
            }
          });
         
        }
        this.cargarValores(this.negoW, false);
      } else {
        this.limpiarCamposBusqueda();
        this.sinNotSer.setNotice('NO SE PUDO INICIAR NEGOCIACION, CLIENTE NO ENCONTRADO EN EQUIFAX', 'error')
      }
    });
  }
  private limpiarNegociacion() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formDatosCliente.controls).forEach((name) => {
      const control = this.formDatosCliente.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formOpcionesCredito.controls).forEach((name) => {
      const control = this.formOpcionesCredito.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formTasacion.controls).forEach((name) => {
      const control = this.formTasacion.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.negoW = null;
    this.componenteRiesgo = false;
    this.componenteVariable = false;
    this.dataSourceCreditoNegociacion.data = null;
  }
  private limpiarCamposBusqueda() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
  }

  private cargarValores(wrapper: NegociacionWrapper, cargar: boolean) {
    this.bloquearBusqueda = true;
    this.tbQoCliente = wrapper.credito.tbQoNegociacion.tbQoCliente;
    this.cedula.setValue(this.tbQoCliente.cedulaCliente);
    this.identificacion.setValue(this.tbQoCliente.cedulaCliente);
    this.nombresCompletos.setValue(this.tbQoCliente.nombreCompleto);
    this.fechaDeNacimiento.setValue(this.tbQoCliente.fechaNacimiento ? new Date(this.tbQoCliente.fechaNacimiento) : null);
    this.cargarEdad();
    this.nacionalidad.setValue(this.catPais ? this.catPais.find(p => p.id == this.tbQoCliente.nacionalidad) : null);
    if (wrapper.telefonoMovil) {
      this.movil.setValue(wrapper.telefonoMovil.numero);
      this.telefonoMovil = wrapper.telefonoMovil;
    }
    if (wrapper.telefonoDomicilio) {
      this.telefonoDomicilio.setValue(wrapper.telefonoDomicilio.numero);
      this.telefonoFijo = wrapper.telefonoDomicilio;
    }
    this.email.setValue(this.tbQoCliente.email);
    this.campania.setValue('');
    this.publicidad.setValue('');
    if(!cargar){
      
      this.findWebMupi();
    }else{
      this.aprobacionMupi.setValue(this.negoW.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi);
      this.detalleWebMupi.setValue(this.negoW.credito.tbQoNegociacion.tbQoCliente.detalleWebMupi);
      this.aprobacionMupi.disable();
      this.detalleWebMupi.disable();
    }
    
    this.publicidad.setValue(cargar ?  this.catPublicidad.find(p=>p.nombre == this.negoW.credito.tbQoNegociacion.tbQoCliente.publicidad )  : '');
    this.campania.setValue(cargar ? this.negoW.credito.tbQoNegociacion.tbQoCliente.campania : '');
    this.nombreReferido.setValue(this.negoW.referedio ? this.negoW.referedio.nombre: '');
    this.telefonoReferido.setValue(this.negoW.referedio ? this.negoW.referedio.telefono: '');
    this.componenteVariable = wrapper.variables != null ? true : false;
    this.componenteRiesgo = wrapper.riesgos != null ? true : false;
    //this.tipoCliente.setValue(this.catTipoCliente.find(x => x.codigo ==this.negoW.credito.tipoCliente) ); 
    this.tipoCliente.setValue({codigo:"DEU"}); 
    this.nombreApoderado.setValue(this.negoW.credito.nombreCompletoApoderado);
    this.nombreCodeudor.setValue(this.negoW.credito.nombreCompletoCodeudor);
    this.identificacionApoderado.setValue(this.negoW.credito.identificacionApoderado);
    this.identificacionCodeudor.setValue(this.negoW.credito.identificacionCodeudor);
    this.fechaNacimientoApoderado.setValue(this.negoW.credito.fechaNacimientoApoderado? new Date(this.negoW.credito.fechaNacimientoApoderado): null);
    this.fechaNacimientoCodeudor.setValue(this.negoW.credito.fechaNacimientoCodeudor? new Date(this.negoW.credito.fechaNacimientoCodeudor): null);
    
    this.cargarEdadCodeudor();
    this.riesgoTotal = 0;
    if (this.negoW.riesgos) {
      this.negoW.riesgos.forEach(element => {
        this.riesgoTotal = this.riesgoTotal + element.saldo;
      });
    }
    if (wrapper.joyas != null) {
      this.dataSourceCreditoNegociacion = new MatTableDataSource();
      let calculadora: any = {
        codigoTabla: this.negoW.credito.tablaAmortizacion,
        costoCustodia: this.negoW.credito.costoCustodia,
        costoFideicomiso: this.negoW.credito.costoFideicomiso,
        costoSeguro: this.negoW.credito.costoSeguro,
        costoTasacion: this.negoW.credito.costoTasacion,
        costoTransporte: this.negoW.credito.costoTransporte,
        costoValoracion: this.negoW.credito.costoValoracion,
        cuota: this.negoW.credito.cuota,
        custodiaDevengada: this.negoW.credito.custodiaDevengada,
        dividendoflujoplaneado: this.negoW.credito.dividendoFlujoPlaneado,
        dividendosprorrateoserviciosdiferido: this.negoW.credito.dividendoProrrateo,
        formaPagoCapital: this.negoW.credito.formaPagoCapital,
        formaPagoCustodia: this.negoW.credito.formaPagoCustodia,
        formaPagoCustodiaDevengada: this.negoW.credito.formaPagoCustodiaDevengada,
        formaPagoFideicomiso: this.negoW.credito.formaPagoFideicomiso,
        formaPagoGastoCobranza: this.negoW.credito.formaPagoGastoCobranza,
        formaPagoImpuestoSolca: this.negoW.credito.formaPagoImpuestoSolca,
        formaPagoInteres: this.negoW.credito.formaPagoInteres,
        formaPagoMora: this.negoW.credito.formaPagoMora,
        formaPagoSeguro: this.negoW.credito.formaPagoSeguro,
        formaPagoTasador: this.negoW.credito.formaPagoTasador,
        formaPagoTransporte: this.negoW.credito.formaPagoTransporte,
        formaPagoValoracion: this.negoW.credito.formaPagoValoracion,
        gastoCobranza: this.negoW.credito.gastoCobranza,
        impuestoSolca: this.negoW.credito.impuestoSolca,
        montoFinanciado: this.negoW.credito.montoFinanciado,
        montoPrevioDesembolso: this.negoW.credito.montoPrevioDesembolso,
        periodicidadPlazo: this.negoW.credito.periodicidadPlazo,
        periodoPlazo: this.negoW.credito.periodoPlazo,
        plazo: this.negoW.credito.plazoCredito,
        porcentajeflujoplaneado: this.negoW.credito.porcentajeFlujoPlaneado,
        saldoCapitalRenov: this.negoW.credito.saldoCapitalRenov,
        saldoInteres: this.negoW.credito.saldoInteres,
        saldoMora: this.negoW.credito.saldoMora,
        tipooferta: this.negoW.credito.tipoOferta,
        totalCostosOperacionAnterior: this.negoW.credito.totalCostosOperacionAnterior,
        totalGastosNuevaOperacion: this.negoW.credito.totalGastosNuevaOperacion,
        valorAPagar: this.negoW.credito.valorAPagar,
        valorARecibir: this.negoW.credito.valorARecibir
      }
      this.estadoCredito.setValue(this.catEstadoCredito.find(x=>x.nombre==this.negoW.credito.tbQoNegociacion.estadoCredito));
      let credito_estado = this.estadoCredito.value ? 
      (this.estadoCredito.value.valor === "CREDITO ESTADO " ? 
        this.estadoCredito.value.valor.replace(/\s/, '_').trim() : 
        this.estadoCredito.value.valor) : 
      '';
      this.par.findByTipo(credito_estado).subscribe( (data: any)=>{ 
        this.catMotivo = data.entidades;
        this.motivo.enable();
        this.motivo = new FormControl('', [Validators.required]);
        this.motivo.setValue(this.catMotivo.find(x=>x.nombre==this.negoW.credito.tbQoNegociacion.motivo));
      },error=>{
        this.sinNotSer.setNotice('','clear');
        this.catMotivo = null;
        this.motivo.disable();
      });
     
      this.dataSourceCreditoNegociacion.data.push(calculadora);
      this.seleccionarCredito(this.dataSourceCreditoNegociacion.data[0]);
      this.masterToggle(this.dataSourceCreditoNegociacion.data[0]);
      this.sinNotSer.setNotice("NEGOCIACION -> \"" + wrapper.credito.codigo + "\" Cargada correctamente.", "success");
    } else {
      this.sinNotSer.setNotice("SE HA INICIADO UNA NEGOCIACION -> \"" + wrapper.credito.codigo + "\". ", "success");
    }
    this.guardarTraking('NUEVO', this.negoW?this.negoW.credito?this.negoW.credito.codigo:'':'', 
    ['Busqueda de Cliente','Datos Cliente','Variables Crediticias','Riesgo Acumulado','Tasación','Detalle Opciones de crédito'], 
    0, 'NEGOCIACION', this.negoW?this.negoW.credito?this.negoW.credito.numeroOperacion:'':'')

  }
  public abrirPopupVerCotizacion(identificacion: string) {
    const dialogRefGuardar = this.dialog.open(VerCotizacionesComponent, {
      width: '1200px',
      height: 'auto',
      data: identificacion
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
    });
  }
  /** ********************************************* @POPUP ********************* **/
  public abrirSalirGestion(data: any) {
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "800px",
      height: "auto",
      data: data
    });
    dialogRef.afterClosed().subscribe(r => {
      this.router.navigate(['negociacion/bandeja-operaciones']);
    });
  }
  public popupDevolucion() {
    this.identificacion.disable();
    let entryData = {
      titulo: 'Algo',
      mensajeAprobador: this.negoW.credito.descripcionDevuelto,
      motivoDevolucion: this.negoW.credito.codigoDevuelto,
      aprobador: this.negoW.credito.tbQoNegociacion.aprobador,
      codigoBpm: this.negoW.credito.codigo
    }
    const dialogRef = this.dialog.open(DevolucionCreditoComponent, {
      width: "800px",
      height: "auto",
      data: entryData
    });
  }
  public abrirPopupExcepciones(data: DataInjectExcepciones = null) {
    if (data == null) {
      data = new DataInjectExcepciones(false, false, true);
    }
    data.mensajeBre = this.negoW.excepcionBre;
    data.idNegociacion = this.negoW.credito.tbQoNegociacion.id;
    this.excepciones.push(data);
    const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
      width: '800px',
      height: 'auto',
      data: data
    });
    dialogRefGuardar.afterClosed().subscribe((result: any) => {
      if (result) {
        this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.', 'EXCEPCION SOLICITADA');
      } else {
        if (data.isCobertura) {
          this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'warning');
        } else {
          //this.salirDeGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION', 'NEGOCIACION CANCELADA');
        }
      }
    });
  }
  public abrirPopupExcepcionesCliente(data: DataInjectExcepciones = null) {
    if (data == null) {
      data = new DataInjectExcepciones(false, false, true);
    }
    //data.mensajeBre = this.negoW.excepcionBre;
    data.idNegociacion = this.negoW.credito.tbQoNegociacion.id;
    this.excepciones.push(data);
    const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
      width: '800px',
      height: 'auto',
      data: data
    });
    dialogRefGuardar.afterClosed().subscribe((result: any) => {
      if (result) {
        this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.', 'EXCEPCION SOLICITADA');
      } else {
        if (data.isCobertura) {
          this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'warning');
        } else {
          //this.salirDeGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION', 'NEGOCIACION CANCELADA');
        }
      }
    });
  }
  solicitarExcepcionServicios(){
    if(this.descuentoServicios.invalid){
      this.sinNotSer.setNotice('Complete el valor de descuento', 'warning');
      return;
    } 
    if (this.negoW.joyas && this.negoW.joyas.length > 0) {
    
      const dialogRefGuardar = this.dialog.open(ConfirmarAccionComponent, {
        width: '800px',
        height: 'auto',
        data: 'Solicitar excepcion de servicios'
      });
      dialogRefGuardar.afterClosed().subscribe((result: any) => {
        if (result) {
          let excepcionServicios = {
            "idNegociacion": this.negoW.credito.tbQoNegociacion,
            "codigoOperacion": this.negoW.credito.codigo,
            "tipoExcepcion": "Cobranza y servicios",
            "estadoExcepcion": "PENDIENTE",
            "montoInvolucrado": this.descuentoServicios.value,
            "usuarioSolicitante": localStorage.getItem("reUser"),
            "observacionAsesor": "",
            };
          this.excepcionOperativaService.solicitarExcepcionServicios(excepcionServicios,"NUEVO").subscribe(p=>{
            this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.', 'EXCEPCION SOLICITADA');
          });
          
        } else {
          this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'warning');
        }
      });
    } else {
      this.sinNotSer.setNotice('REGISTRE ALMENOS UNA JOYA EN TASACION', 'warning');
    }
  }
  solicitarCobertura() {
    let x ;
    if(this.excepciones.length > 0){
      x = this.excepciones.find(p=>p.isCliente);
    }
    if (this.negoW.joyas && this.negoW.joyas.length > 0) {
      let data = new DataInjectExcepciones(false, false, true, false);
      data.mensajeBre = x?x.mensajeBre:null;
      data.idNegociacion = this.negoW.credito.tbQoNegociacion.id;
      this.excepciones.push(data);
      const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
        width: '800px',
        height: 'auto',
        data: data
      });
      dialogRefGuardar.afterClosed().subscribe((result: any) => {
        if (result) {
          this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.', 'EXCEPCION SOLICITADA');
        } else {
          if (data.isCobertura) {
            this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'warning');
          } else {
            //this.salirDeGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION', 'NEGOCIACION CANCELADA');
          }
        }
      });
    } else {
      this.sinNotSer.setNotice('REGISTRE ALMENOS UNA JOYA EN TASACION', 'warning');
    }
  }
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  private salirDeGestion(dataMensaje: string, dataTitulo?: string) {
    let pData = {

      mensaje: dataMensaje,
      titulo: dataTitulo ? dataTitulo : null
    }
    this.abrirSalirGestion(pData);
  }
  private limpiarCamposTasacion() {
    Object.keys(this.formTasacion.controls).forEach((name) => {
      const control = this.formTasacion.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.reset();
    });
    this.formTasacion.reset();
  }
  public getErrorMessageEdad() {
    const errorRequerido = 'Ingresar valores';
    const errorMin = 'No cumple la edad minima';
    const errorMax = 'No cumple la edad maxima';
    const input = this.formDatosCliente.get('edad');
    return input.hasError('required') ? errorRequerido : input.hasError('max') ? errorMax : input.hasError('min') ? errorMin : '';
  }
  public getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorNumero = 'Ingresar solo numeros';
    const maximo = "El maximo de caracteres es: ";
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    if (pfield && pfield === "identificacion") {
      const input = this.formBusqueda.get("identificacion");
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalid-identification")
            ? invalidIdentification
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : input.hasError("minlength")
                ? errorInsuficiente
                : "";
    }
    if (pfield && pfield === 'nombresCompletos') {
      const input = this.nombresCompletos;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'fechaDeNacimiento') {
      const input = this.fechaDeNacimiento;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'nacionalidad') {
      const input = this.nacionalidad;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formDatosCliente.get('telefonoDomicilio');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    }
    if (pfield && pfield == "email") {
      const input = this.email;
      return input.hasError('required') ? errorRequerido : this.email.hasError('email') ? 'E-mail no valido' : this.email.hasError('maxlength') ? maximo + this.email.errors.maxlength.requiredLength : this.email.hasError('pattern') ? 'El formato del correo electrónico no es válido' : '';
    }
    if (pfield && pfield == "aprobacionMupi") {
      const input = this.email;
      return input.hasError('required') ? errorRequerido : '';
    }

    if (pfield && pfield === 'movil') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : input.hasError('pattern') ? errorNumero : input.hasError('maxlength') ? errorLogitudExedida : input.hasError('minlength') ? errorInsuficiente : '';
    }
    if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formDatosCliente.get('telefonoDomicilio');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    }
    if (pfield && pfield === 'tipoOro') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'numeroPiezas') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'pesoBruto') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'descuentoPiedra') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'descuentoSuelda') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'pesoNeto') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'tipoJoya') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'estado') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'tienePiedras') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'detallePiedras') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'descripcion') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'monto') {
      const input = this.montoSolicitado;
      return input.hasError('required') ? errorRequerido : '';
    }

  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  private desactivarCampos() {
    this.edad.disable();
    this.cedula.disable();
  }
  public cargarEdad() {
    if (this.fechaDeNacimiento.valid) {
      const fechaSeleccionada = new Date(this.fechaDeNacimiento.value);
      const convertFechas = new RelativeDateAdapter();
      this.par.getDiffBetweenDateInicioActual(convertFechas.format(fechaSeleccionada, "input"), "dd/MM/yyy").subscribe((rDiff: any) => {
        const diff: YearMonthDay = rDiff.entidad;
        this.edad.setValue(diff.year);
      });
    }
  }

  cargarEdadCodeudor(){
    if (this.fechaNacimientoCodeudor.valid) {
      const fechaSeleccionada = new Date(this.fechaNacimientoCodeudor.value);
      const convertFechas = new RelativeDateAdapter();
      this.par.getDiffBetweenDateInicioActual(convertFechas.format(fechaSeleccionada, "input"), "dd/MM/yyy").subscribe((rDiff: any) => {
        const diff: YearMonthDay = rDiff.entidad;
        this.edadCodeudor.setValue(diff.year);
        this.edadCodeudor.disable()
      });
    }
  }
  /** ********************************************* @CATALOGOS ********************* **/
  private obtenerCatalogosCore() {
    this.par.findByNombreTipoOrdered("", "PUB", "Y").subscribe((data: any) => {
      if (data && data.entidades) {
        data.entidades.forEach(element => {
          this.catPublicidad.push(element.valor);
        });
      } else {
        this.catPublicidad.push("CATALOGO NO CARGADO");
      }
    });
  }
  /** ********************************************** @TASASION ***************************************/
  public setPrecioOro() {
    if (this.tipoOro.value) {
      this.valorOro.setValue(this.tipoOro.value.valorOro)
    }
  }
  cargarJoya() {
    if (this.formTasacion.invalid) {
      this.sinNotSer.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
      return;
    }

    if (this.negoW == null || !this.negoW.credito || !this.negoW.credito.id) {
      this.sinNotSer.setNotice('COMPLETE CORRECTAMENTE LA INFORMACION DEL CLIENTE', 'warning');
      return;
    }
    if (this.negoW.excepciones && this.negoW.excepciones.find(ex => (ex.tipoExcepcion == 'EXCEPCION_COBERTURA' || ex.tipoExcepcion == 'EXCEPCION_RIESGO')
      && ex.estadoExcepcion == EstadoExcepcionEnum.APROBADO)) {
      if (!confirm("USTED TIENE UNA EXCEPCION APROBADA. SI CAMBIA LAS GARANTIAS ESTA EXCEPCION SE ANULARA")) {
        return;
      }
    }
    this.loadTasacion.next(true);
    this.selection = new SelectionModel<any>(true, []);
    let joya = new TbQoTasacion();
    joya.descripcion = this.descripcion.value;
    joya.descuentoPesoPiedra = this.descuentoPiedra.value;
    joya.descuentoSuelda = this.descuentoSuelda.value;
    joya.estadoJoya = this.estado.value.codigo;
    joya.numeroPiezas = this.numeroPiezas.value;
    joya.pesoBruto = this.pesoBruto.value;
    joya.pesoNeto = this.pesoNeto.value;
    joya.tipoJoya = this.tipoJoya.value.codigo;
    joya.tipoOro = this.tipoOro.value.codigo;
    joya.tienePiedras = this.tienePiedras.value == 'S' ? true : false;
    joya.detallePiedras = this.detallePiedras.value;
    joya.pesoNeto = Number((Number(joya.pesoBruto) - (Number(joya.descuentoPesoPiedra) + Number(joya.descuentoSuelda))).toFixed(2));
    joya.valorOro = this.valorOro.value;
    joya.valorRealizacion = this.valorRealizacion.value;
    joya.tbQoCreditoNegociacion = { id: this.negoW.credito.id };
    if (this.negoW.riesgos) {
      this.riesgoTotal = 0;
      this.negoW.riesgos.forEach(p => {
        this.riesgoTotal = this.riesgoTotal + p.saldo;
      })
    }
    if (this.elementJoya) {
      joya.id = this.elementJoya;
      this.elementJoya = null;
    }
    this.neg.agregarJoya(joya).subscribe((data: any) => {
      this.negoW.joyas = data.entidades;
      this.sinNotSer.setNotice('SE GUARDO LA JOYA TASADA', 'success');
      this.limpiarCamposTasacion();
      this.dataSourceCreditoNegociacion = new MatTableDataSource<any>();
      this.loadTasacion.next(false);
    });
  }
  editar(element: TbQoTasacion) {
    this.loadTasacion.next(true);
    let cliente = this.buildCliente();
    this.neg.verPrecios(cliente).subscribe(resp => {
      this.catTipoOro = resp.entidades;
      this.tipoOro.setValue(this.catTipoOro ? this.catTipoOro.find(t => t.codigo == element.tipoOro) ? this.catTipoOro.find(t => t.codigo == element.tipoOro) : '' : '');
      this.tipoJoya.setValue(this.catTipoJoya ? this.catTipoJoya.find(t => t.codigo == element.tipoJoya) ? this.catTipoJoya.find(t => t.codigo == element.tipoJoya) : '' : '');
      this.estado.setValue(this.catEstadoJoya ? this.catEstadoJoya.find(t => t.codigo == element.estadoJoya) ? this.catEstadoJoya.find(t => t.codigo == element.estadoJoya) : '' : '');
      this.pesoNeto.setValue(element.pesoNeto);
      this.pesoBruto.setValue(element.pesoBruto);
      this.numeroPiezas.setValue(element.numeroPiezas);
      this.descuentoSuelda.setValue(element.descuentoSuelda);
      this.valorOro.setValue(element.valorOro);
      this.tienePiedras.setValue(element.tienePiedras ? 'S' : 'N');
      this.selectTienePiedras();
      this.descuentoPiedra.setValue(element.descuentoPesoPiedra);
      this.detallePiedras.setValue(element.detallePiedras);
      this.valorAplicable.setValue(element.valorAplicable);
      this.valorAvaluo.setValue(element.valorAvaluo);
      this.valorRealizacion.setValue(element.valorRealizacion);
      this.descripcion.setValue(element.descripcion);
      this.elementJoya = element.id;
      this.loadTasacion.next(false);
    })
  }
  eliminar(element: TbQoTasacion) {
    this.loadTasacion.next(true);
    this.tas.eliminarJoya(element.id).subscribe((data: any) => {
      this.tas.getTasacionByIdCredito(null,this.negoW.credito.id).subscribe(tas=>{
        this.negoW.joyas = tas.list;
      })
      this.loadTasacion.next(false);
    });
  }
  /** ********************************************** @OPCIONES ***************************************/
  public calcularOpciones(montoSolicitado: number) {
    if (this.negoW.joyas.length > 0) {
      if(montoSolicitado){
        if(!confirm("SI CAMBIA MONTO SOLICITADO SE PERDERA LAS EXCEPCIONES ACTIVAS")){

          return;
        }
      }
      if (this.dataSourceCreditoNegociacion.data && montoSolicitado) {
      
        /* if (montoSolicitado > this.dataSourceCreditoNegociacion.data[0].montoFinanciado) {
          this.sinNotSer.setNotice("EL MONTO SOLICITADO ES MAYOR AL MONTO FINANCIADO ACTUAL.", 'warning');
          return;
        } */
        if (!this.formOpcionesCredito.valid) {
          this.sinNotSer.setNotice("MONTO SOLICITADO NO VALIDO.", 'warning');
          return;
        }
      }

      this.loadOpciones.next(true);
      this.cal.simularOferta(this.negoW.credito.id, montoSolicitado, this.riesgoTotal).subscribe((data: any) => {
        if (data.entidad.simularResult && data.entidad.simularResult.xmlOpcionesRenovacion
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion) {
          this.loadOpciones.next(false);
          this.selection = new SelectionModel<any>(true, []);
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
          this.mapearVariables(data.entidad.simularResult.xmlVariablesInternas.variablesInternas.variable)
          this.tas.getTasacionByIdCredito(null,this.negoW.credito.id).subscribe(tasa=>{
            if(tasa && tasa.list){
              this.negoW.joyas = tasa.list;
              this.myStepper.selectedIndex = 5;
            }
          })
        }
        if (data.entidad.simularResult.codigoError == 4) {
          this.negoW.excepcionBre = data.entidad.simularResult.mensaje;
         // this.loadOpciones.next(false);
          this.codigoError = data.entidad.simularResult.codigoError;
          //console.log("LA DATA" ,data.entidad)
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
          this.abrirPopupExcepciones(new DataInjectExcepciones(false,true,false,true));
       
        } else if (data.entidad.simularResult.codigoError == 3) {
          this.negoW.excepcionBre = data.entidad.simularResult.mensaje;
         // this.loadOpciones.next(false);
          this.codigoError = data.entidad.simularResult.codigoError;
         // console.log("LA DATA" ,data.entidad)
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
          this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false,true));
       
        } else if (data.entidad.simularResult.codigoError == 2) {
          this.sinNotSer.setNotice(data.entidad.simularResult.mensaje, 'error');
          this.loadOpciones.next(false);
          //this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(null);
        } else if(data.entidad.simularResult.codigoError > 0){
          this.sinNotSer.setNotice("Error en la simulacion: "+ data.entidad.simularResult.mensaje, 'error')
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(null);
          return;
        }
        
      });
    }
  }
  private mapearVariables(variables: Array<any>) {
    let variablesBase: Array<TbQoVariablesCrediticia> = new Array<TbQoVariablesCrediticia>();
    this.loadVariables.next(true);
    variables.forEach(e => {
      let variableBase: TbQoVariablesCrediticia = new TbQoVariablesCrediticia();
      variableBase.codigo = e.codigo;
      variableBase.nombre = e.nombre;
      variableBase.valor = e.valor;
      variableBase.orden = e.orden;
      variablesBase.push(variableBase);
    });
    this.componenteVariable = false;
    this.neg.actualizarVariables( variablesBase, this.negoW.credito.tbQoNegociacion.id ).subscribe( (data: any) =>{
      if( data.entidades){
        this.negoW.variables = data.entidades;
        //this.sinNotSer.setNotice("LAS VARIABLES CREDITICIAS FUERON ACTUALIZADAS", 'success');
        this.componenteVariable = true;
        this.loadVariables.next(false);
      }
    });
  }
  updateCliente(event, control) {
    if (control.invalid || (event instanceof KeyboardEvent && event.key != 'Tab')) {
      return;
    }
    if (this.tbQoCliente && this.tbQoCliente.id) {
      let cliente = this.buildCliente();
      this.neg.updateCliente(cliente.cliente).subscribe(p => {
        if (p.entidad && p.entidad.tbQoTelefonoClientes) {
          p.entidad.tbQoTelefonoClientes.forEach(element => {
            if (element.tipoTelefono == 'CEL') {
              this.telefonoMovil = element;
            }
            if (element.tipoTelefono == 'DOM') {
              this.telefonoFijo = element;
            }
          });

        }
      });
    }
  }
  buildCliente() {
    if (this.telefonoFijo) {
      this.telefonoFijo.numero = this.telefonoDomicilio.value
    } else if (this.telefonoDomicilio.value) {
      this.telefonoFijo = {
        tipoTelefono: 'DOM',
        numero: this.telefonoDomicilio.value
      }
    }
    if (this.telefonoMovil) {
      this.telefonoMovil.numero = this.movil.value
    } else if (this.movil.value) {
      this.telefonoMovil = {
        tipoTelefono: 'CEL',
        numero: this.movil.value
      }
    }
    
    let cliente = {
      id: this.tbQoCliente.id,
      cedulaCliente: this.tbQoCliente.cedulaCliente,
      aprobacionMupi: this.aprobacionMupi.value,
      campania: this.campania.value,
      fechaNacimiento: this.fechaDeNacimiento.value,
      nacionalidad: this.nacionalidad.value.id,
      publicidad: this.publicidad.value.nombre,
     
      tbQoTelefonoClientes: new Array(),
      email: this.email.value
    };
    let referido = {
      id: this.negoW.referedio?this.negoW.referedio.id:'',
      nombre: this.nombreReferido.value,
      telefono: this.telefonoReferido.value,
      tbQoNegociacion: this.negoW.credito.tbQoNegociacion
    }
  
    if (this.telefonoMovil) {
      cliente.tbQoTelefonoClientes.push(this.telefonoMovil);
    }
    if (this.telefonoFijo) {
      cliente.tbQoTelefonoClientes.push(this.telefonoFijo);
    }

    let wrapperCliente = {
      cliente: cliente,
      referido: referido,
      bandera: this.publicidad.value?this.publicidad.value.bandera? true:false : false,
      nombreApoderado: this.nombreApoderado.value,
      identificacionApoderado: this.identificacionApoderado.value,
      fechaNacimientoApoderado: this.fechaNacimientoApoderado.value,
      fechaNacimientoCodeudor: this.fechaNacimientoCodeudor.value,
      tipoCliente: this.tipoCliente.value?this.tipoCliente.value.codigo:null,
      nombreCodeudor: this.nombreCodeudor.value,
      identificacionCodeudor: this.identificacionCodeudor.value,
      idCreditoNegociacion: this.negoW.credito.id
    }
    //console.log("el wrappersin", wrapperCliente)
    return wrapperCliente;
  }
  seleccionarCredito(element) {
    this.opcionCredito = element;
  }
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceCreditoNegociacion.data.length;
    return numSelected === numRows;
  }
  guardarCredito() {
    if(this.email.invalid){
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL EMAIL DEL CLIENTE", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    if(this.telefonoDomicilio.invalid){
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL TELEFONO DE DOMICILIO DEL CLIENTE", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    if(this.movil.invalid){
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL MOVIL DEL CLIENTE", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    /* if (this.codigoError == 3) {
     
      this.abrirPopupExcepciones(new DataInjectExcepciones(false, true, false));
      return;
    } */
    if(this.excepciones.length > 0){
      let xCliente = this.excepciones.find(p=>p.isCliente);
      let xRiesgo = this.excepciones.find(p=>p.isRiesgo);
      if(xRiesgo && xRiesgo.isRiesgo){
        let data = new DataInjectExcepciones(false, true, false);
        data.mensajeBre = xRiesgo.mensajeBre + ' ' + (xCliente?xCliente.mensajeBre:'');
        data.idNegociacion = this.negoW.credito.tbQoNegociacion.id;
        const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
          width: '800px',
          height: 'auto',
          data: data
        });
        dialogRefGuardar.afterClosed().subscribe((result: any) => {
          if (result) {
            this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.', 'EXCEPCION SOLICITADA');
          } else {
            if (data.isCobertura) {
              this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'warning');
            } else {
              //this.salirDeGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION', 'NEGOCIACION CANCELADA');
            }
          }
        });
        return;
      }
      if(xCliente && xCliente.isCliente){
        this.abrirPopupExcepciones(new DataInjectExcepciones(true, false, false));
        return;
      }
        
    }
    if(this.clienteBloqueado){
      this.sinNotSer.setNotice(this.negoW.excepcionBre, 'error');
      return;
    }
    if (this.selection.selected.length == 0) {
      this.sinNotSer.setNotice("SELECCIONE UNA OPCION DE CREDITO", 'warning');
      return;
    }    
    /* if ((!this.fechaDeNacimiento.value || this.edad.value < 18 || this.edad.value > 75) && this.tipoCliente.value && this.tipoCliente.value.codigo == 'DEU') {
      this.sinNotSer.setNotice("LA EDAD DEL CLIENTE ES MAYOR A 75 AÑOS DEBE INGRESAR LA INFORMACION DEL CODEUDOR", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    } */
    /* if (this.edad.value < 18 || this.edad.value > 74) {
      
      let data = new DataInjectExcepciones(false, true, false);
      data.mensajeBre = 'LA EDAD DEL CLIENTE ES MAYOR A 75 AÑOS';
      data.idNegociacion = this.negoW.credito.tbQoNegociacion.id;
      this.excepciones.push(data);
      const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
        width: '800px',
        height: 'auto',
        data: data
      });
      dialogRefGuardar.afterClosed().subscribe((result: any) => {
        if (result) {
          this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.', 'EXCEPCION SOLICITADA');
        } else {
          this.sinNotSer.setNotice("LA EDAD DEL CLIENTE ES MAYOR A 75 AÑOS", 'warning');
          this.myStepper.selectedIndex = 1;
        }
      });

      return;
    } */
    /* if ((!this.fechaNacimientoCodeudor.value || this.edadCodeudor.value < 18 || this.edadCodeudor.value > 65) && this.tipoCliente.value && this.tipoCliente.value.codigo == 'SCD') {
      this.sinNotSer.setNotice("LA EDAD DEL CODEUDOR ES MAYOR A 65 AÑOS DEBE INGRESE OTRO CODEUDOR", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    } */
    if (confirm("ESTA SEGURO DE GENERAR LA SOLICITUD DE CREDITO?")) {
    
      let wrapper = {
        opcionCredito:this.selection.selected,
        nombreApoderado: this.nombreApoderado.value,
        identificacionApoderado: this.identificacionApoderado.value,
        fechaNacimientoApoderado: this.fechaNacimientoApoderado.value,
        fechaNacimientoCodeudor: this.fechaNacimientoCodeudor.value,
        tipoCliente: this.tipoCliente.value?this.tipoCliente.value.codigo:null,
        nombreCodeudor: this.nombreCodeudor.value,
        identificacionCodeudor: this.identificacionCodeudor.value,
        idCreditoNegociacion: this.negoW.credito.id
      }
      this.neg.guardarOpcionCredito(wrapper, this.negoW.credito.id).subscribe(response => {
        console.log( )
        this.router.navigate(['negociacion/gestion-cliente/NEG/', this.negoW.credito.tbQoNegociacion.id]);
      }, error => {
        this.sinNotSer.setNotice(error.error.msgError, 'error');
      });
    }
  }

  regresar() {
    this.router.navigate(['negociacion/']);
  }
  verPrecio() {
    if (this.formDatosCliente.invalid) {
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL CLIENTE", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    /* if ((!this.fechaDeNacimiento.value || this.edad.value < 18 || this.edad.value > 75) && this.tipoCliente.value && this.tipoCliente.value.codigo == 'DEU') {
      this.sinNotSer.setNotice("LA EDAD DEL CLIENTE ES MAYOR A 75 AÑOS DEBE INGRESAR LA INFORMACION DEL CODEUDOR", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    } */
    if (this.edad.value < 18 || this.edad.value > 74) {
      this.sinNotSer.setNotice("LA EDAD DEL CLIENTE ES MAYOR A 75 AÑOS", 'warning');
      //this.myStepper.selectedIndex = 1;
     // return;
    }
    /* if ((!this.fechaNacimientoCodeudor.value || this.edadCodeudor.value < 18 || this.edadCodeudor.value > 65) && this.tipoCliente.value && this.tipoCliente.value.codigo == 'SCD') {
      this.sinNotSer.setNotice("LA EDAD DEL CODEUDOR ES MAYOR A 65 AÑOS DEBE INGRESE OTRO CODEUDOR", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    } */
    if(this.publicidad.value && this.publicidad.value.bandera && this.nombreReferido.invalid && this.telefonoReferido.invalid){
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL CLIENTE", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    if(this.formOperacion.invalid){
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL CODEUDOR/APODERADO", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    this.loadTasacion.next(true);
    let cliente = this.buildCliente();
    //aqui llamo servicio de registrar referido
    this.neg.verPrecios(cliente).subscribe(resp => {
      this.catTipoOro = resp.entidades;
      this.loadTasacion.next(false);
    })
  }
  private _filter(value: Pais): Pais[] {
    const filterValue = this._normalizeValue(value.nombre);
    return this.catPais.filter(pais => this._normalizeValue(pais.nombre).includes(filterValue));
  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  selectTienePiedras() {
    if (this.tienePiedras.value == 'S') {
      this.formTasacion.addControl("detallePiedras", this.detallePiedras);
      this.formTasacion.addControl("descuentoPiedra", this.descuentoPiedra);
    } else {
      this.formTasacion.removeControl("detallePiedras");
      this.formTasacion.removeControl("descuentoPiedra");
    }
  }
  masterToggle(event) {
    this.selection.clear()
    this.selection.select(event)
  }
  setPesoNeto() {
    try {
      let v = (Number(this.pesoBruto.value) - (Number(this.descuentoSuelda.value) + Number(this.descuentoPiedra.value)))
      this.pesoNeto.setValue(v.toFixed(2));
    } catch {
      this.pesoNeto.setValue('0');
    }

  }

  sombrear(row){
    if(row.tipooferta == 'V'){
    //  console.log("stilo po")

      return {background: 'cornflowerblue'};
    }
    return null;
    
  }

  public cambiarCliente(){
    this.limpiarGarantes();
    //console.log('Tipo de cliente solicitado ->', this.tipoCliente.value);
    if(this.tipoCliente.value && (this.tipoCliente.value.codigo == 'SAP' || this.tipoCliente.value.codigo == 'CYA')){
      this.formOperacion.addControl("nombreApoderado", this.nombreApoderado);
      this.formOperacion.addControl("fechaNacimientoApoderado", this.fechaNacimientoApoderado);
      this.formOperacion.addControl("identificacionApoderado", this.identificacionApoderado);
    }
    if(this.tipoCliente.value && (this.tipoCliente.value.codigo == 'SCD' || this.tipoCliente.value.codigo == 'CYA')){
      this.formOperacion.addControl("identificacionCodeudor", this.identificacionCodeudor);
      this.formOperacion.addControl("nombreCodeudor", this.nombreCodeudor);
      this.formOperacion.addControl("fechaNacimientoCodeudor", this.fechaNacimientoCodeudor);
    }
  }
  public limpiarGarantes(){
    this.formOperacion.removeControl('nombreApoderado');
      this.nombreApoderado.reset();
      this.nombreApoderado.setErrors(null);
      this.nombreApoderado.setValue(null);
    this.formOperacion.removeControl('fechaNacimientoApoderado');
      this.fechaNacimientoApoderado.reset();
      this.fechaNacimientoApoderado.setErrors(null);
      this.fechaNacimientoApoderado.setValue(null);
    this.formOperacion.removeControl('identificacionApoderado');
      this.identificacionApoderado.reset();
      this.identificacionApoderado.setErrors(null);
      this.identificacionApoderado.setValue(null);
    this.formOperacion.removeControl('identificacionCodeudor');
      this.identificacionCodeudor.reset();
      this.identificacionCodeudor.setErrors(null);
      this.identificacionCodeudor.setValue(null);
    this.formOperacion.removeControl('nombreCodeudor');
      this.nombreCodeudor.reset();
      this.nombreCodeudor.setErrors(null);
      this.nombreCodeudor.setValue(null);
    this.formOperacion.removeControl('fechaNacimientoCodeudor');
      this.fechaNacimientoCodeudor.reset();
      this.fechaNacimientoCodeudor.setErrors(null);
      this.fechaNacimientoCodeudor.setValue(null);
  }

  guardarEstado(){
    if(!this.negoW || !this.negoW.credito ){
      this.sinNotSer.setNotice('NO SE PUEDE LEER EL ID DE LA NEGOCIACION','warning');
      return;
    }
    
    if(this.estadoCredito.invalid || this.motivo.invalid){
      this.sinNotSer.setNotice('DEBE ESCOGER UN ESTADO Y UN MOTIVO','info');
      return;
    }

    this.neg.guardarEstadoCredito(this.negoW.credito.tbQoNegociacion.id, this.estadoCredito.value.nombre, this.motivo.value.nombre).subscribe( x=>{});
  }

  findWebMupi(){
    this.neg.consultaWebMupi(this.tbQoCliente.id).subscribe(p=>{
      if(p.existeError){
        this.sinNotSer.setNotice(p.mensaje,'warning');
        return
      }
      this.detalleWebMupi.setValue(p.detalle);
      this.aprobacionMupi.setValue(p.estado=="RECHAZADO"?'N':'S');
      this.validMupiButton.next(false);
     
    },r=>{
      this.aprobacionMupi.setValue('N');
      this.validMupiButton.next(true);
      this.detalleWebMupi.disable();
      this.aprobacionMupi.disable()
    },()=>{
      this.detalleWebMupi.disable();
      this.aprobacionMupi.disable()
      });
  }
  public cargarComponenteHabilitante() {
    if (this.negoW && this.negoW.credito && this.negoW.credito.tbQoNegociacion.id) {
      const dialogRef = this.dialog.open(DialogCargarAutorizacionComponent, {
        width: "900px",
        height: "400px",
        data: this.negoW.credito.tbQoNegociacion.id
      });
      dialogRef.afterClosed().subscribe(p=>{
        this.consultarHabilitanteAutoricacion(this.negoW.credito.tbQoNegociacion.id);
      });
    } else {
      this.sinNotSer.setNotice("ERROR NO HAY CLIENTE PARA ACTUALIZAR LOS HABILITANTES", 'error');
    }
  }

  consultarHabilitanteAutoricacion(idReferencia) {
    const p = new Page();
    p.pageNumber = 0;
    p.sortFields = null;
    p.sortDirections = null;
    p.isPaginated = "Y";
    this.dh.findByRolTipoDocumentoReferenciaProcesoEstadoOperacion(localStorage.getItem(environment.rolKey),"18", idReferencia,
    "NUEVO","AUTORIZACION", p  ).subscribe(
        (data: any) => {
          
          if (data && data.list && data.list[0] && !data.list[0].objectId) {
            this.cargarComponenteHabilitante();
            
          } 
        },
        error => {
        
        }
      );
      
  }
 

}
export class Pais {
  id;
  codigo;
  nombre;
}