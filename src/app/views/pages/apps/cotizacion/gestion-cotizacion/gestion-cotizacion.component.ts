import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatStepper } from '@angular/material';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { SolicitudAutorizacionDialogComponent } from '../../../../partials/custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
import { TbQoTipoOro, } from '../../../../../core/model/quski/TbQoTipoOro';
import { Router } from '@angular/router';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { TbQoCotizador } from '../../../../../core/model/quski/TbQoCotizador';
import { PrecioOroService } from '../../../../../core/services/quski/precioOro.service';
import { VerCotizacionesComponent } from '../../../../partials/custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { ConsultaOferta } from '../../../../../core/model/calculadora/consultaOferta';
import { OpcionesDeCredito } from '../../../../../core/model/calculadora/opcionesDeCredito';
import { TbQoDetalleCredito } from '../../../../../core/model/quski/TbQoDetalleCredito';
import { MensajeEdadComponent } from '../../../../partials/custom/popups/mensaje-edad/mensaje-edad.component';
import { environment } from '../../../../../../environments/environment';
import { TbQoTelefonoCliente } from '../../../../../core/model/quski/TbQoTelefonoCliente';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';


@Component({
  selector: 'kt-gestion-cotizacion',
  templateUrl: './gestion-cotizacion.component.html',
  styleUrls: ['./gestion-cotizacion.component.scss']
})

export class GestionCotizacionComponent implements OnInit {
  /** @GLOBAL **/
  public bloquearBusqueda: boolean;
  private usuario: string;
  private agencia: string;
  private riesgoTotal: number;
  private elementJoya;
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  public wCotiz : { joyas: TbQoTasacion[], variables: TbQoVariablesCrediticia[], riesgos: TbQoRiesgoAcumulado[], creditoCotizacion: TbQoDetalleCredito, telefonoMovil: TbQoTelefonoCliente, telefonoDomicilio: TbQoTelefonoCliente, tipoOro: any[], excepcionBre: string}
  
  /** @CATALOGOS **/ 
  public catPais: Array<any>;
  public catTipoOro: Array<any>;
  public catPublicidad : Array<any>;
  public catGradosInteres: Array<any>;
  public catMotivoDesestimiento: Array<any>;
  public catTipoJoya: Array<any>;
  public catEstadoJoya: Array<any>;
  
  /** @FORMULARIO **/ 
  public formBusqueda: FormGroup = new FormGroup({});
  public formCliente: FormGroup = new FormGroup({});
  public formTasacion: FormGroup = new FormGroup({});
  public formOpciones: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public publicidad = new FormControl('', [Validators.required]);
  public fechaNacimiento = new FormControl('', [Validators.required]);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', [Validators.required]);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public correoElectronico = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public aprobacionMupi = new FormControl('', [Validators.required]);
  public tipoOro = new FormControl('', [Validators.required]);
  public pesoNetoEstimado = new FormControl('', [Validators.required]);
  public valorOro = new FormControl('', [Validators.required, ValidateDecimal]);
  public fgradoInteres = new FormControl('', [Validators.required]);
  public fmotivoDesestimiento = new FormControl('', [Validators.required]);
  
  
  
  public consultaOferta: ConsultaOferta;
  dataSourceCredito = new MatTableDataSource<TbQoDetalleCredito>();
  displayedColumnsCredito = ['Accion', 'plazo','periodicidadPlazo','tipooferta','montoFinanciado','valorARecibir','cuota','totalGastosNuevaOperacion','costoCustodia', 'costoTransporte','costoTasacion','costoSeguro','costoFideicomiso','impuestoSolca'];
  
  constructor(
    private cot: CotizacionService,
    private sof: SoftbankService,
    private par: ParametroService,
    private pre: PrecioOroService,
    private neg: NegociacionService,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog
  ) {
    this.sof.setParameter();
    this.cot.setParameter();
    this.par.setParameter();
    this.pre.setParameter();

    // FORM CLIENTE
    this.formBusqueda.addControl('cedula', this.identificacion);
    this.formCliente.addControl('fechaNacimiento', this.fechaNacimiento);
    this.formCliente.addControl('nombresCompletos', this.nombresCompletos);
    this.formCliente.addControl('edad', this.edad);
    this.formCliente.addControl('nacionalidad', this.nacionalidad);
    this.formCliente.addControl('movil', this.movil);
    this.formCliente.addControl('telefonoDomicilio', this.telefonoDomicilio);
    this.formCliente.addControl('correoElectronico', this.correoElectronico);
    this.formCliente.addControl('campania', this.campania);
    this.formCliente.addControl('publicidad', this.publicidad);
    this.formCliente.addControl('aprobacionMupi  ', this.aprobacionMupi);
    // FORM VARIABLES CREDITICIAS 
    // OPCIONES DE CREDITO
    this.formOpciones.addControl('fgradoInteres', this.fgradoInteres);
    this.formOpciones.addControl('fmotivoDesestimiento', this.fmotivoDesestimiento);
    // FORM PRECIO ORO
    this.formTasacion.addControl('tipoOro  ', this.tipoOro);
    this.formTasacion.addControl('pesoNetoEstimado  ', this.pesoNetoEstimado);
    this.formTasacion.addControl('valorOro', this.valorOro);
  }

