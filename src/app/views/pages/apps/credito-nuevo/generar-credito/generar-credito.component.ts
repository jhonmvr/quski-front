import { HabilitanteDialogComponent } from '../../../../partials/custom/habilitante/habilitante-dialog/habilitante-dialog.component';
import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { TablaAmortizacionComponent } from '../../../../partials/custom/popups/tabla-amortizacion/tabla-amortizacion.component';
import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { OperacionNuevoWrapper } from '../../../../../core/model/wrapper/OperacionNuevoWrapper';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { DialogDataHabilitante } from '../../../../../core/interfaces/dialog-data-habilitante';
import { ObjectStorageService } from '../../../../../core/services/object-storage.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { OperacionSoft } from '../../../../../core/model/softbank/OperacionSoft';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatTableDataSource, MatDialog, MatStepper } from '@angular/material';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
import { environment } from '../../../../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
@Component({
  selector: 'kt-generar-credito',
  templateUrl: './generar-credito.component.html',
  styleUrls: ['./generar-credito.component.scss'],
})

export class GenerarCreditoComponent extends TrackingUtil implements OnInit {
  /** @VARIABLES_GLOBALES **/
  public operacionNuevo: OperacionNuevoWrapper;
  public item;
  fechaSoft: Date
  public loadImgJoya = new BehaviorSubject<boolean>(false);
  public loadImgFunda = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  public operacionSoft: OperacionSoft;
  public existeCredito: boolean;
  private agencia: any;
  public anular: boolean;
  private correoAsesor: any;
  /** @FORM_INFORMACION **/
  public formInformacion: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('', [Validators.required]);
  public estadoOperacion = new FormControl('', [Validators.required]);
  public cedulaCliente = new FormControl('', [Validators.required]);
  public nombreCompleto = new FormControl('', [Validators.required]);
  /** @FORM_FECHA_PAGO **/
  public formFecha: FormGroup = new FormGroup({});
  public fechaCuota = new FormControl('', [Validators.required]);
  public fechaSistema = new FormControl('', [Validators.required]);
  public fechaUtil: diferenciaEnDias;
  
  /** @FORM_FUNDA **/
  public formFunda: FormGroup = new FormGroup({});
  public pesoFunda = new FormControl('', [Validators.required]);
  public numeroFunda = new FormControl('');
  public totalPesoBrutoFunda = new FormControl('');
  public totalPesoNeto = new FormControl('');
  
  /** @FORM_INSTRUCCION **/
  public formInstruccion: FormGroup = new FormGroup({});
  public tipoCuenta = new FormControl('', [Validators.required]);
  public numeroCuenta = new FormControl('', Validators.required);
  public tipoCliente = new FormControl('', [Validators.required]);
  public firmanteOperacion = new FormControl('', [Validators.required]);
  /** @FORM_CREDITO **/
  public formCredito: FormGroup = new FormGroup({});
  public tipoCartera = new FormControl('');
  public descripcionProducto = new FormControl('');
  public estadoOperacionSoft = new FormControl('');
  public plazo = new FormControl('');
  public fechaEfectiva = new FormControl('');
  public fechaVencimiento = new FormControl('');
  public montoFinanciado = new FormControl('');
  public totalInteres = new FormControl('');
  public cuotas = new FormControl('');
  public pagarCliente = new FormControl('');
  public riesgoTotalCliente = new FormControl('');
  public recibirCliente = new FormControl('');
  public numeroOperacion = new FormControl('');
  public deudaInicial = new FormControl('');

  /** @FOTOS_FUNDA_JOYA **/
  private joyaFoto  = {idRol:"1",proceso:"FUNDA",estadoOperacion:"",tipoDocumento:"6"}
  private fundaFoto = {idRol:"1",proceso:"FUNDA",estadoOperacion:"",tipoDocumento:"7"}
  public srcJoya : string;
  public srcFunda: string;
  fotoJoya;
  fotoFunda;
  public excepcionOperativa = new FormControl('');
  public fechaRegularizacion = new FormControl('');
  /** @CATALOGOS **/
  public catTipoFunda: Array<any>;
  public catFirmanteOperacion: Array<any>;
  public catTipoCliente: Array<any>;
  public catCuenta: Array<any>;
  public catTipoJoya: Array<any>;
  public catTipoOro: Array<any>;
  public catEstadoJoya: Array<any>;
  public catExcepcionOperativa: Array<any>;


