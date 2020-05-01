import { TbMiJoyaSim } from "./TbMiJoyaSim";

export class TbMiCotizacion {
    id: string;
    descripcion: string;
    estado: string;
    montoCotizacion: number;
    
    nombreCotizacion: string;
    fechaActualizacion: string;
    fechaCreacion: string;
    fechaVencimiento :Date;
 

    //Calcular valor
    tasacion : number ;
    transporte : number ;
    custodia : number ;
    gastosAdministrativos : number ;
    totalCancelacion : number ;
    desembolso : number ;
    porcentajeCustodia : number ;
    plazoContrato:number;
    tbMiJoyaSims : TbMiJoyaSim [];
    porcentajeTasacion : number ;
  porcentajeGastoAdm: number;
  porcentajeTransporte: any;

  
    constructor(){
      // this.tbMiJoyaSims = new Array<TbMiJoyaSim>();
        
    }
}