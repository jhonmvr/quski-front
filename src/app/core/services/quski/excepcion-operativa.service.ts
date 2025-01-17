import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { environment } from '../../../../../src/environments/environment';

//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';



import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TbQoExcepcionOperativa } from '../../model/quski/TbQoExcepcionOperativa';
@Injectable({
  providedIn: 'root'
})
export class ExcepcionOperativaService extends BaseService {
  private rest = "excepcionOperativaRestController/"
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  findAllByParams(page: Page, estado?: string, codigo?: string, codigoOperacion?: string, idNegociacion?: string) {
    const usuario = localStorage.getItem("reUser")
    const rol = localStorage.getItem( 're1001' );
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/listAllByParams";
    let params = new HttpParams()
      .set('page', page.currentPage.toString())
      .set('pageSize', page.pageSize.toString())
      .set('sortFields', page.sortFields)
      .set('sortDirections', page.sortDirections)
      .set('isPaginated', page.isPaginated);

    //if (rol) params = params.set('rol', usuario);
    //if (usuario) params = params.set('usuario', usuario);
    if (estado) params = params.set('estado', estado);
    if (codigo) params = params.set('codigo', codigo);
    if (codigoOperacion) params = params.set('codigoOperacion', codigoOperacion);
    if (idNegociacion) params = params.set('idNegociacion', idNegociacion);

    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  findAllByParamsWithClient(cedula?: string) {
    const rol = localStorage.getItem( 're1001' );
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/findAllByParamsWithClient";
    let params = new HttpParams()
    if (rol) params = params.set('usuario', rol);
    if (cedula) params = params.set('cedula', cedula);
   
    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  
  solicitarExcepcionServiciosNuevo(opcion: any, excepcionServicios: any) {
    const wp = {
      opcionCredito : opcion, ex : excepcionServicios
    }
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/solicitarExcepcionServicios";
    this.params = new HttpParams().set('asesor',atob(localStorage.getItem(environment.userKey)));
    this.params = this.params.set('nombreAsesor',localStorage.getItem('nombre')).set("correoAsesor",localStorage.getItem("email"));

    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wp,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  excepcionServiciosFlujoVariable(excepcionServicios: any, proceso: string) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/excepcionServiciosFlujoVariable";
    let params = new HttpParams().set('proceso',proceso);
    this.options = { headers: this.headers, params: params };
    return this.http.post(serviceUrl, excepcionServicios,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  findByNegociacionAndTipo(idNegociacion: number, tipoExcepcion: string, estado:string) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/findByNegociacionAndTipo";
    let params = new HttpParams()
    .set('estado',estado)
    .set('idNegociacion',idNegociacion.toString())
    .set('tipoExcepcion',tipoExcepcion);
    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  findByNegociacion(idNegociacion: number) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/findByNegociacion";
    let params = new HttpParams()
    .set('idNegociacion',idNegociacion.toString())
    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  
  traerCreditoNegociacionByExcepcionOperativa(idExcepcionOperativa: any) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/traerCreditoNegociacionByExcepcionOperativa";
    let params = new HttpParams()
    .set('idExcepcionOperativa',idExcepcionOperativa);
    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  
  resolverExcepcion(excepcion: TbQoExcepcionOperativa, proceso: string, nombreAsesor: string) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/resolverExcepcion";
    let params = new HttpParams()
      .set('proceso',proceso).set('nombreAsesor',nombreAsesor);
    this.options = { headers: this.headers, params: params };
    return this.http.post(serviceUrl, excepcion,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  cancelarExcepcion(excepcion: TbQoExcepcionOperativa, proceso: string, nombreAsesor: string) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/cancelarExcepcion";
    let params = new HttpParams()
      .set('proceso',proceso).set('nombreAsesor',nombreAsesor);
    this.options = { headers: this.headers, params: params };
    return this.http.post(serviceUrl, excepcion,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  solicitarExcepcionFabrica(excepcionServicios: any, proceso: string) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/solicitarExcepcionFabrica";
    let params = new HttpParams()
      .set('proceso',proceso);
    this.options = { headers: this.headers, params: params };
    return this.http.post(serviceUrl, excepcionServicios,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  
  traerCreditoNegociacionExistenteByExcepcionOperativa(idExcepcionOperativa: any) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/traerCreditoNegociacionExistenteByExcepcionOperativa";
    let params = new HttpParams()
    .set('idExcepcionOperativa',idExcepcionOperativa);
    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}
