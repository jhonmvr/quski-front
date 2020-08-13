import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoVariablesCrediticia } from '../../model/quski/TbQoVariablesCrediticia';


@Injectable({
  providedIn: 'root'
})
export class VariablesCrediticiasService extends BaseService {
  public urlRest  = "variablesCrediticiaRestController/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  /**
   * @author Jeroham Cadenas
   * @param  idNegociacion : string 
   * @description Buscar variables crediticias en funcion del id de negociacion.
   */
  variablesCrediticiaByIdNegociacion( idNegociacion : number ) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"variablesCrediticiaByIdNegociacion";
    this.params = this.params.set('idNegociacion', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  persistEntity( data : Array<TbQoVariablesCrediticia> ) {
    let serviceUrl = this.appResourcesUrl + this.urlRest +"persistEntity";
    let wrapper = { entidades: data };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  variablesCrediticiabyIdCotizador( idcotizador : number ){
    const serviceUrl = this.appResourcesUrl + this.urlRest + "variablesCrediticiaByIdCotizacion";
    this.params = this.params.set('idCotizador', idcotizador.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options); 
  }
}