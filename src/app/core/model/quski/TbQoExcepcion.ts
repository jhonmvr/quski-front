import { TbQoNegociacion } from './TbQoNegociacion';

export class TbQoExcepcion {
  id: number                         // 1,                          // Actualizacion
  estado: string                     // "ACT",
  estadoExcepcion: string            // : "PENDIENTE",              // Actualizacion
  idAprobador: string                //  "admin"                    // Actualizacion
  idAsesor: string                   //  1,
  tipoExcepcion: string              // "EXCEPCION_CLIENTE",
  observacionAsesor: string          // "Este tipo tiene plata",   
  observacionAprobador: string       // null,                       // Actualizacion
  fechaActualizacion: Date           // null,
  fechaCreacion: Date                // "2020-01-07",
  caracteristica: string
  mensajeBre: string                 // "100", "Creditos impagos"   // Actualizacion
  tbQoNegociacion: TbQoNegociacion   //                             // Actualizacion
  constructor() {
    this.tbQoNegociacion = new TbQoNegociacion();
  }
}
