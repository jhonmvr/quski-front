import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';



import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TbQoExcepcionOperativa } from '../../model/quski/TbQoExcepcionOperativa';
import { TbQoRegularizacionDocumento } from '../../model/quski/TbQoRegularizacionDocumento';
@Injectable({
  providedIn: 'root'
})
export class RegularizacionDocumentosService extends BaseService {
  private rest = "regularizacionDocumentosRestController/"
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  findAllByParams(page: Page,  usuario?: string, estado?: string, codigo?: string, codigoOperacion?: string, idNegociacion?: string) {
    let serviceUrl = this.appResourcesUrl + "regularizacionDocumentosRestController/listAllByParams";
    let params = new HttpParams()
      .set('page', page.currentPage.toString())
      .set('pageSize', page.pageSize.toString())
      .set('sortFields', page.sortFields)
      .set('sortDirections', page.sortDirections)
      .set('isPaginated', page.isPaginated);

    if (usuario) params = params.set('usuario', usuario);
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
    const usuario = localStorage.getItem("reUser")
    let serviceUrl = this.appResourcesUrl + "regularizacionDocumentosRestController/findAllByParamsWithClient";
    let params = new HttpParams()
    if (usuario) params = params.set('usuario', usuario);
    if (cedula) params = params.set('cedula', cedula);
   
    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  traerCreditoNegociacionByRegularizacion(idRegularizacion: any) {
    let serviceUrl = this.appResourcesUrl + "regularizacionDocumentosRestController/traerCreditoNegociacionByRegularizacion";
    let params = new HttpParams()
    .set('idRegularizacion',idRegularizacion);
    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  
  solicitarAprobacion(regularizacion: TbQoRegularizacionDocumento) {
    
    let serviceUrl = this.appResourcesUrl + "regularizacionDocumentosRestController/solicitarAprobacion";
    let params = new HttpParams();
    this.options = { headers: this.headers, params: params };
    return this.http.post(serviceUrl,regularizacion, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  
  enviarRespuesta(regularizacion: TbQoRegularizacionDocumento) {
    let serviceUrl = this.appResourcesUrl + "regularizacionDocumentosRestController/enviarRespuesta";
    let params = new HttpParams();
    this.options = { headers: this.headers, params: params };
    return this.http.post(serviceUrl,regularizacion, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}
