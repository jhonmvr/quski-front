import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { environment } from '../../../../../../../src/environments/environment.prod';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface WrapperBusqueda{
  numeroOperacionMadre: string;
  numeroOperacionMupi: string;
  numeroOperacion: string;
  idAgencia;
  codigoUsuarioAsesor: string;
  identificacion: string;
  plazo: number;
  fechaInicioSolicitud: string;
  fechaFinSolicitud: string;
  fechaInicioAprobacion: string;
  fechaFinAprobacion: string;
  fechaInicioVencimiento: string;
  fechaFinVencimiento: string;
  codigoEstadoOperacion: string;
  nombreCliente: string;
  esCuotas: boolean;
  impago: boolean;
  esMigrado: boolean;
  retanqueo: boolean;
  numeroPagina: number;
  tamanioPagina: number;
  codigoEstadoProceso;
  codigoEstadoUbicacion;
}
@Component({
  selector: 'kt-list-credito',
  templateUrl: './list-credito.component.html',
  styleUrls: ['./list-credito.component.scss']
})
export class ListCreditoComponent implements OnInit {
  public loading;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public usuario: string;
  /** @FILTROS **/
  public formFiltro: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('', []);
  public codigoOperacionMadre = new FormControl('', []);
  public asesor = new FormControl('', []);
  public nombreCliente = new FormControl('', []);
  public cedulaCliente = new FormControl('', []);
  public agencia = new FormControl('', []);
  public fechaCreacionDesde = new FormControl('', []);
  public fechaCreacionHasta = new FormControl('', []);
  public fechaVencimientoDesde = new FormControl('', []);
  public fechaVencimientoHasta = new FormControl('', []);
  public fechaAprobacionDesde = new FormControl('', []);
  public fechaAprobacionHasta = new FormControl('', []);
  public tipoCredito = new FormControl('', []);
  public estado = new FormControl('', []); 
  public plazo = new FormControl('', []);
  public impago = new FormControl('', []);
  public retanqueo = new FormControl('', []);

  /** @CATALOGOS **/
  public catDecision = [{valor: true, nombre: 'SI'}, {valor: false, nombre: 'NO'}];
 public catEstado: Array<any>;
 public catEstadoProcesoGarantia: Array<any>;
 public catEstadoUbicacionGarantia: Array<any>;
 public catAgencia: Array<any>;
 public catAsesor: Array<any>;


  /** @CREDITOS **/
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['navegar','accion', 'nombreCliente', 'identificacion', 'numeroOperacionMadre', 'numeroOperacion',
  // 'fechaSolicitud',
   'fechaAprobacion','fechaVencimiento','montoFinanciado','saldo', 'estado' , 'tipoCredito','retanqueo',
   'plazo','numeroCuotas', 'impago','esMigrado',  'coberturaInicial','coberturaActual', 'diasMora',
  'EstadoProcesoGarantia', 'EstadoUbicacionGrantia','bloqueo','numeroCash','valorDesembolso', 'tablaArmotizacion'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private sinNotSer: ReNoticeService,
    private router: Router,
    private sof: SoftbankService,
		public dialog: MatDialog) {
      this.sof.setParameter();
      this.formFiltro.addControl("codigoOperacion", this.codigoOperacion);
      this.formFiltro.addControl("codigoOperacionMadre", this.codigoOperacionMadre);
      this.formFiltro.addControl("asesor", this.asesor);
      this.formFiltro.addControl("nombreCliente", this.nombreCliente);
      this.formFiltro.addControl("cedulaCliente", this.cedulaCliente);
      this.formFiltro.addControl("agencia", this.agencia);
      this.formFiltro.addControl("fechaCreacionDesde", this.fechaCreacionDesde);
      this.formFiltro.addControl("fechaCreacionHasta", this.fechaCreacionHasta);
      this.formFiltro.addControl("fechaVencimientoDesde", this.fechaVencimientoDesde);
      this.formFiltro.addControl("fechaVencimientoHasta", this.fechaVencimientoHasta);
      this.formFiltro.addControl("fechaAprobacionDesde", this.fechaAprobacionDesde);
      this.formFiltro.addControl("fechaAprobacionHasta", this.fechaAprobacionHasta);
      this.formFiltro.addControl("tipoCredito", this.tipoCredito);
      this.formFiltro.addControl("estado", this.estado);
      this.formFiltro.addControl("plazo", this.plazo);
      this.formFiltro.addControl("impago", this.impago);
      this.formFiltro.addControl("retanqueo", this.retanqueo);
     }

