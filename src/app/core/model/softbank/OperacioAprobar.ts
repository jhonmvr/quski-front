import { DatosRegistro } from './DatosRegistro'

export class OperacionAprobar{
    
    numeroOperacion: string                     //"2020001985",

    datosRegistro: DatosRegistro
     
    constructor(){
        this.datosRegistro = new DatosRegistro()
    }
}