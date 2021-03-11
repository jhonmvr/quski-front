import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CalculadoraEntradaWrapper } from '../../model/wrapper/CalculadoraEntradaWrapper';
import { ConsultaPrecioJoya } from '../../model/wrapper/ConsultaPrecioJoya';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CalculadoraService extends BaseService {

  urlRest = "calculadoraRestController/";
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  public simularOfertaCotizacion(idCotizador) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOfertaCotizacion';
    this.params = new HttpParams();
    this.params = this.params.set('idCotizador',idCotizador);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }  
  public simularOferta(idCredito, montoSolicitado: number, riesgoTotal ) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOferta';
   this.params = new HttpParams();
   this.params = this.params.set('idCredito',idCredito);
   if(montoSolicitado != undefined){
    this.params = this.params.set('montoSolicitado',montoSolicitado.toFixed(2));
   }
   if(riesgoTotal != undefined){
    this.params = this.params.set('riesgoTotal',riesgoTotal.toFixed(2));
   }
   this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public simularOfertaRenovacionExcepcion(idCredito: number, cobertura) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOfertaRenovacionExcepcion';
    this.params = new HttpParams();
    this.params = this.params.set('idCredito',idCredito.toString()).set('cobertura',cobertura);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public simularOfertaExcepcionadaRenovacion(idCredito: number, cobertura) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOfertaExcepcionadaRenovacion';
    this.params = new HttpParams();
    this.params = this.params.set('idCredito',idCredito.toString()).set('cobertura',cobertura);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public simularOfertaRenovacion(riesgoTotal, coberturaExcepcionada, codigoAgencia, montoSolicitado, wrapper) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOfertaRenovacion';
    this.params = new HttpParams();
    this.params = this.params.set('riesgoTotal',riesgoTotal).set('coberturaExcepcionada',coberturaExcepcionada).set('codigoAgencia',codigoAgencia)
    if(montoSolicitado){
      this.params.set('montoSolicitado',montoSolicitado);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public simularOfertaExcepcionada(idCredito: number, cobertura: number, idAgencia: number) {
    const serviceUrl = this.appResourcesUrl + 'calculadoraRestController/simularOfertaExcepcionada';
   this.params = new HttpParams();
   this.params = this.params.set('idCredito',idCredito.toString()).set('cobertura',cobertura.toString()).set('idAgencia',idAgencia.toString());
   this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}