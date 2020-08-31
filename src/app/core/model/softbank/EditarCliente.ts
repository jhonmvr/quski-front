import { EditarTelefonosCliente } from './EditarTelefonosCliente';

export class EditarCliente  {
  idTipoIdentificacion: number; // 1
  identificacion: string; // 1311066441,
  //referencia:string; // Junto a la casa de Flanders,
  //email: string;  //  pvelez@cloudstudio.com.ec
  telefonos: EditarTelefonosCliente [] 
  
  codigoEstadoCivil: string //"Soltero"


  constructor(){
    this.idTipoIdentificacion = 1;
    this.telefonos = new Array<EditarTelefonosCliente>();
  }
}