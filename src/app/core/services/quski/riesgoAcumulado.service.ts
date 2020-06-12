import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';



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

  public riesgoAcumulado() {
    let serviceUrl = this.appResourcesUrl + "riesgoAcumuladoRestController/listAllEntities";
    this.options = { Headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }









   

}