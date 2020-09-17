import { Component, OnInit } from '@angular/core';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { TbQoNegociacion } from '../../../../../core/model/quski/TbQoNegociacion';
import { FormGroup, FormControl } from '@angular/forms';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { TipoIdentificacionEnum } from '../../../../../core/enum/TipoIdentificacionEnum';
import { TbQoExcepcione } from '../../../../../core/model/quski/TbQoExcepcione';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { VariablesCrediticiasService } from '../../../../../core/services/quski/variablesCrediticias.service';
import { RiesgoAcumuladoService } from '../../../../../core/services/quski/riesgoAcumulado.service';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { environment } from '../../../../../../../src/environments/environment';
import { EstadoExcepcionEnum } from '../../../../../core/enum/EstadoExcepcionEnum';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';
import { SituacionTrackingEnum } from '../../../../../core/enum/SituacionTrackingEnum';
import { UsuarioEnum } from '../../../../../core/enum/UsuarioEnum';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { TasacionService } from '../../../../../core/services/quski/tasacion.service';
import { OpcionesDeCredito } from '../../../../../core/model/calculadora/opcionesDeCredito';
import { ConsultaOferta } from '../../../../../core/model/calculadora/consultaOferta';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { PersonaConsulta } from '../../../../../core/model/calculadora/personaConsulta';

@Component({
  selector: 'kt-excepciones-cobertura',
  templateUrl: './excepciones-cobertura.component.html',
  styleUrls: ['./excepciones-cobertura.component.scss']
})
export class ExcepcionesCoberturaComponent implements OnInit {
  [x: string]: any;

  //ENTIDADES
  private entidadNegociacion: TbQoNegociacion = null;
  private entidadesOpcionesCreditos: Array<OpcionesDeCredito> = null;
  private entidadCliente: TbQoCliente = null;
  private entidadExcepcion: TbQoExcepcione = null;

  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public usuario;
  public proceso;
  private minimoDeCobertura;
  private camposDinamicos;
  private validacionCobertura;
  public dataPopup: DataPopup;
  public consultaOferta: ConsultaOferta;


  // OBJETOS DE ENTIDADES
  private negociacion: TbQoNegociacion;
  private cliente: TbQoCliente;
  private excepcion: TbQoExcepcione;
  private variablesCre: Array<TbQoVariablesCrediticia>;
  private riesgoAcumul: Array<TbQoRiesgoAcumulado>;
  private tasacion: Array<TbQoTasacion>;
  private opcCredito: Array<OpcionesDeCredito>;
  private opcExcepcionada: Array<OpcionesDeCredito>;



  // TABLA TASACION
  displayedColumnsTasacion = ['NumeroPiezas', 'TipoOro', 'TipoJoya', 'Estado', 'Descripcion', 'PesoBruto', 'DescuentoPiedra', 'DescuentoSuelda', 'PesoNeto', 'ValorAvaluo', 'ValorComercial', 'ValorRealizacion', 'ValorOro'];
  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();

  // TABLA COBERTURA
  displayedColumnsCobertura = ['plazo', 'montoCredito', 'cuota', 'aRecibirCliente', 'aPagarCliente', 'valorDeDesembolso', 'riesgoAcumulado'];
  dataSourceCobertura = new MatTableDataSource<any>();

  // VARIABLES DE TRACKING
  public horaInicioExcepcion: Date;
  public horaAsignacionExcepcion: Date = null;
  public horaAtencionExcepcion: Date;
  public horaFinalExcepcion: Date = null;
  public procesoExcepcion: string;
  public actividad: string;

  //FORM DATOS CONTACTOS_CLIENTE
  public formDatoContacto: FormGroup = new FormGroup({});
  public telefonoDomicilio = new FormControl('', []);
  public telefonoAdicional = new FormControl('', []);
  public telefonoMovil = new FormControl('', []);
  public telefonoOficinaOtros = new FormControl('', []);
  public correoElectronico = new FormControl('', []);

