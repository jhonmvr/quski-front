import { TbMiAgencia } from "./TbMiAgencia";
import { TbMiLiquidacion } from "./TbMiLiquidacion";

export class TbMiFolletoLiquidacion{
    id:number;
    codigoFin:string;
    codigoInicio:string;
    fechaActualizacion:Date;
    fechaCreacion:Date;
    fechaVigencia:Date;
    nombreFolleto:string;
    total:number;
    usuarioActualizacion:string;
    usuarioCreacion:string;
    estado:string;
    tbMiAgencia:TbMiAgencia;
    tbMiLiquidacions:TbMiLiquidacion[];
    constructor(){
        this.tbMiAgencia = null;
        this.tbMiLiquidacions = null;
    }
}