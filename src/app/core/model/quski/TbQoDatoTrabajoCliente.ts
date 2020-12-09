import { TbQoCliente } from "./TbQoCliente";

export class TbQoDatoTrabajoCliente{
     id: number;
     actividadEconomica : number;  
     actividadEconomicaMupi : string;
     cargo : string;
     esRelacionDependencia : boolean;
     nombreEmpresa: string;
     esprincipal : boolean;
     estado : string;
     idSoftbank: number;
     ocupacion: string;
     origenIngreso: string;
     tbQoCliente : TbQoCliente;
     
     constructor(){
          this.tbQoCliente = new TbQoCliente();
     }
}