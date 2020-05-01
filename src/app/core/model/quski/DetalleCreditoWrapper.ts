import { TbCotizacion } from "./TbCotizacion";

export class DetalleCreditoWrapper{
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
    tbQoCotizador : TbCotizacion;
    constructor(){
     
     
        this.tbQoCotizador = new TbCotizacion();
    }
}