  ngOnInit() {
    this.sof.setParameter();
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.asesor.setValue(this.usuario);
    
    this.cargarCats();
    
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * *  * @FUNCIONALIDAD ** */
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  private cargarCats(){
    this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
      this.catAgencia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
    this.sof.consultarEstadoOperacionQuskiCS().subscribe( (data: any) =>{
      this.catEstado = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
      this.estado.setValue( this.catEstado.find(p=> p.codigo == "AFE"));

      let w = {} as WrapperBusqueda;
      w.numeroPagina =  1;
      this.paginator.pageIndex = w.numeroPagina - 1;
      w.tamanioPagina =  5;
      this.paginator.pageSize = w.tamanioPagina         
      w.codigoUsuarioAsesor = this.asesor.value ? this.asesor.value : null;
      w.codigoEstadoOperacion = this.estado.value ? this.estado.value.codigo : null;
      this.buscarCreditos(w);
    });/* 
    this.sof.consultarAsesoresCS().subscribe( (data: any) =>{
      this.catAsesor = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    }); */
    this.sof.consultarEstadoProcesoCS().subscribe( (data: any) =>{
      this.catEstadoProcesoGarantia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
    this.sof.consultarEstadoUbicacionCS().subscribe( (data: any) =>{
      this.catEstadoUbicacionGarantia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
  }
  public irNegociacion(){
    this.router.navigate(['negociacion/gestion-negociacion']);    
  }
  public irRegistrarPago(row: any){
    this.router.navigate(['credito-nuevo/registrar-pago/', btoa(JSON.stringify(row)) ]);    
  }
  public irDetalle(row: any){
    this.router.navigate(['credito-nuevo/detalle-credito/', row.numeroOperacion]);    
  }
  public irCompromisoPago(row: any, creacion: boolean){
    if(creacion){
      this.router.navigate(['aprobador/compromiso-pago/create/request/', row.numeroOperacion]);    
    }else{
      this.router.navigate(['aprobador/compromiso-pago/update/request/', row.numeroOperacion]);    
    }
  }
  public irNovar(row: any){
    
    this.router.navigate(['negociacion/crear-novacion/CRE', row.numeroOperacion]);    
    
  }
  irDevolucion(row:any){
    this.router.navigate(['devolucion/solicitud-devolucion/NUEV/', row.numeroOperacion ]);  
  }
  public limpiarFiltros(){
    Object.keys(this.formFiltro.controls).forEach((name) => {
      const control = this.formFiltro.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue("");
    });
    this.buscarCreditos();
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private buscarCreditos(wrapper?: WrapperBusqueda) {
    this.loadingSubject.next(true);
    wrapper = wrapper ? wrapper : { numeroPagina: 1, tamanioPagina: 5 } as WrapperBusqueda;

    this.sof.buscarCreditos(wrapper).subscribe( (data: any) =>{
      data && data.operaciones ?   
      this.cargarTabla( data ):
        this.sinNotSer.setNotice('No existen creditos relacionados', 'error') ; 
    },error=>{this.loadingSubject.next(false);});
  }
  private cargarTabla( data: any ){
    this.loadingSubject.next(false);
    this.dataSource.data = data.operaciones;
    this.dataSource.data.forEach(e=>{
      e.numeroOperacionMadre = e.numeroOperacionMadre ? e.numeroOperacionMadre : 'No aplica';
      e.tablaArmotizacion = e.codigoTipoTablaArmotizacionQuski;
      e.estado = this.catEstado ? this.catEstado.find(c => c.codigo == e.codigoEstadoOperacion) ? this.catEstado.find(c => c.codigo == e.codigoEstadoOperacion).nombre : e.codigoEstadoOperacion : e.codigoEstadoOperacion;
      e.bloqueo = e.datosBloqueo && e.datosBloqueo.codigoMotivoBloqueo ? e.datosBloqueo.codigoMotivoBloqueo : ''
      console.log(e.bloqueo);
      e.estadoProcesoGarantia = this.catEstadoProcesoGarantia ? this.catEstadoProcesoGarantia.find(c => c.codigo == e.codigoEstadoProcesoGarantia) ? this.catEstadoProcesoGarantia.find(c => c.codigo == e.codigoEstadoProcesoGarantia).nombre : e.codigoEstadoProcesoGarantia: e.codigoEstadoProcesoGarantia;
      e.estadoUbicacionGrantia = this.catEstadoUbicacionGarantia? this.catEstadoUbicacionGarantia.find(c => c.codigo == e.codigoEstadoUbicacionGrantia) ? this.catEstadoUbicacionGarantia.find(c => c.codigo == e.codigoEstadoUbicacionGarantia).nombre : e.codigoEstadoUbicacionGarantia: e.codigoEstadoUbicacionGarantia;
    
    });
    this.paginator.length = data.numeroTotalRegistros;
  }
  public paged() {
    this.construirWrapper(this.paginator.pageIndex + 1, this.paginator.pageSize);
  }
  public construirWrapper(numeroPagina: number, tamanioPagina: number){
    if(this.formFiltro.valid){
      let w = {} as WrapperBusqueda;
      w.numeroPagina = numeroPagina ? numeroPagina : 1;
      this.paginator.pageIndex = w.numeroPagina - 1;
      w.tamanioPagina = tamanioPagina ? tamanioPagina : 5;
      this.paginator.pageSize = w.tamanioPagina         
      w.numeroOperacionMupi = null;
      w.numeroOperacionMadre = this.codigoOperacionMadre.value ? this.codigoOperacionMadre.value : null;
      w.numeroOperacion = this.codigoOperacion.value ? this.codigoOperacion.value : null;
      w.idAgencia = this.agencia.value ? this.agencia.value.id : null;
      w.codigoUsuarioAsesor = this.asesor.value ? this.asesor.value : null;
      w.identificacion = this.cedulaCliente.value ? this.cedulaCliente.value : null;
      w.plazo = this.plazo.value ? this.plazo.value : null;
      w.fechaInicioSolicitud = this.fechaCreacionDesde.value ? this.fechaCreacionDesde.value.getFullYear()+'-'+
              ('00' + (this.fechaCreacionDesde.value.getMonth()+1)).slice(-2)+'-'+ ('00' +this.fechaCreacionDesde.value.getDate()).slice(-2): null;
      w.fechaFinSolicitud = this.fechaCreacionHasta.value ? this.fechaCreacionHasta.value.getFullYear()+'-'+
              ('00' + (this.fechaCreacionHasta.value.getMonth()+1)).slice(-2)+'-'+('00' +this.fechaCreacionHasta.value.getDate()).slice(-2) : null;
      w.fechaInicioAprobacion = this.fechaAprobacionDesde.value ? this.fechaAprobacionDesde.value.getFullYear()+'-'+
              ('00' + (this.fechaAprobacionDesde.value.getMonth()+1)).slice(-2)+'-'+ ('00' + this.fechaAprobacionDesde.value.getDate()).slice(-2) : null;
      w.fechaFinAprobacion = this.fechaAprobacionHasta.value ? this.fechaAprobacionHasta.value.getFullYear()+'-'+
              ('00' + (this.fechaAprobacionHasta.value.getMonth()+1)).slice(-2)+'-'+('00' +this.fechaAprobacionHasta.value.getDate()).slice(-2) : null;
      w.fechaInicioVencimiento = this.fechaVencimientoDesde.value ? this.fechaVencimientoDesde.value.getFullYear()+'-'+
              ('00' + (this.fechaVencimientoDesde.value.getMonth()+1)).slice(-2)+'-'+('00' +this.fechaVencimientoDesde.value.getDate() ).slice(-2): null;
      w.fechaFinVencimiento = this.fechaVencimientoHasta.value ? this.fechaVencimientoHasta.value.getFullYear()+'-'+
              ('00' + (this.fechaVencimientoHasta.value.getMonth()+1)).slice(-2)+'-'+('00' +this.fechaVencimientoHasta.value.getDate()).slice(-2) : null;
      w.codigoEstadoOperacion = this.estado.value ? this.estado.value.codigo : null;
      w.nombreCliente = this.nombreCliente.value ? this.nombreCliente.value : null;
      w.esCuotas = this.tipoCredito.value ? this.tipoCredito.value.valor : null;
      w.impago = this.impago.value ? this.impago.value.valor : null;
      w.retanqueo = this.retanqueo.value ? this.retanqueo.value.valor : null;
      
      this.buscarCreditos( w );
    } else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');
    }
  }

  buscarCreditosMadre(row){
    
    let w = {} as WrapperBusqueda;
    w.numeroPagina = 1;
    w.tamanioPagina = 50;
    w.numeroOperacionMadre = row.numeroOperacionMadre;
    this.buscarCreditos( w );   
  }
  buscarProcesos(row){
    this.router.navigate(['negociacion/bandeja-operaciones/', row.numeroOperacion ]);
  }
}
