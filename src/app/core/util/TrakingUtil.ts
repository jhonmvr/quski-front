import { environment } from '../../../environments/environment';
import { SituacionEnum } from '../enum/SituacionEnum';
import { TbQoTracking } from '../model/quski/TbQoTracking';
import { TrackingService } from '../services/quski/tracking.service';

/**
* @author Jeroham Cadenas - Developer Twelve
* @description Clase que registra el tracking de una seccion
*/
export class TrackingUtil{
  private tra: TrackingService;
  private t: TbQoTracking;
  constructor(actividad: string, proceso: string){
    this.t = new TbQoTracking();
    this.t.actividad  = actividad;
    this.t.proceso = proceso; 
    this.t.usuarioCreacion    = localStorage.getItem(environment.userKey);
    this.t.estado  = SituacionEnum.EN_PROCESO;
  }
  public capturarHoraInicio() {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.t.fechaInicio = hora.entidad;
      }
    });
  }
  public capturarHoraAsignacion() {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.t.fechaCreacion = hora.entidad;
      }
    });
  }
  public capturaHoraAtencion() {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.t.fechaInicio = hora.entidad;
      }
    });
  }
  public capturaHoraFinal() {
    this.tra.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.t.fechaFin = hora.entidad;
      }
    });
  }
  public registrar(codigoRegistro: number, observacion?: string) {
    if(this.t.fechaCreacion != null && this.t.fechaInicio != null && this.t.fechaInicio != null && this.t.fechaFin != null){
      this.t.observacion = observacion.length > 0? observacion : null;
     
      this.tra.guardarTracking(this.t).subscribe((data: any) => {
        if (data.entidad) {
          console.log('TRACKING REGISTRADO ----> ', data.entidad);
        } else {
          console.log('ERROR REGISTRANDO TRACKING  ----> ', data.entidad);
        }
      }, error => {
        if (JSON.stringify(error).indexOf('codError') > 0) {
          const b = error.error;
          console.log('ERROR REGISTRANDO TRACKING  ----> ', b.msgError);
        } else {
          console.log('ERROR DESCONOCIDO REGISTRANDO TRACKING :c');
        }
      });
    } else{
      console.log('TRACKING NO REGISTRADO ----> ERROR: Falta fecha de inicio, atencion, asignacion o fin.');
    }
  }
}