import { TbQoCliente } from "./TbQoCliente";

export class TbQoCotizador {
  id: string
  gradoInteres:string
  motivoDeDesestimiento: string
  fechaCreacion: Date
  fechaActualizacion: Date
  estado: string
  aprobacionMupi: string;
  tbQoCliente : TbQoCliente;
  codigoCotizacion
  constructor(){
    this.tbQoCliente = new TbQoCliente();
  }
}