import { TbQoCliente } from "./TbQoCliente";

export class TbQoPatrimonio{
    id:number;
    activo: string;
    avaluo: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    pasivo: string;
    ifis: number;
    infocorp: number;
    tbQoCliente : TbQoCliente [];
    
    constructor(){
    }
}