  //FORM DATOS NEGOCIACION
  public formDatosNegociacion: FormGroup = new FormGroup({});
  public tipoProceso = new FormControl('', []);
  public estadoNegociacion = new FormControl('', []);
  public fechaCreacion = new FormControl('', []);
  public fechaActualizacion = new FormControl('', []);


  // FORM DATOS OPERACION
  public formDatosOperacion: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', []);
  public identificacion = new FormControl('', []);
  public nombreProceso = new FormControl('', []);



  // FORM DATOS EXCEPCION
  public formDatosExcepcion: FormGroup = new FormGroup({});
  public tipoExcepcionCliente: string;
  public observacionAsesor = new FormControl('', []);
  public observacionAprobador = new FormControl('', []);
  public radioB = new FormControl('', []);
  public cobertura = new FormControl('', []);

  constructor(
    private exs: ExcepcionService,
    private tra: TrackingService,
    private par: ParametroService,
    private ing: IntegracionService,
    private vcr: VariablesCrediticiasService,
    private rie: RiesgoAcumuladoService,
    private tas: TasacionService,
    private int: IntegracionService,
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private neg: NegociacionService
  ) {


    // FORM DATOS CONTACTOS_CLIENTE
    this.formDatoContacto.addControl('telefonoDomicilio', this.telefonoDomicilio);
    this.formDatoContacto.addControl('telefonoAdicional', this.telefonoAdicional);
    this.formDatoContacto.addControl('telefonoMovil', this.telefonoMovil);
    this.formDatoContacto.addControl('telefonoOficinaOtros', this.telefonoOficinaOtros);
    this.formDatoContacto.addControl('correoElectronico', this.correoElectronico);

    //FORM DATOS NEGOCIACION
    this.formDatosNegociacion.addControl('tipoProceso', this.tipoProceso);
    this.formDatosNegociacion.addControl('estadoNegociacion', this.estadoNegociacion);
    this.formDatosNegociacion.addControl('fechaCreacion', this.fechaCreacion);
    this.formDatosNegociacion.addControl('fechaActualizacion', this.fechaActualizacion);

    // INPUT VARIABLES CREDITICIAS



    //FORM DATOS EXCEPCION
    this.formDatosExcepcion.addControl('observacionAsesor', this.observacionAsesor);
    this.formDatosExcepcion.addControl('observacionAprobador', this.observacionAprobador);
    this.formDatosExcepcion.addControl('radioB', this.radioB);
    this.formDatosExcepcion.addControl('cobertura', this.cobertura);


    //SECCIONES Y CAMPOS DE LECTURA
    this.formDatosOperacion.disable();
    this.formDatosNegociacion.disable();
    this.formDatoContacto.disable();
    this.observacionAsesor.disable();
  }

