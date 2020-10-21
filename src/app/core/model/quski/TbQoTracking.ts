import { Time } from '@angular/common';

export class TbQoTracking{
    id: number;                         // 1
    proceso: string; 
    actividad: string; 
    seccion: string;
    codigoBpm: string; 
    codigoOperacionSoftbank: string;
    fechaCreacion: Date; 
    usuarioCreacion: string; 
    nombreAsesor: string; 
    tiempoTranscurrido: number; 
    fechaInicio: Date; 
    fechaFin: Date;
    estado: String;
    observacion: String;
}