import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
// import { Http, Headers, Response, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbMiCliente } from '../../model/quski/TbMiCliente';
import { TbMiCotizacion } from '../../model/quski/TbMiCotizacion';
import { Page } from '../../model/page';
import { TbQoCliente } from "../../model/quski/TbQoCliente";

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseService {

  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }
  public findClienteByCodigoOperacion(codigoOperacion: string) {
    this.setParameter();
    const serviceUrl = this.appResourcesUrl + '/quski-oro-rest/resources/clienteRestController/getClienteByCodigoOperacion';
    this.params = new HttpParams().set('codigoOperacion', codigoOperacion);
    console.log("Codigin --> " + codigoOperacion);
    this.options = { headers: this.headers, params: this.params };

    return this.http.get(serviceUrl, this.options);
  }

  public findByEstado(dataparam, estado: string, serviceUrl: string) {
    this.setParameter();
    serviceUrl =
      this.appResourcesUrl + 'cotizacionRestController/getEntityByEstado';

    this.params = new HttpParams();

    this.params.set('estado', estado);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public guardarCliente(cliente: TbQoCliente) {
    const serviceUrl =
      this.appResourcesUrl + 'clienteRestController/persistEntity';
    const wrapper = { entidad: cliente };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  public obtenerWrapperCliente() {
    let serviceUrl = this.appResourcesUrl + "clienteRestController/obtenerCliente";
    this.options = { Headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findClienteByIdentificacion(identificacion: string) {
    const serviceUrl =
      this.appResourcesUrl + 'clienteRestController/clienteByIdentificacion';
    this.params = new HttpParams().set('identificacion', identificacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public validateContratoByIdCliente(idCliente: string) {
    const serviceUrl =
      this.appResourcesUrl + 'contratoRestController/validateContratoByIdCliente';
    this.params = new HttpParams().set('idCliente', idCliente);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  public clienteByIdentificacionList(p: Page, identificacion: string) {
    const serviceUrl =
      this.appResourcesUrl +
      'clienteRestController/clienteByIdentificacionList';
    this.setSearchParams(p);
    this.params = this.params.set('identificacion', identificacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public guardarCotizacion(cotizacion: TbMiCotizacion) {
    const serviceUrl =
      this.appResourcesUrl + 'cotizacionRestController/persistEntity';
    const wrapper = { entidad: cotizacion };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  }

  findClienteByParams(
    p: Page,
    identificacion: string,
    nombre: string,
    apellido: string,
    telefono: string,
    celular: string,
    correo: string,
    sector: string,
    ciudad: string,
    nombreReferencia: string,
    telefonoReferencia: string,
    celularReferencia: string,
    estado: string
  ) {
    const serviceUrl = this.appResourcesUrl + 'clienteRestController/findByParams';
    this.params = new HttpParams()
      .set('page', p.pageNumber.toString())
      .set('pageSize', p.pageSize.toString());
    if (p.sortFields && p.sortFields !== '') {
      this.params = this.params.set('sortFields', p.sortFields);
    }
    if (p.sortDirections && p.sortDirections !== '') {
      this.params = this.params.set('sortDirections', p.sortDirections);
    }
    if (p.isPaginated && p.isPaginated !== '') {
      this.params = this.params.set('isPaginated', p.isPaginated);
    }
    if (identificacion && identificacion !== '') {
      this.params = this.params.set('identificacion', identificacion);
    }
    if (nombre && nombre !== '') {
      this.params = this.params.set('nombre', nombre);
    }
    if (apellido && apellido !== '') {
      this.params = this.params.set('apellido', apellido);
    }
    if (telefono && telefono !== '') {
      this.params = this.params.set('telefono', telefono);
    }
    if (celular && celular !== '') {
      this.params = this.params.set('celular', celular);
    }
    if (correo && correo !== '') {
      this.params = this.params.set('correo', correo);
    }
    if (sector && sector !== '') {
      this.params = this.params.set('sector', sector);
    }
    if (ciudad && ciudad !== '') {
      this.params = this.params.set('ciudad', ciudad);
    }
    if (nombreReferencia && nombreReferencia !== '') {
      this.params = this.params.set('nombreReferencia', nombreReferencia);
    }
    if (telefonoReferencia && telefonoReferencia !== '') {
      this.params = this.params.set('telefonoReferencia', telefonoReferencia);
    }
    if (celularReferencia && celularReferencia !== '') {
      this.params = this.params.set('celularReferencia', celularReferencia);
    }
    if (estado && estado !== '') {
      this.params = this.params.set('estado', estado);
    }
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  consultarPasivos(idCliente) {
    let serviceUrl = this.appResourcesUrl + "patrimonioWrapperRestController/obtenerPasivos";
    this.params = this.params.set('idCliente', idCliente);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  consultarUbicaciones(nombre) {
    let serviceUrl = this.appResourcesUrl + "parroquiaRestController/listAllParroquiaByCantonProvincia";
    this.params = this.params.set('nombre', nombre);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

}
