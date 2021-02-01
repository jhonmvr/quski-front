import { Injectable } from "@angular/core";
import { BaseService } from '../base.service';
//import { DatePipe } from "@angular/common";
import { ReNoticeService } from '../../services/re-notice.service';
import { HttpParams, HttpClient } from "@angular/common/http";
import { Page } from '../../../core/model/page';
import { tap } from "rxjs/operators";


import { MatDialog } from '@angular/material';
@Injectable({
  providedIn: "root"
})
export class DocumentoHabilitanteService extends BaseService {

  constructor(
    _http: HttpClient,
    private dialog: MatDialog, private ns: ReNoticeService) {
    super();
    this.http = _http;
    this.setParameter();
  }
  /**
   * Valida el contrato habilitante
   * @param codigoContrato 
   * @param idJoya 
   * @param idAbono 
   * @param tipoDocumento 
   * @param estadoContrato 
   * @param estadoJoya 
   * @param estadoAbono 
   * @param idVentaLote 
   * @param estadoFinalVentaLote 
   */
  validateContratoByHabilitante(
    codigoContrato: string,
    idJoya: string,
    idAbono,
    tipoDocumento: string,
    estadoContrato: string,
    estadoJoya: string,
    estadoAbono,
    idVentaLote,
    estadoFinalVentaLote
  ) {
    let params = new HttpParams();

    params = params.set(
      "codigo",
      codigoContrato != undefined ? codigoContrato : ""
    );
    params = params.set("idJoya", idJoya != undefined ? idJoya : "");
    params = params.set("idAbono", idAbono != undefined ? idAbono : "");
    params = params.set(
      "tipoDocumento",
      tipoDocumento != undefined ? tipoDocumento : ""
    );
    params = params.set(
      "estadoContrato",
      estadoContrato != undefined ? estadoContrato : ""
    );
    params = params.set(
      "estadoJoya",
      estadoJoya != undefined ? estadoJoya : ""
    );
    params = params.set(
      "estadoAbono",
      estadoAbono != undefined ? estadoAbono : ""
    );
    params = params.set(
      "idVentaLote",
      idVentaLote != undefined ? idVentaLote : ""
    );
    params = params.set(
      "estadoVentaLote",
      estadoFinalVentaLote != undefined ? estadoFinalVentaLote : ""
    );
    params = params.set("usuario", localStorage.getItem('reUser'));
    const url =
      this.appResourcesUrl +
      "documentoHabilitanteRestController/validateContratoByHabilitante";
    // params.set("codigo",codigoContrato);
    // params.set("tipoDocumento",tipoDocumento);
    // params.append("codigo",codigoContrato).append("tipoDocumento",tipoDocumento);
    return this.findByParams(params, url);
  }

