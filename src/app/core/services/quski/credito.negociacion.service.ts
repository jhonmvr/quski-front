import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditoNegociacionService extends BaseService {

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }


  public getCreditoNegociacionById(id) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + '/quski-oro-rest/resources/creditoNegociacionRestController/getEntity';
    this.params = new HttpParams().set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}
