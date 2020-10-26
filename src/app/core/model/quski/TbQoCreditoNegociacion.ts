import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoCreditoNegociacion {




    id: number;
    aPagarCliente: string;
    aRecibirCliente: string;
    riesgoTotalCliente: string;
    netoAlCliente: string;
    plazoCredito: string;
    montoPreaprobado: string;
    montoSolicitado: string;
    montoDiferido: string;
    tipo: string;
    recibirCliente: string;
    costoNuevaOperacion: string;
    costoCustodia: string;
    costoTransporte: string;
    costoCredito: string;
    costoSeguro: string;
    costoResguardo: string;
    costoEstimado: string;
    costoTasacion: string;
    costoValoracion: string;
    solca: string;
    montoDesembolsoBallon: string;
    formaPagoCustodia: string;
    formaPagoResguardo; string;
    formaPagoSeguro: string;
    formaPagoSolca: string;
    formaPagoTasacion: string;
    formaPagoTransporte: string;
    formaPagoValoracion: string;
    valorCuota: string;
    usuario: string;
    fechaCracion: Date;
    fechaActualizacion: Date;
    fechaVencimiento: string;
    codigo: string;
    tbQoNegociacion: TbQoNegociacion;
    idAgencia: number;
    estado: string;

    constructor(idNegociacion?: number) {
        this.tbQoNegociacion = new TbQoNegociacion();
        this.tbQoNegociacion.id = idNegociacion > 0 ? idNegociacion : null;
    }

}