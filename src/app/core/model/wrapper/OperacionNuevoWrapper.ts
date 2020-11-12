import { TbQoCreditoNegociacion } from '../quski/TbQoCreditoNegociacion';
import { TbQoExcepcion } from '../quski/TbQoExcepcion';
import { TbQoProceso } from '../quski/TbQoProceso';
import { TbQoTasacion } from '../quski/TbQoTasacion';
export class OperacionNuevoWrapper {
    joyas: TbQoTasacion[];
    credito: TbQoCreditoNegociacion;
    excepciones: TbQoExcepcion[];
    proceso: TbQoProceso;
    mensaje: string;
    existe: boolean;

    constructor() {

    }
}
