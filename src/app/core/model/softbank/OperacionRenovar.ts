import { DatosImpCom } from './DatosImpCom'
import { DatosCodeudorApoderado } from './DatosCodeudorApoderado'
import { DatosRegistroRenovar } from './DatosRegistroRenovar';
import { DatosCuentaCliente } from './DatosCuentaCliente';

export class OperacionRenovar  {

        idTipoIdentificacion: number                                //1,
        identificacion: string                                      //"1311066441",
        nombreCliente: string                                       //"Pablo Rafael Vélez Franco",
        fechaEfectiva: string                                       //"2020-03-24",
        esProductoOro: boolean                                      //false,
        codigoGradoInteres: string                                  //"",
        codigoTablaAmortizacionQuski: string                        //"A107",
        codigoTipoCarteraQuski: string                              //"",
        codigoTipoPrestamo: string                                  //"001",
        montoFinanciado: number                                     //0.0,
        pagoDia: number                                             //24,
        datosCodeudorApoderado: DatosCodeudorApoderado
        datosRegistro: DatosRegistroRenovar
                      
        datosImpCom: DatosImpCom []
        datosCuentaCliente: DatosCuentaCliente []
        numeroOperacionMadre: string                                //"2020001985"

  constructor(){
    this.datosCodeudorApoderado = new DatosCodeudorApoderado();
    this.datosRegistro = new DatosRegistroRenovar();
    this.datosImpCom =  new Array<DatosImpCom>();
    this.datosCuentaCliente = new Array<DatosCuentaCliente>();
  }
}