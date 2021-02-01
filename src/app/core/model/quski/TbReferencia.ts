import { TbQoCliente } from "./TbQoCliente";

export class TbReferencia{
     id: number;
     // nombresCompletos : string;  
     nombres: string;
     apellidos: string;
     parentesco : any;
     direccion : string;
     telefonoMovil : string;
     estado: string;
     tbQoCliente : TbQoCliente;
     telefonoFijo : string;
     idSoftbank : any;
     
     constructor(){
          this.tbQoCliente = new TbQoCliente();
     }
}