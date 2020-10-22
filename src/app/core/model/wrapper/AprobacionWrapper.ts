import { TbQoCliente } from '../quski/TbQoCliente';
import { TbQoCreditoNegociacion } from '../quski/TbQoCreditoNegociacion';
import { TbQoDireccionCliente } from '../quski/TbQoDireccionCliente';
import { TbQoExcepcione } from '../quski/TbQoExcepcione';
import { TbQoIngresoEgresoCliente } from '../quski/TbQoIngresoEgresoCliente';
import { TbQoPatrimonioCliente } from '../quski/TbQoPatrimonioCliente';
import { TbQoProceso } from '../quski/TbQoProceso';
import { TbQoRiesgoAcumulado } from '../quski/TbQoRiesgoAcumulado';
import { TbQoTasacion } from '../quski/TbQoTasacion';
import { TbQoVariablesCrediticia } from '../quski/TbQoVariablesCrediticia';
import { TbReferencia } from '../quski/TbReferencia';
export class AprobacionWrapper {
    joyas: TbQoTasacion[];
    variables: TbQoVariablesCrediticia[];
    riesgos: TbQoRiesgoAcumulado[];
    referencias: TbReferencia[];
    ingresosEgresos: TbQoIngresoEgresoCliente[];
    direcciones: TbQoDireccionCliente[];
    patrimonios: TbQoPatrimonioCliente[];
    cliente: TbQoCliente;
    credito: TbQoCreditoNegociacion;
    proceso: TbQoProceso;


    excepciones: TbQoExcepcione[];

    excepcionBre: string;
    respuesta: boolean;
    constructor() {

    }
}
