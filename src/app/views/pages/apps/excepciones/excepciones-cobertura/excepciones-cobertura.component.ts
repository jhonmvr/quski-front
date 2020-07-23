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

@Component({
  selector: 'kt-excepciones-cobertura',
  templateUrl: './excepciones-cobertura.component.html',
  styleUrls: ['./excepciones-cobertura.component.scss']
})
export class ExcepcionesCoberturaComponent implements OnInit {
  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public usuario;
  public actividad;
  public proceso;
  // OBJETOS DE ENTIDADES
  private negociacion  : TbQoNegociacion;
  private cliente      : TbQoCliente;
  private excepcion    : TbQoExcepcione;
  private variablesCre : Array<TbQoVariablesCrediticia>;
  private riesgoAcumul : Array<TbQoRiesgoAcumulado>;

  // TABLA DE VARIABLES CREDITICIAS
  displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
  dataSourceVariablesCrediticias = new MatTableDataSource<TbQoVariablesCrediticia>();
  // TABLA RIESGO ACUMULADO
  displayedColumnsRiesgo = ['numeroOperacion', 'valorAlDia', 'valorAlDiaMasCuotaActual', 'valorCancelaPrestamo','valorProyectadoCuotaActual','diasMoraActual','numeroCuotasTotales','numeroOperacionRelacionada','nombreProducto','numeroCuotasFaltantes','primeraCuotaVigente','estadoPrimeraCuotaVigente','numeroGarantiasReales','estadoOperacion','idMoneda'];
  dataSourceRiesgo = new MatTableDataSource<any>();
  
  // VARIABLES DE TRACKING
  public horaInicio      : any;
  public horaAsignacion  : any;
  public horaAtencion    : any = null;
  public horaFinal       : any;
 
  // FORM DATOS OPERACION
  public formDatosOperacion: FormGroup = new FormGroup({});
  public nombresCompletos       = new FormControl('', []);
  public identificacion         = new FormControl('', []);
  public nombreProceso          = new FormControl('', []);
  // FORM DATOS CLIENTE
  public formDatosCliente: FormGroup = new FormGroup({});
  public tipoIdentificacion                   = new FormControl('', []);
  public identificacionC                      = new FormControl('', []);
  public aprobadoWebMupi                      = new FormControl('', []);
  public primerNombre                         = new FormControl('', []);
  public segundoNombre                        = new FormControl('', []);
  public separacionDeBienes                   = new FormControl('', []);
  public apellidoPaterno                      = new FormControl('', []);
  public apellidoMaterno                      = new FormControl('', []);
  public cargaFamiliar                        = new FormControl('', []);
  public genero                               = new FormControl('', []);
  public estadoCivil                          = new FormControl('', []);
  public lugarDeNacimiento                    = new FormControl('', []);
  public fechaDeNacimiento                    = new FormControl('', []);
  public nacionalidad                         = new FormControl('', []);
  public edad                                 = new FormControl('', []);
  public nivelDeEducacion                     = new FormControl('', []);
  public actividadEconomica                   = new FormControl('', []);
  public ultimaFechaDeActualizacionDeCliente  = new FormControl('', []);
  // FORM DATOS CONTACTO
  public formDatosContacto: FormGroup = new FormGroup({});
  public telefonoDomicilio   = new FormControl('', []);
  public telefonoAdicional   = new FormControl('', []);
  public telefonoMovil       = new FormControl('', []);
  public telefonoOficina     = new FormControl('', []);
  public correo              = new FormControl('', []);
  // FORM DATOS NEGOCIACION
  public formDatosNegociacion: FormGroup = new FormGroup({});
  public tipoNegociacion                       = new FormControl('', []);
  public estadoNegociacion                     = new FormControl('', []);
  public fechaDeCreacionNegociacion            = new FormControl('', []);
  public ultimaFechaDeActualizacionNegociacion = new FormControl('', []);

  // FORM DATOS EXCEPCION
  public formDatosExcepcion: FormGroup = new FormGroup({});
  public tipoExcepcionCliente : string;
  public observacionAsesor    = new FormControl('', []);
  public observacionAprobador = new FormControl('', []);
  public radioB               = new FormControl('', []);

