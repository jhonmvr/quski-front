import { TbQoCliente } from './TbQoCliente'

export class TbQoRiesgoAcumulado {
    referencia: string                            // "BPM001",
    numeroOperacion: string                       // "2020002150",
    tipoCarteraQuski: string                      // "MO3",
    tipoOperacion: string                         // "VENCIMIENTO",
    fechaEfectiva: string                         // "2020-01-24",
    fechaVencimiento: string                      // "2020-08-05",
    interesMora:  number                          // 0.0,
    saldo:  number                                // 457.73,
    valorAlDia:  number                           // 0.00,
    valorAlDiaMasCuotaActual:  number             // 72.03,
    valorCancelaPrestamo:  number                 // 457.73,
    valorProyectadoCuotaActual:  number           // 80.40,
    diasMoraActual:  number                       // 0,
    numeroCuotasTotales:  number                  // 6,
    nombreProducto: string                        // "CONSUMO SIN BASE",
    numeroCuotasFaltantes:  number                // 6,
    primeraCuotaVigente:  number                  // 1,
    estadoPrimeraCuotaVigente: string             // "ACTIVO",
    numeroGarantiasReales:  number                // 0,
    estadoOperacion: string                       // "AL DIA",
    idMoneda:  number                             // 1,
    esDemandada: boolean                          // false,
    id:  number                             // 1,
    estado:  number                         // "ACT",
    fechaActualizacion :  Date              // null,
    fechaCreacion :  string                 // "2020-01-07",
    idSoftbank:  number                     // 1234
    tbQoCliente :  TbQoCliente
    valorTotalPrestamoVencimiento:number


    
    constructor() { 
        this.tbQoCliente = new TbQoCliente();
    }

    
 }
