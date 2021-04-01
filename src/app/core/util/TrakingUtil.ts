import { environment } from '../../../environments/environment';
import { TbQoTracking } from '../model/quski/TbQoTracking';
import { TrackingService } from '../services/quski/tracking.service';

export class TrackingUtil{
  
  
  constructor(){
   
  }
  
  guardarTraking(proceso:string, codigoBPM:string, listaSeccion:[] , indexSeccion, actividad:string, codigoOperacion:string){
    let t = new TbQoTracking();
    t.seccion = listaSeccion[indexSeccion];
    t.codigoBpm = codigoBPM;
    t.codigoOperacionSoftbank = codigoOperacion;
    t.proceso = proceso;
    t.usuarioCreacion = localStorage.getItem('reUser');
    t.nombreAsesor = localStorage.getItem('nombre');
    t.actividad = actividad;
    console.log("guardar Traking ", t);
  }
  
}