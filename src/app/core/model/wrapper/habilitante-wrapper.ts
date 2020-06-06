import { TbQoRolTipoDocumento } from '../quski/TbQoRolTipoDocumento';

export class HabilitanteWrapper{
    idTipoDocumento:number;
    idDocumentoHabilitante:number;
	idReferencia:number;
	descripcionTipoDocumento:string;
	estadoOperacion:string;
	proceso:string;
	pantilla:string;
	estaCargado:boolean;
	objectId:string;
	mimeType:string;
	roles:Array<TbQoRolTipoDocumento>;
}
