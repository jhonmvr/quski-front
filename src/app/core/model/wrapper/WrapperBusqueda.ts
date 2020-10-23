export class WrapperBusqueda{
    nombreCompleto: string;
    identificacion: string;
    proceso: string;
    fechaCreacionDesde: Date;
    fechaCreacionHasta: Date;
    estado: string;
    actividad: string;
    asesor: string;
    numberItems: number
    numberPage:number
    constructor(numberItems: number = 5, numberPage: number = 1, asesor: string = null){
        this.actividad = null;
        this.identificacion = null;
        this.proceso = null;
        this.fechaCreacionDesde = null;
        this.fechaCreacionHasta = null;
        this.estado = null;
        this.actividad = null;
        this.numberItems = numberItems;
        this.asesor = asesor;
        this.numberPage = numberPage;
    }
}
