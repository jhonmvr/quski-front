import { TbReferencia } from './TbReferencia';
import { TbQoDireccionCliente } from './TbQoDireccionCliente';
import { TbQoPatrimonioCliente } from './TbQoPatrimonioCliente';
import { TbQoIngresoEgresoCliente } from './TbQoIngresoEgresoCliente';
import { TbCotizacion } from './TbCotizacion';

export class TbQoCliente {
  id: number;
  actividadEconomica: string;
  actividadEconomicaEmpresa : string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  apoderadoCliente: string;
  campania: string;
  canalContacto: string;
  cargasFamiliares: number;
  cargo: string;
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
  nombreEmpresa: string;
  ocupacion: string;
  origenIngreso: string;
  primerNombre: string;
  profesion: string;
  publicidad: string;
  relacionDependencia: string;
  segundoNombre: string;
  separacionBienes: string;
  telefonoAdicional: string;
  telefonoFijo: string;
  telefonoMovil: string;
  telefonoTrabajo: string;
  aprobacionMupi: string;


  tbQoArchivoClientes: null;
  tbQoCotizador: TbCotizacion[];
  tbQoDocumentoHabilitantes: null;
  tbQoNegociacions: null;
  tbQoDireccionClientes: TbQoDireccionCliente[];
  tbQoPatrimonios: TbQoPatrimonioCliente[];
  tbQoReferenciaPersonals: TbReferencia[];
  tbQoIngresoEgresoClientes: TbQoIngresoEgresoCliente[];
  tbQoRiesgoAcumulados: null;
  constructor() {
    // this.tbMiJoyaSims = new Array<TbMiJoyaSim>();
    this.tbQoIngresoEgresoClientes = new Array<TbQoIngresoEgresoCliente>();
    this.tbQoPatrimonios = new Array<TbQoPatrimonioCliente>();
    this.tbQoReferenciaPersonals = new Array<TbReferencia>();
    this.tbQoDireccionClientes = new Array<TbQoDireccionCliente>();
  }
}
