import { StringNullableChain } from 'lodash';
import { DescuentosOperacionWrapper } from './DescuentosOperacionWrapper';
import { GarantiaWrapper } from './GarantiaWrapper';
import { ParametrosRiesgoWrapper } from './ParametrosRiesgoWrapper';
export class ConsultaPrecioJoya{
    cedulaCliente:string;
    fechaNacimiento : string;
    tipoOroKilataje : string ;
    pesoNeto : string ;
    constructor( cedula: string, fecha: string, peso: string, tipo?: string ){
        this.cedulaCliente = cedula.length  > 9 ? cedula : null;
        this.fechaNacimiento = fecha.length > 0 ? fecha  : null; 
        this.pesoNeto = peso.length > 0 ? peso : null;
        this.tipoOroKilataje = tipo.length != null ? tipo   : "18K";
    }
}
