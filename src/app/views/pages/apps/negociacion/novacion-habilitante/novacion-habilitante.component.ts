import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { PopupPagoComponent } from '../../../../partials/custom/popups/popup-pago/popup-pago.component';
import { RegistrarPagoService } from '../../../../../core/services/quski/registrarPago.service';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { TrackingUtil } from '../../../../../core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../environments/environment.prod';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutConfigService, SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';


@Component({
  selector: 'kt-novacion-habilitante',
  templateUrl: './novacion-habilitante.component.html',
  styleUrls: ['./novacion-habilitante.component.scss']
})
export class NovacionHabilitanteComponent extends TrackingUtil implements OnInit {
  public usuario: string;
  dataHistoricoObservacion;
  ingresoNeto:number;
  politicaIngreso:number;
  flagSolicitud = new BehaviorSubject<boolean>(false);
   //dia de pago
   diasMax;
   diasMin;
   private correoAsesor: any;
   private nombreAsesor: any;
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  public formOperacion: FormGroup = new FormGroup({});
  public tipoDeCuenta = new FormControl('', [Validators.required]);
  public numeroCuenta = new FormControl('', [Validators.required]);
  public diaFijoPago = new FormControl('', [Validators.required]);
  public firmanteOperacion = new FormControl('', [Validators.required]);
  public tipoCliente = new FormControl('', [Validators.required]);
  public identificacionApoderado = new FormControl('', [Validators.required]);
  public nombreApoderado = new FormControl('', [Validators.required]);
  public fechaNacimientoApoderado = new FormControl('', [Validators.required]);
  public identificacionCodeudor = new FormControl('', [Validators.required]);
  public nombreCodeudor = new FormControl('', [Validators.required]);
  public dataSourceComprobante = new MatTableDataSource<any>();
  public excepcionOperativa = new FormControl('');
  public fechaRegularizacion = new FormControl('',[Validators.required]);
  observacionAsesor = new FormControl('',[Validators.maxLength(1000)]);
  public displayedColumnsComprobante = ['accion', 'intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado'];
  public loadComprobante  = new BehaviorSubject<boolean>(false);
  public catCuenta;
  public recibirPagar;
  public recibirOPagar = 'warn'
  public catfirmadaOperacion: {nombre, codigo}[];
  public catFirmanteOperacion;
  public catTipoCliente;
  public catExcepcionOperativa: Array<any>;
  credit: {credito: TbQoCreditoNegociacion, cuentas: any};
  aprobar: boolean;
  item: any;
  private agencia: any;
  mySelections: string[];
  
  

  constructor(
    private cre: CreditoNegociacionService,
    private par: ParametroService,
    private sof: SoftbankService,
    private pro: ProcesoService,
    private layouteService: LayoutConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService,
    public tra: TrackingService


  ) { 
    super(tra);
    this.cre.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();

    this.formOperacion.addControl("tipoDeCuenta", this.tipoDeCuenta);
    this.formOperacion.addControl("numeroCuenta", this.numeroCuenta);
    this.formOperacion.addControl("firmanteCuenta", this.firmanteOperacion);
    this.formOperacion.addControl("tipoCliente", this.tipoCliente);
    this.par.findByNombre('POLITICA_INGRESOS').subscribe(data=>{
      if(data){
        this.politicaIngreso = data.entidad.valor;
      }
    });

  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();
    this.cargarCatalogos();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.correoAsesor = localStorage.getItem( 'email' );
    this.nombreAsesor = localStorage.getItem( 'nombre' );
    this.agencia = Number(localStorage.getItem( 'idAgencia' ));
    this.inicioDeFlujo();
  }

