import { TbQoCliente } from "./TbQoCliente";

export class TbReferencia{
     id: number;
     // nombresCompletos : string;  
     nombresRef: string;
     apellidosRef: string;
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