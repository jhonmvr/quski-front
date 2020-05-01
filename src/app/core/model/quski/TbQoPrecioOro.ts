import { TbQoTipoOro } from "./TbQoTipoOro";
import { TbCotizacion } from "./TbCotizacion";

export class TbQoPrecioOro  {
    //tipoOro: string;
    precio: string;
    pesoNetoEstimado: string;
    estado : string;
    tbQoTipoOro :  TbQoTipoOro;
    tbQoCotizador : TbCotizacion;
    
    constructor(){
        this.tbQoTipoOro = new TbQoTipoOro();
     
        this.tbQoCotizador = new TbCotizacion();
    }
}