import { TablaPresuntivaDatos } from './TablaPresuntivaDatos';

export class TablaAmortizacion  {
  codigoTipoPrestamo: string; // 001,
  codigoProducto: string; // 002,
  idCliente:  number; //0,
  montoSolicitado:  number; //000.0,
  tablaPresuntivaDatos: TablaPresuntivaDatos; //{"idTipoTablaAmortizacion": 7,"codigoFrecuenciaPago": "ME","cuotas": 12,"cuotasGracia": 0,"diaFijo": false,"pagoDia": 12},
  identificacion: string; // 1311066441,
  nombre: string; // Pablo Rafael Vélez Franco,
  direccion: string; // Av. Siempre Viva 742,
  telefono: string; // 0996553221,
  email: string; // pvelez@cloudstudio.com.ec,
  idResidencia: number; //1352,
  fechaNacimiento: string; // 1991-06-30,
  listaRubrosAdicionales: null;
  constructor(){
    this.tablaPresuntivaDatos = new TablaPresuntivaDatos();
  }
}