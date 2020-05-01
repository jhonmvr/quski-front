import { TbMiCliente } from "./TbMiCliente";
import { TbMiLiquidacion } from "./TbMiLiquidacion";
import { TbMiJoya } from "./TbMiJoya";
import { TbMiContratoCalculo } from "./TbMiContratoCalculo";

export class TbMiContrato{
    id:number;
    tbMiCliente: TbMiCliente;
    //tbMiAgencia:TbMiAgencia;
    //tbMiAgente:TbMiAgente;
    codigo:string;
    valorContrato:number;
    porcentajeTasacion:number;
    valorTasacion:number;
    porcentajeGastoAdm:number;
    valorGastoAdm:number;
    valorCustodia:number;
    porcentajeCustodia:number;
    porcentajeTransporte:number;
    valorTransporte:number;
    valorMunta:number;
    estado:string;
    gestion:string;
    tbMiFunda:any;
    tbMiLiquidacion:TbMiLiquidacion;
    tipoCompra:string;
    fechaVencimiento:Date;
    fechaCreacion:any;
    usuarioCreacion:any;
    usuarioActualizacion:string;
    proceso: string;
    tbMiJoyas:TbMiJoya[];
    tbMiContratoCalculos:TbMiContratoCalculo[];
    constructor(esVacio:boolean){
        if(!esVacio){
            //this.tbMiAgencia = new TbMiAgencia();
            this.tbMiCliente = new TbMiCliente();
            //this.tbMiAgente = new TbMiAgente();
            //this.tbMiLiquidacion = new TbMiLiquidacion();
        }
    }
}