import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConsultaCliente } from '../../model/softbank/ConsultaCliente';
import { CrearCliente } from '../../model/softbank/CrearCliente';
import { EditarCliente } from '../../model/softbank/EditarCliente';
import { SimulacionPrecancelacion } from '../../model/softbank/SimulacionPrecancelacion';
import { OperacionCancelar } from '../../model/softbank/OperacionCancelar';
import { OperacionAbono } from '../../model/softbank/OperacionAbono';
import { SimulacionTablaAmortizacion } from '../../model/softbank/SimulacionTablaAmortizacion';
import { ConsultaSolca } from '../../model/softbank/ConsultaSolca';
import { OperacionRenovar } from '../../model/softbank/OperacionRenovar';
import { ClienteSoftbank } from '../../model/softbank/ClienteSoftbank';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ReNoticeService } from '../re-notice.service';
import { OperacionAprobar } from '../../model/softbank/OperacioAprobar';
@Injectable({
  providedIn: 'root'
})
export class SoftbankService extends BaseService {

  urlRestCliente  = "api/cliente/";
  urlRestPrestamo = "api/prestamo/";
  urlRestCatalogo = "api/catalogo/";
  urlRestCredito = "api/credito/";
  constructor(_http: HttpClient,
    private dialog: MatDialog) {
    super();
    this.http = _http;
    this.setParameter();

  }


