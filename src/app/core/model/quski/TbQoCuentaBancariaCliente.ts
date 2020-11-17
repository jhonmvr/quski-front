import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { TbQoCliente } from "./TbQoCliente";

export class TbQoCuentaBancariaCliente{
     id: number;
     idSoftbank: number;
     tbQoCliente : TbQoCliente;
     banco: any; 
     cuenta: string;
     esAhorros: boolean;
     estado: string;
     constructor(){
          this.tbQoCliente = new TbQoCliente();
     }
}