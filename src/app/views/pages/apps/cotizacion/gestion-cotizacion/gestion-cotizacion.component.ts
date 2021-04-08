import { SolicitudAutorizacionDialogComponent } from '../../../../partials/custom/popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { VerCotizacionesComponent } from '../../../../partials/custom/popups/ver-cotizaciones/ver-cotizaciones.component';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { TbQoTelefonoCliente } from '../../../../../core/model/quski/TbQoTelefonoCliente';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { TbQoDetalleCredito } from '../../../../../core/model/quski/TbQoDetalleCredito';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatTableDataSource, MatDialog, MatStepper } from '@angular/material';
import { TbQoCotizador } from '../../../../../core/model/quski/TbQoCotizador';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
import { environment } from '../../../../../../environments/environment';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { SubheaderService } from '../../../../../core/_base/layout';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';


@Component({
  selector: 'kt-gestion-cotizacion',
  templateUrl: './gestion-cotizacion.component.html',
  styleUrls: ['./gestion-cotizacion.component.scss']
})

export class GestionCotizacionComponent extends TrackingUtil implements OnInit {
  /** @GLOBAL **/
  public bloquearBusqueda: boolean;
  private usuario: string;
  private agencia: string;
  private riesgoTotal: number;
  private elementJoya;
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  public wCotiz : { joyas: TbQoTasacion[], variables: TbQoVariablesCrediticia[], riesgos: TbQoRiesgoAcumulado[], opciones: TbQoDetalleCredito[], telefonoMovil: TbQoTelefonoCliente, telefonoDomicilio: TbQoTelefonoCliente, excepcionBre: string, cotizacion: TbQoCotizador}
  
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
  public gradoInteres = new FormControl('', [Validators.required]);
  public motivoDesestimiento = new FormControl('', [Validators.required]);
  dataSource = new MatTableDataSource<TbQoDetalleCredito>();
  displayedColumns = ['plazo','periodicidadPlazo','montoFinanciado','valorARecibir','cuota','totalGastosNuevaOperacion','costoCustodia','costoTasacion','costoSeguro','costoFideicomiso','impuestoSolca'];
  
  constructor(
    private cot: CotizacionService,
    private sof: SoftbankService,
    private par: ParametroService,
    private cal: CalculadoraService,
    private neg: NegociacionService,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog,
    public tra: TrackingService,
  ) {
    super(tra);
    this.sof.setParameter();
    this.cot.setParameter();
    this.par.setParameter();

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
    this.formOpciones.addControl('gradoInteres', this.gradoInteres);
    this.formOpciones.addControl('motivoDesestimiento', this.motivoDesestimiento);
    this.formTasacion.addControl('tipoOro  ', this.tipoOro);
    this.formTasacion.addControl('pesoNetoEstimado  ', this.pesoNetoEstimado);
    this.formTasacion.addControl('valorOro', this.valorOro);
  }

