import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from "../../model/page";
import { DatePipe } from '@angular/common';
import { TbQoNegociacion } from '../../model/quski/TbQoNegociacion';


@Injectable({
  providedIn: 'root'
})
export class NegociacionService extends BaseService {


  urlRest = "negociacionRestController/";

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param idNegociacion number
   */
  public findNegociacionById(id: number ) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public iniciarNegociacion(cedula: string, asesor: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacion';
    this.params = new HttpParams().set('cedula', cedula).set('asesor',asesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public iniciarNegociacionEquifax(cedula: string, asesor: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacionEquifax';
    this.params = new HttpParams().set('cedula', cedula).set('asesor',asesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public iniciarNegociacionFromCot(idCotizacion: number, asesor: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacionFromCot';
    this.params = new HttpParams().set('idCotizacion', idCotizacion.toString()).set('asesor',asesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public traerNegociacionExistente(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerNegociacionExistente';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param idNegociacion number
   */
  findNegociacionByIdCliente(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'findByIdCliente';
    this.params = new HttpParams().set('id', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param entidad TbQoNegociacion
   */
  public persistEntity(entidad: TbQoNegociacion) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'persistEntity';
    const wrapper = { entidad: entidad };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
    /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param entidad TbQoNegociacion
   */
  public reasignar(id: number, codigoAsesor: string ) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'reasignarNegociacion';
    this.params = new HttpParams().set('id', id.toString()).set('usuario', codigoAsesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param id number
   */
  public cancelarNegociacion(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'cancelarNegociacion';
    const negociacion = new TbQoNegociacion();
    negociacion.id = id;
    const wrapper = { entidad: negociacion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param id number
   */
  public finalizarNegociacion(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'finalizarNegociacion';
    const negociacion = new TbQoNegociacion();
    negociacion.id = id;
    const wrapper = { entidad: negociacion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
}