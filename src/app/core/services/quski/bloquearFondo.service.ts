import { BaseService } from '../base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { TbQoRegistrarPago } from '../../model/quski/TbQoRegistrarPago';

@Injectable({
  providedIn: 'root'
})
export class BloquearFondoService extends BaseService {
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  public persistEntity(BloqueoFondo: TbQoRegistrarPago) {
    const serviceUrl =
      this.appResourcesUrl + 'BloquearFondoRestController/persistEntity';
    const wrapper = { entidad: BloqueoFondo };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  public crearBloqueoFondoConRelaciones(BloqueoFondo) {

    this.options = { headers: this.headers, params: this.params };
    const serviceUrl =
      this.appResourcesUrl + 'BloquearFondoRestController/crearBloqueoFondo';
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, BloqueoFondo, this.options);
  }
  findAllBloqueoFondo(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'BloquearFondoRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}