import { TbQoCreditoNegociacion } from '../quski/TbQoCreditoNegociacion';
import { TbQoExcepcion } from '../quski/TbQoExcepcion';
import { TbQoProceso } from '../quski/TbQoProceso';
import { TbQoRiesgoAcumulado } from '../quski/TbQoRiesgoAcumulado';
import { TbQoTasacion } from '../quski/TbQoTasacion';
import { TbQoTelefonoCliente } from '../quski/TbQoTelefonoCliente';
import { TbQoVariablesCrediticia } from '../quski/TbQoVariablesCrediticia';
export class DetalleNegociacionWrapper {
    credito: TbQoCreditoNegociacion;
    proceso: TbQoProceso;
    telefonos: Array<TbQoTelefonoCliente>;
    excepciones: Array<TbQoExcepcion>;
    variables: Array<TbQoVariablesCrediticia>;
    riesgos: Array<TbQoRiesgoAcumulado>;
    joyas: Array<TbQoTasacion>;
    existeError: boolean;
    mensaje: string;
    constructor() {

    }
}
