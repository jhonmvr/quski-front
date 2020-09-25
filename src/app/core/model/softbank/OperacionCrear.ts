import { DatosImpCom } from './DatosImpCom'
import { DatosCuentaCliente } from './DatosCuentaCliente'
import { Garantias } from './Garantias'
import { DatosRegistro } from './DatosRegistro';

export class OperacionCrear{

  idTipoIdentificacion: number            //1,
  identificacion: string                  //1311066441,
  nombreCliente: string                   //Pablo Rafael Vélez Franco,
  esProductoOro: boolean                  //false,
  fechaEfectiva: string                   //2020-03-24,
  codigoTablaAmortizacionQuski: string    //A107,
  codigoTipoCarteraQuski: string          //MO3,
  codigoTipoPrestamo: string              //001,
  montoFinanciado: number                 //0.0,
  pagoDia: number                         //24,
  codigoGradoInteres: string              //"",
  datosRegistro: DatosRegistro

  datosImpCom: DatosImpCom[]
  datosCuentaCliente: DatosCuentaCliente []
  garantias:  Garantias 

  constructor(){
    this.datosRegistro = new DatosRegistro();
    this.datosImpCom =  new Array<DatosImpCom>();
    this.datosCuentaCliente = new Array<DatosCuentaCliente>();
    this.garantias = new Garantias();
  }
}