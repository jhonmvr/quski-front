import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTasacion } from "./TbQoTasacion";
import { TbQoCliente } from "./TbQoCliente";

export class TbQoDevolucion {
    id:number;
    codigo: string;
    asesor: string;
    aprobador: string;
    idAgencia: string;
    nombreCliente: string;
    cedulaCliente: string;
    codigoOperacionMadre: string;
    codigoOperacion: string;
    nivelEducacion: string;
    estadoCivil: string;
    separacionBienes: string;
    estado: string;
    fechaNacimiento: string;
    nacionalidad:string;
    lugarNacimiento:string;
    fechaActualizacion : Date      // null,
    fechaCreacion : Date           // "2020-01-16",
    fechaAprobacionSolicitud : Date      // null,
    fechaArribo : Date           // "2020-01-16",
    tipoCliente:string;
    observaciones:string;
    agenciaEntrega : string;
    valorCustodiaAprox : number;
    codeHerederos : string;
    codeDetalleCredito: string;
    codeDetalleGarantia: string;
    genero: string;
    fundaActual: string;
    fundaMadre: string;
    cedulaApoderado: any;
    ciudadTevcol: string;
    nombreAgenciaSolicitud : string;
    agenciaEntregaId: number;
    fechaEfectiva: any;
    pesoBruto: number;
    nombreApoderado: any;
    valorAvaluo: number;

    constructor(){
        
       // this.tbQoTasacion = new TbQoTasacion();
    }

}