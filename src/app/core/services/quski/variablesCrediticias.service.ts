import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class VariablesCrediticiasService extends BaseService {
  public urlRest  = "variablesCrediticiaRestController/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  /**
   * @author Jeroham Cadenas
   * @param  idNegociacion : string 
   * @description Buscar variables crediticias en funcion del id de negociacion.
   */
  variablesCrediticiaByIdNegociacion( idNegociacion : string ) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"variablesCrediticiaByIdNegociacion";
    this.params = this.params.set('idNegociacion', idNegociacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}