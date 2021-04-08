import { SolicitudDeExcepcionesComponent } from '../../../../partials/custom/popups/solicitud-de-excepciones/solicitud-de-excepciones.component';
import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { DataInjectExcepciones } from '../../../../../core/model/wrapper/DataInjectExcepciones';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { environment } from '../../../../../../../src/environments/environment.prod';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
export interface cliente {
  identificacion: string;
  fechaNacimiento: string;
}
@Component({
  selector: 'kt-crear-renovacion',
  templateUrl: './crear-renovacion.component.html',
  styleUrls: ['./crear-renovacion.component.scss']
})
export class CrearRenovacionComponent extends TrackingUtil implements OnInit {
  public loading;
  public usuario: string;
  agencia: string;
  private validCliente = true;
  private riesgoTotal: number;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  public credit: { operacionAnterior: any, proceso: TbQoProceso, credito: TbQoCreditoNegociacion, excepciones: TbQoExcepcion[]}
  private numeroOperacion;
  public fechaUtil: diferenciaEnDias;
  selection = new SelectionModel<any>(true, []);
  private garantiasSimuladas: any[];

  /** @CATALOGOS */
  public catTipoOro: Array<any>;
  public catTipoJoya: Array<any>;
  public catEstadoJoya: Array<any>;
  /** @FORMULARIOS */
  public formOperacion: FormGroup = new FormGroup({});
  public formOpcionesCredito: FormGroup = new FormGroup({});
  public codigoBpm = new FormControl();
  public codigoOperacion = new FormControl();
  public recibirPagar;
  public proceso = new FormControl();
  public estadoProceso = new FormControl();
  public nombreCompleto = new FormControl();
  public cedulaCliente = new FormControl();
  public montoSolicitado = new FormControl();
  
  public dataSourceCreditoNegociacion = new MatTableDataSource<any>();
  public displayedColumnsCreditoNegociacion = ['Accion','plazo', 'periodicidadPlazo', 'montoFinanciado', 'valorARecibir', 'valorAPagar',
    'costoCustodia', 'costoFideicomiso', 'costoSeguro', 'costoTasacion', 'costoTransporte', 'costoValoracion', 'impuestoSolca',
    'formaPagoImpuestoSolca', 'formaPagoCapital', 'formaPagoCustodia', 'formaPagoFideicomiso', 'formaPagoInteres', 'formaPagoMora',
    'formaPagoGastoCobranza', 'formaPagoSeguro', 'formaPagoTasador', 'formaPagoTransporte', 'formaPagoValoracion', 'saldoInteres',
    'saldoMora', 'gastoCobranza', 'cuota', 'saldoCapitalRenov', 'montoPrevioDesembolso', 'totalGastosNuevaOperacion',
    'totalCostosOperacionAnterior', 'custodiaDevengada', 'formaPagoCustodiaDevengada', 'tipooferta', 'porcentajeflujoplaneado',
    'dividendoflujoplaneado', 'dividendosprorrateoserviciosdiferido'];
    
