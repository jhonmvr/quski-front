export class DatosRegistro{
    
 
    fecha: string                        
    referencia: string                   
    codigoUsuario: string                 
    idAgencia: number                     

    constructor( fecha: string, codigoUsuario: string, idAgencia: number){
        this.fecha = fecha;            
        this.referencia = "Aprobando operacion" ;                  
        this.codigoUsuario = codigoUsuario   ;             
        this.idAgencia =  idAgencia ; 
    }
}