import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';

@Injectable({
  providedIn: 'root'
})
export class TasacionService extends BaseService {
  public rest = "tasacionRestController/";

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }


  public getTasacionByIdCredito(p: Page, id) {
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

   this.params = this.params.set('idCreditoNegociacion', id);
    
    const serviceUrl = this.appResourcesUrl + 'tasacionRestController/getByCreditoNegociacion';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * 
   * @author Jeroham Cadenas - developer Twelve
   * @param p Page
   * @param idNegociacion number
   */
  public findByIdNegociacion(p: Page, idNegociacion : number) {
    this.params = new HttpParams()
    if (p != null) {
      if (p.pageSize) {
        this.params = this.params.set('pageSize', p.pageSize.toString());
      }
      if (p.pageNumber) {
        this.params = this.params.set('page', p.pageNumber.toString());
      }
      if (p.sortFields && p.sortFields !== '') {
        this.params = this.params.set('sortFields', p.sortFields);
      }
      if (p.sortDirections && p.sortDirections !== '') {
        this.params = this.params.set('sortDirections', p.sortDirections);
      }
      if (p.isPaginated && p.isPaginated !== '') {
        this.params = this.params.set('isPaginated', p.isPaginated);
      }
    }
   this.params = this.params.set('idNegociacion', idNegociacion.toString());
    
    const serviceUrl = this.appResourcesUrl + this.rest + 'findByIdNegociacion';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}
