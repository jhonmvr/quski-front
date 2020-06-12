import { TbQoCliente } from './TbQoCliente';

export class TbQoIngresoEgresoCliente{
  
    esIngreso: Boolean;
    esEgreso: Boolean;
    valor: number;
    tbQoCliente : TbQoCliente;

    constructor(){
        this.tbQoCliente = new TbQoCliente();
    }
}