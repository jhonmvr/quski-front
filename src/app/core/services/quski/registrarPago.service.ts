import { BaseService } from '../base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoRegistrarPago } from '../../model/quski/TbQoRegistrarPago';
import { Page } from '../../model/page';

@Injectable({
    providedIn: 'root'
  })
  export class RegistrarPagoService extends BaseService {
    constructor(_http: HttpClient) {
        super();
        this.http = _http;
        this.setParameter();
  }
  public persistEntity(registrarPago: TbQoRegistrarPago) {
    const serviceUrl =
      this.appResourcesUrl + 'registrarPagoRestController/persistEntity';
    const wrapper = { entidad: registrarPago };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  public crearRegistrarPagoConRelaciones(registrarPago) {
   
    this.options = { headers: this.headers, params: this.params };
    const serviceUrl =
      this.appResourcesUrl + 'registrarPagoRestController/crearRegistrarPago';
    
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, registrarPago, this.options);
  }
  findAllRegistrarPago(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'registrarPagoRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
}