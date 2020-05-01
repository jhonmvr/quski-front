import { Injectable } from '@angular/core';
import { Notificacion } from '../model/notificacion';
import { Observable, BehaviorSubject } from 'rxjs';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService extends BaseService {
  private mensajeObs$: BehaviorSubject<Notificacion> = new BehaviorSubject(null);

  private listaNotificacion:BehaviorSubject<Notificacion> =new BehaviorSubject(new Notificacion());
	private listaAudit:BehaviorSubject<Notificacion> =new BehaviorSubject(new Notificacion());

  constructor(_http:HttpClient) {
    super();
    this.http=_http;
  }

  getMensajeObs(): Observable<Notificacion> {
    return this.mensajeObs$.asObservable();
  }

  setMensajeObs(mensaje: Notificacion) {
      this.mensajeObs$.next(mensaje);
  }

  getListaNotificacion(): Observable<Notificacion> {
    return this.listaNotificacion.asObservable();
  }

  setListaNotificacion(mensaje: Notificacion) {
      this.listaNotificacion.next(mensaje);
  }

  getListaAudit(): Observable<Notificacion> {
    return this.listaAudit.asObservable();
  }

  setListaAudit(mensaje:Notificacion) {
      this.listaAudit.next(mensaje);
  }

  getAlertas(codigo:string){ 
    const headersLoc= new HttpHeaders({'Authorization':environment.authprefix+ localStorage.getItem(environment.authTokenKey), 
    'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set("databaseName",this.mongoDb ).set("collectionName",this.mongoAlertaColeccion);
    let optionsLoc = {
      headers: headersLoc,
      params:params
    };
    let criteria={
      "entidades": [
        {
          "etiqueta":"codigo",
          "cadena": codigo,
          "operador": "eq"
        }
      ]
    };
    return this.http.post( this.genericResourcesUrl+ "mongoRestController/findObjectsByParam",criteria,optionsLoc );
  }

  getAlertasIn(codigos:Array<string>){ 
    const headersLoc= new HttpHeaders({'Authorization':environment.authprefix+ localStorage.getItem(environment.authTokenKey), 
    'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set("databaseName",this.mongoDb ).set("collectionName",this.mongoAlertaColeccion);
    let optionsLoc = {
      headers: headersLoc,
      params:params
    };
    let criteria={
      "entidades": [
        {
          "etiqueta":"codigo",
          "cadenaLista": codigos,
          "operador": "in"
        }
      ]
    };
    return this.http.post( this.genericResourcesUrl+ "mongoRestController/findObjectsByParam",criteria,optionsLoc );
  }


}