  ngOnInit() {
    this.sof.setParameter();
    this.cot.setParameter();
    this.par.setParameter();
    this.pre.setParameter();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );
    this.consultaCatalogos();


  }
  /********************************************* @BUSQUEDA *********************    */
  public buscarCliente() {
    if (this.formBusqueda.invalid) {
      this.sinNoticeService.setNotice('INGRESE UN NUMERO DE CEDULA VALIDO', 'warning');
      return;
    }
    this.cot.iniciarCotizacion(this.identificacion.value, this.usuario, this.agencia).subscribe((wrapper: any) => {
      if (wrapper.entidad) {
        this.limpiarCotizacion();
        this.wCotiz = wrapper.entidad;
        this.setearValores(false);
        this.myStepper.selectedIndex = 1;
      } else {
        this.abrirPopupDeAutorizacion(this.identificacion.value);
      }
    }, error =>{
      this.sinNoticeService.setNotice('Ocurrio un error: ' + error.error.msgError, 'error');
    });
  }
  private abrirPopupDeAutorizacion(cedula: string): any {
    this.myStepper.selectedIndex = 0;
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: cedula
    });
    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      if (respuesta) {
        this.iniciarNegociacionEquifax(cedula);
      } else {
        this.sinNoticeService.setNotice('CONSULTA EQUIFAX CANCELADA', 'error');
        this.limpiarCamposBusqueda();
      }
    });
  }
  private iniciarNegociacionEquifax( cedula: string ){
    this.cot.iniciarCotizacionEquifax( cedula, this.usuario, this.agencia).subscribe( (wrapper: any) =>{
      if (wrapper.entidad) {
        this.limpiarCotizacion();
        this.wCotiz = wrapper.entidad;
        this.myStepper.selectedIndex = 1;
        if (this.wCotiz.excepcionBre){
          this.sinNoticeService.setNotice('EL CLIENTE PRESENTA LA SIGUENTE RESTRICCION: '+ this.wCotiz.excepcionBre, 'warning');
          return;
        } 
        this.setearValores(false);
      }
    }, error =>{
      this.limpiarCamposBusqueda();
      this.sinNoticeService.setNotice('Ocurrio un error: ' + error.error.msgError, 'error');
    });
  }
  /********************************** @INCIO **************************************  */
  public consultaCatalogos() {
    this.par.findByNombreTipoOrdered("", "PUB", "Y").subscribe((data: any) => {
      if (data && data.entidades) {
        this.catPublicidad = new Array<any>();
        data.entidades.forEach(element => {
          this.catPublicidad.push(element.valor); 
        });
      }else{
        this.catPublicidad.push("CATALOGO NO CARGADO");
      }
    });
    this.par.findByNombreTipoOrdered('', 'DESEST', 'Y').subscribe((wrapper: any) => {
      this.catMotivoDesestimiento = wrapper && wrapper.entidades ? wrapper.entidades : {valor: 'Error de catalogo'};
    });
    this.par.findByNombreTipoOrdered('', 'GINT', 'Y').subscribe((wrapper: any) => {
      this.catGradosInteres = wrapper && wrapper.entidades ? wrapper.entidades : {valor: 'Error de catalogo'};
    });
    this.sof.consultarPaisCS().subscribe((data: any) => {
      this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarTipoJoyaCS().subscribe((data: any) => {
      this.catTipoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarEstadoJoyaCS().subscribe((data: any) => {
      this.catEstadoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
  }

  /********************************************* @FUNCIONES *********************    */
  private limpiarCotizacion() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formCliente.controls).forEach((name) => {
      const control = this.formCliente.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formOpciones.controls).forEach((name) => {
      const control = this.formOpciones.controls[name];
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
    this.wCotiz = null;
  }
  private limpiarCamposBusqueda() {
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
  }
  private limpiarCamposTasacion() {
    Object.keys(this.formTasacion.controls).forEach((name) => {
      const control = this.formTasacion.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.reset();
    });
    this.formTasacion.reset();
  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorNumero = 'Ingreso solo numeros';
    const maximo = 'El maximo de caracteres es: ';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    const errorSeleccion = 'Seleccione una opcion';


    /**
     * Validaciones de cedula
     */
    if (pfield && pfield === 'identificacion') {
      const input = this.formBusqueda.get('cedula');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('invalid-identification')
            ? invalidIdentification
            : input.hasError('maxlength')
              ? errorLogitudExedida
              : input.hasError('minlength')
                ? errorInsuficiente
                : '';
    }
    /**
     * Validaciones de nombresCompletos
     */
    if (pfield && pfield === 'nombresCompletos') {
      const input = this.nombresCompletos;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion de fecha de nacimiento
     */
    if (pfield && pfield === 'fechaNacimiento') {
      const input = this.fechaNacimiento;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion para nacionalidad
     */
    if (pfield && pfield === 'nacionalidad') {
      const input = this.nacionalidad;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion de telefono domicilio
     */
    if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.telefonoDomicilio;
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
    if (pfield && pfield == 'correoElectronico') {
      return this.correoElectronico.hasError('required')
        ? errorRequerido : this.correoElectronico.hasError('email')
          ? 'E-mail no valido' : this.correoElectronico.hasError('maxlength')
            ? maximo + this.correoElectronico.errors.maxlength.requiredLength : '';
    }
    if (pfield && pfield === 'movil') {
      const input = this.movil;
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
    if (pfield && pfield === 'aprobacionMupi') {
      const input = this.aprobacionMupi;
      return input.hasError('required')
        ? errorSeleccion
        : input.hasError('required');
    }
    if (pfield && pfield === 'campania') {
      const input = this.campania;
      return input.hasError('required')
        ? errorSeleccion
        : input.hasError('required');
    }
    if (pfield && pfield === 'publicidad') {
      const input = this.formCliente.get('publicidad');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('errorSeleccion');
    }
  }
  public cargarEdad(){
    console.log('cargarEdad');
    if(this.fechaNacimiento.valid){
      console.log('Fecha de nacimeiento valida');
      const fechaSeleccionada = new Date(this.fechaNacimiento.value);
      const convertFechas = new RelativeDateAdapter();
      console.log('Fecha ===>', fechaSeleccionada);
      this.par.getDiffBetweenDateInicioActual(convertFechas.format(fechaSeleccionada, "input"), "dd/MM/yyy").subscribe((rDiff: any) => {
        const diff: YearMonthDay = rDiff.entidad;
        console.log('La edad? ===>', diff.year);
        this.edad.setValue( diff.year );
      });
    }
  }
  private setearValores(cargar: boolean) {
    this.bloquearBusqueda = true;
    this.nombresCompletos.setValue(this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.nombreCompleto);
    this.campania.setValue(this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.campania);
    this.correoElectronico.setValue(this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.email);
    this.fechaNacimiento.setValue(this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.fechaNacimiento ? new Date( this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.fechaNacimiento ) : null );
    this.nacionalidad.setValue(this.catPais ? this.catPais.find(p=> p.id == this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.nacionalidad) : null);
    this.cargarEdad();
    if(this.wCotiz.telefonoMovil){
      this.movil.setValue(this.wCotiz.telefonoMovil.numero);
    }
    if(this.wCotiz.telefonoDomicilio){
      this.telefonoDomicilio.setValue(this.wCotiz.telefonoDomicilio.numero);
    }
    this.aprobacionMupi.setValue( cargar ? this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.aprobacionMupi : '');
    this.publicidad.setValue( cargar ? this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.publicidad : '');
    this.campania.setValue( cargar ? this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.campania : '');

    if(cargar){
      this.sinNoticeService.setNotice("COTIZACION -> \"" + this.wCotiz.creditoCotizacion.tbQoCotizador.codigoCotizacion + "\" Cargada correctamente.", "success");  
    }else{
      this.sinNoticeService.setNotice("SE HA INICIADO UNA NEGOCIACION -> \"" + this.wCotiz.creditoCotizacion.tbQoCotizador.codigoCotizacion + "\". ", "success");
    }    
    this.subheaderService.setTitle('CODIGO BPM: ' + this.wCotiz.creditoCotizacion.tbQoCotizador.codigoCotizacion);
    if (this.wCotiz.excepcionBre){
      this.sinNoticeService.setNotice('EL CLIENTE PRESENTA LA SIGUENTE RESTRICCION: '+ this.wCotiz.excepcionBre, 'warning');
    } 
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
  /********************************************* @TASACION *********************    */
  public verPrecio(){
    if(this.formCliente.invalid){
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE LOS DATOS DEL CLIENTE", 'error');
      this.myStepper.selectedIndex =1;
      return;
    }
    if(!this.fechaNacimiento.value || this.edad.value < 18 || this.edad.value > 75 ){
      this.sinNoticeService.setNotice("INGRESE UNA FECHA VALIDA QUE CORRESPONDA A UNA EDAD VALIDA", 'error');
      this.myStepper.selectedIndex =1;
      return;
    }
    let cliente = this.buildCliente();
    this.neg.verPrecios(cliente).subscribe(resp=>{
      this.catTipoOro = resp.entidades;
    })
  }
  private buildCliente(){
    let telefonoMovil:  { numero, tipoTelefono};
    let telefonoFijo: { numero, tipoTelefono};
    if( this.telefonoDomicilio.value){
      telefonoFijo =
      {
        numero: this.telefonoDomicilio.value,
        tipoTelefono:'DOM'
      }
    }
    if( this.movil.value){
      telefonoMovil =
      {
        numero: this.movil.value,
        tipoTelefono:'CEL'
      }
    }
    let cliente = {
      id: this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.id,
      cedulaCliente: this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.cedulaCliente,
      aprobacionMupi: this.aprobacionMupi.value,
      campania:this.campania.value,
      fechaNacimiento:this.fechaNacimiento.value,
      nacionalidad:this.nacionalidad.value.id,
      publicidad:this.publicidad.value,
      tbQoTelefonoClientes: new Array()
    };
    if(telefonoMovil){
      cliente.tbQoTelefonoClientes.push(telefonoMovil);
    }
    if(telefonoFijo){
      cliente.tbQoTelefonoClientes.push(telefonoFijo);
    }
    return cliente;
  }
  public cargarJoya() {
    if (this.formTasacion.invalid) {
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
      return;
    }
    if( !this.wCotiz || !this.wCotiz.creditoCotizacion || !this.wCotiz.creditoCotizacion.id){
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE LA INFORMACION DEL CLIENTE', 'warning');
      return;
    }
    let joya = new TbQoTasacion(true);
    joya.pesoBruto = this.pesoNetoEstimado.value;
    joya.pesoNeto = this.pesoNetoEstimado.value;
    joya.tipoOro = this.tipoOro.value.codigo;
    joya.valorOro = this.valorOro.value;
    joya.tbQoDetalleCredito = { id : this.wCotiz.creditoCotizacion.id };
     if(this.wCotiz.riesgos){
      this.riesgoTotal = 0 ;
      this.wCotiz.riesgos.forEach(p=>{
        this.riesgoTotal = this.riesgoTotal + p.saldo;
      })
     }
      if (this.elementJoya) {
        joya.id = this.elementJoya;
        this.elementJoya = null;
      }
      this.cot.agregarJoya(joya).subscribe((data: any) => {
        this.wCotiz.joyas = data.entidades;
        this.sinNoticeService.setNotice('SE GUARDO LA JOYA,', 'success');
        this.limpiarCamposTasacion();
        this.dataSourceCredito = new MatTableDataSource<any>();
      });
  }
  public editar(element: TbQoTasacion) {
    let cliente = this.buildCliente();
    this.neg.verPrecios(cliente).subscribe(resp=>{
      this.catTipoOro = resp.entidades;
      this.tipoOro.setValue(this.catTipoOro ? this.catTipoOro.find(t => t.nombre == element.tipoOro) ? this.catTipoOro.find(t => t.nombre == element.tipoOro) : "No definido" : 'No definido' );
      this.pesoNetoEstimado.setValue(element.pesoBruto);
      this.valorOro.setValue(element.valorOro);
      this.elementJoya = element.id;
    })
  }
  public eliminar(element: TbQoTasacion) {
    this.cot.eliminarJoya(element.id).subscribe((data: any) => {
      if (data.entidad) {
        let listJoyas: TbQoTasacion[]  = new Array<TbQoTasacion>();
        listJoyas = this.wCotiz.joyas;
        const index = listJoyas.indexOf(element);
        listJoyas.splice(index, 1);
        const dataC = listJoyas;
        this.wCotiz.joyas = dataC;
        if (this.wCotiz.joyas.length < 1) {
          this.wCotiz.joyas = null;
        }
      } else {
        this.sinNoticeService.setNotice('ERROR DESCONOCIDO', 'error');
      }
    });
  }
  public setPrecioOro() {
    if ( this.tipoOro.value){
      this.valorOro.setValue(this.tipoOro.value.valorOro)
    }
  }



  


























 




  public guardarCotizacion(cotizador: TbQoCotizador, idCliente: number) {
    if (cotizador == null) {
      cotizador = new TbQoCotizador();
    }
    cotizador.tbQoCliente.id = idCliente;
    this.cot.persistEntity(cotizador).subscribe((data: any) => {
      if (data.entidad != null) {
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO COTIZADOR, NO SE CREO', 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf('codError') > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO COTIZADOR, ERROR DESCONOCIDO', 'error');
      }
    });
  }

  /********************************************* @PRECIOORO *********************    */
  

  /**
   * @description Método que realiza la simulación de las ofertas
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @memberof ListCotizarComponent
   */
  simular() {
    this.consultaOferta = new ConsultaOferta();
    this.consultaOferta.identificacionCliente = this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.cedulaCliente;
    this.consultaOferta.precioOro = 0;
    this.consultaOferta.pesoGr = 0;
    this.consultaOferta.pesoNeto = 0;

    this.consultaOferta.fechaNacimiento = this.wCotiz.creditoCotizacion.tbQoCotizador.tbQoCliente.fechaNacimiento;
  }


  /**
   * @description Método que se llama desde la pagina para realizar el calculo de la edad
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @memberof ListCotizarComponent
   */
  onChangeFechaNacimiento() {
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    //console.log('FECHA SELECCIONADA' + fechaSeleccionada);
    if (fechaSeleccionada) {
      this.getDiffFechas(fechaSeleccionada, 'dd/MM/yyy');
      this.validarEdad();
      //console.log('VALOR DE LA FECHA' + this.fechaNacimiento.value);
    } else {
      this.sinNoticeService.setNotice(
        'El valor de la fecha es nulo',
        'warning'
      );
    }
  }
  /**
   * @description Método que realiza la valida de la edad
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @memberof ListCotizarComponent
   */
  private validarEdad() {
    //console.log('INICIA VALIDAR EDAD');

    const consulta = new ConsultaOferta();
    consulta.identificacionCliente = this.identificacion.value;
    consulta.tipoOroKilataje = '18K';
    consulta.fechaNacimiento = this.fechaNacimiento.value;
/*     this.ing.getInformacionOferta(consulta).subscribe((data: any) => {
      if (data && data.entidad.simularResult.mensaje !== '') {
        this.mensaje = data.entidad.simularResult.mensaje;
        this.validacionEdad(this.mensaje);
      } else {
      }
    }, error => {
      this.sinNoticeService.setNotice('ERROR AL CARGAR VALIDACIONES', 'info');
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL CARGAR', 'error');
      }
    }); */
  }
  /**
   * @description Método que limpia los campos de la seccion de Precio oro
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @memberof ListCotizarComponent
   */
  private limpiarCamposPrecioOro() {
    Object.keys(this.formTasacion.controls).forEach((name) => {
      const control = this.formTasacion.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.reset();
    });
  }
  /**
   * @description
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-08-16
   * @private
   * @param {Date} fecha
   * @param {string} format
   * @memberof ListCotizarComponent
   */
  private getDiffFechas(fecha: Date, format: string) {
    const convertFechas = new RelativeDateAdapter();
    this.par.getDiffBetweenDateInicioActual(convertFechas.format(fecha, 'input'), format).subscribe((rDiff: any) => {
      //console.log('RESPUESTA DE EDAD', JSON.stringify(rDiff));
      const diff: YearMonthDay = rDiff.entidad;
      this.edad.setValue(diff.year);
      //console.log('La edad es ' + this.edad.value);
      const edad = this.edad.value;
      if (edad != undefined && edad != null && edad < 18) {
        this.edad
          .get('edad')
          .setErrors({ 'server-error': 'error' });
      }
    },
      error => {
        if (JSON.stringify(error).indexOf('codError') > 0) {
          const b = error.error;
          this.sinNoticeService.setNotice(b.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice(
            'Error obtener diferencia de fechas',
            'error'
          );
        }
      }
    );
  }



  compararNombres(tipoOro1: TbQoTipoOro, tipoOro2: TbQoTipoOro) {
    if (tipoOro1 == null || tipoOro2 == null) {
      return false;
    }
    return tipoOro1.quilate === tipoOro2.quilate;
  }

  /******************************************** @GUARDAR  ********************************************************/
  
  public submit(flujo: string) {
    /* if (this.formCliente.valid) {
      if (this.formOpciones.valid) {
        if (this.entidadCliente != null) {                      // 1re item (setear valores)
          if (this.wCotiz.creditoCotizacion.tbQoCotizador != null) {                    // 2do item (setear valores)
            if (this.entidadesOpcionesCreditos != null) {         // 3er item (llamar metodo )
              this.loadingSubject.next(true);
              this.guardado(this.entidadCliente, this.wCotiz.creditoCotizacion.tbQoCotizador, this.entidadesOpcionesCreditos);
              if (flujo == 'NEGOCIAR') {
                this.router.navigate(['negociacion/gestion-negociacion/COT', this.wCotiz.creditoCotizacion.tbQoCotizador.id]);
              } else {
                this.router.navigate(['dashboard']);
              }
            } else {
              this.sinNoticeService.setNotice('ERROR, NO EXISTEN DATOS DE OPCIONES DE CREDITO', 'error');

            }
          } else {
            this.sinNoticeService.setNotice('ERROR, NO EXISTEN DATOS DE COTIZADOR', 'error');
          }
        } else {
          this.sinNoticeService.setNotice('ERROR, NO EXISTEN DATOS DEL CLIENTE', 'error');
        }

      } else {
        this.sinNoticeService.setNotice('INGRESE TODOS LOS CAMPOS DE LA SECCION DE OPCIONES DE CREDITO', 'error');
      }
    } else {
      this.sinNoticeService.setNotice('INGRESE TODOS LOS CAMPOS DE LA SECCION CLIENTE', 'error');
    }

 */
  }
  private guardado(cliente: TbQoCliente, cotizador: TbQoCotizador, opcionesDeCredito: Array<OpcionesDeCredito>) {
    // CLIENTE 
    cliente.primerNombre = this.nombresCompletos.value;
    cliente.campania = this.campania.value;
    cliente.nacionalidad = this.nacionalidad.value;
    cliente.email = this.correoElectronico.value;
    cliente.fechaNacimiento = this.fechaNacimiento.value;
    cliente.edad = this.edad.value;
    cliente.aprobacionMupi = this.aprobacionMupi.value;
    cliente.cedulaCliente = this.identificacion.value;
    cliente.publicidad = this.publicidad.value;
    // COTIZADOR
    cotizador.gradoInteres = this.fgradoInteres.value.valor;
    cotizador.motivoDeDesestimiento = this.fmotivoDesestimiento.value.valor;
    cotizador.tbQoCliente = cliente;
    // DETALLE DE CREDITO
    const listDetalleCredito = new Array<TbQoDetalleCredito>();
    opcionesDeCredito.forEach(e => {
      const dcr = new TbQoDetalleCredito();
      dcr.costoResguardado = e.costoFideicomiso;
      dcr.costoSeguro = e.costoSeguro;
      dcr.costoCustodia = e.costoCustodia;
      dcr.costoNuevaOperacion = e.totalGastosNuevaOperacion;
      dcr.costoTasacion = e.costoTasacion;
      dcr.costoTransporte = e.costoTransporte;
      dcr.costoValoracion = e.costoValoracion;
      dcr.montoPreaprobado = e.montoFinanciado;
      dcr.periodoPlazo = e.periodoPlazo;
      dcr.plazo = e.plazo;
      dcr.recibirCliente = e.valorARecibir;
      dcr.solca = e.impuestoSolca;
      dcr.valorCuota = e.cuota;
      dcr.tbQoCotizador = cotizador;
      listDetalleCredito.push(dcr);
    });
    this.guardarGestion(listDetalleCredito);
  }
  private guardarGestion(entidades: Array<TbQoDetalleCredito>) {

  /*   this.det.persistEntities(entidades).subscribe((data: any) => {
      if (data.entidades) {

        //console.log('TbQoDetalleCredito guardadas -----> ', data.entidades);
        //this.entidadesDetalleCreditos = data.entidades;
      } else {
        //console.log(' No se guardaron ---->', data);
      }
    }, error => {
      if (JSON.stringify(error).indexOf('codError') > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR EN CORE INTERNO, ERROR DESCONOCIDO', 'error');
      }
    }); */
  }
}