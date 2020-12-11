import { TbQoNegociacion } from "./TbQoNegociacion";

export class TbQoCreditoNegociacion {
    id: number;
    aPagarCliente: number;
    aRecibirCliente: number;
    deudaInicial: number ;
    tablaAmortizacion: string;
    montoFinanciado: number ;
    codigo: string;
    estado: string;
    estadoSoftbank: string;
    codigoCash: string;
    codigoDevuelto: string;
    descripcionDevuelto: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    pagoDia: Date;
    fechaEfectiva: Date;
    fechaVencimiento: Date;
    idAgencia: number;
    numeroOperacion: string;
    totalInteresVencimiento: number ;
    totalCostoNuevaOperacion: number ;
    numeroFunda: number;
    descripcionProducto: string;
    montoDiferido: number;
    montoPreaprobado: number;
    montoSolicitado: number;
    plazoCredito: number;
    riesgoTotalCliente: number;
    tipo: string;
    tipoCarteraQuski: string;
    valorCuota: number;
    codigoTipoFunda: string;
    uriImagenSinFunda: string;
    firmanteOperacion:  string;
    tipoCliente: string;
    numeroCuenta: string;
    uriImagenConFunda: string;
    identificacionCodeudor: string;
    nombreCompletoCodeudor: string;
    fechaNacimientoCodeudor: Date;
    identificacionApoderado: string;
    nombreCompletoApoderado: string;
    fechaNacimientoApoderado: Date;
    tbQoNegociacion: TbQoNegociacion;
    codigoOperacion:  string;
    costoCustodia: number;
    costoFideicomiso: number;
    costoSeguro: number;
    costoTasacion: number;
    costoTransporte: number;
    costoValoracion: number;
    cuota: number;
    custodiaDevengada: number;
    dividendoFlujoPlaneado: number;
    dividendoProrrateo: number;
    formaPagoCapital:string;
    formaPagoCustodia: string;
    formaPagoCustodiaDevengada: string;
    formaPagoFideicomiso: string;
    formaPagoGastoCobranza: string;
    formaPagoImpuestoSolca: string;
    formaPagoInteres: string;
    formaPagoMora: string;
    formaPagoSeguro: string;
    formaPagoTasador: string;
    formaPagoTransporte: string;
    formaPagoValoracion: string;
    gastoCobranza: number;
    impuestoSolca: number;
    montoDesembolso: number;
    montoPrevioDesembolso: number;
    netoAlCliente: number;
    periodicidadPlazo: string;
    periodoPlazo: string;
    pesoFunda: string;
    porcentajeFlujoPlaneado:number;
    saldoCapitalRenov:number;
    saldoInteres:number;
    saldoMora:number;
    tipoOferta: string;
    totaPesoNetoConFunda: number;
    totalCostosOperacionAnterior:number;
    totalGastosNuevaOperacion: number;
    totalPesoBrutoConFunda: number;
    totalPesoBrutoGarantia: number;
    totalPesoNeto: number;
    totalValorAvaluo: number;
    totalValorComercial: number;
    totalValorRealizacion: number;
    valorAPagar:number;
    valorARecibir: number;

    constructor(idNegociacion?: number) {
        this.tbQoNegociacion = new TbQoNegociacion();
        this.tbQoNegociacion.id = idNegociacion > 0 ? idNegociacion : null;
    }

}