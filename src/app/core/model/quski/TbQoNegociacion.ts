
import { TbQoPrecioOro } from "./TbQoPrecioOro";

import { TbQoVariablesCrediticia } from "./TbQoVariablesCrediticia";
import { TbQoTasacion } from "./TbQoTasacion";
import { TbQoCreditoNegociacion } from "./TbQoCreditoNegociacion";
import { TbQoCliente } from "./TbQoCliente";


export class TbQoNegociacion {
    id: number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    idAsesor: string;
    procesoActual: string
    situacion: string
    tipo: string

    tbQoCreditoNegociacions: TbQoCreditoNegociacion[]
    tbQoDocumentoHabilitantes: null
    tbQoCliente: TbQoCliente
    tbQoVariablesCrediticias: TbQoVariablesCrediticia[];
    constructor(idCliente?: number, idAsesor?: string) {
        this.tbQoCliente = new TbQoCliente();
        this.tbQoCliente.id = idCliente?idCliente: null;
        this.idAsesor = idAsesor? idAsesor: null;   
        this.tbQoCreditoNegociacions = new Array<TbQoCreditoNegociacion>();
        this.tbQoVariablesCrediticias = new Array<TbQoVariablesCrediticia>();

    }

}


