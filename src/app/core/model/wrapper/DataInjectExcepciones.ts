export class DataInjectExcepciones{
    isRiesgo : boolean    
    isCobertura: boolean   
    isCliente: boolean   
    isNotificacion: boolean   
    mensajeBre: string 
    idNegociacion: number
    constructor(isCliente: boolean = false, isRiesgo: boolean = false, isCobertura: boolean = false, isNotificacion: boolean = false, mensajeBre: string = null){
        this.isCliente = isCliente;
        this.isRiesgo = isRiesgo;
        this.isCobertura = isCobertura;
        this.isNotificacion = isNotificacion;
        this.mensajeBre = mensajeBre;
    }
}
