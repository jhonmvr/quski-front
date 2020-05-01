
import { TbQoCreditoNegociacion } from "./TbQoCreditoNegociacion";
export class TbQoReasignacion{
    
    id:string;
    idUsuarioAntiguo:string;
    idUsuarioNuevo:string;
    observacion:string;
    tbQoCreditoNegociacion : TbQoCreditoNegociacion;
    constructor(){
       this.tbQoCreditoNegociacion=new TbQoCreditoNegociacion();
    }
}