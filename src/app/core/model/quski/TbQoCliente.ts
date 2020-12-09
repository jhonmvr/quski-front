import { TbReferencia } from './TbReferencia';
import { TbQoDireccionCliente } from './TbQoDireccionCliente';
import { TbQoIngresoEgresoCliente } from './TbQoIngresoEgresoCliente';
import { TbQoCotizador } from './TbQoCotizador';
import { TbQoPatrimonio } from './TbQoPatrimonio';
import { TbQoTelefonoCliente } from './TbQoTelefonoCliente';

export class TbQoCliente {
  id: number;
  actividadEconomica: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  campania: string;
  canalContacto: string;
  cargasFamiliares: number;
  cedulaCliente: string;
  edad: number;
  email: string;
  estado: string;
  estadoCivil: string;
  fechaActualizacion: Date;
  fechaCreacion: Date;
  fechaNacimiento: Date;
  genero: string;
  lugarNacimiento: string;
  nacionalidad: string;
  nivelEducacion: string;
  primerNombre: string;
  profesion: string;
  publicidad: string;
  segundoNombre: string;
  separacionBienes: string;
  aprobacionMupi: string;
  nombreCompleto: string;
  usuario:string;
  agencia:number;
  ingresos: number;
  egresos: number;
  pasivos: number;
  activos: number;


  tbQoArchivoClientes: null;
  tbQoCotizador: TbQoCotizador[];
  tbQoDocumentoHabilitantes: null;
  tbQoNegociacions: null;
  tbQoTelefonosClientes: TbQoTelefonoCliente[];
  tbQoDireccionClientes: TbQoDireccionCliente[];
  tbQoPatrimonios: TbQoPatrimonio[];
  tbQoReferenciaPersonals: TbReferencia[];
  tbQoIngresoEgresoClientes: TbQoIngresoEgresoCliente[];
  tbQoRiesgoAcumulados: null;
  constructor() {
    //this.tbQoIngresoEgresoClientes = new Array<TbQoIngresoEgresoCliente>();
    //this.tbQoPatrimonios = new Array<TbQoPatrimonio>();
    //this.tbQoReferenciaPersonals = new Array<TbReferencia>();
    //this.tbQoDireccionClientes = new Array<TbQoDireccionCliente>();
  }
}
