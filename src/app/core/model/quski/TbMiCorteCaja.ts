import { TbMiAgente } from './TbMiAgente';
import { TbMiAgencia } from './TbMiAgencia';
import { EstadoQuskiEnum } from '../../enum/EstadoQuskiEnum';
import { TbMiDetalleCaja } from './TbMiDetalleCaja';
import { TbMiCaja } from './TbMiCaja';


export class TbMiCorteCaja {

    id: number;
    valorApertura: number;
    valorCierre: number;
    fechaApertura: Date;
    fechaCierre: Date;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    usuarioCreacion: String;
    usuarioActualizacion: String;
    estado: EstadoQuskiEnum;
    tbMiAgencia: TbMiAgencia;
    tbMiAgente: TbMiAgente;
    tbMiCaja: TbMiCaja;
    tbMiDetalleCajas: TbMiDetalleCaja[];

    constructor () {
        this.tbMiAgencia = null;
        this.tbMiAgente = null;
        this.tbMiCaja = null;
        this.tbMiDetalleCajas = null;
    }
}
