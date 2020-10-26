import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTipoOro } from "./TbQoTipoOro";
import { TbQoCreditoNegociacion } from "./TbQoCreditoNegociacion";

export class TbQoNegociacionCalculo{
    costoCustodia :  string; 
    tbQoCreditoNegociacion : TbQoCreditoNegociacion;
    constructor(){
        this.tbQoCreditoNegociacion = new TbQoCreditoNegociacion();
    } 

}