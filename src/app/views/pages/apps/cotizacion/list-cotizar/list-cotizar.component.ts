import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Page } from '../../../../../core/model/page';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatStepper } from '@angular/material';
import { TituloContratoService } from '../../../../../core/services/quski/titulo.contrato.service';
import { CreditoService } from '../../../../../core/services/quski/credito.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { TbCotizacion } from '../../../../../core/model/quski/TbCotizacion';
import { SolicitudAutorizacionDialogComponent } from '../../../../../../app/views/partials/custom/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { OroService } from '../../../../../core/services/quski/oro.service';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { EstadoQuskiEnum } from '../../../../../core/enum/EstadoQuskiEnum';
import { CreditoVigenteDialogComponent } from '../../../../partials/custom/riesgo-acomulado-dialog/credito-vigente-dialog/credito-vigente-dialog.component';
import { JoyaService } from '../../../../../core/services/quski/joya.service';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
import { TbQoTipoOro } from '../../../../..//core/model/quski/TbQoTipoOro';
import { DatePipe } from '@angular/common';
import { TbQoVariablesCrediticias } from '../../../../../core/model/quski/TbQoVariablesCrediticias';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { ProcesoEnum } from '../../../../../core/enum/ProcesoEnum';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';
import { SituacionTrackingEnum } from '../../../../../core/enum/SituacionTrackingEnum';
import { ActividadEnum } from '../../../../../core/enum/ActividadEnum';
import { UsuarioEnum } from '../../../../../core/enum/UsuarioEnum';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../../src/environments/environment';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { MensajeExcepcionComponent } from '../../../../partials/custom/mensaje-excepcion-component/mensaje-excepcion-component';


/**
 * @description IMPORTACION DEL INTERFACE DE USUARIO
 * @author Kléber Guerra  - Relative Engine
 * @date 2020-07-14
 * @export
 * @interface User
 */
export interface User {
  name: string;
}

