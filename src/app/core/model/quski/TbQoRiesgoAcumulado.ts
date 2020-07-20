import { TbQoCliente } from './TbQoCliente'

export class TbQoRiesgoAcumulado {
    id : number                             // 1,
    diasMoraActual : number                 //  0,
    estado :  string                        // "ACT",
    estadoOperacion :  string               // "AL DIA",
    estadoPrimeraCuotaVigente :  string     // "ACTIVO",
    fechaActualizacion :  Date              // null,
    fechaCreacion :  string                 // "2020-01-07",
    idMoneda :  number                      // 1,
    nombreProducto :  string                // "CONSUMO SIN BASE",
    numeroCuotasFaltantes : number          //  2,
    numeroCuotasTotales : number            // 1,
    numeroGarantiasReales : number          // 0,
    numeroOperacion :  string               // "2020001984",
    numeroOperacionRelacionada : string     // null,
    primeraCuotaVigente : number            // 1,
    valorAlDia :  number                    // 0,
    valorAlDiaMasCuotaActual :  number      // 4023,
    valorCancelaPrestamo :  number          // 4023,
    valorProyectadoCuotaActual : number     // 422778,
    tbQoCliente :  TbQoCliente
    
    constructor() { 
        this.tbQoCliente = new TbQoCliente();
    }

    
 }
