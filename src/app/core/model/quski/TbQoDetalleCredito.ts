import { TbQoCliente } from './TbQoCliente'
import { TbQoCotizador } from './TbQoCotizador'

export class TbQoDetalleCredito {
    id : number                    // 179,
    costoCredito : number          // 71.82,
    costoCustodia : number         // 95.22,
    costoEstimado : number         // 63.44,
    costoNuevaOperacion : number   // 63.22,
    costoResguardado : number      // 126.58,
    costoSeguro : number           // 84.54,
    costoTasacion : number         // null,
    costoTransporte : number       // 63.44,
    costoValoracion : number       // null,
    estado : string                // "ACT",
    fechaActualizacion : Date      // null,
    fechaCreacion : Date           // "2020-01-16",
    montoPreaprobado : number      // 64.44,
    plazoCredito : string          // "90",
    recibirCliente : number        // 117.44,
    solca : number                 // null,
    valorCuota : number            // 84.55,
    tbQoCotizador : TbQoCotizador  // { "id" : 174 }
    constructor() { 
        this.tbQoCotizador = new TbQoCotizador();
    }
 }
