import { EstadoExcepcionEnum } from './../../../../../core/enum/EstadoExcepcionEnum';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { TbQoNegociacion } from '../../../../../core/model/quski/TbQoNegociacion';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
  selector: 'kt-excepciones-cliente',
  templateUrl: './excepciones-cliente.component.html',
  styleUrls: ['./excepciones-cliente.component.scss']
})
export class ExcepcionesClienteComponent implements OnInit {
  //[x: string]: any;
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

  riesgos;

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
  public observacionAprobador = new FormControl('', [Validators.required]);
  public radioB = new FormControl('', []);
  public usuarioAsesor = new FormControl('', []);
 

  excepcion: TbQoExcepcion;

  constructor(
    private neg: NegociacionService,
    private cli: ClienteService,
    private tra: TrackingService,
    private pro: ProcesoService,
    private route: ActivatedRoute,
    private exs: ExcepcionService,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService
  ) {
    this.neg.setParameter();
    this.cli.setParameter();
    this.tra.setParameter();
    this.pro.setParameter();
    this.exs.setParameter();

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
    this.formDatosExcepcion.addControl("usuarioAsesor", this.usuarioAsesor);

    //SECCIONES Y CAMPOS DE LECTURA
    this.formDatosOperacion.disable();
    this.formDatosCliente.disable();
    this.formDatosContacto.disable();
    this.formDatosNegociacion.disable();
    this.observacionAsesor.disable();
    this.usuarioAsesor.disable();
  }

  ngOnInit() {
    this.neg.setParameter();
    this.cli.setParameter();
    this.tra.setParameter();
    this.pro.setParameter();
    this.exs.setParameter();
    this.loading = this.loadingSubject.asObservable();
    //TRACKING
    //this.capturaHoraInicio('NEGOCIACION');
    //this.clienteNegociacion();
    this.busquedaNegociacion();
    this.subheaderService.setTitle("Excepciones de Negociación");
    //this.capturaDatosTraking();
    
  }
  private capturaHoraInicio(etapa: string) {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.horaInicioExcepcion = hora.entidad;
      }

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

  private busquedaNegociacion(){
    //this.loadingSubject.next(true);
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        let excepcionRol = JSON.parse(atob(data.params.id));
        this.observacionAsesor.setValue(excepcionRol.observacionAsesor);
        this.mensaje = excepcionRol.mensajeBre;
        this.neg.traerNegociacionExistente(excepcionRol.idNegociacion).subscribe( (data: any)=>{
          if(data.entidad){
            this.excepcion = data.entidad.excepciones.find(e => e.id == excepcionRol.id ); 
            this.usuarioAsesor.setValue( this.excepcion.idAsesor );
            this.entidadCliente = data.entidad.credito.tbQoNegociacion.tbQoCliente;
            this.riesgos = data.entidad.riesgos;
            this.entidadNegociacion = data.entidad.credito.tbQoNegociacion;
            this.nombresCompletos.setValue(this.entidadCliente.nombreCompleto);
            this.idCliente = this.entidadCliente.id;
            this.identificacion.setValue(this.entidadCliente.cedulaCliente);
            this.procesoEntidad = data.entidad.proceso;
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
            //console.log('ID DE NEGOCIACION DATAPOPUP', this.entidadNegociacion.id);
            //INPUT RIESGO ACUMULADO

            // FORM CONTACTO
            let idtlf = 0;
      
            this.correo.setValue(this.entidadCliente.email);
            //FORM DATOS NEGOCIACION
            this.estadoNegociacion.setValue(this.procesoEntidad.estadoProceso);
            this.nombreProceso.setValue(this.procesoEntidad.proceso);
            this.fechaDeCreacionNegociacion.setValue(new Date(this.entidadNegociacion.fechaCreacion));
            this.ultimaFechaDeActualizacionNegociacion.setValue(new Date(this.entidadNegociacion.fechaActualizacion));
          }else{
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice('ERROR CARGANDO NEGOCIACION','error');
          }
        });
      }
    }, error =>{this.loadingSubject.next(false)});
  }


  /******************************************** @EVENT   *********************************************************/

  public submit(flujo: string) {
  }
  /**
   * @description METODO QUE BUSCA EL CLIENTE MEDIANTE LA VARIABLE DE ID NEGOCIACION
   * @description PASADA POR this.route.paramMap
   */
  clienteNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      data.params.id
      if (data.params.id) {
        this.excepcion = JSON.parse(atob(data.params.id));
        this.idNegociacion = this.excepcion.tbQoNegociacion.id;
        this.pro.findByIdReferencia(this.idNegociacion, "NUEVO").subscribe( (dataProceso: any)=>{
          if(dataProceso.entidad != null){
            this.procesoEntidad = dataProceso.entidad;
            this.neg.traerNegociacionExistente(this.idNegociacion).subscribe((data: any) => {
    
              this.wrapper = data.entidad;
              this.entidadNegociacion = this.wrapper.credito.tbQoNegociacion
              this.observacionAsesor.setValue(this.excepcion.observacionAsesor);
              
    
              if (data.entidad) {
                this.cli.findClienteByIdentificacion(this.entidadNegociacion.tbQoCliente.cedulaCliente).subscribe((data: any) => {
                  this.entidadCliente = data.entidad;
                  this.loadingSubject.next(false);
                  if (data) {
                    // FORM OPERACION
                    this.nombresCompletos.setValue(this.entidadCliente.nombreCompleto);
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
                    //console.log('ID DE NEGOCIACION DATAPOPUP', this.entidadNegociacion.id);
                    //INPUT RIESGO ACUMULADO
    
                    // FORM CONTACTO
                    let idtlf = 0;
              
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
             
    
              }
            });
          }else{
            this.sinNoticeService.setNotice('ERROR AL CARGAR NEGOCIACION', 'error');
          }
        });
      } else {
        this.sinNoticeService.setNotice('ERROR AL CARGAR EXCEPCION', 'error');
      
      }
    });
  }



  aprobarExcepcion(aprueba){
    if(this.observacionAprobador.invalid){
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL LOS CAMPOS OBLIGATORIOS','warning');
      return;
    }
    this.exs.aprobarExcepcion(this.excepcion.id,this.observacionAprobador.value,aprueba).subscribe(p=>{
      this.router.navigate(['../../aprobador/bandeja-excepciones']);
    },error=>{
      this.router.navigate(['../../aprobador/bandeja-excepciones']);
    });
  }

 

}
