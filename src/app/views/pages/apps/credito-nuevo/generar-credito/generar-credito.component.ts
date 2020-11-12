import { HabilitanteDialogComponent } from '../../../../partials/custom/habilitante/habilitante-dialog/habilitante-dialog.component';
import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { AuthDialogComponent } from '../../../../partials/custom/auth-dialog/auth-dialog.component';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { OperacionNuevoWrapper } from '../../../../../core/model/wrapper/OperacionNuevoWrapper';
import { DialogDataHabilitante } from '../../../../../core/interfaces/dialog-data-habilitante';
import { ObjectStorageService } from '../../../../../core/services/object-storage.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { OperacionSoft } from '../../../../../core/model/softbank/OperacionSoft';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatTableDataSource, MatDialog, MatStepper } from '@angular/material';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { environment } from '../../../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'kt-generar-credito',
  templateUrl: './generar-credito.component.html',
  styleUrls: ['./generar-credito.component.scss'],

})


export class GenerarCreditoComponent implements OnInit {
  /** @VARIABLES_GLOBALES **/
  public operacionNuevo: OperacionNuevoWrapper;
  public loading;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  public operacionSoft: OperacionSoft;
  private fechaServer;
  public existeCredito: boolean;
  /** @FORM_INFORMACION **/
  public formInformacion: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('', [Validators.required]);
  public estadoOperacion = new FormControl('', [Validators.required]);
  public cedulaCliente = new FormControl('', [Validators.required]);
  public nombreCompleto = new FormControl('', [Validators.required]);
  /** @FORM_FECHA_PAGO **/
  public formFecha: FormGroup = new FormGroup({});
  public fechaCuota = new FormControl('', [Validators.required]);
  public fechaUtil: diferenciaEnDias;
  /** @FORM_FUNDA **/
  public formFunda: FormGroup = new FormGroup({});
  public pesoFunda = new FormControl('', [Validators.required]);
  public numeroFunda = new FormControl('');
  public totalPesoBrutoFunda = new FormControl('');
  /** @FORM_INSTRUCCION **/
  public formInstruccion: FormGroup = new FormGroup({});
  public tipoCuenta = new FormControl('', [Validators.required]);
  public numeroCuenta = new FormControl('', Validators.required);
  public tipoCliente = new FormControl('', [Validators.required]);
  public firmanteOperacion = new FormControl('', [Validators.required]);
  public identificacionCodeudor = new FormControl('', [Validators.required]);
  public nombreCompletoCodeudor = new FormControl('', [Validators.required]);
  public fechaNacimientoCodeudor = new FormControl('', [Validators.required]);
  public identificacionApoderado = new FormControl('', [Validators.required]);
  public nombreCompletoApoderado = new FormControl('', [Validators.required]);
  public fechaNacimientoApoderado = new FormControl('', [Validators.required]);
  /** @FORM_CREDITO **/
  public formCredito: FormGroup = new FormGroup({});
  public tipoCartera = new FormControl('');
  public descripcionProducto = new FormControl('');
  public destinoOperacion = new FormControl('');
  public estadoOperacionSoft = new FormControl('');
  public tipoOperacion = new FormControl('');
  public plazo = new FormControl('');
  public fechaEfectiva = new FormControl('');
  public fechaVencimiento = new FormControl('');
  public montoFinanciado = new FormControl('');
  public valorDesembolso = new FormControl('');
  public totalInteres = new FormControl('');
  public cuotas = new FormControl('');
  public pagarCliente = new FormControl('');
  public riesgoTotalCliente = new FormControl('');
  public recibirCliente = new FormControl('');
  public netoCliente = new FormControl('');

  /** @TABLA_JOYAS **/
  public displayedColumns = ['total','numeroPiezas', 'tipoOro', 'tipoJoya', 'estadoJoya', 'descripcion', 'pesoBruto', 'tieneDescuento', 'descuentoPesoPiedra', 'descuentoSuelda', 'pesoNeto', 'valorOro', 'valorAvaluo', 'valorComercial', 'valorRealizacion'];
  public dataSource = new MatTableDataSource<TbQoTasacion>();
  public totalNumeroJoya: number;
  public totalPesoB: number;
  public totalPesoN: number;
  public totalValorA: number;
  public totalValorR: number;
  public totalValorC: number;
  public totalValorO: number;
  /** @FOTOS_FUNDA_JOYA **/
  private joyaFoto  = {idRol:"1",proceso:"FUNDA",estadoOperacion:"",tipoDocumento:"6"}
  private fundaFoto = {idRol:"1",proceso:"FUNDA",estadoOperacion:"",tipoDocumento:"7"}
  public srcJoya : string;
  public srcFunda: string;
  /** @CATALOGOS **/
  public catTipoFunda: Array<any>;
  public catFirmanteOperacion: Array<any>;
  public catTipoCliente: Array<any>;
  public catCuenta: Array<any>;

  



