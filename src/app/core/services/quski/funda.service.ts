
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
// import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundaService extends BaseService {

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }

  public BusquedaParams(p: Page, codigo, peso, estado) {
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
   this.params = this.params.set('codigo', codigo);
   this.params = this.params.set('peso', peso);
   this.params = this.params.set('estado', estado);
    const serviceUrl = this.appResourcesUrl + 'fundaRestController/findByParams';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public reservarFunda(peso) {
    this.params = new HttpParams()
    this.params = this.params.set('peso', peso);
    const serviceUrl = this.appResourcesUrl + 'fundaRestController/reservarFunda';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}
