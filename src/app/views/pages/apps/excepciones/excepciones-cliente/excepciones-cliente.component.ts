import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { TbQoNegociacion } from '../../../../../core/model/quski/TbQoNegociacion';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { TipoIdentificacionEnum } from '../../../../../core/enum/TipoIdentificacionEnum';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { OpcionesDeCredito } from '../../../../../core/model/calculadora/opcionesDeCredito';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { environment } from '../../../../../../environments/environment';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';
import { SituacionTrackingEnum } from '../../../../../core/enum/SituacionTrackingEnum';
import { ActividadEnum } from '../../../../../core/enum/ActividadEnum';
import { UsuarioEnum } from '../../../../../core/enum/UsuarioEnum';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { PersonaConsulta } from '../../../../../core/model/calculadora/personaConsulta';



@Component({
  selector: 'kt-excepciones-cliente',
  templateUrl: './excepciones-cliente.component.html',
  styleUrls: ['./excepciones-cliente.component.scss']
})
export class ExcepcionesClienteComponent implements OnInit {
  // ENTIDADES

  private entidadCliente: TbQoCliente = null;
  private entidadNegociacion: TbQoNegociacion = null;


  // STANDARD VARIABLES
  public dataPopup: DataPopup;
  public dataPopupRiesgo: DataPopup;
  private idNegociacion: number;
  private cedulaCliente: string;
  private idCliente: number;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public mensaje: any;

  // TABLA DE VARIABLES CREDITICIAS
  displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
  dataSourceVariablesCrediticias = new MatTableDataSource<TbQoVariablesCrediticia>();

  // VARIABLES DE TRACKING
  public horaInicioExcepcion: Date;
  public horaAsignacionExcepcion: Date = null;
  public horaAtencionExcepcion: Date;
  public horaFinalExcepcion: Date = null;
  public procesoExcepcion: string;
  public actividad: string;

  // FORM DATOS OPERACION
  public formDatosOperacion: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', []);
  public identificacion = new FormControl('', []);
  public nombreProceso = new FormControl('', []);
  // FORM DATOS CLIENTE
  public formDatosCliente: FormGroup = new FormGroup({});
  public tipoIdentificacion = new FormControl('', []);
  public identificacionC = new FormControl('', []);
  public aprobadoWebMupi = new FormControl('', []);
  public primerNombre = new FormControl('', []);
  public segundoNombre = new FormControl('', []);
  public separacionDeBienes = new FormControl('', []);
  public apellidoPaterno = new FormControl('', []);
  public apellidoMaterno = new FormControl('', []);
  public cargaFamiliar = new FormControl('', []);
  public genero = new FormControl('', []);
  public estadoCivil = new FormControl('', []);
  public lugarDeNacimiento = new FormControl('', []);
  public fechaDeNacimiento = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public edad = new FormControl('', []);
  public nivelDeEducacion = new FormControl('', []);
  public actividadEconomica = new FormControl('', []);
  public ultimaFechaDeActualizacionDeCliente = new FormControl('', []);
  // FORM DATOS CONTACTO
  public formDatosContacto: FormGroup = new FormGroup({});
  public telefonoDomicilio = new FormControl('', []);
  public telefonoAdicional = new FormControl('', []);
  public telefonoMovil = new FormControl('', []);
  public telefonoOficina = new FormControl('', []);
  public correo = new FormControl('', []);
  // FORM DATOS NEGOCIACION
  public formDatosNegociacion: FormGroup = new FormGroup({});
  public tipoProcesoNegociacion = new FormControl('', []);
  public estadoNegociacion = new FormControl('', []);
  public fechaDeCreacionNegociacion = new FormControl('', []);
  public ultimaFechaDeActualizacionNegociacion = new FormControl('', []);

  // FORM DATOS EXCEPCION
  public formDatosExcepcion: FormGroup = new FormGroup({});
  public observacionAsesor = new FormControl('', []);
  public excAprobada = new FormControl('', []);
  public excNegada = new FormControl('', []);
  public observacionAprobador = new FormControl('', []);
  public radioB = new FormControl('', []);


