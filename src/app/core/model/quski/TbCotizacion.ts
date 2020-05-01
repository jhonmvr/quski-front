import { TbMiJoyaSim } from "./TbMiJoyaSim";
import { TbQoPrecioOro } from "./TbQoPrecioOro";
import { TbQoCliente } from "./TbQoCliente";
import { DetalleCreditoWrapper } from "./DetalleCreditoWrapper";
import { TbQoVariableCrediticia } from "./TbQoVariableCrediticia";

export class TbCotizacion {
    id: string;
    gradoInteres: string;
    motivoDesestimiento: string;
    aprobacionMupi: string;
    estado: string;
    tbQoPrecioOro : TbQoPrecioOro [];
    tbQoCliente : TbQoCliente [];
    tbPrecioOro : TbQoPrecioOro [];
    tbQoVariableCrediticia : TbQoVariableCrediticia [];
    tbQoDetalleCredito : DetalleCreditoWrapper [];
    constructor(){
      // this.tbMiJoyaSims = new Array<TbMiJoyaSim>();
        
    }
}