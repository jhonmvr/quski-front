
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response,RequestOptions,URLSearchParams,ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, from, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Page } from '../../model/page';
import { DatePipe } from '@angular/common';
import {TbMiCliente}from '../../model/quski/TbMiCliente';

import { TbMiCotizacion } from '../../model/quski/TbMiCotizacion';
import { TbMiJoya } from '../../model/quski//TbMiJoya';
import { TbMiLote } from '../../model/quski/TbMiLote';
import { RelativeDateAdapter } from '../../util/relative.dateadapter';
import { TbMiMovimientoCaja } from '../../model/quski/TbMiMovimientoCaja';


@Injectable({
  providedIn: 'root'
})
export class JoyaService extends BaseService {
 

  dateFormat = new RelativeDateAdapter();
  constructor(_http: HttpClient, private datePipe: DatePipe) {
    super();
    this.http = _http;
    //this.config =_config;
    this.setParameter();
  }




  updateTipoJoya(tbMiTipoJoya) {
    let serviceUrl = this.appResourcesUrl + "tipoJoyaRestController/persistEntity";
    let wrapper = { entidad: tbMiTipoJoya }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
    /* .pipe(
                map((response: Response) => {
          let entidad = response.json();
          return entidad;
      }, 
    error => {
      //console.log("==>despues de buscar usuario error  " + JSON.stringify(error));
      return error;
    }));*/

  }

