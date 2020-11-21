import { Injectable } from '@angular/core';
import{BaseService} from '../base.service';
import { AppConfig } from '../../../app.config';
import { Page } from '../../model/page';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class ParametroService extends BaseService {
  private rest = "parametroRestController";
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
        this.http=_http;
        this.setParameter();
   }

   public findRelative(re000:string ) {
      this.params = new HttpParams().set("re000", re000);
      console.log("==> parametros obtenidos " +  this.params.toString() );
      let url=atob(AppConfig.cpu);
      console.log("==> url " +  url );
      return this.http.get(url, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    ); 
  }  
  
public findByNombre(nombre:string){
  this.params = new HttpParams().set("nombre", nombre);
  //console.log("==> parametros obtenidos " +  this.params.toString() );
  this.options = { headers: this.headers, params:this.params };
  return this.http.get<any>(this.genericResourcesUrl  +this.rest + "/getEntityByNombre", this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
}
  /** 
   *  
   * @param nombre String  
   * @param tipo  String
   * @param ordered  "Y", "N"
   */ 
  public findByNombreTipoOrdered(nombre:string, tipo:string, ordered:string){
    this.params = new HttpParams();
    this.params=this.params.set("nombre", nombre);
    this.params=this.params.set("tipo", tipo);
    this.params=this.params.set("ordered", ordered);
    //console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +this.rest + "/findByNombreTipoOrdered", this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public findByTipo(tipo:string){
    this.params = new HttpParams();
    this.params=this.params.set("tipo", tipo);
    this.options = { headers: this.headers, params:this.params };
    return this.http.get(this.genericResourcesUrl  +this.rest + "/findByNombreTipoOrdered", this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public addDaysToDate(fecha:string, dias:string){
    this.params = new HttpParams();
    this.params=this.params.set("fecha", fecha);
    this.params=this.params.set("dias", dias);
    this.params=this.params.set("format", environment.DATE_FORMAT);
    //console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +this.rest + "/addDaysToDate", this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public countDaysBetweenDate(fechaIni:string, fechaFin:string){
    this.params = new HttpParams();
    this.params=this.params.set("fechaIni", fechaIni);
    this.params=this.params.set("fechaFin", fechaFin);
    this.params=this.params.set("format", environment.DATE_FORMAT);
    //console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +this.rest + "/countDaysBetweenDate", this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

  public getPaises(){
    let url = this.genericResourcesUrl  +this.rest + "/getPaises";
    this.params = new HttpParams();
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(url, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  
  public findByParam(nombre:string, tipo:string, estado:string,caracteristicaUno:string, caracteristicaDos:string, page:Page ){
    this.params = new HttpParams();
    this.params=this.params.set("nombre", nombre);
    this.params=this.params.set("tipo", tipo);
    this.params=this.params.set("estado", estado);
    this.params=this.params.set("caracteristicaUno", caracteristicaUno);
    this.params=this.params.set("caracteristicaDos", caracteristicaDos);
    this.params=this.params.set("page", "" + page.pageNumber);
    this.params=this.params.append("pageSize", "" + page.size);
    if (page.sortFields && page.sortFields !== "") {
      this.params=this.params.append("sortFields", page.sortFields);
    }
    if (page.sortDirections && page.sortDirections !== "") {
      this.params=this.params.append("sortDirections", page.sortDirections);
    }
    this.params=this.params.append("isPaginated", page.isPaginated);
    //console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +this.rest + "/listByParamEntities", this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

public findTipos(){
  this.params = new HttpParams();
  this.params=this.params.append("isPaginated", "N");
  this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +this.rest + "/listAllTipos", this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
}


  public getDiffBetweenDateInicioActual(fechaIncio: string, formato: string) {
    const url = this.appResourcesUrl  + this.rest + '/getDiffBetweenDateInicioActual';
    this.params = new HttpParams();
    if (fechaIncio && fechaIncio != '') {
      this.params = this.params.set('fechaInicio', fechaIncio);
    }
    if (formato && formato != '') {
      this.params = this.params.set('formato', formato);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(url, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  public calcularEdad(fechaIncio: string, formato: string) {
    const url = this.appResourcesUrl  + this.rest + '/calcularEdad';
    this.params = new HttpParams();
    if (fechaIncio && fechaIncio != '') {
      this.params = this.params.set('fechaInicio', fechaIncio);
    }
    if (formato && formato != '') {
      this.params = this.params.set('formato', formato);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(url, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

}
