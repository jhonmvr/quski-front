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
import { TbQoVariableCrediticia } from '../../../../../core/model/quski/TbQoVariableCrediticia';
import { TbCotizacion } from '../../../../../core/model/quski/TbCotizacion';
import { SolicitudAutorizacionDialogComponent } from '../../../../../../app/views/partials/custom/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ValidateCedula, ValidateCedulaNumber } from '../../../../../core/util/validate.util';
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
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
export interface User {
  name: string;
}
/**
 * @description Clase se que realiza la administracion de la cotización
 * @author Kléber Guerra  - Relative Engine
 * @date 07/07/2020
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
  // STREPPER FUNCIONALIDAD PARA QUE SEA DE UNO EN UNO
  isLinear = false;
  // STANDARD VARIABLES
  public loading;
  public isCheckSi = false;
  public isCheckNo = false;
  disableGuardar;
  disableSimular;
  disableVerPrecio;
  disableVerVariable;
  disableMensajeBloqueo;
  disableMensajeBloqueoSubject = new BehaviorSubject<boolean>(false);
  disableVerVariableSubject = new BehaviorSubject<boolean>(false);
  disableGuardarSubject = new BehaviorSubject<boolean>(true);
  disableSimulaSubject = new BehaviorSubject<boolean>(false);
  disableVerPrecioSubject = new BehaviorSubject<boolean>(true);
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
  listPublicidad = []; // = Object.keys(PulicidadEnum);
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
  public formPrecioOroStep: FormGroup = new FormGroup({});
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
  // OPCIONES DE CREDITO
  public fgradoInteres = new FormControl('', [Validators.required]);
  public fmotivoDesestimiento = new FormControl('', [Validators.required]);
  // FORM PRECIO ORO
  public formPrecioOro: FormGroup = new FormGroup({});
  public tipoOro = new FormControl('', [Validators.required]);
  public pesoNetoEstimado = new FormControl('', [Validators.required, ValidateDecimal]);
  public precio = new FormControl('', [Validators.required, ValidateDecimal]);
  public aprobacionMupi = new FormControl('', [Validators.required]);
  public mensajeBloqueo = new FormControl('', [Validators.required]);

  // VARIABLES PRECIO ORO/
  public totalPrecio = 0;
  public totalPeso = 0;
  public precioOroSeleccionado: TbQoPrecioOro;
  public precioOro = new TbQoPrecioOro();
  public tipoOros = new TbQoTipoOro();
  public variableCrediticia = new TbQoVariableCrediticia();
  public variableCrediticiaArray = new Array<TbQoVariableCrediticia>();
  public preciosArray = new Array<TbQoPrecioOro>();
  public precioOroLocal;
  public opciones: string[] = ['Si', 'No'];
  public seleccion: string;
  public primerNombre = '';
  public segundoNombre = '';
  public primerApellido = '';
  public segundoApellido = '';

  // CALCULADORA VARIABLES
  public tipoIdentificacion = 'C';
  gradoIntere = new FormControl('', []);
  aprobadoWebMupi = new FormControl('', []);
  apellidoCliente = new FormControl('', []);
  // OPCIONES PRECIO ORO
  precioEstimado = new FormControl('', []);
  // OBSERVABLE PARA LA TABLA DE PRECIO ORO
  preciosOroAsyn;
  preciosOrodSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  // OPCIONES DE CREDITO
  plazo = new FormControl('', []);
  montoPreAprobado = new FormControl('', []);
  aRecibir = new FormControl('', []);
  totalCostosOperacion = new FormControl('', []);
  totalCostosNuevaOperacion = new FormControl('', []);
  costoCustodia = new FormControl('', []);
  costoTransporte = new FormControl('', []);
  costoCredito = new FormControl('', []);
  costoSeguro = new FormControl('', []);
  costoResguardo = new FormControl('', []);
  costoEstimado = new FormControl('', []);
  valorCuota = new FormControl('', []);
  // VISUALIZACION DE LAS COLUMNAS DE LAS TABLAS
  displayedColumnsVarCredi = ['orden', 'variable', 'valor'];
  displayedColumnsPrecioOro = ['accion', 'N', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  displayedColumnsCreditoNegociacion = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoSeguro', 'costoResguardo', 'costoEstimado', 'valorCuota'];
  /**Obligatorio paginacion */
  p = new Page();
  // DATASOURCE
  // dataSourceI = new MatTableDataSource<any>();
  dataSourceVarCredi: MatTableDataSource<TbQoVariableCrediticia> = new MatTableDataSource<TbQoVariableCrediticia>();
  dataSourcePrecioOro: MatTableDataSource<TbQoPrecioOro> = new MatTableDataSource<TbQoPrecioOro>();
  dataSourceCredito: MatTableDataSource<TbQoCreditoNegociacion> = new MatTableDataSource<TbQoCreditoNegociacion>();
  dataSourceCliente: MatTableDataSource<TbQoCliente> = new MatTableDataSource<TbQoCliente>();
  dataSourceCotizacion: MatTableDataSource<TbCotizacion> = new MatTableDataSource<TbCotizacion>();
  dataSourceTipoOro: MatTableDataSource<TbQoTipoOro> = new MatTableDataSource<TbQoTipoOro>();

  /**
   * @description Metodo para paginador
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @type {MatPaginator}
   * @memberof ListCotizarComponent
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
   * Constructor de la clase
   * Creates an instance of ListCotizarComponent.
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @param {DatePipe} datepipe
   * @param {TituloContratoService} titulo
   * @param {OroService} os
   * @param {JoyaService} js
   * @param {TrackingService} tr
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
    public titulo: TituloContratoService,
    private os: OroService,
    private js: JoyaService,
    private tr: TrackingService,
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private clienteService: ClienteService,
    private sp: ParametroService,
    private cs: CotizacionService,
    private dc: CreditoService,
    public dialog: MatDialog, private fb: FormBuilder) {

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
    // FORM VARIABLES
    this.formVariable.addControl('mensajeBloqueo', this.mensajeBloqueo);
    this.fb.group(this.formVariable);
    // FORM PRECIO ORO
    this.formPrecioOro.addControl('tipoOro  ', this.tipoOro);
    this.formPrecioOro.addControl('pesoNetoEstimado  ', this.pesoNetoEstimado);
    this.formPrecioOro.addControl('precio  ', this.precio);
    this.fb.group(this.formPrecioOro);
    // INICIALIZO LOS COMBOS
    this.getPublicidades();
    this.getGradoInteres();
    this.getMotivoDesestimiento();
    this.sinNoticeService.setNotice(null);
    // VARIABLES
    this.precioOroLocal = null;
  }

  /**
   * @description Metodod que CARGA DESPUES DEL CONSTRUCTOR
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  ngOnInit() {
    this.limpiarCampos();
    this.formCliente = this.fb.group({

    });
    this.date = new Date();
    this.titulo.setNotice('GESTION DE COTIZACION');
    // OBSERVABLES
    this.loading = this.loadingSubject.asObservable();
    this.disableGuardar = this.disableGuardarSubject.asObservable();
    this.disableSimular = this.disableSimulaSubject.asObservable();
    this.disableVerPrecio = this.disableVerPrecioSubject.asObservable();
    this.disableVerVariable = this.disableVerVariableSubject.asObservable();
    this.disableMensajeBloqueo = this.disableMensajeBloqueoSubject.asObservable();
    this.preciosOroAsyn = this.preciosOrodSubject.asObservable();
    // SETEO NOMBRE DEL HEADER DE LA PAGINA
    this.subheaderService.setTitle('Cotización');
    // METODOS DEL PAGINADOR
    this.initiateTablePaginator();
    // Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      this.initiateTablePaginator();
      this.buscar();
    });
  }
  // CARGA EL USUARIO QUE ESTA LOGEADO
  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  /** CARGA DE COMBOS  */
  /**
   * Metodo que trae los motivos de desestimiento de la base de datos tabla parametros
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
  * Metodo que trae los grados de interes de la base de datos tabla parametros
  */
  getGradoInteres() {
    this.sp.findByNombreTipoOrdered('', 'GINT', 'Y').subscribe((wrapper: any) => {
      // //console.log("retornos "+ JSON.stringify(wrapper)  );
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
    * Metodo que trae los tipos de publicidad de la base de datos tabla parametros
    */
  getPublicidades() {
    this.sp.findByNombreTipoOrdered('', 'PUB', 'Y').subscribe((wrapper: any) => {
      // //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < wrapper.entidades.length; i++) {
          this.listPublicidad.push(wrapper.entidades[i].valor.toUpperCase());
          // //console.log('Valores de list publicidades --->' + this.listPublicidad);
        }
        // this.listPublicidad = wrapper.entidades.valor;
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
   *  this.js.findAllTipoOro(this.p).subscribe((data: any) => {
      //console.log("VALOR DE LOS TIPOS ORO " + JSON.stringify(data));
    });
   */
  /**
   * METODO DE QUE TRAE TODOS LOS TIPO ORO EJ 18K
   */
  getTipoOro() {
    this.p = new Page();
    this.totalResults = 0;
    this.paginator.pageIndex = 0;
    this.p.isPaginated = 'Y';
    this.p.size = 5;
    this.p.pageNumber = 0;
    // console.log('ANTES DE INGRESAR AL TIPO ORO');
    this.js.findAllTipoOro().subscribe((wrapper: any) => {
      // //console.log("retornos " + JSON.stringify(wrapper.list));
      if (wrapper) {
        this.listOros = wrapper.list;
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar Tipo Oro', 'error');
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

  /*********METODOS PARA TOMAR LOS VALORES DE LOS COMBOS*********************    */
  /**
   * Metodo que toma el valor del combo publicidad
   * @param event
   */
  cambioSeleccionPublicidad(event) {
    // console.log('evento ' + JSON.stringify(event.value));
    // console.log('evento ' + JSON.stringify(this.fpublicidad.value));
  }
  /**
   * Metodo que toma el valor del combo Grado de interes
   * @param event
   */
  cambioSeleccionGradoInteres(event) {
    // console.log('evento ' + JSON.stringify(event.value));
    // console.log('evento ' + JSON.stringify(this.fgradoInteres.value));
  }
  /**
   * Metodo que toma el valor del combo Motivo Desestimiento
   * @param event
   */
  cambioSeleccionMotivoDesestimiento(event) {
    // console.log('evento ' + JSON.stringify(event.value));
    // console.log('evento ' + JSON.stringify(this.fmotivoDesestimiento.value));
  }
  /**
* Metodo que toma el valor del combo Tipo de Oro
* @param event
*/
  cambioSeleccionTipoOro(event) {
    // console.log('evento ' + JSON.stringify(event.value));
    // console.log(' TOMA EL VALOR DEL EVENTO DEL ORO evento ' + JSON.stringify(this.tipoOro.value));
    this.setPrecioOro();
  }
  /*********METODOS DEL PAGINATOR*****************************************    */
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
    // //console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }

  /**
  * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
  */
  paged() {
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', this.paginator.pageIndex);

  }

  /**
   * @description Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
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
   * @description Metodo que realiza la validacion de informacion si trae o no la cotizacion anterior
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
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
  /*********METODOS DE LA FUNCIONALIDAD DE PROGRAMACION ***************************    */


  /**
   * @description  Metodo buscarCliente en primera instancia busca en CloudStudio luego en en CRM
   * Y finalmente la Calculadora Quski Si no existe carga  pide que se suba la autorizacion de equifax.
   * @author Kléber Guerra
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  buscarCliente() {
    // TODO: AUMENTAR EL SOFTBANK CUANDO SE TENGA
    this.loadingSubject.next(true);
    this.clienteService.findClienteByCedulaCRM(this.identificacion.value).subscribe((data: any) => {
      if (data && data.list) {
        // seteo valores en la vista
        this.nombresCompletos.setValue(data.list[0].firstName);
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
        this.llamarEquifax();

      } else {
        this.sinNoticeService.setNotice('USUARIO NO REGISTRADO ', 'error');
        // Llamo al popUp
        this.solicitarAutorizacion();
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('EL CLIENTE NO SE ENCUENTRA EN CRM', 'warning');
      }
    });
  }

  /**
   * @description Metodo que recupera en pantalla la cotizacion anterior activa
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  recuperarCotizacionAnterior() {
    this.clienteService.findClienteByIdentificacionWithCotizacion(this.cliente.cedulaCliente).subscribe((clienteData: any) => {
      if (clienteData && clienteData.entidad) {
        console.log('INGRESA AL IF recuperarCotizacionAnterior ', JSON.stringify(clienteData));
        this.limpiarCampos();
        this.sinNoticeService.setNotice('Tiene cotizaciones anteriores', 'warning');
        this.identificacion.setValue(clienteData.entidad.cedulaCliente);
        this.nombresCompletos.setValue(clienteData.entidad.primerNombre);
        this.fechaNacimiento.setValue(new Date(clienteData.entidad.fechaNacimiento));
        this.edad.setValue(clienteData.entidad.edad);
        this.nacionalidad.setValue(clienteData.entidad.nacionalidad);
        this.movil.setValue(clienteData.entidad.telefonoMovil);
        this.telefonoDomicilio.setValue(clienteData.entidad.telefonoFijo);
        this.fpublicidad.setValue(clienteData.entidad.publicidad);
        this.correoElectronico.setValue(clienteData.entidad.email);
        this.campania.setValue(clienteData.entidad.campania);
        this.aprobacionMupi.setValue(clienteData.entidad.tbQoCotizador[0].aprobacionMupi);
        this.cotizacion = clienteData.entidad.tbQoCotizador[0];
        this.validarMupi();

      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar cotizaciones anteriores', 'error');
        }
      } else if (error.statusText && error.status === 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: 'Error ' + error.statusText + ' - ' + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice('Error al cargar cotizacion', 'error');
      }
    });
  }

  /**
   * @description  Metodo que ejecuta la llamada a equifax
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  llamarEquifax() {

    this.clienteService.findClienteByCedulaQusqui(this.tipoIdentificacion, this.identificacion.value).subscribe((resp: any) => {

      this.loadingSubject.next(true);
      if (resp && resp.entidad.mensaje !== '') {
        this.disableMensajeBloqueoSubject.next(true);
        this.mensajeBloqueo.setValue(resp.entidad.mensaje);
      } else { this.disableMensajeBloqueoSubject.next(false); }
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
        for (let index = 0; index < tmps.length; index++) {
          this.variableCrediticia = new TbQoVariableCrediticia();
          this.variableCrediticia.orden = tmps[index].orden;
          this.variableCrediticia.nombre = tmps[index].codigo;
          this.variableCrediticia.valor = tmps[index].valor;
          this.variableCrediticiaArray.push(this.variableCrediticia);
        }
        this.dataSourceVarCredi = new MatTableDataSource(this.variableCrediticiaArray);
      }
      this.guardarCliente();
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice('INFORMACION CARGADA CORRECTAMENTE DEL CRM', 'success');
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar Cliente', 'error');
        }
      } else if (error.statusText && error.status === 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: 'Error ' + error.statusText + ' - ' + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice('Error al cargar Cliente', 'error');
      }
    });
  }
  /**
   * @descriptionMetodo que GUARDA EL CLIENTE EN LA BASE DE DATOS
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  guardarCliente() {
    this.loadingSubject.next(true);
    console.log('ingresa a   guardarCliente');
    this.clienteService.findClienteByIdentificacionWithCotizacion(this.cliente.cedulaCliente).subscribe((clienteData: any) => {
      console.log('VALOR DE  guardarCliente', JSON.stringify(clienteData));
      if (clienteData && clienteData.entidad) {
        this.cliente.id = clienteData.entidad.id;
        this.recuperarCotizacionAnterior();
      } else {
        this.cotizacion.tbQoCliente = this.cliente;
        this.cotizacion.tbQoVariablesCrediticias = this.variableCrediticiaArray;
        this.cotizacion.estado = EstadoQuskiEnum.ACT;
        this.cotizacion.aprobacionMupi = this.aprobacionMupi.value;
        this.cs.crearCotizacionClienteVariableCrediticia(this.cotizacion).subscribe((data: any) => {
          if (data && data.entidad && data.e) {
            this.cotizacion = data.entidad;
            this.nacionalidad.setValue(data.entidad.tbQoCliente.nacionalidad);
            this.cotizacion.estado = EstadoQuskiEnum.ACT;
            console.log('Cotizacion con Id GENERADA+++++++>' + JSON.stringify(this.cotizacion));

            this.sinNoticeService.setNotice('SE REGISTRA LA COTIZACION', 'success');
          } else {

            this.sinNoticeService.setNotice('Error al registrar cotizacion', 'error');
          }
        });
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al cargar Tipo Oro', 'error');
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





  /**
   * @description POP UP SOLICITUD EQUIFAX
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  solicitarAutorizacion() {
    this.loadingSubject.next(false);
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: this.identificacion.value


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      this.loadingSubject.next(true);
      // console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));

      //
      if (respuesta !== null && respuesta !== undefined) {/*  */
        // console.log('al cerrar el dialogo ' + JSON.stringify(respuesta));
        this.llamarEquifax();
      } else {
        // console.log('envio de ELSE ' + respuesta);
        this.sinNoticeService.setNotice('ACCIÓN CANCELADA ', 'error');
        this.loadingSubject.next(false);
        this.limpiarCampos();


      }



    });


  }





  /**
   * @description Método para visualizar el precio de oro se presenta luego de dar click en el botón Ver Precio
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  verPrecio() {


    if (this.identificacion.value !== null && this.nombresCompletos.value !== null && this.fpublicidad.value && this.aprobacionMupi.value && this.fechaNacimiento.value && this.edad.value && this.nacionalidad.value && this.movil.value && this.telefonoDomicilio.value && this.correoElectronico.value && + this.campania.value) {
      this.getTipoOro();
      this.loadingSubject.next(false);
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
   * @description
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  submit() {
    this.loadingSubject.next(true);
    const cedula = this.identificacion.value;
    /**
     * Valores que tomo de la vista
     */
    // console.log('NOMBRE:' + this.nombresCompletos.value);
    // console.log('CEDULA' + cedula);
    // console.log('FECHA DE NACIMINETO' + this.fechaNacimiento.value);
    // console.log('NACIONALIDAD' + this.nacionalidad.value);
    // console.log('MOVIL' + this.movil.value);
    // console.log('PUBLICIDAD' + this.fpublicidad.value);
    // console.log('CORREO ELECTRONICO' + this.correoElectronico.value);
    // console.log('Campania' + this.campania.value);
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
    this.guardarCliente();
    // console.log('DATOS QUE RESPONDE LUEGO DE LA VALIDACION++++++++>> ' + JSON.stringify(this.cliente));
  }
  /** BOTON RIESGO ACUMULADO   */
  /**TODO: AL MOMENTO NO SE ENCUENTRA IMPLEMENTADO EL SERVICIO YA QUE NO ESTA
   *
   */

  /**
   * Metodo que llama al popUp de creditos vigentes a
   * @description
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
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
   * @descriptionMétodo que limpia los campos del formCliente
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  limpiarCampos() {
    Object.keys(this.formCliente.controls).forEach((name) => {
      const control = this.formCliente.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }
  /**
   * MANEJO DE ERRORES
   */
  /**
   * @description Metodo que realiza la administración de errores
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @param {string} pfield
   * @returns {*}
   * @memberof ListCotizarComponent
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
  /**
   * @description Metodo que realiza el calculo de la edad del cliente
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
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


  /*
   */
  /**
   *
   * Metodo limpia los campos del formPrecioOro
   * @description
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  limpiarCamposPrecioOro() {
    Object.keys(this.formPrecioOro.controls).forEach((name) => {
      const control = this.formPrecioOro.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }




  /**
   * Metodo que llama al servicio TIPO ORO
   */
  setPrecioOro() {
    this.precio.setValue('');
    this.loadingSubject.next(true);
    if (this.cliente.cedulaCliente) {
      this.os.findTipoOroByCedulaQuski(this.cliente.cedulaCliente, this.tipoOro.value.quilate, this.cliente.fechaNacimiento).subscribe((dataTipoOro: any) => {
        this.loadingSubject.next(false);
        // console.log('cliente >>>>>>>>>>>', dataTipoOro.entidad);
        if (dataTipoOro.entidad) {
          // console.log('oro entidad >>>>>>>>>>', dataTipoOro.entidad);
          this.precio.setValue(dataTipoOro.entidad.simularResult.xmlGarantias.garantias.garantia.valorOro);
          // validdo que no venga valor null
          if ((dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion != null) && (dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion)) {
            // Cargo la lista de variables para la tabla de opciones de credito
            this.listOpciones = dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion;
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
   * @description Método que realiza la edicion de la tabla precioOro
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @param {*} element
   * @memberof ListCotizarComponent
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
   * @description Metodo que calcula el total de los valores
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
   */
  calcular() {
    this.totalPeso = 0;
    this.totalPrecio = 0;

    if (this.dataSourcePrecioOro.data) {
      this.dataSourcePrecioOro.data.forEach(element => {
        this.totalPeso = Number(this.totalPeso) + Number(element.pesoNetoEstimado);
        this.totalPrecio = Number(this.totalPrecio) + Number(element.precio);
      });
    }
  }

  /**
   * @description Agrega un nuevo precio oro al formulario
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @memberof ListCotizarComponent
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
      this.precioOro.tbQoCotizador = this.cotizacion;
      this.precioOro.tbQoTipoOro = this.tipoOros;
      if (this.precioOro) {
        console.log('==><< precio oro ' + JSON.stringify(this.precioOro));
        this.cs.guardarPrecioOro(this.precioOro).subscribe((data: any) => {
          this.disableSimulaSubject.next(true);
          if (data && data.entidad) {
            console.log("VLORO DEL ID", JSON.stringify(data.entidad.id));
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
   * @description Metodo que elimina un precio oro seleccionado
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @param {*} id
   * @memberof ListCotizarComponent
   */
  eliminarPrecioOro(id) {
    console.log('INGRESA A ELIMINTAR', id);
    this.loadingSubject.next(true);
    this.disableSimulaSubject.next(true);
    // this.preciosOrodSubject.next(true);
    this.cs.eliminarPrecioOro(id).subscribe((data: any) => {
      console.log('eliminarPrecioOro ELMINAR' + JSON.stringify(data));
      this.cs.findByIdCotizacion(this.cotizacion.id).subscribe((pos: any) => {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('SE ELIMINO EL PRECIO DE ORO SELECCIONADO', 'success');
        console.log('findByIdCotizacion' + JSON.stringify(pos.list));
        for (let index = 0; index < pos.list.length; index++) {
          console.log('dentro del for' + JSON.stringify(pos.list));

          if (pos.list[index].estado !== EstadoQuskiEnum.INA) {
            this.precioOro = new TbQoPrecioOro();
            this.precioOro.id = pos.list[index].id;
            this.precioOro.estado = pos.list[index].estado;
            this.precioOro.precio = pos.list[index].precio;
            this.precioOro.pesoNetoEstimado = pos.list[index].pesoNetoEstimado;
            this.preciosArray.push(this.precioOro);
          }


        }
        this.dataSourcePrecioOro = new MatTableDataSource(this.preciosArray);
      }, error => {

        // console.log('NO HAY REGISTROS ');
        this.disableSimulaSubject.next(true);
        this.preciosOrodSubject.next(true);
      });
    }, error => {
      // console.log('NO HAY REGISTROS ');
      this.disableSimulaSubject.next(true);
       this.preciosOrodSubject.next(true);
    });
  }
  /**
   * Metodo que realiza la simulacion
   */
  /**
   * @description Metodo que llama a la simulacion
   * @author Kléber Guerra  - Relative Engine
   * @date 08/07/2020
   * @memberof ListCotizarComponent
   */
  simular() {

    this.loadingSubject.next(true);
    this.totalPrecio;
    // console.log('INICIA SIMULAR TOTAL PRECIO >>>>', this.totalPrecio);
    if (this.listOpciones) {
      this.loadingSubject.next(false);
      this.dataSourceCredito = new MatTableDataSource(this.listOpciones);
      this.stepper.selectedIndex = 3;
    } else {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice('NO SE ENCONTRAR REGISTROS', 'info');
    }
  }

  /**
   * @description Metodo que valida que solo se ingresen solo números
   * @author Kléber Guerra  - Relative Engine
   * @date 08/07/2020
   * @param {*} event
   * @returns {*}  {boolean}
   * @memberof ListCotizarComponent
   */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }



}

