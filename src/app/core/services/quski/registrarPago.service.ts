import { BaseService } from '../base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoRegistrarPago } from '../../model/quski/TbQoRegistrarPago';
import { Page } from '../../model/page';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
    providedIn: 'root'
  })
  export class RegistrarPagoService extends BaseService {
    constructor(_http: HttpClient,
    private dialog: MatDialog) {
        super();
        this.http = _http;
        this.setParameter();
  }
  public persistEntity(registrarPago: TbQoRegistrarPago) {
    const serviceUrl =
      this.appResourcesUrl + 'registrarPagoRestController/persistEntity';
    const wrapper = { entidad: registrarPago };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public crearRegistrarComprobanteRenovacion(registro) {
    const serviceUrl = this.appResourcesUrl + 'registrarPagoRestController/crearRegistrarComprobanteRenovacion';
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, registro, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public iniciarProcesoRegistrarPago(registro) {
    const serviceUrl = this.appResourcesUrl + 'registrarPagoRestController/iniciarProcesoRegistrarPago';
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, registro, this.options).pipe(
      tap( 
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  findAllRegistrarPago(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'registrarPagoRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public clientePagoByIdCliente(idPago: string) {
    const serviceUrl = this.appResourcesUrl + 'registrarPagoRestController/findByIdClientePago';
    this.params = new HttpParams().set('id', idPago);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public iniciarProcesoRegistrarBloqueo(registrarBloqueoWrapper) {
    this.options = { headers: this.headers, params: this.params };
    const serviceUrl =
      this.appResourcesUrl + 'registrarPagoRestController/iniciarProcesoRegistrarBloqueo';
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, registrarBloqueoWrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public aprobarPago(id: string, estado : string, tipo : string, nombre) {
    this.options = { headers: this.headers, params: this.params };
    const serviceUrl =
      this.appResourcesUrl + 'registrarPagoRestController/aprobar';
      this.params = new HttpParams().set('id', id ).set('estado', estado).set('tipo', tipo).set('nombre',nombre);
      //this.params= new HttpParams().set('estado', estado);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public enviarRespuesta( id, isRegistro, isAprobar, nombreAprobador, correoAprobador) {
    this.options = { headers: this.headers, params: this.params };
    const serviceUrl =  this.appResourcesUrl + 'registrarPagoRestController/enviarRespuesta';
      this.params = new HttpParams().set('id', id ).set('isRegistro', isRegistro ).set('isAprobar', isAprobar ).set('nombreAprobador', nombreAprobador ).set('correoAprobador', correoAprobador )
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public rechazarPago(id: string, estado : string, tipo : string, nombre) {
    this.options = { headers: this.headers, params: this.params };
    const serviceUrl =
      this.appResourcesUrl + 'registrarPagoRestController/rechazar';
      this.params = new HttpParams().set('id', id ).set('estado', estado).set('tipo', tipo).set('nombre',nombre);
      //this.params= new HttpParams().set('estado', estado);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  
}