export class WrapperBusqueda{
    nombreCompleto: string;
    identificacion: string;
    proceso: string;
    fechaCreacionDesde: Date;
    fechaCreacionHasta: Date;
    estado: string;
    actividad: string;
    asesor: string;    
    codigoBpm: string;
    codigoSoft: string;
    numberItems: number
    numberPage:number
    constructor(numberItems?: number, numberPage?: number, asesor?: string){
        this.actividad = null;
        this.identificacion = null;
        this.proceso = null;
        this.fechaCreacionDesde = null;
        this.fechaCreacionHasta = null;
        this.estado = null;
        this.actividad = null;
        
        this.numberItems = numberItems ? numberItems : 5 ;
        this.asesor = asesor ? asesor :  null ;
        this.numberPage = numberPage ? numberPage: 0 ;
    }
}
