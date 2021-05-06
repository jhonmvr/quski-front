import { TbQoClientePago } from './TbQoClientePago';
import { TbQoCreditoNegociacion } from './TbQoCreditoNegociacion';

export class TbQoRegistrarPago {

    id: number; 
	TbQoClientePago: TbQoClientePago; 
	institucionFinanciera: any; 
	cuentas: String; 
	fechaPago: String; 
	numeroDeposito: String; 
	valorPagado: String;
	idComprobante: String;
	archivo: String;
	nombreArchivo: String;
	tbQoCreditoNegociacion: TbQoCreditoNegociacion;
	
	constructor(){
		this.TbQoClientePago = new TbQoClientePago();
	} 
}