  fechasistema( idAgencia ) {
    const serviceUrl = this.softBaseBankUrl +'api/general/consulta/fechasistema';
    const wrapper = { idAgencia : idAgencia } ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  
  /**
   * ******************************* @CLIENTES 
   */
  consultarClienteCS( consultaCliente : ConsultaCliente ) {
    const serviceUrl = this.softBaseBankUrl + this.urlRestCliente + 'consultar';
    const wrapper = consultaCliente ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public traerCatalogos() {
    let serviceUrl = this.appResourcesUrl + "softbankClienteRestController/traerCatalogos";
    this.options = { Headers: this.headers };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public buscarCreditos( wrapper: any ) {
    let serviceUrl = this.softBaseBankUrl + 'api/prestamo/operacion/consultaGlobal';
    let headers = new HttpHeaders().set("Content-Type", "application/json")
    .set("Accept", "application/json");
    this.options = {Headers: headers };
    let x = this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
        console.log("peticion===>>",x) // Revisar Busqueda;
    return x;
  }
  public buscarCreditoEstado( wrapper: any ) {
    let serviceUrl = this.softBaseBankUrl + 'api/prestamo/operacion/consultaglobalestados';
    let headers = new HttpHeaders().set("Content-Type", "application/json")
    .set("Accept", "application/json");
    this.options = {Headers: headers };
    let x = this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
        console.log("peticion===>>",x) // Revisar Busqueda;
    return x;
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar cliente Softbank
   * @param ConsultaCliente
   */
  consultarClienteSoftbankCS( consultaCliente : ClienteSoftbank ) {
    const serviceUrl = this.softBaseBankUrl + this.urlRestCliente + 'consultar';
    const wrapper = consultaCliente ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar referencias del cliente
   * @param ConsultaCliente 
   */
  consultarReferenciasClienteCS( consultaCliente : ConsultaCliente) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCliente + "referencia" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar ingresos y egresos del cliente
   * @param ConsultaCliente 
  */
  consultarIngresosEgresosClienteCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCliente + "ingresosegresos" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consultar telefonos y direcciones del cliente
   * @param ConsultaCliente 
  */
  consultarDireccionesTelefonosClienteCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCliente + "direcciontelefono" ;
    let wrapper =  consultaCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Crear cliente en Softbank.
   * @param crearCliente 
   */
  crearClienteCS( crearCliente : CrearCliente ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCliente + "crear" ;
    let wrapper =  crearCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Editar cliente en Softbank.
   * @param editarCliente 
   */
  editarClienteCS( editarCliente : EditarCliente ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCliente + "editar" ;
    let wrapper =  editarCliente 
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 

  /**
   *  ****************************** @CATALOGOS
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Agencias
   */
  consultarAgenciasCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "agencia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   *  ****************************** @CATALOGOS
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos periodoDiferimiento
   */
  consultarperiodoDiferimientoCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "periodoDiferimiento" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos gradointeres
   */
  consultarGradoInteresCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "gradointeres" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipofunda
   */
  consultarTipoFundaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipofunda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
   /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipofunda
   */
  consultarEstadoOperacionQuskiCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "estadooperacionquski" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos pais
   */
  public consultarPaisCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "pais" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos ocupacion
   */
  consultarOcupacionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "ocupacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  consultarMotivoVisita() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "motivovisita" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  consultarOrigenIngresoCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "origenIngreso" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipodireccion
   */
  consultarTipoDireccionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipodireccion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipotelefono
   */
  consultarTipoTelefonoCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipotelefono" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos impcom
   */
  consultarImpComCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "impcom" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipojoya
   */
  consultarTipoJoyaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipojoya" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos estadojoya
   */
  consultarEstadoJoyaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "estadojoya" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos estadoproceso
   */
  consultarEstadoProcesoCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "estadoproceso" ;
    let wrapper =  {};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos estadoubicacion
   */
  consultarEstadoUbicacionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "estadoubicacion" ;
    let wrapper =  {};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipooro
   */
  consultarTipoOroCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipooro" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipocobertura
   */
  consultarTipoCoberturaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipocobertura" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipocliente
   */
  consultarTipoClienteCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipocliente" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }    
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos sexo
   */
  consultarGeneroCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "sexo" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos firmanteoperacion
   */
  consultarFirmanteOperacionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "firmanteoperacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
   /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipovivienda
   */
  consultarTipoViviendaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipovivienda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos tipopago
   */
  consultarTipoPagoCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipopago" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos formapago
   */
  consultarFormaPagoCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "formapago" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos motivodevolucionaprobacion
   */
  consultarMotivoDevolucionAprobacionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "motivodevolucionaprobacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Oscar Romero - Developer five
   * @description Catalogos actividadeconomicamupi
   */
  consultarActividadEconomicaMupiCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "actividadeconomicamupi" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
   /**
   * @author Oscar Romero - Developer five
   * @description Catalogos motivodevoluciongarantia
   */
  consultarMotivoDevolucionGarantiaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "motivodevoluciongarantia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos de asesores por agencia
   * @param idAgencia 
   */
  consultarAsesoresCS(x) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "asesor" ;
    let wrapper =  {roles:x};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Rubros de prestamos
   */
  consultarRubroPrestamosCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "rubro" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Actividad Economica
   */
  public consultarActividadEconomicaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "actividadeconomica" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Educacion
   */
  consultarEducacionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "educacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Sector vivienda
   */
  consultarSectorViviendaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "sectorvivienda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Estado Civil
   */
  consultarEstadosCivilesCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "estadocivil" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /*consultarViviendaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "vivienda" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }*/
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Profesiones
   */
  consultarProfesionesCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "profesion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo Identificacion
   */
  consultarTipoIdentificacionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipoidentificacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Bancos
   */
  consultarBancosCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "banco" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo Referencia
   */
  consultarTipoReferenciaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tiporeferencia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  consultarCargoOcupacion() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "cargoocupacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo Prestamo
   */
  consultarTipoPrestamosCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipoprestamo" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipo de Carteras
   */
  consultarTipoCarteraCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tipocartera" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Tipos de tablas de amortizacion
   */
  consultarTablaAmortizacionCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "tablaamortizacion" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Divisiones politicas
   */
  consultarDivicionPoliticaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "divisionpolitica" ;
    let wrapper =  {};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Catalogos Diviciones politicas con relaciones
   */
  consultarDivicionPoliticabyIdPais(idPais,esLugarNacimiento) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "divisionpolitica" ;
    let wrapper =  {
      "idpais":idPais,
      "esLugarNacimiento":esLugarNacimiento?true:false
    };
    if(esLugarNacimiento){
      
    }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
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
    let serviceUrl = this.softBaseBankUrl + this.urlRestPrestamo + "operacion/tablaamortizacion" ;
    let wrapper =  {numeroOperacion} ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Simular una precancelacion de una operacion existente
   * @param simulacionPrecancelacion 
   */
  simularPrecancelacionCS( simulacionPrecancelacion : SimulacionPrecancelacion ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestPrestamo + "simularprecancelacion" ;
    let wrapper =  simulacionPrecancelacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Cancela una operacion en proceso
   * @param operacionCancelar 
   */
  operacionCancelarCS( operacionCancelar : OperacionCancelar ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestPrestamo + "operacion/cancelar" ;
    let wrapper = operacionCancelar;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Abona un monto a una operacion existente
   * @param operacionAbono 
   */
  operacionAbonoCS( operacionAbono : OperacionAbono ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestPrestamo + "operacion/abono" ;
    let wrapper = operacionAbono;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  /**
   * Consulta las operaciones activas del cliente
   * @param consultaCliente 
   */
  operacionConsultaCS( consultaCliente : ClienteSoftbank ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestPrestamo + "operacion/consulta" ;
    let wrapper =  consultaCliente;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consulta el riesgo acumulado del cliente
   * @param consultaCliente 
   */
  consultaRiesgoAcumuladoCS( consultaCliente : ConsultaCliente ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestPrestamo + "operacion/riesgoacumulado" ;
    let wrapper =  consultaCliente;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Consulta los rubros de una operacion.
   * @param numeroOperacion 
   */
  consultaRubrosCS( numeroOperacion : string ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestPrestamo + "operacion/rubro" ;
    let wrapper = {numeroOperacion};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
  public consultarEtniaCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "etnia" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  public consultarSupervisoresCS() {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "supervisores" ;
    let wrapper =  "";
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  public consultarAgenciasPorSupervisorCS(nombre) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCatalogo + "agenciasporsupervisor" ;
    let wrapper =  {'nombre':nombre};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /** 
   * ************************************* @CREDITOS_OPERACION
   */
 /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Crea una operacion nueva.
   * @param operacionCrear 
   */
  /*  operacionCrearCS( operacionCrear : OperacionCrear ) {
    let serviceUrl = this.appResourcesUrl + "creditoNegociacionRestController/crearOperacion" ;
    let wrapper =  operacionCrear;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
  }  */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Renova una operacion existente.
   * @param operacionRenovar 
   */
  operacionRenovarCS( operacionRenovar : OperacionRenovar ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCredito + "operacion/renovar" ;
    let wrapper =  operacionRenovar;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Aprueba una operacion pendiente de ser aprobada.
   * @param numeroOperacion 
   */
  operacionAprobarCS( wrapper: OperacionAprobar ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCredito + "operacion/aprobar" ;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Niega una operacion pendiente de ser aprobada.
   * @param numeroOperacion 
   */
  operacionNegarCS( numeroOperacion : string ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCredito + "operacion/negar" ;
    let wrapper =  {numeroOperacion};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
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
    let serviceUrl = this.softBaseBankUrl + this.urlRestCredito + "simulacion/tablaamortizacion" ;
    let wrapper =  simulacionTablaAmortizacion;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
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
    let serviceUrl = this.softBaseBankUrl + this.urlRestCredito + "calcular/solca" ;
    let wrapper =  consultaSolca;
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 

  /**
   * ********************************@habilitantes
   */
  /**
   * @author Jeroham Cadenas - Developer Twelve
   * @description Simula una tabla de amortizacion
   * @param simulacionTablaAmortizacion 
   */
  descargarHabilitanteCredito( codigoCredito ) {
    let serviceUrl = this.softBaseBankUrl + this.urlRestCredito + "operacion/habilitante" ;
    let wrapper =  {numeroOperacion:codigoCredito};
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 

  consultaAbonos( numeroOperacion,cuota ) {
    let serviceUrl = this.softBaseBankUrl + "api/prestamo/operacion/abono/consulta" ;
    let wrapper =  {
      "numeroOperacion":numeroOperacion,
      "cuotas":[cuota]
    }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  } 

  garantiasByOperacionMadre(codigoOperacionMadre){
    let serviceUrl = this.softBaseBankUrl + "/api/garantia/consulta/operacion" ;
    let wrapper =  {
      "numeroOperacionMadre":codigoOperacionMadre
    }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  resumenOperacion(operaciones){
    let serviceUrl = this.softBaseBankUrl + "/api/prestamo/operacion/resumenestado" ;
    let wrapper =  {
      "numerosOperaciones":operaciones
    }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  impComByOperacion(operacion){
    let serviceUrl = this.softBaseBankUrl + "/api/prestamo/operacion/rubro/creacion" ;
    let wrapper =  {
      "numeroOperacion":operacion
    }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }


  traerCreditoIndividualSaldos(operacion: any) {
    let serviceUrl = this.softBaseBankUrl + "/api/prestamo/operacion/consultaIndividualsaldos" ;
    let wrapper =  {
      "numeroOperacion":operacion
    }
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl,wrapper,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

}