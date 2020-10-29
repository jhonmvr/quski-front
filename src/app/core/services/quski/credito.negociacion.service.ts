import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditoNegociacionService extends BaseService {

  urlRest = "creditoNegociacionRestController/";

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }


  public getCreditoNegociacionById(id) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'creditoNegociacionRestController/getEntity';
    this.params = new HttpParams().set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Jeroham Cadenas
   * @param data EnviarOperacion (Interface)
   */
  public crearOperacionNuevo( data: any) {
    let serviceUrl = this.appResourcesUrl + this.urlRest + "crearOperacionNuevo" ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, data, this.options);
  }

  public traerCreditoNegociacionExistente(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerCreditoNegociacionExistente';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public traerCreditoNuevo(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerCreditoNuevo';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

}
