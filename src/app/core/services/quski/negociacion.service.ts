import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from "../../model/page";
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class NegociacionService extends BaseService {


  urlRest = "negociacionRestController/";

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }
  public findNegociacionById(id: number) {
    const serviceUrl =
      this.appResourcesUrl + this.urlRest + 'getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  findClienteById(id: number) {
    const serviceUrl =
      this.appResourcesUrl + 'clienteRestController/getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  findNegociacionByIdCliente(idNegociacion: number) {
    const serviceUrl =
      this.appResourcesUrl + 'negociacionRestController/findByIdCliente';
    this.params = new HttpParams().set('id', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}