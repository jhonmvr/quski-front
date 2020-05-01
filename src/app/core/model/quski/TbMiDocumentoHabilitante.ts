import { TbMiContrato } from './TbMiContrato';
import { TbMiJoya } from './TbMiJoya';
import { TbMiAbono } from './TbMiAbono';
import { TbMiTipoDocumento } from './TbMiTipoDocumento';

export class TbMiDocumentoHabilitante {
    id: Number;
    nombreArchivo: string;
    archivo: any;
    estado: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    tbMiTipoDocumento: TbMiTipoDocumento;
    tbMiContrato: TbMiContrato;
    tbMiJoya: TbMiJoya;
    tbMiAbono: TbMiAbono;

    constructor() {
        this.tbMiContrato = null;
        this.tbMiJoya = null;
        this.tbMiAbono = null;
    }
}
