import { TbQoCliente } from './TbQoCliente';

export class TbQoPatrimonioCliente{
  
    activos: string;
    avaluo: number;
    pasivos: string;
    tbQoCliente : TbQoCliente;
    
    constructor(){
       this.tbQoCliente = new TbQoCliente();

    }
}