import { TbMiTipoJoya } from "./TbMiTipoJoya";

import { TbMiContrato } from "./TbMiContrato";
import { TbMiFunda } from "./TbMiFunda";
import { TbMiJoyaLote } from "./TbMiJoyaLote";
import { TbMiHistoricoJoya } from "./TbMiHistoricoJoya";
import { TbMiCompraOro } from "./TbMiCompraOro";

export class TbMiJoya {

    id: number;
    codigoJoya: string;
    comentario: string;
    condicion: string;
    descuento: number;
    descuentoRetazado: number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    peso;
    precioVenta;
    pesoBruto;
    pesoBrutoRetazado;
    pesoNetoRetazado;
    valor: number;
    iva: number;
    tbMiInventarios: any;
    tbMiContrato: TbMiContrato;
    tbMiFunda: TbMiFunda;
    tbMiTipoJoya: TbMiTipoJoya;
    tbMiCompraOro: TbMiCompraOro;
    tbMiJoyaLotes: TbMiJoyaLote[];
    tbMiHistoricoJoyas: TbMiHistoricoJoya[];

    constructor() {
        this.tbMiFunda = new TbMiFunda();
        this.tbMiTipoJoya = new TbMiTipoJoya();
        this.tbMiCompraOro = new TbMiCompraOro();
        this.tbMiContrato = new TbMiContrato(true);
    }
}