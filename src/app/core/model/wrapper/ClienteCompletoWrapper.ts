import { TbQoCliente } from '../quski/TbQoCliente';
import { TbQoCuentaBancariaCliente } from '../quski/TbQoCuentaBancariaCliente';
import { TbQoDatoTrabajoCliente } from '../quski/TbQoDatoTrabajoCliente';
import { TbQoDireccionCliente } from '../quski/TbQoDireccionCliente';
import { TbQoIngresoEgresoCliente } from '../quski/TbQoIngresoEgresoCliente';
import { TbQoPatrimonio } from '../quski/TbQoPatrimonio';
import { TbQoTelefonoCliente } from '../quski/TbQoTelefonoCliente';
import { TbReferencia } from '../quski/TbReferencia';

export class ClienteCompletoWrapper{
    cliente: TbQoCliente;
    direcciones : Array<TbQoDireccionCliente> ;
    ingresos : Array<TbQoIngresoEgresoCliente> ;
    patrimonios : Array<TbQoPatrimonio> ;
    referencias : Array<TbReferencia> ;
    telefonos : Array<TbQoTelefonoCliente> ;
    datosTrabajo : TbQoDatoTrabajoCliente;
    cuentas : Array<TbQoCuentaBancariaCliente> ;
    isSoftbank: boolean;
    constructor( ){

    }
}