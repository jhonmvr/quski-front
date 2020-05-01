//import { TbMiTipoOro } from "./TbQoTipoOro";
import { TbMiTipoJoya } from "./TbMiTipoJoya";
import { TbMiCotizacion } from "./TbMiCotizacion";

export  class TbMiJoyaSim {
    id: number;
    tbMiTipoJoya: any;
    condicion: string;
    descripcion: string;
  //  tbMiTipoOro : any;
    pesoBruto: number;
    pesoNeto: number;
    descuento: number;
    precioCd: number;
    precioCp: number;
    precioCompraCD: number;
    precioCompraCP: number;
    estado : string;
    //idCotizacion
    
    tbMiCotizacion :  TbMiCotizacion;

    constructor(){
       // this.tbMiTipoOro = new TbMiTipoOro();
        this.tbMiTipoJoya = new TbMiTipoJoya();
        this.tbMiCotizacion = new TbMiCotizacion();
    }


    
}

