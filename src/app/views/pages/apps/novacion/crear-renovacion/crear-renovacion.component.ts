import { SolicitudDeExcepcionesComponent } from '../../../../partials/custom/popups/solicitud-de-excepciones/solicitud-de-excepciones.component';
import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DataInjectExcepciones } from '../../../../../core/model/wrapper/DataInjectExcepciones';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { environment } from '../../../../../../../src/environments/environment.prod';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
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
  public loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  private credit;
  private numeroOperacion;
  public fechaUtil: diferenciaEnDias;
  public seleccion;
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
  public fechaCuota = new FormControl();
  
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
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService
  ) { 
    this.formOperacion.addControl("codigoBpm", this.codigoBpm);
    this.formOperacion.addControl("codigoOperacion", this.codigoOperacion);
    this.formOperacion.addControl("proceso", this.proceso);
    this.formOperacion.addControl("estadoProceso", this.estadoProceso);
    this.formOperacion.addControl("nombreCompleto", this.nombreCompleto);
    this.formOperacion.addControl("cedulaCliente", this.cedulaCliente);
  }

  ngOnInit() {
    this.cargarCatalogos();
    this.subheaderService.setTitle('Negociación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.setFechaSistema();
    this.inicioDeFlujo();
  }
  /** @CREDITO */
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.numeroOperacion) {
        this.numeroOperacion = json.params.numeroOperacion;
        this.loadingSubject.next(true);
        this.cre.buscarRenovacion(json.params.numeroOperacion).subscribe((data: any) => {
          this.credit = data.entidad;
          console.log("datos ->", this.credit);
          if (this.credit ) {
            this.cargarCampos( this.credit  );
          }else{
            this.abrirSalirGestion("Error al intentar cargar el credito.");
          }
        });
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
    this.codigoBpm.setValue( wr.credito ? wr.credito.codigo : 'Sin asignar')
    this.proceso.setValue(   wr.proceso ? wr.proceso.proceso : 'Sin asignar');
    this.estadoProceso.setValue(wr.proceso ? wr.proceso.estadoProceso : 'Sin asignar');
    this.dataSourceTasacion.data = wr.tasacion ? wr.tasacion : wr.detalle.garantias ;
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
    this.codigoOperacion.setValue(wr.detalle.credito.numeroOperacion);
    this.nombreCompleto.setValue(wr.detalle.cliente.nombreCompleto);
    this.cedulaCliente.setValue(wr.detalle.cliente.identificacion);
    this.sinNotSer.setNotice("SE HA CARGADO EL CREDITO: " + wr.detalle.credito.numeroOperacion + ".", "success");
    this.loadingSubject.next(false);
  }
  public solicitarCobertura(){
    if(this.seleccion ){

    }

  }
  public abrirPopupExcepciones(data: DataInjectExcepciones) {
    this.loadingSubject.next(false);
    //data.idNegociacion = this.negoW.credito.tbQoNegociacion.id;
    const dialogRefGuardar = this.dialog.open(SolicitudDeExcepcionesComponent, {
      width: '800px',
      height: 'auto',
      data: data
    });
    dialogRefGuardar.afterClosed().subscribe((result: any) => {
      console.log('envio de RESP ' + JSON.stringify(result) + ' typeof respuesta ' + typeof (result));
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
      this.router.navigate(['cliente/gestion-cliente/NOV/',this.numeroOperacion]);
    }else{
      this.sinNotSer.setNotice('Seleccione una opcion valida', 'error');
    }
  }
  public guardarSeleccion(row){
    console.log('La seleccion ->',row);    
    this.seleccion = row;
  }
  public simularOpciones(){
    this.loadingSubject.next(true);
    let cliente = {} as cliente;
    cliente.identificacion = this.credit.detalle.cliente.identificacion;
    cliente.fechaNacimiento = this.credit.detalle.cliente.fechaNacimiento;
    this.credit.detalle.cliente = cliente;
    console.log('wrapper de salida ->', this.credit.detalle);
    this.cal.simularOfertaRenovacion(0,0,0,2, this.credit.detalle).subscribe( (data: any) =>{
      if(data.entidad){
        console.log('Data de simulacion -->',data.entidad);
        data.entidad.simularResult.codigoError > 0 ? this.sinNotSer.setNotice("Error en la simulacion: "+ data.entidad.simularResult.mensaje, 'error')
          : this.sinNotSer.setNotice("Seleccione una opcion de credito para continuar", 'success') ;
        this.dataSourceCreditoNegociacion.data = data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion;
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
      this.regresar();
    });
  }
  public validacionFecha() {
    this.fechaUtil = new diferenciaEnDias(new Date(this.fechaCuota.value), new Date(this.fechaServer))
    if (Math.abs(this.fechaUtil.obtenerDias()) >= 30 && Math.abs(this.fechaUtil.obtenerDias()) <= 45) {
      console.log("Esta dentro del rango")
    } else {
      this.sinNotSer.setNotice("DEBE ESCOGER ENTRE 30 Y 45 DÍAS", 'error');
    }
    console.log("los dias  de diferencia", this.fechaUtil.obtenerDias())
  }
  private setFechaSistema() {
    this.cre.getSystemDate().subscribe((fechaSistema: any) => {
      this.fechaServer = new Date(fechaSistema.entidad);
    })
  }
}
