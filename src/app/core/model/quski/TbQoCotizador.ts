import { TbQoCliente } from "./TbQoCliente";

export class TbQoCotizador {
    id: string;
    codigoCotizacion: string
    estado: string;
    fechaActualizacion: Date
    fechaCreacion: Date
    gradoInteres: string;
    motivoDeDesestimiento: string;
    tbQoCliente : TbQoCliente;
    constructor(){
      this.tbQoCliente = new TbQoCliente();
    }
}