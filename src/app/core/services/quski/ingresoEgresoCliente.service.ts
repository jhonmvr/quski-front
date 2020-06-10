import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { TbQoIngresoEgresoCliente } from '../../model/quski/TbQoIngresoEgresoCliente';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoClienteService extends BaseService {

  /**
   * Metodo Por completar
   * @param p 
   */
  findAllEntities(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'ingresoEgresoClienteRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public guardarIngresoEgreso(inEgCl: TbQoIngresoEgresoCliente) {
    const serviceUrl =
      this.appResourcesUrl + 'ingresoEgresoClienteRestController/persistEntity';
    const wrapper = { entidad: inEgCl };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  

}
