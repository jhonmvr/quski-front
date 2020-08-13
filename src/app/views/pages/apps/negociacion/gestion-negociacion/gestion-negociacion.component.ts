import { ClienteCRM } from './../../../../../core/model/quski/ClienteCRM';
import { TbQoCliente } from './../../../../../core/model/quski/TbQoCliente';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { SolicitudAutorizacionDialogComponent } from './../../../../partials/custom/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
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
import { TbQoCotizador } from './../../../../../core/model/quski/TbQoCotizador';
import { PersonaCalculadora } from './../../../../../core/model/calculadora/PersonaCalculadora';
import { TbQoVariablesCrediticia } from './../../../../../core/model/quski/TbQoVariablesCrediticia';
import { TbQoRiesgoAcumulado } from './../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { CotizacionService } from './../../../../../core/services/quski/cotizacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneroEnum } from './../../../../../core/enum/GeneroEnum';
import { PersonaConsulta } from './../../../../../core/model/calculadora/personaConsulta';
import { IntegracionService } from './../../../../../core/services/quski/integracion.service';
import { VariablesCrediticiasService } from './../../../../../core/services/quski/variablesCrediticias.service';
import { DataPopup } from './../../../../../core/model/wrapper/dataPopup';


@Component({
  selector: 'kt-gestion-negociacion',
  templateUrl: './gestion-negociacion.component.html',
  styleUrls: ['./gestion-negociacion.component.scss']
})
export class GestionNegociacionComponent implements OnInit {
  // VARIABLES ESTANDAR
  public dataPopup: DataPopup;
  public loading;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  // ENTIDADES
  private entidadProspectoCRM: ProspectoCRM;
  private entidadClientesoftbank: ClienteSoftbank;
  private entidadCliente: TbQoCliente;
  private entidadCotizador: TbQoCotizador;
  private entidadPersonaCalculadora: PersonaCalculadora;
  private entidadesVariablesCrediticias: Array<TbQoVariablesCrediticia>;
  private entidadesRiesgoAcumulados: Array<TbQoRiesgoAcumulado>;
  // CATALOGOS
  private catEducacion: Array<any>;
  public formDatosCliente: FormGroup = new FormGroup({});

  //ENUMS 
  listPublicidad = []; //= Object.keys(PulicidadEnum);
  // ENUMERADORES
    // VARIABLES DE TRACKING
    public horaInicio      : any;
    public horaAsignacion  : any;
    public horaAtencion    : any = null;
    public horaFinal       : any;

  
  clienteCRM: ClienteCRM;
  public idCliente: TbQoCliente;


  ///Validaciones formulario cliente 

  public formCliente: FormGroup = new FormGroup({});
  public formBusqueda: FormGroup = new FormGroup({});
  public formTasacion: FormGroup = new FormGroup({});
  public publicidad = new FormControl( '',[Validators.required]);
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public fechaDeNacimiento = new FormControl('', []);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', []);
  public aprobacionMupi = new FormControl('', []);
  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  roomsFilter: any;
///Columnas de las tablas 
displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
displayedColumnsRiesgoAcumulado = ['NumeroOperacion', 'TipoOferta', 'Vencimiento', 'Cuotas', 
  'CapitaInicial', 'SaldoCapital', 'Plazo', 'FechaAprobacion', 'FechaFinalCredito', 
  'DiasMora', 'ValorCuota', 'MotivoBloqueo', 'TotalCredito', 'CoberturaAnterior', 
  'CoverturaVigente', 'DeudaTotal','TotalSaldo','RiesgoTotalCliente'];
  displayedColumnsTasacion = ['Accion', 'N', 'NumeroPiezas', 'TipoOro', 'TipoJoya', 'Estado', 'Descripcion'
  , 'PesoBruto', 'DescuentoPiedra', 'DescuentoSuelda', 'PesoNeto', 'ValorAvaluo'
  , 'ValorComercial', 'ValorRealizacion', 'ValorOro'];
  displayedColumnsOpcionesCredito = ['Accion', 'Plazo', 'TipoOperacion', 'PeriodicidadPlazo', 'TipoOferta', 'MontoPreAprobado', 'ValorCouta'
  , 'ARecibirCliente', 'APagarPorCliente', 'ValorAPagarNeto', 'ValoresCreditoAnterior', 'TotalCostosNuevaOpreacion'
  , 'CostoCustodia', 'FormaPagoCustodia', 'CostoTransporte', 'FormaPagoTransporte', 'CostoValoracion', 'FormaPagoValoracion', 'CostoTasacion',
   'FormaPagoTasacion', 'CostoSeguro', 'FormaPagoSeguro', 'CostoResguardo', 'FormaPagoResguardo', 'Solca', 'FormaPagoSolca', 'SaldoCapitaOpAnt'
   , 'SaldoInteresOpAnt', 'FormaPagoInteres', 'SaldoMoraOpAnt', 'FormaPagoMora', 'GastosDeCobranzaOpAnt', 'FormaPagoGastoCobranza', 'CustodiaVencidaOptAnt', 
   'FormaPagoCustodiaVencida', 'AbonoCapitaOpAnterior', 'FormaPagoAbonoCapital', 'MontoDesembolsoBallon', 'ProcentajeFlujoPlaneado'];
   displayedColumnsOpt = new MatTableDataSource<any>();
  public pageSize = 5;
  public currentPage = 0;ic
  public totalSize = 0;
  public totalResults = 0;
 p = new Page ();


 ////CONSTRUCTOR DE LA CLASE 

