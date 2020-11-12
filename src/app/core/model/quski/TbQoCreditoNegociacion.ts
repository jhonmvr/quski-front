import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoCreditoNegociacion {
    id: number;
    plazoCredito: number;
    montoPreaprobado: number;
    valorCuota: number;
    tbQoNegociacion: TbQoNegociacion;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    estado: string;
    fechaVencimiento: Date;
    idAgencia: number;
    pagoDia: Date; 
    totalPesoBrutoConFunda: number;
    idBanco: number;
    numeroBanco: string;
    identificacionCodeudor: string; 
    nombreCompletoCodeudor: string; 
    fechaNacimientoCodeudor: Date;
    identificacionApoderado: string; 
    nombreCompletoApoderado: string; 
    fechaNacimientoApoderado: Date;
    tipo: string;
    codigo: string;
    destinoOperacion: string;
    estadoSoftbank: string;
    fechaEfectiva: Date;
    montoDesembolso: number;
    montoDiferido: number;
    montoSolicitado: number;
    netoAlCliente: number;
    riesgoTotalCliente: number;
    tipoCarteraQuski: string;
    totalCostoNuevaOperacion: number;
    arecibirCliente: number;
    apagarCliente: number;
    numeroFunda: number;
    pesoFunda: string;
    descripcionProducto: string;
    constructor(idNegociacion?: number) {
        this.tbQoNegociacion = new TbQoNegociacion();
        this.tbQoNegociacion.id = idNegociacion > 0 ? idNegociacion : null;
    }

}