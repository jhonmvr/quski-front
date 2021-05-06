import { TbQoCreditoNegociacion } from '../quski/TbQoCreditoNegociacion';
import { TbQoCuentaBancariaCliente } from '../quski/TbQoCuentaBancariaCliente';
import { TbQoDatoTrabajoCliente } from '../quski/TbQoDatoTrabajoCliente';
import { TbQoDireccionCliente } from '../quski/TbQoDireccionCliente';
import { TbQoExcepcion } from '../quski/TbQoExcepcion';
import { TbQoProceso } from '../quski/TbQoProceso';
import { TbQoRegistrarPago } from '../quski/TbQoRegistrarPago';
import { TbQoRiesgoAcumulado } from '../quski/TbQoRiesgoAcumulado';
import { TbQoTasacion } from '../quski/TbQoTasacion';
import { TbQoTelefonoCliente } from '../quski/TbQoTelefonoCliente';
import { TbQoVariablesCrediticia } from '../quski/TbQoVariablesCrediticia';
import { TbReferencia } from '../quski/TbReferencia';
export class AprobacionWrapper {
    credito: TbQoCreditoNegociacion;
    proceso: TbQoProceso;
    telefonos: Array<TbQoTelefonoCliente>;
    direcciones: Array<TbQoDireccionCliente>;
    trabajos: Array<TbQoDatoTrabajoCliente>;
    referencias: Array<TbReferencia>;
    excepciones: Array<TbQoExcepcion>;
    variables: Array<TbQoVariablesCrediticia>;
    riesgos: Array<TbQoRiesgoAcumulado>;
    cuenta: TbQoCuentaBancariaCliente;
	pagos: Array<TbQoRegistrarPago>;
	creditoAnterior: any;
    existeError: boolean;
    mensaje: string;
    
    constructor() {

    }
}
