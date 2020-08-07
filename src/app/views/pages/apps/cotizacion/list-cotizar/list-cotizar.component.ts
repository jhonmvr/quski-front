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
import { CreditoVigenteDialogComponent } from '../../../../partials/custom/popups/riesgo-acomulado-dialog/credito-vigente-dialog/credito-vigente-dialog.component';
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
import { MensajeExcepcionComponent } from '../../../../partials/custom/popups/mensaje-excepcion-component/mensaje-excepcion-component';
import { PersonaConsulta } from '../../../../../core/model/calculadora/personaConsulta';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { ClienteSoftbank } from '../../../../../core/model/softbank/ClienteSoftbank';
import { GeneroEnum } from '../../../../../core/enum/GeneroEnum';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { TbQoCotizador } from '../../../../../core/model/quski/TbQoCotizador';
import { VariablesCrediticiasService } from '../../../../../core/services/quski/variablesCrediticias.service';
import { RiesgoAcumuladoService } from '../../../../../core/services/quski/riesgoAcumulado.service';
import { CRMService } from '../../../../../core/services/quski/crm.service';
import { ProspectoCRM } from '../../../../../core/model/crm/prospectoCRM';
import { PersonaCalculadora } from '../../../../../core/model/calculadora/PersonaCalculadora';
import { PrecioOroService } from '../../../../../core/services/quski/precioOro.service';
import { VerCotizacionesComponent } from '../../../../partials/custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { ConsultaOferta } from '../../../../../core/model/calculadora/consultaOferta';

@Component({
  selector: 'kt-list-cotizar',
  templateUrl: './list-cotizar.component.html',
  styleUrls: ['./list-cotizar.component.scss']
})

export class ListCotizarComponent implements OnInit {
  // ENTIDADES
  private entidadProspectoCRM: ProspectoCRM;
  private entidadClientesoftbank: ClienteSoftbank;
  private entidadCliente: TbQoCliente;
  private entidadCotizador: TbQoCotizador;
  private entidadPersonaCalculadora: PersonaCalculadora;
  // CATALOGOS SOFTBANK
  private catEducacion: Array<any>;
  // CATALOGOS QUSKI
  public catTipoOro: Array<TbQoTipoOro>;
  // LISTA PARAMETROS //todo: Cambiar a softbank cuando se tengan  los servicios
  listPublicidad = []; // PARA CUANDO NO SE CARGA DE UN PARAMETRO= Object.keys(PulicidadEnum);
  private listGradosInteres: Array<any>;
  private listMotivoDesestimiento: Array<any>;
  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public isCheckSi = false;
  public isCheckNo = false;
  private contadorBusqueda: number;
  private fechaSeleccionada: any;
  public date;
  public dataPopup: DataPopup;
  // STREPPER
  @ViewChild('stepper', { static: true })
  public stepper: MatStepper;
  isLinear = false;
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

