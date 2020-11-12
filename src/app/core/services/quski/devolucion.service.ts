import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TbQoDevolucion } from '../../model/quski/TbQoDevolucion';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class DevolucionService extends BaseService {

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }

  public persistDevolucion(devolucion: TbQoDevolucion) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/persistEntity";
    const wrapper = { entidad: devolucion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  public registrarDevolucion(devolucion: TbQoDevolucion, usuario) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarSolicitudDevolucion";
   
    this.params = this.params.set('usuario', usuario);
    const wrapper = { entidad: devolucion };
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  public getDevolucion (id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/getEntity";
    this.params = this.params.set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options);

  }


  public aprobarDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,  this.options);
  }


  public rechazarDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/rechazarSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,  this.options);
  }

  public busquedaSeleccionarFechas(devOpeWrap){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/buscarDevolucion";  
    const wrapper = { entidad: devOpeWrap };
    this.options = { headers: this.headers};
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  public registrarFechaArribo(arrayIdDevoluciones, fechaArribo:Date)
  {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarFechaArribo";
    this.params = this.params.set('arrayDevoluciones', arrayIdDevoluciones);  
   
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,  this.options);

  }

}
