import { TbQoCliente } from './../../../../../core/model/quski/TbQoCliente';
import { ValidateCedula, calcularEdad } from '../../../../../core/util/validate.util';
import { YearMonthDay } from './../../../../../core/model/quski/YearMonthDay';
import { RelativeDateAdapter } from './../../../../../core/util/relative.dateadapter';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from './../../../../partials/custom/auth-dialog/auth-dialog.component';
import { MatDialog, MatTableDataSource,  MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { ParametroService } from './../../../../../core/services/quski/parametro.service';
import { ClienteService } from './../../../../../core/services/quski/cliente.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Page } from './../../../../../core/model/page';
import { CRMService } from './../../../../../core/services/quski/crm.service';
import { TrackingService } from './../../../../../core/services/quski/tracking.service';
import { ErrorCargaInicialComponent } from './../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { VerCotizacionesComponent } from './../../../../partials/custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { ConsultaCliente } from './../../../../../core/model/softbank/ConsultaCliente';
import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { ClienteSoftbank } from './../../../../../core/model/softbank/ClienteSoftbank';
import { ProspectoCRM } from './../../../../../core/model/crm/prospectoCRM';
import { PersonaCalculadora } from './../../../../../core/model/calculadora/PersonaCalculadora';
import { TbQoVariablesCrediticia } from './../../../../../core/model/quski/TbQoVariablesCrediticia';
import { TbQoRiesgoAcumulado } from './../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { CotizacionService } from './../../../../../core/services/quski/cotizacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneroEnum } from './../../../../../core/enum/GeneroEnum';
import { PersonaConsulta } from './../../../../../core/model/calculadora/personaConsulta';
import { IntegracionService } from './../../../../../core/services/quski/integracion.service';
import { DataPopup } from './../../../../../core/model/wrapper/dataPopup';
import { TbQoNegociacion } from './../../../../../core/model/quski/TbQoNegociacion';
import { TbQoDireccionCliente } from './../../../../../core/model/quski/TbQoDireccionCliente';
import { GuardarProspectoCRM } from './../../../../../core/model/crm/guardarProspectoCRM';
import { SolicitudAutorizacionDialogComponent } from './../../../../partials/custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';

export interface TimeTracking {
  tasacion: Date;
  oferta: Date;
}
export interface ParamTracking {
  proceso : string
  actividad : string
}
@Component({
  selector: 'kt-gestion-negociacion',
  templateUrl: './gestion-negociacion.component.html',
  styleUrls: ['./gestion-negociacion.component.scss']
})
export class GestionNegociacionComponent implements OnInit {
  // VARIABLES PUBLICAS
  public dataPopup: DataPopup;
  public loading;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  // ENTIDADES
  private entidadPersonaCalculadora: PersonaCalculadora;
  private entidadProspectoCRM: ProspectoCRM;
  private entidadClientesoftbank: ClienteSoftbank;
  private entidadCliente: TbQoCliente;
  private entidadNegociacion: TbQoNegociacion;
  private entidadesVariablesCrediticias: Array<TbQoVariablesCrediticia>;
  private entidadesRiesgoAcumulados: Array<TbQoRiesgoAcumulado>;
  // CATALOGOS
  private catEducacion: Array<any>;
  private catPublicidad: Array<any>;
  private catTipoVivienda: Array<any>;
  // VARIABLES DE TRACKING
  private horaInicio:     TimeTracking;
  private horaAsignacion: TimeTracking;
  private horaAtencion:   TimeTracking;
  private horaFinal:      TimeTracking;
  private tasacion: ParamTracking;
  private oferta:   ParamTracking;
  
  // FORMULARIO BUSQUEDA
  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  // FORMULARIO CLIENTE
  public formDatosCliente: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public publicidad = new FormControl( '',[Validators.required]);
  public fechaDeNacimiento = new FormControl('', []);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', []);
  public aprobacionMupi = new FormControl('', []);
  // FORMULARIO TASACION
  // ---- @TODO: Complear formulario
  public formTasacion: FormGroup = new FormGroup({});

