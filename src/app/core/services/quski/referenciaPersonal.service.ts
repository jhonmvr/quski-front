import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { TbReferencia } from '../../model/quski/TbReferencia';

@Injectable({
  providedIn: 'root'
})
export class ReferenciaPersonalService extends BaseService {

  /**
   * Metodo Por completar
   * @param p 
   */
  findAllEntities(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'referenciaPersonalRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public guardarReferenciasPersonales(refe: TbReferencia) {
    const serviceUrl =
      this.appResourcesUrl + 'referenciaPersonalRestController/persistEntity';
    const wrapper = { entidad: refe };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  

}
