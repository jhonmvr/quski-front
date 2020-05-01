import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { BaseService } from './base.service';
import { map, multicast, publish } from 'rxjs/operators';

export interface Message {
	mensaje: string;
	codigo: string;
	fecha: Date;
	idReferencia: number;
	hash: string;
	sessionIdSender:string;
	tipo:string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketUtilService extends  BaseService{


  public messages: ReplaySubject<Message>=new ReplaySubject<Message>();

	constructor(private wsService: WebsocketService) {
    
    super();
    
	}
	
	connect(_URL: string){
    	//console.log("=>WebsocketUtilService inicializar socket service service " + _URL);
		this.messages = <ReplaySubject<Message>>this.wsService.connect(_URL).pipe(
			map((response: MessageEvent): Message => {
			let data = JSON.parse(response.data);
			if( data ){
				//console.log("=>WebsocketUtilService retorno socket service service " + JSON.stringify(data));
				return {
					mensaje: data.mensaje,
					codigo: data.codigo,
					fecha: data.fecha,
					idReferencia: data.idReferencia,
					hash: data.hash,
					sessionIdSender:data.sessionIdSender,
					tipo:data.tipo
				}
			}
		}));
	}

	close(){
		this.messages.next(null);
	}
}