  ngOnInit() {
    this.sof.setParameter();
    this.cot.setParameter();
    this.par.setParameter();
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
        this.formBusqueda.disable();
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
    this.par.findByTipo('PUB').subscribe((data: any) => {
      if (data && data.entidades) {
        this.catPublicidad = new Array<any>();
        data.entidades.forEach(element => {
          this.catPublicidad.push(element.valor); 
        });
      }else{
        this.catPublicidad.push("CATALOGO NO CARGADO");
      }
    });
    this.par.findByTipo('DESEST').subscribe((wrapper: any) => {
      this.catMotivoDesestimiento = wrapper && wrapper.entidades ? wrapper.entidades : {valor: 'Error de catalogo'};
    });
    this.par.findByTipo('GINT').subscribe((wrapper: any) => {
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
    this.nombresCompletos.setValue(this.wCotiz.cotizacion.tbQoCliente.nombreCompleto);
    this.campania.setValue(this.wCotiz.cotizacion.tbQoCliente.campania);
    this.correoElectronico.setValue(this.wCotiz.cotizacion.tbQoCliente.email);
    this.fechaNacimiento.setValue(this.wCotiz.cotizacion.tbQoCliente.fechaNacimiento ? new Date( this.wCotiz.cotizacion.tbQoCliente.fechaNacimiento ) : null );
    this.nacionalidad.setValue(this.catPais ? this.catPais.find(p=> p.id == this.wCotiz.cotizacion.tbQoCliente.nacionalidad) : null);
    this.cargarEdad();
    if(this.wCotiz.telefonoMovil){
      this.movil.setValue(this.wCotiz.telefonoMovil.numero);
    }
    if(this.wCotiz.telefonoDomicilio){
      this.telefonoDomicilio.setValue(this.wCotiz.telefonoDomicilio.numero);
    }
    this.aprobacionMupi.setValue( cargar ? this.wCotiz.cotizacion.tbQoCliente.aprobacionMupi : '');
    this.publicidad.setValue( cargar ? this.wCotiz.cotizacion.tbQoCliente.publicidad : '');
    this.campania.setValue( cargar ? this.wCotiz.cotizacion.tbQoCliente.campania : '');

    if(cargar){
      this.sinNoticeService.setNotice("COTIZACION -> \"" + this.wCotiz.cotizacion.codigoCotizacion + "\" Cargada correctamente.", "success");  
    }else{
      this.sinNoticeService.setNotice("SE HA INICIADO UNA NEGOCIACION -> \"" + this.wCotiz.cotizacion.codigoCotizacion + "\". ", "success");
    }  
    this.guardarTraking('COTIZACION', this.wCotiz ? this.wCotiz.cotizacion ? this.wCotiz.cotizacion.codigoCotizacion : null : null, 
    ['Busqueda del Cliente','Datos Cliente','Variables crediticias','Riesgo Acumulado','Precio Oro','Opciones de Crédito'], 
    0, 'GESTION COTIZACION', '')  
    this.subheaderService.setTitle('CODIGO BPM: ' + this.wCotiz.cotizacion.codigoCotizacion);
    if (this.wCotiz.excepcionBre){
      this.sinNoticeService.setNotice('EL CLIENTE PRESENTA LA SIGUENTE RESTRICCION: '+ this.wCotiz.excepcionBre, 'warning');
    } 
  }
  public abrirPopupVerCotizacion(identificacion: string) {
    const dialogRefGuardar = this.dialog.open(VerCotizacionesComponent, {
      width: '1200px',
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
      this.tipoOro.setValue( this.catTipoOro ? this.catTipoOro.find( x => x.codigo == '18K') : null );
      this.valorOro.setValue(this.catTipoOro ? this.catTipoOro.find( x => x.codigo == '18K').valorOro : null )
    })
  }
  private buildCliente(){
    if( this.telefonoDomicilio.value){
      this.wCotiz.telefonoDomicilio = new TbQoTelefonoCliente();
      this.wCotiz.telefonoDomicilio.numero = this.movil.value;
      this.wCotiz.telefonoDomicilio.tipoTelefono = 'DOM';
      this.wCotiz.telefonoDomicilio.tbQoCliente = this.wCotiz.cotizacion.tbQoCliente;
    }
    if( this.movil.value){
      this.wCotiz.telefonoMovil = new TbQoTelefonoCliente();
      this.wCotiz.telefonoMovil.numero = this.movil.value;
      this.wCotiz.telefonoMovil.tipoTelefono = 'CEL';
      this.wCotiz.telefonoMovil.tbQoCliente = this.wCotiz.cotizacion.tbQoCliente;
    }

    let cliente = {
      id: this.wCotiz.cotizacion.tbQoCliente.id,
      cedulaCliente: this.wCotiz.cotizacion.tbQoCliente.cedulaCliente,
      aprobacionMupi: this.aprobacionMupi.value,
      campania:this.campania.value,
      fechaNacimiento:this.fechaNacimiento.value,
      nacionalidad:this.nacionalidad.value.id,
      publicidad:this.publicidad.value,
      tbQoTelefonoClientes: new Array()
    };
    if(this.wCotiz.telefonoMovil){
    cliente.tbQoTelefonoClientes.push(this.wCotiz.telefonoMovil);
    }
    if(this.wCotiz.telefonoDomicilio ){
      cliente.tbQoTelefonoClientes.push(this.wCotiz.telefonoDomicilio );
    }
    this.wCotiz.cotizacion.tbQoCliente.nombreCompleto = this.nombresCompletos.value;
    this.wCotiz.cotizacion.tbQoCliente.publicidad = this.publicidad.value;
    this.wCotiz.cotizacion.tbQoCliente.fechaNacimiento =this.fechaNacimiento.value;
    this.wCotiz.cotizacion.tbQoCliente.edad = this.edad.value;
    this.wCotiz.cotizacion.tbQoCliente.nacionalidad = this.nacionalidad.value.id;
    this.wCotiz.cotizacion.tbQoCliente.email = this.correoElectronico.value;
    this.wCotiz.cotizacion.tbQoCliente.campania = this.campania.value;
    return cliente;
  }
  public cargarJoya() {
    if (this.formTasacion.invalid) {
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL FORMULARIO', 'warning');
      return;
    }
    if( !this.wCotiz || !this.wCotiz.cotizacion || !this.wCotiz.cotizacion.id){
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE LA INFORMACION DEL CLIENTE', 'warning');
      return;
    }
    let joya = new TbQoTasacion(true);
    joya.pesoBruto = this.pesoNetoEstimado.value;
    joya.pesoNeto = this.pesoNetoEstimado.value;
    joya.tipoOro = this.tipoOro.value.codigo;
    joya.valorOro = this.valorOro.value;
    joya.tbQoCotizador = { id : this.wCotiz.cotizacion.id };
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
        this.dataSource = new MatTableDataSource<any>();
      });
  }
  public editar(element: TbQoTasacion) {
    let cliente = this.buildCliente();
    this.neg.verPrecios(cliente).subscribe(resp=>{
      this.catTipoOro = resp.entidades;
      console.log(' tipo oro => ', element.tipoOro)
      this.tipoOro.setValue(this.catTipoOro ? this.catTipoOro.find(t => t.codigo == element.tipoOro) ? this.catTipoOro.find(t => t.codigo == element.tipoOro) : "No definido" : 'No definido' );
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
  /********************************************* @OPCIONES *********************    */

  public calcularOpciones() {
    if (this.wCotiz.joyas.length < 1) {
      this.sinNoticeService.setNotice("INGRESE ALGUNA JOYA PARA CALCULAR LAS OPCIONES DE OFERTA", 'warning');
      return;
    }
    this.cal.simularOfertaCotizacion(this.wCotiz.cotizacion.id).subscribe((data: any) => {
      if (data.entidad.simularResult && data.entidad.simularResult.xmlOpcionesRenovacion 
        && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion 
        && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion){
          this.dataSource = new MatTableDataSource<any>(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
          this.mapearVariables(data.entidad.simularResult.xmlVariablesInternas.variablesInternas.variable);
          this.mapearOpciones( data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
          this.myStepper.selectedIndex = 5;
      }
      if(data.entidad.simularResult.codigoError == 3 ){
        this.wCotiz.excepcionBre = data.entidad.simularResult.mensaje
        this.sinNoticeService.setNotice('Posible  Excepcion: '+ this.wCotiz.excepcionBre, 'warning');
      }
      if(data.entidad.simularResult.codigoError == 1 ){
        this.sinNoticeService.setNotice('Posible  Error: '+ data.entidad.simularResult.mensaje, 'error');
      }
    });
  }
  private mapearVariables(variables: Array<any>){
    let variablesBase : Array<TbQoVariablesCrediticia> = new Array<TbQoVariablesCrediticia>();
    variables.forEach( e=>{
      let variableBase : TbQoVariablesCrediticia = new TbQoVariablesCrediticia();
      variableBase.codigo = e.codigo;
      variableBase.nombre = e.nombre;
      variableBase.valor  = e.valor;
      variableBase.orden  = e.orden;
      variablesBase.push( variableBase );
    });
    this.wCotiz.variables = variablesBase;
    this.sinNoticeService.setNotice("LAS VARIABLES CREDITICIAS FUERON ACTUALIZADAS", 'success');
  }
  private mapearOpciones(simulaciones: any[]){
    let opciones : Array<TbQoDetalleCredito> = new Array<TbQoDetalleCredito>();
    simulaciones.forEach( e=>{
      let opcion: TbQoDetalleCredito = new TbQoDetalleCredito();
      opcion.plazo = e.plazo;
      opcion.periodoPlazo = e.periodicidadPlazo;
      opcion.montoPreaprobado = e.montoFinanciado;
      opcion.recibirCliente = e.valorARecibir;
      opcion.valorCuota = e.cuota;
      opcion.costoNuevaOperacion = e.totalGastosNuevaOperacion;
      opcion.costoCustodia = e.costoCustodia;
      opcion.costoTasacion = e.costoTasacion;
      opcion.costoSeguro = e.costoSeguro;
      opcion.costoResguardado = e.costoFideicomiso;
      opcion.solca = e.impuestoSolca;
      opcion.tbQoCotizador.id = this.wCotiz.cotizacion.id 
      opciones.push( opcion );
    })
    this.wCotiz.opciones = opciones;

  }
  /********************************************* @GUARDAR *********************    */
  public guardar(negociar){
    if(!this.formCliente.valid){
      this.sinNoticeService.setNotice('Complete la seccion del cliente.','warning');
      this.myStepper.selectedIndex = 1;
      return;
    }
    if(negociar && this.wCotiz.joyas.length < 1){
      this.sinNoticeService.setNotice('Agregue al menos una joya para negociar.','warning');
      this.myStepper.selectedIndex = 4;
      return;
    }
    if(!this.formOpciones.valid){
      this.sinNoticeService.setNotice('Complete los campos de opciones de credito','warning');
      this.myStepper.selectedIndex = 5;
      return;
    }
    this.buildCliente();
    this.wCotiz.cotizacion.gradoInteres = this.gradoInteres.value.valor;
    this.wCotiz.cotizacion.motivoDeDesestimiento = this.motivoDesestimiento.value.valor;
    this.cot.guardarGestion( this.wCotiz ).subscribe( (data: any) =>{
      if(data.entidad && negociar){
        this.sinNoticeService.setNotice('Cotizacion guardada y enviada a negociacion', 'success');
        this.router.navigate(['negociacion/gestion-negociacion/COT/', data.entidad.id]);
      }
      if(data.entidad && !negociar){
        this.sinNoticeService.setNotice('Cotizacion guardada.', 'success');
        this.router.navigate(['negociacion/bandeja-operaciones']);
      }
    }, error =>{
      this.sinNoticeService.setNotice('Ocurrio un error: ' + error.error.msgError, 'error');
    });
  }
  /********************************************* @FALTA_VALIDAR *********************    */
  public onChangeFechaNacimiento() {
    const fechaSeleccionada = new Date( this.fechaNacimiento.value );
    if (fechaSeleccionada) {
      this.getDiffFechas(fechaSeleccionada, 'dd/MM/yyy');
    } 
  }
  private getDiffFechas(fecha: Date, format: string) {
    const convertFechas = new RelativeDateAdapter();
    this.par.getDiffBetweenDateInicioActual(convertFechas.format(fecha, 'input'), format).subscribe((rDiff: any) => {
      const diff: YearMonthDay = rDiff.entidad;
      this.edad.setValue(diff.year);
    });
  }
}