import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DataInjectExcepciones } from '../../../../../core/model/wrapper/DataInjectExcepciones';
import { TituloExcepcionEnum } from '../../../../../core/enum/TituloExcepcion ';
import { MensajeExcepcionEnum } from '../../../../../core/enum/MensajeExcepcion';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { BehaviorSubject } from 'rxjs';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { AuthDialogComponent } from '../../auth-dialog/auth-dialog.component';
import { TbQoExcepcione } from '../../../../../core/model/quski/TbQoExcepcione';
import { environment } from '../../../../../../../src/environments/environment';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { TbQoNegociacion } from '../../../../../core/model/quski/TbQoNegociacion';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'kt-solicitud-de-excepciones',
  templateUrl: './solicitud-de-excepciones.component.html',
  styleUrls: ['./solicitud-de-excepciones.component.scss']
})
export class SolicitudDeExcepcionesComponent implements OnInit {
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public usuario;
  public titulo: string;
  public mensaje: string;
  private tipoExcep: string; 
  public bre: string; 
  public subBotones: boolean;
  public abrirSubBotones: boolean = false;
  private catTiposExcepciones: Array<any>;

  // FORMULARIO BUSQUEDA
  public formExcepciones: FormGroup = new FormGroup({});
  public observacionAsesor = new FormControl('', [Validators.required,Validators.maxLength(200)]);

  constructor( 
    @Inject(MAT_DIALOG_DATA) private dataExcepciones: DataInjectExcepciones,
    public  dialogRef: MatDialogRef<SolicitudDeExcepcionesComponent>,
    private sinNotSer: ReNoticeService, 
    private dialog: MatDialog, 
    private neg: NegociacionService,
    private exc: ExcepcionService,
    private par: ParametroService,
    ) { 
    this.formExcepciones.addControl("observacionAsesor", this.observacionAsesor);
  }

  ngOnInit() {
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.buscarCatalogosTipoExcepcion();
    this.inicioDeFlujo(this.dataExcepciones);
  }

  private inicioDeFlujo(dataExcepciones: DataInjectExcepciones) {
    dataExcepciones.isRiesgo? this.solitudRiesgo(dataExcepciones):
      dataExcepciones.isCobertura? this.solitudCobertura(dataExcepciones):
        dataExcepciones.isCliente? this.solitudCliente(dataExcepciones): this.mostrarError("Tipo de excepcion no definida.");
  }
  private solitudRiesgo(dataExcepciones: DataInjectExcepciones) {
    this.titulo     = TituloExcepcionEnum.RIESGO;
    this.mensaje    = MensajeExcepcionEnum.RIESGO;
    this.bre        = dataExcepciones.mensajeBre;
    this.subBotones = true;
    this.abrirSubBotones = false;
    
  }
  private solitudCobertura(dataExcepciones: DataInjectExcepciones) {
    this.titulo   = TituloExcepcionEnum.COBERTURA;
    this.mensaje  = MensajeExcepcionEnum.COBERTURA;
    this.bre        = null;
    this.subBotones = false;
    this.abrirSubBotones = true;

  }
  private solitudCliente(dataExcepciones: DataInjectExcepciones) {
    this.titulo   = TituloExcepcionEnum.CLIENTE;
    this.mensaje  = MensajeExcepcionEnum.CLIENTE;
    this.bre        = dataExcepciones.mensajeBre;
    this.subBotones = true;
    this.abrirSubBotones = false;

  }
  private mostrarError(mensaje: string) {
    this.sinNotSer.setNotice(mensaje,'error')
    this.salir(null);

  }
  private buscarCatalogosTipoExcepcion() {
    this.par.findByTipo("TIP-EXC").subscribe( (data: any) =>{
      this.loadingSubject.next(true);
      if(data.entidades){
        this.catTiposExcepciones = data.entidades;
        this.seleccionarTipo();
      } else{
        this.sinNotSer.setNotice('ERROR EN BASE PARA TRAER LA LISTA DE CATALOGOS','error');
      }
      this.loadingSubject.next(false)
    }, error=>{this.capturaError(error); this.loadingSubject.next(false)});
  }
  enviarSolicitud(){
    if(this.formExcepciones.valid){
      this.loadingSubject.next(true);
      const excepcion: TbQoExcepcione = new TbQoExcepcione();
      excepcion.idAsesor = this.usuario;
      excepcion.tipoExcepcion = this.tipoExcep;
      excepcion.observacionAsesor = this.observacionAsesor.value;
      excepcion.caracteristica = this.dataExcepciones.mensajeBre; // TODO: Cambiar a campo de mensaje de bre. 
      excepcion.tbQoNegociacion = new TbQoNegociacion();
      excepcion.tbQoNegociacion.id = this.dataExcepciones.idNegociacion;
      this.exc.persistEntity(excepcion).subscribe( (data:any)=>{
        if(data.entidad){
          this.sinNotSer.setNotice('LA SOLICITUD A SIDO GENERADA CON EXITO, ESPERE RESPUESTA DEL APROBADOR','success');
          this.salir(data.entidad);
        } else{
          this.sinNotSer.setNotice('ERROR AL GENERAR SOLICITUD','error');

        }
      }, error=>{ this.capturaError(error); this.loadingSubject.next(false)});   
    }else {
      this.sinNotSer.setNotice('EL CAMPO DE OBSERVACION ES OBLIGATORIO','error');
    }
  }
  private seleccionarTipo(){
    if(this.dataExcepciones.isRiesgo){
      this.catTiposExcepciones.forEach(e=>{
        if(e.nombre === "EXCEPCION_RIESGO_ACUMULADO"){
          console.log("---> EXCEPCION_RIESGO_ACUMULADO")
          this.tipoExcep = e.nombre;
        }
      });
    } else if(this.dataExcepciones.isCobertura){
      this.catTiposExcepciones.forEach(e=>{
        if(e.nombre === "EXCEPCION_COBERTURA"){
          console.log("---> ",e.nombre)
          this.tipoExcep = e.nombre;
        }
      });
    } else if( this.dataExcepciones.isCliente){
      this.catTiposExcepciones.forEach(e=>{
        if(e.nombre === "EXCEPCION_CLIENTE"){
          console.log("---> EXCEPCION_CLIENTE")
          this.tipoExcep = e.nombre;
        }
      });
    } else{
      this.mostrarError("Tipo de excepcion no definida.");
      this.tipoExcep = null;
    }
  }
  private salir(result: TbQoExcepcione) {
    this.dialogRef.close(result);
  }
  public abrirSubBotonesM() {
    console.log("Holis?")
    this.abrirSubBotones = true;
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
  public getErrorMessage(pfield: string) {
    const errorRequerido = 'El campo de observacion es obligatorio';
    const errorLogitudExedida = 'La longitud sobrepasa el limite de 200 caracteres';
    if (pfield && pfield === "observacionAsesor") {
      const input = this.formExcepciones.get("observacionAsesor");
      return input.hasError("required")? errorRequerido: input.hasError("maxlength")? errorLogitudExedida: "";
    }
  }
}
