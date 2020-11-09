import { TbQoCliente } from './TbQoCliente';

export class TbQoDireccionCliente {
    id: string;
    barrio: string;
    callePrincipal: string;
    calleSegundaria: string;
    direccionEnvioCorrespondencia: Boolean;
    direccionLegal: Boolean;
    numeracion: string;
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