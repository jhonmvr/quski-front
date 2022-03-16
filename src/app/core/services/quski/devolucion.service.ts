import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TbQoDevolucion } from '../../model/quski/TbQoDevolucion';
import { BaseService } from '../base.service';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
import { Page } from '../../model/page';
import { RegistroFechaArribo } from '../../model/wrapper/RegistroFechaArribo';
import { environment } from '../../../../../src/environments/environment';
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
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public registrarSolicitudDevolucion(devolucion: TbQoDevolucion) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarSolicitudDevolucion";
    const wrapper = { entidad: devolucion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public buscarProcesoDevolucion(idDevolucion){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/buscarProcesoDevolucion";
    this.params = this.params.set('idDevolucion', idDevolucion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public buscarProcesoCancelacion(idProceso){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/buscarProcesoCancelacion";
    this.params = this.params.set('idProceso', idProceso);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public validarProcesoActivo(numeroOperacion){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validarProcesoActivo";
    this.params = this.params.set('numeroOperacion', numeroOperacion).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
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
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );

  }


  public aprobarNegarSolicitudDevolucion(idDevolucion, aprobado,motivo){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarNegarSolicitudDevolucion";
    this.params = this.params.set('idDevolucion', idDevolucion).set('motivo', motivo)
    .set('aprobado', aprobado).set('usuario', atob(localStorage.getItem(environment.userKey) ))
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public buscarDevolucion(page:Page, codigoOperacion, agencia, fechaAprobacionDesde,fechaAprobacionHasta, identificacion){
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
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public buscarDevolucionPendienteArribo(page:Page, codigoOperacion, agencia){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/buscarDevolucionPendienteArribo";  
    this.params = new HttpParams()
    .set('page', (page.pageNumber == null ? "" : page.pageNumber.toString()))
    .set('pageSize', (page.pageSize == null ? "" : page.pageSize.toString()))
    .set('sortFields', (page.sortFields == null ? "" : page.sortFields))
    .set('sortDirections', (page.sortDirections == null ? "" : page.sortDirections))
    .set('isPaginated', (page.isPaginated == null ? "" : page.isPaginated))
    .set('codigoOperacion', codigoOperacion == null ? "" : codigoOperacion)
    .set('agencia', agencia);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
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
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );

  }
  public registrarArribo(idDevoluciones: Array<number>){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarArribo";   
    this.params = new HttpParams();
    this.params = this.params.set('usuario', atob(localStorage.getItem(environment.userKey) ))
    this.options = { headers: this.headers,  params: this.params };
    return this.http.post(serviceUrl, idDevoluciones ,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public iniciarProcesoCancelacion(id, usuario, motivo){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/iniciarProcesoCancelacion";
    this.params = this.params.set('id', id).set('usuario', usuario).set('motivo', motivo);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  
  public aprobarCancelacionSolicitudDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarCancelacionSolicitudDevolucion";
    this.params = this.params.set('id', id).set('usuario', atob(localStorage.getItem(environment.userKey) ));  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public rechazarCancelacionSolicitudDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/rechazarCancelacionSolicitudDevolucion";
    this.params = this.params.set('id', id).set('usuario', atob(localStorage.getItem(environment.userKey) ));  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null , this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
//Validacion

existeCancelacionCancelacion(idDevolucion: any) {
  this.params = new HttpParams().set('idDevolucion', idDevolucion);
  let serviceUrl = this.appResourcesUrl + "devolucionRestController/existeProcesoCancelacionVigente";
  this.options = { headers: this.headers, params: this.params };
  return this.http.get(serviceUrl, this.options);
}

  validarAprobarCancelacionSolicitud(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateAprobarCancelarSolicitud";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }


  validarCancelacionSolicitud(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateCancelarSolicitud";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  validateSolicitarAprobacion(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateSolicitarAprobacion";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  validateAprobarRechazarSolicitud(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateAprobarRechazarSolicitud";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  validateEntregaRecepcion(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateEntregaRecepcion";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  validateVerificacionFirma(idDevolucion: any) {
    this.params = new HttpParams().set('idDevolucion', idDevolucion).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/validateVerificacionFirma";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  



/////////
  public guardarEntregaRecepcion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/guardarEntregaRecepcion";
    this.params = this.params.set('idDevolucion', id).set('usuario', atob(localStorage.getItem(environment.userKey) ));  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public aprobarVerificacionFirmas(id, motivo){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarVerificacionFirmas";
    this.params = this.params.set('idDevolucion', id).set('motivo', motivo).set('usuario', atob(localStorage.getItem(environment.userKey) ));  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  
  public rechazarVerificacionFirmas(id, motivo){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/rechazarVerificacionFirmas";
    this.params = this.params.set('idDevolucion', id).set('motivo', motivo).set('usuario', atob(localStorage.getItem(environment.userKey) ));  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, null, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  historicoEntregaByIdEntrega(idEntrega: any) {
    this.params = new HttpParams().set('idEntrega', idEntrega).set('usuario', atob(localStorage.getItem(environment.userKey) ));
    let serviceUrl = this.appResourcesUrl + "historicoObservacionEntregaRestController/byIdEntrega";
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  reporteDevolucion(p: Page, value: any) {
    this.setSearchParams(p);
  
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/reporteDevolucion";
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,value, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  procesoEntrega(p: Page, value: any) {
    this.setSearchParams(p);
  
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/procesoEntrega";
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,value, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  descargarReporteDevolucion( value: {}) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/descargarReporte";
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,value, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
 
}
