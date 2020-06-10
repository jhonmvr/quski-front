import { TbQoCliente } from './TbQoCliente';

export class TbQoDireccionCliente {
    id: string;
    barrio: string;
    callePrincipal: string;
    calleSegundaria: string;
    canton: string;
    direccionEnvioCorrespondencia: Boolean;
    direccionLegal: Boolean;
    numeracion: string;
    parroquia :string;
    provincia : string ;
    referenciaUbicacion : string ;
    sector : string ;
    tipoDireccion : string ;
    tipoVivienda : string ;
    tbQoCliente : TbQoCliente;
    constructor(){     
        this.tbQoCliente = new TbQoCliente();
    }
}