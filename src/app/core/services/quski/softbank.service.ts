import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConsultaCliente } from '../../model/softbank/ConsultaCliente';
import { CrearCliente } from '../../model/softbank/CrearCliente';
import { EditarCliente } from '../../model/softbank/EditarCliente';
import { SimulacionPrecancelacion } from '../../model/softbank/SimulacionPrecancelacion';
import { OperacionCancelar } from '../../model/softbank/OperacionCancelar';
import { OperacionAbono } from '../../model/softbank/OperacionAbono';
import { OperacionCrear } from '../../model/softbank/OperacionCrear';
import { SimulacionTablaAmortizacion } from '../../model/softbank/SimulacionTablaAmortizacion';
import { ConsultaSolca } from '../../model/softbank/ConsultaSolca';
import { OperacionRenovar } from '../../model/softbank/OperacionRenovar';

@Injectable({
  providedIn: 'root'
})
export class SoftbankService extends BaseService {

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

  /**
   * ******************************* @CLIENTES 
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar cliente Softbank
   * @param ConsultaCliente
   */
  consultarClienteCS( consultaCliente : ConsultaCliente ) {
    const serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + 'consultar';
    const wrapper = consultaCliente ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar referencias del cliente
   * @param ConsultaCliente 
   */
  consultarReferenciasClienteCS( consultaCliente : ConsultaCliente) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "referencia" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar ingresos y egresos del cliente
   * @param ConsultaCliente 
  */
  consultarIngresosEgresosClienteCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "ingresosegresos" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar telefonos y direcciones del cliente
   * @param ConsultaCliente 
  */
  consultarDireccionesTelefonosClienteCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "direcciontelefono" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Crear cliente en Softbank.
   * @param crearCliente 
   */
  crearClienteCS( crearCliente : CrearCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "crear" ;
    let wrapper =  crearCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Editar cliente en Softbank.
   * @param editarCliente 
   */
  editarClienteCS( editarCliente : EditarCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCliente + "editar" ;
    let wrapper =  editarCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 

  /**
   *  ****************************** @CATALOGOS
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Agencias
   */
  consultarAgenciasCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "agencia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos de asesores por agencia
   * @param idAgencia 
   */
  consultarAsesoresCS( idAgencia : number ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "asesor" ;
    let wrapper =  {idAgencia};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Rubros de prestamos
   */
  consultarRubroPrestamosCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "rubro" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Actividad Economica
   */
  consultarActividadEconomicaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "actividadeconomica" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Educacion
   */
  consultarEducacionCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "educacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Sector vivienda
   */
  consultarSectorViviendaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "sectorvivienda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Estado Civil
   */
  consultarEstadosCivilesCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "estadocivil" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Vivienda
   */
  consultarViviendaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "vivienda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Profesiones
   */
  consultarProfesionesCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "profesion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo Identificacion
   */
  consultarTipoIdentificacionCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tipoidentificacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Bancos
   */
  consultarBancosCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "bancos" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo Referencia
   */
  consultarTipoReferenciaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tiporeferencia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo Prestamo
   */
  consultarTipoPrestamosCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tipoprestamo" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo de Carteras
   */
  consultarTipoCarteraCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tipocartera" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipos de tablas de amortizacion
   */
  consultarTablaAmortizacionCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "tablaamortizacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Divisiones politicas
   */
  consultarDivicionPoliticaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "divisionpolitica" ;
    let wrapper =  {};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Diviciones politicas con relaciones
   */
  consultarDivicionPoliticaConsolidadaCS() {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCatalogo + "divisionpoliticaconsolidado" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }

  /**
   * *******************************@PRESTAMOS
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consulta de ta tabla de amortizacion de una operacion existente
   * @param numeroOperacion 
   */
  consultaTablaAmortizacionOperacionAprobadaCS( numeroOperacion : string ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/tablaamortizacion" ;
    let wrapper =  {numeroOperacion} ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Simular una precancelacion de una operacion existente
   * @param simulacionPrecancelacion 
   */
  simularPrecancelacionCS( simulacionPrecancelacion : SimulacionPrecancelacion ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "simularprecancelacion" ;
    let wrapper =  simulacionPrecancelacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Cancela una operacion en proceso
   * @param operacionCancelar 
   */
  operacionCancelarCS( operacionCancelar : OperacionCancelar ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/cancelar" ;
    let wrapper = operacionCancelar;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Abona un monto a una operacion existente
   * @param operacionAbono 
   */
  operacionAbonoCS( operacionAbono : OperacionAbono ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/abono" ;
    let wrapper = operacionAbono;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  }
  /**
   * Consulta las operaciones activas del cliente
   * @param consultaCliente 
   */
  operacionConsultaCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/consulta" ;
    let wrapper =  consultaCliente;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consulta el riesgo acumulado del cliente
   * @param consultaCliente 
   */
  consultaRiesgoAcumuladoCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/riesgoacumulado" ;
    let wrapper =  consultaCliente;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consulta los rubros de una operacion.
   * @param numeroOperacion 
   */
  consultaRubrosCS( numeroOperacion : string ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestPrestamo + "operacion/rubro" ;
    let wrapper = {numeroOperacion};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /** 
   * ************************************* @CREDITOS_OPERACION
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Crea una operacion nueva.
   * @param operacionCrear 
   */
  operacionCrearCS( operacionCrear : OperacionCrear ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "operacion/crear" ;
    let wrapper =  operacionCrear;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Renova una operacion existente.
   * @param operacionRenovar 
   */
  operacionRenovarCS( operacionRenovar : OperacionRenovar ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "operacion/renovar" ;
    let wrapper =  operacionRenovar;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Aprueba una operacion pendiente de ser aprobada.
   * @param numeroOperacion 
   */
  operacionAprobarCS( numeroOperacion : string ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "operacion/aprobar" ;
    let wrapper =  {numeroOperacion};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Niega una operacion pendiente de ser aprobada.
   * @param numeroOperacion 
   */
  operacionNegarCS( numeroOperacion : string ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "operacion/negar" ;
    let wrapper =  {numeroOperacion};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * ********************************@CREDITO_SIMULACION
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Simula una tabla de amortizacion
   * @param simulacionTablaAmortizacion 
   */
  simularTablaAmortizacionCS( simulacionTablaAmortizacion : SimulacionTablaAmortizacion ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "simulacion/tablaamortizacion" ;
    let wrapper =  simulacionTablaAmortizacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
  /**
   * ********************************@CREDITO_CONSULTA
   */

  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consulta el impuesto solca
   * @param consultaSolca 
   */
  calcularSolcaCS( consultaSolca : ConsultaSolca ) {
    let serviceUrl = this.appResourcesUrlLocal + this.urlRestCredito + "calcular/solca" ;
    let wrapper =  consultaSolca;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options);
  } 
}