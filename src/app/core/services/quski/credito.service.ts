import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../../core/model/page';
import { DatePipe } from '@angular/common';
import { TbQoCreditoNegociacion } from '../../model/quski/TbQoCreditoNegociacion';



import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class CreditoService extends BaseService {
  private rest = "detalleCreditoRestController/"
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  obtenerCreditoByValor(valor: string) {
    let serviceUrl = this.appResourcesUrl + "detalleCreditoWraperRestController/obtenerSimuladorDetalleCredito";
    this.params = this.params.set('valor', valor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  guardarDetalleCredito(tbQoDetalleCredito) {
    let serviceUrl = this.appResourcesUrl + "detalleCreditoRestController/persistEntity";
    let wrapper = { entidad: tbQoDetalleCredito }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  buscarCreditoByParams(page: Page, fechaDesde: any, fechaHasta: any,
    identificacion: any, idAgencia: any) {
    let serviceUrl = this.appResourcesUrl + "creditoNegociacionRestController/creditoNegociacionByParams";
    this.setSearchParams(page);
    this.params = this.params.set('fechaDesde', fechaDesde);
    this.params = this.params.set('fechaHasta', fechaHasta);
    this.params = this.params.set('identificacion', identificacion);
    this.params = this.params.set('idAgencia', idAgencia);
    this.options = { headers: this.headers, params: this.params };

    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  buscarOperacionesPendientes(page: Page,
    agencia: any, cedula: any) {
    let serviceUrl = this.appResourcesUrl + "creditoNegociacionRestController/getOperacionesDevueltas";
    this.setSearchParams(page);
    this.params = this.params.set('agencia', agencia);
    this.params = this.params.set('cedula', cedula);
    this.options = { headers: this.headers, params: this.params };

    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  persistEntity( entidad: TbQoCreditoNegociacion ) {
    let serviceUrl = this.appResourcesUrl + this.rest +"persistEntity";
    let wrapper = { entidad: entidad }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }




}