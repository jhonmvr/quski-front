import { TbMiAgencia } from "./TbMiAgencia";
import { TbMiAgente } from "./TbMiAgente";
import { TbMiContrato } from "./TbMiContrato";
import { TbMiCliente } from "./TbMiCliente";

export class TbMiContactabilidad{
    id:number;
    comentario:string;
    estadoGestion:string;
    estado:string;
    fechaActualizacion:Date;
    fechaCreacion:Date;
    usuarioActualizacion:string;
    usuarioCreacion:string;
    tbMiAgencia:TbMiAgencia;
    tbMiAgente:TbMiAgente;
    tbMiCliente:TbMiCliente;
    tbMiContrato:TbMiContrato;

    constructor(){
        this.tbMiAgencia = null;
        this.tbMiAgente = null;
        this.tbMiCliente = null;
        this.tbMiContrato = null;
    }
}