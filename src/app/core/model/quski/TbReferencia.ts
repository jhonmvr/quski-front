import { TbQoCliente } from "./TbQoCliente";

export class TbReferencia{
     id: number;
     nombresCompletos : string;  
     parentesco : string;
     direccion : string;
     telefonoMovil : string;
     estado: string;
     tbQoCliente : TbQoCliente [];
     telefonoFijo : string;
     
     constructor(){
     }
}