import { TbQoCreditoNegociacion } from '../quski/TbQoCreditoNegociacion';
import { TbQoExcepcion } from '../quski/TbQoExcepcion';
import { TbQoExcepcionOperativa } from '../quski/TbQoExcepcionOperativa';
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
    referedio: any;
    excepcionBre: string;
    codigoExcepcionBre;
    respuesta : boolean;
    existeError : boolean;
    excepcionOperativa:TbQoExcepcionOperativa;
    constructor(){
      
    }
}
