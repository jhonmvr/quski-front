
export class DataPopup{
    idBusqueda : number      // 12
    isNegociacion: Boolean   // true
    isCotizacion: Boolean    // false
    isCalculadora: Boolean   // false
    cedula: string           // Solo si isCalculadora = true;
    constructor(){
        this.isNegociacion = false;
        this.isCotizacion = false;
        this.isCalculadora = false;
    }
}
