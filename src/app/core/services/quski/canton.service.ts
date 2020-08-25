import { Injectable } from '@angular/core';
import { Page } from '../../model/page';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CantonService extends BaseService {

  /**
   * Metodo Por completar
   * @param c 
   */
  findAllEntities(c: Page) {
    this.setParameter();
    //const serviceUrl = this.appResourcesUrl + 'cantonRestController/listAllEntities';
    //this.options = { headers: this.headers, params: this.params };
    //return this.http.get(serviceUrl, this.options);
  }

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  

}
