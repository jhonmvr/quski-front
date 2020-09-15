import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTasacion } from "./TbQoTasacion";
import { TbQoCliente } from "./TbQoCliente";
import { TbQoAgencia } from "./TbQoAgencia";

export class TbQoCreditoNegociacion {
    id:number;
    plazoCredito: string;
    montoPreaprobado: string;
    recibirCliente: string;
    costoNuevaOperacion: string;
    costoCustodia: string;
    costoTransporte: string;
    costoCredito: string;
    costoSeguro: string;
    costoResguardo: string;
    costoEstimado: string;
    valorCuota: string;
    idUsuario:string;
    fechaCracion:string;
    fechaVencimiento:string;
    codigoOperacion:string;
    tbQoCliente:TbQoCliente;
    tbQoNegociacion : TbQoNegociacion;
    tbQoTasacion : TbQoTasacion  [];

    constructor(){
        this.tbQoNegociacion = new TbQoNegociacion();
       // this.tbQoTasacion = new TbQoTasacion();
    }

}