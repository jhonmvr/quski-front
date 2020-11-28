import { TbQoCliente } from "./TbQoCliente";

export class TbQoPatrimonio{
    id:number;
    activos: string;
    avaluo: number;
    pasivos: string;
    tbQoCliente : TbQoCliente;
    
    constructor(valor: number, isActivo: boolean){
        this.avaluo = valor;
        isActivo ? this.activos = "Total Softbank" : this.pasivos = "Total Softbank";
    }
}