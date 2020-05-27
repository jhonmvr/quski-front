import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { ReNoticeService } from '../../services/re-notice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../../core/model/page';
import { DatePipe } from '@angular/common';


@Injectable({
    providedIn: "root"
})
export class CotizacionService extends BaseService {

    urlRest = "cotizacionRestController/";
    constructor(_http: HttpClient,private ns: ReNoticeService) {
        super();
        this.http = _http;
        this.setParameter();

    }





    updateCotizacion(tbMiCotizacion) {
        let serviceUrl = this.appResourcesUrl + this.urlRest + "persistEntity";
        let wrapper = { entidad: tbMiCotizacion }
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
              })); */

    }


    findByIdCliente(idCotizador: string) {
        let serviceUrl = this.appResourcesUrl
 + "cotizadorRestController/cotizadorByCliente";

        this.params = this.params.set('idCotizador', idCotizador);
        this.options = { headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);
    }



    findByIdCotizacion(id: string) {
        let serviceUrl = this.appResourcesUrl
 + "precioOroRestController/detalleCotizacionById";

        this.params = this.params.set('id', id);
        this.options = { headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);
    }



    public findByEstado(estado: string, page: Page) {
        let serviceUrl = this.appResourcesUrl
 + this.urlRest + "getEntityByEstado";
        if (estado == null) {
            estado = "ACT";
        }
        this.setSearchParams(page);
        this.params = this.params.set('estado', estado);
        this.options = { headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);

    }

    public getEntity(id: string) {
        this.params = new HttpParams().set('id', id);
        //this.params = new HttpParams();
        let serviceUrl = this.appResourcesUrl
 + "joyaSimRestController/getEntityByidCotizacion";

        console.log("==>despues de buscar idcotizacion error  " + JSON.stringify(id));
        this.options = { Headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);
    }

    guardarCotizacion(tbCotizacion) {
        let serviceUrl = this.appResourcesUrl
 + "cotizadorRestController/persistEntity";
        let wrapper = { entidad: tbCotizacion }
        this.options = { headers: this.headers };
        return this.http.post(serviceUrl, wrapper, this.options);
    }



    guardarVariableCrediticia(tbQoVariableCrediticia) {
        let serviceUrl = this.appResourcesUrl
 + "variableCrediticiaRestController/persistEntity";
        let wrapper = { entidad: tbQoVariableCrediticia }
        this.options = { headers: this.headers };
        return this.http.post(serviceUrl, wrapper, this.options);
    }

    guardarPrecioOro(tbQoPrecioOro) {
        let serviceUrl = this.appResourcesUrl
 + "precioOroRestController/persistEntity";
        let wrapper = { entidad: tbQoPrecioOro }
        this.options = { headers: this.headers };
        return this.http.post(serviceUrl, wrapper, this.options);
    }


    findByIdentificacionCliente(idCotizador: string) {
        let serviceUrl = this.appResourcesUrl
 + "precioOroRestController/precioOroByIdCotizador";

        this.params = this.params.set('idCotizador', idCotizador);
        this.options = { headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);
    }



    guardarJoyaSim(tbMijoyaSim) {
        let serviceUrl = this.appResourcesUrl
 + "joyaSimRestController/persistEntity";
        let wrapper = { entidad: tbMijoyaSim }
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
              })); */

    }

    /*  public findByEstado (dataparam, estado:string, serviceUrl:string ) {
   
       //console.log("==>buscando canales  ") ;
       if( dataparam){
         //console.log("==>buscando canales con dataparam " + JSON.stringify( dataparam ) );
       }
      
       this.setParameter();
       //console.log("==>buscando canales this.appResourcesUrl
 " + this.appResourcesUrl
  );
       serviceUrl=this.appResourcesUrl
+"cotizacionRestController/getEntityByEstado";
       //console.log("==>buscando canales this.appResourcesUrl
 " + serviceUrl  );
         this.params = new HttpParams();
   
         this.params.set("estado", estado);
           ////console.log("==> parametros obtenidos " +  this.params.toString() );
           this.options = { headers: this.headers, params:this.params };
           return this.http.get(serviceUrl, this.options).pipe(
               map((response: Response) => {
                 
                     let entidad = response.json();
                     return entidad;
                 },
               error => {
                 //console.log("==>despues de buscar inspector error  " + JSON.stringify(error));
                 return error;
               }));
     }
   
     public guardarCotizacion(cotizacion:TbMiCotizacion){
       let serviceUrl = this.appResourcesUrl
 + "cotizacionRestController/persistEntity";
       let wrapper = {entidad:cotizacion}
       this.options = { headers: this.headers});
       return this.http.post(serviceUrl, 
           wrapper
           ,this.options).pipe(
                   map((response: Response) => {
             let entidad = response.json();
             return entidad;
         },
       error => {
         console.log("==>despues de buscar cotizacion error  " + JSON.stringify(error));
         return error;
       }));
     } */


}