  constructor(
    private exc : ExcepcionService,
    private tra : TrackingService,
    private par : ParametroService,
    private vcr : VariablesCrediticiasService,
    private rie : RiesgoAcumuladoService,
    private int : IntegracionService,
    private route : ActivatedRoute,
    private router: Router,
    private subheaderService : SubheaderService,
    private sinNoticeService : ReNoticeService
  ) { 
    //FORM DATOS OPERACION
    this.formDatosOperacion.addControl("nombresCompletos" , this.nombresCompletos);
    this.formDatosOperacion.addControl("identificacion"   , this.identificacion);
    this.formDatosOperacion.addControl("nombreProceso"    , this.nombreProceso);
    //FORM DATOS CLIENTE
    this.formDatosCliente.addControl("tipoIdentificacion" , this.tipoIdentificacion);
    this.formDatosCliente.addControl("identificacionC"    , this.identificacionC);
    this.formDatosCliente.addControl("aprobadoWebMupi"    , this.aprobadoWebMupi);
    this.formDatosCliente.addControl("primerNombre"       , this.primerNombre);
    this.formDatosCliente.addControl("segundoNombre"      , this.segundoNombre);
    this.formDatosCliente.addControl("separacionDeBienes" , this.separacionDeBienes);
    this.formDatosCliente.addControl("apellidoPaterno"    , this.apellidoPaterno);
    this.formDatosCliente.addControl("apellidoMaterno"    , this.apellidoMaterno);
    this.formDatosCliente.addControl("cargaFamiliar"      , this.cargaFamiliar);
    this.formDatosCliente.addControl("genero"             , this.genero);
    this.formDatosCliente.addControl("estadoCivil"        , this.estadoCivil);
    this.formDatosCliente.addControl("lugarDeNacimiento"  , this.lugarDeNacimiento);
    this.formDatosCliente.addControl("fechaDeNacimiento"  , this.fechaDeNacimiento);
    this.formDatosCliente.addControl("nacionalidad"       , this.nacionalidad);
    this.formDatosCliente.addControl("edad"               , this.edad);
    this.formDatosCliente.addControl("nivelDeEducacion"   , this.nivelDeEducacion);
    this.formDatosCliente.addControl("actividadEconomica" , this.actividadEconomica);
    this.formDatosCliente.addControl("ultimaFechaDeActualizacionDeCliente" , this.ultimaFechaDeActualizacionDeCliente);
    //FORM DATOS CONTACTO
    this.formDatosContacto.addControl("telefonoDomicilio" , this.telefonoDomicilio);
    this.formDatosContacto.addControl("telefonoAdicional" , this.telefonoAdicional);
    this.formDatosContacto.addControl("telefonoMovil"     , this.telefonoMovil);
    this.formDatosContacto.addControl("telefonoOficina"   , this.telefonoOficina);
    this.formDatosContacto.addControl("correo"            , this.correo);
    //FORM DATOS NEGOCIACION
    this.formDatosNegociacion.addControl("tipoNegociacion"            , this.tipoNegociacion);
    this.formDatosNegociacion.addControl("estadoNegociacion"          , this.estadoNegociacion);
    this.formDatosNegociacion.addControl("fechaDeCreacionNegociacion" , this.fechaDeCreacionNegociacion);
    this.formDatosNegociacion.addControl("ultimaFechaDeActualizacionNegociacion" , this.ultimaFechaDeActualizacionNegociacion);
    //FORM DATOS EXCEPCION
    this.formDatosExcepcion.addControl("observacionAsesor"    , this.observacionAsesor);
    this.formDatosExcepcion.addControl("observacionAprobador" , this.observacionAprobador);
    this.formDatosExcepcion.addControl("excCheck" , this.radioB);
    
    
    //SECCIONES Y CAMPOS DE LECTURA
    this.formDatosOperacion.disable();
    this.formDatosCliente.disable();
    this.formDatosContacto.disable();
    this.formDatosNegociacion.disable();
    this.observacionAsesor.disable();
  }