/**
 * @description METODO COMPONENT
 * @author Kléber Guerra  - Relative Engine
 * @date 2020-07-23
 * @export
 * @class ListCotizarComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'kt-list-cotizar',
  templateUrl: './list-cotizar.component.html',
  styleUrls: ['./list-cotizar.component.scss']
})

export class ListCotizarComponent implements OnInit {

  // CREACION DEL STEPPER
  @ViewChild('stepper', { static: true })
  public stepper: MatStepper;
  // STREPPER
  isLinear = false;
  // STANDARD VARIABLES
  public loading;
  public isCheckSi = false;
  public isCheckNo = false;
  //OBSERVABLES
  disableGuardar;
  disableSimular;
  disableVerPrecio;
  disableVerVariable;
  disableMensajeBloqueo;
  preciosOroAsyn;
  disableMensajeBloqueoSubject = new BehaviorSubject<boolean>(false);
  disableVerVariableSubject = new BehaviorSubject<boolean>(false);
  disableGuardarSubject = new BehaviorSubject<boolean>(true);
  disableSimulaSubject = new BehaviorSubject<boolean>(false);
  disableVerPrecioSubject = new BehaviorSubject<boolean>(true);
  preciosOrodSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // SELECCIONES
  public fechaSeleccionada: any;
  // OBJETOS QUE SE INTERACTUA
  public cliente = new TbQoCliente();
  public cotizacion = new TbCotizacion();
  public date;
  // LISTAS
  public listCotizaciones = [];
  // ENUMS
  listPublicidad = []; // PARA CUANDO NO SE CARGA DE UN PARAMETRO= Object.keys(PulicidadEnum);
  listGradosInteres = [];
  listMotivoDesestimiento = [];
  listEstado = Object.keys(EstadoQuskiEnum);
  listVariables = new Array<TbQoVariablesCrediticias>();
  listOpciones = [];
  listOros = null;
  // FORM CLIENTE
  public formAprobacion: FormGroup = new FormGroup({});
  public formCliente: FormGroup = new FormGroup({});
  public formVariable: FormGroup = new FormGroup({});
  public formOpciones: FormGroup = new FormGroup({});
  // ATRIBUTOS DE CLIENTE
  public fpublicidad = new FormControl('', [Validators.required]);
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public fechaNacimiento = new FormControl('', [Validators.required]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', [Validators.required]);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public correoElectronico = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public aprobacionMupi = new FormControl('', [Validators.required]);
  // OPCIONES DE CREDITO
  public fgradoInteres = new FormControl('', [Validators.required]);
  public fmotivoDesestimiento = new FormControl('', [Validators.required]);
  // FORM PRECIO ORO
  public formPrecioOro: FormGroup = new FormGroup({});
  public tipoOro = new FormControl('', [Validators.required]);
  public pesoNetoEstimado = new FormControl('', [Validators.required, ValidateDecimal]);
  public precio = new FormControl('', [Validators.required, ValidateDecimal]);
  public mensajeBloqueo = new FormControl('', [Validators.required]);
  public mensaje: any;
  // VARIABLES PRECIO ORO/
  public totalPrecio = 0;
  public totalPeso = 0;
  public precioOro = new TbQoPrecioOro();
  public tipoOros = new TbQoTipoOro();
  public variableCrediticia = new TbQoVariablesCrediticia();
  public variableCrediticiaArray = new Array<TbQoVariablesCrediticia>();
  public preciosArray = new Array<TbQoPrecioOro>();
  public precioOroLocal;
  public element;
  public opciones: string[] = ['Si', 'No'];
  public seleccion: string;
  public primerNombre = '';
  public segundoNombre = '';
  public primerApellido = '';
  public segundoApellido = '';
  // VARIABLES DE TRACKING
  public horaInicio: any;
  public horaAsignacion: any;
  public horaAtencion: any;
  public horaFinal: any;
  public op: string;
  public idCotizacion: string;
  // CALCULADORA VARIABLES
  gradoIntere = new FormControl('', []);
  aprobadoWebMupi = new FormControl('', []);
  apellidoCliente = new FormControl('', []);
  // OPCIONES PRECIO ORO
  precioEstimado = new FormControl('', []);
  // OPCIONES DE CREDITO
  plazo = new FormControl('', []);
  montoPreAprobado = new FormControl('', []);
  aRecibir = new FormControl('', []);
  totalCostosOperacion = new FormControl('', []);
  totalCostosNuevaOperacion = new FormControl('', []);
  costoCustodia = new FormControl('', []);
  costoTransporte = new FormControl('', []);
  costoValoracion = new FormControl('', []);
  costoTasacion = new FormControl('', []);
  costoCredito = new FormControl('', []);
  costoSeguro = new FormControl('', []);
  costoResguardo = new FormControl('', []);
  solca = new FormControl('', []);
  valorCuota = new FormControl('', []);
  // VISUALIZACION DE LAS COLUMNAS
  displayedColumnsVarCredi = ['orden', 'variable', 'valor'];
  displayedColumnsPrecioOro = ['accion', 'N', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  displayedColumnsCreditoNegociacion = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoValoracion', 'costoTasacion', 'costoSeguro', 'costoResguardo', 'solca', 'valorCuota'];
  /**Obligatorio paginacion */
  p = new Page();
  // DATASOURCE
  dataSourceI = new MatTableDataSource<any>();
  dataSourceVarCredi: MatTableDataSource<TbQoVariablesCrediticia> = new MatTableDataSource<TbQoVariablesCrediticia>();
  dataSourcePrecioOro: MatTableDataSource<TbQoPrecioOro> = new MatTableDataSource<TbQoPrecioOro>();
  dataSourceCredito: MatTableDataSource<TbQoCreditoNegociacion> = new MatTableDataSource<TbQoCreditoNegociacion>();
  dataSourceCliente: MatTableDataSource<TbQoCliente> = new MatTableDataSource<TbQoCliente>();
  dataSourceCotizacion: MatTableDataSource<TbCotizacion> = new MatTableDataSource<TbCotizacion>();
  dataSourceTipoOro: MatTableDataSource<TbQoTipoOro> = new MatTableDataSource<TbQoTipoOro>();
  /**
   * Metodo para paginador
   */
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  roomsFilter: any;

  /**
   * CONSTRUCTOR DE LA CLASE
   *
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   * @param {DatePipe} datepipe
   * @param {TituloContratoService} titulo
   * @param {OroService} os
   * @param {JoyaService} js
   * @param {ReNoticeService} sinNoticeService
   * @param {SubheaderService} subheaderService
   * @param {ClienteService} clienteService
   * @param {ParametroService} sp
   * @param {CotizacionService} cs
   * @param {CreditoService} dc
   * @param {MatDialog} dialog
   * @param {FormBuilder} fb
   * @memberof ListCotizarComponent
   */
  constructor(
    public datepipe: DatePipe,
    private router: Router,
    public titulo: TituloContratoService,
    private os: OroService,
    private js: JoyaService,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private clienteService: ClienteService,
    private is: IntegracionService,
    private sp: ParametroService,
    private cs: CotizacionService,
    private dc: CreditoService,
    private cl: ClienteService,
    private tr: TrackingService,
    public dialog: MatDialog, private fb: FormBuilder) {
    //SERVICIOS
    this.tr.setParameter();
    this.is.setParameter();
    this.cl.setParameter();
    this.sp.setParameter();
    this.cs.setParameter();
    this.os.setParameter();
    this.js.setParameter();
    this.dc.setParameter(); // siempre que usan un servicio deben usar set parametert
    // FORM CLIENTE
    this.formCliente.addControl('cedula', this.identificacion);
    this.formCliente.addControl('fechaNacimiento', this.fechaNacimiento);
    this.formCliente.addControl('nombresCompletos', this.nombresCompletos);
    this.formCliente.addControl('edad', this.edad);
    this.formCliente.addControl('nacionalidad', new FormControl('', Validators.required));
    this.formCliente.addControl('movil', this.movil);
    this.formCliente.addControl('telefonoDomicilio', this.telefonoDomicilio);
    this.formCliente.addControl('correoElectronico', this.correoElectronico);
    this.formCliente.addControl('campania', this.campania);
    this.formCliente.addControl('fpublicidad', this.fpublicidad);
    this.formCliente.addControl('aprobacionMupi  ', this.aprobacionMupi);
    this.fb.group(this.formCliente);
    // FORM PRECIO ORO
    this.formPrecioOro.addControl('tipoOro  ', this.tipoOro);
    this.formPrecioOro.addControl('pesoNetoEstimado  ', this.pesoNetoEstimado);
    this.formPrecioOro.addControl('precio  ', this.precio);
    this.fb.group(this.formPrecioOro);
    //CARGA DE COMBOS
    this.getPublicidades();
    this.getGradoInteres();
    this.getMotivoDesestimiento();
    //INICIALIZACION DEL MENSAJE QUE SE PRESENTA E LA PARTE SUPERIOR
    this.sinNoticeService.setNotice(null);
    // INICIALIZACION DE VARIABLES
    this.precioOroLocal = null;
  }
  /**
   * METODO ON INIT SE CARGA DESPUES DE ABRIR LA PAGINADOR
   * INICIALIZA LOS OBSERVABLES
   * @description
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   * @memberof ListCotizarComponent
   */
  ngOnInit() {
    this.limpiarCampos();
    localStorage.getItem(atob(environment.userKey))
    this.subheaderService.setTitle("GESTION DE COTIZACION");
    this.formCliente = this.fb.group({
      


    });
    this.date = new Date();
    this.subheaderService.setTitle('Gestión Cotización');
    this.titulo.setNotice('GESTION DE COTIZACION');
    // OBSERVABLES
    this.loading = this.loadingSubject.asObservable();
    this.disableGuardar = this.disableGuardarSubject.asObservable();
    this.disableSimular = this.disableSimulaSubject.asObservable();
    this.disableVerPrecio = this.disableVerPrecioSubject.asObservable();
    this.disableVerVariable = this.disableVerVariableSubject.asObservable();
    this.disableMensajeBloqueo = this.disableMensajeBloqueoSubject.asObservable();
    this.preciosOroAsyn = this.preciosOrodSubject.asObservable();
    // METODOS DEL PAGINADOR
    this.initiateTablePaginator();
    // Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      // console.log('sort changed ');
      this.initiateTablePaginator();
      this.buscar();
    });
  }
  // NO SE QUE HACE???
  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  /******************************************** CARGA DE COMBOS  ***********************************************************/
  /**
   * Metodo que trae los motivos de desestimiento de la base de datos tabla parametros
   */
  /**
   * @description METODO QUE REALIZA LA CARGA LOS MOTIVIOS DE DESESTIMEINTO DE LA BASE 
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   * @memberof ListCotizarComponent
   */
  getMotivoDesestimiento() {
    this.sp.findByNombreTipoOrdered('', 'DESEST', 'Y').subscribe((wrapper: any) => {
      // //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        this.listMotivoDesestimiento = wrapper.entidades;
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar parametros de publicidad', 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: 'Error ' + error.statusText + ' - ' + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice('Error al cargar publicidades', 'error');
      }
    });
  }
  /**
   * @description METODO QUE CARGA LOS GRADOS DE INTERES DE LA BASE 
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @memberof ListCotizarComponent
   */
  getGradoInteres() {
    this.sp.findByNombreTipoOrdered('', 'GINT', 'Y').subscribe((wrapper: any) => {
      if (wrapper && wrapper.entidades) {
        this.listGradosInteres = wrapper.entidades;
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar grado de interes', 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: 'Error ' + error.statusText + ' - ' + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice('Error al cargar grado de interes', 'error');
      }
    });
  }
  /**
   * @description METODO QUE CARGA EL COMBO DE PUBLICIDAD CON LOS TIPOS DE PUBLICIDAD
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   * @memberof ListCotizarComponent
   */
  getPublicidades() {
    this.sp.findByNombreTipoOrdered('', 'PUB', 'Y').subscribe((wrapper: any) => {
      if (wrapper && wrapper.entidades) {
        for (let i = 0; i < wrapper.entidades.length; i++) {
          this.listPublicidad.push(wrapper.entidades[i].valor.toUpperCase());
        }
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar parametros de publicidad', 'error');
        }
      } else if (error.statusText && error.status === 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: 'Error ' + error.statusText + ' - ' + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice('Error al cargar publicidades', 'error');
      }
    });
  }
  /**
   * @description METODO QUE CARGA LOS TIPOS DE ORO
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   * @memberof ListCotizarComponent
   */
  getTipoOro() {
    this.p = new Page();
    this.totalResults = 0;
    this.paginator.pageIndex = 0;
    this.p.isPaginated = 'Y';
    this.p.size = 5;
    this.p.pageNumber = 0;

    this.js.findAllTipoOro().subscribe((wrapper: any) => {

      if (wrapper && wrapper.list) {
        this.listOros = wrapper.list;
        console.log('INGRESA AL IF', JSON.stringify(wrapper.list.length));

      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar Tipo Oro', 'error');
        }
      } else if (error.statusText && error.status === 401) {
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

  /***********************************************METODOS PARA TOMAR LOS VALORES DE LOS COMBOS*********************    */

  /**
   * @description METODO QUE TOMA EL VALOR DEL COMBO PUBLICIDAD
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @param {*} event
   * @memberof ListCotizarComponent
   */
  cambioSeleccionPublicidad(event) {
    console.log('evento ' + JSON.stringify(event.value));
    console.log('evento ' + JSON.stringify(this.fpublicidad.value));
  }
  /**
   * @description METODO QUE TOMA EL VALOR DEL COMBO GRADO DE INTERES
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @param {*} event
   * @memberof ListCotizarComponent
   */
  cambioSeleccionGradoInteres(event) {
    console.log('evento ' + JSON.stringify(event.value));
    console.log('evento ' + JSON.stringify(this.fgradoInteres.value));
  }
  /**
   * @description METODO QUE TOMA EL VALOR DEL COMBO MOTIVO DE DESESTIMIENTO
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @param {*} event
   * @memberof ListCotizarComponent
   */
  cambioSeleccionMotivoDesestimiento(event) {
    console.log('evento ' + JSON.stringify(event.value));
    console.log('evento ' + JSON.stringify(this.fmotivoDesestimiento.value));
  }
  /**
   * @description METODO QUE TOMA EL VALOR DEL COMBO TIPO DE ORO
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @param {*} event
   * @memberof ListCotizarComponent
   */
  cambioSeleccionTipoOro(event) {
    console.log('evento ' + JSON.stringify(event.value));
    console.log(' TOMA EL VALOR DEL EVENTO DEL ORO evento ' + JSON.stringify(this.tipoOro.value));
    this.setPrecioOro();
  }
  /*******************************************METODOS DEL PAGINATOR*****************************************************    */
  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSourceVarCredi = new MatTableDataSource();
    this.dataSourcePrecioOro = new MatTableDataSource();
    this.dataSourceCredito = new MatTableDataSource();
    this.dataSourceCliente = new MatTableDataSource();

    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSourceVarCredi.paginator = this.paginator;
    this.dataSourcePrecioOro.paginator = this.paginator;
    this.dataSourceCredito.paginator = this.paginator;
  }

  /**
  * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
  */
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string, pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    // // console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }

  /**
  * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
  */
  paged() {
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', this.paginator.pageIndex);

  }
  /**
  * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
  */
  buscar() {
    this.p = new Page();
    this.totalResults = 0;
    this.paginator.pageIndex = 0;
    this.p.isPaginated = 'Y';
    this.p.size = 5;
    this.p.pageNumber = 0;
  }


  /**
   * @description METODO QUE REALIZA LA VALIDACION DEL VALOR SELECCIONADO EN APROBACION MUPI
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   * @memberof ListCotizarComponent
   */
  validarMupi() {

    if (this.aprobacionMupi.value === 'SI') {
      this.isCheckSi = true;
      this.isCheckNo = false;
    } else if (this.aprobacionMupi.value === 'NO') {
      this.isCheckSi = false;
      this.isCheckNo = true;
    }
  }
  /*********METODOS DE LA LOGICA DE PROGRAMACION ***************************    */
  /**

 * Metodo buscarCliente en primera instancia busca en SOFTBANK luego en en CRM Y finalmente la Calculadora Quski
 *
 * Si no existe carga  pide que se suba la autorizacion de equifax.
 */
  buscarCliente() {
    // TODO: AUMENTAR EL SOFTBANK CUANDO SE TENGA
    this.loadingSubject.next(true);
    console.log('INICIA BUSQUEDA EN CRM');
    this.clienteService.findClienteByCedulaCRM(this.identificacion.value).subscribe((data: any) => {
      console.log('Valores que llega de CRM-->', JSON.stringify(data));
      if (data && data.list) {
        // IMPLEMENTACION DE TRACKING
        this.tr.getSystemDate().subscribe((hora: any) => {
          //console.log('INICIA EL REGISTRO DE TRACKING EN PROSPECCION', JSON.stringify(hora));
          if (hora.entidad) {
            console.log('INICIA TRACKING COTIZACION Hora del core ----> ' + JSON.stringify(hora.entidad));
            this.horaInicio = hora.entidad;
            this.horaAsignacion = hora.entidad;
            this.horaAtencion = hora.entidad;
            //this.sinNoticeService.setNotice('INCIA TRACKING PROSPECTO', 'error');
          }
        });

        // seteo valores en la vista
        this.nombresCompletos.setValue(data.list[0].firstName);
        // console.log('Nombres completos CRM', data.list[0].firstName);
        this.movil.setValue(data.list[0].phoneMobile);
        this.telefonoDomicilio.setValue(data.list[0].phoneHome);
        this.correoElectronico.setValue(data.list[0].emailAddress);
        // llenando datos cliente
        this.cliente.cedulaCliente = data.list[0].cedulaC;
        this.cliente.primerNombre = data.list[0].firstName;
        this.cliente.email = data.list[0].emailAddress;
        this.cliente.telefonoFijo = data.list[0].phoneHome;
        this.cliente.telefonoMovil = data.list[0].phoneMobile;
        this.cliente.estado = EstadoQuskiEnum.ACT;

        // llamo al metodo de equifax
        console.log('CLIENTE QUE SE ASIGNA', JSON.stringify(this.cliente));
        this.llamarEquifax();
      } else {
        this.sinNoticeService.setNotice('USUARIO NO REGISTRADO ', 'error');
        // Llamo al popUp
        this.solicitarAutorizacion();
      }
    });
  }
  /**
   * Metodo que ejecuta la llamada a equifax
   */
  llamarEquifax() {
    this.loadingSubject.next(true);
    console.log('INICIA EQUIFAX');
    console.log('IDENTIFICAICON ----->' + this.identificacion.value);
    this.is.getInformacionPersonaCalculadora('C', this.identificacion.value, 'CC', 'N').subscribe((resp: any) => {
      // this.loadingSubject.next(true);
      console.log('RESPONSE QUSKI getInformacionPersonaCalculadora:::::>' + JSON.stringify(resp));
      // SETEO LOS DATOS QUE VIENEN DEL SERVICIO
      this.loadingSubject.next(true);

      const mensa = JSON.stringify(resp.entidad.mensaje).toUpperCase();

      if (resp.entidad.mensaje && resp.entidad.mensaje !== ' ') {
        console.log('MENSAJE A EQUIFAX', JSON.stringify(resp.entidad.mensaje));
        this.mensaje = JSON.stringify(resp.entidad.mensaje).toUpperCase();
        this.verMensajes();
        console.log('INGRESA A VER EL MSG', JSON.stringify(resp));
      }



      // SETEO LOS DATOS QUE VIENEN DEL SERVICIO
      this.identificacion.setValue(resp.entidad.identificacion);
      this.nombresCompletos.setValue(resp.entidad.datoscliente.nombrescompletos);
      this.nacionalidad.setValue(resp.entidad.datoscliente.nacionalidad);
      this.cliente.campania = resp.entidad.datoscliente.campania;
      this.campania.setValue(resp.entidad.datoscliente.codigocampania);
      this.cliente.cedulaCliente = resp.entidad.identificacion;
      this.cliente.primerNombre = resp.entidad.datoscliente.nombrescompletos;
      this.cliente.nacionalidad = resp.entidad.datoscliente.nacionalidad;
      this.cliente.telefonoFijo = resp.entidad.datoscliente.telefonofijo;
      this.cliente.telefonoMovil = resp.entidad.datoscliente.telefonomovil;
      this.cliente.fechaNacimiento = this.fechaNacimiento.value;
      this.cliente.edad = this.edad.value;
      this.cliente.publicidad = this.fpublicidad.value;
      this.cliente.campania = this.campania.value;

      // VALIDACION que la entidad no este null y las variables tambien no lo esten
      if (resp && resp.entidad && resp.entidad.xmlVariablesInternas && resp.entidad.xmlVariablesInternas.variablesInternas &&
        resp.entidad.xmlVariablesInternas.variablesInternas.variable) {
        const tmps = resp.entidad.xmlVariablesInternas.variablesInternas.variable;

        // LLENO LA VARIABLE CREDITICIA
        for (let index = 0; index < tmps.length; index++) {
          this.variableCrediticia = new TbQoVariablesCrediticia();
          this.variableCrediticia.orden = tmps[index].orden;
          this.variableCrediticia.nombre = tmps[index].codigo;
          this.variableCrediticia.valor = tmps[index].valor;
          this.variableCrediticiaArray.push(this.variableCrediticia);

        }
        this.dataSourceVarCredi = new MatTableDataSource(this.variableCrediticiaArray);


      }

      console.log('VARIABLE CREDITICIA EQUIFAX ------>', JSON.stringify(this.variableCrediticiaArray));
      console.log('CLIENTE  EQUIFAX ANTES DE GUARDAR ------->', JSON.stringify(this.cliente));

      this.guardarCliente();
      this.loadingSubject.next(false);
      //  this.sinNoticeService.setNotice('INFORMACION CARGADA CORRECTAMENTE DEL CRM', 'success');
    });
  }
  /**
   * Metodo que GUARDA EL CLIENTE EN LA BASE DE DATOS
   */

  //TODO: primero" busca en softbank si encuentra llama al persist si no,
  // busca en "", si encuentra llama al persist, si no encuentra 
  // busca n equifax, llama atorizacion y llama al persist

  guardarCliente() {
    this.loadingSubject.next(true);
    if (this.cliente.id) {
      this.clienteService.findClienteByIdentificacionCotizacion(this.cliente.cedulaCliente).subscribe((clienteData: any) => {
        console.log('1.- *****EL CLIENTE nuevo es  ES*****    -------> ', JSON.stringify(clienteData));
        if (clienteData) {
          //SSI EL CLIENTE EXISTE
          this.cliente.id = clienteData.entidad.id;
          console.log('2.- ****Id cliente   -------> ', this.cliente.id);
          //MANDA A BUSCAR LAS COTIZACIONES DEL CLIENTE
          this.cs.findByIdCliente(this.cliente.cedulaCliente).subscribe((cotizacionData: any) => {
            console.log('3.- ****COTIZACION ENCONTRADA --------> ', JSON.stringify(cotizacionData));

            if (cotizacionData && cotizacionData.list !== null) {
              this.listCotizaciones = cotizacionData.list;
              console.log('4.- ****VALORES DE LAS COTIZACIONES -----> ', JSON.stringify(this.listCotizaciones[0]));
              this.cs.caducarCotizacion(this.listCotizaciones[0]).subscribe((listCotizacionesData: any) => {
                console.log('5.- *****VALOR CADUCA COTIZACION   ----->', JSON.stringify(this.listCotizaciones));
              });
              console.log('INGRESA A CREAR CLIENTE COTIZACION NUEVO ----->');
              this.crearClienteCotizacionNuevo();
            }

          });
        }
      });
    } else {
      console.log('CREA UN NUEVO CLIENTE ----->', JSON.stringify(this.cliente));
      this.crearClienteCotizacionNuevo();
    }
  }
  /**
   * @description METODO QUE CREA AL CLIENTE NUEVO Y SI ES ANTERIOR TAMBIEN CREA LA COTIZACION
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-15
   * @memberof ListCotizarComponent
   */
  crearClienteCotizacionNuevo() {
    console.log('INGRESA A CREAR CLIENTE crearClienteCotizacionNuevo-------> ', JSON.stringify(this.cliente.id));
    this.cotizacion = new TbCotizacion();
    // SETEO LOS VALORES DEL CLIENTE NUEVO
    this.cotizacion.tbQoCliente = this.cliente;
    this.cotizacion.tbQoVariablesCrediticias = this.variableCrediticiaArray;
    this.cotizacion.aprobacionMupi = this.aprobacionMupi.value;
    this.cotizacion.tbQoCliente = this.cliente;
    this.cotizacion.estado = EstadoQuskiEnum.ACT;
    this.cliente.fechaNacimiento = this.fechaNacimiento.value;
    this.cliente.edad = this.edad.value;
    this.cliente.publicidad = this.fpublicidad.value;
    this.cliente.campania = this.campania.value;
    this.cliente.telefonoFijo = this.telefonoDomicilio.value;
    this.cliente.telefonoMovil = this.movil.value;
    this.cliente.aprobacionMupi = this.aprobacionMupi.value;

    console.log('COTIZACION A CREAR---> ', JSON.stringify(this.cotizacion));
    this.cs.crearCotizacionClienteVariableCrediticia(this.cotizacion).subscribe((data: any) => {
      console.log('VALORES CREADOS DE LA COTIZAACION', JSON.stringify(data));
      if (data && data.entidad) {
        this.cotizacion = data.entidad;
        console.log('COTIZACION ID ----> ', JSON.stringify(data.entidad.id));
        console.log('Cotizacion con Id GENERADA+++++++>' + JSON.stringify(this.cotizacion));
        this.idCotizacion = this.cotizacion.id;

        this.sinNoticeService.setNotice('SE REGISTRA LA COTIZACION', 'success');
      }
    });
  }







  /**POP UP SOLICITUD EQUIFAX */
  solicitarAutorizacion() {
    this.loadingSubject.next(false);

    // console.log('>>>INGRESA AL DIALOGO ><<<<<<');
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: this.identificacion.value


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      // console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));

      //
      if (respuesta !== null && respuesta !== undefined) {
        // console.log('al cerrar el dialogo ' + JSON.stringify(respuesta));
        this.llamarEquifax();
      } else {
        // console.log('envio de ELSE ' + respuesta);
        this.sinNoticeService.setNotice('ACCIÓN CANCELADA ', 'error');
        this.limpiarCampos();
      }
    });
  }



  /**POP UP SOLICITUD EQUIFAX */
  verMensajes() {

    console.log('VALORES DE MENSAJE QUE ENVIO---> ', this.mensaje);
    this.loadingSubject.next(false);

    // console.log('>>>INGRESA AL DIALOGO ><<<<<<');
    const dialogRefGuardar = this.dialog.open(MensajeExcepcionComponent, {
      width: '600px',
      height: 'auto',
      data: this.mensaje


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      // console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));

      //
      if (respuesta !== null && respuesta !== undefined) {
        // console.log('al cerrar el dialogo ' + JSON.stringify(respuesta));
        this.llamarEquifax();
      }
    });
  }




  verPrecio() {


    if (this.identificacion.value !== null && this.nombresCompletos.value !== null && this.fpublicidad.value && this.aprobacionMupi.value && this.fechaNacimiento.value && this.edad.value && this.nacionalidad.value && this.movil.value && this.telefonoDomicilio.value && this.correoElectronico.value && + this.campania.value) {
      // IMPLEMENTACION DEL TRACKING
      this.tr.getSystemDate().subscribe((hora: any) => {
        //console.log('Registro PROSPECCION final');
        if (hora.entidad) {
          this.horaFinal = hora.entidad;
          if (this.idCotizacion != null) {
            this.registroProspeccion(
              this.idCotizacion,
              this.horaInicio,
              this.horaAsignacion,
              this.horaAtencion,
              this.horaFinal
            );
          } else {
            //this.sinNoticeService.setNotice('NO EXISTE COTIZACION PARA REGISTRAR EL TRACKING', 'error');
          }
        }

      });

      this.loadingSubject.next(false);
      this.tr.getSystemDate().subscribe((hora: any) => {
        // console.log('INICIA EL REGISTRO DE TRACKING EN TASACION', JSON.stringify(hora));
        if (hora.entidad) {
          // console.log('INICIA TRACKING COTIZACION TASACION Hora del core ----> ' + JSON.stringify(hora.entidad));
          this.horaInicio = hora.entidad;
          this.horaAsignacion = hora.entidad;
          this.horaAtencion = hora.entidad;
          //this.sinNoticeService.setNotice('INCIA TRACKING TASACION', 'error');

        }
      });
      // this.guardarCliente();
      this.getTipoOro();
      this.sinNoticeService.setNotice('INFORMACION COMPLETA', 'success');
      this.disableVerVariableSubject.next(true);
      this.stepper.selectedIndex = 2;
    } else {
      this.sinNoticeService.setNotice('POR FAVOR COMPLETE LA INFORMACION', 'warning');
      this.loadingSubject.next(true);
      this.stepper.selectedIndex = 0;
      this.disableVerVariableSubject.next(true);
    }
  }

  /**ACCION DE BOTONES */
  /**
   * Metodo que realiza la accion del boton GUARDAR
   */
  submit() {
    this.loadingSubject.next(false);
    // REGISTRO DE TRACKING PARA COTIZACION
    this.tr.getSystemDate().subscribe((hora: any) => {
      console.log('Registro cotizacion final');
      if (hora.entidad) {
        this.horaFinal = hora.entidad;
        if (this.idCotizacion != null) {
          this.registroTasación(
            this.idCotizacion,
            this.horaInicio,
            this.horaAsignacion,
            this.horaAtencion,
            this.horaFinal
          );
        } else {
          //this.sinNoticeService.setNotice('NO EXISTE COTIZACION PARA REGISTRAR TRACKING', 'error');
        }
      }

    });

    const cedula = this.identificacion.value;
    /**
     * Valores que tomo de la vista
     */
    console.log('INICIA EL METODO GUARDAR ');
    console.log('=================================================');
    console.log('DATOS CLIENTE ');
    console.log('CEDULA' + this.identificacion.value);
    console.log('NOMBRE:' + this.nombresCompletos.value);
    console.log('FECHA DE NACIMINETO' + this.fechaNacimiento.value);
    console.log('EDAD' + this.edad.value);
    console.log('NACIONALIDAD' + this.nacionalidad.value);
    console.log('MOVIL' + this.movil.value);
    console.log('TELEFONO DOMICILIO', this.telefonoDomicilio);
    console.log('PUBLICIDAD' + this.fpublicidad.value);
    console.log('CORREO ELECTRONICO' + this.correoElectronico.value);
    console.log('CAMPAÑA' + this.campania.value);
    console.log('APROBACION MUPI' + this.aprobacionMupi.value);
    console.log('VARIABLES CREDITICIAS', JSON.stringify(this.variableCrediticiaArray));
    console.log('PRECIO ORO', JSON.stringify(this.preciosArray));
    /**
     * Seteo los valores de la vista DATOS CLIENTE en el objeto cliente
     */
    this.cliente.cedulaCliente = this.identificacion.value;
    this.cliente.primerNombre = this.nombresCompletos.value;
    this.cliente.fechaNacimiento = this.fechaNacimiento.value;
    this.cliente.edad = this.edad.value;
    this.cliente.nacionalidad = this.nacionalidad.value;
    this.cliente.publicidad = this.fpublicidad.value ? this.fpublicidad.value.valor : '';
    this.cliente.email = this.correoElectronico.value;
    this.cliente.campania = this.campania.value;
    this.cliente.telefonoFijo = this.telefonoDomicilio.value;
    this.cliente.telefonoMovil = this.movil.value;
    this.cliente.estado = EstadoQuskiEnum.ACT;
    // console.log('DATOS DEL CLIENTE CAMPOS TOMADOS' + JSON.stringify(this.cliente));
    /**
     * INICIA EL GUARDADO DEL CLIENTE EN LA BASE
     */
    // if (this.cliente.cedulaCliente) {
    // console.log('INICIA EL SUBMIT*****');
    // console.log('DATOS DE CLIENTE EN EL SUBMIT' + JSON.stringify(this.cliente));
    // this.guardarCliente();
    // console.log('DATOS QUE RESPONDE LUEGO DE LA VALIDACION++++++++>> ' + JSON.stringify(this.cliente));
  }
  /** BOTON RIESGO ACUMULADO   */
  /**TODO: AL MOMENTO NO SE ENCUENTRA IMPLEMENTADO EL SERVICIO YA QUE NO ESTA
   * Metodo que llama al popUp de creditos vigentes a
   */
  goRiesgoAcumulado() {
    const dialogRef = this.dialog.open(CreditoVigenteDialogComponent, {
      width: 'auto',
      height: 'auto',
      // data: this.dataSource.data
    });
    dialogRef.afterClosed().subscribe(() => {
      //
    });
    //  this.router.navigate(['../quski-core/components/riesgo-acomulado-dialog/credito-vigente-dialog']);
  }

  /**ACCIONES VARIAS  */

  /**
   * Limpio los campos de la vista Cliente
   */
  limpiarCampos() {
    Object.keys(this.formCliente.controls).forEach((name) => {
      // // console.log( "==limpiando " + name )
      const control = this.formCliente.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }
  /**
   * MANEJO DE ERRORES
   */
  getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorNumero = 'Ingreso solo numeros';
    const maximo = 'El maximo de caracteres es: ';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    const errorSeleccion = 'Seleccione una opcion';
    /**
     * Validaciones de cedula
     */
    if (pfield && pfield === 'cedula') {
      const input = this.formCliente.get('cedula');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('invalid-identification')
            ? invalidIdentification
            : input.hasError('maxlength')
              ? errorLogitudExedida
              : input.hasError('minlength')
                ? errorInsuficiente
                : '';
    }
    /**
     * Validaciones de nombresCompletos
     */
    if (pfield && pfield === 'nombresCompletos') {
      const input = this.nombresCompletos;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion de fecha de nacimiento
     */
    if (pfield && pfield === 'fechaNacimiento') {
      const input = this.fechaNacimiento;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion para nacionalidad
     */
    if (pfield && pfield === 'nacionalidad') {
      const input = this.nacionalidad;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion de telefono domicilio
     */
    if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formCliente.get('telefonoDomicilio');
      // console.log('telefonoDocimicilio', this.formCliente.get('telefonoDomicilio'));
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
    /**
       * Validacion de correo electronico
       */
    if (pfield && pfield == 'correoElectronico') {

      return this.correoElectronico.hasError('required') ? errorRequerido : this.correoElectronico.hasError('email') ? 'E-mail no valido' : this.correoElectronico.hasError('maxlength') ? maximo
        + this.correoElectronico.errors.maxlength.requiredLength : '';

    }
    /**
       * Validacion de telefono movil
       */

    if (pfield && pfield === 'movil') {
      const input = this.movil;
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
    if (pfield && pfield === 'aprobacionMupi') {
      const input = this.aprobacionMupi;
      return input.hasError('required')
        ? errorSeleccion
        : input.hasError('required');
    }
  }

  /**CALCULO DE LA EDAD */
  onChangeFechaNacimiento() {

    this.loadingSubject.next(true);
    // console.log('VALOR DE LA FECHA' + this.fechaNacimiento.value);
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    // console.log('FECHA SELECCIONADA' + fechaSeleccionada);
    if (fechaSeleccionada) {
      this.getDiffFechas(fechaSeleccionada, 'dd/MM/yyy');
    } else {
      this.sinNoticeService.setNotice(
        'El valor de la fecha es nulo',
        'warning'
      );
      this.loadingSubject.next(false);
    }
  }
  /**CALCULO DIFERENCIA DE FECHAS PARA EL CALCULO DE LA EDAD */
  getDiffFechas(fecha: Date, format: string) {
    this.loadingSubject.next(true);
    const convertFechas = new RelativeDateAdapter();
    this.sp
      .getDiffBetweenDateInicioActual(
        convertFechas.format(fecha, 'input'),
        format
      )
      .subscribe(
        (rDiff: any) => {
          const diff: YearMonthDay = rDiff.entidad;
          this.edad.setValue(diff.year);
          // console.log('La edad es ' + this.edad.value);

          // this.edad.get("edad").setValue(diff.year);
          // Validacion para que la edad sea mayor a 18 años
          const edad = this.edad.value;
          if (edad != undefined && edad != null && edad < 18) {
            this.edad
              .get('edad')
              .setErrors({ 'server-error': 'error' });
          }
          this.loadingSubject.next(false);
        },
        error => {
          if (JSON.stringify(error).indexOf('codError') > 0) {
            const b = error.error;
            this.sinNoticeService.setNotice(b.msgError, 'error');
          } else {
            this.sinNoticeService.setNotice(
              'Error obtener diferencia de fechas',
              'error'
            );
            // console.log(error);
          }
          this.loadingSubject.next(false);
        }
      );
  }


  /**
   * Metodo limpia los campos del formPrecioOro
   */
  limpiarCamposPrecioOro() {
    Object.keys(this.formPrecioOro.controls).forEach((name) => {
      const control = this.formPrecioOro.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }
  /**
   * Seteo el nuevo Precio Oro
   */
  nuevoPrecioOro() {
    this.preciosOrodSubject.next(false);
    if (this.formPrecioOro.valid) {
      this.precioOro = new TbQoPrecioOro();
      this.disableSimulaSubject.next(true);
      this.totalPeso = 0;
      this.totalPrecio = 0;
      this.tipoOros = this.tipoOro.value;
      if (this.precioOroLocal) {
        console.log('==> precio oro local  ' + this.precioOroLocal);
        this.precioOro = this.precioOroLocal;
      }
      this.precioOro.estado = EstadoQuskiEnum.ACT;
      this.precioOro.pesoNetoEstimado = this.pesoNetoEstimado.value;
      this.precioOro.precio = this.precio.value;
      console.log('NUEVO PRECIO ORO COTIZADOR', JSON.stringify(this.cotizacion));
      this.precioOro.tbQoCotizador = this.cotizacion;
      this.precioOro.tbQoTipoOro = this.tipoOros;
      if (this.precioOro) {
        console.log('IdCotizacion de nuevo----> ', JSON.stringify(this.cotizacion.id));
        console.log('==><< precio oro para crear ' + JSON.stringify(this.precioOro));
        this.cs.guardarPrecioOro(this.precioOro).subscribe((data: any) => {
          console.log('==><< respuesta para precio oro ' + JSON.stringify(data));
          this.disableSimulaSubject.next(false);
          if (data && data.entidad) {
            console.log('VALOR DEL ID ANTES DE CARGAR EL PRECIO ORO', JSON.stringify(data.entidad.id));
            this.cs.loadPrecioOroByCotizacion(this.cotizacion.id).subscribe((pos: any) => {
              this.dataSourcePrecioOro = new MatTableDataSource(pos.list);
              this.preciosOrodSubject.next(true);
              this.sinNoticeService.setNotice('SE GUARDO EL PRECIO ORO', 'success');
            });
          }
          this.preciosOrodSubject.next(true);
        }, error => {
          this.preciosOrodSubject.next(true);
        });

      }

      this.limpiarCamposPrecioOro();
      this.dataSourcePrecioOro = null;
    } else {
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
    }
  }


  /**
   * Metodo que llama al servicio TIPO ORO
   */
  setPrecioOro() {
    this.precio.setValue('');
    // TOMO LOS VALORES QUE VOY A ENVIAR AL SERVICIO PARA CONSULTAR
    // console.log('LA CEDULA DEL CLIENTE ES LA SIGUIENTE:::::::::::::::::::::::::::::::::: ' + JSON.stringify(this.cliente.cedulaCliente));
    // console.log('LA FECHA DE NACIMIENTO_____:::::::::::::::::::::::::::::::::::::' + JSON.stringify(this.cliente.fechaNacimiento));
    // console.log('EL VALOR SELECCIONADO PARA EL TIPO ORO ES:::::::::::::::::::::::' + JSON.stringify(this.tipoOro.value.quilate));

    // // console.log('llega ');
    this.loadingSubject.next(true);
    if (this.cliente.cedulaCliente) {
      this.os.findTipoOroByCedulaQuski(this.cliente.cedulaCliente, this.tipoOro.value.quilate, this.cliente.fechaNacimiento).subscribe((dataTipoOro: any) => {
        // console.log('tipo de oro que responde>>>>>>>' + JSON.stringify(dataTipoOro));
        // console.log('SACO EL VALOR DEL TIPO ORO');
        // console.log('tipoOro >>>>>>>>>>>>>>', this.tipoOro.value);
        this.loadingSubject.next(false);
        // console.log('cliente >>>>>>>>>>>', dataTipoOro.entidad);
        if (dataTipoOro.entidad) {
          // console.log('oro entidad >>>>>>>>>>', dataTipoOro.entidad);
          this.precio.setValue(dataTipoOro.entidad.simularResult.xmlGarantias.garantias.garantia.valorOro);
          // validdo que no venga valor null
          if ((dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion != null) && (dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion)) {
            // Cargo la lista de variables para la tabla de opciones de credito
            this.listOpciones = dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion;
            // console.log('VALORES DE MI LISTA DE OPCIONES RENOVACION' + JSON.stringify(this.listOpciones));
            // Asigno la informacion al datasource para que cargue las opciones de credito
            this.dataSourceCredito = new MatTableDataSource(this.listOpciones);
            this.precioOro = new TbQoPrecioOro;

          }
        } else {
          this.sinNoticeService.setNotice('ESPECIFIQUE EL TIPO DE ORO', 'info');
        }
      }, error => {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR AL CARGAR DE ORO', 'info');
        if (JSON.stringify(error).indexOf('codError') > 0) {
          const b = error.error;
          this.sinNoticeService.setNotice(b.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('ERROR AL CARGAR', 'error');
        }
      }
      );
    }
  }
  /**
   * Método que realiza la edicion de la tabla precioOro
   * @param element
   */
  editar(element) {

    this.precioOroLocal = null;
    this.cs.seleccionarPrecioOro(element.id).subscribe((data: any) => {
      // RECUPERO LA DATA EN LA PANTALLA
      this.precioOroLocal = data.entidad;
      const toSelectOro = this.listOros.find(p => p.id === data.entidad.tbQoTipoOro.id);
      this.tipoOro.setValue(toSelectOro);
      this.precio.setValue(data.entidad.precio);
      this.pesoNetoEstimado.setValue(data.entidad.pesoNetoEstimado);
      this.disableSimulaSubject.next(true);
      this.sinNoticeService.setNotice('EDITAR INFORMACION ', 'success');
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL REGISTRAR EL PRECIO ORO', 'error');
      }
    });
  }
  /**
   * Metodo que calcula el total de los valores
   */
  calcular() {
    this.totalPeso = 0;
    this.totalPrecio = 0;
    if (this.dataSourceI.data) {
      // console.log('<<<<<<<<<<Data source >>>>>>>>>> ' + JSON.stringify(this.dataSourceI.data));
      this.dataSourceI.data.forEach(element => {
        this.totalPeso = Number(this.totalPeso) + Number(element.pesoNetoEstimado);
        this.totalPrecio = Number(this.totalPrecio) + Number(element.precio);
      });


    }
  }
  /**
   * Agrega un nuevo precio oro al formulario
   * */
  nuevo() {

    if (this.formPrecioOro.valid) {
      this.disableSimulaSubject.next(true);
      this.totalPeso = 0;
      this.totalPrecio = 0;
      this.tipoOros = this.tipoOro.value;
      if (this.element && this.element.id) {
        this.precioOro.id = this.element.id;
        this.dataSourceI.data = null;
      }
      this.precioOro.estado = EstadoQuskiEnum.ACT;
      this.precioOro.pesoNetoEstimado = this.pesoNetoEstimado.value;
      this.precioOro.precio = this.precio.value;
      console.log('GUARDAR PRECIO ORO COTIZAONON    ------> ', JSON.stringify(this.cotizacion));
      this.precioOro.tbQoCotizador = this.cotizacion;
      this.precioOro.tbQoTipoOro = this.tipoOros;
      // console.log('VALOR DE PRECIO ORO ' + JSON.stringify(this.precioOro));
      if (this.precioOro) {
        this.cs.guardarPrecioOro(this.precioOro).subscribe((data: any) => {
          console.log('VALOR  GUARDAR PRECIO ORO' + JSON.stringify(data));
          console.log('DATASOURCE.ENTIDAD' + JSON.stringify(data.entidad));

          this.disableSimulaSubject.next(true);
          this.preciosArray.push(data.entidad);
          console.log('VALORES LISTA ' + JSON.stringify(this.preciosArray));


          if (data && data.entidad) {
            this.dataSourceI = new MatTableDataSource(this.preciosArray);

          }

          // console.log('la data guardada es' + JSON.stringify(data));

          if (data && data.entidad) {
            // console.log('VALOR DE DATA EN EL IF' + JSON.stringify(data));
            this.sinNoticeService.setNotice('SE GUARDO EL PRECIO ORO', 'success');
            // console.log('VALOR DEL ID DE  LA COTIZACION QUE VA>>>>>>> ' + this.cotizacion.id);
          }
        });

      }

      this.limpiarCamposPrecioOro();
      this.dataSourceI = null;
    } else {
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
    }
  }
  /**
   * Metodo que elimina un precio oro seleccionado
   * @param id
   */
  eliminarPrecioOro(id) {
    this.disableSimulaSubject.next(true);
    this.cs.eliminarPrecioOro(id).subscribe((data: any) => {
      this.sinNoticeService.setNotice('SE ELIMINO EL PRECIO DE ORO SELECCIONADO', 'success');
      this.cs.findByIdCotizacion(this.cotizacion.id).subscribe((pos: any) => {
        this.dataSourceI = new MatTableDataSource(pos.list);
      }, error => {

        // console.log('NO HAY REGISTROS ');
        this.disableSimulaSubject.next(false);
      });
    }, error => {
      // console.log('NO HAY REGISTROS ');
      this.disableSimulaSubject.next(false);
    });
  }
  /**
   * Metodo que realiza la simulacion
   */
  simular() {

    this.loadingSubject.next(true);
    this.totalPrecio;
    // console.log('INICIA SIMULAR TOTAL PRECIO >>>>', this.totalPrecio);
    if (this.listOpciones) {
      this.dataSourceCredito = new MatTableDataSource(this.listOpciones);
      this.stepper.selectedIndex = 3;
    } else {
      this.sinNoticeService.setNotice('NO SE ENCONTRAR REGISTROS', 'info');
    }
  }

  /**
   * Metodo que valida el ingreso de solo numeros
   * @param event
   */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }



  public registroProspeccion(
    codigoRegistro: string,
    fechaInicio: Date,
    fechaAsignacion: Date,
    fechaInicioAtencion: Date,
    fechaFin: Date,) {
    const tracking: TbQoTracking = new TbQoTracking();
    tracking.actividad = ActividadEnum.COTIZACION; // Modulo en ProducBacklog
    tracking.proceso = ProcesoEnum.PROSPECCION;
    tracking.observacion = '';
    tracking.codigoRegistro = codigoRegistro;
    tracking.situacion = SituacionTrackingEnum.EN_PROCESO;
    tracking.usuario = UsuarioEnum.ASESOR;
    tracking.fechaInicio = fechaInicio;
    tracking.fechaAsignacion = fechaAsignacion;
    tracking.fechaInicioAtencion = fechaInicioAtencion;
    tracking.fechaFin = fechaFin;
    console.log('TRACKING DE PROSPECCION--->', JSON.stringify(tracking));
    this.tr.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        console.log(' Tracking creado prospeccion ------>' + JSON.stringify(data.entidad));
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO', 'error');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO // ERROR CAPTURADO', 'error');
      }
    });

  }

  public registroTasación(
    codigoRegistro: string,
    fechaInicio: Date,
    fechaAsignacion: Date,
    fechaInicioAtencion: Date,
    fechaFin: Date,) {
    const tracking: TbQoTracking = new TbQoTracking();
    tracking.actividad = ActividadEnum.COTIZACION; // Modulo en ProducBacklog
    tracking.proceso = ProcesoEnum.TASACION;
    tracking.observacion = '';
    tracking.codigoRegistro = codigoRegistro;
    tracking.situacion = SituacionTrackingEnum.EN_PROCESO;
    tracking.usuario = UsuarioEnum.ASESOR;
    tracking.fechaInicio = fechaInicio;
    tracking.fechaAsignacion = fechaAsignacion;
    tracking.fechaInicioAtencion = fechaInicioAtencion;
    tracking.fechaFin = fechaFin;
    console.log('LLAMO A REGISTRO TASACION');
    this.tr.guardarTracking(tracking).subscribe((data: any) => {

      if (data.entidad) {
        console.log(' TRACKING TASACION ------>' + JSON.stringify(data.entidad));
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO', 'error');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO // ERROR CAPTURADO', 'error');
      }
    });

  }

}
