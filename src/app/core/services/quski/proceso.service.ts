import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoProceso } from '../../model/quski/TbQoProceso';
import { WrapperBusqueda } from '../../model/wrapper/WrapperBusqueda';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService extends BaseService {

  urlRest = "procesoRestController/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }
  /**
   * @author Jeroham Cadenas
   * @param id number
   */
  public getEntity(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Jeroham Cadenas
   */
  public getActividades() {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getActividades';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Jeroham Cadenas
   */
  public getEstadosProceso() {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getEstadosProceso';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Jeroham Cadenas
   */
  public getProcesos() {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getProcesos';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Jeroham Cadenas
   * @param entidad TbQoProceso
   */
  public persistEntity(entidad : TbQoProceso) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"persistEntity";
    let wrapper = { entidad: entidad }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas
   * @param entidad TbQoProceso
   */
  public buscarOperaciones(w: WrapperBusqueda) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"buscarOperaciones";
    let wrapper =  w ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 


}