  constructor(
    private cre: CreditoNegociacionService,
    private doc: DocumentoHabilitanteService,
    private obj: ObjectStorageService,
    private pro: ProcesoService,
    private sof: SoftbankService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private sinNotSer: ReNoticeService,
  ) {
    //  RELACIONANDO FORMULARIOS
    this.formInformacion.addControl("codigoOperacion", this.codigoOperacion);
    this.formInformacion.addControl("estadoOperacion", this.estadoOperacion);
    this.formInformacion.addControl("cedulaCliente", this.cedulaCliente);
    this.formInformacion.addControl("nombreCompleto", this.nombreCompleto);
    this.formFecha.addControl("fechaCuota", this.fechaCuota);
    this.formFunda.addControl("pesoFunda", this.pesoFunda);
    this.formFunda.addControl("numeroFunda", this.numeroFunda);
    this.formFunda.addControl("totalPesoBrutoFunda", this.totalPesoBrutoFunda);
    this.formInstruccion.addControl("tipoCuenta", this.tipoCuenta);
    this.formInstruccion.addControl("numeroCuenta", this.numeroCuenta);
    this.formInstruccion.addControl("tipoCliente", this.tipoCliente);
    this.formInstruccion.addControl("firmanteOperacion", this.firmanteOperacion);
    this.formCredito.addControl("tipoCartera", this.tipoCartera);
    this.formCredito.addControl("descripcionProducto", this.descripcionProducto);
    this.formCredito.addControl("destinoOperacion", this.destinoOperacion);
    this.formCredito.addControl("estadoOperacionSoft", this.estadoOperacionSoft);
    this.formCredito.addControl("tipoOperacion", this.tipoOperacion);
    this.formCredito.addControl("plazo", this.plazo);
    this.formCredito.addControl("fechaEfectiva", this.fechaEfectiva);
    this.formCredito.addControl("fechaVencimiento", this.fechaVencimiento);
    this.formCredito.addControl("montoFinanciado", this.montoFinanciado);
    this.formCredito.addControl("valorDesembolso", this.valorDesembolso);
    this.formCredito.addControl("totalInteres", this.totalInteres);
    this.formCredito.addControl("cuotas", this.cuotas);
    this.formCredito.addControl("pagarCliente", this.pagarCliente);
    this.formCredito.addControl("riesgoTotalCliente", this.riesgoTotalCliente);
    this.formCredito.addControl("recibirCliente", this.recibirCliente);
    this.formCredito.addControl("netoCliente", this.netoCliente);   
  }

