export class WrapperBusqueda{
    nombreCompleto: string;
    identificacion: string;
    proceso: string;
    fechaCreacionDesde: Date;
    fechaCreacionHasta: Date;
    estado: string;
    actividad: string;
    asesor;    
    codigoBpm: string;
    codigoSoft: string;
    numberItems: number
    numberPage:number
    agencia;
    constructor(numberItems?: number, numberPage?: number, asesor?: string){
        this.actividad = null;
        this.identificacion = null;
        this.proceso = null;
        this.fechaCreacionDesde = null;
        this.fechaCreacionHasta = null;
        this.estado = null;
        this.actividad = null;
        this.agencia = null;
        
        this.numberItems = numberItems ? numberItems : 5 ;
        this.asesor = asesor ? asesor :  null ;
        this.numberPage = numberPage ? numberPage: 0 ;
    }
}
