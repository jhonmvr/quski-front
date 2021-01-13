import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoCreditoNegociacion } from '../../model/quski/TbQoCreditoNegociacion';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class CreditoNegociacionService extends BaseService {

  urlRest = "creditoNegociacionRestController/";

  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }


  public getCreditoNegociacionById(id) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'creditoNegociacionRestController/getEntity';
    this.params = new HttpParams().set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public buscarRenovacionByNumeroOperacionMadre( numeroOperacion: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'creditoNegociacionRestController/buscarRenovacionByNumeroOperacionMadre';
    this.params = new HttpParams().set('numeroOperacion', numeroOperacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }   
  public buscarRenovacionByIdNegociacion( idNegociacion: number) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'creditoNegociacionRestController/buscarRenovacionByIdNegociacion';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }  
  public consultarTablaAmortizacion( numeroOperacion: string, agencia: number, usuario: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'creditoNegociacionRestController/consultarTablaAmortizacion';
    this.params = new HttpParams().set('numeroOperacion', numeroOperacion).set('usuario', usuario).set('agencia', agencia.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   * @param data EnviarOperacion (Interface)
   */
  public crearOperacionNuevo( data: TbQoCreditoNegociacion) {
    let serviceUrl = this.appResourcesUrl + this.urlRest + "crearOperacionNuevo" ;
    this.options = { headers: this.headers };
    let entidad = { entidad: data }
    return this.http.post(serviceUrl, entidad, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }  
  public crearOperacionRenovacion( data: TbQoCreditoNegociacion) {
    let serviceUrl = this.appResourcesUrl + this.urlRest + "crearOperacionRenovacion" ;
    this.options = { headers: this.headers };
    let entidad = { entidad: data }
    return this.http.post(serviceUrl, entidad, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public crearCreditoRenovacion( opcion, garantias, numeroOperacionMadre,asesor,  idNegociacion) {
    let serviceUrl = this.appResourcesUrl + this.urlRest + "crearCreditoRenovacion" ;
    this.params = new HttpParams().set('numeroOperacionMadre', numeroOperacionMadre).set('asesor', asesor)
    if(idNegociacion){
      this.params.set('idNegociacion', idNegociacion);
    }
    let wrapper = { opcion: opcion, garantias: garantias}
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public traerCreditoNegociacionExistente(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerCreditoNegociacionExistente';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public traerCreditonovacionPorAprobar(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerCreditonovacionPorAprobar';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public devolverAprobar(idCredito: number, cash: string, descripcion: string, codigo: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'devolverAprobar';
    this.params = new HttpParams().set('idCredito', idCredito.toString()).set('cash',cash).set('descripcion',descripcion).set('codigo',codigo);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public traerCreditoNegociacion(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerCreditoNegociacion';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public traerCreditoNuevo(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerCreditoNuevo';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public traerCreditoVigente(numeroOperacion: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerCreditoVigente';
    this.params = new HttpParams().set('numeroOperacion', numeroOperacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public numeroDeFunda(data) {
    let serviceUrl = this.appResourcesUrl + this.urlRest + "optenerNumeroDeFunda" ;
    this.options = { headers: this.headers };
    let entidad = { entidad: data }
    return this.http.post(serviceUrl, entidad, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

}