  constructor(
    private neg: NegociacionService,
    private cli: ClienteService,
    private ing: IntegracionService,
    private tra: TrackingService,
    private route: ActivatedRoute,
    private par: ParametroService,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService
  ) {

    //FORM DATOS OPERACION
    this.formDatosOperacion.addControl("nombresCompletos", this.nombresCompletos);
    this.formDatosOperacion.addControl("identificacion", this.identificacion);
    this.formDatosOperacion.addControl("nombreProceso", this.nombreProceso);
    //FORM DATOS CLIENTE
    this.formDatosCliente.addControl("tipoIdentificacion", this.tipoIdentificacion);
    this.formDatosCliente.addControl("identificacionC", this.identificacionC);
    this.formDatosCliente.addControl("aprobadoWebMupi", this.aprobadoWebMupi);
    this.formDatosCliente.addControl("primerNombre", this.primerNombre);
    this.formDatosCliente.addControl("segundoNombre", this.segundoNombre);
    this.formDatosCliente.addControl("separacionDeBienes", this.separacionDeBienes);
    this.formDatosCliente.addControl("apellidoPaterno", this.apellidoPaterno);
    this.formDatosCliente.addControl("apellidoMaterno", this.apellidoMaterno);
    this.formDatosCliente.addControl("cargaFamiliar", this.cargaFamiliar);
    this.formDatosCliente.addControl("genero", this.genero);
    this.formDatosCliente.addControl("estadoCivil", this.estadoCivil);
    this.formDatosCliente.addControl("lugarDeNacimiento", this.lugarDeNacimiento);
    this.formDatosCliente.addControl("fechaDeNacimiento", this.fechaDeNacimiento);
    this.formDatosCliente.addControl("nacionalidad", this.nacionalidad);
    this.formDatosCliente.addControl("edad", this.edad);
    this.formDatosCliente.addControl("nivelDeEducacion", this.nivelDeEducacion);
    this.formDatosCliente.addControl("actividadEconomica", this.actividadEconomica);
    this.formDatosCliente.addControl("ultimaFechaDeActualizacionDeCliente", this.ultimaFechaDeActualizacionDeCliente);
    //FORM DATOS CONTACTO
    this.formDatosContacto.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formDatosContacto.addControl("telefonoAdicional", this.telefonoAdicional);
    this.formDatosContacto.addControl("telefonoMovil", this.telefonoMovil);
    this.formDatosContacto.addControl("telefonoOficina", this.telefonoOficina);
    this.formDatosContacto.addControl("correo", this.correo);
    //FORM DATOS NEGOCIACION
    this.formDatosNegociacion.addControl("tipoProcesoNegociacion", this.tipoProcesoNegociacion);
    this.formDatosNegociacion.addControl("estadoNegociacion", this.estadoNegociacion);
    this.formDatosNegociacion.addControl("fechaDeCreacionNegociacion", this.fechaDeCreacionNegociacion);
    this.formDatosNegociacion.addControl("ultimaFechaDeActualizacionNegociacion", this.ultimaFechaDeActualizacionNegociacion);
    //FORM DATOS EXCEPCION
    this.formDatosExcepcion.addControl("observacionAsesor", this.observacionAsesor);
    this.formDatosExcepcion.addControl("excAprobada", this.excAprobada);
    this.formDatosExcepcion.addControl("excNegada", this.excNegada);
    this.formDatosExcepcion.addControl("observacionAprobador", this.observacionAprobador);

    //SECCIONES Y CAMPOS DE LECTURA
    this.formDatosOperacion.disable();
    this.formDatosCliente.disable();
    this.formDatosContacto.disable();
    this.formDatosNegociacion.disable();
    this.observacionAsesor.disable();
  }

