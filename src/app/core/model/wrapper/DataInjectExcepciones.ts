export class DataInjectExcepciones{
    isRiesgo : boolean    
    isCobertura: boolean   
    isCliente: boolean   
    mensajeBre: string 
    idNegociacion: number
    constructor( mensajeBre: string, idNegociacion: number){
        this.isRiesgo = false;
        this.isCobertura = false;
        this.isCliente = false;

        this.mensajeBre = mensajeBre;
        this.idNegociacion = idNegociacion;
    }
}
