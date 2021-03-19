import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
// import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoTracking } from '../../model/quski/TbQoTracking';
import { Page } from '../../model/page';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class TrackingService extends BaseService {

  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }
  
  /**
   * Metodo Por completar
   * @param p 
   * @param proceso 
   */

  findTracking(p: Page, proceso: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  busquedaTracking( p: Page, trackingWrapper: any) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/busqueda';
    let wrapper = trackingWrapper;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, trackingWrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  listProceso( p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/listProceso';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public getActividadesProcesosAndSecciones() {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/getActividadesProcesosAndSecciones';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => {  }
      )
    );
  }
  
  listActividad( proceso: string) {
    this.params= new HttpParams()
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/listActividad';
    if(proceso)
    this.params= this.params.set('proceso', proceso)
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  listSeccion( actividad: string) {
    this.params= new HttpParams()
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/listSeccion';
    if(actividad)
    this.params= this.params.set('actividad', actividad)
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  findAllTracking(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  guardarTracking(track: TbQoTracking) {
    const serviceUrl =
      this.appResourcesUrl + 'trackingRestController/persistEntity';
    const wrapper = { entidad: track };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

}
