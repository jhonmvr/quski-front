import { TbQoRegistrarPago } from './TbQoRegistrarPago';

export class TbQoClientePago{
	id : number;
	
    nombreCliente : String;
	cedula : String;
	codigoOperacion : String;
	codigoCuentaMupi : any;
	tipoCredito : String;
	valorPrecancelado : number;
	valorDepositado : number;
	tipoPagoProceso: String;
	observacion : String;
	estado: String;
	tipo: String;
	codigo;
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