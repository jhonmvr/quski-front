export class BusquedaAprobadorWrapper{
    cedula: string;
    proceso: any;
    idAgencia: any;
    codigo: string;
    numberItems: number
    numberPage:number
    constructor( numberItems?: number, numberPage?:number ){ 
        this.cedula    = null;
        this.proceso   = null;
        this.idAgencia = null;
        this.codigo    = null;
        this.numberItems = numberItems ? numberItems : 5 ;
        this.numberPage = numberPage ? numberPage: 0 ;
    }
}
