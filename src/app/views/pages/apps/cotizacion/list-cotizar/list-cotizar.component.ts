import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatStepper } from '@angular/material';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { SolicitudAutorizacionDialogComponent } from '../../../../partials/custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { TipoOroService } from '../../../../../core/services/quski/tipoOro.service';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
import { TbQoTipoOro, } from '../../../../..//core/model/quski/TbQoTipoOro';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { Router } from '@angular/router';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { MensajeExcepcionComponent } from '../../../../partials/custom/popups/mensaje-excepcion-component/mensaje-excepcion-component';
import { PersonaConsulta } from '../../../../../core/model/calculadora/personaConsulta';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { ClienteSoftbank } from '../../../../../core/model/softbank/ClienteSoftbank';
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
import { RiesgoAcumuladoComponent } from '../../../../partials/custom/popups/riesgo-acumulado/riesgo-acumulado.component';
import { MensajeEdadComponent } from '../../../../../../app/views/partials/custom/popups/mensaje-edad/mensaje-edad.component';
import { GuardarProspectoCRM } from '../../../../../core/model/crm/guardarProspectoCRM';


@Component({
  selector: 'kt-list-cotizar',
  templateUrl: './list-cotizar.component.html',
  styleUrls: ['./list-cotizar.component.scss']
})

