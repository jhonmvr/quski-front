import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { ReNoticeService } from '../re-notice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';
import { TbCotizacion } from '../../model/quski/TbCotizacion';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: "root"
})
export class PrecioOroService extends BaseService {

  urlRest = "precioOroRestController/";
  constructor(_http: HttpClient, private ns: ReNoticeService) {
    super();
    this.http = _http;
    this.setParameter();

  }
  public findByCedula(p: Page, cedula: string) {
    const serviceUrl = this.appResourcesUrl +
      'findByCedula';
    this.setSearchParams(p);
    this.params = this.params.append('identificacion', cedula);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

}