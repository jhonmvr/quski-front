import { TbQoCliente } from "./TbQoCliente";

export class TbQoPatrimonio{
    id:number;
    activos: string;
    avaluo: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    pasivos: string;
    tbQoCliente : TbQoCliente [];
    
    constructor(){
    }
}