export class ListCotizarComponent implements OnInit {
  // ENTIDADES
  private entidadProspectoCRM: ProspectoCRM = null;
  private entidadClientesoftbank: ClienteSoftbank = null;
  entidadCliente: TbQoCliente = null;
  private entidadCotizador: TbQoCotizador = null;
  private entidadPersonaCalculadora: PersonaCalculadora = null;
  private entidadesOpcionesCreditos: Array<OpcionesDeCredito> = null;
  private entidadesVariablesCrediticias: Array<TbQoVariablesCrediticia> = null;
  private entidadesDetalleCreditos: Array<TbQoDetalleCredito> = null;
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
  public seleccionadoOro: TbQoTipoOro = new TbQoTipoOro();

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
    private ing: IntegracionService,
    private vac: VariablesCrediticiasService,
    private det: DetalleCreditoService,
    private crm: CRMService,
    private par: ParametroService,
    private pre: PrecioOroService,
    private tra: TrackingService,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog
  ) {
    this.sof.setParameter();
    this.cot.setParameter();
    this.cli.setParameter();
    this.ing.setParameter();
    this.vac.setParameter();
    this.det.setParameter();
    this.crm.setParameter();
    this.par.setParameter();
    this.pre.setParameter();
    this.tra.setParameter();

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
    this.sof.setParameter();
    this.cot.setParameter();
    this.cli.setParameter();
    this.ing.setParameter();
    this.vac.setParameter();
    this.det.setParameter();
    this.crm.setParameter();
    this.par.setParameter();
    this.pre.setParameter();
    this.tra.setParameter();
    this.seleccionadoOro.quilate = '18K';
    this.subheaderService.setTitle('GESTION DE COTIZACION');
    this.limpiarCampos();
    this.llamarCatalogos();
    this.capturaHoraInicio('PROSPECCION');
    this.contadorPrecioOro = null;
    this.contadorBusqueda = null;
    this.loading = this.loadingSubject.asObservable();
    this.disableMensajeBloqueo = this.disableMensajeBloqueoSubject.asObservable();
  }
  /**
   * ******************************** @INCIO 
  */
  // Riesgo acumulado de softbank que guarda directamente.
  public goRiesgoAcumulado() {
    const dialogRef = this.dialog.open(RiesgoAcumuladoComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        cedula: this.entidadCliente.cedulaCliente,
        isGuardar: true,
      }
    });
    dialogRef.afterClosed().subscribe((respuesta: Array<TbQoRiesgoAcumulado>) => {
      //console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));

    });
  }
  /********************************************* @BUSQUEDA *********************    */
  /**
   * @description Metodo que realiza la busqueda del cliente en SOFTBANK
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @param {string} cedula
   * @memberof ListCotizarComponent
   */
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
  /**
   * @description Método que realiza la búsqueda en CRM
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {string} cedula
   * @memberof ListCotizarComponent
   */
  private busquedaEnCRM(cedula: string) {
    this.loadingSubject.next(true);
    this.crm.findClienteByCedulaCRM(cedula).subscribe((data: any) => {
      if (data && data.list) {
        //console.log('DATA.LIST==> ', JSON.stringify(data.list));
        this.entidadProspectoCRM = data.list[0];
      } else {
        this.entidadProspectoCRM = null;
      }
      this.loadingSubject.next(false);
      this.busquedaEquifax(cedula);
    });
  }
  /**
   * @description Método que realiza la busqueda en la calculadora QUSKI
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {string} cedula
   * @memberof ListCotizarComponent
   */
  private busquedaEquifax(cedula: string) {

    this.loadingSubject.next(true);
    const consulta = new PersonaConsulta();
    consulta.identificacion = cedula;
    this.ing.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {

      if (data.entidad.datoscliente != null) {
        if (data.entidad.mensaje != '') {
          //console.log('DATA EQUIFAX', JSON.stringify(data));
          this.mensaje = data.entidad.mensaje;
          this.verMensajes(this.mensaje);
          //console.log('BUSCA EN PERSONA CALCULADORA');

        }

        this.contadorBusqueda++;
        this.entidadPersonaCalculadora = data.entidad.datoscliente;

      } else {
        this.entidadPersonaCalculadora = null;
      }
      this.loadingSubject.next(false);
      this.busquedaCliente();
    });
  }
  /**
   * @description Método que realiza la búsqueda del cliente en SOFTBANK,CRM Y EQUIFAX, tambien realiza el registro del tracking
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @memberof ListCotizarComponent
   */
  public busquedaCliente() {
    if (this.horaAsignacionProspeccion == null) {
      this.capturaHoraAsignacion('PROSPECCION');
    }
    if (this.identificacion.value != '' && this.formBusqueda.valid) {
      if (this.contadorBusqueda == null) {
        this.busquedaSoftbank(this.identificacion.value);
      } else {
        if (this.contadorBusqueda > 1) {
          if (this.entidadPersonaCalculadora != null) {
            //console.log('ENTIDAD PROSPECTO EN busquedaCliente===> ', this.entidadProspectoCRM);

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

  /**
   * @description Método que realiza la búsqueda de los mensajes que retornen al consultar en EQUIFAX
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {string} cedula
   * @memberof ListCotizarComponent
   */
  private busquedaMensajeEquifax(cedula: string) {
    const consulta = new PersonaConsulta();
    consulta.identificacion = cedula;
    this.ing.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {
      if (data.entidad.mensaje != '') {
        //console.log('DATA EQUIFAX', JSON.stringify(data));
        this.mensaje = data.entidad.mensaje;
        this.verMensajes(this.mensaje);
      }
    });
  }
  /**
   * @description Método que realiza el seteo de los valores de las búsquedas del cliente 
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @memberof ListCotizarComponent
   */
  private setearValores() {
    this.loadingSubject.next(true);
    this.busquedaMensajeEquifax(this.entidadCliente.cedulaCliente);
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

    this.correoElectronico.setValue(this.entidadCliente.email);
    this.fechaNacimiento.setValue(this.entidadCliente.fechaNacimiento);
    this.capturaHoraAtencion('PROSPECCION');
    this.loadingSubject.next(false);
    // INPUT VARIABLES CREDITICIAS
    this.dataPopup = new DataPopup();
    this.dataPopup.cedula = this.entidadCliente.cedulaCliente;
    this.dataPopup.isCalculadora = true;
  }
  /**
   * @description Método que guarda el cliente previamente seteado
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {ProspectoCRM} crm
   * @param {PersonaCalculadora} equifax
   * @param {ClienteSoftbank} softbank
   * @memberof ListCotizarComponent
   */
  private guardarClienteBusqueda(crm: ProspectoCRM, equifax: PersonaCalculadora, softbank: ClienteSoftbank) {
    this.loadingSubject.next(true);
    let cliente = new TbQoCliente();
    if (softbank != null) {
      // setear soft
      if (softbank.codigoSexo == "M") {
        cliente.genero = "MASCULINO";
      } else if(softbank.codigoSexo == "F"){
        cliente.genero = "FEMENINO";
      } else{
        cliente.genero = null;
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
          }


        });
      }
    } else {
      if (crm != null) {
        // setea crm y equifax

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
        } else {
          if (equifax.telefonofijo != null && equifax.telefonofijo !== '') {
          }

        }


        if (crm.phoneMobile != null && crm.phoneMobile !== '') {
        } else {
          if (equifax.telefonomovil != null && equifax.telefonomovil !== '') {
          }
        }


      } else {
        // setear equifax
        cliente.fechaNacimiento = equifax.fechanacimiento;
        cliente.nacionalidad = equifax.nacionalidad;
        cliente.genero = equifax.genero;
        cliente.email = equifax.correoelectronico;
        cliente.campania = equifax.codigocampania.toString();
        cliente.cedulaCliente = equifax.identificacion.toString();
        this.mensaje = equifax.mensaje;
        //console.log('mensaje ====> ', this.mensaje);
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

  public guardarProspectoCRM() {
    //console.log('INCIA GUARDAR CRM');

    //console.log('this.cliente guardarClienteBusqueda==> ', JSON.stringify(this.entidadCliente));
    const entidadGuardarProspectoCRM = new GuardarProspectoCRM();
    if (this.entidadCliente) {
      entidadGuardarProspectoCRM.cedulaC = this.entidadCliente.cedulaCliente;
      entidadGuardarProspectoCRM.firstName = this.entidadCliente.primerNombre;
      entidadGuardarProspectoCRM.leadSourceDescription = 'GESTION QUSKI';
      entidadGuardarProspectoCRM.emailAddress = this.entidadCliente.email;
      entidadGuardarProspectoCRM.emailAddressCaps = this.entidadCliente.email.toUpperCase();

      //console.log('VALORES DE LA ENTIDAD PROSPECTO CRM', JSON.stringify(this.entidadProspectoCRM));

    }

    this.crm.guardarProspectoCRM(entidadGuardarProspectoCRM).subscribe((data: any) => {
      if (data) {
        //console.log('VALORES GUARDADOS guardarProspectoCRM ====> ', JSON.stringify(data));
        //console.log('GUARDA EL PROSPECTO');
      } else {
        //console.log('NO GUARDO')
      }
    });


  }


  /**
   * @description Método que guarda la cotizacion si existe actualiza caso contrario crea
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @param {TbQoCotizador} cotizador
   * @param {number} idCliente
   * @memberof ListCotizarComponent
   */
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
  /********************************************* @POPUP *********************    */

  /**
   * @description Método que llama al popup de SOLICITAR LA AUTORIZACION
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {string} cedula
   * @memberof ListCotizarComponent
   */
  private solicitarAutorizacion(cedula: string) {
    this.loadingSubject.next(false);
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: cedula
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      //console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      //console.log('RESP--> ', JSON.stringify(respuesta));
      //
      if (respuesta !== null && respuesta !== undefined) {
        //console.log('al cerrar el dialogo ' + JSON.stringify(respuesta));
        this.busquedaEnCRM(cedula);
      } else {
        //console.log('envio de ELSE ' + respuesta);
        this.sinNoticeService.setNotice('ACCIÓN CANCELADA ', 'error');
        this.limpiarCampos();
      }
      if (this.mensaje != null) {
        //console.log('INGRESA A MENSAJES', JSON.stringify(this.mensaje));
        this.verMensajes(this.mensaje);
      }
    });
  }
  /**
   * @description Método que llama al popup de MENSAJES DE BLOQUEO
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {string} mensaje
   * @memberof ListCotizarComponent
   */
  private verMensajes(mensaje: string) {
    //console.log('VALORES DE MENSAJE QUE ENVIO---> ', mensaje);
    // this.loadingSubject.next(false);

    //console.log('>>>INGRESA AL DIALOGO ><<<<<<', this.mensaje);
    const dialogRefGuardar = this.dialog.open(MensajeExcepcionComponent, {
      width: '600px',
      height: 'auto',
      data: mensaje
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      //console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
    });
  }
  /**
   * @description Método que llama al popup para visualizar las cotizaciones
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @param {string} identificacion
   * @memberof ListCotizarComponent
   */
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
   * @description Método que llama al popup de validación de la edad
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {string} mensaje
   * @memberof ListCotizarComponent
   */
  private validacionEdad(mensaje: string) {
    //console.log('VALORES EN EL METTODO validacionEdad ===>', mensaje);
    this.loadingSubject.next(false);
    const dialogEdad = this.dialog.open(MensajeEdadComponent, {
      width: '600px',
      height: 'auto',
      data: mensaje
    });
    dialogEdad.afterClosed().subscribe((respuesta: any) => {
      //console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      //console.log('RESP--> ', JSON.stringify(respuesta));

    });
  }

  /********************************************* @PRECIOORO *********************    */
  /**
   * @description Método que realiza el seteo del precio oro busca el precio segun el tipo de oro seleccionado
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @param {*} event
   * @memberof ListCotizarComponent
   */
  setPrecioOro(event) {

    if (this.entidadCliente != null) {

      this.loadingSubject.next(true);
      const consulta = new ConsultaOferta();
      consulta.identificacionCliente = this.entidadCliente.cedulaCliente;
      if (event != null) {
        this.capturaHoraAtencion('TASACION');
        consulta.tipoOroKilataje = event.value.quilate;
      } else {
        consulta.tipoOroKilataje = '18K';
      }
      consulta.fechaNacimiento = this.entidadCliente.fechaNacimiento;
      this.ing.getInformacionOferta(consulta).subscribe((data: any) => {
        if (data.entidad.simularResult && data.entidad.simularResult.xmlGarantias.garantias.garantia) {
          this.precio.setValue(data.entidad.simularResult.xmlGarantias.garantias.garantia.valorOro);
          if (event == null) {
            this.catTipoOro.forEach(e => {
              if (e.quilate === '18K') {
                this.tipoOro.setValue(e);
              }
            });
          }
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
  /**
   * @description Método que registra el tracking para la captura de las hora final de la prospeccion y hora de inicio de la Tasacion ademas se desbloquea la seccion precio oro 
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @memberof ListCotizarComponent
   */
  verPrecio() {
    if (this.horaFinalProspeccion == null) {
      this.capturaHoraFinal('PROSPECCION');
      this.capturaHoraInicio('TASACION');
      this.capturaHoraAsignacion('TASACION');
      this.bloqueoPrecioOro.setValue(true);
      //console.log('cliente verPrecio ', this.entidadCliente);
      //console.log('CRM verPrecio', this.entidadProspectoCRM);
      this.guardarProspectoCRM();
      this.setPrecioOro(null);
    }
  }
  /**
   * @description Método que crea un nuevo precio oro
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @memberof ListCotizarComponent
   */
  nuevoPrecioOro() {
    if (this.formPrecioOro.valid) {
      this.loadingSubject.next(true);
      const precioOro = new TbQoPrecioOro();
      precioOro.precio = this.precio.value;
      precioOro.pesoNetoEstimado = this.pesoNetoEstimado.value;
      precioOro.tbQoCotizador.id = this.entidadCotizador.id;
      precioOro.tbQoTipoOro = this.tipoOro.value;
      if (this.elementPrecioOro != null) {
        precioOro.id = this.elementPrecioOro.id;
        const index = this.dataSourcePrecioOro.data.indexOf(this.elementPrecioOro);
        this.dataSourcePrecioOro.data.splice(index, 1);
        this.elementPrecioOro = null;
      }
      this.pre.persistEntity(precioOro).subscribe((data: any) => {
        if (data && data.entidad) {
          const dataC = this.dataSourcePrecioOro.data;
          dataC.push(data.entidad);
          this.dataSourcePrecioOro.data = dataC;
          this.contadorPrecioOro++;
          this.sinNoticeService.setNotice('SE GUARDO EL PRECIO ORO', 'success');
        } else {
          this.sinNoticeService.setNotice('ERROR AL GUARDAR PRECIO ORO', 'success');
        }
        this.loadingSubject.next(false);
        this.limpiarCamposPrecioOro();
      });
    } else {
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
    }
  }
  /**
   * @description Método que realiza la edición de un precio oro seleccionado
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @param {TbQoPrecioOro} element
   * @memberof ListCotizarComponent
   */
  editar(element: TbQoPrecioOro) {
    this.tipoOro.setValue(element.tbQoTipoOro);
    this.precio.setValue(element.precio);
    this.pesoNetoEstimado.setValue(element.pesoNetoEstimado);
    this.elementPrecioOro = element;
  }
  /**
   * @description Método que elimina un precio oro
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @param {TbQoPrecioOro} element
   * @memberof ListCotizarComponent
   */
  eliminarPrecioOro(element: TbQoPrecioOro) {
    this.loadingSubject.next(true);
    this.pre.eliminarPrecioOro(element.id).subscribe((data: any) => {
      if (data.entidad) {
        const index = this.dataSourcePrecioOro.data.indexOf(element);
        this.dataSourcePrecioOro.data.splice(index, 1);
        const dataC = this.dataSourcePrecioOro.data;
        this.dataSourcePrecioOro.data = dataC;
        if (this.dataSourcePrecioOro.data.length < 1) {
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
  /**
   * @description Método que realiza la simulación de las ofertas
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @memberof ListCotizarComponent
   */
  simular() {
    this.consultaOferta = new ConsultaOferta();
    this.consultaOferta.identificacionCliente = this.entidadCliente.cedulaCliente;
    this.consultaOferta.precioOro = 0;
    this.consultaOferta.pesoGr = 0;
    this.consultaOferta.pesoNeto = 0;
    this.dataSourcePrecioOro.data.forEach(e => {
      //console.log(' dataSourcePrecioOro pesoGr ---> ', this.consultaOferta.pesoGr);
      //console.log(' dataSourcePrecioOro pesoNeto ---> ', this.consultaOferta.pesoNeto);
      //console.log(' dataSourcePrecioOro precioOro ---> ', this.consultaOferta.precioOro);

      this.consultaOferta.pesoGr += parseFloat(e.pesoNetoEstimado);
      this.consultaOferta.pesoNeto += parseFloat(e.pesoNetoEstimado);
      this.consultaOferta.precioOro += parseFloat(e.precio);
      this.consultaOferta.tipoOroKilataje = e.tbQoTipoOro.quilate;

      //console.log(' DATOS pesoGr ---> ', this.consultaOferta.pesoGr);
      //console.log(' DATOS pesoNeto ---> ', this.consultaOferta.pesoNeto);
      //console.log(' DATOS precioOro ---> ', this.consultaOferta.precioOro);
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
        if (etapa == 'PROSPECCION') {
          this.horaInicioProspeccion = hora.entidad;
        }
        if (etapa == 'TASACION') {
          this.horaInicioTasacion = hora.entidad;
        }
      }
    });
  }
  private capturaHoraAsignacion(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        if (etapa == 'PROSPECCION') {
          this.horaAsignacionProspeccion = hora.entidad;
        }
        if (etapa == 'TASACION') {
          this.horaAsignacionTasacion = hora.entidad;
        }
      }
    });
  }
  private capturaHoraAtencion(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        if (etapa == 'PROSPECCION') {
          this.horaAtencionProspeccion = hora.entidad;
        }
        if (etapa == 'TASACION') {
          this.horaAtencionTasacion = hora.entidad;
        }
      }
    });
  }
  private capturaHoraFinal(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        if (etapa == 'PROSPECCION') {
          this.horaFinalProspeccion = hora.entidad;
          this.registroProspeccion(this.entidadCotizador.id, this.horaInicioProspeccion, this.horaAsignacionProspeccion,
            this.horaAtencionProspeccion, this.horaFinalProspeccion);
        }
        if (etapa == 'TASACION') {
          this.horaFinalTasacion = hora.entidad;
          this.registroTasación(this.entidadCotizador.id, this.horaInicioTasacion, this.horaAsignacionTasacion,
            this.horaAtencionTasacion, this.horaFinalTasacion);
        }
      }
    });
  }
  private capturaDatosTraking() {
    this.par.findByNombreTipoOrdered('COTIZACION', 'ACTIVIDAD', 'Y').subscribe((data: any) => {
      if (data.entidades) {
        this.actividad = data.entidades[0].nombre;
        this.par.findByNombreTipoOrdered('PROSPECCION', 'PROCESO', 'Y').subscribe((data: any) => {
          if (data.entidades) {
            this.procesoProspeccion = data.entidades[0].nombre;
            this.par.findByNombreTipoOrdered('TASACION', 'PROCESO', 'Y').subscribe((data: any) => {
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
    this.tra.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        //console.log('data de tracking para Prospeccion ----> ', data.entidad);
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
    tracking.actividad = this.actividad;
    tracking.proceso = this.procesoTasacion;
    tracking.observacion = '';
    this.tra.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        //console.log(' TRACKING TASACION ------>' + JSON.stringify(data.entidad));
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
  /**
   * @description Método que captura los errores en los diferentes campos
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @param {string} pfield
   * @returns 
   * @memberof ListCotizarComponent
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
      const input = this.telefonoDomicilio;
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

      return this.correoElectronico.hasError('required')
        ? errorRequerido : this.correoElectronico.hasError('email')
          ? 'E-mail no valido' : this.correoElectronico.hasError('maxlength')
            ? maximo + this.correoElectronico.errors.maxlength.requiredLength : '';

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
    if (pfield && pfield === 'campania') {
      const input = this.campania;
      return input.hasError('required')
        ? errorSeleccion
        : input.hasError('required');
    }

    if (pfield && pfield === 'fpublicidad') {
      const input = this.formCliente.get('fpublicidad');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('errorSeleccion');
    }
  }
  /**
   * @description Método que se llama desde la pagina para realizar el calculo de la edad
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @memberof ListCotizarComponent
   */
  onChangeFechaNacimiento() {
    this.loadingSubject.next(true);
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    //console.log('FECHA SELECCIONADA' + fechaSeleccionada);
    if (fechaSeleccionada) {
      this.getDiffFechas(fechaSeleccionada, 'dd/MM/yyy');
      this.validarEdad();
      //console.log('VALOR DE LA FECHA' + this.fechaNacimiento.value);
    } else {
      this.sinNoticeService.setNotice(
        'El valor de la fecha es nulo',
        'warning'
      );
      this.loadingSubject.next(false);
    }
  }
  /**
   * @description Método que realiza la valida de la edad
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @memberof ListCotizarComponent
   */
  private validarEdad() {
    //console.log('INICIA VALIDAR EDAD');

    const consulta = new ConsultaOferta();
    consulta.identificacionCliente = this.identificacion.value;
    consulta.tipoOroKilataje = '18K';
    consulta.fechaNacimiento = this.fechaNacimiento.value;
    this.ing.getInformacionOferta(consulta).subscribe((data: any) => {
      if (data && data.entidad.simularResult.mensaje !== '') {
        this.mensaje = data.entidad.simularResult.mensaje;
        this.validacionEdad(this.mensaje);
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
      }
    }, error => {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice('ERROR AL CARGAR VALIDACIONES', 'info');
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL CARGAR', 'error');
      }
    });
  }
  /**
   * @description Método que limpia los campos de la seccion de Precio oro
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @memberof ListCotizarComponent
   */
  private limpiarCamposPrecioOro() {
    Object.keys(this.formPrecioOro.controls).forEach((name) => {
      const control = this.formPrecioOro.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.reset();
    });
  }
  /**
   * @description
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {Date} fecha
   * @param {string} format
   * @memberof ListCotizarComponent
   */
  private getDiffFechas(fecha: Date, format: string) {
    this.loadingSubject.next(true);
    const convertFechas = new RelativeDateAdapter();
    this.par.getDiffBetweenDateInicioActual(convertFechas.format(fecha, 'input'), format).subscribe((rDiff: any) => {
      //console.log('RESPUESTA DE EDAD', JSON.stringify(rDiff));
      const diff: YearMonthDay = rDiff.entidad;
      this.edad.setValue(diff.year);
      //console.log('La edad es ' + this.edad.value);
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

  compararNombres(tipoOro1: TbQoTipoOro, tipoOro2: TbQoTipoOro) {
    if (tipoOro1 == null || tipoOro2 == null) {
      return false;
    }
    return tipoOro1.quilate === tipoOro2.quilate;
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
  /*public getTipoOro() {
    this.tip.listAllEntities().subscribe((wrapper: any) => {
      if (wrapper && wrapper.list) {
        this.catTipoOro = new Array<TbQoTipoOro>();
        this.catTipoOro = wrapper.list;


      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO CATALOGO VACIO', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf('codError') > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO DESCONOCIDO', 'error');
      }
    });
  }*/
  public getMotivoDesestimiento() {
    this.par.findByNombreTipoOrdered('', 'DESEST', 'Y').subscribe((wrapper: any) => {
      if (wrapper && wrapper.entidades) {
        this.listMotivoDesestimiento = wrapper.entidades;
      }
    }, error => {
      if (JSON.stringify(error).indexOf('codError') > 0) {
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
      if (JSON.stringify(error).indexOf('codError') > 0) {
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
      if (JSON.stringify(error).indexOf('codError') > 0) {
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
    //this.getTipoOro();
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
      if (JSON.stringify(error).indexOf('codError') > 0) {
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
              if (flujo == 'NEGOCIAR') {
                this.router.navigate(['negociacion/gestion-negociacion/COT', this.entidadCotizador.id]);
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
      dcr.costoResguardado = e.costoFideicomiso;
      dcr.costoSeguro = e.costoSeguro;
      dcr.costoCustodia = e.costoCustodia;
      dcr.costoNuevaOperacion = e.totalGastosNuevaOperacion;
      dcr.costoTasacion = e.costoTasacion;
      dcr.costoTransporte = e.costoTransporte;
      dcr.costoValoracion = e.costoValoracion;
      dcr.montoPreaprobado = e.montoFinanciado;
      dcr.periodoPlazo = e.periodoPlazo;
      dcr.plazo = e.plazo;
      dcr.recibirCliente = e.valorARecibir;
      dcr.solca = e.impuestoSolca;
      dcr.valorCuota = e.cuota;
      dcr.tbQoCotizador = cotizador;
      listDetalleCredito.push(dcr);
    });
    this.guardarGestion(listDetalleCredito);
  }
  private guardarGestion(entidades: Array<TbQoDetalleCredito>) {

    this.det.persistEntities(entidades).subscribe((data: any) => {
      if (data.entidades) {

        //console.log('TbQoDetalleCredito guardadas -----> ', data.entidades);
        this.entidadesDetalleCreditos = data.entidades;
        this.capturaHoraFinal('TASACION');
      } else {
        //console.log(' No se guardaron ---->', data);
      }
    }, error => {
      if (JSON.stringify(error).indexOf('codError') > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO, ERROR DESCONOCIDO', 'error');
      }
    });
  }
}