import { ActividadEconomicaCliente } from './ActividadEconomicaCliente'
import { TelefonosCliente } from './TelefonosCliente'
import { ContactosCliente } from './ContactosCliente'
import { CuentasBancariasCliente } from './CuentasBancariasCliente'
import {DireccionClienteService} from './DireccionClienteService'
import { DatosTrabajoCliente } from './DatosTrabajoCliente'

export class ClienteSoftbank {

  idTipoIdentificacion: number                    //1,
  identificacion:string                           //"1311066441",
  nombreCompleto: string                          //"Pablo Rafael Vélez Franco",
  primerApellido: string                          //"Vélez",
  segundoApellido: string                         //"Franco",
  primerNombre: string                            //"Pablo",
  segundoNombre: string                           //"Rafael",
  esCliente: boolean                              //false,
  codigoMotivoVisita: any                         //null,
  fechaIngreso: Date                              //"0001-01-01",
  idAgencia: number                               //2,
  idPaisNacimiento: number                        //52,
  idPais: number                                  //52,
  idLugarNacimiento: number                       //1352,
  actividadEconomica: ActividadEconomicaCliente 

  fechaNacimiento: Date                         //"1991-06-30",
  codigoSexo: string                            //"M",
  codigoProfesion: string                       //"336",
  codigoEstadoCivil: string                     //"S",
  codigoEducacion: string                       //"U",
  numeroCargasFamiliares: number                //5,
  email: string                                 //pvelez@cloudstudio.com.ec,
  codigoUsuario: number                         //1,
  codigoUsuarioAsesor: any                      //null,

  direcciones: DireccionClienteService []
  
  telefonos: TelefonosCliente []

  cuentasBancariasCliente: CuentasBancariasCliente []
  
	contactosCliente: ContactosCliente []

  datosTrabajoCliente: DatosTrabajoCliente []
  
    activos: number                                 //0.00,
    pasivos: number                                 //0.00,
    ingresos: number                                //0.00,
    egresos: number                                 //0.00,
    mensaje: boolean                                //null,
    codigoServicio: string                          //"200"


  constructor() {
    this.actividadEconomica = new ActividadEconomicaCliente();
    this.direcciones = new Array<DireccionClienteService>();
    this.telefonos = new Array<TelefonosCliente>();
    this.contactosCliente = new Array<ContactosCliente>();
    this.cuentasBancariasCliente = new Array<CuentasBancariasCliente>();
    this.datosTrabajoCliente = new Array<DatosTrabajoCliente>();
   }
  }
   
  /*idTipoIdentificacion: number              // 1,
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
  */
