import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { ReNoticeService } from '../re-notice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { DatePipe } from '@angular/common';
import { TbQoPrecioOro } from '../../model/quski/TbQoPrecioOro';


@Injectable({
  providedIn: "root"
})
export class PrecioOroService extends BaseService {

  urlRest = "precioOroRestController/";
  constructor(_http: HttpClient, private ns: ReNoticeService) {
    super();
    this.http = _http;
    this.setParameter();

  }
  public editarPrecioOro(tbQoPrecioOro) {
    let serviceUrl = this.appResourcesUrl+ this.urlRest +"persistEntity";
    let wrapper = { entidad: tbQoPrecioOro };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  public seleccionarPrecioOro(idPrecioOro) {
    let serviceUrl = this.appResourcesUrl+ this.urlRest +"getEntity";
    this.params= new HttpParams();
    this.params=this.params.set("id", idPrecioOro);
    this.options = { headers: this.headers, params: this.params};
    return this.http.get(serviceUrl, this.options);
  }

  public loadPrecioOroByCotizacion(idCotizacion){
    let serviceUrl = this.appResourcesUrl+ this.urlRest +"detalleCotizacionById";
    this.params= new HttpParams();
    this.params=this.params.set("id", idCotizacion);
    this.options = { headers: this.headers, params: this.params};
    return this.http.get(serviceUrl, this.options);        
  }


  public eliminarPrecioOro(idPrecioOro) {
    let serviceUrl = this.appResourcesUrl+ this.urlRest +"removeEntity";
    this.params= new HttpParams();
    this.params=this.params.set("id", idPrecioOro);
    this.options = { headers: this.headers, params: this.params};
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @param p Page
   * @param cedula string
   */
  public findByCedula(p: Page, cedula: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'findByCedula';
    this.setSearchParams(p);
    this.params = this.params.append('cedula', cedula);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  guardarPrecioOro(data: TbQoPrecioOro) {
    let serviceUrl = this.appResourcesUrl+ this.urlRest +"crearPrecioOro";
    let wrapper = { entidad: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  public persistEntity(data: TbQoPrecioOro) {
    let serviceUrl = this.appResourcesUrl+ this.urlRest +"persistEntity";
    let wrapper = { entidad: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

}