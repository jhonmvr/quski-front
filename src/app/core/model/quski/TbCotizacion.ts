import { TbMiJoyaSim } from "./TbMiJoyaSim";
import { TbQoPrecioOro } from "./TbQoPrecioOro";
import { TbQoCliente } from "./TbQoCliente";
import { DetalleCreditoWrapper } from "./DetalleCreditoWrapper";
import { TbQoVariablesCrediticia } from "./TbQoVariablesCrediticia";
import { TbMiDocumentoHabilitante } from './TbMiDocumentoHabilitante';

export class TbCotizacion {
    id: string;
    aprobacionMupi: string;
    estado: string;
    gradoInteres:string;
    motivoDesestimiento: string;
    
   
    
   // tbQoPrecioOro : TbQoPrecioOro [];
    tbQoCliente : TbQoCliente;
    tbQoPrecioOro : TbQoPrecioOro[];
    tbQoVariablesCrediticias : TbQoVariablesCrediticia[];
    tbQoDetalleCredito : DetalleCreditoWrapper [];
     tbQoDocumentoHabilitantes:TbMiDocumentoHabilitante[];
    constructor(){
      // this.tbMiJoyaSims = new Array<TbMiJoyaSim>();
    this.tbQoVariablesCrediticias = new Array<TbQoVariablesCrediticia>();
        
    }
}