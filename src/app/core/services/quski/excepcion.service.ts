import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoExcepcion } from '../../model/quski/TbQoExcepcion';

@Injectable({
  providedIn: 'root'
})
export class ExcepcionService extends BaseService {
  public restC = 'excepcionesRestController/';
  constructor(_http: HttpClient) {
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
    return this.http.get(serviceUrl, this.options);
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
    return this.http.get(serviceUrl, this.options);
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
    return this.http.get(serviceUrl, this.options);
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
    return this.http.get(serviceUrl, this.options);
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
    return this.http.get(serviceUrl, this.options);
  }

  public findByTipoExcepcionAndIdNegociacionAndCaracteristica(tipoExcepcion: string, idNegociacion: any, caracteristica: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByTipoExcepcionAndIdNegociacionAndCaracteristica';
    this.params = new HttpParams();
    this.params = this.params.set('tipoExcepcion', tipoExcepcion);
    this.params = this.params.set('idNegociacion', idNegociacion);
    this.params = this.params.set('caracteristica', caracteristica);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
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
    console.log('VALOR DE LA DIRECCION', serviceUrl, 'VALOR DE LA EXCEPCION ===>  ', data);
    let wrapper = { entidad: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }





}