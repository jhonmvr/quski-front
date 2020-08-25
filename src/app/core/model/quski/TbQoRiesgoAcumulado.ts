import { TbQoCliente } from './TbQoCliente'

export class TbQoRiesgoAcumulado {
    id:  number                             // 1,
    codigoCarteraQuski:  string             // null,
    diasMoraActual:  number                 // null,
    esDemandada:  number                    // null,
    estado:  number                         // "ACT",
    estadoOperacion:  string                // 
    estadoPrimeraCuotaVigente :  string     // "ACTIVO",
    fechaActualizacion :  Date              // null,
    fechaCreacion :  string                 // "2020-01-07",
    fechaEfectiva: Date                     // "2020-01-24",
    fechaVencimiento: Date                  // "2020-08-05",
    idSoftbank:  number                     // 1234
    interesMora: number                     // 12.12
    nombreProducto :  string                // "CONSUMO SIN BASE",
    numeroCuotasFaltantes : number          //  2,
    numeroCuotasTotales : number            // 1,
    numeroGarantiasReales : number          // 0,
    numeroOperacion :  string               // "2020001984",
    primeraCuotaVigente : number            // 1,
    referencia: string                      // "BPM001",
    saldo: number                           // 457.73,
    tipoOperacion: string                   // "VENCIMIENTO",
    valorAlDia :  number                    // 0,
    valorAlDiaMasCuotaActual :  number      // 4023,
    valorCancelaPrestamo :  number          // 4023,
    valorProyectadoCuotaActual : number     // 422778,
    tbQoCliente :  TbQoCliente
    // NUEVOS CAMPOS 

    constructor() { 
        this.tbQoCliente = new TbQoCliente();
    }

    
 }
