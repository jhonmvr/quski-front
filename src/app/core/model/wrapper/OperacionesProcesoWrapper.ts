export class OperacionesProcesoWrapper {
    id: number;
    codigoOperacion: string;
    nombreCliente: string;
    cedulaCliente: string;
    montoPreaprobado: any;
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