  ngOnInit() {
    this.loading = this.loadingSubject.asObservable();
    this.obtenerCatalogosSoftbank();
    this.setFechaSistema();
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private traerOperacion() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.id) {
        this.loadingSubject.next(true);
        const id: number = json.params.id;
        this.cre.traerCreditoNuevo(id).subscribe((data: any) => {
          if (data.entidad) {
            this.operacionNuevo = data.entidad;
            this.validarOperacion(this.operacionNuevo);
          }
        }, error => { this.capturaError(error) });
        this
      } else {
        this.loadingSubject.next(false);
        this.salirDeGestion("Error al intentar ingresar al Credito.");
      }
    });
  }
  private validarOperacion(data: OperacionNuevoWrapper) {
    if (data.proceso.estadoProceso == "CREADO" || data.proceso.estadoProceso == "DEVUELTO" || data.proceso.estadoProceso == "EXCEPCIONADO") {
      if (data.proceso.proceso == "NUEVO") {
        if(data.excepciones){
          data.excepciones.forEach(e=>{
            if( e.tipoExcepcion == "EXCEPCION_CLIENTE"){
              if(e.estadoExcepcion == "NEGADO"){
                this.catTipoCliente.forEach( e=>{
                  if(e.codigo == "SCD" ){
                    this.tipoCliente.setValue( e );
                    this.tipoCliente.disable();
                  }
                });
                
              }else{
                this.catTipoCliente.forEach( e=>{
                  if(e.codigo == 'DEU'){
                    this.tipoCliente.setValue( e );
                  }
                });
              }
            }else{
              this.catTipoCliente.forEach( e=>{
                if(e.codigo == 'DEU'){
                  this.tipoCliente.setValue( e );
                }
              });
            }
          });
          this.cargarCampos(data);
        }
      } else {
        this.loadingSubject.next(false);
        this.salirDeGestion("El credito al que intenta ingresar no es un credito Nuevo. No es posible entrar.");
      }
    } else {
      this.loadingSubject.next(false);
      this.salirDeGestion("El credito al que intenta ingresar se encuentra en estado \"" + data.proceso.estadoProceso.replace('_', ' ').toLocaleLowerCase() + "\". No es posible entrar. ");
    }
  }
  private cargarCampos(data: OperacionNuevoWrapper) {
    this.codigoOperacion.setValue(data.credito.codigo);
    this.estadoOperacion.setValue(data.proceso.estadoProceso);
    this.cedulaCliente.setValue(data.credito.tbQoNegociacion.tbQoCliente.cedulaCliente);
    this.nombreCompleto.setValue(data.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    this.dataSource.data = data.joyas;
    this.calcular();
    this.loadingSubject.next(false);

  }
  private calcular() {
    this.totalPesoN = 0;
    this.totalPesoB = 0;
    this.totalValorR = 0;
    this.totalValorA = 0;
    this.totalValorC = 0;
    this.totalValorO = 0;
    this.totalNumeroJoya = 0
    if (this.dataSource.data) {
      this.dataSource.data.forEach(element => {
        this.totalPesoN = Number(this.totalPesoN) + Number(element.pesoNeto);
        this.totalPesoB = Number(this.totalPesoB) + Number(element.pesoBruto);
        this.totalValorR = Number(this.totalValorR) + Number(element.valorRealizacion);
        this.totalValorA = Number(this.totalValorA) + Number(element.valorAvaluo);
        this.totalValorC = Number(this.totalValorC) + Number(element.valorComercial);
        this.totalValorO = Number(this.totalValorO) + Number(element.valorOro);
        this.totalNumeroJoya = Number(this.totalNumeroJoya) + Number(element.numeroPiezas);
        this.totalPesoBrutoFunda.setValue( this.totalPesoB );
      });
    }
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
  private capturaError(error: any) {
    if (error.error) {
      if (error.error.codError) {
        this.sinNotSer.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
      } else {
        this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
      }
    } else if (error.statusText && error.status == 401) {
      this.dialog.open(AuthDialogComponent, {
        data: {
          mensaje: "Error " + error.statusText + " - " + error.message
        }
      });
    } else {
      this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
    }
  }
  private setFechaSistema() {
    this.cre.getSystemDate().subscribe((fechaSistema: any) => {
      this.fechaServer = new Date(fechaSistema.entidad);
    })
  }
  public onChangeTipoCliente( element: any){
    console.log("Holis? -> ",element.value);
    if( element.value.codigo  == 'CYA' ||  element.value.codigo  == 'SAP' ||  element.value.codigo  == 'SCD'){
      if(element.value.codigo == 'CYA' || element.value.codigo == 'SCD'){
        console.log('aplicando -> codeudor');
        this.formInstruccion.addControl("identificacionCodeudor", this.identificacionCodeudor);
        this.formInstruccion.addControl("nombreCompletoCodeudor", this.nombreCompletoCodeudor);
        this.formInstruccion.addControl("fechaNacimientoCodeudor", this.fechaNacimientoCodeudor);
      }
      if(element.value.codigo == 'CYA' || element.value.codigo == 'SAP'){
        console.log('aplicando -> apoderado');
        this.formInstruccion.addControl("identificacionApoderado", this.identificacionApoderado);
        this.formInstruccion.addControl("nombreCompletoApoderado", this.nombreCompletoApoderado);
        this.formInstruccion.addControl("fechaNacimientoApoderado", this.fechaNacimientoApoderado);
      }
    }
  }
  public validacionFecha() {
    //Todo: Revisar
    this.fechaUtil = new diferenciaEnDias(new Date(this.fechaCuota.value), new Date(this.fechaServer))
    if (Math.abs(this.fechaUtil.obtenerDias()) >= 30 && Math.abs(this.fechaUtil.obtenerDias()) <= 45) {
      console.log("Esta dentro del rango")
    } else {
      this.sinNotSer.setNotice("DEBE ESCOGER ENTRE 30 Y 45 DÍAS", 'error');
    }
    console.log("los dias  de diferencia", this.fechaUtil.obtenerDias())
  }
  private obtenerCatalogosSoftbank() { 
    this.sof.consultarTipoFundaCS().subscribe((data: any) => {
      this.catTipoFunda = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.sof.consultarFirmanteOperacionCS().subscribe((data: any) => {
        this.catFirmanteOperacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
        this.sof.consultarTipoClienteCS().subscribe((data: any) => {
          this.catTipoCliente = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.catCuenta = ["Cuenta Ahorro"];
          this.traerOperacion();
        });
      });
    });
  }
  public validarEdadCodeudor(fechaCodeudor) { // Todo: Probar metodo
    this.fechaUtil = new diferenciaEnDias(new Date(fechaCodeudor), new Date(this.fechaServer));
    let edadCodeudor = this.fechaUtil.obtenerDias() / 365
    if (edadCodeudor >= 65) {
      this.sinNotSer.setNotice("El CODEUDOR DEBE SER MENOR DE 65 AÑOS", 'error');
      this.fechaNacimientoCodeudor.reset();
    } 
  }
  /** ********************************************* @OPERACION ********************* **/
  public generarCredito() {
    console.log( " Validaciones de forms - > " + this.formInstruccion.valid);
    if(this.formInstruccion.valid && this.srcFunda && this.srcJoya){
      this.loadingSubject.next(true);
      this.operacionNuevo.credito
      
      this.operacionNuevo.credito.pagoDia = this.fechaCuota.value != null ? this.fechaCuota.value : null;
      this.operacionNuevo.credito.pesoFunda = this.pesoFunda.value.nombre;
      this.operacionNuevo.credito.numeroFunda = this.numeroFunda.value != null ? this.numeroFunda.value : null;
      this.operacionNuevo.credito.totalPesoBrutoConFunda = this.totalPesoBrutoFunda.value;
      this.operacionNuevo.credito.idBanco = this.tipoCuenta.value; // Todo: Agregar catalogo de tipo cuenta no existente.
      this.operacionNuevo.credito.numeroBanco =  this.numeroCuenta.value;
      // this.operacionNuevo.credito.tipoCliente = this.tipoCliente.value.codigo; // Todo: Que hacer con este campo?
      // this.operacionNuevo.credito.firmanteOperacion = this.firmanteOperacion.value.codigo; // Todo: Que hacer con este campo?
      this.operacionNuevo.credito.identificacionCodeudor = this.identificacionCodeudor.value != null ? this.identificacionCodeudor.value : null;
      this.operacionNuevo.credito.nombreCompletoCodeudor = this.nombreCompletoCodeudor.value != null ? this.nombreCompletoCodeudor.value : null;
      this.operacionNuevo.credito.fechaNacimientoCodeudor = this.fechaNacimientoCodeudor.value != null ? this.fechaNacimientoCodeudor.value : null;
      this.operacionNuevo.credito.identificacionApoderado = this.identificacionApoderado.value != null ? this.identificacionApoderado.value : null;
      this.operacionNuevo.credito.nombreCompletoApoderado = this.nombreCompletoApoderado.value != null ? this.nombreCompletoApoderado.value : null;
      this.operacionNuevo.credito.fechaNacimientoApoderado = this.fechaNacimientoApoderado.value != null ? this.fechaNacimientoApoderado.value : null;
      this.operacionNuevo.credito.tbQoNegociacion.asesor = atob(localStorage.getItem(environment.userKey));
      this.operacionNuevo.credito.idAgencia = 2; // Todo: Donde consulto el numero de agencia? 
      this.cre.crearOperacionNuevo( this.operacionNuevo.credito ).subscribe( (data: any) =>{
        if(data.entidad){
          this.operacionSoft = data.entidad;  
          this.cargarOperacion( this.operacionSoft );
        }else{ 
          this.loadingSubject.next(false);
          this.sinNotSer.setNotice('Error en servicio. No se creo la operacion. Preguntar a soporte.', 'error');
        }
      }, error =>{ this.capturaError(error); });
    }else{
      this.sinNotSer.setNotice('Complete todos los campos solicitados.', 'error');
    }
  } 
  private cargarOperacion( data: OperacionSoft ){
    this.tipoCartera.setValue( data.credito.tipoCarteraQuski );
    this.descripcionProducto.setValue( data.credito.descripcionProducto );
    this.destinoOperacion.setValue( data.credito.destinoOperacion );
    this.estadoOperacionSoft.setValue( data.credito.estadoSoftbank );
    this.tipoOperacion.setValue( data.credito.tipo );
    this.plazo.setValue( data.credito.plazoCredito );
    this.fechaEfectiva.setValue( data.credito.fechaEfectiva );
    this.fechaVencimiento.setValue( data.credito.fechaVencimiento );
    this.montoFinanciado.setValue( data.credito.montoPreaprobado );
    this.valorDesembolso.setValue( data.credito.montoDesembolso );
    this.totalInteres.setValue( data.credito.totalCostoNuevaOperacion );
    this.cuotas.setValue( data.credito.valorCuota );
    this.pagarCliente.setValue( data.credito.apagarCliente );
    this.riesgoTotalCliente.setValue( data.credito.riesgoTotalCliente );
    this.recibirCliente.setValue( data.credito.arecibirCliente );
    this.netoCliente.setValue( data.credito.netoAlCliente );
    this.numeroFunda.setValue( data.credito.numeroFunda );
    this.sinNotSer.setNotice('NUMERO DE FUNDA ASIGNADO: '+ data.credito.numeroFunda, 'success');
    this.stepper.selectedIndex = data.credito.tipo == 'CUOTAS' ? 4 : 3;
    this.existeCredito = true;
    this.loadingSubject.next(false);

  }
  /** ********************************************* @FUNDA ********************* **/

  public cargarFotoJoya() {
    this.srcJoya = null;
    this.loadArchivoCliente(this.joyaFoto.proceso, this.joyaFoto.estadoOperacion, this.operacionNuevo.credito.id.toString(), this.joyaFoto.tipoDocumento);
  }
  public cargarFotoFunda() {
    this.srcFunda = null;
    this.loadArchivoCliente(this.fundaFoto.proceso, this.fundaFoto.estadoOperacion, this.operacionNuevo.credito.id.toString(), this.fundaFoto.tipoDocumento);
  }
  private loadArchivoCliente(procesoS: string, estadoOperacionS: string, referenciaS: string, idTipoDocumentoS: string) {
    let envioModel : DialogDataHabilitante = {
      proceso: procesoS,
      estadoOperacion: estadoOperacionS,
      referencia: referenciaS,
      tipoDocumento: idTipoDocumentoS,
      documentoHabilitante: null
    };
    if (envioModel.referencia) {
      const dialogRef = this.dialog.open(HabilitanteDialogComponent, {
        width: "auto",
        height: "auto",
        data: envioModel
      });
      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          this.sinNotSer.setNotice("ARCHIVO CARGADO CORRECTAMENTE", "success");
          this.cargarFotoHabilitante(idTipoDocumentoS, procesoS, referenciaS);
        }
      });
    } else {
      this.sinNotSer.setNotice("ERROR AL CARGAR NO EXISTE DOCUMENTO ASOCIADO", "error");
    }

  }
  private cargarFotoHabilitante(tipoDocumento, proceso, referencia) {
    this.doc.getHabilitanteByReferenciaTipoDocumentoProceso(tipoDocumento, proceso, referencia).subscribe((data: any) => {
      this.obj.getObjectById(data.entidad.objectId, this.obj.mongoDb, environment.mongoHabilitanteCollection).subscribe((dataDos: any) => {
        let file = JSON.parse( atob( dataDos.entidad ) );
        console.log(" dataDos de respuesta  --> ", file);
        if(file.typeAction == '6'){
          console.log(" dataDos de respuesta  --> ", file.typeAction);
          this.srcJoya = file.fileBase64;
        }
        if(file.typeAction == '7'){
          console.log(" dataDos de respuesta  --> ", file.typeAction);
          this.srcFunda= file.fileBase64;
        }
      });
    });
  }
  public solicitarAprobacion(){
    if(this.existeCredito){
      this.pro.cambiarEstadoProceso(this.operacionNuevo.credito.tbQoNegociacion.id,"NUEVO","PENDIENTE_APROBACION").subscribe( (data: any) =>{
        if(data.entidad){
          console.log('El nuevo estado -> ',data.entidad.estadoProceso);
          this.router.navigate(['aprobador/bandeja-aprobador/']);
        }
      }, error =>{ this.capturaError( error ); });
    }
  }
}