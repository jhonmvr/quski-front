import { ActividadEconomicaCliente } from './ActividadEconomicaCliente'
import { TelefonoCliente } from './TelefonoCliente'
import { ContactosCliente } from './ContactosCliente'
import { CuentasBancariasCliente } from './CuentasBancariasCliente'

export class ClienteSoftbank {
 
  idTipoIdentificacion: number              // 1,
  identificacion: string                    // "1311066442",
  primerApellido: string                    // "VÉLEZ",
  segundoApellido: string                   // "FRANCO",
  primerNombre: string                      // "PABLO",
  segundoNombre: string                     // "RAFAEL",
  barrio: string                            // "SPINGFIELD",
  callePrincipal: string                    // "AV SIEMPRE VIVA 743",
  calleSecundaria: string                   // "DESCONOCIDA",
  referencia: string                        // "JUNTO A LA CASA DE FLANDERS",
  email: string                             // "pvelez@cloudstudio.com.ec",
  idPais: number                            // 52,
  idResidencia: number                      // 1352,
  fechaNacimiento: Date                     // "1991-06-30",
  numeroCargasFamiliares: number            // 0,
  actividadEconomica: ActividadEconomicaCliente
  telefonos: TelefonoCliente[]
  contactosCliente: ContactosCliente[]
  cuentasBancariasCliente: CuentasBancariasCliente[]
  integrantes: any                          // null,
  representantes: any                       // null,
  idLugarNacimiento: number                 // 1352,
  idPaisNacimiento: number                  // 52,
  idAgencia: number                         // 2,
  codigoEstadoCivil: string                 // "S",
  esMasculino: boolean                      // true,
  codigoEducacion: string                   // "U",
  codigoVivienda: string                    // "A",
  codigoProfesion: string                   // "336",
  codigoSectorVivienda: string              // "R",
  activos: number                           // 0.00,
  pasivos: number                           // 0.00,
  ingresos: number                          // 0.00,
  egresos: number                           // 0.00,
  nombreComercial: any                      // null,
  razonSocial: any                          // null,
  esGrupo: boolean                          // false,
  registroLegal: any                        //  null,
  fechaCreacion: any                        //  null,
  fechaRegistroLegal: any                   //  null,
  existeError: boolean                      // false,
  error: string                             // null,
  codigoError: string                       // "200",
  validaciones: any                         // null

  constructor() {
    this.actividadEconomica = new ActividadEconomicaCliente();
    this.telefonos = new Array<TelefonoCliente>();
    this.contactosCliente = new Array<ContactosCliente>();
    this.cuentasBancariasCliente = new Array<CuentasBancariasCliente>();
   }
}