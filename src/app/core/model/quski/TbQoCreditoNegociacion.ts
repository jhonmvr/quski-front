import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoCreditoNegociacion {
    aPagarCliente: number;
    aRecibirCliente: number;
    codigo: string;
    codigoTipoFunda: string;
    descripcionProducto: string;
    deudaInicial: number;
    estado: string;
    estadoSoftbank: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    fechaEfectiva: Date;
    fechaNacimientoApoderado: Date;
    fechaNacimientoCodeudor: Date;
    fechaVencimiento: Date;
    id: number;
    idAgencia: number;
    identificacionApoderado: string; 
    identificacionCodeudor: string; 
    montoDiferido: number;
    montoFinanciado: number;
    montoPreaprobado: number;
    montoSolicitado: number;
    nombreCompletoApoderado: string; 
    nombreCompletoCodeudor: string; 
    numeroCuenta: string;
    tipoCliente: string;
    firmanteOperacion: string;
    numeroFunda: number;
    numeroOperacion: string;
    pagoDia: Date; 
    plazoCredito: number;
    riesgoTotalCliente: number;
    tablaAmortizacion: string;
    tbQoNegociacion: TbQoNegociacion;
    tipo: string;
    tipoCarteraQuski: string;
    totalCostoNuevaOperacion: number;
    totalInteresVencimiento: number;
    uriImagenConFunda: string;   
    uriImagenSinFunda: string;
    valorCuota: number;

    // Campos eliminados de base --->  totalPesoBrutoConFunda: number;
    // Campos eliminados de base --->  destinoOperacion: string;
    // Campos eliminados de base --->  montoDesembolso: number;
    // Campos eliminados de base --->  netoAlCliente: number;
    // Campos eliminados de base --->  pesoFunda: string;
    
    constructor(idNegociacion?: number) {
        this.tbQoNegociacion = new TbQoNegociacion();
        this.tbQoNegociacion.id = idNegociacion > 0 ? idNegociacion : null;
    }

}