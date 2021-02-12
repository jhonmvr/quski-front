import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTipoOro } from "./TbQoTipoOro";
import { TbQoCreditoNegociacion } from "./TbQoCreditoNegociacion";

export class TbQoTasacion{
    numeroPiezas : number;
    tipoOro :  string; 
    tipoJoya : string;
    estadoJoya : string;
    descripcion : string;
    pesoBruto : number;
    descuentoPesoPiedra : number;
    descuentoSuelda : number;
    pesoNeto: number;
    precioOro: number;
    valorAvaluo : number;
    valorAplicable: number;
    valorRealizacion : number;
    valorComercial: number;
    tienePiedras;
    tbQoCotizador: any;
    detallePiedras: string;
    valorOro: number;
    id : number;
    fechaActualizacion : Date;
    fechaCreacion : Date;
    tbQoCreditoNegociacion : any;
    constructor(tbQoCotizador?){
        !tbQoCotizador ? this.tbQoCreditoNegociacion = new TbQoCreditoNegociacion():null;
    } 
}