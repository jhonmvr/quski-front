
import { TbQoPrecioOro } from "./TbQoPrecioOro";

import { TbQoVariablesCrediticia } from "./TbQoVariablesCrediticia";
import { TbQoTasacion } from "./TbQoTasacion";
import { TbQoCreditoNegociacion } from "./TbQoCreditoNegociacion";
import { TbQoCliente } from "./TbQoCliente";


export class TbQoNegociacion {
    id: number;
    asesorResponsable : string
    codigoOperacion : string
    estado: string;
    fechaActualizacion: Date;
    fechaCreacion: Date;
    idAsesorResponsable : number
    procesoActualNegociacion : string
    estadoNegociacion : string
    tipoNegociacion : string
    tbQoCreditoNegociacions : TbQoCreditoNegociacion[]
    tbQoDocumentoHabilitantes : null
    tbQoCliente : TbQoCliente
    tbQoVariablesCrediticias : TbQoVariablesCrediticia [];
    constructor(){
       this.tbQoCliente = new TbQoCliente();
       this.tbQoCreditoNegociacions = new Array<TbQoCreditoNegociacion>();
       this.tbQoVariablesCrediticias = new Array<TbQoVariablesCrediticia>();

    }

}


