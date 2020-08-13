import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoRiesgoAcumulado } from '../../model/quski/TbQoRiesgoAcumulado';
import { Page } from '../../model/page';



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
  public findRiesgoAcumuladoByIdCliente( p: Page, idCliente : number ) {
    let serviceUrl = this.appResourcesUrl + this.urlRest + "findRiesgoAcumuladoByIdCliente";
    this.params = new HttpParams()
    .set('page', p.pageNumber.toString())
    .set('pageSize', p.pageSize.toString());
    
    if (p.sortFields && p.sortFields !== '') {
      this.params = this.params.set('sortFields', p.sortFields);
    }
    if (p.sortDirections && p.sortDirections !== '') {
      this.params = this.params.set('sortDirections', p.sortDirections);
    }
    if (p.isPaginated && p.isPaginated !== '') {
      this.params = this.params.set('isPaginated', p.isPaginated);
    }
    this.params = this.params.set('idCliente', idCliente.toString()); 
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
    /**
   * @author Jeroham Cadenas.
   * @param  idCliente : string
   * @description Buscar riesgo acumulado en funcion del id de cliente.
   */
  persistEntities( data : Array<TbQoRiesgoAcumulado> ) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"persistEntities";
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