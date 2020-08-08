import { Time } from '@angular/common';

export class TbQoTracking{
    id: number;                         // 1
    codigoRegistro: number;             // Codigo de referencia: idCotizacion idNegociacion, idCreditoNegociacion 
    actividad: string;
    fechaInicio: Date;
    fechaAsignacion: Date;
    fechaInicioAtencion: Date;
    fechaFin: Date;
    situacion: string;
    usuario: string;
    totalTiempo: Date;
    observacion: string;
    proceso: string;
}