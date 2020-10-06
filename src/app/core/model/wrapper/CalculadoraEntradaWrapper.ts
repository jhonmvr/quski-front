import { DescuentosOperacionWrapper } from './DescuentosOperacionWrapper';
import { GarantiaWrapper } from './GarantiaWrapper';
import { ParametrosRiesgoWrapper } from './ParametrosRiesgoWrapper';
export class CalculadoraEntradaWrapper{
    parametroRiesgo:  ParametrosRiesgoWrapper;
    garantias : GarantiaWrapper[];
    descuentosOperacion : DescuentosOperacionWrapper ;
    constructor(){
        this.parametroRiesgo = new ParametrosRiesgoWrapper();
        this.garantias = new Array<GarantiaWrapper>();
        this.descuentosOperacion = new DescuentosOperacionWrapper();
    }
}
