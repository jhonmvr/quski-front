export class OperacionesProcesoWrapper {
    id: number;
    codigoBpm: string;
    codigoOperacion: string;
    nombreCliente: string;
    cedulaCliente: string;
    montoFinanciado: any;
    fechaCreacion: Date;
    idAgencia: number;
    agencia: string;  // Se completa este campo en front.
    estadoProceso: string;
    proceso: string;
    asesor: string;
    usuarioEjecutor: string;
    actividad: string
    constructor() {

    }
}
