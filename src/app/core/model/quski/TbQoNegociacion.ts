
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
    tbQoCliente : TbQoCliente [];
    tbQoTasacion : TbQoTasacion [];
    tbPrecioOro : TbQoPrecioOro [];
    tbQoVariableCrediticia : TbQoVariablesCrediticia [];
    tbQoCreditoNegociacion : TbQoCreditoNegociacion [];
    constructor(){
       
    }

}


