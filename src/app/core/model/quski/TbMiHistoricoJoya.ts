import { TbMiJoya } from "./TbMiJoya";

export class TbMiHistoricoJoya{
    id: number;
    comentario: string;
    descuento: number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    idTipoOro: number;
    pesoBruto: number;
    pesoNeto: number;
    usuarioActualizacion: string;
    usuarioCreacion: string;
    tbMiJoya: TbMiJoya;

    constructor(){
        this.tbMiJoya = new TbMiJoya();
    }
}