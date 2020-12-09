import { SolicitudAutorizacionDialogComponent } from './../../../../partials/custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { SolicitudDeExcepcionesComponent } from './../../../../partials/custom/popups/solicitud-de-excepciones/solicitud-de-excepciones.component';
import { ErrorCargaInicialComponent } from './../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { ListaExcepcionesComponent } from './../../../../partials/custom/popups/lista-excepciones/lista-excepciones.component';
import { VerCotizacionesComponent } from './../../../../partials/custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { CalculadoraEntradaWrapper } from './../../../../../core/model/wrapper/CalculadoraEntradaWrapper';
import { DataInjectExcepciones } from './../../../../../core/model/wrapper/DataInjectExcepciones';
import { TbQoCreditoNegociacion } from './../../../../../core/model/quski/TbQoCreditoNegociacion';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { NegociacionService } from './../../../../../core/services/quski/negociacion.service';
import { CalculadoraService } from './../../../../../core/services/quski/calculadora.service';
import { ConsultaPrecioJoya } from './../../../../../core/model/wrapper/ConsultaPrecioJoya';
import { NegociacionWrapper } from './../../../../../core/model/wrapper/NegociacionWrapper';
import { ParametroService } from './../../../../../core/services/quski/parametro.service';
import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { TasacionService } from './../../../../../core/services/quski/tasacion.service';
import { RelativeDateAdapter } from './../../../../../core/util/relative.dateadapter';
import { GarantiaWrapper } from './../../../../../core/model/wrapper/GarantiaWrapper';
import { EstadoExcepcionEnum } from './../../../../../core/enum/EstadoExcepcionEnum';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { environment } from '../../../../../../../src/environments/environment';
import { MatDialog, MatTableDataSource, MatStepper } from '@angular/material';
import { TbQoTasacion } from './../../../../../core/model/quski/TbQoTasacion';
import { YearMonthDay } from './../../../../../core/model/quski/YearMonthDay';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { SelectionModel } from '@angular/cdk/collections';

import { ValidateDecimal } from '../../../../../core/util/validator.decimal';
//import { DataTableDataSource } from 'src/app/views/partials/content/widgets/general/data-table/data-table.data-source';

@Component({
  selector: 'kt-gestion-negociacion',
  templateUrl: './gestion-negociacion.component.html',
  styleUrls: ['./gestion-negociacion.component.scss']
})
export class GestionNegociacionComponent implements OnInit {
  // VARIABLES PUBLICAS
  selection = new SelectionModel<any>(true, []);
  public loading;
  public usuario: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  // ENTIDADES
  private negoW: NegociacionWrapper = null;
  public componenteVariable: boolean;
  public componenteRiesgo: boolean;
  // CATALOGOS
  public catPublicidad: Array<any> = ["--"];
  public catTipoJoya: Array<any>;
  public catTipoOro: Array<any>;
  public catEstadoJoya: Array<any>;
  catPais;
  filteredPais: Observable<Pais[]>;
  public totalNumeroJoya: number;
  public totalPesoB: number;
  public totalPesoN: number;
  public totalValorA: number;
  public totalValorR: number;
  public totalValorC: number;
  public totalValorO: number;

  opcionCredito;

  // FORMULARIO BUSQUEDA
  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  // FORMULARIO CLIENTE
  public formDatosCliente: FormGroup = new FormGroup({});
  public cedula = new FormControl('', []);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public publicidad = new FormControl('', [Validators.required]);
  public fechaDeNacimiento = new FormControl('', []);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', []);
  public aprobacionMupi = new FormControl('', [Validators.required]);
  // FORMULARIO TASACION
  public formTasacion: FormGroup = new FormGroup({});
  public tipoOro = new FormControl('', [Validators.required]);
  public pesoNeto = new FormControl('', [Validators.required,ValidateDecimal,Validators.min(1)]);
  public pesoBruto = new FormControl('', [Validators.required,ValidateDecimal]);
  public numeroPiezas = new FormControl('', [Validators.required]);
  public tipoJoya = new FormControl('', [Validators.required]);
  public estado = new FormControl('', [Validators.required]);
  public descuentoPiedra = new FormControl('', [Validators.required,ValidateDecimal]);
  public descuentoSuelda = new FormControl('', [Validators.required,ValidateDecimal]);
  public valorOro = new FormControl('', [Validators.required]);
  public tienePiedras = new FormControl('', [Validators.required]);
  public detallePiedras = new FormControl('', [Validators.required]);
  public valorAplicable = new FormControl('', [Validators.required]);
  public precioOro = new FormControl('', [Validators.required]);
  public valorAvaluo = new FormControl('', []);
  public valorRealizacion = new FormControl('', []);
  public descripcion = new FormControl('', [Validators.required]);

