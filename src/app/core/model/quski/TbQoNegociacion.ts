import { TbQoCliente } from "./TbQoCliente";


export class TbQoNegociacion {
    id: number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    asesor: string
    aprobador: string
    observacionAsesor: string
    estadoCredito;
    motivo;
    tbQoCliente: TbQoCliente
    constructor(idCliente?: number) {
        this.tbQoCliente = new TbQoCliente();
        this.tbQoCliente.id = idCliente?idCliente: null;

    }

}


