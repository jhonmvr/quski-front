import { ActividadEconomicaCliente } from './ActividadEconomicaCliente';
import { TelefonoCliente } from './TelefonoCliente';
import { ContactosCliente } from './ContactosCliente';
import { CuentasBancariasCliente } from './CuentasBancariasCliente';

export class CrearCliente  {
  idTipoIdentificacion : number;
  identificacion: string;
  primerApellido: string;
  segundoApellido: string;          // Franco,
  primerNombre: string;             // Pablo,
  segundoNombre: string;            // Rafael,
  barrio: string;                   // Spingfield,
  callePrincipal: string;           // Av Siempre Viva 743,
  calleSecundaria: string;          // Desconocida,
  referencia: string;               // Junto a la casa de Flanders,
  email: string;                    // pvelez@cloudstudio.com.ec,
  idPais: number;                   // 52
  fechaNacimiento: string;          // 1991-06-30,
  numeroCargasFamiliares: number;   // 0,
  actividadEconomica: ActividadEconomicaCliente;      // Se necesita catalogo {"idActividadEconomica": 2431},
  telefonos: TelefonoCliente[];                       // [{"esMovil": true, "numero": "0996553117","esPrincipal": true}],
  contactosCliente: ContactosCliente[];               // [{"nombres": "John","apellidos": "Doe","direccion": "Av Siempre Viva 742","telefono": "0000000000","codigoTipoReferencia": "000","telefonoCelular": "9999999999","activo": true},{"nombres": "Jane","apellidos": "Doe","direccion": "Av Siempre Viva 742","telefono": "1111111111","codigoTipoReferencia": "000","telefonoCelular": "8888888888","activo": true}],
  cuentasBancariasCliente: CuentasBancariasCliente[]; // [{"idBanco": 171,"cuenta": "123456789","activo": true,"esTarjetaCredito": false},{"idBanco": 171,"cuenta": "987654321","activo": true,"esTarjetaCredito": true}],
  idResidencia: number;   // 1352,
  idLugarNacimiento: number;   // 1352,
  idPaisNacimiento:number;   // 52,
  idAgencia: number;   // 2,
  codigoEstadoCivil: string;   // S,
  esMasculino: Boolean;   // true,
  codigoEducacion: string;   // U,
  codigoVivienda: string;   // A,
  codigoProfesion: string;   // 336,
  codigoSectorVivienda: string;   // R
  constructor(){
    this.idTipoIdentificacion = 1;
    this.actividadEconomica = new ActividadEconomicaCliente();
    this.telefonos = new Array<TelefonoCliente>();
    this.contactosCliente = new Array<ContactosCliente>();
    this.cuentasBancariasCliente = new Array<CuentasBancariasCliente>();
  }
}