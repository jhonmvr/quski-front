export class DataInjectExcepciones{
    isRiesgo : boolean    
    isCobertura: boolean   
    isCliente: boolean   
    mensajeBre: string 
    idNegociacion: number
    constructor(isCliente: boolean = false, isRiesgo: boolean = false, isCobertura: boolean = false){
        this.isCliente = isCliente;
        this.isRiesgo = isRiesgo;
        this.isCobertura = isCobertura;
    }
}
