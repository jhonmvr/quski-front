import { Component, OnInit } from '@angular/core';
import { TbQoVariableCrediticia } from '../../../../../core/model/quski/TbQoVariableCrediticia';
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

@Component({
  selector: 'kt-excepciones-cliente',
  templateUrl: './excepciones-cliente.component.html',
  styleUrls: ['./excepciones-cliente.component.scss']
})
export class ExcepcionesClienteComponent implements OnInit {
  // STANDARD VARIABLES
  private idNegociacion : string;
  private cedulaCliente : string;
  private idCliente     : string
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // TABLA DE VARIABLES CREDITICIAS
  displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
  dataSourceVariablesCrediticias = new MatTableDataSource<TbQoVariableCrediticia>();
  // TABLA RIESGO ACUMULADO
  displayedColumnsRiesgo = ['NumeroOperacion', 'TipoOferta', 'Vencimiento', 'Cuotas','CapitaInicial','SaldoCapital','Plazo','FechaAprobacion','FechaFinalCredito','DiasMora','ValorCuota','MotivoBloqueo','TotalCredito','CoberturaAnterior','CoverturaVigente','DeudaTotal','TotalSaldo','RiesgoTotalCliente'];
  dataSourceRiesgo = new MatTableDataSource<any>();
  
  // VARIABLES DE TRACKING
  public horaInicio      : any;
  public horaAsignacion  : any;
  public horaAtencion    : any;
  public horaFinal       : any;

  // OBJETOS DE ENTIDADES
  public objCliente       : TbQoCliente;
  public objNegociacion   : TbQoNegociacion;
  public objVariablesC    : TbQoVariableCrediticia;

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
  public tipoProcesoNegociacion                = new FormControl('', []);
  public estadoNegociacion                     = new FormControl('', []);
  public fechaDeCreacionNegociacion            = new FormControl('', []);
  public ultimaFechaDeActualizacionNegociacion = new FormControl('', []);

  // FORM DATOS EXCEPCION
  public formDatosExcepcion: FormGroup = new FormGroup({});
  public observacionAsesor    = new FormControl('', []);
  public excAprobada          = new FormControl('', []);
  public excNegada            = new FormControl('', []);
  public observacionAprobador = new FormControl('', []);
  constructor(
    private neg : NegociacionService,
    private cli : ClienteService,
    private tra : TrackingService,
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
    this.formDatosNegociacion.addControl("tipoProcesoNegociacion"     , this.tipoProcesoNegociacion);
    this.formDatosNegociacion.addControl("estadoNegociacion"          , this.estadoNegociacion);
    this.formDatosNegociacion.addControl("fechaDeCreacionNegociacion" , this.fechaDeCreacionNegociacion);
    this.formDatosNegociacion.addControl("ultimaFechaDeActualizacionNegociacion" , this.ultimaFechaDeActualizacionNegociacion);
    //FORM DATOS EXCEPCION
    this.formDatosExcepcion.addControl("observacionAsesor"    , this.observacionAsesor);
    this.formDatosExcepcion.addControl("excAprobada"          , this.excAprobada);
    this.formDatosExcepcion.addControl("excNegada"            , this.excNegada);
    this.formDatosExcepcion.addControl("observacionAprobador" , this.observacionAprobador);
    
    //SECCIONES Y CAMPOS DE LECTURA
    this.formDatosOperacion.disable();
    this.formDatosCliente.disable();
    this.formDatosContacto.disable();
    this.formDatosNegociacion.disable();
    this.observacionAsesor.disable();
  }

