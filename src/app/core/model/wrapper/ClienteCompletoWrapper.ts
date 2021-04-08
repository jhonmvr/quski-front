import { TbQoCliente } from '../quski/TbQoCliente';
import { TbQoCuentaBancariaCliente } from '../quski/TbQoCuentaBancariaCliente';
import { TbQoDatoTrabajoCliente } from '../quski/TbQoDatoTrabajoCliente';
import { TbQoDireccionCliente } from '../quski/TbQoDireccionCliente';
import { TbQoTelefonoCliente } from '../quski/TbQoTelefonoCliente';
import { TbReferencia } from '../quski/TbReferencia';

export class ClienteCompletoWrapper{
    cliente: TbQoCliente;
    codigoBpm: string;
    direcciones : Array<TbQoDireccionCliente> ;
    referencias : Array<TbReferencia> ;
    telefonos : Array<TbQoTelefonoCliente> ;
    datosTrabajos : Array<TbQoDatoTrabajoCliente>;
    cuentas : Array<TbQoCuentaBancariaCliente> ;
    isSoftbank: boolean;
    constructor( ){

    }
}