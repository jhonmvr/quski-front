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
import { SolicitudAutorizacionDialogComponent } from '../../../../../../app/views/partials/custom/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { TipoOroService } from '../../../../../core/services/quski/tipoOro.service';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { EstadoQuskiEnum } from '../../../../../core/enum/EstadoQuskiEnum';
import { CreditoVigenteDialogComponent } from '../../../../partials/custom/riesgo-acomulado-dialog/credito-vigente-dialog/credito-vigente-dialog.component';
import { JoyaService } from '../../../../../core/services/quski/joya.service';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
import { TbQoTipoOro } from '../../../../..//core/model/quski/TbQoTipoOro';
import { DatePipe } from '@angular/common';
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
import { PersonaConsulta } from '../../../../../core/model/calculadora/personaConsulta';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { clienteSoftbank } from '../../../../../core/model/softbank/clienteSoftbank';
import { GeneroEnum } from '../../../../../core/enum/GeneroEnum';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { TbQoCotizador } from '../../../../../core/model/quski/TbQoCotizador';
import { VariablesCrediticiasService } from '../../../../../core/services/quski/variablesCrediticias.service';
import { RiesgoAcumuladoService } from '../../../../../core/services/quski/riesgoAcumulado.service';
import { CRMService } from '../../../../../core/services/quski/crm.service';
import { ProspectoCRM } from '../../../../../core/model/crm/prospectoCRM';
import { PersonaCalculadora } from '../../../../../core/model/calculadora/PersonaCalculadora';
import { PrecioOroService } from '../../../../../core/services/quski/precioOro.service';



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
  // ENTIDADES
  private entidadProspectoCRM: ProspectoCRM;
  private entidadClientesoftbank: clienteSoftbank;
  private entidadCliente: TbQoCliente;
  private entidadCotizador: TbQoCotizador;
  private entidadPersonaCalculadora: PersonaCalculadora;
  private entidadesVariablesCrediticias: Array<TbQoVariablesCrediticia>;
  private entidadesRiesgoAcumulados: Array<TbQoRiesgoAcumulado>;

  // CATALOGOS SOFTBANK
  private catEducacion: Array<any>;
  // CATALOGOS QUSKI
  private catTipoOro: Array<TbQoTipoOro>;
  // LISTA PARAMETROS
  private listGradosInteres: Array<any>;
  private listMotivoDesestimiento: Array<any>;
  // TABLA VARIABLES CREDITICIA
  displayedColumnsVarCredi = ['orden', 'variable', 'valor'];
  dataSourceVarCredi: MatTableDataSource<TbQoVariablesCrediticia> = new MatTableDataSource<TbQoVariablesCrediticia>();
  // TABLA RIESGO ACUMULADO
  displayedColumnsRiesgoAcumulado = ['orden', 'variable', 'valor'];
  dataSourceRiesgoAcumulado: MatTableDataSource<TbQoRiesgoAcumulado>;



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
  public cotizacion = new TbQoCotizador();
  public date;
  // LISTAS
  public listCotizaciones = [];
  // ENUMS
  listPublicidad = []; // PARA CUANDO NO SE CARGA DE UN PARAMETRO= Object.keys(PulicidadEnum);
  listEstado = Object.keys(EstadoQuskiEnum);
  listVariables = new Array<TbQoVariablesCrediticia>();
  listOpciones = [];
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
  displayedColumnsPrecioOro = ['accion', 'N', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  displayedColumnsCreditoNegociacion = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoValoracion', 'costoTasacion', 'costoSeguro', 'costoResguardo', 'solca', 'valorCuota'];
  /**Obligatorio paginacion */
  p = new Page();
  // DATASOURCE
  dataSourceI = new MatTableDataSource<any>();
  dataSourcePrecioOro: MatTableDataSource<TbQoPrecioOro> = new MatTableDataSource<TbQoPrecioOro>();
  dataSourceCredito: MatTableDataSource<TbQoCreditoNegociacion> = new MatTableDataSource<TbQoCreditoNegociacion>();
  dataSourceCliente: MatTableDataSource<TbQoCliente> = new MatTableDataSource<TbQoCliente>();
  dataSourceCotizacion: MatTableDataSource<TbQoCotizador> = new MatTableDataSource<TbQoCotizador>();
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
    private sof: SoftbankService,
    private cot: CotizacionService,
    private cli: ClienteService,
    private tip: TipoOroService,
    private ing: IntegracionService,
    private vac: VariablesCrediticiasService,
    private rie: RiesgoAcumuladoService,
    private crm: CRMService,
    private par: ParametroService,
    private pre: PrecioOroService,


    public datepipe: DatePipe,
    private router: Router,
    public titulo: TituloContratoService,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dc: CreditoService,
    private tr: TrackingService,
    public dialog: MatDialog, private fb: FormBuilder) {
    //SERVICIOS
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
    // localStorage.getItem(atob(environment.userKey))
    //this.date = new Date();
    this.subheaderService.setTitle("GESTION DE COTIZACION");
    this.limpiarCampos();
    this.llamarCatalogos();

    // OBSERVABLES
    this.loading = this.loadingSubject.asObservable();
    this.disableGuardar = this.disableGuardarSubject.asObservable();
    this.disableSimular = this.disableSimulaSubject.asObservable();
    this.disableVerPrecio = this.disableVerPrecioSubject.asObservable();
    this.disableVerVariable = this.disableVerVariableSubject.asObservable();
    this.disableMensajeBloqueo = this.disableMensajeBloqueoSubject.asObservable();
    this.preciosOroAsyn = this.preciosOrodSubject.asObservable();
  }
  /**
   * ******************************** @INCIO
  */
  /******************************************** CARGA DE COMBOS  ***********************************************************/
  public consultaCatalogos() {
    this.sof.consultarEducacionCS().subscribe((data: any) => {
      if (!data.existeError) {
        this.catEducacion = data.nivelesEducacion;
        this.loadingSubject.next(false);

      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE SOFTBANK CATALOGO VACIO', 'error');
      }
    });
  }
  /**
   * Metodo que valida el ingreso de solo numeros
   * @param event
   */
  private numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public getTipoOro() {
    this.tip.listAllEntities().subscribe((wrapper: any) => {
      if (wrapper && wrapper.list) {
        this.catTipoOro = new Array<TbQoTipoOro>();
        this.catTipoOro = wrapper.list;
        console.log('TIPOS DE ORO', JSON.stringify(this.catTipoOro));

      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CATALOGO VACIO', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO DESCONOCIDO', 'error');
      }
    });
  }
  /**
 * @description METODO QUE REALIZA LA CARGA LOS MOTIVIOS DE DESESTIMEINTO DE LA BASE 
 * @author Kléber Guerra  - Relative Engine
 * @date 2020-07-14
 */
  public getMotivoDesestimiento() {
    this.par.findByNombreTipoOrdered('', 'DESEST', 'Y').subscribe((wrapper: any) => {
      // //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        this.listMotivoDesestimiento = wrapper.entidades;
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  /**
 * @description METODO QUE CARGA LOS GRADOS DE INTERES DE LA BASE 
 * @author Kléber Guerra  - Relative Engine
 * @date 2020-07-23
 */
  public getGradoInteres() {
    this.par.findByNombreTipoOrdered('', 'GINT', 'Y').subscribe((wrapper: any) => {
      if (wrapper && wrapper.entidades) {
        this.listGradosInteres = wrapper.entidades;
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  /**
   * @description METODO QUE CARGA EL COMBO DE PUBLICIDAD CON LOS TIPOS DE PUBLICIDAD
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   */
  public getPublicidades() {
    this.par.findByNombreTipoOrdered('', 'PUB', 'Y').subscribe((wrapper: any) => {
      if (wrapper && wrapper.entidades) {
        for (let i = 0; i < wrapper.entidades.length; i++) {
          this.listPublicidad.push(wrapper.entidades[i].valor.toUpperCase());
        }
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  public llamarCatalogos() {
    this.loadingSubject.next(true);

    this.getGradoInteres();
    this.getTipoOro();
    this.getMotivoDesestimiento();
    this.consultaCatalogos();
    this.getPublicidades();

  }
  /**
   * BOTON RIESGO ACUMULADO
   * TODO: AL MOMENTO NO SE ENCUENTRA IMPLEMENTADO EL SERVICIO YA QUE NO ESTA
   * Metodo que llama al popUp de creditos vigentes a
   */
  public goRiesgoAcumulado() {
    console.log('VALOR DE LA CEDULA A CONSULTAR RIESGO ACUMULADO', this.entidadesRiesgoAcumulados);
    const dialogRef = this.dialog.open(CreditoVigenteDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: this.entidadesRiesgoAcumulados
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }
  /**
   * Limpio los campos de la vista Cliente
   */
  private limpiarCampos() {
    Object.keys(this.formCliente.controls).forEach((name) => {
      // console.log( "==limpiando " + name )
      const control = this.formCliente.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }
  /**
   * MANEJO DE ERRORES
   */
  public getErrorMessage(pfield: string) {
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
      console.log('telefonoDocimicilio', this.formCliente.get('telefonoDomicilio'));
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
 * CALCULO DE LA EDAD 
 */
  private onChangeFechaNacimiento() {
    this.loadingSubject.next(true);
    console.log('VALOR DE LA FECHA' + this.fechaNacimiento.value);
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    console.log('FECHA SELECCIONADA' + fechaSeleccionada);
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
  /**
   * CALCULO DIFERENCIA DE FECHAS PARA EL CALCULO DE LA EDAD 
   */
  private getDiffFechas(fecha: Date, format: string) {
    this.loadingSubject.next(true);
    const convertFechas = new RelativeDateAdapter();
    this.par
      .getDiffBetweenDateInicioActual(
        convertFechas.format(fecha, 'input'),
        format
      )
      .subscribe(
        (rDiff: any) => {
          const diff: YearMonthDay = rDiff.entidad;
          this.edad.setValue(diff.year);
          console.log('La edad es ' + this.edad.value);

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
            console.log(error);
          }
          this.loadingSubject.next(false);
        }
      );
  }
  /**
   * Metodo limpia los campos del formPrecioOro
   */
  private limpiarCamposPrecioOro() {
    Object.keys(this.formPrecioOro.controls).forEach((name) => {
      const control = this.formPrecioOro.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }


  public buscarCliente() {
    if (this.identificacion.value != "") { // Jero: revisar validacion
      this.loadingSubject.next(true);
      let consulta = new ConsultaCliente();
      consulta.identificacion = this.identificacion.value;

      this.sof.consultarClienteCS(consulta).subscribe((data: any) => {
        if (data.idCliente != 0) {
          this.entidadClientesoftbank = new clienteSoftbank();
          this.entidadClientesoftbank = data;

          this.inicioDeGestion(this.entidadClientesoftbank.identificacion);
        } else {
          this.solicitarAutorizacion(consulta.identificacion);
        }
      });
    } else {
      this.sinNoticeService.setNotice('PRO FAVOR INGRESE UNA CEDULA VALIDA', 'error');
    }
  }
  private busquedaEnCRM(identificacion: string) {
    this.crm.findClienteByCedulaCRM(identificacion).subscribe((data: any) => {
      this.loadingSubject.next(true);
      let cliente = new TbQoCliente();
      if (data && data.list) {
        this.entidadProspectoCRM = data.list[0];
        cliente.telefonoFijo = this.entidadProspectoCRM.phoneHome;
        cliente.telefonoMovil = this.entidadProspectoCRM.phoneMobile;
        cliente.telefonoAdicional = this.entidadProspectoCRM.phoneOther;
        cliente.cedulaCliente = this.entidadProspectoCRM.cedulaC;
        cliente.email = this.entidadProspectoCRM.emailAddress;
      } else {
        cliente.cedulaCliente = identificacion;
      }
      this.guardarClienteCore(cliente);
    });
  }
  private setearValores() {
    this.loadingSubject.next(true);
    if (this.entidadClientesoftbank == null) {
      if (this.entidadProspectoCRM) {
        this.nombresCompletos.setValue(this.entidadProspectoCRM.firstName);
      }
      if (this.entidadPersonaCalculadora) {
        this.campania.setValue(this.entidadCliente.campania);
        this.nombresCompletos.setValue(this.entidadPersonaCalculadora.nombrescompletos);
      }
    } else {
      this.nombresCompletos.setValue(this.entidadCliente.primerNombre + ' ' + this.entidadCliente.segundoNombre + ' ' + this.entidadCliente.apellidoPaterno + ' ' + this.entidadCliente.apellidoMaterno);
    }
    if (this.entidadCliente.nacionalidad) {
      this.nacionalidad.setValue(this.entidadCliente.nacionalidad);
    }
    this.movil.setValue(this.entidadCliente.telefonoMovil);
    this.telefonoDomicilio.setValue(this.entidadCliente.telefonoFijo);
    this.correoElectronico.setValue(this.entidadCliente.email);
    console.log('VARIABLES', JSON.stringify(this.entidadesVariablesCrediticias));



    //TODO: COMENTO NO FUNCIONA EL SERVICE
    //this.dataSourceRiesgoAcumulado.data = this.entidadesRiesgoAcumulados;
    this.loadingSubject.next(false);

  }
  private inicioDeGestion(localIdentificacion: string) {
    this.cli.findClienteByIdentificacion(localIdentificacion).subscribe((data: any) => {
      if (data) {
        let cliente = new TbQoCliente();
        if (this.entidadClientesoftbank.esMasculino) {
          cliente.genero = GeneroEnum.MASCULINO;
        } else {
          cliente.genero = GeneroEnum.FEMENINO;
        }
        this.catEducacion.forEach(element => {
          if (this.entidadClientesoftbank.codigoEducacion == element.codigo) {
            cliente.nivelEducacion = element.nombre;
          }
        });
        // cliente.nacionalidad = this.entidadClientesoftbank.idPaisNacimiento 
        if (data.entidad && data.entidad.id != null) {
          cliente.id = data.entidad.id;
        }
        cliente.apellidoMaterno = this.entidadClientesoftbank.segundoApellido;
        cliente.apellidoPaterno = this.entidadClientesoftbank.primerApellido;
        cliente.cargasFamiliares = this.entidadClientesoftbank.numeroCargasFamiliares;
        cliente.cedulaCliente = this.entidadClientesoftbank.identificacion;
        cliente.email = this.entidadClientesoftbank.email;
        cliente.fechaNacimiento = this.entidadClientesoftbank.fechaNacimiento;
        cliente.primerNombre = this.entidadClientesoftbank.primerNombre;
        cliente.segundoNombre = this.entidadClientesoftbank.segundoNombre;
        console.log('2.- VALOR DEL CLIENTE CRM findClienteByCedulaCRM ==> ', JSON.stringify(cliente));
        this.guardarClienteCore(cliente);
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO', 'error');
      }
    });
  }
  private guardarClienteCore(cliente: TbQoCliente) {
    console.log('3.- inicia  GuardarClienteCore ==> ', JSON.stringify(cliente));
    this.cli.persistEntity(cliente).subscribe((data: any) => {
      if (data.entidad) {
        this.entidadCliente = data.entidad;
        let personaConsulta = new PersonaConsulta();
        personaConsulta.identificacion = this.entidadCliente.cedulaCliente;
        this.llamarEquifax(personaConsulta);
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  private llamarEquifax(personaConsulta: PersonaConsulta) {
    let consulta = new ConsultaCliente();
    consulta.identificacion = personaConsulta.identificacion;
    this.ing.getInformacionPersonaCalculadora(personaConsulta).subscribe((data: any) => {
      this.loadingSubject.next(true);
      if (this.entidadProspectoCRM != null) {
        if (data.entidad.datoscliente) {
          this.entidadPersonaCalculadora = data.entidad.datoscliente;
          this.entidadCliente.fechaNacimiento = this.entidadPersonaCalculadora.fechanacimiento;
          this.entidadCliente.nacionalidad = this.entidadPersonaCalculadora.nacionalidad;
          this.entidadCliente.genero = this.entidadPersonaCalculadora.genero;
          this.entidadCliente.campania = this.entidadPersonaCalculadora.codigocampania.toString();

          if (this.entidadCliente.email == null) {
            this.entidadCliente.email = this.entidadPersonaCalculadora.correoelectronico;
          }
          if (this.entidadCliente.telefonoFijo == null) {
            this.entidadCliente.telefonoFijo = this.entidadPersonaCalculadora.telefonofijo;
          }
          if (this.entidadCliente.telefonoMovil == null) {
            this.entidadCliente.telefonoMovil = this.entidadPersonaCalculadora.telefonomovil;
          }
          this.actualizarCliente(this.entidadCliente);
        }
      } else if (this.entidadProspectoCRM == null && this.entidadClientesoftbank == null) {
        this.entidadPersonaCalculadora = data.entidad.datoscliente;
        this.entidadCliente.fechaNacimiento = this.entidadPersonaCalculadora.fechanacimiento;
        this.entidadCliente.nacionalidad = this.entidadPersonaCalculadora.nacionalidad;
        this.entidadCliente.genero = this.entidadPersonaCalculadora.genero;
        this.entidadCliente.email = this.entidadPersonaCalculadora.correoelectronico;
        this.entidadCliente.telefonoMovil = this.entidadPersonaCalculadora.telefonomovil;
        this.entidadCliente.telefonoFijo = this.entidadPersonaCalculadora.telefonofijo;
        this.entidadCliente.campania = this.entidadPersonaCalculadora.codigocampania.toString();
        this.actualizarCliente(this.entidadCliente);
      }


      if (data.entidad.xmlVariablesInternas.variablesInternas.variable != null) {

        this.entidadesVariablesCrediticias = data.entidad.xmlVariablesInternas.variablesInternas.variable;
        console.log('VALOR CONSULTA RIESGO ACUMULADO', JSON.stringify(consulta));
        this.sof.consultaRiesgoAcumuladoCS(consulta).subscribe((data: any) => {
          console.log('valores DATA', JSON.stringify(data));
          if (data.existeError === false) {
            this.entidadesRiesgoAcumulados = data.operaciones;
            this.entidadCotizador = new TbQoCotizador();
            this.entidadCotizador.tbQoCliente.id = this.entidadCliente.id;
            this.cot.persistEntity(this.entidadCotizador).subscribe((data: any) => {
              if (data.entidad) {
                this.entidadCotizador = data.entidad;
                this.entidadesVariablesCrediticias.forEach(element => {
                  element.tbQoCotizador = new TbQoCotizador();
                  element.tbQoCotizador.id = this.entidadCotizador.id;
                });

                this.vac.persistEntity(this.entidadesVariablesCrediticias).subscribe((data: any) => {
                  if (data.entidades) {
                    this.entidadesVariablesCrediticias = data.entidades;
                    if (this.entidadesVariablesCrediticias != null) {
                      console.log('DATA entidadesVariablesCrediticias', JSON.stringify(this.entidadesVariablesCrediticias));
                      this.dataSourceVarCredi.data = this.entidadesVariablesCrediticias;
                      console.log(' dataSourceVarCredi', JSON.stringify(this.dataSourceVarCredi.data));
                    }
                    console.log('VARIABLES', JSON.stringify(this.entidadesVariablesCrediticias));

                    /*  this.entidadesRiesgoAcumulados.forEach(element => {
                        element.tbQoCliente.id = this.entidadCliente.id;
                      });
                      this.rie.persistEntity(this.entidadesRiesgoAcumulados).subscribe((data: any) => {
                        if (data.entidades) {
                          this.entidadesRiesgoAcumulados = data.entidades;
                          this.setearValores();
                        } else {
                          this.sinNoticeService.setNotice('ERROR EN LA CREACION DE RIESGOS ACUMULADOS', 'error');
                        }
                      }, error => {
                        if (JSON.stringify(error).indexOf("codError") > 0) {
                          let b = error.error;
                          this.sinNoticeService.setNotice(b.msgError, 'error');
                        } else {
                          this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
                        }
                      });*/
                    this.setearValores();
                  }

                  else {
                    this.sinNoticeService.setNotice('ERROR EN LA CREACION DE VARIABLES CREDITICIAS', 'error');
                  }
                }, error => {
                  if (JSON.stringify(error).indexOf("codError") > 0) {
                    let b = error.error;
                    this.sinNoticeService.setNotice(b.msgError, 'error');
                  } else {
                    this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
                  }
                });
              } else {
                this.sinNoticeService.setNotice('ERROR EN LA CREACION DE COTIZADOR', 'error');
              }
            }, error => {
              if (JSON.stringify(error).indexOf("codError") > 0) {
                let b = error.error;
                this.sinNoticeService.setNotice(b.msgError, 'error');
              } else {
                this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
              }
            });

          } else {
            this.sinNoticeService.setNotice('ERROR EN CORE SOFTBANK', 'error');
          }
        });
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE CALCULADORA QUSKI', 'error');
      }

    });
  }
  private actualizarCliente(cliente: TbQoCliente) {
    this.cli.persistEntity(cliente).subscribe((data: any) => {
      if (data.entidad) {
        this.entidadCliente = data.entidad;
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, NO SE ACTUALIZO CLIENTE', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  private solicitarAutorizacion(identificacion: string) {
    //Jero: Pendiente de revisar
    this.loadingSubject.next(false);
    console.log('>>>INGRESA AL DIALOGO ><<<<<<');
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: identificacion
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      //
      if (respuesta !== null && respuesta !== undefined) {
        console.log('al cerrar el dialogo ' + JSON.stringify(respuesta));
        this.busquedaEnCRM(identificacion);
      } else {
        console.log('envio de ELSE ' + respuesta);
        this.sinNoticeService.setNotice('ACCIÓN CANCELADA ', 'error');
        this.limpiarCampos();
      }
    });
  }
  /**
   * @description POP UP Mensaje de bloqueo
   */
  private verMensajes() {
    console.log('VALORES DE MENSAJE QUE ENVIO---> ', this.mensaje);
    this.loadingSubject.next(false);

    console.log('>>>INGRESA AL DIALOGO ><<<<<<');
    const dialogRefGuardar = this.dialog.open(MensajeExcepcionComponent, {
      width: '600px',
      height: 'auto',
      data: this.mensaje
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
    });
  }



  /**
   * ********************************* @FIN
   */

  /* const mensa = JSON.stringify(resp.entidad.mensaje).toUpperCase();

    if (resp.entidad.mensaje && resp.entidad.mensaje !== ' ') {
      console.log('MENSAJE A EQUIFAX', JSON.stringify(resp.entidad.mensaje));
      this.mensaje = JSON.stringify(resp.entidad.mensaje).toUpperCase();
      this.verMensajes();
      console.log('INGRESA A VER EL MSG', JSON.stringify(resp));
    } */

  /**
   * Metodo que trae los motivos de desestimiento de la base de datos tabla parametros
   */





  /***********************************************METODOS PARA TOMAR LOS VALORES DE LOS COMBOS*********************    */

  /**
   * @description METODO QUE TOMA EL VALOR DEL COMBO PUBLICIDAD
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @param {*} event
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
  /**
   * @description METODO QUE REALIZA LA VALIDACION DEL VALOR SELECCIONADO EN APROBACION MUPI
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-14
   * @memberof ListCotizarComponent
   */
  // Jero: Revisar
  validarMupi() {
    if (this.aprobacionMupi.value === 'SI') {
      this.isCheckSi = true;
      this.isCheckNo = false;
    } else if (this.aprobacionMupi.value === 'NO') {
      this.isCheckSi = false;
      this.isCheckNo = true;
    }
  }
  verPrecio() {
    this.loadingSubject.next(true);

    if (this.identificacion.value !== null && this.nombresCompletos.value !== null && this.fpublicidad.value && this.aprobacionMupi.value && this.fechaNacimiento.value && this.edad.value && this.nacionalidad.value && this.movil.value && this.telefonoDomicilio.value && this.correoElectronico.value && + this.campania.value) {

      this.getTipoOro();
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
        console.log('INICIA EL REGISTRO DE TRACKING EN TASACION', JSON.stringify(hora));
        if (hora.entidad) {
          console.log('INICIA TRACKING COTIZACION TASACION Hora del core ----> ' + JSON.stringify(hora.entidad));
          this.horaInicio = hora.entidad;
          this.horaAsignacion = hora.entidad;
          this.horaAtencion = hora.entidad;
          //this.sinNoticeService.setNotice('INCIA TRACKING TASACION', 'error');

        }
      });
      this.sinNoticeService.setNotice('INFORMACION COMPLETA', 'success');
      this.disableVerVariableSubject.next(true);
      this.stepper.selectedIndex = 2;
      console.log('VALOR DE LA COTIZACION===>', JSON.stringify(this.cotizacion));
    } else {
      this.sinNoticeService.setNotice('POR FAVOR COMPLETE LA INFORMACION', 'warning');
      this.loadingSubject.next(false);
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
    console.log('VARIABLES CREDITICIAS', JSON.stringify(this.entidadesVariablesCrediticias));
    console.log('PRECIO ORO', JSON.stringify(this.preciosArray));
    /**
     * Seteo los valores de la vista DATOS CLIENTE en el objeto cliente
     */
    this.entidadCliente.cedulaCliente = this.identificacion.value;
    this.entidadCliente.primerNombre = this.nombresCompletos.value;
    this.entidadCliente.fechaNacimiento = this.fechaNacimiento.value;
    this.entidadCliente.edad = this.edad.value;
    this.entidadCliente.nacionalidad = this.nacionalidad.value;
    this.entidadCliente.publicidad = this.fpublicidad.value ? this.fpublicidad.value.valor : '';
    this.entidadCliente.email = this.correoElectronico.value;
    this.entidadCliente.campania = this.campania.value;
    this.entidadCliente.telefonoFijo = this.telefonoDomicilio.value;
    this.entidadCliente.telefonoMovil = this.movil.value;
    /**
     * INICIA EL GUARDADO DEL CLIENTE EN LA BASE
     */
    // if (this.cliente.cedulaCliente) {
    console.log('INICIA EL SUBMIT*****');
    // this.guardarCliente();
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

      this.precioOro.tbQoCotizador.id = this.entidadCotizador.id;
      this.precioOro.tbQoTipoOro = this.tipoOros;
      if (this.precioOro) {
        this.pre.persistEntity(this.precioOro).subscribe((data: any) => {
          console.log('==><< respuesta para precio oro ' + JSON.stringify(data));
          this.disableSimulaSubject.next(false);
          if (data && data.entidad) {
            console.log('VALOR DEL ID ANTES DE CARGAR EL PRECIO ORO', JSON.stringify(data.entidad.id));
            this.pre.loadPrecioOroByCotizacion(this.cotizacion.id).subscribe((pos: any) => {
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
    this.loadingSubject.next(true);
    if (this.entidadCliente.cedulaCliente) {
      this.ing.getInformacionOferta(this.entidadCliente.cedulaCliente, this.tipoOro.value.quilate, this.entidadCliente.fechaNacimiento, "N", 0).subscribe((dataTipoOro: any) => {
        console.log('tipo de oro que responde>>>>>>>' + JSON.stringify(dataTipoOro));
        console.log('SACO EL VALOR DEL TIPO ORO');
        console.log('tipoOro >>>>>>>>>>>>>>', this.tipoOro.value);
        this.loadingSubject.next(false);
        console.log('cliente >>>>>>>>>>>', dataTipoOro.entidad);
        if (dataTipoOro.entidad) {
          console.log('oro entidad >>>>>>>>>>', dataTipoOro.entidad);
          this.precio.setValue(dataTipoOro.entidad.simularResult.xmlGarantias.garantias.garantia.valorOro);
          // validdo que no venga valor null
          if ((dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion != null) && (dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion)) {
            // Cargo la lista de variables para la tabla de opciones de credito
            this.listOpciones = dataTipoOro.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion;
            console.log('VALORES DE MI LISTA DE OPCIONES RENOVACION' + JSON.stringify(this.listOpciones));
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
    this.pre.seleccionarPrecioOro(element.id).subscribe((data: any) => {
      // RECUPERO LA DATA EN LA PANTALLA
      this.precioOroLocal = data.entidad;
      const toSelectOro = this.catTipoOro.find(p => p.id === data.entidad.tbQoTipoOro.id);
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
      console.log('<<<<<<<<<<Data source >>>>>>>>>> ' + JSON.stringify(this.dataSourceI.data));
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
      this.precioOro.tbQoCotizador.id = this.entidadCotizador.id;
      this.precioOro.tbQoTipoOro = this.tipoOros;
      console.log('VALOR DE PRECIO ORO ' + JSON.stringify(this.precioOro));
      if (this.precioOro) {
        this.pre.persistEntity(this.precioOro).subscribe((data: any) => {
          console.log('VALOR  GUARDAR PRECIO ORO' + JSON.stringify(data));
          console.log('DATASOURCE.ENTIDAD' + JSON.stringify(data.entidad));

          this.disableSimulaSubject.next(true);
          this.preciosArray.push(data.entidad);
          console.log('VALORES LISTA ' + JSON.stringify(this.preciosArray));


          if (data && data.entidad) {
            this.dataSourceI = new MatTableDataSource(this.preciosArray);

          }

          console.log('la data guardada es' + JSON.stringify(data));

          if (data && data.entidad) {
            console.log('VALOR DE DATA EN EL IF' + JSON.stringify(data));
            this.sinNoticeService.setNotice('SE GUARDO EL PRECIO ORO', 'success');
            console.log('VALOR DEL ID DE  LA COTIZACION QUE VA>>>>>>> ' + this.cotizacion.id);
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
    this.pre.eliminarPrecioOro(id).subscribe((data: any) => {
      this.sinNoticeService.setNotice('SE ELIMINO EL PRECIO DE ORO SELECCIONADO', 'success');
      this.cot.findByIdCotizacion(this.cotizacion.id).subscribe((pos: any) => {
        this.dataSourceI = new MatTableDataSource(pos.list);
      }, error => {

        console.log('NO HAY REGISTROS ');
        this.disableSimulaSubject.next(false);
      });
    }, error => {
      console.log('NO HAY REGISTROS ');
      this.disableSimulaSubject.next(false);
    });
  }
  /**
   * Metodo que realiza la simulacion
   */
  simular() {
    this.loadingSubject.next(true);
    this.totalPrecio;
    console.log('INICIA SIMULAR TOTAL PRECIO >>>>', this.totalPrecio);
    if (this.listOpciones) {
      this.dataSourceCredito = new MatTableDataSource(this.listOpciones);
      this.stepper.selectedIndex = 3;
    } else {
      this.sinNoticeService.setNotice('NO SE ENCONTRAR REGISTROS', 'info');
    }
  }





  public registroProspeccion(
    codigoRegistro: string,
    fechaInicio: Date,
    fechaAsignacion: Date,
    fechaInicioAtencion: Date,
    fechaFin: Date) {
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
    fechaFin: Date) {
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
