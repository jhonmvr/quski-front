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
    codigoOperacion: string;
    nivelEducacion: string;
    separacionBienes: string;
    estado: string;
    fechaNacimiento: string;
    nacionalidad:string;
    lugarNacimiento:string;
    tipoCliente:string;
    observaciones:string;
    agenciaEntrega : string;
    valorCustodia : string;
    codeHerederos : string;
    codeDetalleCredito: string;
    codeDetalleGarantia: string;

    constructor(){
        
       // this.tbQoTasacion = new TbQoTasacion();
    }

}