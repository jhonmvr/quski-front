import { TbReferencia } from './TbReferencia';
import { TbQoDireccionCliente } from './TbQoDireccionCliente';
import { TbQoPatrimonioCliente } from './TbQoPatrimonioCliente';
import { TbQoIngresoEgresoCliente } from './TbQoIngresoEgresoCliente';
import { TbCotizacion } from './TbCotizacion';
import { TbQoNegociacion } from './TbQoNegociacion';

export class TbQoExcepcione {
  id : number                     // 1,
  estado : string                 // "ACT",
  estadoExcepcion : string        // : "EXCEPCION_PENDIENTE",
  idAprobador : number            //  1,
  idAsesor : number               // 1,
  tipoExcepcion : string          // "EXCEPCION_CLIENTE",
  observacionAsesor : string      // "Este tipo tiene plata",
  observacionAprobador : string   // null,
  fechaActualizacion : Date       // null,
  fechaCreacion : Date            // "2020-01-07",
  tbQoNegociacion : TbQoNegociacion
  constructor() {
    this.tbQoNegociacion = new TbQoNegociacion();
  }
}
