import { TbQoCliente } from './TbQoCliente';

export class TbQoIngresoEgresoCliente{
  
    esIngreso: Boolean;
    esEgreso: Boolean;
    valor: number;
    tbQoCliente : TbQoCliente;

    constructor(valor: number, esIngreso: boolean){
        this.valor = valor;
        this.esEgreso = esIngreso ? false : true;
        this.esIngreso = esIngreso ? true : false;
        this.tbQoCliente = new TbQoCliente();
    }
}