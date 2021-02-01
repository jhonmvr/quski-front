import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoDireccionCliente } from '../../model/quski/TbQoDireccionCliente';
import { TbQoDetalleCredito } from '../../model/quski/TbQoDetalleCredito';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class DetalleCreditoService extends BaseService {
  rest  = "detalleCreditoRestController/";
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }

  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @param idCotizador String
   */
  public listByIdCotizador(idCotizador: number) {
    const serviceUrl = this.appResourcesUrl + this.rest + 'listByIdCotizador';
    this.params = new HttpParams().set('idCotizador', idCotizador.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public persistEntities(entidades: Array<TbQoDetalleCredito>) {
    const serviceUrl = this.appResourcesUrl + this.rest + 'persistEntities';
    let wrapper = { entidades: entidades };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}
