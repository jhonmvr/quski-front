import { BaseService } from '../base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { TbQoClientePago } from '../../model/quski/TbQoClientePago';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
  export class ClientePagoService extends BaseService {
    constructor(_http: HttpClient,
      private dialog: MatDialog) {
        super();
        this.http = _http;
        this.setParameter();
  }
  public persistEntity(clientePago: TbQoClientePago) {
    const serviceUrl = this.appResourcesUrl + 'clientePagoRestController/persistEntity';
    const wrapper = { entidad: clientePago };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public crearclientePagoConRelaciones(clientePago: TbQoClientePago, id) {
    this.params = new HttpParams().set('id', id);
    this.options = { headers: this.headers, params: this.params };
    const serviceUrl =
      this.appResourcesUrl + 'clientePagoRestController/crearclientePago';
    const wrapper = { entidad: clientePago };
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  findAllclientePago(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'clientePagoRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public clientePagoByIdCliente(cedula: string) {
    const serviceUrl =
      this.appResourcesUrl + 'clientePagoRestController/findByIdClientePago';
    this.params = new HttpParams().set('cedula', cedula);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}