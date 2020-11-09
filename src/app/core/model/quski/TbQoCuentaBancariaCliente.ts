import { TbQoCliente } from "./TbQoCliente";

export class TbQoCuentaBancariaCliente{
     id: number;
     idSoftbank: number;
     tbQoCliente : TbQoCliente;
     constructor(){
          this.tbQoCliente = new TbQoCliente();
     }
}