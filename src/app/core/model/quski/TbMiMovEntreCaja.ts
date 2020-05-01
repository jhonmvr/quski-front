import { TbMiAgencia } from "./TbMiAgencia";

export class TbMiMovEntreCaja{
    id:number;
    estado:string;
    fechaActualizacion:Date;
    fechaCreacion:Date;;
    saldoAgenciaDestino:number;;
    saldoAgenciaOrigen:number;;
    usuarioActualizacion:string;;
    usuarioCreacion:string;;
    tbMiAgenciaO:TbMiAgencia;
    tbMiAgenciaD:TbMiAgencia;

    constructor(){
        this.tbMiAgenciaO=null;
        this.tbMiAgenciaD=null;
    }
}