  public formOpcionesCredito: FormGroup = new FormGroup({});
  public montoSolicitado = new FormControl('', []);

  public tbQoCliente;

  telefonoMovil;
  telefonoFijo;
  // TABLA DE TASACION
  // ---- @TODO: Crear un data source para la tabla 
  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();
  displayedColumnsTasacion = ['Accion', 'NumeroPiezas', 'TipoOro', 'PesoBruto', 'DescuentoPesoPiedra', 'DescuentoSuelda', 'PesoNeto', 'precioOro', 'ValorAvaluo', 'ValorAplicable', 'ValorRealizacion', 'valorComercial', 'tienePiedras', 'detallePiedras','TipoJoya', 'EstadoJoya', 'Descripcion',];
  private elementJoya;

  dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>();
  displayedColumnsCreditoNegociacion = ['Accion', 'plazo', 'periodoPlazo', 'periodicidadPlazo', 'montoFinanciado', 'valorARecibir', 'valorAPagar',
    'costoCustodia', 'costoFideicomiso', 'costoSeguro', 'costoTasacion', 'costoTransporte', 'costoValoracion', 'impuestoSolca',
    'formaPagoImpuestoSolca', 'formaPagoCapital', 'formaPagoCustodia', 'formaPagoFideicomiso', 'formaPagoInteres', 'formaPagoMora',
    'formaPagoGastoCobranza', 'formaPagoSeguro', 'formaPagoTasador', 'formaPagoTransporte', 'formaPagoValoracion', 'saldoInteres',
    'saldoMora', 'gastoCobranza', 'cuota', 'saldoCapitalRenov', 'montoPrevioDesembolso', 'totalGastosNuevaOperacion',
    'totalCostosOperacionAnterior', 'custodiaDevengada', 'formaPagoCustodiaDevengada', 'tipooferta', 'porcentajeflujoplaneado',
    'dividendoflujoplaneado', 'dividendosprorrateoserviciosdiferido'];


  constructor(
    private sof: SoftbankService,
    private par: ParametroService,
    private pro: ProcesoService,
    private cal: CalculadoraService,
    private neg: NegociacionService,
    private tas: TasacionService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService
  ) {
    
    //  RELACIONANDO FORMULARIO DE BUSQUEDA
    this.formBusqueda.addControl("identificacion", this.identificacion);
    //  RELACIONANDO FORMULARIO DE CLIENTE
    this.formDatosCliente.addControl("cedula", this.cedula);
    this.formDatosCliente.addControl("fechaNacimiento", this.fechaDeNacimiento);
    this.formDatosCliente.addControl("nombresCompletos", this.nombresCompletos);
    this.formDatosCliente.addControl("edad", this.edad);
    this.formDatosCliente.addControl("nacionalidad", this.nacionalidad);
    this.formDatosCliente.addControl("movil", this.movil);
    this.formDatosCliente.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formDatosCliente.addControl("email", this.email);
    this.formDatosCliente.addControl("campania", this.campania);
    this.formDatosCliente.addControl("publicidad", this.publicidad);
    this.formDatosCliente.addControl("aprobacionMupi", this.aprobacionMupi);
    //  RELACIONANDO FORMULARIO DE TASACION
    this.formTasacion.addControl("numeroPiezas", this.numeroPiezas);
    this.formTasacion.addControl("tipoOro", this.tipoOro);
    this.formTasacion.addControl("tipoJoya", this.tipoJoya);
    this.formTasacion.addControl("estado", this.estado);
    this.formTasacion.addControl("pesoBruto", this.pesoBruto);
    this.formTasacion.addControl("descuentoPiedra", this.descuentoPiedra);
    this.formTasacion.addControl("descuentoSuelda", this.descuentoSuelda);
    this.formTasacion.addControl("descripcion", this.descripcion);
    this.formTasacion.addControl("pesoNeto", this.pesoNeto);
    this.formTasacion.addControl("valorOro", this.valorOro);
    this.formTasacion.addControl("tienePiedras", this.tienePiedras);
    this.formTasacion.addControl("detallePiedras", this.detallePiedras);
    //this.formTasacion.addControl("valorAplicable", this.valorAplicable);
    //this.formTasacion.addControl("precioOro", this.precioOro);
    //this.formTasacion.addControl("valorAvaluo", this.valorAvaluo);
    
    this.formOpcionesCredito.addControl("montoSolicitado", this.montoSolicitado);
  }