  ngOnInit() {

    this.subheaderService.setTitle('Excepción de Cobertura');
    this.loading = this.loadingSubject.asObservable();
    // this.camposDinamicos = false;
    // this.minimoDeCobertura = 80;
    // this.validacionCobertura = false;

    this.capturaHoraInicio('NEGOCIACION');
    this.buscarExcepcion();
    this.buscoDatosFlujo();
    this.capturaDatosTraking();
    // this.usuario = localStorage.getItem(atob(environment.userKey));
    //  console.log('El usuario es excepcion cobertura ----> ', localStorage.getItem(atob(environment.userKey)));
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
        console.log('HORA DE capturaHoraAtencion ==> ', JSON.stringify(hora.entidad));

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
    this.par.findByNombreTipoOrdered('EXCEPCION_COBERTURA', 'TIP-EXC', 'Y').subscribe((data: any) => {
      if (data.entidades) {
        this.actividad = data.entidades[0].nombre;
        this.par.findByNombreTipoOrdered('EXCEPCION_COBERTURA', 'TIP-EXC', 'Y').subscribe((data: any) => {
          if (data.entidades) {
            this.procesoExcepcion = data.entidades[0].nombre;
            this.par.findByNombreTipoOrdered('EXCEPCION_COBERTURA', 'TIP-EXC', 'Y').subscribe((data: any) => {
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

  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Cargando valores para traking desde tabla de parametros
   */

  private buscoDatosFlujo() {
    this.loadingSubject.next(true);
    this.par.findByNombreTipoOrdered('NEGOCIACION', 'ACTIVIDAD', 'Y').subscribe((data: any) => {
      if (data.entidades) {
        this.actividad = data.entidades[0].nombre;
        this.par.findByNombreTipoOrdered('EXCEPCION', 'PROCESO', 'Y').subscribe((data: any) => {
          if (data.entidades) {
            this.procesoExcepcion = data.entidades[0].nombre;
          }
        });
      }
    });
  }

  buscarExcepciones(id: number) {
    console.log('valor del id===> ', id.toString());

    this.exs.findByIdNegociacion(id).subscribe((data: any) => {
      console.log('VALOR DE LA DATA DE LA EXCEPCION ===> ', JSON.stringify(data));
      if (data.list != null && data.list[0] != null) {

        this.listExepcion = data.list[0];
        //  console.log('valor de la llistas', this.listExepcion);
        this.entidadExcepcion = data.list[0];
        this.observacionAsesor.setValue(this.entidadExcepcion.observacionAsesor);
        //  console.log('Observacion Aseseor===> ', this.observacionAsesor);

      }
      // console.log('VALOR DE LA DATA DE LA EXCEPCION ===> ', JSON.stringify(data));

    });

  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Busca dota la informacion relacionada a la excepcion y la imprime en las distintas seciones.
   */
  buscarExcepcion() {
    this.loadingSubject.next(true);
    this.route.paramMap.subscribe((data: any) => {
      data.params.id
      if (data.params.id) {
        this.idNegociacion = data.params.id;
        //console.log('PARAMETRO=====> ', this.idNegociacion);
        this.neg.findNegociacionById(this.idNegociacion).subscribe((data: any) => {
          if (data.entidad) {
            console.log('VALOR DE LA NEGOCIACION findNegociacionById ', JSON.stringify(data));

            this.capturaHoraAsignacion('NEGOCIACION');
            this.entidadNegociacion = data.entidad;
            this.entidadCliente = data.entidad.tbQoCliente;
            this.buscarMensaje();
            console.log('VALORES DE LA ENTIDAD NEGOSCIA==> .id', this.entidadNegociacion.id);
            this.buscarExcepciones(this.entidadNegociacion.id);
            //  console.log('id NEGOCIACION=====> ', this.entidadNegociacion);
            //console.log(' CLIENTE==> ', this.entidadCliente)
            //RECUPERO LA DATA DE VARIABLES
            this.dataPopup = new DataPopup();
            this.dataPopup.idBusqueda = this.entidadNegociacion.id;
            this.dataPopup.isNegociacion = true;
            // this.buscarExcepcion(this.entidadNegociacion.id);
            if (data) {


              this.telefonoDomicilio.setValue(this.entidadNegociacion.tbQoCliente.telefonoFijo);
              this.telefonoMovil.setValue(this.entidadNegociacion.tbQoCliente.telefonoMovil);
              this.telefonoAdicional.setValue(this.entidadNegociacion.tbQoCliente.telefonoAdicional);
              this.telefonoOficinaOtros.setValue(this.entidadNegociacion.tbQoCliente.telefonoTrabajo);
              this.correoElectronico.setValue(this.entidadNegociacion.tbQoCliente.email);
              this.tipoProceso.setValue(this.entidadNegociacion.procesoActual);
              this.estadoNegociacion.setValue(this.entidadNegociacion.situacion);
              this.fechaCreacion.setValue(new Date(this.entidadNegociacion.fechaCreacion));
              this.fechaActualizacion.setValue(new Date(this.entidadNegociacion.fechaActualizacion));
            } else {
              this.sinNoticeService.setNotice('ERROR AL CARGAR CLIENTE 1', 'error');
              this.capturaHoraAtencion('NEGOCIACION');
            }
          }
        });
      } else {
        this.sinNoticeService.setNotice('ERROR AL CARGAR NEGOCIACION', 'error');
        this.capturaHoraAsignacion('NEGOCIACION');
        this.capturaHoraAsignacion('NEGOCIACION');
        this.capturaHoraAtencion('NEGOCIACION');

      }
    });
  }






  public traerEntidadesOpciones(event: Array<OpcionesDeCredito>) {
    this.entidadesOpcionesCreditos = new Array<OpcionesDeCredito>();
    this.entidadesOpcionesCreditos = event;
  }

  private buscarMensaje() {
    this.loadingSubject.next(true);
    const consulta = new PersonaConsulta();

    consulta.identificacion = this.entidadCliente.cedulaCliente;
    this.ing.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {

      if (data.entidad.datoscliente != null) {
        if (data.entidad.mensaje != '') {
          // console.log('DATA EQUIFAX', JSON.stringify(data));
          this.mensaje = data.entidad.mensaje;
          // console.log('BUSCA EN PERSONA CALCULADORA', this.mensaje);
        }
      }
      this.loadingSubject.next(false);
    });
  }

  asignarAprobacion() {
    console.log('ASIGNAR APROBACION');

    if (this.radioB.value === 'APROBADO') {
      this.radioB.setValue(EstadoExcepcionEnum.APROBADO);
    } else if (this.radioB.value === 'NEGADO') {
      this.radioB.setValue(EstadoExcepcionEnum.NEGADO);
    }
    this.entidadExcepcion.estadoExcepcion = this.radioB.value;
    this.entidadExcepcion.observacionAprobador = this.observacionAprobador.value;
  }

  public submit(flujo: string) {
    this.loadingSubject.next(true);
    console.log('INICIA EL SUBMIT', this.entidadExcepcion);
    this.asignarAprobacion();

    this.exs.persistEntity(this.entidadExcepcion).subscribe((data: any) => {
      console.log('ENTIDAD EXCEPCION', JSON.stringify(data));
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

  /*
  enviarRespuesta() {
    this.loadingSubject.next(false);
    if (this.radioB.value != '') {
      if (this.observacionAprobador.value != '') {
        let entidad: TbQoExcepcione = new TbQoExcepcione();
        let entidadIn: TbQoNegociacion = new TbQoNegociacion();
        entidad.id = this.excepcion.id;
        entidad.idAprobador = 0; // To do: Agregar id de aprobador
        entidad.observacionAprobador = this.observacionAprobador.value;
        entidadIn.id = this.negociacion.id;
        entidad.tbQoNegociacion = entidadIn;
 
        if (this.radioB.value == 'Negado') {
          entidad.estadoExcepcion = EstadoExcepcionEnum.NEGADO.toString();
          this.exc.persistEntity(entidad).subscribe((data: any) => {
            this.loadingSubject.next(false);
            console.log('Esto me esta guardando en base ----> ', data);
            this.tra.getSystemDate().subscribe((hora: any) => {
              if (hora.entidad) {
                this.horaFinal = hora.entidad
                if (this.negociacion.id != null) {
                  this.registrarTracking(
                    this.negociacion.id,
                    this.horaInicio,
                    this.horaAsignacion,
                    this.horaAtencion,
                    this.horaFinal
                  );
                } else {
                  this.sinNoticeService.setNotice('NO EXISTE NEGOCIACION PREVIA PARA HACER SEGUIMIENTO DE TRACKING', 'error');
                }
              }
            });
            // falta envio de notificacion
            // Falta redireccion a pantalla principal de excepciones
            // this.router.navigate(['cliente/gestion-cliente', this.negociacion.id]);
          }, error => {
            this.loadingSubject.next(false);
            if (JSON.stringify(error).indexOf('codError') > 0) {
              let b = error.error;
              this.sinNoticeService.setNotice(b.msgError, 'error');
            } else {
              this.sinNoticeService.setNotice('ERROR AL GUARDAR CAMBIOS EN LA EXCEPCION', 'error');
            }
          });
        } else {
          if (this.validacionCobertura) {
            entidad.estadoExcepcion = EstadoExcepcionEnum.APROBADO.toString();
            entidad.caracteristica = this.cobertura.value;
            this.exc.persistEntity(entidad).subscribe((data: any) => {
              this.loadingSubject.next(false);
              console.log('Esto me esta guardando en base ----> ', data);
              this.tra.getSystemDate().subscribe((hora: any) => {
                if (hora.entidad) {
                  this.horaFinal = hora.entidad
                  if (this.negociacion.id != null) {
                    this.registrarTracking(
                      this.negociacion.id,
                      this.horaInicio,
                      this.horaAsignacion,
                      this.horaAtencion,
                      this.horaFinal
                    );
                  } else {
                    this.sinNoticeService.setNotice('NO EXISTE NEGOCIACION PREVIA PARA HACER SEGUIMIENTO DE TRACKING', 'error');
                  }
                }
              });
              // To do: falta envio de notificacion
              // To do: Falta redireccion a pantalla principal de excepciones
              // this.router.navigate(['cliente/gestion-cliente', this.negociacion.id]);
            }, error => {
              this.loadingSubject.next(false);
              if (JSON.stringify(error).indexOf('codError') > 0) {
                let b = error.error;
                this.sinNoticeService.setNotice(b.msgError, 'error');
              } else {
                this.sinNoticeService.setNotice('ERROR AL GUARDAR CAMBIOS EN LA EXCEPCION', 'error');
              }
            });
          } else {
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice('AUN NO HA CONSULTADO LAS OPCIONES DE CREDITO CON LA NUEVA COBERTURA', 'error');
          }
        }
 
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('INGRESE UNA RAZON DE SU RESPUESTA', 'error');
      }
    } else {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice('POR FAVOR MARQUE UNA OPCION CON SU RESPUESA', 'error');
    }
  }*/
  /* * 
  /* @author Jeroham Cadenas - Developer Twuelve
  /* @param codigoRegistro number
  /* @param fechaInicio Date
  /* @param fechaAsignacion Date
  /* @param fechaInicioAtencion Date
  /* @param fechaFin Date
  */
  /* public registrarTracking(codigoRegistro: number, fechaInicio: Date, fechaAsignacion: Date, fechaInicioAtencion: Date, fechaFin: Date) {
     this.loadingSubject.next(true);
     let tracking: TbQoTracking = new TbQoTracking();
     tracking.actividad = this.actividad; // Modulo en ProducBacklog
     tracking.proceso = this.proceso
     tracking.observacion = '';
     tracking.codigoRegistro = codigoRegistro;
     tracking.situacion = SituacionTrackingEnum.EN_PROCESO;
     tracking.usuario = UsuarioEnum.APROBADOR; // Cambiar a usuario actual.
     tracking.fechaInicio = fechaInicio;
     tracking.fechaAsignacion = fechaAsignacion;
     tracking.fechaInicioAtencion = fechaInicioAtencion;
     tracking.fechaFin = fechaFin;
     this.tra.guardarTracking(tracking).subscribe((data: any) => {
       if (data.entidad) {
         console.log(' Tracking creado ------>' + JSON.stringify(data.entidad));
         this.loadingSubject.next(false);
       } else {
         this.loadingSubject.next(false);
         this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO', 'error');
       }
     }, error => {
       this.loadingSubject.next(false);
       if (JSON.stringify(error).indexOf('codError') > 0) {
         let b = error.error;
         this.sinNoticeService.setNotice(b.msgError, 'error');
       } else {
         this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO // ERROR CAPTURADO', 'error');
       }
     });
   }*/
}
