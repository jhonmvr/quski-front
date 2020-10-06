import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoExcepcionRol } from '../../model/quski/TbQoExcepcionRol';

@Injectable({
  providedIn: 'root'
})
export class ExcepcionRolService extends BaseService {
  public restC = 'excepcionRolRestController/';
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }

  public getEntity(id: number) {
    const serviceUrl = this.appResourcesUrl + this.restC + 'getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findByRolAndIdentificacion(rol: string, identificacion: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByRolAndIdentificacion';
    this.params = new HttpParams();
    this.params.set('rol', rol);
    this.params.set('identificacion', identificacion);

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public persistEntity(data: TbQoExcepcionRol) {
    let serviceUrl = this.appResourcesUrl + this.restC + 'persistEntity';
    console.log('VALOR DE LA DIRECCION', serviceUrl, 'VALOR DE LA EXCEPCION ===>  ', data);
    let wrapper = { entidad: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

}
