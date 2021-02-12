
export class ConsultaOferta  {
  perfilRiesgo: number   // 1
  origenOperacion: string // N
  riesgoTotal: number // 0.00
  fechaNacimiento: Date // 24%2F05%2F1970
  perfilPreferencia: string // B
  agenciaOriginacion: string // 020
  identificacionCliente: string // 1102777776
  calificacionMupi: string // s
  coberturaExcepcionada: number // 90
  tipoJoya: string // ANI
  descripcion: string // BUEN+ESTADO
  estadoJoya: string // BUE
  tipoOroKilataje: string // 18K
  pesoGr: number // 7.73
  tienePiedras: string // S
  detallePiedras: string // PIEDRAS
  descuentoPesoPiedras: number // 0.73
  pesoNeto: number // 7.00
  precioOro: number // 263.72
  valorAplicableCredito: number // 293.02
  valorRealizacion: number // 232.07
  numeroPiezas: number // 1
  descuentoSuelda: number // 0.00
  constructor(){
    this.perfilRiesgo = 1;
    this.origenOperacion = "N";
    this.coberturaExcepcionada = 0;
    this.riesgoTotal = 0.00;
    this.perfilPreferencia = "B";
    this.agenciaOriginacion = "020";
    this.calificacionMupi = "S";
    this.tipoJoya = "ANI";
    this.descripcion = "BUEN ESTADO";
    this.estadoJoya = "BUE";
    this.pesoGr = 7.73;
    this.tienePiedras = "s";
    this.detallePiedras = "PIEDRAS";
    this.descuentoPesoPiedras = 0.73;
    this.pesoNeto = 7.00;
    this.precioOro = 263.72;
    this.valorAplicableCredito = 293.02;
    this.valorRealizacion = 232.07;
    this.numeroPiezas = 1;
    this.descuentoSuelda = 0.00;
  }
}