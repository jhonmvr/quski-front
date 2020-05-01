import { TbMiContratoCalculo } from "./TbMiContratoCalculo";
import { TbMiCliente } from "./TbMiCliente";
import { TbMiJoyaSim } from "./TbMiJoyaSim";

export class TbMiAprobarContrato{
    id:number;
    aprobado:number;
    descripcion:string;
    estado:string;
    fechaActualizacion:Date;
    fechaCreacion:Date;
    tipoContrato:string;
    usuarioActualizacion:string;
    usuarioCreacion:string;
    valor:number;
    montoCotizacion:number;
    tbMiCliente:TbMiCliente;
    tbMiContratoCalculos:TbMiContratoCalculo;
    tbMiJoyaSims:TbMiJoyaSim[];
    fechaVencimiento:Date;
    nivelAprobacion:string;
    rolAprobacion:string;
    rolAprobacionDos:string;
    observacionNivelUno:string;
    observacionNivelDos:string;
}