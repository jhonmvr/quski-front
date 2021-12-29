import { TbQoNegociacion } from "./TbQoNegociacion";
import { TbQoTasacion } from "./TbQoTasacion";
import { TbQoCliente } from "./TbQoCliente";

export class TbQoDevolucion {
    id:any;
    codigo: string;
    asesor: string;
    aprobador: string;
    idAgencia: string;
    nombreCliente: string;
    cedulaCliente: string;
    codigoOperacionMadre: string;
    codigoOperacion: string;
    observacionCancelacion: string;
    nivelEducacion: string;
    ciudadEntrega: string;
    estadoCivil: string;
    separacionBienes: string;
    estado: string;
    fechaNacimiento: string;
    esMigrado: boolean;
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
    correoAsesor: string;
    correoCliente: string;
    montoCredito;
    plazoCredito;
    tipoCredito;
    numeroCuentaCliente;
    nombreAsesor;

    constructor(){
        
       // this.tbQoTasacion = new TbQoTasacion();
    }

}