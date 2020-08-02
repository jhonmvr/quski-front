import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PersonaConsulta } from '../../model/calculadora/personaConsulta';

@Injectable({
  providedIn: 'root'
})
export class IntegracionService extends BaseService {

  urlRest  = "integracionRestController/";
  constructor(_http: HttpClient) {
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

  public getInformacionPersonaCalculadora( consulta : PersonaConsulta ) {
    const serviceUrl =  this.appResourcesUrl + this.urlRest +'getInformacionPersona';
    this.params = new HttpParams().set('tipoIdentificacion', consulta.tipoIdentificacion)
      .set('identificacion', consulta.identificacion)
      .set('tipoConsulta', consulta.tipoConsulta)
      .set('calificacion', consulta.calificacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }
  /**
   * 
   * @author Jeroham Cadenas - Developer Twelve
   * @param identificacionCliente string
   * @param kilotaje string
   * @param fechaNacimiento string
   */
  public getInformacionOferta(identificacionCliente: string, kilotaje: string, fechaNacimiento: Date, origenOperacion: string, coberturaExcepcionada: number) {
    let pipe = new DatePipe('en-US');
    let fdf = null;
    let fdff = new Date(fechaNacimiento);
    fdff.setMinutes(fdff.getMinutes() + fdff.getTimezoneOffset());
    fdf = pipe.transform(fdff, 'dd/MM/yyyy');
    console.log("INGRESA AL SERVICIO LAFECHA ES " + fdf)
    const serviceUrl = this.appResourcesUrl + 'integracionRestController/getInformacionOferta';





    this.params = new HttpParams()
        .set('perfilRiesgo', "1")
        
        .set('origenOperacion', origenOperacion)
        .set('riesgoTotal', "0.00")
        .set('fechaNacimiento', fdf)
        .set('perfilPreferencia', "B")
        .set('agenciaOriginacion', "020")
        .set('identificacionCliente', identificacionCliente)
        .set('calificacionMupi', "S")
        .set('coberturaExcepcionada', coberturaExcepcionada.toString())
        .set('tipoJoya', "ANI")
        .set('descripcion', "BUEN ESTADO")
        .set('estadoJoya', "BUE")
        .set('tipoOroKilataje', kilotaje)//tomo del combo
        .set('pesoGr',"7.73")
        .set('tienePiedras', "s")
        .set('detallePiedras', "PIEDRAS")
        .set('descuentoPesoPiedras', "0.73")
        .set('pesoNeto', "7.00")
        .set('precioOro', "263.72")
        .set('valorAplicableCredito', "293.02")
        .set('valorRealizacion', '232.07')
        .set('numeroPiezas',"1")
        .set('descuentoSuelda', "0.00");
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
}
}