  ngOnInit() {
    this.usuario = localStorage.getItem(atob(environment.userKey));
    console.log('El usuario es ----> ',localStorage.getItem(atob(environment.userKey)));
    this.subheaderService.setTitle("Excepciones de Negociacion");
    this.loading = this.loadingSubject.asObservable();
    this.buscoDatosFlujo();
    //TRACKING
    this.tra.getSystemDate().subscribe( (hora: any) =>{if(hora.entidad){ this.horaInicio = hora.entidad;}});
    this.buscarExcepcion();
  }
    /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Metodo de Tracking
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
  private buscoDatosFlujo(){
    this.loadingSubject.next(true);
    this.par.findByNombreTipoOrdered("NEGOCIACION","ACTIVIDAD","Y").subscribe((data : any) =>{
      if (data.entidades) {
        this.actividad = data.entidades[0].nombre;
        console.log('Mi ACTIVIDAD actual -----> ', data.entidades[0].nombre);
        this.par.findByNombreTipoOrdered("EXCEPCION","PROCESO","Y").subscribe((data : any) =>{
          if (data.entidades) {
            this.proceso = data.entidades[0].nombre;
            console.log('Mi PROCESO actual -----> ', data.entidades[0].nombre);
          }
        });
      }
    });
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Busca dota la informacion relacionada a la excepcion y la imprime en las distintas seciones.
   */
  buscarExcepcion() {
    this.loadingSubject.next(true);
    this.route.paramMap.subscribe((json: any) => {
      json.params.id
      if (json.params.id) {
        this.exc.getEntity(json.params.id).subscribe( (json : any) =>{
          if(json.entidad){
            this.excepcion = json.entidad;
            this.negociacion = this.excepcion.tbQoNegociacion;
            this.cliente  = this.negociacion.tbQoCliente;
            
            // FORM OPERACION
            this.nombreProceso.setValue(this.negociacion.procesoActualNegociacion);
            this.nombresCompletos.setValue(this.cliente.primerNombre + ' ' + this.cliente.segundoNombre+ ' ' + this.cliente.apellidoPaterno + ' ' + this.cliente.apellidoMaterno);
            this.identificacion.setValue(this.cliente.cedulaCliente);
            
            // FORM CLIENTE
            this.tipoIdentificacion.setValue(TipoIdentificacionEnum.CEDULA);
            this.identificacionC.setValue(this.cliente.cedulaCliente);
            this.aprobadoWebMupi.setValue(this.cliente.aprobacionMupi);
            this.primerNombre.setValue(this.cliente.primerNombre);
            this.segundoNombre.setValue(this.cliente.segundoNombre);
            this.separacionDeBienes.setValue(this.cliente.separacionBienes);
            this.apellidoPaterno.setValue(this.cliente.apellidoPaterno);
            this.apellidoMaterno.setValue(this.cliente.apellidoMaterno);
            this.cargaFamiliar.setValue(this.cliente.cargasFamiliares);
            this.genero.setValue(this.cliente.genero);
            this.estadoCivil.setValue(this.cliente.estadoCivil);
            this.lugarDeNacimiento.setValue(this.cliente.lugarNacimiento);
            this.fechaDeNacimiento.setValue(this.cliente.fechaNacimiento);
            this.nacionalidad.setValue(this.cliente.nacionalidad);
            this.edad.setValue(this.cliente.edad);
            this.nivelDeEducacion.setValue(this.cliente.nivelEducacion);
            this.actividadEconomica.setValue(this.cliente.actividadEconomica);
            this.ultimaFechaDeActualizacionDeCliente.setValue(this.cliente.fechaActualizacion);
            // FORM CONTACTO
            this.telefonoAdicional.setValue(this.cliente.telefonoAdicional);
            this.telefonoDomicilio.setValue(this.cliente.telefonoFijo);
            this.telefonoMovil.setValue(this.cliente.telefonoMovil);
            this.telefonoOficina.setValue(this.cliente.telefonoTrabajo);
            this.correo.setValue(this.cliente.email);
            // FORM DATOS NEGOCIACION
            this.tipoNegociacion.setValue( this.negociacion.tipoNegociacion );
            this.estadoNegociacion.setValue( this.negociacion.estadoNegociacion );
            this.fechaDeCreacionNegociacion.setValue( this.negociacion.fechaCreacion );
            this.ultimaFechaDeActualizacionNegociacion.setValue( this.negociacion.fechaActualizacion );
            //FORM DATOS EXCEPCION
            if(this.excepcion.observacionAsesor != ''){
              this.observacionAsesor.setValue(this.excepcion.observacionAsesor.toUpperCase());
            }
            this.int.getInformacionPersonaCalculadora('C', this.cliente.cedulaCliente,'CC','N').subscribe( (data : any) =>{
              if (data.entidad.codigoError == 3) {
                // console.log("codigoError -----> ", JSON.stringify(data.entidad.mensaje));
                this.tipoExcepcionCliente = data.entidad.mensaje.toUpperCase();
                // FORM DE VARIABLES CREDITICIAS
                this.vcr.variablesCrediticiaByIdNegociacion ( this.negociacion.id.toString() ).subscribe((data : any) =>{
                  if (data) {
                    this.variablesCre = new Array<TbQoVariablesCrediticia>(); 
                    data.forEach(vCre => {
                      this.variablesCre.push( vCre);
                    });
                    this.dataSourceVariablesCrediticias.data = this.variablesCre;
                    // FORM DE RIESGO ACUMULADO
                    this.rie.findRiesgoAcumuladoByIdCliente ( this.cliente.id.toString() ).subscribe((data : any) =>{
                      if (data) {
                        this.riesgoAcumul = new Array<TbQoRiesgoAcumulado>(); 
                        data.forEach(rAcu => {
                          this.riesgoAcumul.push( rAcu);
                        });
                        this.dataSourceRiesgo.data = this.riesgoAcumul;
                        this.tra.getSystemDate().subscribe( (hora: any) =>{
                          if(hora.entidad){
                            this.loadingSubject.next(false);
                            this.horaAsignacion = hora.entidad;
                          }
                        });
                      } else {
                        this.tra.getSystemDate().subscribe( (hora: any) =>{
                          if(hora.entidad){
                            this.loadingSubject.next(false);
                            this.horaAsignacion = hora.entidad;
                          }
                        });
                        this.sinNoticeService.setNotice('ERROR AL CARGAR DATOS DEL RIESGO ACUMULADO ELSE', 'error');
                      }
                    }, error =>{
                      this.tra.getSystemDate().subscribe( (hora: any) =>{
                        if(hora.entidad){
                          this.loadingSubject.next(false);
                          this.horaAsignacion = hora.entidad;
                        }
                      });
                      if (JSON.stringify(error).indexOf("codError") > 0) {
                        let b = error.error;
                        this.sinNoticeService.setNotice(b.msgError, 'error');
                      } else {
                        this.sinNoticeService.setNotice('ERROR AL CARGAR DATOS DEL RIESGO ACUMULADO', 'error');
                      }
                    });
                  } else {
                    this.tra.getSystemDate().subscribe( (hora: any) =>{
                      if(hora.entidad){
                        this.loadingSubject.next(false);
                        this.horaAsignacion = hora.entidad;
                      }
                    });
                    this.sinNoticeService.setNotice('ERROR AL CARGAR DATOS DE LAS VARIABLES CREDITICIAS ELSE', 'error');
                  }
                }, error =>{
                  this.tra.getSystemDate().subscribe( (hora: any) =>{
                    if(hora.entidad){
                      this.loadingSubject.next(false);
                      this.horaAsignacion = hora.entidad;
                    }
                  });
                  if (JSON.stringify(error).indexOf("codError") > 0) {
                    let b = error.error;
                    this.sinNoticeService.setNotice(b.msgError, 'error');
                  } else {
                    this.sinNoticeService.setNotice('ERROR AL CARGAR DATOS DE LAS VARIABLES CREDITICIAS', 'error');
                  }
                });
              } else {
                this.tra.getSystemDate().subscribe( (hora: any) =>{
                  if(hora.entidad){
                    this.loadingSubject.next(false);
                    this.horaAsignacion = hora.entidad;
                  }
                });
                this.sinNoticeService.setNotice('ERROR AL CARGAR LA EXCEPCION CALCULADORA ELSE', 'error');
              }
            }, error =>{
              this.tra.getSystemDate().subscribe( (hora: any) =>{
                if(hora.entidad){
                  this.loadingSubject.next(false);
                  this.horaAsignacion = hora.entidad;
                }
              });
              if (JSON.stringify(error).indexOf("codError") > 0) {
                let b = error.error;
                this.sinNoticeService.setNotice(b.msgError, 'error');
              } else {
                this.sinNoticeService.setNotice('ERROR AL CARGAR LA EXCEPCION CALCULADORA', 'error');
              }
            });
          }else {
            this.sinNoticeService.setNotice('ERROR AL CARGAR DATOS DE LA EXCEPCION ELSE', 'error');
            this.tra.getSystemDate().subscribe( (hora: any) =>{
              if(hora.entidad){
                this.loadingSubject.next(false);
                this.horaAsignacion = hora.entidad;
              }
            });
          }
        }, error => {
          this.tra.getSystemDate().subscribe( (hora: any) =>{
            if(hora.entidad){
              this.horaAsignacion = hora.entidad;
              this.loadingSubject.next(false);
            }
          });
          if (JSON.stringify(error).indexOf("codError") > 0) {
            let b = error.error;
            this.sinNoticeService.setNotice(b.msgError, 'error');
          } else {
            this.sinNoticeService.setNotice('ERROR AL CARGAR DATOS DE LA EXCEPCION', 'error');
          }
        }); 
      }            
    });
  }
  enviarRespuesta(){
    this.loadingSubject.next(false);
    if (this.radioB.value != "") {
      if(this.observacionAprobador.value != ""){
        let entidad : TbQoExcepcione = new TbQoExcepcione();
        let entidadInterna : TbQoNegociacion = new TbQoNegociacion();

        entidad.id = this.excepcion.id;
        if ( this.radioB.value === "Negado" ) {
          entidad.estadoExcepcion = EstadoExcepcionEnum.NEGADO.toString();
        }
        if ( this.radioB.value === "Aprobabo" ) {
          entidad.estadoExcepcion = EstadoExcepcionEnum.APROBADO.toString();
        }
        console.log(" Informacion del usuario ----> ", this.usuario);
        
        entidad.idAprobador = 0;
        entidad.observacionAprobador = this.observacionAprobador.value;
        entidadInterna.id = this.negociacion.id;
        entidad.tbQoNegociacion = entidadInterna;

        this.exc.persistEntity ( entidad ).subscribe((data : any) =>{
          this.loadingSubject.next(false);
          console.log("Esto me esta guardando en base ----> ", data);
          this.tra.getSystemDate().subscribe( (hora: any) =>{
            if(hora.entidad){
              this.horaFinal = hora.entidad
              if ( this.negociacion.id != null ) {
                this.registrarTracking(
                  this.negociacion.id,
                  this.horaInicio,
                  this.horaAsignacion,
                  this.horaAtencion,
                  this.horaFinal
                );
              } else{
                this.sinNoticeService.setNotice("NO EXISTE NEGOCIACION PREVIA PARA HACER SEGUIMIENTO DE TRACKING", 'error');
              }   
            }
          });
          // falta envio de notificacion
          // Falta redireccion a pantalla principal de excepciones
          // this.router.navigate(['cliente/gestion-cliente', this.negociacion.id]);

        }, error =>{
          this.loadingSubject.next(false);
          if (JSON.stringify(error).indexOf("codError") > 0) {
            let b = error.error;
            this.sinNoticeService.setNotice(b.msgError, 'error');
          } else {
            this.sinNoticeService.setNotice('ERROR AL GUARDAR CAMBIOS EN LA EXCEPCION', 'error');
          }
        });
      } else{
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('INGRESE UNA RAZON DE SU RESPUESTA', 'error');
      }
    } else {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice('POR FAVOR MARQUE UNA OPCION CON SU RESPUESA', 'error');
    }
  }
   /**
   * 
   * @author Jeroham Cadenas - Developer Twuelve
   * @param codigoRegistro string
   * @param fechaInicio Date
   * @param fechaAsignacion Date
   * @param fechaInicioAtencion Date
   * @param fechaFin Date
   */
  public registrarTracking (codigoRegistro: number, fechaInicio: Date, fechaAsignacion: Date, fechaInicioAtencion: Date, fechaFin: Date){
    this.loadingSubject.next(true);
    let tracking : TbQoTracking   = new TbQoTracking();
    tracking.actividad            = this.actividad; // Modulo en ProducBacklog
    tracking.proceso              = this.proceso              
    tracking.observacion          = "";
    tracking.codigoRegistro       = codigoRegistro.toString();
    tracking.situacion            = SituacionTrackingEnum.EN_PROCESO;
    tracking.usuario              = UsuarioEnum.APROBADOR; // Cambiar a usuario actual.
    tracking.fechaInicio          = fechaInicio;
    tracking.fechaAsignacion      = fechaAsignacion;
    tracking.fechaInicioAtencion  = fechaInicioAtencion;
    tracking.fechaFin             = fechaFin;
    this.tra.guardarTracking(tracking).subscribe((data:any) =>{
      if (data.entidad) {
        console.log(" Tracking creado ------>" + JSON.stringify(data.entidad));
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO", 'error');
      }
    }, error =>{
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("ERROR AL GUARDAR TRACKING DE GESTION CLIENTE EN METODO // ERROR CAPTURADO", 'error');
      }
    });
  }
}
