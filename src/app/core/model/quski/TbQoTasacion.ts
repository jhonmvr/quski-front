import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTipoOro } from "./TbQoTipoOro";
import { TbQoCreditoNegociacion } from "./TbQoCreditoNegociacion";

export class TbQoTasacion{
    tbQoTipoOro :  TbQoTipoOro; 
    pesoBruto : string;
    numeroPiezas : string;
    tipoJoya : string;
    estadoJoya : string;
    descripcion : string;
    descuentoSuelda : string;
    pesoNeto: string;
    valorOro: string;
    valorAvaluo : string;
    descuentoPesoPiedra : string;
    valorComercial : string;
    valorRealizacion : string;
    //tbQoNegociacion : TbQoNegociacion;
    tbQoCreditoNegociacion : TbQoCreditoNegociacion;
    constructor(){
       // this.tbQoNegociacion = new TbQoNegociacion();
        this.tbQoCreditoNegociacion = new TbQoCreditoNegociacion();
        this.tbQoTipoOro = new TbQoTipoOro();
    } 
}