  private findHistoricoObservacionByCredito(idCredito){
    this.cre.findHistoricoObservacionByIdCredito(idCredito).subscribe(result=>{
      this.dataHistoricoObservacion = result.entidades;
    });
  }
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      this.pro.getCabecera(json.params.idNegociacion,'RENOVACION').subscribe(datosCabecera=>{
        this.layouteService.setDatosContrato(datosCabecera);
      });
      if (json.params.idNegociacion) {
        
        this.item = json.params.idNegociacion;
        
        this.cre.buscarRenovacionByIdNegociacion(this.item).subscribe((data: any) => {
          this.credit = data.entidad;
          //Valor neto a recibir
          this.recibirPagar = (this.credit.credito.valorARecibir - this.credit.credito.valorAPagar).toFixed(2) ;
           if ( this.recibirPagar < 0) {
            this.recibirOPagar = 'warn';
          }else if( this.recibirPagar > 0){

            this.recibirOPagar = 'primary'; 

          }
          
          if(data.entidad && data.entidad.credito && data.entidad.credito.id){
            this.findHistoricoObservacionByCredito(data.entidad.credito.id);
          }
          if (this.credit ) {
            this.cargarCampos( this.credit  );
          }else{
            this.abrirSalirGestion("Error al intentar cargar el credito.");
          }
        });
      } 
    });
  }
  private cargarCampos(wr) {
    this.catfirmadaOperacion = [{nombre:'Algo?', codigo:'algo'}];
    //console.log('Data para cargar: ', wr);
    this.subheaderService.setTitle('Codigo Bpm: '+ wr.credito.codigo );
    if(wr.operacionAnterior && wr.operacionAnterior.cliente ){
      this.ingresoNeto = Number( wr.operacionAnterior.cliente.ingresos ? wr.operacionAnterior.cliente.ingresos : 0 ) - Number( wr.operacionAnterior.cliente.egresos ? wr.operacionAnterior.cliente.egresos : 0 );
    }
    if(wr.credito.periodoPlazo == 'C'){ this.formOperacion.addControl("diaFijoPago", this.diaFijoPago); }
    this.tipoCliente.setValue (this.catTipoCliente ? this.catTipoCliente.find(x => x.codigo == 'DEU') ? this.catTipoCliente.find(x => x.codigo == 'DEU') :{nombre: 'Error cargando catalogo'}: {nombre: 'Error cargando catalogo'});
    this.tipoDeCuenta.setValue( this.catCuenta ? this.catCuenta.find(x => x.id == wr.cuentas[0].banco) ? this.catCuenta.find(x => x.id == wr.cuentas[0].banco) : {nombre: 'Error cargando catalogo'}: {nombre: 'Error cargando catalogo'});
    this.tipoDeCuenta.disable();
    this.numeroCuenta.setValue( wr.cuentas[0].cuenta );
    this.numeroCuenta.disable();
    this.firmanteOperacion.setValue( this.catFirmanteOperacion ? this.catFirmanteOperacion[0] ? this.catFirmanteOperacion[0] :{nombre: 'Error cargando catalogo'} :{nombre: 'Error cargando catalogo'} )
    this.firmanteOperacion.disable();
    if(wr.credito.excepcionOperativa && this.catExcepcionOperativa){
      
      let excepcionesOperativas = JSON.parse( wr.credito.excepcionOperativa).map( ex=>{ 
        return this.catExcepcionOperativa.find( p => p.valor == ex );
      } );
      this.excepcionOperativa.setValue(excepcionesOperativas);
      if(this.excepcionOperativa.value && this.excepcionOperativa.value.find(p=>p.valor == 'SIN EXCEPCION') ){
        this.fechaRegularizacion.disable();
        this.fechaRegularizacion.setValue(null);
      }else{
        this.fechaRegularizacion.enable();
        this.fechaRegularizacion.setValue(new Date(wr.credito.fechaRegularizacion) );
      }
    }else{
      this.excepcionOperativa.setValue([this.catExcepcionOperativa.find(x => x.valor == 'SIN EXCEPCION')]);
      this.fechaRegularizacion.disable();
      this.fechaRegularizacion.setValue(null);
    }
    
    
    wr.pagos ? this.dataSourceComprobante = new MatTableDataSource<any>(wr.pagos) : null;
    if( this.dataSourceComprobante.data ){
      this.dataSourceComprobante.data.forEach( e =>{
        e.intitucionFinanciera = this.catCuenta ? this.catCuenta.find(x => x.id == e.intitucionFinanciera) ? this.catCuenta.find(x => x.id == e.intitucionFinanciera) : {nombre: 'Error cargando catalogo'}: {nombre: 'Error cargando catalogo'};
      });
    }
    this.guardarTraking('RENOVACION', wr ? wr.credito ? wr.credito.codigo : null : null, 
      ['Información Operación','Detalle de garantias','Simular opciones de crédito'], 
      0, 'CREAR RENOVACION', wr ? wr.credito ? wr.credito.numeroOperacion : null : null );
    this.sinNotSer.setNotice("SE HA CARGADO EL CREDITO: " + wr.credito.codigo + ".", "success");
  }
  public habilitarExcepcionOperativa(){
    if(this.excepcionOperativa.value && this.excepcionOperativa.value.find(p=>p.valor == 'SIN EXCEPCION') ){
      this.excepcionOperativa.setValue([this.catExcepcionOperativa.find(p=>p.valor == 'SIN EXCEPCION')]);
      this.mySelections = this.excepcionOperativa.value;
      this.fechaRegularizacion.disable();
      this.fechaRegularizacion.setValue(null);
    }else{
      if (this.excepcionOperativa.value.length < 3) {
        this.mySelections = this.excepcionOperativa.value;
      } else {
        this.sinNotSer.setNotice("SOLO PUEDE SELECCION DOS EXCEPCIONES", "warning");
        this.excepcionOperativa.setValue(this.mySelections);
      }
      this.fechaRegularizacion.enable();
    }
  }
  public regresar(){
    this.router.navigate(['negociacion/gestion-cliente/NOV/',this.item]);
  }
  public agregarComprobante(){
    this.loadComprobante.next(true);
    const dialogRef = this.dialog.open(PopupPagoComponent, {
      width: "800px",
      height: "auto",
      data: { id : this.credit.credito.id, banco: this.credit.cuentas[0].banco, numeroCuenta: this.credit.cuentas[0].cuenta }
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.sinNotSer.setNotice('ARCHIVO CARGADO CORRECTAMENTE','success');
        this.cargarComprobante(r);
      }else{
        this.sinNotSer.setNotice('ERROR CARGANDO ARCHIVO','error');
      }
    });
  }
  private cargarComprobante(r) {
    const data = this.dataSourceComprobante.data;
    data.push(r);
    this.dataSourceComprobante = new MatTableDataSource<any>( data );
    this.loadComprobante.next(false);
  }
  public solicitarAprobacion(){
    if(this.observacionAsesor.invalid){
      this.sinNotSer.setNotice("ERROR EN OBSERVACION ASESOR",'warning');
      return;
    }
    if(this.formOperacion.valid){
      let mensaje = "Solicitar la aprobacion del credito: " + this.credit.credito.codigo;
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.cre.solicitarAprobacionRenovacion( this.credit.credito.tbQoNegociacion.id, this.correoAsesor, this.nombreAsesor,this.observacionAsesor.value ).subscribe( (data: any) =>{
            if(data.entidad){
              this.sinNotSer.setNotice('CREDITO ENVIADO A APROBACION FABRICA','success');
              this.router.navigate(['negociacion/bandeja-operaciones']);
            }
          });
        }else{
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','warning');
        }
      });  
    }else{
      this.sinNotSer.setNotice('Complete los campos correctamente','warning');
    }
  }
  public crearOperacion(){
    this.credit.credito.numeroCuenta = this.numeroCuenta.value;
    this.credit.credito.pagoDia = this.diaFijoPago.value;
    this.credit.credito.firmanteOperacion = this.firmanteOperacion.value.codigo;
    this.credit.credito.tipoCliente = this.tipoCliente.value.codigo;
    if( this.tipoCliente.value.codigo == 'SAP' || this.tipoCliente.value.codigo == 'CYA'){
      this.credit.credito.identificacionApoderado = this.identificacionApoderado.value;
      this.credit.credito.nombreCompletoApoderado = this.nombreApoderado.value;
      this.credit.credito.fechaNacimientoApoderado = this.fechaNacimientoApoderado.value;
    }
    if(this.tipoCliente.value.codigo == 'SCD' || this.tipoCliente.value.codigo == 'CYA'){
      this.credit.credito.identificacionCodeudor = this.identificacionCodeudor.value;
      this.credit.credito.nombreCompletoCodeudor = this.nombreCodeudor.value;
    }
    if(this.excepcionOperativa.value && this.excepcionOperativa.value.valor !== 'SIN EXCEPCION' && this.fechaRegularizacion.invalid){
      this.sinNotSer.setNotice('SELECCIONE UNA FECHA DE REGULARIZACION', 'warning');
      return;
    }
    this.credit.credito.fechaRegularizacion = this.fechaRegularizacion.value ? this.fechaRegularizacion.value : null;
    this.credit.credito.excepcionOperativa = this.excepcionOperativa.value ? JSON.stringify(this.excepcionOperativa.value.map(p=>{return p.valor}) ) : null;
    let list = new Array<any>( );
    if(this.dataSourceComprobante.data.length > 0){
      this.dataSourceComprobante.data.forEach( e=>{
        let item: { comprobante, cuenta, fechaPago, intitucionFinanciera, numeroDeposito, valorDepositado, tipoPago} = {
          comprobante: e.comprobante,
          cuenta: e.cuenta,
          fechaPago: e.fechaPago,
          intitucionFinanciera: e.intitucionFinanciera.id,
          numeroDeposito: e.numeroDeposito,
          valorDepositado: e.valorDepositado,
          tipoPago: e.tipoPago
        };
        list.push( item );
      });
    }
    this.cre.crearOperacionRenovacion(this.credit.credito, list , this.usuario).subscribe( (data: any) =>{
      if(data.entidad){
        this.pro.getCabecera(this.item,'RENOVACION').subscribe(datosCabecera=>{
          this.layouteService.setDatosContrato(datosCabecera);
        });
        if(this.credit && this.credit.credito.periodoPlazo == 'C'){
          console.log("total==>",data.entidad.cuotasAmortizacion && data.entidad.cuotasAmortizacion[0].total);
          console.log("ingreso==>",(this.ingresoNeto * this.politicaIngreso));
          if(data.entidad.cuotasAmortizacion && data.entidad.cuotasAmortizacion[0].total > (this.ingresoNeto * this.politicaIngreso)){
            this.sinNotSer.setNotice('EL 40% DEL INGRESO NETO DEBE SER MAYOR O IGUAL AL TOTAL DE LA CUOTA DEL CREDITO', 'error');
            this.flagSolicitud.next(false);
          }else{
            this.flagSolicitud.next(true);
            this.myStepper.selectedIndex = 2;
          }
        }else{
          console.log("interes==>",data.entidad.cuotasAmortizacion[0].interes);
          console.log("ingreso==>",(this.ingresoNeto *this.politicaIngreso));
          if(data.entidad.cuotasAmortizacion && data.entidad.cuotasAmortizacion[0].interes > (this.ingresoNeto * this.politicaIngreso)){
            this.sinNotSer.setNotice('EL 40% DEL INGRESO NETO DEBE SER MAYOR O IGUAL AL INTERES DEL CREDITO', 'error');
            this.flagSolicitud.next(false);
          }else{
            this.flagSolicitud.next(true);
            this.myStepper.selectedIndex = 2;
          }
        }
      }else{
        this.sinNotSer.setNotice('ERROR CREACION EL CREDITO EN SOFTBANK', 'error');
      }
    });
  }
  public eliminarComprobante(row){
    const index = this.dataSourceComprobante.data.indexOf(row);
    this.dataSourceComprobante.data.splice(index, 1);
    const data = this.dataSourceComprobante.data;
    this.dataSourceComprobante.data = data;
  }
  public descargarComprobante(row){
    saveAs(this.cre.dataURItoBlob(row.comprobante.fileBase64), row.comprobante.name);    
  }
  /** @FUNCIONALIDAD */
  private cargarCatalogos(){
    this.sof.consultarFirmanteOperacionCS().subscribe( data =>{
      this.catFirmanteOperacion = data.catalogo ? data.catalogo : ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarBancosCS().subscribe( data =>{
      this.catCuenta = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarTipoClienteCS().subscribe( data =>{
      this.catTipoCliente = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
    this.par.findByTipo('EXC-OPV-RENV',).subscribe( (data :any) =>{
      this.catExcepcionOperativa = data.entidades ? data.entidades : {codigo: 'ERR', mensaje: 'Error al cargar catalogo'}
    });
    this.sof.consultarperiodoDiferimientoCS().subscribe(dias=>{
      if(dias && dias.catalogo && dias.catalogo && dias.catalogo[0]){
        this.sof.fechasistema( this.agencia ).subscribe( ( data: any) =>{
          if( !data.existeError ){
            //this.fechaSistema.setValue( data.fechaSistema  );
            this.par.addDaysToDate(data.fechaSistema, dias.catalogo[0].diasMaximo+1 ).subscribe( (data:any) =>{
              console.log('fecha maxima =>', data.entidad);
              this.diasMax = new Date(data.entidad);
            });
            this.par.addDaysToDate(data.fechaSistema, dias.catalogo[0].diasMinimo+1 ).subscribe( (data:any) =>{
              console.log('fecha minima =>', data.entidad);
              this.diasMin = new Date(data.entidad);
            });
          }
        });
      }else{
        this.sinNotSer.setNotice("NO SE PUEDE LEER LOS PARAMETROS DIAS DE DIFERIMIENTO",'error');
      }
    });
  }
  setearDiaPago(dia):Date{
    let fecha = new Date();
    fecha.setDate(dia);
    return fecha;
  }
  public abrirSalirGestion(mensaje: string, titulo?: string) {
    let data = {
      mensaje: mensaje,
      titulo: titulo ? titulo : null
    }
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "800px",
      height: "auto",
      data: data
    });
    dialogRef.afterClosed().subscribe(r => {
      this.router.navigate(['negociacion/bandeja-operaciones']);
    });
  }
  public limpiarGarantes(){
    this.formOperacion.removeControl('nombreApoderado');
      this.nombreApoderado.reset();
      this.nombreApoderado.setErrors(null);
      this.nombreApoderado.setValue(null);
    this.formOperacion.removeControl('fechaNacimientoApoderado');
      this.fechaNacimientoApoderado.reset();
      this.fechaNacimientoApoderado.setErrors(null);
      this.fechaNacimientoApoderado.setValue(null);
    this.formOperacion.removeControl('identificacionApoderado');
      this.identificacionApoderado.reset();
      this.identificacionApoderado.setErrors(null);
      this.identificacionApoderado.setValue(null);
    this.formOperacion.removeControl('identificacionCodeudor');
      this.identificacionCodeudor.reset();
      this.identificacionCodeudor.setErrors(null);
      this.identificacionCodeudor.setValue(null);
    this.formOperacion.removeControl('nombreCodeudor');
      this.nombreCodeudor.reset();
      this.nombreCodeudor.setErrors(null);
      this.nombreCodeudor.setValue(null);
  }
  public cambiarCliente(){
    this.limpiarGarantes();
    //console.log('Tipo de cliente solicitado ->', this.tipoCliente.value);
    if(this.tipoCliente.value && (this.tipoCliente.value.codigo == 'SAP' || this.tipoCliente.value.codigo == 'CYA')){
      this.formOperacion.addControl("nombreApoderado", this.nombreApoderado);
      this.formOperacion.addControl("fechaNacimientoApoderado", this.fechaNacimientoApoderado);
      this.formOperacion.addControl("identificacionApoderado", this.identificacionApoderado);
    }
    if(this.tipoCliente.value && (this.tipoCliente.value.codigo == 'SCD' || this.tipoCliente.value.codigo == 'CYA')){
      this.formOperacion.addControl("identificacionCodeudor", this.identificacionCodeudor);
      this.formOperacion.addControl("nombreCodeudor", this.nombreCodeudor);
    }
  }

   //validacion de los dias 27 - 30 
   onlyOdds = (d: Date): boolean => {
    const date = d.getDate(); 
    return date<27;
  }
}
