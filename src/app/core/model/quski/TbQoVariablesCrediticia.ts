import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoCotizador } from './TbQoCotizador';

export class TbQoVariablesCrediticia {
    id: number
    estado : string
    fechaActualizacion: Date
    fechaCreacion : Date
    nombre: string
    orden:string
    valor: string
    tbQoCotizador : TbQoCotizador
    tbQoNegociacion : TbQoNegociacion
    constructor(){
        this.tbQoCotizador = new TbQoCotizador();
        this.tbQoNegociacion = new TbQoNegociacion();
    }
}
