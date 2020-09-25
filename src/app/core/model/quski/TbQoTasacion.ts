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
    valorAvaluo : number;
    valorComercial : number;
    valorRealizacion : number;
    valorOro: number;
    id : number;
    fechaActualizacion : Date;
    fechaCreacion : Date;
    tbQoCreditoNegociacion : TbQoCreditoNegociacion;
    constructor(){
        this.tbQoCreditoNegociacion = new TbQoCreditoNegociacion();
    } 
}