  recibirOpagar: any = '';
  numeroOperacionMadre: any;
  idNego: any;
  constructor(
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private cal: CalculadoraService,
    private par: ParametroService,
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
    this.cal.setParameter();

    this.formOperacion.addControl("codigoBpm", this.codigoBpm);
    this.formOperacion.addControl("codigoOperacion", this.codigoOperacion);
    this.formOperacion.addControl("proceso", this.proceso);
    this.formOperacion.addControl("estadoProceso", this.estadoProceso);
    this.formOperacion.addControl("nombreCompleto", this.nombreCompleto);
    this.formOperacion.addControl("cedulaCliente", this.cedulaCliente);
    this.formOpcionesCredito.addControl("montoSolicitado", this.montoSolicitado);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.cal.setParameter();
    this.cargarCatalogos();
    this.subheaderService.setTitle('Negociación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );
    this.inicioDeFlujo();
  }
  /** @CREDITO */
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      this.validCliente = true;
      this.riesgoTotal  = 0;
      if (json.params.item && json.params.codigo) {
        if( json.params.codigo == 'NOV'){
          this.loadingSubject.next(true);
          this.cre.buscarRenovacionByIdNegociacion(json.params.item).subscribe((data: any) => {
            this.credit = data.entidad;
            this.idNego = json.params.item;
            //console.log("datos ->", this.credit);
            if (this.credit ) {
              this.cargarCampos();
            }else{
              this.abrirSalirGestion("Error al intentar cargar el credito.");
            }
          });
        }else if(json.params.codigo == 'CRE'){
          this.loadingSubject.next(true);
          this.cre.buscarRenovacionByNumeroOperacionMadre(json.params.item).subscribe((data: any) => {
            this.credit = data.entidad;
            //console.log("datos ->", this.credit);
            if (this.credit ) {
              this.cargarCampos();
            }else{
              this.abrirSalirGestion("Error al intentar cargar el credito.");
            }
          });
        }else{
          this.abrirSalirGestion("Error al intentar cargar el credito.");
        }
        
      } 
    });
  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  private cargarCampos() {
    this.codigoOperacion.setValue(this.credit.operacionAnterior.credito.numeroOperacion);
    this.nombreCompleto.setValue(this.credit.operacionAnterior.cliente.nombreCompleto);
    this.cedulaCliente.setValue(this.credit.operacionAnterior.cliente.identificacion);
    this.numeroOperacion = this.credit.operacionAnterior.credito.numeroOperacion;
    this.numeroOperacionMadre = this.credit.operacionAnterior.credito.numeroOperacionMadre;
    this.codigoBpm.setValue( this.credit.credito ? this.credit.credito.codigo : 'Sin asignar')
    this.proceso.setValue(   this.credit.proceso ? this.credit.proceso.proceso : 'Sin asignar');
    this.estadoProceso.setValue(this.credit.proceso ? this.credit.proceso.estadoProceso : 'Sin asignar');
    this.guardarTraking('RENOVACION',
      this.credit ? this.credit.credito ? this.credit.credito.codigo : null : null, 
        ['Información Operación','Detalle de garantias','Simular opciones de crédito'], 
        0, 'CREAR RENOVACION',
        this.credit ? this.credit.credito ? this.credit.credito.numeroOperacion : null : null )
    this.formOperacion.disable();
    if(this.credit.credito){
      this.dataSourceCreditoNegociacion = new MatTableDataSource();
      let calculadora: any = {
        costoCustodia: this.credit.credito.costoCustodia,
        costoFideicomiso: this.credit.credito.costoFideicomiso,
        costoSeguro: this.credit.credito.costoSeguro,
        costoTasacion: this.credit.credito.costoTasacion,
        costoTransporte: this.credit.credito.costoTransporte,
        costoValoracion: this.credit.credito.costoValoracion,
        cuota: this.credit.credito.cuota,
        custodiaDevengada: this.credit.credito.custodiaDevengada,
        dividendoflujoplaneado: this.credit.credito.dividendoFlujoPlaneado,
        dividendosprorrateoserviciosdiferido:this.credit.credito.dividendoProrrateo,
        formaPagoCapital: this.credit.credito.formaPagoCapital,
        formaPagoCustodia: this.credit.credito.formaPagoCustodia,
        formaPagoCustodiaDevengada: this.credit.credito.formaPagoCustodiaDevengada,
        formaPagoFideicomiso: this.credit.credito.formaPagoFideicomiso,
        formaPagoGastoCobranza: this.credit.credito.formaPagoGastoCobranza,
        formaPagoImpuestoSolca: this.credit.credito.formaPagoImpuestoSolca,
        formaPagoInteres: this.credit.credito.formaPagoInteres,
        formaPagoMora: this.credit.credito.formaPagoMora,
        formaPagoSeguro: this.credit.credito.formaPagoSeguro,
        formaPagoTasador: this.credit.credito.formaPagoTasador,
        formaPagoTransporte: this.credit.credito.formaPagoTransporte,
        formaPagoValoracion: this.credit.credito.formaPagoValoracion,
        gastoCobranza: this.credit.credito.gastoCobranza,
        impuestoSolca: this.credit.credito.impuestoSolca,
        montoFinanciado: this.credit.credito.montoFinanciado,
        montoPrevioDesembolso: this.credit.credito.montoPrevioDesembolso,
        periodicidadPlazo: this.credit.credito.periodicidadPlazo,
        periodoPlazo: this.credit.credito.periodoPlazo,
        plazo: this.credit.credito.plazoCredito,
        porcentajeflujoplaneado: this.credit.credito.porcentajeFlujoPlaneado,
        saldoCapitalRenov: this.credit.credito.saldoCapitalRenov,
        saldoInteres: this.credit.credito.saldoInteres,
        saldoMora: this.credit.credito.saldoMora,
        tipooferta: this.credit.credito.tipoOferta,
        totalCostosOperacionAnterior: this.credit.credito.totalCostosOperacionAnterior,
        totalGastosNuevaOperacion: this.credit.credito.totalGastosNuevaOperacion,
        valorAPagar: this.credit.credito.valorAPagar,
        valorARecibir: this.credit.credito.valorARecibir
      }
      this.dataSourceCreditoNegociacion.data.push( calculadora );
      this.masterToggle( calculadora ) ;
    }
    this.validarProceso();
    this.sinNotSer.setNotice("SE HA CARGADO EL CREDITO: " + this.credit.operacionAnterior.credito.numeroOperacion + ".", "success");
  }
  public validarProceso(){
    if(this.credit.proceso){
      if(this.credit.proceso.proceso != 'RENOVACION'){
        this.abrirSalirGestion('El credito que intenta procesar no es un credito de novacion','Credito Invalido');
      }
      if(this.credit.proceso.estadoProceso == 'PENDIENTE_EXCEPCION' || this.credit.proceso.estadoProceso == 'PENDIENTE_APROBACION' || this.credit.proceso.estadoProceso == 'PENDIENTE_APROBACION_DEVUELTO'){
        this.abrirSalirGestion('Su novacion se encuentra en revision por fabrica. Espere a que su credito sea revisado','Credito en fabrica');
      }
      if(this.credit.proceso.estadoProceso == 'APROBADO' || this.credit.proceso.estadoProceso == 'NEGADO'){
        this.abrirSalirGestion('Su novacion ya fue finalizada.','Operacion finalizada');
      }

      this.credit.excepciones? this.credit.excepciones.forEach(e=>{
        console.log('Hola? probando excepciones -->', this.credit.excepciones);
        if(e.estadoExcepcion == 'PENDIENTE'){
          this.abrirSalirGestion('Su novacion se encuentra en revision por fabrica. Espere a que su credito sea revisado','Excepcion en proceso');
        }
        if(e.tipoExcepcion != 'EXCEPCION_COBERTURA' && e.estadoExcepcion == 'NEGADO'){
          this.abrirSalirGestion('Su excepcion fue negada. Observacion:'+ e.observacionAprobador+'.','Excepcion Negada');
        }
        if(e.tipoExcepcion == 'EXCEPCION_CLIENTE'   && e.estadoExcepcion == 'APROBADO'){
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {mensaje:'Su excepcion de cliente por motivos: ' + e.observacionAsesor + '. Fue aprobada y revisada por: '+e.idAprobador +', agregando como observacion lo siguiente: ' + e.observacionAprobador 
            ,titulo:'EXCEPCION DE CLIENTE APROBADA'}
          });
          dialogRef.afterClosed().subscribe(r => {
            this.validCliente = false;
          });
        }
        if(e.tipoExcepcion == 'EXCEPCION_RIESGO'    && e.estadoExcepcion == 'APROBADO'){
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {mensaje:'Observacion Asesor: ' + e.observacionAsesor 
            +'\n' + 'Observacion Aprobador: ' + e.observacionAprobador 
            ,titulo:'EXCEPCION DE RIESGO APROBADA'}
          });
          dialogRef.afterClosed().subscribe(r => {
            this.riesgoTotal = 0;
          });
        }
        if(e.tipoExcepcion == 'EXCEPCION_COBERTURA' && e.estadoExcepcion == 'APROBADO'){
          const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
            width: "800px",
            height: "auto",
            data: {mensaje:'Observacion Asesor: ' + e.observacionAsesor 
            +'\n' + 'Observacion Aprobador: ' + e.observacionAprobador 
            ,titulo:'EXCEPCION DE COBERTURA APROBADA'}
          });
        }
      }) : null ;
    }
    
  }
  public validarCliente(){
    this.par.findByNombre('EDAD_MAXIMA').subscribe( (data: any) =>{
      if(data.entidad){
        console.log('Edad  maxima? ===>', data.entidad.valor);
        let valor = data.entidad.valor;
        this.par.getDiffBetweenDateInicioActual(this.credit.operacionAnterior.cliente.fechaNacimiento, 'yyyy-MM-dd').subscribe( (data: any) =>{
          console.log('Mi data de calcular edad ===>', data);
          if(data.entidad.year > valor && this.validCliente){
            this.credit.excepciones ? this.credit.excepciones.forEach(e =>{
              if(e.tipoExcepcion != 'EXCEPCION_CLIENTE'){
                this.solicitarExcepcionCliente();
              };
              if(e.tipoExcepcion == 'EXCEPCION_CLIENTE' && e.estadoExcepcion == 'NEGADO'){
                this.solicitarExcepcionCliente();
              }
            }): this.solicitarExcepcionCliente();
          }
        });
      }
    });
  }
  public solicitarExcepcionRiesgo(){
    if(!this.credit.proceso){
      this.cre.crearCreditoRenovacion( this.selection.selected,  this.numeroOperacion, this.numeroOperacionMadre, this.usuario, this.agencia,this.garantiasSimuladas, this.idNego).subscribe( data =>{
        if(data.entidad){
          this.credit = data.entidad;
          this.abrirPopupExcepciones(new DataInjectExcepciones(false,true,false) );
        }
      });
    }else{
      this.abrirPopupExcepciones(new DataInjectExcepciones(false,true,false) );
    }
  }
  public solicitarExcepcionCliente(){
    if(!this.credit.proceso){
      this.cre.crearCreditoRenovacion( this.selection.selected,  this.numeroOperacion, this.numeroOperacionMadre, this.usuario, this.agencia,this.garantiasSimuladas, this.idNego).subscribe( data =>{
        if(data.entidad){
          this.credit = data.entidad;
          this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false) );
        }
      });
    }else{
      this.abrirPopupExcepciones(new DataInjectExcepciones(true,false,false) );
    }
  }
  public solicitarExcepcionCobertura(){
    if(this.selection.selected.length > 0){
      if(!this.credit.proceso){
        this.cre.crearCreditoRenovacion(  this.selection.selected,  this.numeroOperacion, this.numeroOperacionMadre, this.usuario, this.agencia,this.garantiasSimuladas, this.idNego).subscribe( data =>{
          if(data.entidad){
            this.credit = data.entidad;
            this.abrirPopupExcepciones(new DataInjectExcepciones(false,false,true) );
          }
        });
      }else{
        this.abrirPopupExcepciones(new DataInjectExcepciones(false,false,true) );
      }
    }else{
      this.sinNotSer.setNotice('SELECCIONE AL MENOS UNA OPCION PARA SOLICITAR LA EXCEPCION', 'error');
    }
  }
  public abrirPopupExcepciones(data: DataInjectExcepciones) {
    this.loadingSubject.next(false);
    data.idNegociacion = this.credit.proceso.idReferencia;
    data.mensajeBre = data.isCliente ? 'El cliente supera el limite de edad establecido' : null;
    const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
      width: '800px',
      height: 'auto',
      data: data
    });
    dialogRefGuardar.afterClosed().subscribe((result: any) => {
      if (result) {
        this.abrirSalirGestion('Espere respuesta del aprobador para continuar con la negociacion.','EXCEPCION SOLICITADA');
      } else {
        if (data.isCobertura) {
          this.sinNotSer.setNotice('SOLICITUD DE EXCEPCION CANCELADA', 'error');
        } else {
          this.abrirSalirGestion('NO SE REALIZO LA EXCEPCION, SE CERRARA LA NEGOCIACION','NEGOCIACION CANCELADA');
        }
      }
    });
  }
  public actualizarCliente(){
    if( this.selection.selected.length > 0 ){
      let mensaje = "Crear operacion para el credito: " + this.numeroOperacion;
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        this.loadingSubject.next(true);
        if(r){
          this.cre.crearCreditoRenovacion( this.selection.selected[0], this.numeroOperacion, this.numeroOperacionMadre, this.usuario, this.agencia, this.garantiasSimuladas, this.idNego ).subscribe( data =>{
            if(data.entidad){
              this.credit = data.entidad;
              this.router.navigate(['cliente/gestion-cliente/NOV/',this.credit.proceso.idReferencia]);
            }
          });
        }else{
          this.loadingSubject.next(false);
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','error');
        }
      });
    }else{
      this.sinNotSer.setNotice('Seleccione una opcion valida', 'error');
    }
  }
  public simularOpciones(){
    if(this.montoSolicitado.value){
      if(this.dataSourceCreditoNegociacion.data.length < 1 || ( this.montoSolicitado.value > this.dataSourceCreditoNegociacion.data[0].montoFinanciado  ) ){
        this.sinNotSer.setNotice("EL MONTO SOLICITADO ES MAYOR AL MONTO FINANCIADO ACTUAL", 'error');
        return;
      }
    }
    this.loadingSubject.next(true);
    let cliente = {} as cliente;
    cliente.identificacion = this.credit.operacionAnterior.cliente.identificacion;
    let fecha = new Date (this.credit.operacionAnterior.cliente.fechaNacimiento);
    let mes = (fecha.getMonth() < 10 ? fecha.getMonth() == 0 ? '12':'0'+fecha.getMonth() : fecha.getMonth())  
    cliente.fechaNacimiento = (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate()) +'/' + mes +'/' + fecha.getFullYear(); 
    let wrapper : any = { cliente: null, credito: null, garantias: null}
    wrapper.cliente =  cliente;
    wrapper.credito = this.credit.operacionAnterior.credito;
    wrapper.garantias = this.credit.operacionAnterior.garantias;
    let cobertura = this.credit.credito ? this.credit.credito.cobertura? this.credit.credito.cobertura : 0 : 0;
    let monto = this.montoSolicitado.value ? this.montoSolicitado.value : null;
    this.cal.simularOfertaRenovacion(this.riesgoTotal, cobertura ,this.agencia, monto, wrapper).subscribe( (data: any) =>{
      if(data.entidad){
        //console.log('Data de simulacion -->',data.entidad);
        data.entidad.simularResult.codigoError > 0 ? this.sinNotSer.setNotice("Error en la simulacion: "+ data.entidad.simularResult.mensaje, 'error')
          : this.sinNotSer.setNotice("SELECCIONES UNA OPCION DE CREDITO PARA CONTINUAR", 'success') ;
        this.garantiasSimuladas = [];
        data.entidad.simularResult.xmlGarantias.garantias.garantia ? data.entidad.simularResult.xmlGarantias.garantias.garantia.forEach(e => {
          this.garantiasSimuladas.push( e );
        }): null;
        this.dataSourceCreditoNegociacion.data = data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion;
        this.validarCliente();
        this.loadingSubject.next(false);
      }
    });
  }
  /** @FUNCIONALIDAD */
  private cargarCatalogos(){
    this.sof.consultarTipoJoyaCS().subscribe( data =>{
      this.catTipoJoya = data.catalogo ? data.catalogo : ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarEstadoJoyaCS().subscribe( data =>{
      this.catEstadoJoya = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarTipoOroCS().subscribe( data =>{
      this.catTipoOro = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
  }
  public regresar(){
    this.router.navigate(['credito-nuevo/lista-credito']);
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

  masterToggle(event) {
    this.selection.clear()        
    this.selection.select(event) 
    this.recibirPagar = event.valorARecibir - event.valorAPagar ;
    console.log('Valor =>', this.selection.isSelected(event) );
    if(this.selection.isSelected(event) && this.recibirPagar > 0){
      this.recibirOpagar = 'primary'; 
    }else if (this.selection.isSelected(event)  && this.recibirPagar < 0) {
      this.recibirOpagar = 'warn';
    }else{
      this.recibirOpagar = '';
    }
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
}
