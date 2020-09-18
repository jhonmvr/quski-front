import { TbQoCliente } from './../../../../../core/model/quski/TbQoCliente';
import { ValidateCedula, calcularEdad } from '../../../../../core/util/validate.util';
import { YearMonthDay } from './../../../../../core/model/quski/YearMonthDay';
import { RelativeDateAdapter } from './../../../../../core/util/relative.dateadapter';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from './../../../../partials/custom/auth-dialog/auth-dialog.component';
import { MatDialog, MatTableDataSource, MatSort, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { ParametroService } from './../../../../../core/services/quski/parametro.service';
import { ClienteService } from './../../../../../core/services/quski/cliente.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
import { CotizacionService } from './../../../../../core/services/quski/cotizacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaConsulta } from './../../../../../core/model/calculadora/personaConsulta';
import { IntegracionService } from './../../../../../core/services/quski/integracion.service';
import { DataPopup } from './../../../../../core/model/wrapper/dataPopup';
import { TbQoNegociacion } from './../../../../../core/model/quski/TbQoNegociacion';
import { GuardarProspectoCRM } from './../../../../../core/model/crm/guardarProspectoCRM';
import { SolicitudAutorizacionDialogComponent } from './../../../../partials/custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { TbQoTasacion } from './../../../../../core/model/quski/TbQoTasacion';
import { TbQoCotizador } from './../../../../../core/model/quski/TbQoCotizador';
import { NegociacionService } from './../../../../../core/services/quski/negociacion.service';
import { environment } from '../../../../../../../src/environments/environment';
import { SituacionEnum } from './../../../../../core/enum/SituacionEnum';
import { TasacionService } from './../../../../../core/services/quski/tasacion.service';
import { ExcepcionService } from './../../../../../core/services/quski/excepcion.service';
import { DataInjectExcepciones } from './../../../../../core/model/wrapper/DataInjectExcepciones';
import { SolicitudDeExcepcionesComponent } from './../../../../partials/custom/popups/solicitud-de-excepciones/solicitud-de-excepciones.component';
import { TbQoExcepcione } from './../../../../../core/model/quski/TbQoExcepcione';

export interface TimeTracking {
  tasacion: Date;
  oferta: Date;
}
export interface ParamTracking {
  proceso: string
  actividad: string
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
  public usuario: string; 
  public loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper',{static:true}) myStepper: MatStepper;
  // ENTIDADES
  private entidadNegociacion: TbQoNegociacion;
  private entidadesExcepciones: Array<TbQoExcepcione>;
  private entidadesTasacion: Array<TbQoTasacion>;
  // CATALOGOS
  public catPublicidad: Array<any> = ["CARGANDO CATALOGO"];  
  public catTipoJoya: Array<any>;
  public catTipoOro: Array<any>;
  public catEstadoJoya: Array<any>;



  // VARIABLES DE TRACKING
  private horaInicio: TimeTracking;
  private horaAsignacion: TimeTracking;
  private horaAtencion: TimeTracking;
  private horaFinal: TimeTracking;
  private tasacion: ParamTracking;
  private oferta: ParamTracking;

  // FORMULARIO BUSQUEDA
  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  // FORMULARIO CLIENTE
  public formDatosCliente: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public publicidad = new FormControl('', [Validators.required]);
  public fechaDeNacimiento = new FormControl('', []);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', []);
  public aprobacionMupi = new FormControl('', []);
  // FORMULARIO TASACION
  public formTasacion: FormGroup = new FormGroup({});
  public numeroPiezas = new FormControl('', []);
  public tipoOro = new FormControl('', []);
  public tipoJoya = new FormControl('', []);
  public estado = new FormControl('', []);
  public pesoBruto = new FormControl('', []);
  public descuentoPiedra = new FormControl('', []);
  public descuentoSuelda = new FormControl('', []);
  public descripcion = new FormControl('', []);
  public pesoNeto = new FormControl('', []);
  public valorOro = new FormControl('', []);

  public formOpcionesCredito: FormGroup = new FormGroup({});
  public montoSolicitado = new FormControl('', []);

  // TABLA DE TASACION
  // ---- @TODO: Crear un data source para la tabla 
  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();
  displayedColumnsTasacion = ['Accion', 'N', 'NumeroPiezas', 'TipoOro', 'TipoJoya', 'EstadoJoya', 'Descripcion', 
  'PesoBruto', 'DescuentoPesoPiedra', 'DescuentoSuelda', 'PesoNeto', 'ValorAvaluo', 'ValorComercial', 'ValorRealizacion', 'ValorOro'];
    
  dataSourceOpcionesCredito = new MatTableDataSource<any>();
  displayedColumnsOpcionesCredito = ['Accion','plazo','periodoPlazo','periodicidadPlazo','montoFinanciado','valorARecibir','valorAPagar',
  'costoCustodia','costoFideicomiso','costoSeguro','costoTasacion','costoTransporte','costoValoracion','impuestoSolca' ,
  'formaPagoImpuestoSolca','formaPagoCapital','formaPagoCustodia','formaPagoFideicomiso','formaPagoInteres','formaPagoMora',
  'formaPagoGastoCobranza','formaPagoSeguro','formaPagoTasador','formaPagoTransporte','formaPagoValoracion','saldoInteres',
  'saldoMora','gastoCobranza','cuota','saldoCapitalRenov','montoPrevioDesembolso','totalGastosNuevaOperacion',
  'totalCostosOperacionAnterior','custodiaDevengada','formaPagoCustodiaDevengada','tipooferta','porcentajeflujoplaneado',
  'dividendoflujoplaneado','dividendosprorrateoserviciosdiferido'];

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  roomsFilter: any;
  // Columnas de las tablas 
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;
  p = new Page();


 constructor(
  private sof: SoftbankService,
  private cot: CotizacionService,
  private cli: ClienteService, 
  private ing: IntegracionService,
  private par: ParametroService,
  private tra: TrackingService,
  private crm: CRMService,
  private neg: NegociacionService,
  private tas: TasacionService,
  private exc: ExcepcionService,
  private route : ActivatedRoute,
  private router: Router,
  private dialog: MatDialog, 
  private sinNotSer: ReNoticeService, 
  private noticeService: ReNoticeService, 
  private subheaderService: SubheaderService  
  ) { 
    //  RELACIONANDO FORMULARIO DE BUSQUEDA
    this.formBusqueda.addControl("identificacion", this.identificacion);
    //  RELACIONANDO FORMULARIO DE CLIENTE
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
    //  RELACIONANDO FORMULARIO DE TASACION
    this.formTasacion.addControl("numeroPiezas" , this.numeroPiezas);
    this.formTasacion.addControl("tipoOro" , this.tipoOro);
    this.formTasacion.addControl("tipoJoya" , this.tipoJoya);
    this.formTasacion.addControl("estado" , this.estado);
    this.formTasacion.addControl("pesoBruto" , this.pesoBruto);
    this.formTasacion.addControl("descuentoPiedra" , this.descuentoPiedra);
    this.formTasacion.addControl("descuentoSuelda" , this.descuentoSuelda);
    this.formTasacion.addControl("descripcion" , this.descripcion);
    this.formTasacion.addControl("pesoNeto" , this.pesoNeto);
    this.formTasacion.addControl("valorOro" , this.valorOro);

    this.formOpcionesCredito.addControl("montoSolicitado" , this.montoSolicitado);
  }

  ngOnInit() {
    this.subheaderService.setTitle('Negociación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey))
    this.obtenerCatalogosSoftbank();
    this.obtenerCatalogosCore();
    // console.log("Esto calcula la edad? --> ",calcularEdad('1998-05-09'));
    this.inicioDeFlujo();
  }
  /** ********************************************* @FLUJO ********************* **/
  inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      this.loadingSubject.next(true);
      if (json.params.id && json.params.origen) {
        this.myStepper.selectedIndex = 1;
        if(json.params.origen == "COT"){
          console.log("Estoy buscando una cotizacion"); // *************************************** Busco una cotizacion
          this.cot.getEntity(json.params.id).subscribe((data: any)=>{
            if(data.entidad){
              const cotizacion: TbQoCotizador = data.entidad;
              const negociacion: TbQoNegociacion = new TbQoNegociacion(cotizacion.tbQoCliente.id, this.usuario); 
              this.neg.persistEntity(negociacion).subscribe((data: any)=>{
                if(data.entidad){
                  this.entidadNegociacion = new TbQoNegociacion();
                  this.entidadNegociacion = data.entidad;
                  this.cargarValoresBusquedayCliente(this.entidadNegociacion.tbQoCliente);
                  this.consultarExcepcionesDeClienteEnBre(this.entidadNegociacion.tbQoCliente.cedulaCliente);
                  this.sinNotSer.setNotice('SE HA INICIADO UNA NUEVA NEGOCIACION PARA: '+ data.entidad.cedulaCliente,"success");
                }else{
                  this.salirDeGestion("Error al intentar ingresar a la Negociacion.", this.entidadNegociacion.id);
                }
                this.loadingSubject.next(false);
              }, error=>{ this.capturaError(error); this.loadingSubject.next(false);});
            }else{
              this.loadingSubject.next(false);
              this.sinNotSer.setNotice('ERROR AL ENCONTRAR LA COTIZACION PREVIA', "error");
              this.limpiarCamposBusqueda();
              this.limpiarCamposCliente();
            }
          }, error=>{ this.capturaError(error); this.loadingSubject.next(false);});
        } else if(json.params.origen == "NEG") {
          console.log("Estoy buscando una negociacion");       // *************************************** Busco una Negociacion.
          this.neg.findNegociacionById(json.params.id).subscribe((data:any) => {
            if(data.entidad){
              this.entidadNegociacion = data.entidad;
              this.tas.getTasacionByIdNegociacion(null, this.entidadNegociacion.id).subscribe((data:any)=>{
                this.entidadesTasacion = data.list? data.list: null;
                console.log("Tasacion ---> ", data.list); 
                this.cargarValoresBusquedayCliente(this.entidadNegociacion.tbQoCliente);
                this.cargarTablaTasacion(this.entidadesTasacion); 
                if(this.entidadNegociacion.situacion === SituacionEnum.EN_PROCESO){
                  this.exc.findByIdNegociacion(this.entidadNegociacion.id).subscribe((data: any)=>{
                    if(data.list){
                      this.entidadesExcepciones = data.list;
                      this.entidadesExcepciones.forEach(e=>{
                        if(e.estadoExcepcion === "NEGADO"){
                          const mensaje = "Su excepcion solicitada fue negada por el siguiente motivo: " + e.observacionAprobador + ". Se finalizara la negociacion.";
                          this.salirDeGestion(mensaje,this.entidadNegociacion.id,"EXCEPCION NEGADA");
                        } else if(e.estadoExcepcion === "PENDIENTE"){
                          this.salirDeGestion("Por favor, espere a que su solicitud de excepcion sea respondida por un aprobador",null,"ESPERANDO RESPUESTA DEL APROBADOR");
                        } else if(e.estadoExcepcion === "APROBADO"){
                          this.sinNotSer.setNotice("Su excepcion fue aprobada, continue con la negociacion.", 'success');
                        }
                      });
                    }
                  },error=>{ 
                    this.capturaError(error); 
                    this.salirDeGestion("No se pudo consultar excepciones existentes, se cerrara la negociacion por seguridad");
                  });
                  // Validar si tiene excepciones
                } else if(this.entidadNegociacion.situacion === SituacionEnum.FINALIZADO){
                  this.formBusqueda.disable();
                  this.formDatosCliente.disable();
                  this.formTasacion.disable();
                  this.cargarValoresBusquedayCliente( this.entidadNegociacion.tbQoCliente );
                  this.cargarTablaTasacion(this.entidadesTasacion); 
                  this.loadingSubject.next(false);
                } else {
                  this.salirDeGestion("Error al intentar identificar la situacion de la Negociacion.");
                }
              }, error=>{ this.capturaError(error); this.loadingSubject.next(false)});
            }else{
              this.salirDeGestion("Error al intentar ingresar a la Negociacion.");
            }
            this.loadingSubject.next(false);
          }, error=>{this.capturaError(error); this.loadingSubject.next(false);});
        } else{
            this.loadingSubject.next(false);
            this.salirDeGestion("Error al intentar ingresar a la Negociacion.");
        }
      } else{
        console.log("Estoy iniciando nueva negociacion");     // *************************************** No busco nada, solo abro
        this.entidadNegociacion = new TbQoNegociacion();
        this.loadingSubject.next(false);
        this.limpiarCamposBusqueda();
      }
    });
  }
  /** ********************************************* @BUSQUEDA_CLIENTE ********************* **/
  /**
   * @author  Developer Twelve - Jeroham Cadenas                                              
   * @description Metodo principal de busqueda.
   */
  public buscarCliente() {
    if (this.formBusqueda.valid) {
      this.loadingSubject.next(true);
      // VALORES DE CONSULTA
      const cedula = this.identificacion.value
      const consultaSof = new ConsultaCliente(cedula);
      let clienteSof = new ClienteSoftbank();
      const consultaCor = cedula;
      let clienteCor = new TbQoCliente();
      this.sof.consultarClienteCS(consultaSof).subscribe((data: any) => {
        clienteSof = data.existeError ? null : (data.identificacion == null) ? null : data;
        if (clienteSof) {
          clienteCor.cedulaCliente = clienteSof.identificacion;
          clienteCor.apellidoPaterno = clienteSof.primerApellido;
          clienteCor.apellidoMaterno = clienteSof.segundoApellido;
          clienteCor.primerNombre = clienteSof.primerNombre;
          clienteCor.segundoNombre = clienteSof.segundoNombre;
          clienteCor.fechaNacimiento = clienteSof.fechaNacimiento;
          clienteCor.cargasFamiliares = clienteSof.numeroCargasFamiliares;
          clienteCor.email = clienteSof.email;
          console.log("Cliente encontrado en sofbank")
          this.guardarCliente(clienteCor);
        } else {
          console.log("No encontrado en softbank --> data:", data);
          this.cli.findClienteByIdentificacion(consultaCor).subscribe((data: any) => {
            clienteCor = (data.entidad === null) ? null : data.entidad;
            if (clienteCor) {
              console.log("Cliente encontrado en Core");
              this.guardarCliente(clienteCor);
            } else {
              console.log("Error en la consulta de Persona en core por lo siguiente: ");
              console.log("Cliente en Core --> data.entidad: ", data.entidad);
              this.abrirPopupDeAutorizacionYConsultaCliente(cedula);
            }
          });
        }
      });
    } else {
      this.sinNotSer.setNotice('INGRESE UN NUMERO DE CEDULA VALIDO', 'error');
    }
  }
  private consultarExcepcionesDeClienteEnBre(cedula:string) {
    this.loadingSubject.next(true);
    this.ing.getInformacionPersonaCalculadora(new PersonaConsulta(cedula)).subscribe((data:any) => {
      if(data.entidad.codigoError === 3){
        const excep = new DataInjectExcepciones(data.entidad.mensaje, this.entidadNegociacion.id);
        excep.isCliente = true;
        this.loadingSubject.next(false);
        this.abrirPopupExcepciones(excep);
      } else{
        console.log("el cliente no presenta excepciones :)");
      }
    }, error=>{ 
      this.capturaError(error); 
      this.salirDeGestion("Error al capturar Excepciones existentes en BRE, la negociacion se cerrara por seguridad.",this.entidadNegociacion.id);
    });  
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
   */
  private buscarEnCrmYEquifax(cedula: string) {
    this.loadingSubject.next(true);
    let clienteCrm: ProspectoCRM;
    let cliente: TbQoCliente;
    this.crm.findClienteByCedulaCRM(cedula).subscribe((data: any) => {
      if (clienteCrm = data.list ? null : data.list[0]) {
        cliente = new TbQoCliente();
        cliente.primerNombre = clienteCrm.firstName;
        cliente.cedulaCliente = clienteCrm.cedulaC;
        cliente.telefonoFijo = clienteCrm.phoneHome;
        cliente.telefonoMovil = clienteCrm.phoneMobile;
        cliente.telefonoAdicional = clienteCrm.phoneOther;
        cliente.telefonoTrabajo = clienteCrm.phoneWork;
        cliente.email = clienteCrm.emailAddress;
      } else {
        console.log("Error en la consulta de Prospecto de CRM por lo siguiente: ");
        console.log("Prospecto de CRM --> data: ", data);
        this.buscarEnEquifax(cedula);
      }
      this.loadingSubject.next(false);
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
   */
  private buscarEnEquifax(cedula: string) {
    this.loadingSubject.next(true);
    let clienteInt: PersonaCalculadora;
    let cliente: TbQoCliente;
    const consulta = new PersonaConsulta(cedula);
    this.ing.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {
      if (clienteInt = (data.entidad.datoscliente) ? null : data.entidad.datoscliente) {
        cliente.fechaNacimiento = clienteInt.fechanacimiento;
        cliente.nacionalidad = (clienteInt.nacionalidad === "EC") ? "ECUADOR" : null;
        cliente.email = clienteInt.correoelectronico;
        cliente.relacionDependencia = (clienteInt.relaciondependencia === "N") ? "NO" : (clienteInt.relaciondependencia === "S") ? "SI" : null;
        cliente.cargo = clienteInt.cargo;
        cliente.profesion = clienteInt.profesion;
        cliente.cargasFamiliares = clienteInt.cargasfamiliares;
        cliente.cedulaCliente = clienteInt.identificacion.toString();
        this.guardarCliente(cliente);
      } else {
        console.log("Error en la consulta de Persona en Equifax por lo siguiente: ");
        console.log("Cliente en Equifax --> identificacion: ", data.entidad.identificacion);
        console.log("Cliente en Equifax --> codigoError: ", data.entidad.codigoError);
        console.log("Cliente en Equifax --> mensaje: ", data.entidad.mensaje);
        console.log("Cliente en Equifax --> ejecucion: ", data.entidad.ejecucion);
        this.sinNotSer.setNotice('CLIENTE NO ENCONTRADO', 'error');
      }
      this.loadingSubject.next(false);
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cliente TbQoCliente
  */
  private guardarProspectoEnCrm(cliente: TbQoCliente) {
    this.loadingSubject.next(true);
    const prospecto = new GuardarProspectoCRM();
    prospecto.cedulaC = cliente.cedulaCliente;
    prospecto.firstName = cliente.primerNombre;
    prospecto.phoneHome = cliente.telefonoFijo;
    prospecto.phoneMobile = cliente.telefonoMovil;
    prospecto.leadSourceDescription = 'GESTION QUSKI';
    prospecto.emailAddress = cliente.email;
    prospecto.emailAddressCaps = cliente.email.toUpperCase();
    this.crm.guardarProspectoCRM(prospecto).subscribe((data: any) => {
      data.entidades ? console.log("Guardado en CRM") : this.sinNotSer.setNotice('ERROR GUARDANDO EN CRM', 'error');
      this.loadingSubject.next(false);
    }, error => {
      this.capturaError(error);
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cliente TbQoCliente
  */
  private guardarCliente(cliente: TbQoCliente) {
    this.loadingSubject.next(true);
    let error: boolean;
    this.cli.persistEntity(cliente).subscribe((data: any) => {
      if (data.entidad) {
        console.log("Cliente Guardado en Core");
        cliente = data.entidad;
        const negociacion : TbQoNegociacion = new TbQoNegociacion(cliente.id, this.usuario);
        this.neg.persistEntity(negociacion).subscribe((data:any) =>{
          if(data.entidad){
            console.log("Negociacion Guardado en Core");
            this.entidadNegociacion = data.entidad;
            this.guardarProspectoEnCrm(this.entidadNegociacion.tbQoCliente);
            this.cargarValoresBusquedayCliente(this.entidadNegociacion.tbQoCliente);
            this.consultarExcepcionesDeClienteEnBre(this.entidadNegociacion.tbQoCliente.cedulaCliente);
          }
        },error=>{this.capturaError(error)});
      } else {
        this.entidadNegociacion = null;
        this.sinNotSer.setNotice('ERROR GUARDANDO CLIENTE EN CORE INTERNO', 'error');
      }
      this.loadingSubject.next(false);
    }, error => {
      this.capturaError(error);
    });
  }
  /** ********************************************* @CARGAR ********************* **/
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cliente TbQoCliente
   */
  private cargarValoresBusquedayCliente(cliente: TbQoCliente) {
    this.loadingSubject.next(true);
    this.cargarVariablesYRiesgo(cliente.cedulaCliente);
    this.identificacion.setValue(cliente.cedulaCliente);
    this.nombresCompletos.setValue(cliente.primerNombre + ' ' + cliente.segundoNombre + ' ' + cliente.apellidoPaterno + ' ' + cliente.apellidoMaterno);
    this.nacionalidad.setValue(cliente.nacionalidad);
    this.movil.setValue(cliente.telefonoMovil);
    this.telefonoDomicilio.setValue(cliente.telefonoFijo);
    this.email.setValue(cliente.email);
    this.fechaDeNacimiento.setValue(cliente.fechaNacimiento);
    this.edad.setValue('');

    this.sinNotSer.setNotice('CLIENTE ENCONTRADO',"success");
    this.loadingSubject.next(false); 
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param tasaciones Array<TbQoTasacion>
   */
  public cargarTablaTasacion(tasaciones: Array<TbQoTasacion>) {
    this.dataSourceTasacion.data = tasaciones; 
  }
  /** ********************************************* @POPUP ********************* **/
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
  */
  private abrirPopupDeAutorizacionYConsultaCliente(cedula: string): any {
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: cedula
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      if (respuesta) {
        this.buscarEnCrmYEquifax(cedula);
      } else {
        this.sinNotSer.setNotice('BUSQUEDA CANCELADA', 'error');
        this.limpiarCamposBusqueda();
        this.entidadNegociacion = null;
      }
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
  public abrirSalirGestion(data: any) {
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "auto-max",
      height: "auto-max",
      data: data
    });
    dialogRef.afterClosed().subscribe(r => {
      this.router.navigate(['dashboard', ""]);
    });
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
  */
  public abrirPopupExcepciones(data: DataInjectExcepciones = null){
    if(data == null){
      data = new DataInjectExcepciones(null, this.entidadNegociacion.id);
      data.isCobertura = true;
    }
    const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
      width: '600px',
      height: 'auto',
      data: data
    });
    dialogRefGuardar.afterClosed().subscribe((result: TbQoExcepcione) => {
      console.log('envio de RESP ' + JSON.stringify(result) + ' typeof respuesta ' + typeof (result));
      if (result) {
        this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion', null,'EXCEPCION SOLICITADA');
      } else {
        if(data.isCobertura){
          this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'error');
        }else{
          this.salirDeGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION', this.entidadNegociacion.id, 'NEGOCIACION CANCELADA'); 
        }
      }
    });
  }
  
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @param mensaje Mensaje del componente
  */
  private salirDeGestion(dataMensaje: string, idNegociacion?: number, dataTitulo?:string) {
    let data = {
      mensaje:dataMensaje,
      titulo: dataTitulo? dataTitulo: null
    }
    if(idNegociacion){
      this.neg.cancelarNegociacion(idNegociacion).subscribe((data: any)=>{
        if(data.entidad){
          this.abrirSalirGestion(data);
        }else{
          this.sinNotSer.setNotice("Error cancelando la negociacion.", 'error')
        }
      },error =>{
        this.capturaError(error);
        this.sinNotSer.setNotice("reintentando cerrar negoacion");
      });
    } else {
      this.abrirSalirGestion(data);
    }
  }
  private capturaError(error:any){
    if (error.error) {
      if (error.error.codError) {
        this.sinNotSer.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
      } else {
        this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
      }
    } else if (error.statusText && error.status == 401) {
      this.dialog.open(AuthDialogComponent, {
        data: {
          mensaje: "Error " + error.statusText + " - " + error.message
        }
      });
    } else {
      this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
    }
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
  */
  private limpiarCamposBusqueda() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
  }
   /**
   * @author  Developer Twelve - Jeroham Cadenas
  */
 private limpiarCamposCliente() {
  Object.keys(this.formDatosCliente.controls).forEach((name) => {
    const control = this.formDatosCliente.controls[name];
    control.reset();
    control.setErrors(null);
    control.setValue(null);
  });
  }
  /**
    * @author  Developer Twelve - Jeroham Cadenas
    */
  private limpiarCamposTasacion() {
    Object.keys(this.formTasacion.controls).forEach((name) => {
      const control = this.formTasacion.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
  }
  getErrorMessage(pfield: string) {
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


    if (pfield && pfield === 'movil') {
      const input = this.movil;
      return input.hasError('required')? errorRequerido: input.hasError('pattern')? errorNumero: input.hasError('maxlength')? errorLogitudExedida: input.hasError('minlength')? errorInsuficiente: '';
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
          this.capturaError(error);
        }
      );
  }
  /** ********************************************* @VARIABLES_CREDITICIAS  ********************* **/
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
   */
  public cargarVariablesYRiesgo(cedula: string) {
    this.loadingSubject.next(true);
    this.dataPopup = new DataPopup();
    this.dataPopup.isCalculadora = true;
    this.dataPopup.cedula = cedula;
  }
  /**
   * @author  Developer Twelve - Jeroham Cadenas
   * @param   cedula string
   */
  public traerEntidadesVariables(event: Array<TbQoVariablesCrediticia>) {
    event.forEach(e => {
      e.tbQoNegociacion = new TbQoNegociacion();
      
    });
    this.loadingSubject.next(false);

  }

  /** ********************************************* @CATALOGOS ********************* **/
  private obtenerCatalogosCore() {
    this.par.findByNombreTipoOrdered("", "PUB", "Y").subscribe((data: any) => {
      this.catPublicidad = (data && data.entidades) ? data.entidades : "CATALOGO NO CARGADO"
      if (data && data.entidades) {
        this.catPublicidad = data.entidades;
      }
    }, error => {
      this.capturaError(error);
      
    });
  }
  /**
   * obtenerCatalogosSoftbank
   */
  private obtenerCatalogosSoftbank() {
    this.loadingSubject.next(true);
    this.sof.consultarTipoOroCS().subscribe( (data: any)=>{
      this.catTipoOro = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.sof.consultarTipoJoyaCS().subscribe( (data: any)=>{
        this.catTipoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
        this.sof.consultarEstadoJoyaCS().subscribe( (data: any)=>{
          this.catEstadoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.loadingSubject.next(false); 
        });
      });
    });
  }
}
