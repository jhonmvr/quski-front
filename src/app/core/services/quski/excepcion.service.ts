import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoExcepcion } from '../../model/quski/TbQoExcepcion';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExcepcionService extends BaseService {

  public restC = 'excepcionesRestController/';
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }

  /**
   * @author Jeroham Cadenas
   * @date 14/Julio/2020
   * @description Busca excepcion por id { entidad }
   * @param id
   */
  public getEntity(id: number) {
    const serviceUrl = this.appResourcesUrl + this.restC + 'getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public negarExcepcion(idExc: number, obsAprobador: string, aprobador: string, proceso: string) {
    const serviceUrl = this.appResourcesUrl + this.restC + 'negarExcepcion';
    this.params = new HttpParams().set('idExc', idExc.toString()).set('obsAprobador', obsAprobador).set('aprobador', aprobador).set('proceso', proceso);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public aprobarCobertura(idExc: number, obsAprobador: string, aprobador: string, cobertura: string, proceso: string) {
    const serviceUrl = this.appResourcesUrl + this.restC + 'aprobarCobertura';
    this.params = new HttpParams().set('idExc', idExc.toString()).set('obsAprobador', obsAprobador).set('aprobador', aprobador).set('cobertura', cobertura).set('proceso', proceso);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   * @date 14/Julio/2020
   * @description Busca excepciones por id_Negociacion { list }
   * @param idNegociacion 
   */
  public findByIdNegociacion(idNegociacion: number) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByIdNegociacion';
    this.params = new HttpParams().set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   * @date 14/Julio/2020
   * @description Busca una excepcion especifica { entidad }
   * @param idNegociacion string
   * @param tipoExcepcion string
   * @param estadoExcepcion string
   */
  public findByIdNegociacionAndTipoExcepcionAndEstadoExcepcion(idNegociacion: string, tipoExcepcion: string, estadoExcepcion: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByIdNegociacionAndTipoExcepcionAndEstadoExcepcion';
    this.params = new HttpParams();
    this.params.set('idNegociacion', idNegociacion);
    this.params.set('tipoExcepcion', tipoExcepcion);
    this.params.set('estadoExcepcion', estadoExcepcion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   * @date 14/Julio/2020
   * @description Busca excepciones por id cliente { list }
   * @param idCliente string
   */
  public findByIdCliente(idCliente: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByIdCliente';
    this.params = new HttpParams();
    this.params.set('idCliente', idCliente);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas
   * @date 14/Julio/2020
   * @description Busca excepciones segun el tipo de excepcion e id de negociacion { list }
   * @param tipoExcepcion string
   * @param idNegociacion string
   */
  public findByTipoExcepcionAndIdNegociacion(tipoExcepcion: string, idNegociacion: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByTipoExcepcionAndIdNegociacion';
    this.params = new HttpParams();
    this.params.set('tipoExcepcion', tipoExcepcion);
    this.params.set('idNegociacion', idNegociacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public findByTipoExcepcionAndIdNegociacionAndCaracteristica(tipoExcepcion: string, idNegociacion: any, caracteristica: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByTipoExcepcionAndIdNegociacionAndCaracteristica';
    this.params = new HttpParams();
    this.params = this.params.set('tipoExcepcion', tipoExcepcion);
    this.params = this.params.set('idNegociacion', idNegociacion);
    this.params = this.params.set('caracteristica', caracteristica);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  /**
   * 
   * @author Jeroham Cadenas
   * @date 21/Julio/2020
   * @description Guarda o actualiza una excepcion { entidad }
   * @param tbQoExcepcione TbQoExcepcione
   */
  public persistEntity(data: TbQoExcepcion) {
    let serviceUrl = this.appResourcesUrl + this.restC + 'persistEntity';
    let wrapper = { entidad: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public solicitarExcepcion(data: TbQoExcepcion) {
    let serviceUrl = this.appResourcesUrl +'negociacionRestController/solicitarExcepcion';
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, data, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  aprobarExcepcion(id, obsAprobador,aprobado) {
    let serviceUrl = this.appResourcesUrl +'excepcionesRestController/excepcionCliente';
    this.params = new HttpParams();
    this.params = this.params.set('id', id);
    this.params = this.params.set('obsAprobador', obsAprobador);
    if(atob(localStorage.getItem(environment.userKey))){
      this.params = this.params.set('aprobador', atob(localStorage.getItem(environment.userKey)));
    }
    this.params = this.params.set('aprobado', aprobado);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }



}