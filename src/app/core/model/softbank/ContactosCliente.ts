import { TelefonosContactoCliente } from './TelefonosContactoCliente'

export class ContactosCliente  {
  
    id: number                            //16104,
    codigoTipoReferencia: string          //000,
    nombres: string                       //JOHN,
    apellidos: string                     //DOE,
    direccion: string                     //AV SIEMPRE VIVA 742,
    telefonos: TelefonosContactoCliente []
    activo: boolean                       //true

  constructor(){
    this.telefonos = new Array<TelefonosContactoCliente>()
  }
}