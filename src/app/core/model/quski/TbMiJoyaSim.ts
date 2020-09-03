//import { TbMiTipoJoya } from "./TbMiTipoJoya";
import { TbQoCotizador } from './TbQoCotizador';

export class TbMiJoyaSim {
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
  estado: string;
  //idCotizacion

  tbQoCotizador: TbQoCotizador;

  constructor() {
    // this.tbMiTipoOro = new TbMiTipoOro();
    //this.tbMiTipoJoya = new TbMiTipoJoya();
    this.tbQoCotizador = new TbQoCotizador();
  }



}

