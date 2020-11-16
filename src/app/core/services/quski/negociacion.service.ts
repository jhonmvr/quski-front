import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoNegociacion } from '../../model/quski/TbQoNegociacion';



import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class NegociacionService extends BaseService {


  urlRest = "negociacionRestController/";

  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }

  public iniciarNegociacion(cedula: string, asesor: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacion';
    this.params = new HttpParams().set('cedula', cedula).set('asesor',asesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public iniciarNegociacionEquifax(cedula: string, asesor: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacionEquifax';
    this.params = new HttpParams().set('cedula', cedula).set('asesor',asesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public iniciarNegociacionFromCot(idCotizacion: number, asesor: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacionFromCot';
    this.params = new HttpParams().set('idCotizacion', idCotizacion.toString()).set('asesor',asesor);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public traerNegociacionExistente(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerNegociacionExistente';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param idNegociacion number
   */
  findNegociacionByIdCliente(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'findByIdCliente';
    this.params = new HttpParams().set('id', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param entidad TbQoNegociacion
   */
  public persistEntity(entidad: TbQoNegociacion) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'persistEntity';
    const wrapper = { entidad: entidad };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  updateCliente(cliente: any) {
    const serviceUrl = this.appResourcesUrl + 'clienteRestController/updateCliente';

    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, cliente, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

}