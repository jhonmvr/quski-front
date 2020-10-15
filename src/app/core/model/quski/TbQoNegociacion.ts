import { TbQoCliente } from "./TbQoCliente";


export class TbQoNegociacion {
    id: number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    situacion: string
    asesor: string
    aprobador: string

    tbQoCliente: TbQoCliente
    constructor(idCliente?: number) {
        this.tbQoCliente = new TbQoCliente();
        this.tbQoCliente.id = idCliente?idCliente: null;

    }

}


