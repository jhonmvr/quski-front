import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTasacion } from "./TbQoTasacion";
import { TbQoCliente } from "./TbQoCliente";

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
    codigo:string;
    tbQoNegociacion : TbQoNegociacion;
    tbQoTasacion : TbQoTasacion  [];
    tbQoAgencia:any;
        
    constructor(idNegociacion? : number ){
        this.tbQoNegociacion = new TbQoNegociacion();
        this.tbQoNegociacion.id = idNegociacion > 0 ? idNegociacion : null;
       // this.tbQoTasacion = new TbQoTasacion();
    }

}