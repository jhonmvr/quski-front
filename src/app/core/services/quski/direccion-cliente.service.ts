import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoDireccionCliente } from '../../model/quski/TbQoDireccionCliente';

@Injectable({
  providedIn: 'root'
})
export class DireccionClienteService extends BaseService {

  public guardarDireccion(direccion: TbQoDireccionCliente) {
    const serviceUrl =
      this.appResourcesUrl + 'direccionClienteRestController/persistEntity';
    const wrapper = { entidad: direccion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  public findDireccionByIdCliente(id: string, tipoDireccion : string) {
    const serviceUrl =
      this.appResourcesUrl + 'direccionClienteRestController/direccionByIdCliente';
    this.params = new HttpParams().set('idC', id).set('tipoDireccion', tipoDireccion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  

}
