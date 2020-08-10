import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatStepper } from '@angular/material';
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
import { EstadoQuskiEnum } from '../../../../../core/enum/EstadoQuskiEnum';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
import { TbQoTipoOro } from '../../../../..//core/model/quski/TbQoTipoOro';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { ProcesoEnum } from '../../../../../core/enum/ProcesoEnum';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';
import { SituacionTrackingEnum } from '../../../../../core/enum/SituacionTrackingEnum';
import { ActividadEnum } from '../../../../../core/enum/ActividadEnum';
import { UsuarioEnum } from '../../../../../core/enum/UsuarioEnum';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { Router } from '@angular/router';
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
import { OpcionesDeCredito } from '../../../../../core/model/calculadora/opcionesDeCredito';
import { DetalleCreditoService } from '../../../../../core/services/quski/detalle-credito.service';
import { TbQoDetalleCredito } from '../../../../../core/model/quski/TbQoDetalleCredito';

@Component({
  selector: 'kt-list-cotizar',
  templateUrl: './list-cotizar.component.html',
  styleUrls: ['./list-cotizar.component.scss']
})

export class ListCotizarComponent implements OnInit {
  // ENTIDADES
  private entidadProspectoCRM: ProspectoCRM = null;
  private entidadClientesoftbank: ClienteSoftbank = null;
  public entidadCliente: TbQoCliente = null;
  private entidadCotizador: TbQoCotizador = null;
  private entidadPersonaCalculadora: PersonaCalculadora = null;
  private entidadesOpcionesCreditos: Array<OpcionesDeCredito> = null;
  private entidadesVariablesCrediticias: Array<TbQoVariablesCrediticia> = null;
  private entidadesDetalleCreditos: Array<TbQoDetalleCredito> = null;
  private entidadesRiesgoAcumulados: Array<TbQoRiesgoAcumulado> = null;
    public entidadPrecioOro = new TbQoPrecioOro();
  // CATALOGOS SOFTBANK
  private catEducacion: Array<any>;
  // CATALOGOS QUSKI
  public catTipoOro: Array<TbQoTipoOro>;
  // LISTA PARAMETROS //todo: Cambiar a softbank cuando se tengan  los servicios
  listPublicidad = []; // PARA CUANDO NO SE CARGA DE UN PARAMETRO= Object.keys(PulicidadEnum);
  public listGradosInteres: Array<any>;
  public listMotivoDesestimiento: Array<any>;
  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  private elementPrecioOro: TbQoPrecioOro = null;
  private contadorBusqueda: number;
  public contadorPrecioOro: number;
  private fechaSeleccionada: any;
  public date;
  public dataPopup: DataPopup;
  public consultaOferta: ConsultaOferta;
  //OBSERVABLES
  disableMensajeBloqueo;
  disableMensajeBloqueoSubject = new BehaviorSubject<boolean>(false);