  // TABLA DE TASACION
  // ---- @TODO: Crear un data source para la tabla 
  dataSourceTasacion = new MatTableDataSource<any>();
  displayedColumnsTasacion = ['Accion', 'N', 'NumeroPiezas', 'TipoOro', 'TipoJoya', 'Estado', 'Descripcion'
,'PesoBruto', 'DescuentoPiedra', 'DescuentoSuelda', 'PesoNeto', 'ValorAvaluo'
  , 'ValorComercial', 'ValorRealizacion', 'ValorOro'];
  
  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  roomsFilter: any;
  // Columnas de las tablas 
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;
  p = new Page ();


 constructor(
  private sof: SoftbankService,
  private cot: CotizacionService,
  private cli: ClienteService, 
  private ing: IntegracionService,
  private par: ParametroService,
  private tra: TrackingService,
  private crm: CRMService,
  private route : ActivatedRoute,
  private router: Router,
  private dialog: MatDialog, 
  private sinNotSer: ReNoticeService, 
  private noticeService: ReNoticeService, 
  private subheaderService: SubheaderService,
  ) { 
    this.formBusqueda.addControl("identificacion", this.identificacion);
    this.formDatosCliente.addControl("fechaNacimiento", this.fechaDeNacimiento);
    this.formDatosCliente.addControl("nombresCompletos", this.nombresCompletos);
    this.formDatosCliente.addControl("edad", this.edad);
    this.formDatosCliente.addControl("nacionalidad", new FormControl('', Validators.required));
    this.formDatosCliente.addControl("movil", this.movil);
    this.formDatosCliente.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formDatosCliente.addControl("email", this.email);
    this.formDatosCliente.addControl("campania", this.campania);
    this.formDatosCliente.addControl("publicidad", this.publicidad);
    this.formDatosCliente.addControl("aprobacionMupi" , this.aprobacionMupi);
}

