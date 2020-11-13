import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
// import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class ParroquiaService extends BaseService {

  /**
   * Metodo Por completar
   * @param p 
   */
  findAllEntities(p: Page) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'parroquiaRestController/listAllEntities';
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