  //dia de pago
  diasMax;
  diasMin;
  //negociacion
  dataSourceCreditoNegociacion = new MatTableDataSource<any>();
  dataSourcesHabilitantes = new MatTableDataSource<any>([{id:""}]);
  displayedColumnsCreditoNegociacion = ['plazo','periodicidadPlazo','tipooferta','montoFinanciado','valorARecibir','cuota','totalGastosNuevaOperacion','costoCustodia', 'costoTransporte','costoTasacion','costoSeguro','costoFideicomiso','impuestoSolca'];



  constructor(
    private cre: CreditoNegociacionService,
    private doc: DocumentoHabilitanteService,
    private obj: ObjectStorageService,
    private par: ParametroService,
    private pro: ProcesoService,
    private sof: SoftbankService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private os:ObjectStorageService,
    private sinNotSer: ReNoticeService,
    public tra: TrackingService,
  ) {
    super(tra);
    this.cre.setParameter();
    this.doc.setParameter();
    this.obj.setParameter();
    this.pro.setParameter();
    this.sof.setParameter();
    this.par.setParameter();

    //  RELACIONANDO FORMULARIOS
    this.formInformacion.addControl("codigoOperacion", this.codigoOperacion);
    this.formInformacion.addControl("estadoOperacion", this.estadoOperacion);
    this.formInformacion.addControl("cedulaCliente", this.cedulaCliente);
    this.formInformacion.addControl("nombreCompleto", this.nombreCompleto);
    this.formInformacion.addControl("fechaSistema", this.fechaSistema);
    
    this.formFecha.addControl("fechaCuota", this.fechaCuota);
    this.formFunda.addControl("pesoFunda", this.pesoFunda);
    this.formFunda.addControl("numeroFunda", this.numeroFunda);
    this.formFunda.addControl("totalPesoBrutoFunda", this.totalPesoBrutoFunda);
    this.formFunda.addControl("totalPesoNeto", this.totalPesoNeto);
    
    this.formInstruccion.addControl("tipoCuenta", this.tipoCuenta);
    this.formInstruccion.addControl("numeroCuenta", this.numeroCuenta);
    this.formInstruccion.addControl("firmanteOperacion", this.firmanteOperacion);
    this.formCredito.addControl("tipoCartera", this.tipoCartera);
    this.formCredito.addControl("descripcionProducto", this.descripcionProducto);
    this.formCredito.addControl("estadoOperacionSoft", this.estadoOperacionSoft);
    this.formCredito.addControl("plazo", this.plazo);
    this.formCredito.addControl("fechaEfectiva", this.fechaEfectiva);
    this.formCredito.addControl("fechaVencimiento", this.fechaVencimiento);
    this.formCredito.addControl("montoFinanciado", this.montoFinanciado);
    this.formCredito.addControl("totalInteres", this.totalInteres);
    this.formCredito.addControl("cuotas", this.cuotas);
    this.formCredito.addControl("pagarCliente", this.pagarCliente);
    this.formCredito.addControl("riesgoTotalCliente", this.riesgoTotalCliente);
    this.formCredito.addControl("recibirCliente", this.recibirCliente);
    this.formInstruccion.addControl("excepcionOperativa", this.excepcionOperativa);
    this.formInstruccion.addControl("fechaRegularizacion", this.fechaRegularizacion);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.doc.setParameter();
    this.obj.setParameter();
    this.pro.setParameter();
    this.sof.setParameter();
    this.par.setParameter();
    this.agencia = Number(localStorage.getItem( 'idAgencia' ));
    this.correoAsesor = localStorage.getItem( 'email' );
    this.obtenerCatalogosSoftbank();
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private traerOperacion() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.id) {
        this.item = json.params.id;
        this.cre.traerCreditoNuevo(this.item).subscribe((data: any) => {
          if (data.entidad) {
            this.operacionNuevo = data.entidad;
            this.validarOperacion(this.operacionNuevo);
          }
        });
        this
      } else {
        this.salirDeGestion("Error al intentar ingresar al Credito.");
      }
    });
  }
  private validarOperacion(data: OperacionNuevoWrapper) {
    if (data.proceso.estadoProceso == "CREADO" || data.proceso.estadoProceso == "DEVUELTO" || data.proceso.estadoProceso == "EXCEPCIONADO") {
      if (data.proceso.proceso == "NUEVO") {
        if(data.existe && data.joyas){
          if(data.cuentas){
            this.cargarCampos(data);
          }else{
            this.salirDeGestion('No existen cuentas bancarias asosiadas a este cliente','Error al buscar el credito');
          }
        }else{
          this.salirDeGestion(data.mensaje, 'Error al buscar el credito');
        }
      } else {
        this.salirDeGestion("El credito al que intenta ingresar no es un \"Credito nuevo\". No es posible entrar.");
      }
    } else {
      this.salirDeGestion("El credito al que intenta ingresar se encuentra en estado \"" + data.proceso.estadoProceso.replace('_', ' ').toLocaleLowerCase() + "\". No es posible entrar. ");
    }
  }
  public habilitarExcepcionOperativa(){
    if(this.excepcionOperativa.value && this.excepcionOperativa.value.valor == 'SIN EXCEPCION'){
      this.fechaRegularizacion.disable();
      this.fechaRegularizacion.setValue(null);
    }else{
      this.fechaRegularizacion.enable();
    }
  }
  setearDiaPago(dia: number):Date{
    let fecha : Date = this.fechaSoft;
    fecha.setDate(dia);
    return fecha;
  }
  private cargarCampos(data: OperacionNuevoWrapper) {
    this.firmanteOperacion.setValue( this.catFirmanteOperacion.find(t=> t.codigo != null).nombre );
    this.firmanteOperacion.disable();
    this.codigoOperacion.setValue(data.credito.codigo);
    this.estadoOperacion.setValue(data.proceso.estadoProceso);
    this.cedulaCliente.setValue(data.credito.tbQoNegociacion.tbQoCliente.cedulaCliente);
    this.nombreCompleto.setValue(data.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    this.numeroCuenta.setValue( data.cuentas[0].cuenta);
    this.tipoCuenta.setValue( this.catCuenta.find( x => x.id == data.cuentas[0].banco) );
    
    this.tipoCuenta.disable();
    this.numeroCuenta.disable();
    if(data.excepciones){
      data.excepciones.forEach(e=>{
        if( e.tipoExcepcion == "EXCEPCION_CLIENTE"){
          if(e.estadoExcepcion == "NEGADO"){
            this.tipoCliente.setValue( this.catTipoCliente.find(t=> t.codigo == "SCD") );
            this.tipoCliente.disable();
          }
        }
      });
    }
    if( this.catExcepcionOperativa ){
      this.excepcionOperativa.setValue( data.credito.excepcionOperativa ? this.catExcepcionOperativa.find(x => x.valor == data.credito.excepcionOperativa) : this.catExcepcionOperativa.find(x => x.nombre == 'SIN_EXCEPCION') );
      this.habilitarExcepcionOperativa();
    }
    this.cargarFotoHabilitante(this.fundaFoto.tipoDocumento, this.fundaFoto.proceso, data.credito.tbQoNegociacion.id.toString());
    this.cargarFotoHabilitante(this.joyaFoto.tipoDocumento, this.joyaFoto.proceso, data.credito.tbQoNegociacion.id.toString());
    if( data.credito.numeroFunda){
      this.fechaCuota.setValue(data.credito.pagoDia ? new Date(data.credito.pagoDia) : null);
      
      this.pesoFunda.setValue( this.catTipoFunda ? this.catTipoFunda.find(x => x.codigo == data.credito.codigoTipoFunda) ? this.catTipoFunda.find(x => x.codigo == data.credito.codigoTipoFunda) : null : null )
      this.numeroFunda.setValue( data.credito.numeroFunda ? data.credito.numeroFunda : null);
      let totalPesoB :any = 0 ;
      let totalPesoN :any = 0 ;
      this.operacionNuevo.joyas.forEach(e =>{
        totalPesoB  = (Number(totalPesoB) + Number( e.pesoBruto )).toFixed(2);
        totalPesoN  = (Number(totalPesoN) + Number( e.pesoNeto )).toFixed(2);
        
      });
      
      this.totalPesoBrutoFunda.setValue( this.pesoFunda.value.codigo +' + '+ totalPesoB );
      this.totalPesoNeto.setValue( totalPesoN );
    }
    if( data.credito.estadoSoftbank && data.credito.numeroOperacion){
      this.cargarOperacion( data.credito );
    }
    let x = new Array()
    x.push(data.credito);
    this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(x);
    this.guardarTraking('NUEVO', this.operacionNuevo ? this.operacionNuevo.credito ? this.operacionNuevo.credito.codigo : null : null, 
        ['Información Operación','Día de pago','Asignacion de Funda','Datos Instruccion Operativa','Datos del Credito nuevo','Documento Habilitantes'], 
        0, 'GENERAR CREDITO',
        this.operacionNuevo ? this.operacionNuevo.credito ? this.operacionNuevo.credito.numeroOperacion : null : null );
  }
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  private salirDeGestion(dataMensaje: string, dataTitulo?: string) {
    let pData = {
      mensaje: dataMensaje,
      titulo: dataTitulo ? dataTitulo : null
    }
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "800px",
      height: "auto",
      data: pData
    });
    dialogRef.afterClosed().subscribe(r => {
      this.router.navigate(['negociacion/bandeja-operaciones']);
    });
  }
  private obtenerCatalogosSoftbank() { 
    this.sof.consultarTipoFundaCS().subscribe((data: any) => {
      this.catTipoFunda = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.sof.consultarFirmanteOperacionCS().subscribe((data: any) => {
        this.catFirmanteOperacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
        this.sof.consultarTipoClienteCS().subscribe((data: any) => {
          this.catTipoCliente = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.sof.consultarBancosCS().subscribe( (data:any) =>{
            this.catCuenta = !data.existeError ? data.catalogo : "Error al cargar catalogo";
            this.sof.consultarTipoJoyaCS().subscribe( (data:any) =>{
              this.catTipoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
              this.sof.consultarTipoOroCS().subscribe( (data:any) =>{
                this.catTipoOro = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                this.sof.consultarEstadoJoyaCS().subscribe( (data:any) =>{
                  this.catEstadoJoya = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                  this.par.findByTipo('EXC-OPV-NUEV',).subscribe( (data :any) =>{
                    this.sof.consultarperiodoDiferimientoCS().subscribe(dias=>{
                      if(dias && dias.catalogo && dias.catalogo && dias.catalogo[0]){
                        this.sof.fechasistema( this.agencia ).subscribe( ( data: any) =>{
                          if( !data.existeError ){
                            this.fechaSistema.setValue( data.fechaSistema  );
                            this.par.addDaysToDate(data.fechaSistema, dias.catalogo[0].diasMaximo ).subscribe( (data:any) =>{
                              console.log('fecha maxima =>', data.entidad);
                              this.diasMax = data.entidad;
                            });
                            this.par.addDaysToDate(data.fechaSistema, dias.catalogo[0].diasMinimo ).subscribe( (data:any) =>{
                              console.log('fecha minima =>', data.entidad);
                              this.diasMin = data.entidad;
                            });
                          }
                        });
                        console.log("setear dia pago ==>",this.diasMax,this.diasMin);
                      }else{
                        this.sinNotSer.setNotice("NO SE PUEDE LEER LOS PARAMETROS DIAS DE DIFERIMIENTO",'error');
                      }
                    });
                    this.catExcepcionOperativa = data.entidades ? data.entidades : {codigo: 'ERR', mensaje: 'Error al cargar catalogo'}
                      this.traerOperacion();
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  /** ********************************************* @OPERACION ********************* **/
  public obtenerNumeroFunda(anular?: boolean ) {
    this.operacionNuevo.credito
    this.operacionNuevo.credito.pagoDia = this.fechaCuota.value? this.fechaCuota.value : null;
    this.operacionNuevo.credito.codigoTipoFunda = this.pesoFunda.value.codigo;
    this.operacionNuevo.credito.numeroCuenta =  this.numeroCuenta.value;
    this.operacionNuevo.credito.numeroFunda = anular ? null : this.numeroFunda.value;
    this.operacionNuevo.credito.tbQoNegociacion.asesor = atob(localStorage.getItem(environment.userKey));
    this.operacionNuevo.credito.idAgencia = this.agencia;
    this.operacionNuevo.credito.firmanteOperacion = this.firmanteOperacion.value;

    this.cre.numeroDeFunda( this.operacionNuevo.credito ).subscribe( (data: any) =>{
      if(data.entidad){
        this.anular = true;
        this.numeroFunda.setValue( data.entidad.numeroFunda ); 
        let totalPesoB :any = 0 ;
        let totalPesoN :any = 0 ;
        this.operacionNuevo.joyas.forEach(e =>{
          totalPesoB  = (Number(totalPesoB) + Number( e.pesoBruto )).toFixed(2);
          totalPesoN  = (Number(totalPesoN) + Number( e.pesoNeto )).toFixed(2);
          
        });
        
        this.totalPesoBrutoFunda.setValue( this.pesoFunda.value.codigo + totalPesoB );
        this.totalPesoNeto.setValue( totalPesoN );
      }else{ 
        this.sinNotSer.setNotice('Error en servicio. No se creo la operacion. Preguntar a soporte.', 'error');
      }
    });
  }
  public  regresar(){
    this.router.navigate(['cliente/gestion-cliente/NEG/',this.item]);
  }
  public generarCredito(anular?: boolean ) {
    if(this.formFunda.valid && this.formInstruccion.valid){
      this.operacionNuevo.credito.pagoDia = this.fechaCuota.value != null ? this.fechaCuota.value : null;
      this.operacionNuevo.credito.codigoTipoFunda = this.pesoFunda.value.codigo;
      this.operacionNuevo.credito.numeroFunda = anular ? null : this.numeroFunda.value;
      this.operacionNuevo.credito.numeroCuenta =  this.numeroCuenta.value;
      this.operacionNuevo.credito.tbQoNegociacion.asesor = atob(localStorage.getItem(environment.userKey));
      this.operacionNuevo.credito.idAgencia = this.agencia;
      this.operacionNuevo.credito.firmanteOperacion = this.firmanteOperacion.value;
      this.operacionNuevo.credito.fechaRegularizacion = this.fechaRegularizacion.value ? this.fechaRegularizacion.value : null;
      this.operacionNuevo.credito.excepcionOperativa = this.excepcionOperativa.value ? this.excepcionOperativa.value.valor : null;
      this.cre.crearOperacionNuevo( this.operacionNuevo.credito, this.correoAsesor ).subscribe( (data: any) =>{
        if(data.entidad){
          this.operacionSoft = data.entidad;  
          this.cargarOperacion( this.operacionSoft.credito );
        }else{ 
          this.sinNotSer.setNotice('Error en servicio. No se creo la operacion. Preguntar a soporte.', 'error');
        }
      });
    }else{
      this.sinNotSer.setNotice('Complete todos los campos solicitados.', 'error');
    }
  } 
  private cargarOperacion( data: TbQoCreditoNegociacion ){
    this.tipoCartera.setValue( data.tipoCarteraQuski );
    this.descripcionProducto.setValue( data.descripcionProducto );
    this.estadoOperacionSoft.setValue( data.estadoSoftbank );
    this.plazo.setValue( data.plazoCredito );
    this.montoFinanciado.setValue( data.montoFinanciado );
    this.totalInteres.setValue( data.totalInteresVencimiento );
    this.cuotas.setValue( data.valorCuota );
    this.pagarCliente.setValue( data.aPagarCliente );
    this.recibirCliente.setValue( data.aRecibirCliente );
    this.numeroFunda.setValue( data.numeroFunda ); 
    this.numeroOperacion.setValue( data.numeroOperacion );
    this.deudaInicial.setValue( data.deudaInicial );
    this.stepper.selectedIndex = data.periodoPlazo != 'D' ? 4 : 3;
    this.fechaVencimiento.setValue( data.fechaVencimiento ); 
    this.fechaEfectiva.setValue( data.fechaEfectiva); 
    if(!this.operacionSoft){
      this.cre.consultarTablaAmortizacion( data.numeroOperacion, this.agencia, atob(localStorage.getItem(environment.userKey) ))
        .subscribe( (data:any) =>{
          if(data.entidades){
            this.operacionSoft = new OperacionSoft();
            this.operacionSoft.cuotasAmortizacion = data.entidades;
          }
      });
    }
    this.existeCredito = true;
  }
  public mostrarTablaDeAmortizacion(){
    if(this.operacionSoft && this.operacionSoft.cuotasAmortizacion){
      const dialogRef = this.dialog.open(TablaAmortizacionComponent, {
        width: "800px",
        height: "auto",
        data: this.operacionSoft.cuotasAmortizacion
      });
    }else{
      this.sinNotSer.setNotice('No existen cuotas', 'error');
    }
  }
  /** ********************************************* @FUNDA ********************* **/

  public cargarFotoJoya() {
    this.srcJoya = null;
    this.loadImgJoya.next(true);
    this.loadArchivoCliente(this.joyaFoto.proceso, this.joyaFoto.estadoOperacion, this.item, this.joyaFoto.tipoDocumento,this.fotoJoya?this.fotoJoya.id:null);
  }
  public cargarFotoFunda() {
    this.srcFunda = null;
    this.loadImgFunda.next(true);
    this.loadArchivoCliente(this.fundaFoto.proceso, this.fundaFoto.estadoOperacion, this.item, this.fundaFoto.tipoDocumento,this.fotoFunda?this.fotoFunda.id:null);
  }
  private loadArchivoCliente(procesoS: string, estadoOperacionS: string, referenciaS: string, idTipoDocumentoS: string, idDocumentohabilitante) {
  console.log("numero de referencia del docuemnto",referenciaS,idDocumentohabilitante);
    let envioModel : DialogDataHabilitante = {
      proceso: procesoS,
      estadoOperacion: estadoOperacionS,
      referencia: referenciaS,
      tipoDocumento: idTipoDocumentoS,
      documentoHabilitante: idDocumentohabilitante
    };
    if (envioModel.referencia) {
      const dialogRef = this.dialog.open(HabilitanteDialogComponent, {
        width: "auto",
        height: "auto",
        data: envioModel
      });
      dialogRef.afterClosed().subscribe(r => {
        console.log('r => ', r);
        if (r) {

          this.sinNotSer.setNotice("ARCHIVO CARGADO CORRECTAMENTE", "success");
          this.cargarFotoHabilitante(idTipoDocumentoS, procesoS, referenciaS);
        }else{
          this.sinNotSer.setNotice("ERROR CARGANDO ARCHIVO", "error");
          this.loadImgFunda.next(false);
          this.loadImgJoya.next(false);
        }
      });
    } else {
      this.sinNotSer.setNotice("ERROR AL CARGAR NO EXISTE DOCUMENTO ASOCIADO", "error");
      this.loadImgFunda.next(false);
      this.loadImgJoya.next(false);
    }

  }
  private cargarFotoHabilitante(tipoDocumento, proceso, referencia) {
    console.log("cargar documentos fotos",tipoDocumento, proceso, referencia);
    this.doc.getHabilitanteByReferenciaTipoDocumentoProceso(tipoDocumento, proceso, referencia).subscribe((data: any) => {
      if(data.entidad){
        if(tipoDocumento =='6'){
          this.fotoJoya = data.entidad;
        }
        if(tipoDocumento =='7'){
          this.fotoFunda = data.entidad;
        }
        this.obj.getObjectById(data.entidad.objectId, this.obj.mongoDb, environment.mongoHabilitanteCollection).subscribe((dataDos: any) => {
          let file = JSON.parse( atob( dataDos.entidad ) );
          if(file && file.typeAction == '6'){
            this.srcJoya = file.fileBase64;
            this.loadImgJoya.next(false);
          } else if(file && file.typeAction == '7'){
            this.srcFunda= file.fileBase64;
            this.loadImgFunda.next(false);
          }
        });
      }
    }, error =>{
      this.sinNotSer.setNotice('ME BUGUIE :c','error');
    });
  }
  public solicitarAprobacion(){
    if(this.existeCredito){
      let mensaje = "Solicitar la aprobacion del credito: " + this.operacionNuevo.credito.codigo;
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.cre.solicitarAprobacionNuevo(this.operacionNuevo.credito.tbQoNegociacion.id).subscribe( (data: any) =>{
            if(data){
              this.router.navigate(['negociacion/bandeja-operaciones']);
            }
          });
        }else{
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','error');
        }
      });
    }
  }

  
}