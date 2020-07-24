import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTipoOro } from "./TbQoTipoOro";
import { TbQoCreditoNegociacion } from "./TbQoCreditoNegociacion";

export class TbQoTasacion{
    id : number;
    descripcion : string;
    descuentoPesoPiedra : number;
    descuentoSuelda : number;
    estadoJoya : string;
    fechaActualizacion : Date;
    fechaCreacion : Date;
    numeroPiezas : number;
    pesoBruto : number;
    pesoNeto: number;
    tipoJoya : string;
    valorAvaluo : number;
    valorComercial : number;
    valorOro: number;
    valorRealizacion : number;
    tbQoTipoOro :  TbQoTipoOro; 
    tbQoCreditoNegociacion : TbQoCreditoNegociacion;
    constructor(){
        this.tbQoCreditoNegociacion = new TbQoCreditoNegociacion();
        this.tbQoTipoOro = new TbQoTipoOro();
    } 
}