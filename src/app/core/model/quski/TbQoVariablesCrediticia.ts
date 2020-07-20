import { TbCotizacion } from "./TbCotizacion";
import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoVariablesCrediticia {
    id: number
    estado : string
    fechaActualizacion: Date
    fechaCreacion : Date
    nombre: string
    orden:string
    valor: string
    tbQoCotizador : TbCotizacion
    tbQoNegociacion : TbQoNegociacion
    constructor(){
        this.tbQoCotizador = new TbCotizacion();
        this.tbQoNegociacion = new TbQoNegociacion();
    }
}
