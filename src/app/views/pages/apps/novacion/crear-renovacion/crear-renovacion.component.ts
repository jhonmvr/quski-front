import { SolicitudDeExcepcionesComponent } from '../../../../partials/custom/popups/solicitud-de-excepciones/solicitud-de-excepciones.component';
import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { DataInjectExcepciones } from '../../../../../core/model/wrapper/DataInjectExcepciones';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { environment } from '../../../../../../../src/environments/environment.prod';
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
export interface cliente {
  identificacion: string;
  fechaNacimiento: string;
}
@Component({
  selector: 'kt-crear-renovacion',
  templateUrl: './crear-renovacion.component.html',
  styleUrls: ['./crear-renovacion.component.scss']
})
export class CrearRenovacionComponent implements OnInit {
  public loading;
  public usuario: string;
  agencia: string;
  private validCliente = true;
  private riesgoTotal: number;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  private credit: { operacionAnterior: any, proceso: TbQoProceso, credito: TbQoCreditoNegociacion, excepciones: TbQoExcepcion[]}
  private numeroOperacion;
  public fechaUtil: diferenciaEnDias;
  public seleccion;
  private garantiasSimuladas: any[];

  private fechaServer;
  public totalPesoB;
  public totalPesoN;
  public totalValorO;
  public totalNumeroJoya;
  public totalValorA;
  public totalValorR;
  public totalValorC;
  public total;

  /** @CATALOGOS */
  public catTipoOro: Array<any>;
  public catTipoJoya: Array<any>;
  public catEstadoJoya: Array<any>;
  /** @FORMULARIOS */
  public formOperacion: FormGroup = new FormGroup({});
  public codigoBpm = new FormControl();
  public codigoOperacion = new FormControl();
  public proceso = new FormControl();
  public estadoProceso = new FormControl();
  public nombreCompleto = new FormControl();
  public cedulaCliente = new FormControl();
  
