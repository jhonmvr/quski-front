import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoDireccionCliente } from '../../model/quski/TbQoDireccionCliente';

@Injectable({
  providedIn: 'root'
})
export class DetalleCreditoService extends BaseService {
  rest  = "detalleCreditoRestController/";
  constructor(_http: HttpClient) {
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
    return this.http.get(serviceUrl, this.options);
  }
}
