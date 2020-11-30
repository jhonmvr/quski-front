import { DatosRegistro } from './DatosRegistro'

export class OperacionAprobar{
    
    numeroOperacion: string                   
    uriHabilitantesFirmados:string
    datosRegistro: DatosRegistro
     
    constructor( numero: string, datos: DatosRegistro ){
        this.numeroOperacion = numero;
        this.uriHabilitantesFirmados = "Sin habilitantes";
        this.datosRegistro = datos;
    }
}