  public dataSourceTasacion = new MatTableDataSource<any>();
  public displayedColumnsTasacion = ['Total','NumeroPiezas','PesoBruto','PesoNeto', 'precioOro', 'ValorAvaluo', 'ValorRealizacion', 'valorComercial', 'TipoOro','TipoJoya', 'EstadoJoya', 'Descripcion',  'DescuentoSuelda', 'DescuentoPesoPiedra', 'tienePiedras', 'detallePiedras'];
  public dataSourceCreditoNegociacion = new MatTableDataSource<any>();
  public displayedColumnsCreditoNegociacion = ['accion','plazo', 'periodoPlazo', 'periodicidadPlazo', 'montoFinanciado', 'valorARecibir', 'valorAPagar',
    'costoCustodia', 'costoFideicomiso', 'costoSeguro', 'costoTasacion', 'costoTransporte', 'costoValoracion', 'impuestoSolca',
    'formaPagoImpuestoSolca', 'formaPagoCapital', 'formaPagoCustodia', 'formaPagoFideicomiso', 'formaPagoInteres', 'formaPagoMora',
    'formaPagoGastoCobranza', 'formaPagoSeguro', 'formaPagoTasador', 'formaPagoTransporte', 'formaPagoValoracion', 'saldoInteres',
    'saldoMora', 'gastoCobranza', 'cuota', 'saldoCapitalRenov', 'montoPrevioDesembolso', 'totalGastosNuevaOperacion',
    'totalCostosOperacionAnterior', 'custodiaDevengada', 'formaPagoCustodiaDevengada', 'tipooferta', 'porcentajeflujoplaneado',
    'dividendoflujoplaneado', 'dividendosprorrateoserviciosdiferido'];
  constructor(
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private cal: CalculadoraService,
    private par: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService
  ) { 
    this.cre.setParameter();
    this.sof.setParameter();
    this.cal.setParameter();

    this.formOperacion.addControl("codigoBpm", this.codigoBpm);
    this.formOperacion.addControl("codigoOperacion", this.codigoOperacion);
    this.formOperacion.addControl("proceso", this.proceso);
    this.formOperacion.addControl("estadoProceso", this.estadoProceso);
    this.formOperacion.addControl("nombreCompleto", this.nombreCompleto);
    this.formOperacion.addControl("cedulaCliente", this.cedulaCliente);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.cal.setParameter();
    this.cargarCatalogos();
    this.subheaderService.setTitle('Negociación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = '2'// localStorage.getItem( 'idAgencia' );
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
            //console.log("datos ->", this.credit);
            if (this.credit ) {
              this.cargarCampos( this.credit  );
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
              this.cargarCampos( this.credit  );
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
  private cargarCampos(wr: any) {
    this.formOperacion.disable();
    this.totalPesoB      = 0;
    this.totalPesoN      = 0;
    this.totalValorO     = 0;
    this.totalNumeroJoya = 0;
    this.totalValorA     = 0;
    this.totalValorR     = 0;
    this.totalValorC     = 0;
    this.total           = 0;
    this.numeroOperacion = wr.operacionAnterior.credito.numeroOperacion;
    this.codigoBpm.setValue( wr.credito ? wr.credito.codigo : 'Sin asignar')
    this.proceso.setValue(   wr.proceso ? wr.proceso.proceso : 'Sin asignar');
    this.estadoProceso.setValue(wr.proceso ? wr.proceso.estadoProceso : 'Sin asignar');
    this.dataSourceTasacion.data = wr.tasacion ? wr.tasacion : wr.operacionAnterior.garantias ;
    this.dataSourceTasacion.data ? this.dataSourceTasacion.data.forEach(e=>{
      /* e.tipoOro = this.catTipoOro.find( x => x.codigo == e.codigoTipoOro ) ? this.catTipoOro.find( x => x.codigo == e.codigoTipoOro ).nombre: 'Error de Catalogo';
      e.descuentoPesoPiedra = e.descuentoPiedras;
      e.detallePiedras ? e.detallePiedras : 'Sin detalle';
      e.tipoJoya = this.catTipoJoya.find(x=> x.codigo == e.codigoTipoJoya) ? this.catTipoJoya.find(x=> x.codigo == e.codigoTipoJoya).nombre : 'Error en catalogo';
      e.estadoJoya = this.catEstadoJoya.find(x=> x.codigo == e.codigoEstadoJoya) ? this.catEstadoJoya.find(x=> x.codigo == e.codigoEstadoJoya).nombre : 'Error en catalogo';
      e.descripcion = e.descripcionJoya ? e.descripcionJoya : 'Sin descripcion'; 
      this.total++;
      e.total = this.total;*/
      this.totalPesoB += e.pesoBruto;
      this.totalPesoN += e.pesoNeto
      this.totalValorO += e.valorOro
      this.totalNumeroJoya += e.numeroPiezas
      this.totalValorA += e.valorAvaluo
      this.totalValorR += e.valorRealizacion
      this.totalValorC += e.valorComercial
    }) : null ;
    this.codigoOperacion.setValue(wr.operacionAnterior.credito.numeroOperacion);
    this.nombreCompleto.setValue(wr.operacionAnterior.cliente.nombreCompleto);
    this.cedulaCliente.setValue(wr.operacionAnterior.cliente.identificacion);
    this.validarProceso();
    this.sinNotSer.setNotice("SE HA CARGADO EL CREDITO: " + wr.operacionAnterior.credito.numeroOperacion + ".", "success");
    this.loadingSubject.next(false);
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
        this.par.getDiffBetweenDateInicioActual(this.credit.operacionAnterior.cliente.fechaNacimiento, 'dd/MM/yyyy').subscribe( (data: any) =>{
          console.log('Mi data de calcular edad ===>', data);
          if(data.entidad.year < valor && this.validCliente){
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
      this.cre.crearCreditoRenovacion(  this.seleccion, this.garantiasSimuladas, this.numeroOperacion,this.usuario, this.agencia,null).subscribe( data =>{
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
      this.cre.crearCreditoRenovacion(  this.seleccion, this.garantiasSimuladas, this.numeroOperacion,this.usuario, this.agencia,null).subscribe( data =>{
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
    if(this.seleccion){
      if(!this.credit.proceso){
        this.cre.crearCreditoRenovacion(  this.seleccion, this.garantiasSimuladas, this.numeroOperacion,this.usuario, this.agencia,null).subscribe( data =>{
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
    const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
      width: '800px',
      height: 'auto',
      data: data
    });
    dialogRefGuardar.afterClosed().subscribe((result: any) => {
      //console.log('envio de RESP ' + JSON.stringify(result) + ' typeof respuesta ' + typeof (result));
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
    if( this.seleccion ){
      this.cre.crearCreditoRenovacion( this.seleccion, this.garantiasSimuladas, this.numeroOperacion,this.usuario, this.agencia, this.credit.proceso? this.credit.proceso.idReferencia : null ).subscribe( data =>{
        if(data.entidad){
          this.credit = data.entidad;
          //console.log( 'Mi operacion ->', data.entidad );
          this.router.navigate(['cliente/gestion-cliente/NOV/',this.credit.proceso.idReferencia]);
        }
      });
    }else{
      this.sinNotSer.setNotice('Seleccione una opcion valida', 'error');
    }
  }
  public guardarSeleccion(row){
    this.seleccion = row;
  }
  public simularOpciones(){
    this.loadingSubject.next(true);
    let cliente = {} as cliente;
    cliente.identificacion = this.credit.operacionAnterior.cliente.identificacion;
    let fecha = new Date (this.credit.operacionAnterior.cliente.fechaNacimiento);
    let mes = (fecha.getMonth() < 10 ? fecha.getMonth() == 0 ? '12':'0'+fecha.getMonth() : fecha.getMonth())  
    cliente.fechaNacimiento = (fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate()) +'/' + mes +'/' + fecha.getFullYear(); 
    this.credit.operacionAnterior.cliente = cliente;
    //this.credit.operacionAnterior.fechaNacimiento = new Date (this.credit.operacionAnterior.cliente.fechaNacimiento);
    this.cal.simularOfertaRenovacion(this.riesgoTotal,this.credit.credito? this.credit.credito.cobertura? this.credit.credito.cobertura : 0 : 0,this.agencia, this.credit.operacionAnterior).subscribe( (data: any) =>{
      if(data.entidad){
        //console.log('Data de simulacion -->',data.entidad);
        data.entidad.simularResult.codigoError > 0 ? this.sinNotSer.setNotice("Error en la simulacion: "+ data.entidad.simularResult.mensaje, 'error')
          : this.sinNotSer.setNotice("Seleccione una opcion de credito para continuar", 'success') ;
        this.garantiasSimuladas = [];
        data.entidad.simularResult.xmlGarantias ? data.entidad.simularResult.xmlGarantias.garantias.garantia.forEach(e => {
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
}
