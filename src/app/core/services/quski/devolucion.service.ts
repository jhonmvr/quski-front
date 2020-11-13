import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TbQoDevolucion } from '../../model/quski/TbQoDevolucion';
import { BaseService } from '../base.service';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class DevolucionService extends BaseService {

  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }

  public persistDevolucion(devolucion: TbQoDevolucion) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/persistEntity";
    const wrapper = { entidad: devolucion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public registrarDevolucion(devolucion: TbQoDevolucion, usuario) {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarSolicitudDevolucion";
   
    this.params = this.params.set('usuario', usuario);
    const wrapper = { entidad: devolucion };
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public getDevolucion (id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/getEntity";
    this.params = this.params.set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );

  }


  public aprobarDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/aprobarSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,  this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }


  public rechazarDevolucion(id){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/rechazarSolicitudDevolucion";
    this.params = this.params.set('id', id);  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,  this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public busquedaSeleccionarFechas(devOpeWrap){
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/buscarDevolucion";  
    const wrapper = { entidad: devOpeWrap };
    this.options = { headers: this.headers};
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public registrarFechaArribo(arrayIdDevoluciones, fechaArribo:Date)
  {
    let serviceUrl = this.appResourcesUrl + "devolucionRestController/registrarFechaArribo";
    this.params = this.params.set('arrayDevoluciones', arrayIdDevoluciones);  
   
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl,  this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );

  }

}
