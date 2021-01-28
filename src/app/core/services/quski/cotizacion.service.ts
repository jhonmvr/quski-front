import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { ReNoticeService } from '../../services/re-notice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../../core/model/page';
import { DatePipe } from '@angular/common';
import { TbQoCotizador } from '../../model/quski/TbQoCotizador';



import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
@Injectable({
  providedIn: "root"
})
export class CotizacionService extends BaseService {

  urlRest = "cotizadorRestController/";
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @param id number
   */
  getEntity(id: number) {
    let serviceUrl = this.appResourcesUrl + this.urlRest+ 'getEntity';
    this.params = this.params.set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  persistEntity( data: TbQoCotizador ) {
    let serviceUrl = this.appResourcesUrl+ "cotizadorRestController/persistEntity";
    let wrapper = { entidad: data }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  guardaCotizacion(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl
      + "cotizadorRestController/persistEntity";
    let wrapper = { entidad: tbCotizacion }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  caducarCotizacion(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl
      + "cotizadorRestController/caducarCotizacion";
    let wrapper = { entidad: tbCotizacion }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * Método que devuelve la lista de cotizaciones 
   * @param cedulaCliente Envia la cedula del cliente
   */
  getCotizacionByCedula(cedulaCliente: string) {
    let serviceUrl = this.appResourcesUrl + 'cotizadorRestController/getCotizacionWrapper';
    this.params = this.params.set('cedulaCliente', cedulaCliente);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  findByIdCliente(cedulaCliente: string) {
    let serviceUrl = this.appResourcesUrl + "cotizadorRestController/cotizadorByCliente";
    this.params = this.params.set('cedulaCliente', cedulaCliente);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public findByEstado(estado: string, page: Page) {
    let serviceUrl = this.appResourcesUrl
      + this.urlRest + "getEntityByEstado";
    if (estado == null) {
      estado = "ACT";
    }
    this.setSearchParams(page);
    this.params = this.params.set('estado', estado);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );

  }
  guardarCotizacion(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl
      + "cotizadorRestController/persistEntity";
    let wrapper = { entidad: tbCotizacion }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * Metodo qu registraa la info,acion de cliente, cotizacion y variable crediticia,
   * adicional cadcua cotizaciones
   */
  crearCotizacionClienteVariableCrediticia(cotizador: TbQoCotizador) {
    let serviceUrl = this.appResourcesUrl + "cotizadorRestController/crearCotizacionClienteVariableCrediticia";
    let wrapper = { entidad: cotizador }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  crearVariableCrediticia(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl
      + "variableCrediticiaRestController/crearVariableCrediticia";
    let wrapper = { entidad: tbCotizacion }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  guardarJoyaSim(tbMijoyaSim) {
    let serviceUrl = this.appResourcesUrl
      + "joyaSimRestController/persistEntity";
    let wrapper = { entidad: tbMijoyaSim }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}