  ngOnInit() {
    this.consultaCatalogos();
    this.getPublicidades();
    this.loading = this.loadingSubject.asObservable();
    this.subheaderService.setTitle('Negociación');
    console.log("Esto calcula la edad? --> ",calcularEdad('1998-05-09'));
;    
  }
  /** ********************************************* @BUSQUEDA_CLIENTE ********************* **/
  public buscarCliente(){
    if(this.formBusqueda.valid){

    }else{
      this.getErrorMessage
    }
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
   * @returns TbQoCliente
   */
  private buscarEnSoftbank( cedula: string ): any{
    this.loadingSubject.next(true);
    const consulta = new ConsultaCliente();
    let clienteS  :  ClienteSoftbank
    consulta.identificacion = cedula; 
    this.sof.consultarClienteCS( consulta ).subscribe((data: any)=>{
      clienteS =  data.existeError? null: (data.identificacion != null)? data: null;
      let cliente = new TbQoCliente();
      if(clienteS != null){
        cliente.cedulaCliente = clienteS.identificacion;
        cliente.apellidoPaterno = clienteS.primerApellido;
        cliente.apellidoMaterno = clienteS.segundoApellido;
        cliente.primerNombre = clienteS.primerNombre;
        cliente.segundoNombre = clienteS.segundoNombre;
        // @TODO: Esperando servicio de cloudstudio -> cliente.lugarNacimiento = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.actividadEconomica = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.actividadEconomicaEmpresa  = clienteS 
        cliente.fechaNacimiento = clienteS.fechaNacimiento;
        // @TODO: Esperando servicio de cloudstudio -> cliente.genero = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.profesion = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.estadoCivil = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.nivelEducacion = clienteS 
        cliente.cargasFamiliares = clienteS.numeroCargasFamiliares;
        cliente.email = clienteS.email; 
        // @TODO: Esperando servicio de cloudstudio -> cliente.tbQoDireccionClientes = clienteS
        // @TODO: Esperando servicio de cloudstudio -> cliente.telefonoAdicional = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.telefonoFijo = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.telefonoMovil = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.telefonoTrabajo = clienteS 
        // @TODO: Esperando servicio de cloudstudio -> cliente.tbQoReferenciaPersonals = clienteS
        // @TODO: Esperando servicio de cloudstudio -> cliente.tbQoPatrimonios
        // @TODO: Esperando servicio de cloudstudio -> cliente.tbQoIngresoEgresoClientes
        // @TODO: Conectar a metodo de edad -> cliente.edad = clienteS
        // @TODO: Esperando servicio de cloudstudio -> cliente.nacionalidad = clienteS
      } else{
        console.log("Error en la consulta de  cliente de softbank por lo siguiente: ");
        console.log("Cliente en softbank --> identificacion: ", data.identificacion);
        console.log("Cliente en softbank --> existeError: ", data.existeError);
        console.log("Cliente en softbank --> mensaje: ", data.mensaje);
        console.log("Cliente en softbank --> codigoServicio: ", data.codigoServicio);
        console.log("Cliente en softbank --> validaciones: ", data.validaciones);
      }
      this.loadingSubject.next( this.loadingSubject.getValue() ? false:false ); 
      return (clienteS != null)? cliente:clienteS;
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
   * @returns TbQoCliente
   */
  private buscarEnCrm( cedula: string ): any{
    this.loadingSubject.next(true);
    let clienteC:  ProspectoCRM;  
    this.crm.findClienteByCedulaCRM(cedula).subscribe((data: any)=>{
      clienteC =  data.list === null? null: data.list[0];
      let cliente = new TbQoCliente();
      if(clienteC != null){
        cliente.primerNombre = clienteC.firstName;
        cliente.cedulaCliente = clienteC.cedulaC;
        cliente.telefonoFijo = clienteC.phoneHome;
        cliente.telefonoMovil = clienteC.phoneMobile;
        cliente.telefonoAdicional = clienteC.phoneOther;
        cliente.telefonoTrabajo = clienteC.phoneWork;
        cliente.email = clienteC.emailAddress; 
      } else{
        console.log("Error en la consulta de Prospecto de CRM por lo siguiente: ");
        console.log("Prospecto de CRM --> data: ", data);
      }
      this.loadingSubject.next( this.loadingSubject.getValue() ? false:false ); 
      return (clienteC != null)? cliente:clienteC;
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
   * @returns TbQoCliente
   */
  private buscarEnEquifax( cedula: string ): any{
    this.loadingSubject.next(true);
    let clienteE :  PersonaCalculadora;  
    let consulta = new PersonaConsulta();
    consulta.identificacion = cedula;
    this.ing.getInformacionPersonaCalculadora( consulta ).subscribe((data: any)=>{
      clienteE =  (data.entidad.datoscliente === null)? null: data.entidad.datoscliente;
      let cliente = new TbQoCliente();
      if(clienteE != null){
        cliente.fechaNacimiento = clienteE.fechanacimiento;
        cliente.nacionalidad = (clienteE.nacionalidad === "EC")? "ECUADOR": null;
        cliente.email = clienteE.correoelectronico;
        cliente.relacionDependencia = (clienteE.relaciondependencia === "N")? "NO": (clienteE.relaciondependencia === "S")? "SI":null;
        cliente.cargo = clienteE.cargo;
        cliente.profesion = clienteE.profesion;
        cliente.cargasFamiliares = clienteE.cargasfamiliares;
      } else{
        console.log("Error en la consulta de Persona en Equifax por lo siguiente: ");
        console.log("Cliente en Equifax --> identificacion: ", data.entidad.identificacion);
        console.log("Cliente en Equifax --> codigoError: ", data.entidad.codigoError);
        console.log("Cliente en Equifax --> mensaje: ", data.entidad.mensaje);
        console.log("Cliente en Equifax --> ejecucion: ", data.entidad.ejecucion);
      }
      this.loadingSubject.next( this.loadingSubject.getValue() ? false:false ); 
      return (clienteE != null)? cliente:clienteE;
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cliente TbQoCliente
   * @returns boolean
  */
  private guardarProspectoEnCrm( cliente: TbQoCliente): any{
    this.loadingSubject.next(true);
    const prospecto = new GuardarProspectoCRM();
    prospecto.cedulaC = cliente.cedulaCliente;
      prospecto.firstName = cliente.primerNombre;
      prospecto.phoneHome = cliente.telefonoFijo;
      prospecto.phoneMobile = cliente.telefonoMovil;
      prospecto.leadSourceDescription = 'GESTION QUSKI';
      prospecto.emailAddress = cliente.email;
      prospecto.emailAddressCaps = cliente.email.toUpperCase();
      this.crm.guardarProspectoCRM( prospecto ).subscribe((data: any)=>{
        this.loadingSubject.next( this.loadingSubject.getValue() ? false:false ); 
        return (data.entidades != null)? true: false;
      }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNotSer.setNotice(b.msgError, 'error');
        this.loadingSubject.next(false);
      } else {
        this.sinNotSer.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
      return false;
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cliente TbQoCliente
   * @returns TbQoCliente
   * @returns null
  */
  private guardarClienteEnCore( cliente: TbQoCliente): any{
    this.loadingSubject.next(true);
    this.cli.persistEntity(cliente).subscribe((data: any) => {
      this.loadingSubject.next( this.loadingSubject.getValue() ? false:false ); 
      return (data.entidad != null)? data.entidad: null;
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNotSer.setNotice(b.msgError, 'error');
        this.loadingSubject.next(false);
      } else {
        this.sinNotSer.setNotice('ERROR GUARDANDO CLIENTE EN CORE INTERNO', 'error');
      }
      return null;
    });
  }



  /** ********************************************* @POPUP ********************* **/
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
  */
  private solicitarAutorizacion(cedula: string) {
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: cedula
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      // @TODO: Conectar al flujo de busqueda.
      (respuesta !== null && respuesta !== undefined)? this.buscarEnCrm(cedula):(
        this.sinNotSer.setNotice('BUSQUEDA CANCELADA', 'error'),
        this.limpiarCamposBusqueda()
      );
    });
  }
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  /**
   * @author  Developer Twelve - Jeroham Cadenas
  */
  private limpiarCamposBusqueda() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formDatosCliente.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
  }
































  private consultaCatalogos() {
    this.loadingSubject.next(true);
    this.sof.consultarEducacionCS().subscribe((data: any) => {
      this.catEducacion = data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.loadingSubject.next(this.loadingSubject.getValue() ? false:false); 
    });
  }
  inicioDeFlujo() {
    // this.capturaDatosTraking();
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.id) {
        this.cot.getEntity(json.params.id).subscribe( (data : any) =>{
          if (data.entidad) {
            this.entidadNegociacion = data.entidad;
            //this.capturaHoraInicio();
            // @todo
            // this.buscarCliente( this.entidadNegociacion.tbQoCliente.cedulaCliente );
          }
        }, error => {
          let mensaje = "ERROR DESCONOCIDO AL CARGAR DATOS DE LA COTIZACION";
          this.salirDeGestion( mensaje );
        }); 
      } else{
        // Limpiar campos 
        // @todo
      }
    });
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @param mensaje Mensaje del componente
  */
  salirDeGestion( mensaje : string ){
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "auto-max",
      height: "auto-max",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
        this.router.navigate(['dashboard', ""]);  
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
    this.email.setValue(this.entidadCliente.email);
    console.log('VARIABLES', JSON.stringify(this.entidadesVariablesCrediticias));



    //TODO: COMENTO NO FUNCIONA EL SERVICE
    //this.dataSourceRiesgoAcumulado.data = this.entidadesRiesgoAcumulados;
    this.loadingSubject.next(false);

  }
  private actualizarCliente(cliente: TbQoCliente) {
    this.cli.persistEntity(cliente).subscribe((data: any) => {
      if (data.entidad) {
        this.entidadCliente = data.entidad;
      } else {
        this.sinNotSer.setNotice('ERROR EN CORE INTERNO CLIENTE, NO SE ACTUALIZO CLIENTE', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNotSer.setNotice(b.msgError, 'error');
      } else {
        this.sinNotSer.setNotice('ERROR EN CORE INTERNO CLIENTE, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  



































  ///Validaciones de errores
getErrorMessage(pfield: string) {
  const errorRequerido        = 'Ingresar valores';
  const errorNumero           = 'Ingresar solo numeros';
  const maximo                = "El maximo de caracteres es: ";
  const invalidIdentification = 'La identificacion no es valida';
  const errorLogitudExedida   = 'La longitud sobrepasa el limite';
  const errorInsuficiente     = 'La longitud es insuficiente';
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

    return this.email.hasError('required') ? errorRequerido : this.email.hasError('email') ? 'E-mail no valido' : this.email.hasError('maxlength') ? maximo
      + this.email.errors.maxlength.requiredLength : '';

  }
 

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
}

///Validar solo numeros
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}
  
/**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Tracking llamado desde .html captura la hora de atencion
   */
  private capturaHoraAtencion(){
    if( this.horaAtencion == null ){
      this.tra.getSystemDate().subscribe( (hora: any) =>{
        if(hora.entidad){
          this.horaAtencion = hora.entidad;
        }
      });
    }
  }

  getPublicidades() {
    this.par.findByNombreTipoOrdered("", "PUB", "Y").subscribe((wrapper: any) => {
      if (wrapper && wrapper.entidades) {
        this.catPublicidad = wrapper.entidades;
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNotSer.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNotSer.setNotice("Error al cargar parametros de publicidad", 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: "Error " + error.statusText + " - " + error.message
          }
        });
      } else {
        this.sinNotSer.setNotice("Error al cargar publicidades", 'error');
      }
    });
  }

 private abrirPopupVerCotizacion() {

    const dialogRefGuardar = this.dialog.open(VerCotizacionesComponent, {
      width: '900px',
      height: 'auto',
      data: "1001574035"


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
     
      if (respuesta)
      console.log("Estoy aqui ");
     

    });


  }


  ////Metodo de calculo de la fecha de nacimiento
  onChangeFechaNacimiento() {

    this.loadingSubject.next(true);
    console.log("VALOR DE LA FECHA" + this.fechaDeNacimiento.value);
    const fechaSeleccionada = new Date(
      this.fechaDeNacimiento.value
    );
    console.log("FECHA SELECCIONADA" + fechaSeleccionada);
    if (fechaSeleccionada) {
      this.getDiffFechas(fechaSeleccionada, "dd/MM/yyy");
    } else {
      this.sinNotSer.setNotice(
        "El valor de la fecha es nulo",
        "warning"
      );
      this.loadingSubject.next(false);
    }
  }

/// Consulta de la edad me diante la fecha 
  getDiffFechas(fecha: Date, format: string) {
    this.loadingSubject.next(true);
    const convertFechas = new RelativeDateAdapter();
    this.par
      .getDiffBetweenDateInicioActual(
        convertFechas.format(fecha, "input"),
        format
      )
      .subscribe(
        (rDiff: any) => {
          const diff: YearMonthDay = rDiff.entidad;
          this.edad.setValue(diff.year);
          console.log("La edad es " + this.edad.value);
          this.loadingSubject.next(false);
          const edad = this.edad.value;
          if (edad != undefined && edad != null && edad < 18) {
            this.edad
              .get("edad")
              .setErrors({ "server-error": "error" });
          }
          this.loadingSubject.next(false);
        },
        error => {
          if (JSON.stringify(error).indexOf("codError") > 0) {
            const b = error.error;
            this.sinNotSer.setNotice(b.msgError, "error");
          } else {
            this.sinNotSer.setNotice(
              "Error obtener diferencia de fechas",
              "error"
            );
            console.log(error);
          }
          this.loadingSubject.next(false);
        }
      );
  }
/**
 * Metodo buscar cliente wn primera instancia busca en SOFTBANK luego en la Calculadora Quski
 * y  en CRM 
 * Si no existe pide que se suba la autorizacion de equifax.
 */

   

///Abrir el POPUP de la solicitud de equifax
  /* seleccionarEditar() {

    console.log(">>>INGRESA AL DIALOGO ><<<<<<");
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: this.identificacion.value


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      data: this.identificacion.value;
      console.log(">>><<<<<<<<<<<<<<< DATA arreglo" + JSON.stringify(this.data));
      console.log("jxjkxf" , )
      console.log("envio de datos ");
      if (respuesta)
      this.loadingSubject.next(true);
      this.cs.findClienteByCedulaQusqui("C", this.identificacion.value).subscribe((data: any) => {
  
        this.loadingSubject.next(false);
        if (data.entidad.datoscliente) {
          console.log('Equifax ', data.entidad);
          this.nombresCompletos.setValue(data.entidad.datoscliente.nombrescompletos);
          this.fechaDeNacimiento.setValue(data.entidad.datoscliente.fechanacimiento);
          this.edad.setValue(data.entidad.datoscliente.edad);
          this.nacionalidad.setValue(data.entidad.datoscliente.nacionalidad);
          this.movil.setValue(data.entidad.datoscliente.telefonomovil);
          this.telefonoDomicilio.setValue(data.entidad.datoscliente.telefonofijo);
          this.publicidad.setValue(data.entidad.datoscliente.publicidad);
          this.email.setValue(data.entidad.datoscliente.email);
          this.campania.setValue(data.entidad.datoscliente.codigocampania);
          this.loadingSubject.next(false);
          this.sinNotSer.setNotice("INFORMACION CARGADA CORRECTAMENTE CALCULADORA QUSKI", 'success');
        } else {
              this.sinNotSer.setNotice("USUARIO NO REGISTRADO ", 'error');
              this.seleccionarEditar();
            }
          
       
      },
      );

    });



  } */
/*   public cadena="";
  public cadena1;
  ////Registro del prospecto en el CRM////
  registrarProspecto(){
   
    if(this.identificacion.value!=""&&this.nombresCompletos.value!=""&&this.email.value!=""){
   
    this.clienteCRM=new ClienteCRM();
    this.clienteCRM.firstName=this.nombresCompletos.value;
    this.clienteCRM.phoneHome=this.telefonoDomicilio.value;
    this.clienteCRM.phoneMobile=this.movil.value;
    this.clienteCRM.cedulaC=this.identificacion.value;
    this.clienteCRM.emailAddress=this.email.value;
    this.cadena =this.email.value;
    this.cadena1 = this.cadena.toUpperCase();
    this.clienteCRM.emailAddressCaps=this.cadena1;
    this.sinNotSer.setNotice("REGISTRO CORRECTO DEL PROSPECTO", 'success');
    this.cs.guardarProspectoCRM(this.clienteCRM).subscribe((data: any) => {
    console.log("datos de envio: " + JSON.stringify(this.clienteCRM));
  }, error => {
    console.log("error al guardar el cliente en el CRM: " + error);
    console.log("------------manageurl errorsss : " + JSON.stringify(error));
    this.sinNotSer.setNotice("NO SE PUEDE GUARDAR", 'error');
    //  this.loadingSubject.next(false);
  });
}  
  else{
    this.sinNotSer.setNotice("DEBE COMPLETAR LA INFORMACION ", 'error');
  }

  } */

}
