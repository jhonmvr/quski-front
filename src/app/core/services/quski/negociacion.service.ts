import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoNegociacion } from '../../model/quski/TbQoNegociacion';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TbQoTasacion } from '../../model/quski/TbQoTasacion';
import { environment } from '../../../../../src/environments/environment';
import { TbQoVariablesCrediticia } from '../../model/quski/TbQoVariablesCrediticia';
@Injectable({
  providedIn: 'root'
})
export class NegociacionService extends BaseService {


  urlRest = "negociacionRestController/";

  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }
  public actualizarVariables(list : Array<TbQoVariablesCrediticia>, idNego: any){
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'actualizarVariables';
    const wrapper = { entidades: list };
    this.params = new HttpParams();
    this.params = this.params.set('idNego',idNego);
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public iniciarNegociacion(cedula: string, asesor: string, idAgencia: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacion';
    this.params = new HttpParams().set('nombreAgencia', localStorage.getItem('nombreAgencia'))
    .set('telefonoAsesor', localStorage.getItem('telefono')).set('cedula', cedula).set('asesor',asesor).set('idAgencia',idAgencia);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public iniciarNegociacionEquifax(cedula: string, asesor: string, idAgencia: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacionEquifax';
    this.params = new HttpParams().set('nombreAgencia', localStorage.getItem('nombreAgencia'))
    .set('telefonoAsesor', localStorage.getItem('telefono')).set('cedula', cedula).set('asesor',asesor).set('idAgencia',idAgencia);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public iniciarNegociacionFromCot(idCotizacion: number, asesor: string, idAgencia: string) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'iniciarNegociacionFromCot';
    this.params = new HttpParams().set('nombreAgencia', localStorage.getItem('nombreAgencia'))
    .set('telefonoAsesor', localStorage.getItem('telefono')).set('idCotizacion', idCotizacion.toString()).set('asesor',asesor).set('idAgencia',idAgencia);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public traerNegociacionExistente(id: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'traerNegociacionExistente';
    this.params = new HttpParams().set('id', id.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param idNegociacion number
   */
  findNegociacionByIdCliente(idNegociacion: number) {
    const serviceUrl = this.appResourcesUrl + this.urlRest +'findByIdCliente';
    this.params = new HttpParams().set('id', idNegociacion.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Developer Twelve - Jeroham Cadenas
   * @param entidad TbQoNegociacion
   */
  public persistEntity(entidad: TbQoNegociacion) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'persistEntity';
    const wrapper = { entidad: entidad };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  updateCliente(cliente: any) {
    const serviceUrl = this.appResourcesUrl + 'clienteRestController/updateCliente';

    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, cliente, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  agregarJoya(joya: TbQoTasacion) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'agregarJoya';
    this.params = new HttpParams().set('asesor',atob(localStorage.getItem(environment.userKey)));
    this.params = this.params.set("nombreAsesor",localStorage.getItem("nombre")).set("correoAsesor",localStorage.getItem("email"));
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, joya, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  guardarOpcionCredito(wrapper: any, idCredito) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'guardarOpcionCredito';
    this.params = new HttpParams().set('asesor',atob(localStorage.getItem(environment.userKey)));
    this.params = this.params.set('idCredito',idCredito);
    this.params = this.params.set('nombreAsesor',localStorage.getItem('nombre')).set("correoAsesor",localStorage.getItem("email"));
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  verPrecios(cliente) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'verPrecio';
    this.params = new HttpParams().set('asesor',atob(localStorage.getItem(environment.userKey)));
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, cliente,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  verPreciosNegociacion(cliente) {
    // se añade servicio para registrar referidos
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'verPrecio';
    this.params = new HttpParams().set('asesor',atob(localStorage.getItem(environment.userKey)));
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, cliente,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  getAllPublicidad(){
    const serviceUrl = this.appResourcesUrl + 'publicidadRestController/' + 'listAllEntities';

    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

}