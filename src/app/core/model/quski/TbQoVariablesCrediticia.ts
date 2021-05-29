import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoCotizador } from './TbQoCotizador';

export class TbQoVariablesCrediticia {
    id: number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    nombre: string;
    codigo: string;
    orden: number;
    valor: string;
    tbQoCotizador: TbQoCotizador;
    tbQoNegociacion: TbQoNegociacion;
    constructor() {
        this.tbQoCotizador = new TbQoCotizador();
        this.tbQoNegociacion = new TbQoNegociacion();
    }
}
