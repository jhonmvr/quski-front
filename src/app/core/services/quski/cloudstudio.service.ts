import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConsultaCliente } from '../../../core/model/cloudstudio/ConsultaCliente';
import { CrearCliente } from '../../model/cloudstudio/CrearCliente';
import { EditarCliente } from '../../model/cloudstudio/EditarCliente';
import { TablaAmortizacion } from '../../model/cloudstudio/TablaAmortizacion';
import { SimulacionPrecancelacion } from '../../model/cloudstudio/SimulacionPrecancelacion';

export interface Operacion {
  numeroOperacion: number;
}
export interface Cliente {
  idTipoIdentificacion: number;
  identificacion : number;
}
export interface Solca {
  codigoTablaAmortizacionQuski: string;
  montoSolicitado : number;
  codigoTipoPrestamo : number;
}


@Injectable({
  providedIn: 'root'
})
export class CloudstudioService extends BaseService {

  urlRestCliente  = "api/cliente/";
  urlRestPrestamo = "api/prestamo/";
  urlRestCatalogo = "api/catalogo/";
  urlRestCredito = "api/credito/";
  appResourcesUrlLocal = "http://201.183.238.73:1991/";
  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();

  }

  // CLIENTES 
  consultarClienteCS( consultaCliente : ConsultaCliente ) {
    this.setHeaderWithAccess();
    const serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + 'consultar';
    const wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    console.log(JSON.stringify( this.headers.keys() ) );
    console.log(JSON.stringify( consultaCliente ))
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultarReferenciasClienteCS( consultaCliente : ConsultaCliente) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "referencia" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultarIngresosEgresosClienteCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "ingresosegresos" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultarDireccionesTelefonosClienteCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "direcciontelefono" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  crearClienteCS( crearCliente : CrearCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "crear" ;
    let wrapper =  crearCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  editarClienteCS( editarCliente : EditarCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "editar" ;
    let wrapper =  editarCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 

  //CATALOGOS
  consultarAgenciasCS() {
    this.setHeaderWithAccess();
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "agencia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  } 
  consultarAsesoresCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "asesor" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultarActividadEconomicaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "actividadeconomica" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarEducacionCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "educacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarSectorViviendaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "sectorvivienda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarEstadosCivilesCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "estadocivil" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarViviendaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "vivienda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarProfesionesCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "profesion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarTipoIdentificacionCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tipoidentificacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarBancosCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "bancos" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarTipoReferenciaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tiporeferencia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarTipoPrestamosCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tipoprestamo" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarTipoCarteraCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tipocartera" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarTablaAmortizacionCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tablaamortizacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarDivicionPoliticaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "divisionpolitica" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  consultarDivicionPoliticaConsolidadaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "divisionpoliticaconsolidado" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }

  //PRESTAMOS
  simularTablaAmortizacionCS( tablaAmortizacion : TablaAmortizacion ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "tablaamortizacionpresuntiva" ;
    let wrapper =  tablaAmortizacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultaTablaAmortizacionOperacionAprobadaCS( numeroOperacion : number ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/tablaamortizacion" ;
    let operacion : Operacion;
    operacion.numeroOperacion = numeroOperacion;
    let wrapper =  operacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultaOperacionCS( idTipoidentificacion : number, identificacion : number ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/consulta" ;
    let cliente : Cliente;
    cliente.idTipoIdentificacion = idTipoidentificacion;
    cliente.identificacion = identificacion;
    let wrapper =  cliente;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultaRiesgoAcumuladoCS( idTipoidentificacion : number, identificacion : number ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/riesgoacumulado" ;
    let cliente : Cliente;
    cliente.idTipoIdentificacion = idTipoidentificacion;
    cliente.identificacion = identificacion;
    let wrapper =  cliente;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  consultaRubrosCS( numeroOperacion : number ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/rubro" ;
    let operacion : Operacion;
    operacion.numeroOperacion = numeroOperacion;
    let wrapper =  operacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  
  simularPrecancelacionCS( simulacionPrecancelacion : SimulacionPrecancelacion ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "simularprecancelacion" ;
    let wrapper =  simulacionPrecancelacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  //CREDITOS
  operacionAprobarCS( numeroOperacion : number ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "operacion/aprobar" ;
    let operacion : Operacion;
    operacion.numeroOperacion = numeroOperacion;
    let wrapper =  operacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  operacionNegarCS( numeroOperacion : number ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "operacion/negar" ;
    let operacion : Operacion;
    operacion.numeroOperacion = numeroOperacion;
    let wrapper =  operacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  calcularSolcaCS( codigoTablaAmortizacionQuski : string, montoSolicitado : number, codigoTipoPrestamo : number  ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "operacion/negar" ;
    let solca : Solca;
    solca.codigoTablaAmortizacionQuski = codigoTablaAmortizacionQuski;
    solca.codigoTipoPrestamo = montoSolicitado;
    solca.montoSolicitado = codigoTipoPrestamo
    let wrapper =  solca;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 

}