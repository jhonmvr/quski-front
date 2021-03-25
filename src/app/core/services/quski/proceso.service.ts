import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoProceso } from '../../model/quski/TbQoProceso';
import { WrapperBusqueda } from '../../model/wrapper/WrapperBusqueda';
import { BusquedaAprobadorWrapper } from '../../model/wrapper/BusquedaAprobadorWrapper';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService extends BaseService {

  urlRest = "procesoRestController/";
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  /**
   * @author Jeroham Cadenas
   * @param id number
   */
  public getEntity(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }  
  public traerNumeroOperacionMadre(codigoBpm) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'traerNumeroOperacionMadre';
    this.params = new HttpParams().set('codigoBpm', codigoBpm);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   */
  public getActividades() {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getActividades';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   */
  public getEstadosProceso() {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getEstadosProceso';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   */
  public getProcesos() {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'getProcesos';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   * @param id {tbQoNegociacion - tbQoClientePago - tbQoDevolucion - tbQoVerificacionTelefonica}
   * @param proceso 
   * @param nuevoAsesor 
   */
  public reasignarOperacion(id: number, proceso: string, nuevoAsesor: string ) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'reasignarOperacion';
    this.params = new HttpParams().set('id', id.toString()).set('proceso', proceso).set('usuario',nuevoAsesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public asignarAprobador(idReferencia: number, proceso: string, aprobador: string ) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'asignarAprobador';
    this.params = new HttpParams().set('idReferencia', idReferencia.toString()).set('proceso', proceso).set('aprobador',aprobador);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public asignarAprobadorExcepcion(idReferencia: number, aprobador: string ) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'asignarAprobadorExcepcion';
    this.params = new HttpParams().set('idReferencia', idReferencia.toString()).set('aprobador',aprobador);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  
  /**
   * @author Jeroham Cadenas
   */
  public cancelarNegociacion(idNegociacion: number, usuario: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'cancelarNegociacion';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString()).set('usuario', usuario);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
    /**
   * @author Jeroham Cadenas
   */
  public cambiarEstadoProceso(idReferencia: number, proceso: string, newEstado: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'cambiarEstadoProceso';
    this.params = new HttpParams().set('idReferencia', idReferencia.toString()).set('proceso', proceso).set('newEstado', newEstado);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
  * @author Jeroham Cadenas
  */
  public listAlertaDeProcesos() {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'listAlertaDeProcesos';
    this.params = new HttpParams();
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
  * @author Jeroham Cadenas
  */
  public listAlertaDeProcesosAprobador(aprobador: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'listAlertaDeProcesosAprobador';
    this.params = new HttpParams().set('aprobador', aprobador);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
    /**
   * @author Jeroham Cadenas
   */
  public findByIdReferencia(id: number, proceso: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'findByIdReferencia';
    this.params = new HttpParams().set('id', id.toString()).set('proceso', proceso);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   * @param entidad TbQoProceso
   */
  public persistEntity(entidad : TbQoProceso) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"persistEntity";
    let wrapper = { entidad: entidad }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas
   * @param   WrapperBusqueda
   */
  public buscarOperaciones(w: WrapperBusqueda) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"buscarOperaciones";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,w,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
    /**
   * @author Jeroham Cadenas
   * @param  BusquedaAprobadorWrapper
   */
  public buscarOperacionesAprobador(w: BusquedaAprobadorWrapper) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"buscarOperacionesAprobador";
    let wrapper =  w ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 


}