  public guardarJoya(joya: TbMiJoya) {
    let serviceUrl = this.appResourcesUrl + "tipoJoyaRestController/persistEntity";
    let wrapper = { entidad: joya }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
 
  }
  venderJoya(joya: TbMiJoya, ingresos: TbMiMovimientoCaja[], cliente: TbMiCliente) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/venderJoya";
    let wrapper = { entidad: {joya:joya, ingresos:ingresos, comprador:cliente} }
    this.params = new HttpParams()
    this.params = this.params.set('usuario',localStorage.getItem('reUser'));
    this.params = this.params.set('idAgencia',localStorage.getItem('reAgencia'));
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  findTipoOroByQuilate(quilate){
    let serviceUrl = this.appResourcesUrl + "tipoOroRestController/tipoOroByQuilate";
    this.params = new HttpParams()
    this.params = this.params.set('quilate',quilate);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public findByEstado(dataparam, estado: string, serviceUrl: string) {

    serviceUrl = this.appResourcesUrl + "tipoJoyaRestController/getEntityByEstado";

    /* this.params = new HttpParams()
    this.params.set("estado", estado); */
    this.params = new HttpParams().set('estado', estado);

    ////console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params: this.params };
    console.log("options>>>" + JSON.stringify(this.options));
    return this.http.get(serviceUrl, this.options);
    /* .pipe(
        map((response: Response) => {
          
              let entidad = response.json();
              return entidad;
          },
        error => {
          //console.log("==>despues de buscar inspector error  " + JSON.stringify(error));
          return error;
        })); */
  }

  public findByCodigoContrato(p: Page, codigoContrato: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/getJoyasByCodigoContrato";
    this.params = new HttpParams()
      .set('page', (p.pageNumber.toString() == null ? "" : p.pageNumber.toString()))
      .set('pageSize', (p.pageSize.toString() == null ? "" : p.pageSize.toString()))
      .set('sortFields', 'id')
      .set('sortDirections', 'asc')
      .set('isPaginated', "Y")
      .set('codigo', (codigoContrato == null ? "" : codigoContrato))
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  
  public findJoyasByIdFunda(p: Page, idFunda) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/findByIdFunda";
    this.params = new HttpParams()
      .set('page', (p.pageNumber.toString() == null ? "" : p.pageNumber.toString()))
      .set('pageSize', (p.pageSize.toString() == null ? "" : p.pageSize.toString()))
      .set('sortFields', 'id')
      .set('sortDirections', 'asc')
      .set('isPaginated', "Y")
      .set('idFunda', (idFunda == null ? "" : idFunda))
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
    
  }

  public findByCodigoJoya(codigoJoya: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/getJoyaByCodigoRetazar";
    this.params = new HttpParams()
      .set('codigoJoya', (codigoJoya == null ? "" : codigoJoya));
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public listByIdFunda(idFunda: number){
    let serviceUrl = this.appResourcesUrl + "compraOroRestController/listByIdFunda";
    this.params = new HttpParams();
    this.params = this.params.set("idFunda",idFunda.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public findAllTipoOro(page: Page) {
    let serviceUrl = this.appResourcesUrl + "tipoOroRestController/listAllEntities";

    if (page && page.sortFields && page.sortFields !== ""
      && page.sortDirections && page.sortDirections !== "") {
      this.params = new HttpParams()
        .set("sortFields", page.sortFields)
        .set("page", "" + page.pageNumber)
        .set("pageSize", "" + page.size)
        .set("sortDirections", page.sortDirections)
        .set("isPaginated", page.isPaginated);
    } else {
      this.params = new HttpParams()
        .set("page", "" + page.pageNumber)
        .set("pageSize", "" + page.size)
        .set("isPaginated", page.isPaginated);
    }

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findLoteByEstado() {
    let serviceUrl = this.appResourcesUrl + "tipoOroRestController/listAllEntities";
    this.params = new HttpParams()
      .set('isPaginated', ('N'));
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findByEstadoJoya(estado: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/findByEstadoMvCodigoTipo";
    this.params = new HttpParams()
      .set('estado', (estado == null ? "" : estado));
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findAllTipoJoya(page: Page) {
    let serviceUrl = this.appResourcesUrl + "tipoJoyaRestController/listAllEntities";

    if (page && page.sortFields && page.sortFields !== ""
      && page.sortDirections && page.sortDirections !== "") {
      this.params = new HttpParams()
        .set("sortFields", page.sortFields)
        .set("page", "" + page.pageNumber)
        .set("pageSize", "" + page.size)
        .set("sortDirections", page.sortDirections)
        .set("isPaginated", page.isPaginated);
    } else {
      this.params = new HttpParams()
        .set("page", "" + page.pageNumber)
        .set("pageSize", "" + page.size)
        .set("isPaginated", page.isPaginated);
    }

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findByEstadoMvCodigoTipo(p: Page, estadoJoya: string, estadoMvIn: string, codigoJoya: string, idTipoJoya: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/findByEstadoMvCodigoTipo";
    this.params = new HttpParams()
      .set('page', (p.pageNumber.toString() == null ? "" : p.pageNumber.toString()))
      .set('pageSize', (p.pageSize.toString() == null ? "" : p.pageSize.toString()))
      .set('sortFields', p.sortFields)
      .set('sortDirections', p.sortDirections)
      .set('isPaginated', (p.isPaginated == null ? "" : p.isPaginated))
    if (estadoJoya && estadoJoya !== "")
      this.params = this.params.set('estadoJoya', estadoJoya)
    if (estadoMvIn && estadoMvIn !== "")
      this.params = this.params.set('estadoMvIn', (estadoMvIn == null ? "" : estadoMvIn))
    if (codigoJoya && codigoJoya !== "")
      this.params = this.params.set('codigoJoya', (codigoJoya == null ? "" : codigoJoya))
    if (idTipoJoya && idTipoJoya !== "")
      this.params = this.params.set('idTipoJoya', (idTipoJoya == null ? "" : idTipoJoya));
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public changeEstadoById(id: string, estado: string, precioVenta: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/changeEstadoById";
    this.params = new HttpParams();
    if (id && id !== "")
      this.params = this.params.set('id', id);
    if (estado && estado !== "")
      this.params = this.params.set('estado', estado);
    if (precioVenta && precioVenta !== "")
      this.params = this.params.set('precioVenta', precioVenta);
    this.params = this.params.set('usuario', localStorage.getItem('reUser'));
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public changeEstadoInventarioByIdJoya(idJoya: string, estado: string) {
    let serviceUrl = this.appResourcesUrl + "inventarioRestController/changeEstadoInventarioByIdJoya";
    this.params = new HttpParams();
    if (idJoya && idJoya !== "")
      this.params = this.params.set('idJoya', idJoya);
    if (estado && estado !== "")
      this.params = this.params.set('estado', estado);
    this.params = this.params.set('usuario', localStorage.getItem('reUser'));
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public updateJoyasByLotes(tbMiLotes: Array<TbMiLote>) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/updateJoyasByLotes";
    let wrapper = { entidades: tbMiLotes }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  public findByIdFunda(p: Page, idFunda: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/findByIdFunda";

    this.params = new HttpParams()
    if (p.pageNumber && p.pageNumber.toString() != null)
      this.params = this.params.set('page', p.pageNumber.toString());
    if (p.pageSize && p.pageSize.toString() != null)
      this.params = this.params.set('pageSize', p.pageSize.toString());
    if (p.sortFields && p.sortFields != null)
      this.params = this.params.set('sortFields', p.sortFields.toString());
    if (p.sortDirections && p.sortDirections != null)
      this.params = this.params.set('sortDirections', p.sortDirections.toString());
    if (p.isPaginated && p.isPaginated != null)
      this.params = this.params.set('isPaginated', p.isPaginated.toString());
    if (idFunda && idFunda !== "")
      this.params = this.params.set('idFunda', idFunda);

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findByCodigoJoyaEstadosFechas(p: Page, pcodigoJoya: string, pestados: Array<String>, pfechaDesde, pfechaHasta) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/findByCodigoJoyaEstadosFechas";
    console.log("======>findByCodigoJoyaEstadosFechas pager " + JSON.stringify( p ));    
    this.setSearchParams(p);
    let fd = this.dateFormat.formatBack(pfechaDesde, "input");
    let fh = this.dateFormat.formatBack(pfechaHasta, "input");
    let wp = { codigoJoya: pcodigoJoya, estadosJoyaStr: pestados, fechaDesde: fd, fechaHasta: fh };
    console.log("======>findByCodigoJoyaEstadosFechas wrapper " + JSON.stringify( wp ));
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wp, this.options);
  }


  public deleteJoyaLoteByJoya(idJoya: string) {
    let serviceUrl = this.appResourcesUrl + "joyaLoteRestController/deleteByJoya";
    this.params = new HttpParams()
    if (idJoya && idJoya != "") {
      this.params = this.params.set('idJoya', idJoya);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.delete(serviceUrl, this.options);
  }

  public getEntity(id: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/getEntity";
    this.params = new HttpParams()
    if (id && id != "") {
      this.params = this.params.set('id', id);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  findJoyaLoteByIdLote(idLote:any,p:Page){
    let serviceUrl = this.appResourcesUrl + "joyaLoteRestController/findByIdLote";
    this.setSearchParams(p);
    this.params = this.params.set('idLote',idLote);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,  this.options);
  }
  findByCodigoOperacion(codigoOperacion: string) {
    let serviceUrl = this.appResourcesUrl + "joyaRestController/findBycodigoOperacion";
    this.params = this.params.set('codigoOperacion',codigoOperacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl,  this.options);
  }
}