import { TbQoTipoOro } from "./TbQoTipoOro";
import { TbQoCotizador } from "./TbQoCotizador";

export class TbQoPrecioOro  {
    //tipoOro: string;
    id:string;
    precio: string;
    pesoNetoEstimado: string;
    estado : string;
    tbQoTipoOro :  TbQoTipoOro;
    tbQoCotizador : TbQoCotizador;
    
    constructor(){
        this.tbQoTipoOro = new TbQoTipoOro();
        this.tbQoCotizador = new TbQoCotizador();
    }
}