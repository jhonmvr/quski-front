import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoExcepcionRol } from '../../model/quski/TbQoExcepcionRol';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExcepcionRolService extends BaseService {
  public restC = 'excepcionRolRestController/';
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }

  public getEntity(id: number) {
    const serviceUrl = this.appResourcesUrl + this.restC + 'getEntity';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public findByRolAndIdentificacion(user: string, identificacion: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + this.restC + 'findByRolAndIdentificacion';
    this.params = new HttpParams();
    this.params = this.params.set('rol', localStorage.getItem(environment.rolName));
    if(identificacion){
      this.params = this.params.set('identificacion', identificacion);
    }

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public persistEntity(data: TbQoExcepcionRol) {
    let serviceUrl = this.appResourcesUrl + this.restC + 'persistEntity';
    //console.log('VALOR DE LA DIRECCION', serviceUrl, 'VALOR DE LA EXCEPCION ===>  ', data);
    let wrapper = { entidad: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

}
