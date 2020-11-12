import { EstadoExcepcionEnum } from './../../../../../core/enum/EstadoExcepcionEnum';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { TbQoNegociacion } from '../../../../../core/model/quski/TbQoNegociacion';
import { FormGroup, FormControl } from '@angular/forms';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { NegociacionWrapper } from '../../../../../core/model/wrapper/NegociacionWrapper';



@Component({
  selector: 'kt-excepciones-cliente',
  templateUrl: './excepciones-cliente.component.html',
  styleUrls: ['./excepciones-cliente.component.scss']
})
export class ExcepcionesClienteComponent implements OnInit {
  [x: string]: any;
  // ENTIDADES
  wrapper: NegociacionWrapper;
  private entidadCliente: TbQoCliente = null;
  private procesoEntidad: TbQoProceso;
  private entidadNegociacion: TbQoNegociacion = null;
  private entidadExcepcion: TbQoExcepcion = null;


  // STANDARD VARIABLES
  public dataPopup: DataPopup;
  //public dataPopupRiesgo: DataPopup;
  private idNegociacion: number;
  private cedulaCliente: string;
  private idCliente: number;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public mensaje: any;
  public listExepcion = new Array<TbQoExcepcion>();
  public loading;



  // VARIABLES DE TRACKING
  public horaInicioExcepcion: Date;

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
    private tra: TrackingService,
    private pro: ProcesoService,
    private route: ActivatedRoute,
    private par: ParametroService,
    private exs: ExcepcionService,
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
    this.loading = this.loadingSubject.asObservable();
    //TRACKING
    this.capturaHoraInicio('NEGOCIACION');
    this.clienteNegociacion();
    this.subheaderService.setTitle("Excepciones de Negociación");
    this.capturaDatosTraking();

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
    /*tracking.codigoRegistro = codigoRegistro;
    tracking.usuario = atob(localStorage.getItem(environment.userKey))
    tracking.fechaInicio = fechaInicio;
    tracking.fechaAsignacion = fechaAsignacion;
    tracking.fechaInicioAtencion = fechaInicioAtencion;*/
    tracking.fechaFin = fechaFin;
    this.tra.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        //  console.log('data de tracking para Excpeción Cliente ----> ', data.entidad);
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
   * @description Metodo que realiza la busqueda de la excepcion por idNegociacion
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-09-04
   * @param {number} id
   * @memberof ExcepcionesClienteComponent
   */
  buscarExcepcion(id: number) {
    //console.log('valor del id===> ', id.toString());

    this.exs.findByIdNegociacion(id).subscribe((data: any) => {
      if (data.list != null && data.list[0] != null) {
        // console.log('VALOR DE LA DATA DE LA EXCEPCION ===> ', JSON.stringify(data));
        this.listExepcion = data.list[0];
        //  console.log('valor de la llistas', this.listExepcion);
        this.entidadExcepcion = data.list[0];
        this.observacionAsesor.setValue(this.entidadExcepcion.observacionAsesor);
        this.mensaje = this.entidadExcepcion.mensajeBre;
        //  console.log('Observacion Aseseor===> ', this.observacionAsesor);

      }
      // console.log('VALOR DE LA DATA DE LA EXCEPCION ===> ', JSON.stringify(data));

    });

  }

  asignarAprobacion() {
    //  console.log('ASIGNAR APROBACION');

    if (this.radioB.value === 'APROBADO') {
      this.radioB.setValue(EstadoExcepcionEnum.APROBADO);
    } else if (this.radioB.value === 'NEGADO') {
      this.radioB.setValue(EstadoExcepcionEnum.NEGADO);
    }
    this.entidadExcepcion.estadoExcepcion = this.radioB.value;
    this.entidadExcepcion.observacionAprobador = this.observacionAprobador.value;
  }




  /******************************************** @EVENT   *********************************************************/

  public submit(flujo: string) {
    this.loadingSubject.next(true);
    this.asignarAprobacion();
    //console.log('INICIA EL SUBMIT', this.entidadExcepcion);
    this.exs.persistEntity(this.entidadExcepcion).subscribe((data: any) => {
      //console.log('GUARDA', JSON.stringify(data));
      this.capturaHoraFinal('NEGOCIACION');
      this.router.navigate(['asesor/bandeja-principal']);
      this.sinNoticeService.setNotice('SE GUARDO LA EXCEPCION CORRECTAMENTE', 'success');
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice('Error al guardar la excepcion', 'error');
        }
      } else if (error.statusText && error.status == 401) {

        this.sinNoticeService.setNotice('Error al guardar la excepcion', 'error');
      } else {
        this.sinNoticeService.setNotice('Error al guardar la excepción', 'error');
      }
    });

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
        this.pro.findByIdReferencia(this.idNegociacion, "NUEVO").subscribe( (dataProceso: any)=>{
          if(dataProceso.entidad != null){
            this.procesoEntidad = dataProceso.entidad;
            this.neg.traerNegociacionExistente(this.idNegociacion).subscribe((data: any) => {
    
              this.wrapper = data.entidad;
              this.entidadNegociacion = this.wrapper.credito.tbQoNegociacion
              this.buscarExcepcion(this.entidadNegociacion.id);
    
              if (data.entidad) {
                this.cli.findClienteByIdentificacion(this.entidadNegociacion.tbQoCliente.cedulaCliente).subscribe((data: any) => {
                  this.entidadCliente = data.entidad;
                  this.loadingSubject.next(false);
                  if (data) {
                    // FORM OPERACION
                    this.nombresCompletos.setValue(this.entidadCliente.primerNombre + ' ' + this.entidadCliente.segundoNombre
                      + ' ' + this.entidadCliente.apellidoPaterno + ' ' + this.entidadCliente.apellidoMaterno);
                    this.idCliente = data.id;
                    this.identificacion.setValue(this.entidadCliente.cedulaCliente);
    
                    // FORM CLIENTE
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
                    this.dataPopup.isNegociacion = true;
                    this.dataPopup.idBusqueda = this.entidadNegociacion.id;
                    console.log('ID DE NEGOCIACION DATAPOPUP', this.entidadNegociacion.id);
                    //INPUT RIESGO ACUMULADO
    
                    // FORM CONTACTO
                    let idtlf = 0;
                  this.wrapper.telefonos.forEach(e=>{
                    if(e.tipoTelefono == "M"){
                      if(idtlf == 0){
                        idtlf = e.id; 
                      }else{
                        this.telefonoMovil.setValue(e.numero);
                      }
                      this.telefonoAdicional.setValue(e.numero);
                    }
                    if(e.tipoTelefono == "F"){
                      this.telefonoDomicilio.setValue(e.numero);
                    }
                    if(e.tipoTelefono == "CEL"){
                      this.telefonoOficinaOtros.setValue(e.numero);
                    }
                  });
                    this.correo.setValue(this.entidadCliente.email);
                    //FORM DATOS NEGOCIACION
                    this.estadoNegociacion.setValue(this.procesoEntidad.estadoProceso);
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
          }else{
            this.sinNoticeService.setNotice('ERROR AL CARGAR NEGOCIACION', 'error');
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
