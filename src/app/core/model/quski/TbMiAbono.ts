import { TbMiCliente } from "./TbMiCliente";
import { TbMiContrato } from "./TbMiContrato";
import { TbMiBanco } from "./TbMiBanco";

export class TbMiAbono{
    id:number;
    tbMiContrato: TbMiContrato;
    tbMiCliente:TbMiCliente;
    tipoCuenta:string;
    formaPago:string;
    tbMiBanco:TbMiBanco;
    numeroCuenta:string;
    valor:number;
    estado:string;
    fechaCreacion:Date;
    fechaActualizacion:Date;
    usuarioCreacion:string;
    usuarioActualizacion:string;
    tipoTarjeta: string;
    numeroTarjeta: string;
    habienteTarjeta: string;
    cedHabienteTarjeta: string;
}