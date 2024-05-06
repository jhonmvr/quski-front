import { TbQoNegociacion } from "./TbQoNegociacion";

export interface TbQoRegularizacionDocumento {
    id: number;
    codigo: null | string;
    codigoOperacion: string;
    estadoRegularizacion: string;
    fechaRespuesta: null | number;
    fechaSolicitud: number;
    idNegociacion: TbQoNegociacion;
    identificacionCliente: string;
    tipoExcepcion: string;
    urlDocumento: null | string;
    usuarioAprobador: null | string;
    usuarioSolicitante: string;
  }