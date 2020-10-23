import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoCreditoNegociacion {
    id: number;
    plazoCredito: string;
    montoPreaprobado: string;
    montoSolicitado: string;
    montoDiferido: string;
    tipoOperacion: string;
    recibirCliente: string;
    costoNuevaOperacion: string;
    costoCustodia: string;
    costoTransporte: string;
    costoCredito: string;
    costoSeguro: string;
    costoResguardado: string;
    costoEstimado: string;
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