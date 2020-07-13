import { TbReferencia } from './TbReferencia';
import { TbQoDireccionCliente } from './TbQoDireccionCliente';
import { TbQoPatrimonioCliente } from './TbQoPatrimonioCliente';
import { TbQoIngresoEgresoCliente } from './TbQoIngresoEgresoCliente';
import { TbCotizacion } from './TbCotizacion';

export class TbQoCliente {
  id: string;
  actividadEconomica: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  apoderadoCliente: string;
  campania: string;
  canalContacto: string;
  cargasFamiliares: string;
  cedulaCliente: string;
  edad: string;
  email: string;
  estado: string;
  estadoCivil: string;
  fechaActualizacion: string;
  fechaCreacion: string;
  fechaNacimiento: string;
  genero: string;
  lugarNacimiento: string;
  nacionalidad: string;
  nivelEducacion: string;
  primerNombre: string;
  publicidad: string;
  segundoNombre: string;
  separacionBienes: string;
  telefonoFijo: string;
  telefonoMovil: string;
  actividadEconomicaEmpresa: string;
  cargo: string;
  nombreEmpresa: string;
  ocupacion: string;
  origenIngreso: string;
  profesion: string;
  relacionDependencia: string;
  telefonoTrabajo: string;
  telefonoAdicional: string;
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
