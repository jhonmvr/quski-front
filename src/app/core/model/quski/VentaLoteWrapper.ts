import { TbMiVentaLote } from "./TbMiVentaLote";

import { TbMiLote } from "./TbMiLote";

import { TbMiMovimientoCaja } from "./TbMiMovimientoCaja";

import { TbMiCliente } from "./TbMiCliente";

export class VentaLoteWrapper {
    idAgencia: number;
    ventaLote: TbMiVentaLote;
    lotes: TbMiLote[];
    reUser: string;
    movimientos: TbMiMovimientoCaja[];
    cliente: TbMiCliente;
    constructor() {

    }
}