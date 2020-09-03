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
   