import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PersonaConsulta } from '../../model/calculadora/personaConsulta';
import { ConsultaOferta } from '../../model/calculadora/consultaOferta';


import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
@Injectable({
  providedIn: 'root'
})
export class IntegracionService extends BaseService {

  urlRest = "integracionRestController/";
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }

  /**
 * @description Realiza la busqueda del cliente en la calculadora Quski Completa
 * @author Jeroham Cadenas
 * @date 18/07/2020
 * @param {string} tipoIdentificacion
 * @param {string} identificacion
 * @param tipoConsulta 
 * @param calificacion 
 */

  public getInformacionPersonaCalculadora(consulta: PersonaConsulta) {
    const serviceUrl = this.appResourcesUrl + this.urlRest + 'getInformacionPersona';
    this.params = new HttpParams().set('tipoIdentificacion', consulta.tipoIdentificacion)
      .set('identificacion', consulta.identificacion)
      .set('tipoConsulta', consulta.tipoConsulta)
      .set('calificacion', consulta.calificacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }
  /**
   * 
   * @author Jeroham Cadenas - Developer Twelve
   * @param consulta ConsultaOferta
   */
  public getInformacionOferta(consulta: ConsultaOferta) {
    console.log("INGRESA AL SERVICIO LA FECHA ES ----> " + consulta.fechaNacimiento)
    const pipe = new DatePipe('en-US');
    // let fdf = null;
    // let fdff = new Date(consulta.fechaNacimiento);
    // fdff.setMinutes(fdff.getMinutes() + fdff.getTimezoneOffset());
    let fechaNacimiento = new Date(consulta.fechaNacimiento);
    const strigFecha = pipe.transform(fechaNacimiento, 'dd/MM/yyyy');
    console.log("INGRESA AL SERVICIO LA FECHA ES ----> " + strigFecha);

    const serviceUrl = this.appResourcesUrl + 'integracionRestController/getInformacionOferta';

    this.params = new HttpParams()
      .set('perfilRiesgo', consulta.perfilRiesgo.toString())
      .set('origenOperacion', consulta.origenOperacion)
      .set('riesgoTotal', consulta.riesgoTotal.toString())
      .set('fechaNacimiento', strigFecha)
      .set('perfilPreferencia', consulta.perfilPreferencia)
      .set('agenciaOriginacion', consulta.agenciaOriginacion)
      .set('identificacionCliente', consulta.identificacionCliente)
      .set('calificacionMupi', consulta.calificacionMupi)
      .set('coberturaExcepcionada', consulta.coberturaExcepcionada.toString())
      .set('tipoJoya', consulta.tipoJoya)
      .set('descripcion', consulta.descripcion)
      .set('estadoJoya', consulta.estadoJoya)
      .set('tipoOroKilataje', consulta.tipoOroKilataje)//tomo del combo
      .set('pesoGr', consulta.pesoGr.toString())
      .set('tienePiedras', consulta.tienePiedras)
      .set('detallePiedras', consulta.detallePiedras)
      .set('descuentoPesoPiedras', consulta.descuentoPesoPiedras.toString())
      .set('pesoNeto', consulta.pesoNeto.toString())
      .set('precioOro', consulta.precioOro.toString())
      .set('valorAplicableCredito', consulta.valorAplicableCredito.toString())
      .set('valorRealizacion', consulta.valorRealizacion.toString())
      .set('numeroPiezas', consulta.numeroPiezas.toString())
      .set('descuentoSuelda', consulta.descuentoSuelda.toString());
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }

}