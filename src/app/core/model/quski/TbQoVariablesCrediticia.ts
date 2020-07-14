import { TbCotizacion } from "./TbCotizacion";
import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoVariablesCrediticia {
    id: number;
    nombre: string;
    valor: string;
    orden:string;
    tbQoCotizador : TbCotizacion;
    tbQoNegociacion : TbQoNegociacion;
    constructor(){
        this.tbQoCotizador = new TbCotizacion();
        this.tbQoNegociacion = new TbQoNegociacion();
    }
}