  // FORM BUSQUEDA
  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  // FORM CLIENTE
  public formCliente: FormGroup = new FormGroup({});
  public fpublicidad = new FormControl('', [Validators.required]);
  public fechaNacimiento = new FormControl('', [Validators.required]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', [Validators.required]);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public correoElectronico = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public aprobacionMupi = new FormControl('', [Validators.required]);
  // FORM VARIABLES CREDITICIAS
  public formVariables: FormGroup = new FormGroup({});
  public bloqueoPrecioOro = new FormControl('', [Validators.required]);

  // FORM OPCIONES DE CREDITO
  public formOpciones: FormGroup = new FormGroup({});
  public fgradoInteres = new FormControl('', [Validators.required]);
  public fmotivoDesestimiento = new FormControl('', [Validators.required]);
  // FORM PRECIO ORO
  public formPrecioOro: FormGroup = new FormGroup({});
  public tipoOro = new FormControl('', [Validators.required]);
  public pesoNetoEstimado = new FormControl('', [Validators.required, ValidateDecimal]);
  public precio = new FormControl('', [Validators.required, ValidateDecimal]);
  public mensajeBloqueo = new FormControl('',);
  public mensaje: any;

  // VARIABLES DE TRACKING
  public horaInicioProspeccion: Date;
  public horaAsignacionProspeccion: Date = null;
  public horaAtencionProspeccion: Date;
  public horaFinalProspeccion: Date = null;
  public procesoProspeccion: string;
  public horaInicioTasacion: Date;
  public horaAsignacionTasacion: Date;
  public horaAtencionTasacion: Date;
  public horaFinalTasacion: Date;
  public actividad: string;
  public procesoTasacion: string;
  // TABLA PRECIO ORO
  displayedColumnsPrecioOro = ['accion', 'N', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  dataSourcePrecioOro = new MatTableDataSource<TbQoPrecioOro>();

  constructor(
    private sof: SoftbankService,
    private cot: CotizacionService,
    private cli: ClienteService,
    private tip: TipoOroService,
    private ing: IntegracionService,
    private vac: VariablesCrediticiasService,
    private det: DetalleCreditoService,
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
    this.formBusqueda.addControl('cedula', this.identificacion);
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
    // FORM VARIABLES CREDITICIAS 
    this.formVariables.addControl('bloqueoPrecioOro  ', this.bloqueoPrecioOro);
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
    this.capturaHoraInicio("PROSPECCION");
    this.contadorPrecioOro = null;
    this.contadorBusqueda = null;
    this.loading = this.loadingSubject.asObservable();
    this.disableMensajeBloqueo = this.disableMensajeBloqueoSubject.asObservable();
  }
  /**
   * ******************************** @INCIO
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
  /********************************************* @BUSQUEDA *********************    */

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
    if (this.horaAsignacionProspeccion == null) {
      this.capturaHoraAsignacion("PROSPECCION");
    }
    if (this.identificacion.value != '' && this.formBusqueda.valid) {
      if (this.contadorBusqueda == null) {
        this.busquedaSoftbank(this.identificacion.value);
      } else {
        if (this.contadorBusqueda > 1) {
          if (this.entidadPersonaCalculadora != null) {
            this.guardarClienteBusqueda(this.entidadProspectoCRM, this.entidadPersonaCalculadora, null);
            this.sinNoticeService.setNotice('BUSQUEDA EXITOSA, VALORES CARGADOS', 'success');
          } else {
            this.sinNoticeService.setNotice('ERROR EN BUSQUEDA DE CLIENTE', 'error');
          }
        } else {
          if (this.entidadClientesoftbank != null) {
            this.guardarClienteBusqueda(null, null, this.entidadClientesoftbank);

          } else {
            this.solicitarAutorizacion(this.identificacion.value);
          }

        }
      }
    } else {
      this.sinNoticeService.setNotice('INGRESE UN NUMERO DE CEDULA', 'error');
    }
  }
  private busquedaEnCRM(cedula: string) {
    this.loadingSubject.next(true);
    this.crm.findClienteByCedulaCRM(cedula).subscribe((data: any) => {

      if (data && data.list) {

        this.entidadProspectoCRM = data.list[0];
      } else {
        this.entidadProspectoCRM = null;
      }
      this.loadingSubject.next(false);
      this.busquedaEquifax(cedula);
    });
  }
  private busquedaEquifax(cedula: string) {
    this.loadingSubject.next(true);
    const consulta = new PersonaConsulta();
    consulta.identificacion = cedula;
    this.ing.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {
      if (data.entidad.datoscliente != null) {
        this.contadorBusqueda++;
        this.entidadPersonaCalculadora = data.entidad.datoscliente;
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
    this.fechaNacimiento.setValue(this.entidadCliente.fechaNacimiento);
    this.capturaHoraAtencion("PROSPECCION");
    this.loadingSubject.next(false);
    // INPUT VARIABLES CREDITICIAS
    this.dataPopup = new DataPopup();
    this.dataPopup.cedula = this.entidadCliente.cedulaCliente;
    this.dataPopup.isCalculadora = true;
  }
  private guardarClienteBusqueda(crm: ProspectoCRM, equifax: PersonaCalculadora, softbank: ClienteSoftbank) {
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
      if (softbank.telefonos != null) {
        softbank.telefonos.forEach(element => {
          if (element.codigoTipoTelefono === 'M') {
            cliente.telefonoMovil = element.numero;
          }


        });
      }
    } else {
      if (crm != null) {
        // setea crm y equifax
        cliente.telefonoAdicional = crm.phoneOther;

        if (crm.cedulaC != null) {
          cliente.cedulaCliente = crm.cedulaC;
        }

        cliente.fechaNacimiento = equifax.fechanacimiento;
        cliente.nacionalidad = equifax.nacionalidad;
        cliente.genero = equifax.genero;
        cliente.campania = equifax.codigocampania.toString();
        if (crm.emailAddress != null && crm.emailAddress !== '') {
          cliente.email = crm.emailAddress;
        } else {
          if (equifax.correoelectronico != null && equifax.correoelectronico !== '') {
            cliente.email = equifax.correoelectronico;
          }
        }

        if (crm.phoneHome != null && crm.phoneHome !== '') {
          cliente.telefonoFijo = crm.phoneHome;
        } else {
          if (equifax.telefonofijo != null && equifax.telefonofijo !== '') {
            cliente.telefonoFijo = equifax.telefonofijo;
          }

        }


        if (crm.phoneMobile != null && crm.phoneMobile !== '') {
          cliente.telefonoMovil = crm.phoneMobile;
        } else {
          if (equifax.telefonomovil != null && equifax.telefonomovil !== '') {
            cliente.telefonoMovil = equifax.telefonomovil;
          }
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
        cliente.cedulaCliente = equifax.identificacion.toString();
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
  /********************************************* @PRECIOORO *********************    */
  setPrecioOro(event) {
    this.capturaHoraAtencion("TASACION");
    if (this.entidadCliente != null) {
      this.loadingSubject.next(true);
      const consulta = new ConsultaOferta();
      consulta.identificacionCliente = this.entidadCliente.cedulaCliente;
      consulta.tipoOroKilataje = event.value.quilate;
      consulta.fechaNacimiento = this.entidadCliente.fechaNacimiento;
      this.ing.getInformacionOferta(consulta).subscribe((data: any) => {
        if (data.entidad.simularResult && data.entidad.simularResult.xmlGarantias.garantias.garantia) {
          this.precio.setValue(data.entidad.simularResult.xmlGarantias.garantias.garantia.valorOro);
          this.loadingSubject.next(false);
        } else {
          this.loadingSubject.next(false);
          this.sinNoticeService.setNotice('ERROR AL CARGAR EL PRECIO DE TIPO DE ORO', 'error');
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
      });
    } else {
      this.limpiarCamposPrecioOro();
      this.sinNoticeService.setNotice('POR FAVOR CONSULTE PRIMERO EL CLIENTE', 'error');
    }
  }
  verPrecio() {
    if(this.horaFinalProspeccion == null){
      this.capturaHoraFinal("PROSPECCION");
      this.capturaHoraInicio("TASACION");
      this.capturaHoraAsignacion("TASACION");
      this.bloqueoPrecioOro.setValue(true);
    }
  }
  nuevoPrecioOro() {
    if (this.formPrecioOro.valid) {
<<<<<<< HEAD
      this.precioOro = new TbQoPrecioOro();
      
      this.totalPeso = 0;
      this.totalPrecio = 0;
      this.tipoOros = this.tipoOro.value;
      if (this.precioOroLocal) {
        console.log('==> precio oro local  ' + this.precioOroLocal);
        this.precioOro = this.precioOroLocal;
=======
      this.loadingSubject.next(true);
      const precioOro = new TbQoPrecioOro();
      precioOro.precio = this.precio.value;
      precioOro.pesoNetoEstimado = this.pesoNetoEstimado.value;
      precioOro.tbQoCotizador.id = this.entidadCotizador.id;
      precioOro.tbQoTipoOro = this.tipoOro.value;
      if(this.elementPrecioOro != null ){
        precioOro.id = this.elementPrecioOro.id;
        const index = this.dataSourcePrecioOro.data.indexOf(this.elementPrecioOro);
        this.dataSourcePrecioOro.data.splice(index, 1);
        this.elementPrecioOro = null;
>>>>>>> 84c4abe387b8fa7400a34f399e700e6566d96f24
      }
      this.pre.persistEntity(precioOro).subscribe((data: any) => {
        if (data && data.entidad) {
          const dataC = this.dataSourcePrecioOro.data;
          dataC.push(data.entidad);
          this.dataSourcePrecioOro.data = dataC;   
          this.contadorPrecioOro++;
          this.sinNoticeService.setNotice('SE GUARDO EL PRECIO ORO', 'success');
        } else{
          this.sinNoticeService.setNotice('ERROR AL GUARDAR PRECIO ORO', 'success');
        }
        this.loadingSubject.next(false);
        this.limpiarCamposPrecioOro();
        });
    } else {
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
    }
  }
  editar(element: TbQoPrecioOro) {
    this.tipoOro.setValue(element.tbQoTipoOro);
    this.precio.setValue(element.precio);
    this.pesoNetoEstimado.setValue(element.pesoNetoEstimado);
    this.elementPrecioOro = element;
  }
  eliminarPrecioOro(element: TbQoPrecioOro) {    
    this.loadingSubject.next(true);
    this.pre.eliminarPrecioOro(element.id).subscribe((data: any) => {
      if (data.entidad) {
        const index = this.dataSourcePrecioOro.data.indexOf(element);
        this.dataSourcePrecioOro.data.splice(index, 1);
        const dataC = this.dataSourcePrecioOro.data;
        this.dataSourcePrecioOro.data = dataC
        if(this.dataSourcePrecioOro.data.length < 1){
          this.contadorPrecioOro = null;
        }
      } else {
        this.sinNoticeService.setNotice('ERROR DESCONOCIDO', 'error');
      }
      this.loadingSubject.next(false);
    }, error => {
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR DESCONOCIDO', 'error');
      }
      this.loadingSubject.next(false);
    });
  }
  simular() {
    this.consultaOferta = new ConsultaOferta();
    this.consultaOferta.identificacionCliente = this.entidadCliente.cedulaCliente;
    this.consultaOferta.precioOro = 0;
    this.consultaOferta.pesoGr = 0;
    this.consultaOferta.pesoNeto = 0;
    this.dataSourcePrecioOro.data.forEach(e =>{
      console.log(" dataSourcePrecioOro pesoGr ---> ", this.consultaOferta.pesoGr);
      console.log(" dataSourcePrecioOro pesoNeto ---> ", this.consultaOferta.pesoNeto);
      console.log(" dataSourcePrecioOro precioOro ---> ", this.consultaOferta.precioOro);

      this.consultaOferta.pesoGr += parseFloat(e.pesoNetoEstimado);
      this.consultaOferta.pesoNeto +=parseFloat(e.pesoNetoEstimado);
      this.consultaOferta.precioOro += parseFloat(e.precio); 
      this.consultaOferta.tipoOroKilataje = e.tbQoTipoOro.quilate;
      
      console.log(" DATOS pesoGr ---> ", this.consultaOferta.pesoGr);
      console.log(" DATOS pesoNeto ---> ", this.consultaOferta.pesoNeto);
      console.log(" DATOS precioOro ---> ", this.consultaOferta.precioOro);
    });
    this.consultaOferta.fechaNacimiento = this.entidadCliente.fechaNacimiento;
  }
  /********************************************  @TRACKING  ***********************************************************/
  /**
* @author Jeroham Cadenas - Developer Twelve
* @description Captura la hora de inicio de Tracking
*/
  private capturaHoraInicio(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        if (etapa == "PROSPECCION") {
          this.horaInicioProspeccion = hora.entidad;
        }
        if (etapa == "TASACION") {
          this.horaInicioTasacion = hora.entidad;
        }
      }
    });
  }
  private capturaHoraAsignacion(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        if (etapa == "PROSPECCION") {
          this.horaAsignacionProspeccion = hora.entidad;
        }
        if (etapa == "TASACION") {
          this.horaAsignacionTasacion = hora.entidad;
        }
      }
    });
  }
  private capturaHoraAtencion(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        if (etapa == "PROSPECCION") {
          this.horaAtencionProspeccion = hora.entidad;
        }
        if (etapa == "TASACION") {
          this.horaAtencionTasacion = hora.entidad;
        }
      }
    });
  }
  private capturaHoraFinal(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        if (etapa == "PROSPECCION") {
          this.horaFinalProspeccion = hora.entidad;
          this.registroProspeccion(this.entidadCotizador.id, this.horaInicioProspeccion, this.horaAsignacionProspeccion, this.horaAtencionProspeccion, this.horaFinalProspeccion);
        }
        if (etapa == "TASACION") {
          this.horaFinalTasacion = hora.entidad;
          this.registroTasación(this.entidadCotizador.id, this.horaInicioTasacion, this.horaAsignacionTasacion, this.horaAtencionTasacion, this.horaFinalTasacion);
        }
      }
    });
  }
  private capturaDatosTraking() {
    this.par.findByNombreTipoOrdered("COTIZACION", "ACTIVIDAD", "Y").subscribe((data: any) => {
      if (data.entidades) {
        this.actividad = data.entidades[0].nombre;
        this.par.findByNombreTipoOrdered("PROSPECCION", "PROCESO", "Y").subscribe((data: any) => {
          if (data.entidades) {
            this.procesoProspeccion = data.entidades[0].nombre;
            this.par.findByNombreTipoOrdered("TASACION", "PROCESO", "Y").subscribe((data: any) => {
              if (data.entidades) {
                this.procesoTasacion = data.entidades[0].nombre;
              }
            });
          }
        });
      }
    });
  }
  public registroProspeccion(codigoRegistro: number, fechaInicio: Date, fechaAsignacion: Date, fechaInicioAtencion: Date, fechaFin: Date) {
    const tracking: TbQoTracking = new TbQoTracking();
    this.loadingSubject.next(true);
    tracking.actividad = this.actividad;
    tracking.proceso = this.procesoProspeccion;
    tracking.observacion = '';
    tracking.codigoRegistro = codigoRegistro;
    tracking.situacion = SituacionTrackingEnum.EN_PROCESO; // Por definir
    tracking.usuario = UsuarioEnum.ASESOR; // Modificar al id del asesor
    tracking.fechaInicio = fechaInicio;
    tracking.fechaAsignacion = fechaAsignacion;
    tracking.fechaInicioAtencion = fechaInicioAtencion;
    tracking.fechaFin = fechaFin;
    this.tra.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING', 'error');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING', 'error');
      }
    });

  }
  public registroTasación(codigoRegistro: number, fechaInicio: Date, fechaAsignacion: Date, fechaInicioAtencion: Date, fechaFin: Date) {
    const tracking: TbQoTracking = new TbQoTracking();
    tracking.actividad = this.actividad
    tracking.proceso = this.procesoTasacion
    tracking.observacion = '';
    tracking.codigoRegistro = codigoRegistro;
    tracking.situacion = SituacionTrackingEnum.EN_PROCESO; // Por definir
    tracking.usuario = UsuarioEnum.ASESOR;                 // Modificar al id del asesor
    tracking.fechaInicio = fechaInicio;
    tracking.fechaAsignacion = fechaAsignacion;
    tracking.fechaInicioAtencion = fechaInicioAtencion;
    tracking.fechaFin = fechaFin;
    this.tra.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        console.log(' TRACKING TASACION ------>' + JSON.stringify(data.entidad));
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING', 'error');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING', 'error');
      }
    });
  }
  /********************************************* @FUNCIONALIDAD  ***********************************************************/
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
      const input = this.formBusqueda.get('cedula');
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
  private limpiarCamposPrecioOro() {
    Object.keys(this.formPrecioOro.controls).forEach((name) => {
      const control = this.formPrecioOro.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.reset();
    });
  }
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
          }
          this.loadingSubject.next(false);
        }
      );
  }
  private limpiarCampos() {
    Object.keys(this.formCliente.controls).forEach((name) => {
      const control = this.formCliente.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  /********************************************* @COMBO  ***********************************************************/
  public consultaCatalogos() {
    this.sof.consultarEducacionCS().subscribe((data: any) => {
      if (data.existeError !== true) {
        this.catEducacion = data.catalogo;
        this.loadingSubject.next(false);

      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE SOFTBANK CATALOGO VACIO', 'error');
      }
    });
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
  public getMotivoDesestimiento() {
    this.par.findByNombreTipoOrdered('', 'DESEST', 'Y').subscribe((wrapper: any) => {
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
    this.capturaDatosTraking();

  }
  /******************************************** @EVENT   *********************************************************/
  public traerEntidadesVariables(event: Array<TbQoVariablesCrediticia>) {
    this.guardarVariables(event);
  }
  public traerEntidadesOpciones(event: Array<OpcionesDeCredito>) {
    this.entidadesOpcionesCreditos = new Array<OpcionesDeCredito>();
    this.entidadesOpcionesCreditos = event;
  }
  /******************************************** @GUARDAR  ********************************************************/
  // SIN USAR
  private guardarRiesgoAcumulado(entidades: Array<TbQoRiesgoAcumulado>) {
    entidades.forEach(e => {
      e.tbQoCliente.id = this.entidadCliente.id
    });
    this.rie.persistEntity(entidades).subscribe((data: any) => {
      if (data.entidades) {
        this.entidadesRiesgoAcumulados = data.entidades;
        console.log("Riesgo guardadas -----> ", data.entidades);
      } else {
        console.log(' No se guardaron ---->', data);
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  private guardarVariables(entidades: Array<TbQoVariablesCrediticia>) {
    entidades.forEach(e => {
      e.tbQoCotizador = new TbQoCotizador();
      e.tbQoCotizador.id = this.entidadCotizador.id;
    });
    this.vac.persistEntity(entidades).subscribe((data: any) => {
      if (data.entidades) {
        this.entidadesVariablesCrediticias = new Array<TbQoVariablesCrediticia>();
        this.entidadesVariablesCrediticias = data.entidades;
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO, ERROR DESCONOCIDO', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO, ERROR DESCONOCIDO', 'error');
      }
    });
  }
  public submit(flujo: string) {
    if (this.formCliente.valid) {
      if (this.formOpciones.valid) {
        if (this.entidadCliente != null) {                      // 1re item (setear valores)
          if (this.entidadCotizador != null) {                    // 2do item (setear valores)
            if (this.entidadesOpcionesCreditos != null) {         // 3er item (llamar metodo )
              this.loadingSubject.next(true);
              this.guardado(this.entidadCliente, this.entidadCotizador, this.entidadesOpcionesCreditos);
              if (flujo == "NEGOCIAR") {
                this.router.navigate(['negociacion/gestion-negociacion', this.entidadCotizador.id]);
              } else {
                this.router.navigate(['dashboard']);
              }
            } else {
              this.sinNoticeService.setNotice('ERROR, NO EXISTEN DATOS DE OPCIONES DE CREDITO', 'error');

            }
          } else {
            this.sinNoticeService.setNotice('ERROR, NO EXISTEN DATOS DE COTIZADOR', 'error');
          }
        } else {
          this.sinNoticeService.setNotice('ERROR, NO EXISTEN DATOS DEL CLIENTE', 'error');
        }

      } else {
        this.sinNoticeService.setNotice('INGRESE TODOS LOS CAMPOS DE LA SECCION DE OPCIONES DE CREDITO', 'error');
      }
    } else {
      this.sinNoticeService.setNotice('INGRESE TODOS LOS CAMPOS DE LA SECCION CLIENTE', 'error');
    }


  }
  private guardado(cliente: TbQoCliente, cotizador: TbQoCotizador, opcionesDeCredito: Array<OpcionesDeCredito>) {
    // CLIENTE 
    cliente.primerNombre = this.nombresCompletos.value;
    cliente.campania = this.campania.value;
    cliente.nacionalidad = this.nacionalidad.value;
    cliente.telefonoMovil = this.movil.value;
    cliente.telefonoFijo = this.telefonoDomicilio.value;
    cliente.email = this.correoElectronico.value;
    cliente.fechaNacimiento = this.fechaNacimiento.value;
    cliente.edad = this.edad.value;
    cliente.aprobacionMupi = this.aprobacionMupi.value;
    cliente.cedulaCliente = this.identificacion.value;
    cliente.publicidad = this.fpublicidad.value;
    // COTIZADOR
    cotizador.gradoInteres = this.fgradoInteres.value.valor;
    cotizador.motivoDeDesestimiento = this.fmotivoDesestimiento.value.valor;
    cotizador.tbQoCliente = cliente;
    // DETALLE DE CREDITO
    const listDetalleCredito = new Array<TbQoDetalleCredito>();
    opcionesDeCredito.forEach(e => {
      const dcr = new TbQoDetalleCredito();
      dcr.costoResguardado = e.costoFideicomiso
      dcr.costoSeguro = e.costoSeguro
      dcr.costoCustodia = e.costoCustodia
      dcr.costoNuevaOperacion = e.totalGastosNuevaOperacion
      dcr.costoTasacion = e.costoTasacion
      dcr.costoTransporte = e.costoTransporte
      dcr.costoValoracion = e.costoValoracion
      dcr.montoPreaprobado = e.montoFinanciado
      dcr.periodoPlazo = e.periodoPlazo
      dcr.plazo = e.plazo
      dcr.recibirCliente = e.valorARecibir
      dcr.solca = e.impuestoSolca
      dcr.valorCuota = e.cuota
      dcr.tbQoCotizador = cotizador
      listDetalleCredito.push(dcr);
    });
    this.guardarGestion(listDetalleCredito);
  }
  private guardarGestion(entidades: Array<TbQoDetalleCredito>) {

    this.det.persistEntities(entidades).subscribe((data: any) => {
      if (data.entidades) {

        console.log("TbQoDetalleCredito guardadas -----> ", data.entidades);
        this.entidadesDetalleCreditos = data.entidades;
        this.capturaHoraFinal("TASACION");
      } else {
        console.log(' No se guardaron ---->', data);
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO, ERROR DESCONOCIDO', 'error');
      }
    });
  }
}