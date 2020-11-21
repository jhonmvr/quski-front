import { TbQoCliente } from "./TbQoCliente";

export class TbReferencia{
     id: number;
     // nombresCompletos : string;  
     nombres: string;
     apellidos: string;
     parentesco : string;
     direccion : string;
     telefonoMovil : string;
     estado: string;
     tbQoCliente : TbQoCliente;
     telefonoFijo : string;
     
     constructor(){
          this.tbQoCliente = new TbQoCliente();
     }
}