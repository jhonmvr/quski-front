import { TbMiAgencia } from './TbMiAgencia';
import { TbQoTipoOro } from './TbQoTipoOro';
import { TbMiVentaLote } from './TbMiVentaLote';
import { TbMiJoyaLote } from './TbMiJoyaLote';
export class TbMiLote {

  id: number;
  costoPorGramo:number;
  descuentoCompra:number;
  descuentoRetazado:number;
  estado: string;
  fechaActualizacion: Date;
  fechaCierre: Date;
  fechaCreacion: Date;
  identificador: string;
  ley:number;
  nombreLote: string;
  pesoBrutoCompra:number;
  pesoBrutoRetazado:number;
  pesoNetoCompra:number;
  pesoNetoRetazado: number;
  pesoNetoVendido:number;
  precioCompra:number;
  precioVenta:number;
  responsable:string;
  tipoLote:string;
  totalGramos:number;
  usuarioActualizacion: string;
  usuarioCreacion: string;
  utilidad:number;
  porcentajeIva:number;
  iva:number;
  valorPagar:number;

  tbMiAgencia : TbMiAgencia;
  tbMiTipoOro :TbQoTipoOro;
  tbMiVentaLote: TbMiVentaLote;
  tbMiJoyaLotes: TbMiJoyaLote[];

  constructor(){
    this.tbMiAgencia = null;
    this.tbMiTipoOro = null;
    this.tbMiVentaLote = null;
    this.tbMiJoyaLotes = null;
  }
}
