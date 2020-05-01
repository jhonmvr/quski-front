import { TbMiJoya } from "./TbMiJoya";
import { TbMiLote } from "./TbMiLote";

export class TbMiJoyaLote{
    id: number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    usuarioCreacion: string;
    tbMiJoya: TbMiJoya;
    tbMiLote: TbMiLote;

    constructor(){
        this.tbMiJoya = new TbMiJoya();
        this.tbMiLote = new TbMiLote();
    }
}