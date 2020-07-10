import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../../core/model/page';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CreditoService extends BaseService {
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }
  obtenerCreditoByValor(valor: string) {
    let serviceUrl = this.appResourcesUrl + "detalleCreditoWraperRestController/obtenerSimuladorDetalleCredito";
    this.params = this.params.set('valor', valor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  guardarDetalleCredito(tbQoDetalleCredito) {
    let serviceUrl = this.appResourcesUrl + "detalleCreditoRestController/persistEntity";
    let wrapper = { entidad: tbQoDetalleCredito }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
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

    return this.http.get(serviceUrl, this.options);
  }

  buscarOperacionesPendientes(page: Page,
    agencia: any, cedula: any) {
    let serviceUrl = this.appResourcesUrl + "creditoNegociacionRestController/getOperacionesDevueltas";
    this.setSearchParams(page);
    this.params = this.params.set('agencia', agencia);
    this.params = this.params.set('cedula', cedula);
    this.options = { headers: this.headers, params: this.params };

    return this.http.get(serviceUrl, this.options);


  }




}