  /**
   * Encuentra un tipo de documento por codigo de contrato 
   * @param codigoContrato 
   * @param idJoya 
   * @param idAbono 
   * @param tipoDocumento 
   * @param p 
   */
  public findByRolTipoDocumentoReferenciaProcesoEstadoOperacion(
    idRol:string, idTipoDocumento: string,idReferencia: string,
    proceso: string,estadoOperacion: string,p: Page) {
    const serviceUrl =this.appResourcesUrl +"documentoHabilitanteExtendedRestController/loadHabilitantes";
    // this.params = new HttpParams();
    this.setSearchParams(p);
    this.params = new HttpParams().set("idRol", idRol);
    this.params = new HttpParams().set("idTipoDocumento", idTipoDocumento);
    if (idReferencia && idReferencia !== "") {
      this.params = this.params.set("idReferencia", idReferencia);
    }
    if (proceso && proceso !== "") {
      this.params = this.params.set("proceso", proceso);
    }

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public findByRolTipoDocumentoProcesoEstadoOperacion(
    idRol:string, idTipoDocumento: string,
    proceso: string,estadoOperacion: string,p: Page) {
    const serviceUrl =this.appResourcesUrl +"documentoHabilitanteExtendedRestController/getPermisoHabilitanteRol";
    // this.params = new HttpParams();
    this.setSearchParams(p);
    this.params = new HttpParams().set("idRol", idRol);
    this.params = new HttpParams().set("idTipoDocumento", idTipoDocumento);
    
    if (proceso && proceso !== "") {
      this.params = this.params.set("proceso", proceso);
    }
    if (estadoOperacion && estadoOperacion !== "") {
      this.params = this.params.set("estadoOperacion", estadoOperacion);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  /**
   * Encuentra el habilitatne por el parametro 
   * @param p 
   * @param codigoContrato 
   * @param idJoya 
   * @param nombreCliente 
   * @param identificacionCliente 
   * @param estado 
   */
  findHabilitantesByParams(
    p: Page,
    codigoContrato,
    idJoya,
    nombreCliente,
    identificacionCliente,
    estado
  ) {
    const serviceUrl =
      this.appResourcesUrl + "documentoHabilitanteRestController/findByParams";

    this.params = new HttpParams();
    if (p.pageNumber != null) {
      this.params = this.params.set("page", p.pageNumber.toString());
    }
    if (p.pageSize != null) {
      this.params = this.params.set("pageSize", p.pageSize.toString());
    }
    if (p.sortFields && p.sortFields !== "") {
      this.params = this.params.set("sortFields", p.sortFields);
    }
    if (p.sortDirections && p.sortDirections !== "") {
      this.params = this.params.set("sortDirections", p.sortDirections);
    }
    if (p.isPaginated && p.isPaginated !== "") {
      this.params = this.params.set("isPaginated", p.isPaginated);
    }
    if (codigoContrato && codigoContrato !== "") {
      this.params = this.params.set("codigoContrato", codigoContrato);
    }
    if (idJoya && idJoya !== "") {
      this.params = this.params.set("idJoya", idJoya);
    }
    if (nombreCliente && nombreCliente !== "") {
      this.params = this.params.set("nombreCliente", nombreCliente);
    }
    if (identificacionCliente && identificacionCliente !== "") {
      this.params = this.params.set(
        "identificacionCliente",
        identificacionCliente
      );
    }
    if (estado && estado !== "") {
      this.params = this.params.set("estado", estado);
    }

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  /**
   * Descarga el Habilitante por los parametros
   * @param id 
   * @param codigo 
   * @param idJoya 
   * @param idAbono 
   * @param idVentaLote 
   */
  downloadHabilitante(id, codigo, idJoya, idAbono, idVentaLote) {
    const serviceUrl =
      this.appResourcesUrl +
      "documentoHabilitanteRestController/downloadHabilitante";
    this.params = new HttpParams();
    if (id && id != "") {
      this.params = this.params.set("id", id);
    }
    if (codigo && codigo != "") {
      this.params = this.params.set("codigo", codigo);
    }
    if (idJoya && idJoya != "") {
      this.params = this.params.set("idJoya", idJoya);
    }
    if (idAbono && idAbono != "") {
      this.params = this.params.set("idAbono", idAbono);
    }
    if (idVentaLote && idVentaLote != "") {
      this.params = this.params.set("idVentaLote", idVentaLote);
    }
    // this.options = { params: this.params, responseType: 'blob' as 'json' };
    return this.http.get(serviceUrl, {
      params: this.params,
      responseType: "blob" as "json"
    });
  }
  /**
   * 
   * @param id Descarga la plantilla del tipo documento
   * @param identificacionCliente 
   * @param nombreCliente 
   * @param idCotizador 
   * @param idNegociacion 
   * @param format 
   */
  downloadAutorizacionPlantilla(
    id,
    format: string,
    nombreCliente: string,
    identificacionCliente: string

  ) {
    const serviceUrl =
      this.appResourcesUrl + "tipoDocumentoRestController/getPlantilla";
    this.params = new HttpParams();
    if (id && id != "") {
      this.params = this.params.set("id", id);
    }
    if (format && format != "") {
      this.params = this.params.set("format", format);
    }
    if (nombreCliente && nombreCliente != "") {
      this.params = this.params.set("nombreCliente", nombreCliente);
    }
    if (identificacionCliente && identificacionCliente != "") {
      this.params = this.params.set("identificacionCliente", identificacionCliente);
    }
    this.options = {
      headers: this.headers,
      params: this.params,
      responseType: 'blob' as 'json'
    };
    //console.log(      "downloadHabilitantePlantilla options " + JSON.stringify(this.options)   );
    //console.log(      "downloadHabilitantePlantilla parametros " + JSON.stringify(this.params));
    //return this.http.get(serviceUrl, { params: this.params, responseType: 'blob' as 'json' });
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  /**
   * Encuentra los abonos 
   * @param page 
   * @param identificacionCliente 
   */
  findAbonos(page: Page, identificacionCliente: any) {
    const serviceUrl = this.appResourcesUrl + "abonoRestController/findPendienteByIdentificacion";
    this.setSearchParams(page);
    this.params = this.params.set('identificacion', identificacionCliente);
    this.options = { headers: this.headers, params: this.params };

    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  /**
   * Encuentra las ventas por lote
   * @param page 
   * @param identificacionCliente 
   * @param codigo 
   */
  findVentaLote(page: Page, identificacionCliente: any, codigo: any) {
    const serviceUrl = this.appResourcesUrl + "ventaLoteRestController/findPendienteByCodigo";
    this.setSearchParams(page);
    this.params = this.params.set('identificacion', identificacionCliente);
    this.params = this.params.set('codigoVentaLote', codigo);
    this.options = { headers: this.headers, params: this.params };

    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );

  }

  /**
   * Encuentra la Venta vitrina
   * @param page 
   * @param identificacionCliente 
   * @param codigo 
   */
  findVentaVitrina(page: Page, identificacionCliente: any, codigo: any) {
    const serviceUrl = this.appResourcesUrl + "joyaRestController/findPendienteByIdentificacion";
    this.setSearchParams(page);
    this.params = this.params.set('identificacion', identificacionCliente);
    this.params = this.params.set('codigoJoya', codigo);
    this.options = { headers: this.headers, params: this.params };

    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );

  }


  generatePlantillaHabilitantesByParams(serviceRef:string,idReferencia:string,idTipoDocumento:string,
    proceso:string, estadoOperacion:string,idHabilitante:string, format:string) {
    const serviceUrl =this.appResourcesUrl + serviceRef;
    this.params = new HttpParams();
   // this.params = this.params.set("idHabilitante", idHabilitante);
    this.params = this.params.set("idTipoDocumento", idTipoDocumento);
    this.params = this.params.set("proceso", proceso);
    this.params = this.params.set("estadoOperacion", estadoOperacion);
    this.params = this.params.set("idReferencia", idReferencia);
    this.params = this.params.set("format", format);
    this.options = { responseType: 'arraybuffer',headers: this.headers,  params: this.params };
    return this.http.post(serviceUrl,{}, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  
  public getHabilitanteByReferenciaTipoDocumentoProceso(idTipoDocumento, proceso,  referencia) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + 'documentoHabilitanteRestController/getByProcesoTipoDocumentoReferencia';
    this.params = new HttpParams().set('idTipoDocumento', idTipoDocumento);
    this.params = this.params = this.params.set("proceso", proceso);
    this.params = this.params = this.params.set("referencia", referencia)

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  public getFileFromMongo(){
    
  }
}





