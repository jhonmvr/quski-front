import { TbMiDocumentoHabilitante } from './TbMiDocumentoHabilitante';

export class TbMiTipoDocumento {
    id: Number;
    descripcion: string;
    estado: string;
    plantilla: string;
    fechaCreacion: Date;
    tipoDocumento: string;
    tbMiDocumentoHabilitantes: TbMiDocumentoHabilitante[];

    constructor() {
        this.tbMiDocumentoHabilitantes = null;
    }
}
