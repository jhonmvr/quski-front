import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
// import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoTracking } from '../../model/quski/TbQoTracking';
import { Page } from '../../model/page';

@Injectable({
  providedIn: 'root'
})
export class TrackingService extends BaseService {

  /**
   * Metodo Por completar
   * @param p 
   * @param proceso 
   */
  findTrackingByProceso(p: Page, proceso: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  findAllTracking(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  guardarTracking(track: TbQoTracking) {
    const serviceUrl =
      this.appResourcesUrl + 'trackingRestController/persistEntity';
    const wrapper = { entidad: track };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  

}
