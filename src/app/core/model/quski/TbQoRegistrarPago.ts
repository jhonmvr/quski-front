import { TbQoClientePago } from './TbQoClientePago';

export class TbQoRegistrarPago {

    id: number; 
	TbQoClientePago: TbQoClientePago; 
	institucionFinanciera: String; 
	cuentas: String; 
	fechaPago: String; 
	numeroDeposito: String; 
	valorPagado: String;
	idComprobante: String;
	archivo: String;
	nombreArchivo: String;
	constructor(){
		this.TbQoClientePago = new TbQoClientePago();
	} 
}