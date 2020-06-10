import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
// import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';

@Injectable({
  providedIn: 'root'
})
export class ParroquiaService extends BaseService {

  /**
   * Metodo Por completar
   * @param p 
   */
  findAllEntities(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'parroquiaRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  

}
