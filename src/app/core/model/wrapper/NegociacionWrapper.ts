import { TbQoCreditoNegociacion } from '../quski/TbQoCreditoNegociacion';
import { TbQoExcepcione } from '../quski/TbQoExcepcione';
import { TbQoProceso } from '../quski/TbQoProceso';
import { TbQoRiesgoAcumulado } from '../quski/TbQoRiesgoAcumulado';
import { TbQoTasacion } from '../quski/TbQoTasacion';
import { TbQoVariablesCrediticia } from '../quski/TbQoVariablesCrediticia';
export class NegociacionWrapper{
    variables : TbQoVariablesCrediticia[];
    riesgos : TbQoRiesgoAcumulado[];
    credito:  TbQoCreditoNegociacion;
    joyas: TbQoTasacion[];
    excepciones: TbQoExcepcione[];
    proceso: TbQoProceso

    excepcionBre: string;
    respuesta : boolean;
    constructor(){
      
    }
}
