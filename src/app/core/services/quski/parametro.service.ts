import { Injectable } from '@angular/core';
import{BaseService} from '../base.service';



import { AppConfig } from '../../../app.config';
import { Page } from '../../model/page';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroService extends BaseService {

  constructor(_http:HttpClient  ) {
    super();
        this.http=_http;
        this.setParameter();
   }

   public findRelative(re000:string ) {
      this.params = new HttpParams().set("re000", re000);
      console.log("==> parametros obtenidos " +  this.params.toString() );
      let url=atob(AppConfig.cpu);
      console.log("==> url " +  url );
      return this.http.get(url, this.options); 
  }  
  
public findByNombre(nombre:string){
  this.params = new HttpParams().set("nombre", nombre);
  //console.log("==> parametros obtenidos " +  this.params.toString() );
  this.options = { headers: this.headers, params:this.params };
  return this.http.get<any>(this.genericResourcesUrl  +"parametroRestController/getEntityByNombre", this.options);
}

  public findByNombreTipoOrdered(nombre:string, tipo:string, ordered:string){
    this.params = new HttpParams();
    this.params=this.params.set("nombre", nombre);
    this.params=this.params.set("tipo", tipo);
    this.params=this.params.set("ordered", ordered);
    //console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +"parametroRestController/findByNombreTipoOrdered", this.options);
  }

  public addDaysToDate(fecha:string, dias:string){
    this.params = new HttpParams();
    this.params=this.params.set("fecha", fecha);
    this.params=this.params.set("dias", dias);
    this.params=this.params.set("format", environment.DATE_FORMAT);
    //console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +"parametroRestController/addDaysToDate", this.options);
  }

  public countDaysBetweenDate(fechaIni:string, fechaFin:string){
    this.params = new HttpParams();
    this.params=this.params.set("fechaIni", fechaIni);
    this.params=this.params.set("fechaFin", fechaFin);
    this.params=this.params.set("format", environment.DATE_FORMAT);
    //console.log("==> parametros obtenidos " +  this.params.toString() );
    this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +"parametroRestController/countDaysBetweenDate", this.options);
  }

  public getPaises(){
    let url = this.genericResourcesUrl  +"parametroRestController/getPaises";
    this.params = new HttpParams();
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(url, this.options);
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
    return this.http.get<any>(this.genericResourcesUrl  +"parametroRestController/listByParamEntities", this.options);
  }

public findTipos(){
  this.params = new HttpParams();
  this.params=this.params.append("isPaginated", "N");
  this.options = { headers: this.headers, params:this.params };
    return this.http.get<any>(this.genericResourcesUrl  +"parametroRestController/listAllTipos", this.options);
}


  public getDiffBetweenDateInicioActual(fechaIncio: string, formato: string) {
    const url = this.appResourcesUrl  + 'parametroRestController/getDiffBetweenDateInicioActual';
    this.params = new HttpParams();
    if (fechaIncio && fechaIncio != '') {
      this.params = this.params.set('fechaInicio', fechaIncio);
    }
    if (formato && formato != '') {
      this.params = this.params.set('formato', formato);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(url, this.options);
  }

}
