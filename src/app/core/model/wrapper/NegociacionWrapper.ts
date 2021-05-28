import { TbQoCreditoNegociacion } from '../quski/TbQoCreditoNegociacion';
import { TbQoExcepcion } from '../quski/TbQoExcepcion';
import { TbQoProceso } from '../quski/TbQoProceso';
import { TbQoRiesgoAcumulado } from '../quski/TbQoRiesgoAcumulado';
import { TbQoTasacion } from '../quski/TbQoTasacion';
import { TbQoTelefonoCliente } from '../quski/TbQoTelefonoCliente';
import { TbQoVariablesCrediticia } from '../quski/TbQoVariablesCrediticia';
export class NegociacionWrapper{
    variables : TbQoVariablesCrediticia[];
    riesgos : TbQoRiesgoAcumulado[];
    credito:  TbQoCreditoNegociacion;
    joyas: TbQoTasacion[];
    excepciones: TbQoExcepcion[];
    telefonos: TbQoTelefonoCliente[];
    telefonoDomicilio: TbQoTelefonoCliente;
    telefonoMovil: TbQoTelefonoCliente;
    proceso: TbQoProceso

    excepcionBre: string;
    codigoExcepcionBre;
    respuesta : boolean;
    existeError : boolean;
    constructor(){
      
    }
}
