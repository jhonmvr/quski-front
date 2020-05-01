import { TbMiDetalleCaja } from './TbMiDetalleCaja';
import { TbMiAgencia } from './TbMiAgencia';

export class TbMiCaja {
    id: Number;
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    usuarioCreacion: string;
    saldoActual: Number;
    tbMiAgencia: TbMiAgencia;
    tbMiDetalleCajas: TbMiDetalleCaja[];

    constructor() {
        this.tbMiAgencia = null;
        this.tbMiDetalleCajas = null;
    }
}
