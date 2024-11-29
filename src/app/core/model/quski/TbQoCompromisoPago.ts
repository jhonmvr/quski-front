import { TbQoNegociacion } from "./TbQoNegociacion"

export class TbQoCompromisoPago {

	id: number 
	codigo: string 
	codigoOperacion: string 
	idNegociacion: TbQoNegociacion 
	tipoCompromiso: string 
	estadoCompromiso: string 
	fechaCompromisoPago: Date 
	usuarioSolicitud: string 
	usuarioAprobador: string 
	observacionSolicitud: string 
	observacionAprobador: string 
	fechaSolicitud: Date 
	fechaAprobador: Date 
	numeroOperacion: string 
	nombreCliente: string 
	fechaCompromisoPagoAnterior: Date 
	correoSolicitud: string 

    constructor() {

    }

}


