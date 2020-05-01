import { TbMiCliente } from "./TbMiCliente";
import { TbMiLote } from "./TbMiLote";

export class TbMiVentaLote{
    id:number;
    codigo:string;
    descripcionFormaPago:string;
    descuento:number;
    estado:string;
    fechaActualizacion:Date;
    fechaCreacion:Date;
    medidaConversion:number;
    precioGramo:number;
    precioOnzaTroy:number;
    usuarioActualizacion;
    usuarioCreacion:string;
    tbMiCliente: TbMiCliente;
    tbMiLotes: TbMiLote[];
    valor:number;
    totalGramosNegociados:number;
    valorIva:number;
    porcentajeIva:number;
    constructor(){
        this.tbMiCliente = null;
        this.tbMiLotes = null;
    }
}