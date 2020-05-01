import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from "../../model/page";
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CatalogoService extends BaseService {

  urlRest = "catalogoRestController/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }
  guardarCatalogo(tbqoCatalogo) {
    let serviceUrl = this.appResourcesUrl + "catalogoRestController/persistEntity";
    let wrapper = { entidad: tbqoCatalogo }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  public findCatalogoByNombre(nombre: string) {
    const serviceUrl =
      this.appResourcesUrl + 'catalogoRestController/CatalogoByNombres';
    this.params = new HttpParams().set('nombre', nombre);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findCatalogoByTipo(tipo: string) {
    const serviceUrl =
      this.appResourcesUrl + 'catalogoRestController/CatalogoByTipo';
    this.params = new HttpParams().set('tipo', tipo);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findNegociacionById(id: string) {
    const serviceUrl =
      this.appResourcesUrl + 'negociacionRestController/getEntity';
    this.params = new HttpParams().set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}