import { TbQoCliente } from './TbQoCliente';

export class TbQoDireccionCliente {
    idSoftbank;
    id: string;
    barrio: string;
    callePrincipal: string;
    calleSegundaria: string;
    direccionEnvioCorrespondencia: Boolean;
    direccionLegal: Boolean;
    numeracion: string;
    estado: string;
    referenciaUbicacion : string ;
    sector : string ;
    divisionPolitica: string;
    tipoDireccion : string ;
    tipoVivienda : string ;
    tbQoCliente : TbQoCliente;
    constructor(){     
        this.tbQoCliente = new TbQoCliente();
    }
}