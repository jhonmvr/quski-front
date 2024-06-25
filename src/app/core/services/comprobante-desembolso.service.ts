import { Injectable } from '@angular/core';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../model/page';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { BaseService } from './base.service';
import { ComprobanteDto } from '../../views/partials/custom/comprobante-desembolso/comprobante-desembolso.component';
@Injectable({
  providedIn: 'root'
})
export class ComprobanteDesembolsoService extends BaseService {
  private rest = "comprobanteRestController/"
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  
  listAllByIdNegociacion(idNegociacion?: number) {
    let serviceUrl = this.appResourcesUrl + "comprobanteRestController/listAllByIdNegociacion";
    let params = new HttpParams()

    if (idNegociacion) params = params.set('idNegociacion', idNegociacion.toString());

    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  agregarComprobante(comprobante: ComprobanteDto) {
    let serviceUrl = this.appResourcesUrl + "comprobanteRestController/agregarComprobante";
    let params = new HttpParams()
 

    this.options = { headers: this.headers, params: params };
    return this.http.post(serviceUrl,comprobante, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  eliminarComprobante(id?: number) {
    let serviceUrl = this.appResourcesUrl + "comprobanteRestController/eliminarComprobante";
    let params = new HttpParams()

    if (id) params = params.set('id', id.toString());

    this.options = { headers: this.headers, params: params };
    return this.http.delete(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}