  // FORM CLIENTE
  public formCliente: FormGroup = new FormGroup({});
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
  public formOpciones: FormGroup = new FormGroup({});
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
  public preciosArray = new Array<TbQoPrecioOro>();
  public precioOroLocal = null;
  public element;
  public opciones: string[] = ['Si', 'No'];
  public seleccion: string;
  // VARIABLES DE TRACKING
  public horaInicio: any;
  public horaAsignacion: any;
  public horaAtencion: any;
  public horaFinal: any;
  public idCotizacion: string;
  // TABLA PRECIO ORO
  displayedColumnsPrecioOro = ['accion', 'N', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  dataSourcePrecioOro: MatTableDataSource<TbQoPrecioOro> = new MatTableDataSource<TbQoPrecioOro>();

  constructor(
    private sof: SoftbankService,
    private cot: CotizacionService,
    private cli: ClienteService,
    private tip: TipoOroService,
    private ing: IntegracionService,
    private crm: CRMService,
    private par: ParametroService,
    private rie: RiesgoAcumuladoService,
    private pre: PrecioOroService,
    private tra: TrackingService,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog
  ) {

    // FORM CLIENTE
    this.formCliente.addControl('cedula', this.identificacion);
    this.formCliente.addControl('fechaNacimiento', this.fechaNacimiento);
    this.formCliente.addControl('nombresCompletos', this.nombresCompletos);
    this.formCliente.addControl('edad', this.edad);
    this.formCliente.addControl('nacionalidad', this.nacionalidad);
    this.formCliente.addControl('movil', this.movil);
    this.formCliente.addControl('telefonoDomicilio', this.telefonoDomicilio);
    this.formCliente.addControl('correoElectronico', this.correoElectronico);
    this.formCliente.addControl('campania', this.campania);
    this.formCliente.addControl('fpublicidad', this.fpublicidad);
    this.formCliente.addControl('aprobacionMupi  ', this.aprobacionMupi);
    // OPCIONES DE CREDITO
    this.formOpciones.addControl('fgradoInteres', this.fgradoInteres);
    this.formOpciones.addControl('fmotivoDesestimiento', this.fmotivoDesestimiento);
    // FORM PRECIO ORO
    this.formPrecioOro.addControl('tipoOro  ', this.tipoOro);
    this.formPrecioOro.addControl('pesoNetoEstimado  ', this.pesoNetoEstimado);
    this.formPrecioOro.addControl('precio  ', this.precio);
  }

  ngOnInit() {
    this.subheaderService.setTitle("GESTION DE COTIZACION");
    this.limpiarCampos();
    this.llamarCatalogos();
    this.contadorBusqueda = null;

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

  /**
   * BOTON RIESGO ACUMULADO
   * TODO: AL MOMENTO NO SE ENCUENTRA IMPLEMENTADO EL SERVICIO YA QUE NO ESTA
   * Metodo que llama al popUp de creditos vigentes a
   */
  /* public goRiesgoAcumulado() {
    const dialogRef = this.dialog.open(RiesgoAcumuladoDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: this.entidadCliente.cedulaCliente
    });
    dialogRef.afterClosed().subscribe((respuesta: Array<TbQoRiesgoAcumulado>) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      this.rie.persistEntity(respuesta).subscribe((data: any) => {
        console.log('data al cerrrar', JSON.stringify(data));
      });
    });
  } */
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
    if (pfield && pfield === 'identificacion') {
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
  public busquedaSoftbank(cedula: string) {
    this.loadingSubject.next(true);
    let consulta = new ConsultaCliente();
    consulta.identificacion = cedula;
    this.sof.consultarClienteCS(consulta).subscribe((data: any) => {
      if (!data.existeError && data.identificacion != null) {
        this.entidadClientesoftbank = new ClienteSoftbank();
        this.entidadClientesoftbank = data;
      } else {
        this.entidadClientesoftbank = null;
      }
      this.contadorBusqueda++;
      this.loadingSubject.next(false);
      this.busquedaCliente();
    });
  }
  public busquedaCliente() {
    if (this.identificacion.value != '') {
      if (this.contadorBusqueda !== null) {
        this.busquedaSoftbank(this.identificacion.value);
      } else {
        if (this.contadorBusqueda > 1) {
          if (this.entidadPersonaCalculadora != null) {
            this.guardarClienteCore(this.entidadProspectoCRM, this.entidadPersonaCalculadora, null);
            this.sinNoticeService.setNotice('BUSQUEDA EXITOSA, VALORES CARGADOS', 'success');
          } else {
            this.sinNoticeService.setNotice('ERROR EN BUSQUEDA DE CLIENTE', 'error');
          }
        } else {
          this.solicitarAutorizacion(this.identificacion.value);
        }
      }
    } else {
      this.sinNoticeService.setNotice('INGRESE UN NUMERO DE CEDULA', 'error');
    }
  }
  private busquedaEnCRM(cedula: string) {
    this.loadingSubject.next(true);
    this.crm.findClienteByCedulaCRM(cedula).subscribe((data: any) => {
      this.contadorBusqueda++;
      if (data && data.list) {
        this.entidadProspectoCRM = data.list[0];
      }
      this.loadingSubject.next(false);
      this.busquedaEquifax(cedula);
    });
  }
  private busquedaEquifax(cedula: string) {
    this.loadingSubject.next(true);
    this.cli.findClienteByIdentificacion(cedula).subscribe((data: any) => {
      console.log('VALOR DE DATA EN  findClienteByIdentificacion', JSON.stringify(data));
      if (data.entidad != null) {
        this.entidadPersonaCalculadora = data.entidad;
      } else {
        this.entidadPersonaCalculadora = null;
      }
      this.loadingSubject.next(false);
      this.busquedaCliente();
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
    this.loadingSubject.next(false);
    //INPUT VARIABLES CREDITICIAS
    this.dataPopup = new DataPopup();
    this.dataPopup.cedula = this.entidadCliente.cedulaCliente;
    this.dataPopup.isCalculadora = true;
  }

  private guardarClienteCore(crm: ProspectoCRM, equifax: PersonaCalculadora, softbank: ClienteSoftbank) {
    this.loadingSubject.next(true);
    let cliente = new TbQoCliente();
    if (softbank != null) {
      // setear soft
      if (softbank.esMasculino) {
        cliente.genero = GeneroEnum.MASCULINO;
      } else {
        cliente.genero = GeneroEnum.FEMENINO;
      }
      this.catEducacion.forEach(element => {
        if (softbank.codigoEducacion === element.codigo) {
          cliente.nivelEducacion = element.nombre;
        }
      });
      // cliente.nacionalidad = softbank.idPaisNacimiento;
      cliente.apellidoMaterno = softbank.segundoApellido;
      cliente.apellidoPaterno = softbank.primerApellido;
      cliente.cargasFamiliares = softbank.numeroCargasFamiliares;
      cliente.cedulaCliente = softbank.identificacion;
      cliente.email = softbank.email;
      cliente.fechaNacimiento = softbank.fechaNacimiento;
      cliente.primerNombre = softbank.primerNombre;
      cliente.segundoNombre = softbank.segundoNombre;
    } else {
      if (crm != null) {
        // setea crm y equifax
        cliente.telefonoAdicional = crm.phoneOther;
        cliente.cedulaCliente = crm.cedulaC;
        cliente.fechaNacimiento = equifax.fechanacimiento;
        cliente.nacionalidad = equifax.nacionalidad;
        cliente.genero = equifax.genero;
        cliente.campania = equifax.codigocampania.toString();
        if (crm.emailAddress != null) {
          cliente.email = crm.emailAddress;
        }
        if (equifax.correoelectronico != null) {
          cliente.email = equifax.correoelectronico;
        }
        if (crm.phoneHome != null) {
          cliente.telefonoFijo = crm.phoneHome;
        }
        if (equifax.telefonofijo != null) {
          cliente.telefonoFijo = equifax.telefonofijo;
        }
        if (crm.phoneMobile != null) {
          cliente.telefonoMovil = crm.phoneMobile;
        }
        if (equifax.telefonomovil != null) {
          cliente.telefonoMovil = equifax.telefonomovil;
        }
      } else {
        // setear equifax
        cliente.fechaNacimiento = equifax.fechanacimiento;
        cliente.nacionalidad = equifax.nacionalidad;
        cliente.genero = equifax.genero;
        cliente.email = equifax.correoelectronico;
        cliente.telefonoMovil = equifax.telefonomovil;
        cliente.telefonoFijo = equifax.telefonofijo;
        cliente.campania = equifax.codigocampania.toString();
      }
    }
    this.cli.persistEntity(cliente).subscribe((data: any) => {
      if (data.entidad != null) {
        this.entidadCliente = new TbQoCliente();
        this.entidadCliente = data.entidad;
        this.loadingSubject.next(false);
        this.guardarCotizacion(null, this.entidadCliente.id);
        this.setearValores();
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf('codError') > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
      this.loadingSubject.next(false);
    });
  }
  public guardarCotizacion(cotizador: TbQoCotizador, idCliente: number) {
    this.loadingSubject.next(true);
    if (cotizador == null) {
      cotizador = new TbQoCotizador();
    }
    cotizador.tbQoCliente.id = idCliente;
    this.cot.persistEntity(cotizador).subscribe((data: any) => {
      if (data.entidad != null) {
        this.entidadCotizador = data.entidad;
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO COTIZADOR, NO SE CREO', 'error');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO COTIZADOR, ERROR DESCONOCIDO', 'error');
      }
    });
  }

  private solicitarAutorizacion(cedula: string) {
    this.loadingSubject.next(false);
    console.log('>>>INGRESA AL DIALOGO ><<<<<<');
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: cedula
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      //
      if (respuesta !== null && respuesta !== undefined) {
        console.log('al cerrar el dialogo ' + JSON.stringify(respuesta));
        this.busquedaEnCRM(cedula);
      } else {
        console.log('envio de ELSE ' + respuesta);
        this.sinNoticeService.setNotice('ACCIÓN CANCELADA ', 'error');
        this.limpiarCampos();
      }
      if (this.mensaje != null) {
        this.verMensajes(this.mensaje);
      }
    });
  }
  /**
   * @description POP UP Mensaje de bloqueo
   */
  private verMensajes(mensaje: string) {
    console.log('VALORES DE MENSAJE QUE ENVIO---> ', this.mensaje);
    this.loadingSubject.next(false);

    console.log('>>>INGRESA AL DIALOGO ><<<<<<');
    const dialogRefGuardar = this.dialog.open(MensajeExcepcionComponent, {
      width: '600px',
      height: 'auto',
      data: mensaje
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
    });
  }

  public abrirPopupVerCotizacion(identificacion: string) {
    const dialogRefGuardar = this.dialog.open(VerCotizacionesComponent, {
      width: '900px',
      height: 'auto',
      data: identificacion
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
    });
  }



  /**
   * ********************************* @FIN
   */

  /***********************************************METODOS PARA TOMAR LOS VALORES DE LOS COMBOS*********************    */

  /*   *
     * @description METODO QUE TOMA EL VALOR DEL COMBO PUBLICIDAD
     * @author Kléber Guerra  - Relative Engine
     * @date 2020-07-23
     * @param {*} event
     */
  /* cambioSeleccionPublicidad(event) {
    console.log('evento ' + JSON.stringify(event.value));
    console.log('evento ' + JSON.stringify(this.fpublicidad.value));
  } */

  /**
   * @description METODO QUE TOMA EL VALOR DEL COMBO GRADO DE INTERES
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @param {*} event
   * @memberof ListCotizarComponent
   */
  /* cambioSeleccionGradoInteres(event) {
    console.log('evento ' + JSON.stringify(event.value));
    console.log('evento ' + JSON.stringify(this.fgradoInteres.value));
  } */
  /**
   * @description METODO QUE TOMA EL VALOR DEL COMBO MOTIVO DE DESESTIMIENTO
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-07-23
   * @param {*} event
   * @memberof ListCotizarComponent
   */
  /* cambioSeleccionMotivoDesestimiento(event) {
    console.log('evento ' + JSON.stringify(event.value));
    console.log('evento ' + JSON.stringify(this.fmotivoDesestimiento.value));
  } */
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

    if (this.formCliente.valid) {

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
      console.log('DATASOURCE TIPO ORO', JSON.stringify(this.dataSourceTipoOro.data));
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
            this.pre.loadPrecioOroByCotizacion(this.entidadCotizador.id).subscribe((pos: any) => {
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
      let consulta = new ConsultaOferta();
      consulta.identificacionCliente = this.entidadCliente.cedulaCliente;
      consulta.tipoOroKilataje = this.tipoOro.value.quilate;
      consulta.fechaNacimiento = this.entidadCliente.fechaNacimiento;
      this.ing.getInformacionOferta( consulta ).subscribe((dataTipoOro: any) => {
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
  /******************************************** CARGA DE COMBOS  ***********************************************************/
  public consultaCatalogos() {
    this.sof.consultarEducacionCS().subscribe((data: any) => {
      if (data.existeError !== true) {
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
    this.getPublicidades();
    this.getGradoInteres();
    this.getTipoOro();
    this.getMotivoDesestimiento();
    this.consultaCatalogos();

  }

}
