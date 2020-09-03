import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTasacion } from "./TbQoTasacion";
import { TbQoCliente } from "./TbQoCliente";

export class TbQoCreditoNegociacion {
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
    codigoOperacion:string;
    tbQoCliente:TbQoCliente;
    tbQoNegociacion : TbQoNegociacion;
    tbQoTasacion : TbQoTasacion  [];
    tbQoAgencia:any;
    constructor(){
        this.tbQoNegociacion = new TbQoNegociacion();
       // this.tbQoTasacion = new TbQoTasacion();
    }

}