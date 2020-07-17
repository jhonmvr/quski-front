import { DatosImpCom } from './DatosImpCom'

export class OperacionCrear{
  idTipoIdentificacion : number           // 1,
  identificacion :  string                // "1311066441",
  nombreCliente :  string                 // "Pablo Rafael Vélez Franco",
  fechaNacimientoCliente :  string        // "1991-06-30",
  fechaEfectiva :  string                 // "2020-03-24",
  codigoTablaAmortizacionQuski :  string  // "A107",
  codigoTipoCarteraQuski :  string        // "MO3",
  codigoTipoPrestamo :  string            // "001",
  cupoPrestamo :  number                  // 0.0,
  montoSolicitado : number                // 4000.0,
  pagoDia : number                        // 24,
  datosCaptacion : any                    // null,
  datosEmision :  any                     // null,
  datosImpCom : DatosImpCom[]             // 
  datosReferencia : any                   // null,
  datosCuentaDebito : any                 // null
  constructor(){
    this.datosImpCom =  new Array<DatosImpCom>();
  }
}