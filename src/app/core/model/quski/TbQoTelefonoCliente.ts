import { TbQoCliente } from "./TbQoCliente";

export class TbQoTelefonoCliente{
     id: number;
     estado: string;
     tbQoCliente : TbQoCliente;
     idSoftbank : number;
     numero : string;
     tipoTelefono : string;
     
     constructor(){
          this.tbQoCliente = new TbQoCliente();
     }
}