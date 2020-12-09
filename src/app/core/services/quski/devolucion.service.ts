import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TbQoDevolucion } from '../../model/quski/TbQoDevolucion';
import { BaseService } from '../base.service';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
import { BusquedaDevolucionWrapper } from '../../model/quski/BusquedaDevolucionWrapper';
import { RegistroFechaArribo } from '../../model/wrapper/registroFechaArribo';
import { Page } from '../../model/page';
@Injectable({
  providedIn: 'root'
})
export class DevolucionService extends BaseService {

  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }

  public persistDevolucion(devolucion: TbQoDevolucion) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/persistEntity";
    const wrapper = { entidad: devolucion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public registrarDevolucion(devolucion: TbQoDevolucion, usuario) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarSolicitudDevolucion";
   
    this.params = this.params.set('usuario', usuario);
    const wrapper = { entidad: devolucion };
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public getDevolucion (id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/getEntity";
    this.params = this.params.set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );

  }


  public aprobarDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null,  this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }


  public rechazarDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/rechazarSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null,  this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public busquedaSeleccionarFechas(page:Page, codigoOperacion, agencia, fechaAprobacionDesde,fechaAprobacionHasta, 
    identificacion){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/buscarDevolucion";  
    this.params = new HttpParams()
    .set('page', (page.pageNumber == null ? "" : page.pageNumber.toString()))
    .set('pageSize', (page.pageSize == null ? "" : page.pageSize.toString()))
    .set('sortFields', (page.sortFields == null ? "" : page.sortFields))
    .set('sortDirections', (page.sortDirections == null ? "" : page.sortDirections))
    .set('isPaginated', (page.isPaginated == null ? "" : page.isPaginated))
    .set('codigoOperacion', codigoOperacion == null ? "" : codigoOperacion)
    .set('agencia', agencia == null ? "" : agencia)
    .set('fechaAprobacionDesde', fechaAprobacionDesde == null ? "" : fechaAprobacionDesde)
    .set('fechaAprobacionHasta', fechaAprobacionHasta == null ? "" : fechaAprobacionHasta)
    .set('identificacion', identificacion == null ? "" : identificacion);

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public busquedaArribo(page:Page, codigoOperacion){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/buscarDevolucionPendienteArribo";  
    this.params = new HttpParams()
    .set('page', (page.pageNumber == null ? "" : page.pageNumber.toString()))
    .set('pageSize', (page.pageSize == null ? "" : page.pageSize.toString()))
    .set('sortFields', (page.sortFields == null ? "" : page.sortFields))
    .set('sortDirections', (page.sortDirections == null ? "" : page.sortDirections))
    .set('isPaginated', (page.isPaginated == null ? "" : page.isPaginated))
    .set('codigoOperacion', codigoOperacion == null ? "" : codigoOperacion);

    if (localStorage.getItem('agencia')) {
      this.params = this.params.set('agencia', localStorage.getItem('agencia'));
    }

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }



  public registrarFechaArribo(objeto: RegistroFechaArribo)
  {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarFechaArribo";  

      

    this.options = { headers: this.headers,  params: this.params };
    return this.http.post(serviceUrl, objeto ,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );

  }
  public registrarArribo(idDevoluciones: Array<number>)
  {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarArribo";  

      

    this.options = { headers: this.headers,  params: this.params };
    return this.http.post(serviceUrl, idDevoluciones ,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );

  }

  public cancelacionSolicitud(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/cancelarSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  
  public aprobacionCancelacionSolicitud(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarCancelacionSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  
  public rechazarCancelacionSolicitud(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/rechazarCancelacionSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null , this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }


  validarAprobarCancelacionSolicitud(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion);
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateAprobarCancelarSolicitud";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }


  validarCancelacionSolicitud(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion);
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateCancelarSolicitud";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }


  public guardarEntregaRecepcion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/guardarEntregaRecepcion";
    this.params = this.params.set('idDevolucion', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public aprobarVerificacionFirmas(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarVerificacionFirmas";
    this.params = this.params.set('idDevolucion', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
}
