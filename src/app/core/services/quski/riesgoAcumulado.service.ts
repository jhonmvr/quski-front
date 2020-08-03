import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoRiesgoAcumulado } from '../../model/quski/TbQoRiesgoAcumulado';



@Injectable({
  providedIn: 'root'
})
export class RiesgoAcumuladoService extends BaseService {

  urlRest = "riesgoAcumuladoRestController/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }
  /**
   * @author Jeroham Cadenas.
   * @param  idCliente : string
   * @description Buscar riesgo acumulado en funcion del id de cliente.
   */
  public findRiesgoAcumuladoByIdCliente( idCliente : string ) {
    let serviceUrl = this.appResourcesUrl + this.urlRest + "findRiesgoAcumuladoByIdCliente";
    this.params = this.params.set('idCliente', idCliente); 
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  persistEntity( data : Array<TbQoRiesgoAcumulado> ) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"persistEntity";
    let wrapper = { entidades: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  // NO IMPLEMENTADO NO USAR 
  // By: Jeroham Cadenas
  public riesgoAcumulado() {
    let serviceUrl = this.appResourcesUrl + "riesgoAcumuladoRestController/listAllEntities";
    this.options = { Headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }









   

}