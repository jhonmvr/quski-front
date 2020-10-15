export class WrapperBusqueda{
    nombreCompleto: string;
    identificacion: string;
    proceso: string;
    fechaCreacionDesde: Date;
    fechaCreacionHasta: Date;
    estado: string;
    actividad: string;
    asesor: string;

    constructor(asesor: string){
        this.actividad = null;
        this.identificacion = null;
        this.proceso = null;
        this.fechaCreacionDesde = null;
        this.fechaCreacionHasta = null;
        this.estado = null;
        this.actividad = null;
        this.asesor = asesor;
        
    }
}
