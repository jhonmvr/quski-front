import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../model/page';



import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
@Injectable({
  providedIn: 'root'
})
export class ExcepcionOperativaService extends BaseService {
  private rest = "excepcionOperativaRestController/"
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  findAllByParams(page: Page,  usuario?: string, estado?: string, codigo?: string, codigoOperacion?: string, idNegociacion?: string) {
    let serviceUrl = this.appResourcesUrl + "excepcionOperativaRestController/listAllByParams";
    let params = new HttpParams()
      .set('page', page.currentPage.toString())
      .set('pageSize', page.pageSize.toString())
      .set('sortFields', page.sortFields)
      .set('sortDirections', page.sortDirections)
      .set('isPaginated', page.isPaginated);

    if (usuario) params = params.set('usuario', usuario);
    if (estado) params = params.set('estado', estado);
    if (codigo) params = params.set('codigo', codigo);
    if (codigoOperacion) params = params.set('codigoOperacion', codigoOperacion);
    if (idNegociacion) params = params.set('idNegociacion', idNegociacion);

    this.options = { headers: this.headers, params: params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }




}
