import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoDireccionCliente } from '../../model/quski/TbQoDireccionCliente';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class DireccionClienteService extends BaseService {

  public guardarDireccion(direccion: TbQoDireccionCliente) {
    const serviceUrl =
      this.appResourcesUrl + 'direccionClienteRestController/persistEntity';
    const wrapper = { entidad: direccion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public findDireccionByIdCliente(id: string, tipoDireccion : string) {
    const serviceUrl =
      this.appResourcesUrl + 'direccionClienteRestController/direccionByIdCliente';
    this.params = new HttpParams().set('idC', id).set('tipoDireccion', tipoDireccion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }
  

}
