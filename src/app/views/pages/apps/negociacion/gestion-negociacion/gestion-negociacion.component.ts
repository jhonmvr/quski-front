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


@Component({
  selector: 'kt-gestion-negociacion',
  templateUrl: './gestion-negociacion.component.html',
  styleUrls: ['./gestion-negociacion.component.scss']
})
export class GestionNegociacionComponent extends TrackingUtil implements OnInit {
  // VARIABLES PUBLICAS
  selection = new SelectionModel<any>(true, []);
  public loadingTasacion;
  public usuario: string;
  public agencia: string;
  public loadTasacion = new BehaviorSubject<boolean>(false);
  public loadOpciones = new BehaviorSubject<boolean>(false);
  public loadBusqueda = new BehaviorSubject<boolean>(false);
  public loadVariables = new BehaviorSubject<boolean>(false);

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
  public edad = new FormControl('', [Validators.required, Validators.max(75), Validators.min(18)]);
  public nacionalidad = new FormControl('', [Validators.required]);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public nombreReferido = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public telefonoReferido = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('');
  public aprobacionMupi = new FormControl('', [Validators.required]);
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

  public formOpcionesCredito: FormGroup = new FormGroup({});
  public montoSolicitado = new FormControl('', [Validators.required, ValidateDecimal, Validators.min(0.01)]);

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
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService,
    private laytoutService: LayoutConfigService,
    private procesoService: ProcesoService,
    public tra: TrackingService
  ) {
    super(tra);
    this.sof.setParameter();
    this.par.setParameter();
    this.cal.setParameter();
    this.neg.setParameter();
    this.tas.setParameter();
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
  }
  /** ********************************************* @ENTRADA ********************* **/
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.id && json.params.origen) {
        this.myStepper.selectedIndex = 1;
        this.procesoService.getCabecera(json.params.id,'NUEVO').subscribe(datos=>{
          this.laytoutService.setDatosContrato(datos);
        });
        if (json.params.origen == "NEG") {
          this.validarNegociacion(json.params.id);
        } else if (json.params.origen == "COT") {
          this.iniciarNegociacionFromCot(json.params.id);
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

        if(this.negoW.proceso.estadoProceso == 'CREADO'){
            if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 3) {
            this.abrirPopupExcepciones(new DataInjectExcepciones(true));
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
        }
        

        this.negoW.proceso.proceso == 'NUEVO' ? null : 
        this.negoW.proceso.estadoProceso == 'DEVUELTO' ? this.popupDevolucion() : this.validarExcepciones(this.negoW);
        this.negoW.proceso.estadoProceso == 'EXCEPCIONADO' ? this.validarExcepciones(this.negoW):'';
        this.negoW.proceso.estadoProceso == 'PENDIENTE_EXCEPCION' ? this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.') :
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
            this.abrirPopupExcepciones(new DataInjectExcepciones(true));
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
            this.abrirPopupExcepciones(new DataInjectExcepciones(false, true, false));
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

  private iniciarNegociacionFromCot(id: number) {
    this.neg.iniciarNegociacionFromCot(id, this.usuario, this.agencia).subscribe((wrapper: any) => {
      if (wrapper.entidad.respuesta) {
        this.negoW = wrapper.entidad;
        if (!this.negoW.excepcionBre) {
          this.cargarValores(this.negoW, true);
        } else {
          this.abrirPopupExcepciones(new DataInjectExcepciones(true));
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
        this.myStepper.selectedIndex = 1;
        if (this.negoW.excepcionBre && this.negoW.codigoExcepcionBre == 3) {
          this.abrirPopupExcepciones(new DataInjectExcepciones(true));
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
        this.cargarValores(this.negoW, false);
      } else {
        this.abrirPopupDeAutorizacion(this.identificacion.value);
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
          this.abrirPopupExcepciones(new DataInjectExcepciones(true));
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
  private abrirPopupDeAutorizacion(cedula: string): any {
    this.myStepper.selectedIndex = 0;
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: cedula
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      if (respuesta) {
        this.iniciarNegociacionEquifax(cedula);
      } else {
        this.sinNotSer.setNotice('CONSULTA EQUIFAX CANCELADA', 'warning');
        this.limpiarCamposBusqueda();
      }
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
    this.aprobacionMupi.setValue(cargar ? this.negoW.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi : '');
    this.publicidad.setValue(cargar ?  this.catPublicidad.find(p=>p.nombre == this.negoW.credito.tbQoNegociacion.tbQoCliente.publicidad )  : '');
    this.campania.setValue(cargar ? this.negoW.credito.tbQoNegociacion.tbQoCliente.campania : '');
    this.nombreReferido.setValue(this.negoW.referedio ? this.negoW.referedio.nombre: '');
    this.telefonoReferido.setValue(this.negoW.referedio ? this.negoW.referedio.telefono: '');
    this.componenteVariable = wrapper.variables != null ? true : false;
    this.componenteRiesgo = wrapper.riesgos != null ? true : false;
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
      motivoDevolucion: this.catMotivoDevolucion ?
        this.catMotivoDevolucion.find(m => m.codigo == this.negoW.credito.codigoDevuelto) ?
          this.catMotivoDevolucion.find(m => m.codigo == this.negoW.credito.codigoDevuelto).nombre : 'No definido' : 'No definido',
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
          this.salirDeGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION', 'NEGOCIACION CANCELADA');
        }
      }
    });
  }
  solicitarCobertura() {
    if (this.negoW.joyas && this.negoW.joyas.length > 0) {
      this.abrirPopupExcepciones();
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
      return input.hasError('required') ? errorRequerido : this.email.hasError('email') ? 'E-mail no valido' : this.email.hasError('maxlength') ? maximo + this.email.errors.maxlength.requiredLength : '';
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
        if (data.entidad.simularResult.codigoError == 3) {
          this.negoW.excepcionBre = data.entidad.simularResult.mensaje;
          this.loadOpciones.next(false);
          this.abrirPopupExcepciones(new DataInjectExcepciones(false, true, false));
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(null);
        } else if (data.entidad.simularResult.codigoError == 2) {
          this.sinNotSer.setNotice(data.entidad.simularResult.mensaje, 'error');
          this.loadOpciones.next(false);
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(null);
        } else if(data.entidad.simularResult.codigoError > 0){
          this.sinNotSer.setNotice("Error en la simulacion: "+ data.entidad.simularResult.mensaje, 'error')
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(null);
          return;
        }else if (data.entidad.simularResult && data.entidad.simularResult.xmlOpcionesRenovacion
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
        } else {
          this.sinNotSer.setNotice("INGRESE ALGUNA JOYA PARA CALCULAR LAS OPCIONES DE OFERTA", 'warning');
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
        this.sinNotSer.setNotice("LAS VARIABLES CREDITICIAS FUERON ACTUALIZADAS", 'success');
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
      bandera: this.publicidad.value.bandera? true:false
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
    if(this.clienteBloqueado){
      this.sinNotSer.setNotice(this.negoW.excepcionBre, 'error');
      return;
    }
    if (this.selection.selected.length == 0) {
      this.sinNotSer.setNotice("SELECCIONE UNA OPCION DE CREDITO", 'warning');
      return;
    }
    if (confirm("ESTA SEGURO DE GENERAR LA SOLICITUD DE CREDITO?")) {
      this.neg.guardarOpcionCredito(this.selection.selected, this.negoW.credito.id).subscribe(response => {
        console.log( )
        this.router.navigate(['cliente/gestion-cliente/NEG/', this.negoW.credito.tbQoNegociacion.id]);
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
    if (!this.fechaDeNacimiento.value || this.edad.value < 18 || this.edad.value > 75) {
      this.sinNotSer.setNotice("INGRESE UNA FECHA VALIDA QUE CORRESPONDA A UNA EDAD VALIDA", 'warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    if(this.publicidad.value.bandera && this.nombreReferido.invalid && this.telefonoReferido.invalid){
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL CLIENTE", 'warning');
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
      console.log("stilo po")

      return {background: 'cornflowerblue'};
    }
    return null;
    
  }
 

}
export class Pais {
  id;
  codigo;
  nombre;
}