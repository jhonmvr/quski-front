import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
// import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TbQoTracking } from '../../model/quski/TbQoTracking';
import { Page } from '../../model/page';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TrakingWrapper } from '../../../views/pages/apps/tracking/list-tracking/list-tracking.component';
import { environment } from '../../../../environments/environment';
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
  busquedaTracking( page: Page, wppr: TrakingWrapper) {
    this.params = new HttpParams()
    .set('page', (page.pageNumber == null ? "" : page.pageNumber.toString()))
    .set('pageSize', (page.pageSize == null ? "" : page.pageSize.toString()))
    .set('sortFields', (page.sortFields == null ? "" : page.sortFields))
    .set('sortDirections', (page.sortDirections == null ? "" : page.sortDirections))
    .set('isPaginated', (page.isPaginated == null ? "" : page.isPaginated))
    if(wppr.proceso != null){
      this.params = this.params.set('proceso', wppr.proceso)
    }
    if(wppr.actividad != null){
      this.params = this.params.set('actividad', wppr.actividad)
    }
    if(wppr.seccion != null){
      this.params = this.params.set('seccion', wppr.seccion)
    }
    if(wppr.codigoBpm != null){
      this.params = this.params.set('codigoBpm', wppr.codigoBpm)
    }
    if(wppr.codigoOperacionSoftbank != null){
      this.params = this.params.set('codigoOperacionSoftbank', wppr.codigoOperacionSoftbank)
    }
    if(wppr.usuarioCreacion != null){
      this.params = this.params.set('usuarioCreacion', wppr.usuarioCreacion)
    }
    if(wppr.fechaDesde != null){
      this.params = this.params.set('fechaDesde', wppr.fechaDesde)
    }
    if(wppr.fechaHasta != null){
      this.params = this.params.set('fechaHasta', wppr.fechaHasta)
    }
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/busquedaTracking';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
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
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/registrar';
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, track, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public getTokenApi(){
    const headersLoc= new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded' });
    const params = new HttpParams()
    .set("grant_type", 'client_credentials' );
    let optionsLoc = {
      headers: headersLoc,
      params:params
    };
    let keyUnencrypt = atob( localStorage.getItem('localRE011'));
    //Url de acceso al rootcontext de seguridad core-security-web
    let token = atob(localStorage.getItem('localRE020') ).replace(keyUnencrypt, '');
    localStorage.setItem(environment.token_type,'basic');
    localStorage.setItem(environment.access_token,token);
    
    let wp = { }
    return this.http.post( atob(environment.api_t),wp, optionsLoc);
  }

  findTrakingByCodigoBpm(p: Page, codigoBpm) {
    const serviceUrl = this.appResourcesUrl + 'trackingRestController/findTrakingByCodigoBpm';
    this.setSearchParams(p);
    this.params = this.params.set('codigoBpm',codigoBpm);

    this.options = { headers: this.headers , params: this.params};
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => {  }
      )
    );
  }

 

}