  ngOnInit() {
    this.subheaderService.setTitle('Negociación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.loadCatalogo();
    this.obtenerCatalogosCore();
    this.componenteVariable = false;
    this.componenteRiesgo = false;
    this.desactivarCampos();
    this.inicioDeFlujo();

  }


  loadCatalogo(){
   

    this.sof.consultarPaisCS().subscribe((data: any) => {
      this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      
    });
    this.sof.consultarTipoJoyaCS().subscribe((data: any) => {
      this.catTipoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      
    });
    this.sof.consultarEstadoJoyaCS().subscribe((data: any) => {
      this.catEstadoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.loadingSubject.next(false);
    });
  }
  /** ********************************************* @ENTRADA ********************* **/
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.id && json.params.origen) {
        this.myStepper.selectedIndex = 1;
        this.loadingSubject.next(true);
        if (json.params.origen == "NEG") {
          this.validarNegociacion(json.params.id);
        } else if (json.params.origen == "COT") {
          this.iniciarNegociacionFromCot(json.params.id);
        } else {
          this.salirDeGestion("Error al intentar ingresar a la Negociacion.");
        }
        this.loadingSubject.next(false);
      } 
    });
  }
  private validarNegociacion(id){
    this.neg.traerNegociacionExistente( id ).subscribe( (wrapper: any) =>{
      if(wrapper.entidad.respuesta){
        this.negoW = wrapper.entidad;
        this.validarExcepciones(this.negoW);
      }else{
        this.salirDeGestion("La negociacion que esta buscando, no existe, fue cerrada o cancelada");
      }
    });
  }
  private validarExcepciones(tmp: NegociacionWrapper){
    if(tmp.excepciones && tmp.excepciones.length > 0){
      let listPendientes: TbQoExcepcion[] = null;
      let listInPendientes: TbQoExcepcion[] = null;
      tmp.excepciones.forEach(e =>{
        if( e.estadoExcepcion == EstadoExcepcionEnum.PENDIENTE){
          listPendientes != null ? listPendientes.push(e) : listPendientes = [e];
        }else if(e.estadoExcepcion == EstadoExcepcionEnum.APROBADO){
          listInPendientes != null ? listInPendientes.push(e) : listInPendientes = [e];
        } else if(e.estadoExcepcion == EstadoExcepcionEnum.NEGADO){
          listInPendientes != null ? listInPendientes.push(e) : listInPendientes = [e];
        }else{
        this.salirDeGestion("ERROR DE DESARROLLO, EXISTE EXCEPCION SIN UN ESTADO DEFINIDO", false, "ERROR DESARROLLO");
        }
      });
      if(listPendientes != null){
        this.salirDeGestion("Esta negociacion posee una excepcion pendiente. Espere que su excepcion sea revisada y aprobada.", false, "EXCEPCION PENDIENTE ACTIVA");
      } else if( listInPendientes != null){
        this.notificarSobreExcepciones( listInPendientes );
      }else{
        this.salirDeGestion("ERROR DE DESARROLLO DESCONOCIDO", false, "ERROR DESARROLLO");
      }
    } else{
      this.cargarValores(tmp);
    }
  }
  private calcular() {
    this.totalPesoN = 0;
    this.totalPesoB = 0;
    this.totalValorR = 0;
    this.totalValorA = 0;
    this.totalValorC = 0;
    this.totalValorO = 0;
    this.totalNumeroJoya = 0
    if (this.dataSourceTasacion.data) {
      this.dataSourceTasacion.data.forEach(element => {
        this.totalPesoN = Number(this.totalPesoN) + Number(element.pesoNeto);
        this.totalPesoB = Number(this.totalPesoB) + Number(element.pesoBruto);
        this.totalValorR = Number(this.totalValorR) + Number(element.valorRealizacion);
        this.totalValorA = Number(this.totalValorA) + Number(element.valorAvaluo);
        this.totalValorC = Number(this.totalValorC) + Number(element.valorComercial);
        this.totalValorO = Number(this.totalValorO) + Number(element.valorOro);
        this.totalNumeroJoya = Number(this.totalNumeroJoya) + Number(element.numeroPiezas);
      });
    }
  }
  private iniciarNegociacionFromCot(id : number ){
    this.neg.iniciarNegociacionFromCot( id, this.usuario ).subscribe( (wrapper: any) =>{
      if (wrapper.entidad.respuesta) {
        this.negoW = wrapper.entidad;
        console.log("NEGOCIACION INICIADA POR COT-> ", wrapper.entidad);
        if (this.negoW.excepcionBre == "") {
          this.cargarValores(this.negoW);
        } else {
          this.abrirPopupExcepciones( new DataInjectExcepciones(true) );
        }
      } else {
        this.limpiarCamposBusqueda();
        this.sinNotSer.setNotice('NO SE PUDO INICIAR NEGOCIACION, CLIENTE NO ENCONTRADO EN EQUIFAX','error')
      }
    });
  }
  /** ********************************************* @PARTE_1 ********************* **/
  public buscarCliente() {
    if (this.formBusqueda.invalid) {
      this.sinNotSer.setNotice('INGRESE UN NUMERO DE CEDULA VALIDO', 'warning');
      return;
    }    
    this.loadingSubject.next(true);  
    console.log("entra a negociacion")
      this.neg.iniciarNegociacion(this.identificacion.value, this.usuario).subscribe((wrapper: any) => {
        if (wrapper.entidad.respuesta) {
          this.limpiarNegociacion();
          this.negoW = wrapper.entidad;
          this.myStepper.selectedIndex = 1;
          if (this.negoW.excepcionBre){
            this.abrirPopupExcepciones( new DataInjectExcepciones(true) );
            return;
          } 
          this.cargarValores(this.negoW);
        } else {
          //this.abrirPopupDeAutorizacion(cedula);
        }
      });
 
  }
  private iniciarNegociacionEquifax( cedula: string ){
    this.loadingSubject.next(true);
    this.neg.iniciarNegociacionEquifax( cedula, this.usuario).subscribe( (wrapper: any) =>{
      if (wrapper.entidad.respuesta) {
        this.negoW = wrapper.entidad;
        console.log("NEGOCIACION INICIADA POR EQUIFAX-> ", wrapper.entidad);
        if (this.negoW.excepcionBre == "") {
          this.myStepper.selectedIndex = 1;
          this.cargarValores(this.negoW);
        } else {
          this.abrirPopupExcepciones( new DataInjectExcepciones(true) );
        }
      } else {
        this.loadingSubject.next(false);
        this.limpiarCamposBusqueda();
        this.sinNotSer.setNotice('NO SE PUDO INICIAR NEGOCIACION, CLIENTE NO ENCONTRADO EN EQUIFAX','error')
      }
    });
  }
  private limpiarNegociacion() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formDatosCliente.controls).forEach((name) => {
      const control = this.formDatosCliente.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formOpcionesCredito.controls).forEach((name) => {
      const control = this.formOpcionesCredito.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formTasacion.controls).forEach((name) => {
      const control = this.formTasacion.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.negoW = null;
    this.componenteRiesgo = false;
    this.componenteVariable = false;
    this.dataSourceTasacion.data = null;
    this.dataSourceCreditoNegociacion.data = null;
  }
  private limpiarCamposBusqueda() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
  }
  private abrirPopupDeAutorizacion(cedula: string): any {
    this.myStepper.selectedIndex = 0;
    this.loadingSubject.next(false);
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: cedula
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log('envio de RESP ' + respuesta + ' typeof respuesta ' + typeof (respuesta));
      if (respuesta) {
        this.iniciarNegociacionEquifax(cedula);
      } else {
        this.sinNotSer.setNotice('CONSULTA EQUIFAX CANCELADA', 'error');
        this.limpiarCamposBusqueda();
      }
    });
  }
  private cargarValores(wrapper) {
    //this.catTipoOro = wrapper.tipoOro;
    this.tbQoCliente= wrapper.credito.tbQoNegociacion.tbQoCliente;
    this.cedula.setValue(this.tbQoCliente.cedulaCliente);
    this.identificacion.setValue(this.tbQoCliente.cedulaCliente);
    this.nombresCompletos.setValue(this.tbQoCliente.nombreCompleto);
    this.fechaDeNacimiento.setValue(this.tbQoCliente.fechaNacimiento);
    this.cargarEdad();
    this.nacionalidad.setValue(this.catPais.find(p=> p.id == this.tbQoCliente.nacionalidad));
    if(wrapper.telefonoMovil){
      this.movil.setValue(wrapper.telefonoMovil.numero);
      this.telefonoMovil = wrapper.telefonoMovil;
    }
    if(wrapper.telefonoDomicilio){
      this.telefonoDomicilio.setValue(wrapper.telefonoDomicilio.numero);
      this.telefonoFijo = wrapper.telefonoDomicilio;
    }
  
    
    this.email.setValue(this.tbQoCliente.email);
    this.campania.setValue('');
    this.publicidad.setValue ('');
    //this.aprobacionMupi.setValue(this.tbQoCliente.aprobacionMupi ? this.tbQoCliente.aprobacionMupi == 'SI' ? 'S' : 'N'  : null );
    this.aprobacionMupi.setValue('');
    this.componenteVariable = wrapper.variables != null ? true : false;
    this.componenteRiesgo = wrapper.riesgos != null ? true : false;
    if(wrapper.joyas != null){
      this.dataSourceCreditoNegociacion = new MatTableDataSource();
      this.dataSourceCreditoNegociacion.data.push( wrapper.credito );
      this.dataSourceTasacion.data = wrapper.joyas;
      this.calcular();
      this.sinNotSer.setNotice("NEGOCIACION -> \"" + wrapper.credito.codigo + "\" Cargada correctamente.", "success");
    }else{
      this.sinNotSer.setNotice("SE HA INICIADO UNA NEGOCIACION -> \"" + wrapper.credito.codigo + "\". ", "success");
    }
    this.loadingSubject.next(false);
  }
  public abrirPopupVerCotizacion(identificacion: string) {
    const dialogRefGuardar = this.dialog.open(VerCotizacionesComponent, {
      width: '900px',
      height: 'auto',
      data: identificacion
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
    });
  }
  /** ********************************************* @POPUP ********************* **/
  public notificarSobreExcepciones(list :TbQoExcepcion[]){
    const dialogRef = this.dialog.open(ListaExcepcionesComponent, {
      width: "700px",
      height: "auto",
      data: list
    });
    dialogRef.afterClosed().subscribe(r =>{
      console.log("LLEGUE HASTA AQUI JEJE");
    });
  }
  public abrirSalirGestion(data: any) {
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "800px",
      height: "auto",
      data: data
    });
    dialogRef.afterClosed().subscribe(r => {
      this.router.navigate(['negociacion/bandeja-operaciones']);
    });
  }
  public abrirPopupExcepciones(data: DataInjectExcepciones = null) {
    this.loadingSubject.next(false);
    if (data == null) {
      data = new DataInjectExcepciones(false, false, true);
    }
    data.mensajeBre = this.negoW.excepcionBre;
    data.idNegociacion = this.negoW.credito.tbQoNegociacion.id;
    const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
      width: '800px',
      height: 'auto',
      data: data
    });
    dialogRefGuardar.afterClosed().subscribe((result: any) => {
      console.log('envio de RESP ' + JSON.stringify(result) + ' typeof respuesta ' + typeof (result));
      if (result) {
        this.salirDeGestion('Espere respuesta del aprobador para continuar con la negociacion.', false, 'EXCEPCION SOLICITADA');
      } else {
        if (data.isCobertura) {
          this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'error');
        } else {
          this.salirDeGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION', true, 'NEGOCIACION CANCELADA');
        }
      }
    });
  }
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  private salirDeGestion(dataMensaje: string, cancelar: boolean = false, dataTitulo?: string) {
    let pData = {
      mensaje: dataMensaje,
      titulo: dataTitulo ? dataTitulo : null
    }
    if (cancelar) {
      this.pro.cancelarNegociacion(this.negoW.credito.tbQoNegociacion.id, this.usuario).subscribe((data: any) => {
        if (data.entidad) {
          this.abrirSalirGestion(pData);
        } else {
          this.sinNotSer.setNotice("Error cancelando la negociacion.", 'error')
        }
      });
    } else {
      this.abrirSalirGestion(pData);
    }
  } 
  private limpiarCamposTasacion() {
    Object.keys(this.formTasacion.controls).forEach((name) => {
      const control = this.formTasacion.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
  }
  public getErrorMessage(pfield: string) { //@TODO: Revisar campos 
    const errorRequerido = 'Ingresar valores';
    const errorNumero = 'Ingresar solo numeros'; 
    const maximo = "El maximo de caracteres es: ";
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    if (pfield && pfield === "identificacion") {
      const input = this.formBusqueda.get("identificacion");
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalid-identification")
            ? invalidIdentification
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : input.hasError("minlength")
                ? errorInsuficiente
                : "";
    }
    if (pfield && pfield === 'nombresCompletos') {
      const input = this.nombresCompletos;
      return input.hasError('required') ? errorRequerido : '';
    }

    if (pfield && pfield === 'fechaDeNacimiento') {
      const input = this.fechaDeNacimiento;
      return input.hasError('required') ? errorRequerido : '';
    }

    if (pfield && pfield === 'nacionalidad') {
      const input = this.nacionalidad;
      return input.hasError('required') ? errorRequerido : '';
    }

    if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formDatosCliente.get('telefonoDomicilio');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    }

    if (pfield && pfield == "email") {
      const input = this.email;
      return input.hasError('required') ? errorRequerido : this.email.hasError('email') ? 'E-mail no valido' : this.email.hasError('maxlength') ? maximo + this.email.errors.maxlength.requiredLength : '';
    }
    if (pfield && pfield == "aprobacionMupi") {
      const input = this.email;
      return input.hasError('required') ? errorRequerido :  '';
    }

    if (pfield && pfield === 'movil') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : input.hasError('pattern') ? errorNumero : input.hasError('maxlength') ? errorLogitudExedida : input.hasError('minlength') ? errorInsuficiente : '';
    }

    if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formDatosCliente.get('telefonoDomicilio');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    }

    if (pfield && pfield === 'tipoOro') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'numeroPiezas') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'pesoBruto') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'descuentoPiedra') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'descuentoSuelda') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'pesoNeto') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'tipoJoya') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'estado') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'tienePiedras') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'detallePiedras') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'descripcion') {
      const input = this.movil;
      return input.hasError('required') ? errorRequerido : '';
    }

  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  private desactivarCampos(){
    this.edad.disable();
    this.cedula.disable();
  }
  public cargarEdad(){
    if(this.fechaDeNacimiento.valid){
      const fechaSeleccionada = new Date(this.fechaDeNacimiento.value);
      const convertFechas = new RelativeDateAdapter();
      this.par.getDiffBetweenDateInicioActual(convertFechas.format(fechaSeleccionada, "input"), "dd/MM/yyy").subscribe((rDiff: any) => {
        const diff: YearMonthDay = rDiff.entidad;
        this.edad.setValue( diff.year );
      });
    }
  }
  /** ********************************************* @CATALOGOS ********************* **/
  private obtenerCatalogosCore() {
    this.par.findByNombreTipoOrdered("", "PUB", "Y").subscribe((data: any) => {
      if (data && data.entidades) {
        data.entidades.forEach(element => {
          this.catPublicidad.push(element.valor); 
        });
      }else{
        this.catPublicidad.push("CATALOGO NO CARGADO");
      }
    });
  }
  /** ********************************************** @TASASION ***************************************/
  public setPrecioOro() {
    if ( this.tipoOro.value){
      this.valorOro.setValue(this.tipoOro.value.valorOro)
    }
  }
  cargarJoya() {
    console.log('formulario tasacion ===>>>',this.formTasacion)
    if (this.formTasacion.invalid) {
      this.sinNotSer.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
      return;
    }

    if( this.negoW == null || !this.negoW.credito || !this.negoW.credito.id){
      this.sinNotSer.setNotice('COMPLETE CORRECTAMENTE LA INFORMACION DEL CLIENTE', 'warning');
      return;
    }
      //this.loadingSubject.next(true);
      let joya = new TbQoTasacion();
      joya.descripcion = this.descripcion.value;
      joya.descuentoPesoPiedra = this.descuentoPiedra.value;
      joya.descuentoSuelda = this.descuentoSuelda.value;
      joya.estadoJoya = this.estado.value.codigo;
      joya.numeroPiezas = this.numeroPiezas.value;
      joya.pesoBruto = this.pesoBruto.value;
      joya.pesoNeto = this.pesoNeto.value;
      joya.tipoJoya = this.tipoJoya.value.codigo;
      joya.tipoOro = this.tipoOro.value.codigo;
      joya.tienePiedras = this.tienePiedras.value =='S'?true:false;
      joya.detallePiedras = this.detallePiedras.value;
      joya.pesoNeto = Number(joya.pesoBruto) - (Number(joya.descuentoPesoPiedra) + Number(joya.descuentoSuelda));
      joya.valorOro = this.valorOro.value;
      //joya.valorAvaluo = this.valorAvaluo.value;
      //joya.valorOro = this.valorOro.value;
      joya.valorRealizacion = this.valorRealizacion.value;
      joya.tbQoCreditoNegociacion = {id:this.negoW.credito.id};
      if (this.elementJoya) {
        joya.id = this.elementJoya.id;
       // const index = this.dataSourceTasacion.data.indexOf(this.elementJoya);
       // this.dataSourceTasacion.data.splice(index, 1);
        this.elementJoya = null;
      }
      this.neg.agregarJoya(joya).subscribe((data: any) => {
          this.dataSourceTasacion = new MatTableDataSource<any>(data.entidades);
          this.sinNotSer.setNotice('SE GUARDO LA JOYA TASADA', 'success');
        //this.loadingSubject.next(false);
        this.limpiarCamposTasacion();
        this.calcular();
      });
    
  }
  editar(element: TbQoTasacion) {
    this.tipoOro.setValue(element.tipoOro);
    this.pesoNeto.setValue(element.pesoNeto);
    this.pesoBruto.setValue(element.pesoBruto);
    this.numeroPiezas.setValue(element.numeroPiezas);
    this.tipoJoya.setValue(element.tipoJoya);
    this.estado.setValue(element.estadoJoya);
    this.descuentoPiedra.setValue(element.descuentoPesoPiedra);
    this.descuentoSuelda.setValue(element.descuentoSuelda);
    this.valorOro.setValue(element.valorOro);
    this.tienePiedras.setValue(element.tienePiedras);
    this.detallePiedras.setValue(element.detallePiedras);
    this.valorAplicable.setValue(element.valorAplicable);
    this.precioOro.setValue(element.precioOro);
    this.valorAvaluo.setValue(element.valorAvaluo);
    this.valorRealizacion.setValue(element.valorRealizacion);
    this.descripcion.setValue(element.descripcion);
    this.elementJoya = element.id;
  }
  eliminar(element: TbQoTasacion) {
    this.loadingSubject.next(true);
    this.tas.eliminarJoya(element.id).subscribe((data: any) => {
      if (data.entidad) {
        const index = this.dataSourceTasacion.data.indexOf(element);
        this.dataSourceTasacion.data.splice(index, 1);
        const dataC = this.dataSourceTasacion.data;
        this.dataSourceTasacion.data = dataC;
        if (this.dataSourceTasacion.data.length < 1) {
          this.dataSourceTasacion = null;
        }else{
          this.calcular();
        }
      } else {
        this.sinNotSer.setNotice('ERROR DESCONOCIDO', 'error');
      }
      this.loadingSubject.next(false);
    });
  }
  /** ********************************************** @OPCIONES ***************************************/
  /**
   * calcularOpciones
   */
  public calcularOpciones(montoSolicitado) {
    if (this.dataSourceTasacion.data.length > 0) {
      this.loadingSubject.next(true);
      this.cal.simularOferta(this.negoW.credito.id,montoSolicitado).subscribe((data: any) => {
        this.loadingSubject.next(false);
        if (data.entidad.simularResult && data.entidad.simularResult.xmlOpcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion) {
          this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
        }
        this.myStepper.selectedIndex = 6;
      },err=>{
        this.loadingSubject.next(false);
      });

    } else {
      this.sinNotSer.setNotice("INGRESE ALGUNA JOYA PARA CALCULAR LAS OPCIONES DE OFERTA", 'error');
    }

  }


  updateCliente(event,control){
    console.log("=========>",event,control);

    if(control.invalid || (event instanceof  KeyboardEvent && event.key !='Tab') ){
      return;
    }
    if(this.tbQoCliente && this.tbQoCliente.id){
    let cliente = this.buildCliente();
      this.neg.updateCliente(cliente).subscribe( p =>{
        if(p.entidad && p.entidad.tbQoTelefonoClientes){
          p.entidad.tbQoTelefonoClientes.forEach(element => {
            if(element.tipoTelefono =='M'){
              this.telefonoMovil =element;
            }
            if(element.tipoTelefono =='F'){
              this.telefonoFijo =element;
            }          
          });
          
        }
      });
    }else{
      console.log("no guardar")
    }
  }

  buildCliente(){
    console.log("guardad")
    if( this.telefonoFijo){
      this.telefonoFijo.numero = this.telefonoDomicilio.value
    }else if(this.telefonoDomicilio.value){
      this.telefonoFijo ={
        tipoTelefono:'F',
        numero:this.telefonoDomicilio.value
      }
    }
    if( this.telefonoMovil){
      this.telefonoMovil.numero = this.movil.value
    }else if (this.movil.value){
      this.telefonoMovil ={
        tipoTelefono:'M',
        numero:this.movil.value
      }
    }
   
    let cliente = {
      id: this.tbQoCliente.id,
      cedulaCliente:this.tbQoCliente.cedulaCliente,
      aprobacionMupi: this.aprobacionMupi.value,
      campania:this.campania.value,
      fechaNacimiento:this.fechaDeNacimiento.value,
      nacionalidad:this.nacionalidad.value.id,
      publicidad:this.publicidad.value,
      tbQoTelefonoClientes: new Array()
    };

    if(this.telefonoMovil){
      cliente.tbQoTelefonoClientes.push(this.telefonoMovil);
    }
    if(this.telefonoFijo){
      cliente.tbQoTelefonoClientes.push(this.telefonoFijo);
    }
    return cliente;
  }

  seleccionarCredito(element){
    this.opcionCredito = element;
  }


  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceCreditoNegociacion.data.length;
    return numSelected === numRows;
  }


  guardarCredito(){
    if (this.selection.selected.length == 0){
      this.sinNotSer.setNotice("SELECCIONE UNA OPCION DE CREDITO",'warning');
      return;
    }
      if(confirm("ESTA SEGURO DE GENERAR LA SOLICITUD DE CREDITO?")){
        this.neg.guardarOpcionCredito(this.selection.selected, this.negoW.credito.id).subscribe(response=>{
          this.router.navigate(['cliente/gestion-cliente/NEG/',this.negoW.credito.tbQoNegociacion.id]);    
       });
      }
      
    
  }

  verPrecio(){
    if(this.formDatosCliente.invalid){
      this.sinNotSer.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL CLIENTE", 'error');
      this.myStepper.selectedIndex =1;
      return;
    }
    let cliente = this.buildCliente();
    this.neg.verPrecios(cliente).subscribe(resp=>{
      this.catTipoOro = resp.entidades;
      this.myStepper.selectedIndex =4;
    })
  }


  
  private _filter(value: Pais): Pais[] {
    const filterValue = this._normalizeValue(value.nombre);
    return this.catPais.filter(pais => this._normalizeValue(pais.nombre).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  selectTienePiedras(){
    if(this.tienePiedras.value =='S'){
      this.formTasacion.addControl("detallePiedras", this.detallePiedras);
      this.formTasacion.addControl("descuentoPiedra", this.descuentoPiedra);
    }else{
      this.formTasacion.removeControl("detallePiedras");
      this.formTasacion.removeControl("descuentoPiedra");
    }
  }

  masterToggle(event) {
 
    this.selection.clear()        
    this.selection.select(event)
    
}

setPesoNeto(){
  try{
    let v = (Number(this.pesoBruto.value) - (Number(this.descuentoSuelda.value)+ Number (this.descuentoPiedra.value)))
    this.pesoNeto.setValue(v.toFixed(2));
  }catch{
    this.pesoNeto.setValue('0');
  }
  
}
  
}

export class Pais{
  id;
  codigo;
  nombre;
}