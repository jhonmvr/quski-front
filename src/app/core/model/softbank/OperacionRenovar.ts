import { DatosImpCom } from './DatosImpCom'

export class OperacionRenovar  {
  idTipoIdentificacion : number           // 1,
  identificacion :  string                // "1311066441",
  nombreCliente :  string                 // "Pablo Rafael Vélez Franco",
  fechaNacimientoCliente :  string        // "1991-06-30",
  fechaEfectiva :  string                 // "2020-03-24",
  numeroOperacionMadre : string           // "2020001985",
  codigoTablaAmortizacionQuski :  string  // "A107",
  codigoTipoPrestamo :  string            // "001",
  pagodia : number                        // 24,
  cupoPrestamo :  number                  // 0.0,
  montoSolicitado : number                // 4000.0,
  datosCaptacion : any                    // null,
  datosEmision :  any                     // null,
  datosImpCom : DatosImpCom[]             // 
  datosReferencia : any                   // null,
  datosCuentaDebito : any                 // null

  constructor(){
    this.datosImpCom =  new Array<DatosImpCom>();
  }
}