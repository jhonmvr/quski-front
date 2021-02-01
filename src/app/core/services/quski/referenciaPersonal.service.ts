import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { TbReferencia } from '../../model/quski/TbReferencia';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class ReferenciaPersonalService extends BaseService {

  
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();
  }

  /**
   * Metodo Por completar
   * @param p 
   */
  findAllEntities(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'referenciaPersonalRestController/listAllEntities';
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { //this.HandleError(error, new ReNoticeService(), this.dialog); 
        }
      )
    );
  }
  public guardarReferenciasPersonales(refe: TbReferencia) {
    const serviceUrl =
      this.appResourcesUrl + 'referenciaPersonalRestController/persistEntity';
    const wrapper = { entidad: refe };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { //this.HandleError(error, new ReNoticeService(), this.dialog); 
        }
      )
    );
  }



}