 constructor(
  private sof: SoftbankService,
  private cot: CotizacionService,
  private cli: ClienteService, 
  private ing: IntegracionService,
  private vac: VariablesCrediticiasService,
  private route : ActivatedRoute,
  private router: Router,
  private sinNoticeService: ReNoticeService, 
  
  private sp: ParametroService, 
  private tra : TrackingService,
  private crm: CRMService,
  public dialog: MatDialog, 
  private noticeService: ReNoticeService, 
  private subheaderService: SubheaderService,
  @Inject(MAT_DIALOG_DATA) private data: string
  ) { 

    this.formBusqueda.addControl("identificacion", this.identificacion);
    this.formCliente.addControl("fechaNacimiento", this.fechaDeNacimiento);
    this.formCliente.addControl("nombresCompletos", this.nombresCompletos);
    this.formCliente.addControl("edad", this.edad);
    this.formCliente.addControl("nacionalidad", new FormControl('', Validators.required));
    this.formCliente.addControl("movil", this.movil);
    this.formCliente.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formCliente.addControl("email", this.email);
    this.formCliente.addControl("campania", this.campania);
    this.formCliente.addControl("publicidad", this.publicidad);
    this.formCliente.addControl("aprobacionMupi" , this.aprobacionMupi);


    
}


  ngOnInit() {
    this.consultaCatalogos();
    this.getPublicidades();
    this.loading = this.loadingSubject.asObservable();
    this.subheaderService.setTitle('Negociación');
    
  }
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
  inicioDeFlujo() {
    // this.capturaDatosTraking();
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.id) {
        this.cot.getEntity(json.params.id).subscribe( (data : any) =>{
          if (data.entidad) {
            this.entidadCotizador = data.entidad;
            //this.capturaHoraInicio();
            // @todo
            this.buscarCliente( this.entidadCotizador.tbQoCliente.cedulaCliente );
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
  /**
   * busquedaSoftbank
   */
  public busquedaSoftbank(cedula: string) {
    let consulta = new ConsultaCliente();
    consulta.identificacion = cedula; 
    this.loadingSubject.next(true);
    this.sof.consultarClienteCS( consulta ).subscribe(( data: any )=>{
      if(!data.existeError && data.identificacion != null){
      }else{
        this.entidadClientesoftbank = null;
      }
    });
  }
/*   public busquedaCliente(){
    this.busquedaSofftbank();
  } */
  /**
   * 
   */
  public buscarCliente( cedula: string ) {
    if (cedula != null ) {
      
    } else {
      if (this.identificacion.value) { 
        this.loadingSubject.next(true);
        let consulta = new ConsultaCliente();
        consulta.identificacion = this.identificacion.value;
        
        this.sof.consultarClienteCS(consulta).subscribe((data: any) => {
          if (data.idCliente != 0) {
            this.entidadClientesoftbank = new ClienteSoftbank();
            this.entidadClientesoftbank = data;
            this.inicioDeGestion(this.entidadClientesoftbank.identificacion);

          } else {
            // this.solicitarAutorizacion(consulta.identificacion); 
            // @todo
          }
        });
      } else {
        this.sinNoticeService.setNotice('PRO FAVOR INGRESE UNA CEDULA VALIDA', 'error');
      }
    }
    
  }
  private inicioDeGestion(cedula: string) {
    this.cli.findClienteByIdentificacion(cedula).subscribe((data: any) => {
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
    this.cli.persistEntity(cliente).subscribe((data: any) => {
      if (data.entidad) {
        this.entidadCliente = data.entidad;
        let personaConsulta = new PersonaConsulta();
        personaConsulta.identificacion = this.entidadCliente.cedulaCliente;
        this.loadingSubject.next(false);
        this.llamarEquifax(personaConsulta);
      } else {
        this.loadingSubject.next(false);

        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CLIENTE', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
        this.loadingSubject.next(false);

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
        this.setearValores();
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



































  ///Validaciones de errores
getErrorMessage(pfield: string) {
  const errorRequerido = 'Ingresar valores';
  const errorNumero = 'Ingreso solo numeros';
  let maximo = "El maximo de caracteres es: ";
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
    const input = this.formCliente.get('telefonoDomicilio');
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
    this.sp.findByNombreTipoOrdered("", "PUB", "Y").subscribe((wrapper: any) => {
      //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        this.listPublicidad = wrapper.entidades;
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice("Error al cargar parametros de publicidad", 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: "Error " + error.statusText + " - " + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice("Error al cargar publicidades", 'error');
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
      this.sinNoticeService.setNotice(
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
    this.sp
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
            this.sinNoticeService.setNotice(b.msgError, "error");
          } else {
            this.sinNoticeService.setNotice(
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
          this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE CALCULADORA QUSKI", 'success');
        } else {
              this.sinNoticeService.setNotice("USUARIO NO REGISTRADO ", 'error');
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
    this.sinNoticeService.setNotice("REGISTRO CORRECTO DEL PROSPECTO", 'success');
    this.cs.guardarProspectoCRM(this.clienteCRM).subscribe((data: any) => {
    console.log("datos de envio: " + JSON.stringify(this.clienteCRM));
  }, error => {
    console.log("error al guardar el cliente en el CRM: " + error);
    console.log("------------manageurl errorsss : " + JSON.stringify(error));
    this.sinNoticeService.setNotice("NO SE PUEDE GUARDAR", 'error');
    //  this.loadingSubject.next(false);
  });
}  
  else{
    this.sinNoticeService.setNotice("DEBE COMPLETAR LA INFORMACION ", 'error');
  }

  } */

}