  ngOnInit() {
    //TRACKING
    this.capturaHoraInicio('NEGOCIACION');
    this.clienteNegociacion();
    this.subheaderService.setTitle("Excepciones de Negociación");
    this.capturaDatosTraking();
  }
  private buscarMensaje() {
    this.loadingSubject.next(true);
    const consulta = new PersonaConsulta();
    consulta.identificacion = this.entidadCliente.cedulaCliente;
    this.ing.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {

      if (data.entidad.datoscliente != null) {
        if (data.entidad.mensaje != '') {
          console.log('DATA EQUIFAX', JSON.stringify(data));
          this.mensaje = data.entidad.mensaje;
          console.log('BUSCA EN PERSONA CALCULADORA', this.mensaje);
        }
      }
      this.loadingSubject.next(false);
    });
  }

  /********************************************  @TRACKING  ***********************************************************/
  /**
* @author Kléber Guerra  - Relative Engine
* @description Captura la hora de inicio de Tracking
*/
  private capturaHoraInicio(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.horaInicioExcepcion = hora.entidad;
      }

    });
  }
  private capturaHoraAsignacion(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {

        this.horaAsignacionExcepcion = hora.entidad;

      }
    });
  }
  private capturaHoraAtencion(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {


        this.horaAtencionExcepcion = hora.entidad;

      }
    });
  }
  private capturaHoraFinal(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {


        this.registroExcepcion(this.entidadNegociacion.id, this.horaInicioExcepcion, this.horaAsignacionExcepcion,
          this.horaAtencionExcepcion, this.horaFinalExcepcion);
      }

    });
  }
  private capturaDatosTraking() {
    this.par.findByNombreTipoOrdered('EXCEPCION_CLIENTE', 'TIP-EXC', 'Y').subscribe((data: any) => {
      if (data.entidades) {
        this.actividad = data.entidades[0].nombre;
        this.par.findByNombreTipoOrdered('EXCEPCION_CLIENTE', 'TIP-EXC', 'Y').subscribe((data: any) => {
          if (data.entidades) {
            this.procesoExcepcion = data.entidades[0].nombre;
            this.par.findByNombreTipoOrdered('EXCEPCION_CLIENTE', 'TIP-EXC', 'Y').subscribe((data: any) => {
              if (data.entidades) {
                this.procesoExcepcion = data.entidades[0].nombre;
              }
            });
          }
        });
      }
    });
  }
  public registroExcepcion(codigoRegistro: number, fechaInicio: Date, fechaAsignacion: Date, fechaInicioAtencion: Date, fechaFin: Date) {
    const tracking: TbQoTracking = new TbQoTracking();
    this.loadingSubject.next(true);
    tracking.actividad = this.actividad;
    tracking.proceso = this.procesoExcepcion;
    tracking.observacion = '';
    tracking.codigoRegistro = codigoRegistro;
    tracking.situacion = SituacionTrackingEnum.EN_PROCESO; // Por definir
    tracking.usuario = atob(localStorage.getItem(environment.userKey))
    tracking.fechaInicio = fechaInicio;
    tracking.fechaAsignacion = fechaAsignacion;
    tracking.fechaInicioAtencion = fechaInicioAtencion;
    tracking.fechaFin = fechaFin;
    this.tra.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        console.log('data de tracking para Prospeccion ----> ', data.entidad);
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



  /******************************************** @EVENT   *********************************************************/
  public traerEntidadesVariables(event: Array<TbQoVariablesCrediticia>) {

  }
  public traerEntidadRiesgo(event: Array<TbQoRiesgoAcumulado>) {

  }



  /**
   * @description METODO QUE BUSCA EL CLIENTE MEDIANTE LA VARIABLE DE ID NEGOCIACION
   * @description PASADA POR this.route.paramMap
   */
  clienteNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      data.params.id
      if (data.params.id) {
        this.idNegociacion = data.params.id;
        // console.log('PARAMETRO=====> ', this.idNegociacion);
        this.neg.findNegociacionById(this.idNegociacion).subscribe((data: any) => {
          console.log('NEGOCIACION findNegociacionById ', JSON.stringify(data));

          this.entidadNegociacion = data.entidad;

          if (data.entidad) {
            //TRACKING
            console.log('TRACKING', JSON.stringify(data));
            this.capturaHoraAsignacion('NEGOCIACION');


            this.cedulaCliente = data.entidad.tbQoCliente.cedulaCliente;
            this.cli.findClienteByIdentificacion(this.cedulaCliente).subscribe((data: any) => {
              console.log('VALOR DE LA DATA==> findClienteByIdentificacion ', JSON.stringify(data));
              this.entidadCliente = data.entidad;
              this.loadingSubject.next(false);
              if (data) {
                // FORM OPERACION
                this.nombresCompletos.setValue(this.entidadCliente.primerNombre + ' ' + this.entidadCliente.segundoNombre
                  + ' ' + this.entidadCliente.apellidoPaterno + ' ' + this.entidadCliente.apellidoMaterno);
                this.idCliente = data.id;
                this.identificacion.setValue(this.entidadCliente.cedulaCliente);
                // console.log('VALOR DE LA dataNegociacion====> ', JSON.stringify(this.entidadNegociacion));
                //console.log('VALOR DE LA ENTIDAD====> ', JSON.stringify(this.entidadNegociacion.procesoActual));
                this.nombreProceso.setValue(this.entidadNegociacion.procesoActual);
                this.buscarMensaje();
                // FORM CLIENTE
                this.tipoIdentificacion.setValue(TipoIdentificacionEnum.CEDULA);
                this.identificacionC.setValue(this.entidadCliente.cedulaCliente);
                this.aprobadoWebMupi.setValue(this.entidadCliente.aprobacionMupi)
                this.primerNombre.setValue(this.entidadCliente.primerNombre);
                this.segundoNombre.setValue(this.entidadCliente.segundoNombre);
                this.separacionDeBienes.setValue(this.entidadCliente.separacionBienes);
                this.apellidoPaterno.setValue(this.entidadCliente.apellidoPaterno);
                this.apellidoMaterno.setValue(this.entidadCliente.apellidoMaterno);
                this.cargaFamiliar.setValue(this.entidadCliente.cargasFamiliares);
                this.genero.setValue(this.entidadCliente.genero);
                this.estadoCivil.setValue(this.entidadCliente.estadoCivil);
                this.lugarDeNacimiento.setValue(this.entidadCliente.lugarNacimiento);
                this.fechaDeNacimiento.setValue(new Date(this.entidadCliente.fechaNacimiento));
                this.nacionalidad.setValue(this.entidadCliente.nacionalidad);
                this.edad.setValue(this.entidadCliente.edad);
                this.nivelDeEducacion.setValue(this.entidadCliente.nivelEducacion);
                this.actividadEconomica.setValue(this.entidadCliente.actividadEconomica);
                this.ultimaFechaDeActualizacionDeCliente.setValue(new Date(this.entidadCliente.fechaActualizacion));
                // INPUT VARIABLES CREDITICIAS
                this.dataPopup = new DataPopup();
                this.dataPopup.cedula = this.entidadCliente.cedulaCliente;
                this.dataPopup.isCalculadora = true;
                //INPUT RIESGO ACUMULADO
                this.dataPopupRiesgo = new DataPopup();
                this.dataPopupRiesgo.cedula = this.entidadCliente.cedulaCliente;
                this.dataPopupRiesgo.isNegociacion = true;
                // FORM CONTACTO
                this.telefonoDomicilio.setValue(this.entidadCliente.telefonoFijo);
                this.telefonoAdicional.setValue(this.entidadCliente.telefonoAdicional);
                this.telefonoMovil.setValue(this.entidadCliente.telefonoMovil);
                this.telefonoOficina.setValue(this.entidadCliente.telefonoTrabajo);
                this.correo.setValue(this.entidadCliente.email);
                //FORM DATOS NEGOCIACION

                this.tipoProcesoNegociacion.setValue(this.entidadNegociacion.tipo);
                this.estadoNegociacion.setValue(this.entidadNegociacion.situacion);
                this.fechaDeCreacionNegociacion.setValue(new Date(this.entidadNegociacion.fechaCreacion));
                this.ultimaFechaDeActualizacionNegociacion.setValue(new Date(this.entidadNegociacion.fechaActualizacion));
              } else {
                this.sinNoticeService.setNotice('ERROR AL CARGAR CLIENTE 1', 'error');
              }
            }, error => {
              this.loadingSubject.next(false);
              if (JSON.stringify(error).indexOf("codError") > 0) {
                let b = error.error;
                this.sinNoticeService.setNotice(b.msgError, 'error');
              } else {
                this.sinNoticeService.setNotice('ERROR AL CARGAR CLIENTE 2', 'error');
              }
            });
          } else {
            this.sinNoticeService.setNotice('ERROR AL CARGAR NEGOCIACION', 'error');
            this.capturaHoraAsignacion('NEGOCIACION');

          }
        });
      } else {
        this.sinNoticeService.setNotice('ERROR AL CARGAR EXCEPCION', 'error');
        this.capturaHoraAsignacion('NEGOCIACION');
        this.capturaHoraAtencion('NEGOCIACION');

      }
    });
  }

}
