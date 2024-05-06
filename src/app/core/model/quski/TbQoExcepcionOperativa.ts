import { TbQoNegociacion } from "./TbQoNegociacion";

export interface TbQoExcepcionOperativa{
    codigo: string;
    codigoOperacion: string;
    estadoExcepcion: string;
    fechaRespuesta: number | null;
    fechaSolicitud: number;
    id: number;
    idNegociacion: TbQoNegociacion;
    montoInvolucrado: number;
    nivelAprobacion: number;
    observacionAprobador: string | null;
    observacionAsesor: string;
    tipoExcepcion: string;
    usuarioAprobador: string | null;
    usuarioSolicitante: string;
}