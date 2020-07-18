import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IntegracionService extends BaseService {

  urlRest  = "integracionRestController/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }

    /**
   * @description Realiza la busqueda del cliente en la calculadora Quski Completa
   * @author Jeroham Cadenas
   * @date 18/07/2020
   * @param {string} tipoIdentificacion
   * @param {string} identificacion
   * @param tipoConsulta 
   * @param calificacion 
   */
  public getInformacionPersonaCalculadora(tipoIdentificacion: string, identificacion: string, tipoConsulta: string, calificacion: string ) {
    const serviceUrl =  this.appResourcesUrl + this.urlRest +'getInformacionPersona';
    this.params = new HttpParams().set('tipoIdentificacion', tipoIdentificacion)
      .set('identificacion', identificacion)
      .set('tipoConsulta', tipoConsulta)
      .set('calificacion', calificacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}