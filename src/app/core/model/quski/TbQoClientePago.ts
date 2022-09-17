import { TbQoRegistrarPago } from './TbQoRegistrarPago';

export class TbQoClientePago{
	id : number;
	
    nombreCliente : String;
	cedula : String;
	codigoOperacion : any;
	codigoCuentaMupi : any;
	tipoCredito : String;
	valorPrecancelado : number;
	valorDepositado : number;
	tipoPagoProceso: String;
	observacion : String;
	estado: String;
	tipo: String;
	codigo: any;
	aprobador;
	asesor;
	montoCredito;
	plazoCredito;
	numeroCuentaCliente;
	nombreAsesor;
	codigoOperacionMupi;
	observacionAprobador;
	
	constructor(){
		
	} 
}