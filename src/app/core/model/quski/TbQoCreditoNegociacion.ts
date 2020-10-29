import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoCreditoNegociacion {
    id: number;
    codigo: string;
    destinoOperacion: string;
    estado: string;
    estadoSoftbank: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    fechaEfectiva: Date;
    fechaVencimiento: Date;
    idAgencia: number;
    joyasSeleccionadas: string;
    montoDesembolso: number;
    montoDiferido: number;
    montoPreaprobado: number;
    montoSolicitado: number;
    netoAlCliente: number;
    plazoCredito: number;
    riesgoTotalCliente: number;
    tipo: string;
    tipoCarteraQuski: string;
    totalCostoNuevaOperacion: number;
    valorCuota: number;
    arecibirCliente: number;
    apagarCliente: number;
    numeroFunda: number;
    pesoFunda: string;
    descripcionProducto: string;
    tbQoNegociacion: TbQoNegociacion;
    constructor(idNegociacion?: number) {
        this.tbQoNegociacion = new TbQoNegociacion();
        this.tbQoNegociacion.id = idNegociacion > 0 ? idNegociacion : null;
    }

}