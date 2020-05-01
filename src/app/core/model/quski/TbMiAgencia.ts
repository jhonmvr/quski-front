import { TbMiAgente } from "./TbMiAgente";

export class TbMiAgencia {
    id:number;
    callePrincipal:string;   
    calleSecundaria:string;   
    celular:string;   
    codigo:string;
    componente:string;   
    correoElectronico:string;   
    cuenta:string;   
    direccion:string;    
    estado:string;
    fechaActualizacion:Date;
    fechaCreacion:Date;
    nombreAgencia:string;   
    pais:string;   
    referencia:string;   
    sector:string;   
    seqCd:string;   
    seqCp:string;   
    seqVl:string;   
    telefono:string;   
    usuarioActualizacion:string;   
    usuarioCreacion:string;   
    tbMiCajas:any;
    tbMiDetalleMetas:any;
    tbMiFolletoLiquidacions:any;
    tbMiNotificacions:any;
    canton:any;
    tbMiAgente:TbMiAgente;
    tipoAgencia:any;
    tbMiAgenteSupervisor:TbMiAgente;
    tbMiBodegas:any;
    tbMiContactabilidads:any;
    tbMiContratos:any;
    tbMiCorteCajas:any;
    tbMiFundaRangos:any;
    tbMiLotes:any;
    constructor(){
    }
    
}