  ngOnInit() {
    //TRACKING
    this.tra.getSystemDate().subscribe( (hora: any) =>{
      if(hora.entidad){
        this.horaInicio = hora.entidad;
      }
    });
    this.clienteNegociacion();
    this.subheaderService.setTitle("Gestion de Clientes");
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
        this.neg.findNegociacionById(this.idNegociacion).subscribe((data: any) => {
          if (data.entidad) {
            //TRACKING
            this.tra.getSystemDate().subscribe( (hora: any) =>{
              if(hora.entidad){
                this.horaAsignacion = hora.entidad;
              }
            });
            this.cedulaCliente = data.entidad.tbQoCliente.cedulaCliente;
            this.cli.findClienteByIdentificacion(this.cedulaCliente).subscribe((data: any) => {
              this.loadingSubject.next(false);
              if (data.entidad) {
                // FORM OPERACION
                this.nombresCompletos.setValue(data.entidad.primerNombre + ' ' + data.entidad.segundoNombre
                + ' ' + data.entidad.apellidoPaterno + ' ' + data.entidad.apellidoMaterno);
                this.idCliente = data.entidad.id;
                this.identificacion.setValue(data.entidad.cedulaCliente);
                this.nombreProceso.setValue('');
                // FORM CLIENTE
                this.tipoIdentificacion.setValue(TipoIdentificacionEnum.CEDULA);
                this.identificacionC.setValue(data.entidad.cedulaCliente);
                this.aprobadoWebMupi.setValue(data.entidad.aprobadoWebMupi)
                this.primerNombre.setValue(data.entidad.primerNombre);
                this.segundoNombre.setValue(data.entidad.segundoNombre);
                this.separacionDeBienes.setValue(data.entidad.separacionBienes);
                this.apellidoPaterno.setValue(data.entidad.apellidoPaterno);
                this.apellidoMaterno.setValue(data.entidad.apellidoMaterno);
                this.cargaFamiliar.setValue(data.entidad.cargasFamiliares);
                this.genero.setValue(data.entidad.genero);
                this.estadoCivil.setValue(data.entidad.estadoCivil);
                this.lugarDeNacimiento.setValue(data.entidad.lugarNacimiento);
                this.fechaDeNacimiento.setValue(data.entidad.fechaNacimiento);
                this.nacionalidad.setValue(data.entidad.nacionalidad);
                this.edad.setValue(data.entidad.edad);
                this.nivelDeEducacion.setValue(data.entidad.nivelEducacion);
                this.actividadEconomica.setValue(data.entidad.actividadEconomica);
                this.ultimaFechaDeActualizacionDeCliente.setValue(data.entidad.fechaActualizacion);
                // FORM CONTACTO
                this.telefonoDomicilio.setValue(data.entidad.telefonoFijo);
                this.telefonoAdicional.setValue(data.entidad.telefonoAdicional);
                this.telefonoMovil.setValue(data.entidad.telefonoMovil);
                this.telefonoOficina.setValue(data.entidad.telefonoTrabajo);
                this.correo.setValue(data.entidad.email);
              } else {
                this.sinNoticeService.setNotice('ERROR AL CARGAR CLIENTE', 'error');
              }
            }, error => {
              this.loadingSubject.next(false);
              if (JSON.stringify(error).indexOf("codError") > 0) {
                let b = error.error;
                this.sinNoticeService.setNotice(b.msgError, 'error');
              } else {
                this.sinNoticeService.setNotice('ERROR AL CARGAR CLIENTE', 'error');
              }
            });
          } else {
            this.sinNoticeService.setNotice('ERROR AL CARGAR NEGOCIACION', 'error');
            this.tra.getSystemDate().subscribe( (hora: any) =>{
              if(hora.entidad){
                ////console.log("Hora del core ----> " + JSON.stringify(hora.entidad));
                this.horaAsignacion = hora.entidad;
              }
            });
          }
        });
      } else {
        this.sinNoticeService.setNotice('ERROR AL CARGAR EXCEPCION', 'error');
        this.tra.getSystemDate().subscribe( (hora: any) =>{
          if(hora.entidad){
            ////console.log("Hora del core ----> " + JSON.stringify(hora.entidad));
            this.horaAsignacion = hora.entidad;
            this.horaAtencion = hora.entidad;
          }
        });
      }
    });
  }
}
