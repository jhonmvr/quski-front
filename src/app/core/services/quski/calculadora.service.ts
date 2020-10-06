import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CalculadoraEntradaWrapper } from '../../model/wrapper/CalculadoraEntradaWrapper';
import { ConsultaPrecioJoya } from '../../model/wrapper/ConsultaPrecioJoya';


@Injectable({
  providedIn: 'root'
})
export class CalculadoraService extends BaseService {

  urlRest = "calculadoraRestController/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }
  public simularOferta(consulta: CalculadoraEntradaWrapper) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOferta';
    const wrapper = { entidad: consulta };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  public consultarExcepcionOferta(consulta: CalculadoraEntradaWrapper) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOferta';
    const wrapper = { entidad: consulta };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  public consultarPreciosJoya(consulta: ConsultaPrecioJoya) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOferta';
    const wrapper = { entidad: consulta };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
}