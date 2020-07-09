import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response, RequestOptions, HttpParams, ResponseContentType } from '@angular/http';
import { ReNoticeService } from '../../services/re-notice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../../core/model/page';
import { TbCotizacion } from '../../../core/model/quski/TbCotizacion';
import { DatePipe } from '@angular/common';
import { BaseWrapper } from '../../model/basewrapper';


@Injectable({
  providedIn: "root"
})
export class CotizacionService extends BaseService {

  urlRest = "cotizacionRestController/";
  constructor(_http: HttpClient, private ns: ReNoticeService) {
    super();
    this.http = _http;
    this.setParameter();

  }





  updateCotizacion(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl + "cotizadorRestController/persistEntity";
    let wrapper = { entidad: tbCotizacion }
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

  generarCotizacion(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl
      + "cotizadorRestController/generarCotizacion";
    let wrapper = { entidad: tbCotizacion }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  caducarCotizacion(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl
      + "cotizadorRestController/caducarCotizacion";
    let wrapper = { entidad: tbCotizacion }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
  /**
  * Método que devuelve la lista de cotizaciones 
  * @param cedulaCliente Envia la cedula del cliente
  */
  getCotizacionByCedula(cedulaCliente: string) {
    let serviceUrl = this.appResourcesUrl + 'cotizadorRestController/getCotizacionWrapper';
    this.params = this.params.set('cedulaCliente', cedulaCliente);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  findByIdCliente(cedulaCliente: string) {
    let serviceUrl = this.appResourcesUrl + "cotizadorRestController/cotizadorByCliente";
    this.params = this.params.set('cedulaCliente', cedulaCliente);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }


/**
 * @description Metodo que trae el detalle de la cotizacion por id de cotización
 * @author Kléber Guerra  - Relative Engine
 * @date 08/07/2020
 * @param {string} id
 * @returns {*}  
 * @memberof CotizacionService
 */
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



  /**
   * Metodo qu registraa la info,acion de cliente, cotizacion y variable crediticia,
   * adicional cadcua cotizaciones
  /**
   * @description Metodo que crea la varible crediticia y la cotización
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @param {TbCotizacion} cotizador
   * @returns {*}  
   * @memberof CotizacionService
   */
  crearCotizacionClienteVariableCrediticia(cotizador: TbCotizacion) {
    let serviceUrl = this.appResourcesUrl + "cotizadorRestController/crearCotizacionClienteVariableCrediticia";
    let wrapper = { entidad: cotizador }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }



  crearVariableCrediticia(tbCotizacion) {
    let serviceUrl = this.appResourcesUrl
      + "variableCrediticiaRestController/crearVariableCrediticia";
    let wrapper = { entidad: tbCotizacion }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }



  guardarPrecioOro(tbQoPrecioOro) {

    const serviceUrl = this.appResourcesUrl + "precioOroRestController/crearPrecioOro";
    const wrapper = new BaseWrapper();
    wrapper.entidad = tbQoPrecioOro;
    //this.options = { headers: this.headers };
    //return this.http.post(serviceUrl, wrapper, this.options);
    return this.manageGenericUrl(null, wrapper, serviceUrl);
  }
  /**
   * @description Metodo que llama al rest que edita un precio oro
   * @author Kléber Guerra  - Relative Engine
   * @date 07/07/2020
   * @param {*} tbQoPrecioOro
   * @returns {*}  
   * @memberof CotizacionService
   */
  editarPrecioOro(tbQoPrecioOro) {
    let serviceUrl = this.appResourcesUrl + "precioOroRestController/persistEntity";
    let wrapper = { entidad: tbQoPrecioOro };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }
    /**
     * @description sequences que llama al metodo rest para traer el precio oro
     * @author Kléber Guerra  - Relative Engine
     * @date 07/07/2020
     * @param {*} idPrecioOro
     * @returns {*}  
     * @memberof CotizacionService
     */
    seleccionarPrecioOro(idPrecioOro) {
      let serviceUrl = this.appResourcesUrl + "precioOroRestController/getEntity";
      this.params = new HttpParams();
      this.params = this.params.set("id", idPrecioOro);
      this.options = { headers: this.headers, params: this.params };
      return this.http.get(serviceUrl, this.options);
    }
   /**
    * @description Metodo que llama a carcar Precio oro
    * @author Kléber Guerra  - Relative Engine
    * @date 07/07/2020
    * @param {*} idCotizacion
    * @returns {*}  
    * @memberof CotizacionService
    */
   loadPrecioOroByCotizacion(idCotizacion){
      let serviceUrl = this.appResourcesUrl + "precioOroRestController/detalleCotizacionById";
      this.params = new HttpParams();
      this.params = this.params.set("id", idCotizacion);
      this.options = { headers: this.headers, params: this.params };
      return this.http.get(serviceUrl, this.options);
    }

  //TODO: IMPLEMENTAR LA ELIMINACION DEL PRECIO ORO POR ID PRECIO ORO 
    /**
     * @description Metodo que llama al rest que realiza la eliminacion de un precio oro
     * @author Kléber Guerra  - Relative Engine
     * @date 07/07/2020
     * @param {*} idPrecioOro
     * @returns {*}  
     * @memberof CotizacionService
     */
    eliminarPrecioOro(idPrecioOro) {
      let serviceUrl = this.appResourcesUrl + "precioOroRestController/eliminarPrecioOro";
      this.params = new HttpParams();
      this.params = this.params.set("id", idPrecioOro);
      this.options = { headers: this.headers, params: this.params };
      return this.http.get(serviceUrl, this.options);
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