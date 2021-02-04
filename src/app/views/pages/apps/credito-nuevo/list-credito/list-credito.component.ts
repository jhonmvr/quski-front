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
  idAgencia: number;
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
}
@Component({
  selector: 'kt-list-credito',
  templateUrl: './list-credito.component.html',
  styleUrls: ['./list-credito.component.scss']
})
export class ListCreditoComponent implements OnInit {
  public loading;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  enableDevolucionButton;
  enableDevolucion = new BehaviorSubject<boolean>(false);
  public usuario: string;
  public rol: string;
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
  displayedColumns = ['accion', 'nombreCliente', 'identificacion', 'numeroOperacionMadre', 'numeroOperacion',
   'fechaSolicitud','fechaAprobacion','fechaVencimiento','montoFinanciado','saldo', 'estado' , 'tipoCredito', 'tablaArmotizacion' ,
   'plazo','numeroCuotas', 'impago','esMigrado', 'retanqueo' , 'coberturaInicial','coberturaActual', 'diasMora',
  'EstadoProcesoGarantia', 'EstadoUbicacionGrantia'];
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
    this.enableDevolucionButton = this.enableDevolucion.asObservable();
    this.enableDevolucion.next(false);
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.rol = "ASESOR";
    this.cargarCats();
    this.buscarCreditos();
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
    });
    this.sof.consultarAsesoresCS().subscribe( (data: any) =>{
      this.catAsesor = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
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
  public irDetalle(row: any){
    this.router.navigate(['credito-nuevo/detalle-credito/', row.numeroOperacion]);    
  }
  public irNovar(row: any){
    this.router.navigate(['novacion/crear-novacion/CRE', row.numeroOperacion]);    
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
      data.entidad && data.entidad.operaciones ?   
      this.cargarTabla( data.entidad ):
        this.sinNotSer.setNotice('No existen creditos relacionados', 'error') ; 
    });
  }
  private cargarTabla( data: any ){
    this.loadingSubject.next(false);
    this.dataSource.data = data.operaciones;
    this.dataSource.data.forEach(e=>{
      e.retanqueo = e.retanqueo ? 'SI' : 'NO';
      e.numeroOperacionMadre = e.numeroOperacionMadre ? e.numeroOperacionMadre : 'No aplica';
      e.impago = e.impago ? 'Si' : 'NO';
      e.esMigrado = e.esMigrado ? 'SI' : 'NO';
      e.tablaArmotizacion = e.codigoTipoTablaArmotizacionQuski;
      e.estado = this.catEstado ? this.catEstado.find(c => c.codigo == e.codigoEstadoOperacion) ? this.catEstado.find(c => c.codigo == e.codigoEstadoOperacion).nombre : 'Sin Estado' : 'Sin estado';
      e.estadoProcesoGarantia = this.catEstadoProcesoGarantia ? this.catEstadoProcesoGarantia.find(c => c.codigo == e.codigoEstadoProcesoGarantia) ? this.catEstadoProcesoGarantia.find(c => c.codigo == e.codigoEstadoProcesoGarantia).nombre : 'Sin Estado': 'Sin Estado';
      e.estadoUbicacionGrantia = this.catEstadoUbicacionGarantia? this.catEstadoUbicacionGarantia.find(c => c.codigo == e.codigoEstadoUbicacionGrantia) ? this.catEstadoUbicacionGarantia.find(c => c.codigo == e.codigoEstadoUbicacionGrantia).nombre : 'Sin Estado': 'Sin Estado';
      console.log("aqui")
      this.validateEstadoGarantiasForDevolucion(e.codigoEstadoProcesoGarantia,e.codigoEstadoUbicacionGrantia)
    
    });
    this.paginator.length = data.numeroTotalRegistros;
  }
  public paged() {
    this.construirWrapper(this.paginator.pageIndex + 1 , this.paginator.pageSize);
  }
  public construirWrapper(numeroPagina: number, tamanioPagina: number){
    if(this.formFiltro.valid){
      let w = {} as WrapperBusqueda;
      //w.esMigrado = null;
      w.numeroOperacionMupi = null;
      //console.log('La pagina 1 ->' , numeroPagina);
      w.numeroPagina = numeroPagina ? numeroPagina : 1;
      w.tamanioPagina = tamanioPagina ? tamanioPagina : 5;
      //console.log('La pagina 2 ->' , w.numeroPagina);
      w.numeroOperacionMadre = this.codigoOperacionMadre.value ? this.codigoOperacionMadre.value : null;
      w.numeroOperacion = this.codigoOperacion.value ? this.codigoOperacion.value : null;
      w.idAgencia = this.agencia.value ? this.agencia.value.id : null;
      w.codigoUsuarioAsesor = this.asesor.value ? this.asesor.value.codigo : null;
      w.identificacion = this.cedulaCliente.value ? this.cedulaCliente.value : null;
      w.plazo = this.plazo.value ? this.plazo.value : null;
      w.fechaInicioSolicitud = this.fechaCreacionDesde.value ? this.fechaCreacionDesde.value.getFullYear()+'-'+this.fechaCreacionDesde.value.getMonth()+'-'+ this.fechaCreacionDesde.value.getDate(): null;
      w.fechaFinSolicitud = this.fechaCreacionHasta.value ? this.fechaCreacionHasta.value.getFullYear()+'-'+this.fechaCreacionHasta.value.getMonth()+'-'+this.fechaCreacionHasta.value.getDate() : null;
      w.fechaInicioAprobacion = this.fechaAprobacionDesde.value ? this.fechaAprobacionDesde.value.getFullYear()+'-'+this.fechaAprobacionDesde.value.getMonth()+'-'+this.fechaAprobacionDesde.value.getDate() : null;
      w.fechaFinAprobacion = this.fechaAprobacionHasta.value ? this.fechaAprobacionHasta.value.getFullYear()+'-'+this.fechaAprobacionHasta.value.getMonth()+'-'+this.fechaAprobacionHasta.value.getDate() : null;
      w.fechaInicioVencimiento = this.fechaVencimientoDesde.value ? this.fechaVencimientoDesde.value.getFullYear()+'-'+this.fechaVencimientoDesde.value.getMonth()+'-'+this.fechaVencimientoDesde.value.getDate() : null;
      w.fechaFinVencimiento = this.fechaVencimientoHasta.value ? this.fechaVencimientoHasta.value.getFullYear()+'-'+this.fechaVencimientoHasta.value.getMonth()+'-'+this.fechaVencimientoHasta.value.getDate() : null;
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

  validateEstadoGarantiasForDevolucion(estadoProcesoG, estadoUbicacionG){
    console.log("estado proceso",estadoProcesoG)
    if (estadoProcesoG == 'UTI'){
      console.log('entro a UTI')
      if(estadoUbicacionG== 'AGE' ||  estadoUbicacionG== 'CUS'){
        this.enableDevolucion.next(true);
        console.log("deberia  funcar")

      }
    }
  }

  irDevolucion(row:any){
    console.log("row", row)
    console.log( this.catEstadoProcesoGarantia)
    let codeCredito = JSON.stringify(row)
    //this.encodeObjetos(row)
    console.log("codeCredito",codeCredito)
    this.router.navigate(['devolucion/solicitud-devolucion/', {objeto: codeCredito} ]);  
  }


  encodeObjetos(entrada){
   
    return  btoa(unescape(encodeURIComponent(JSON.stringify(entrada))))
  }
}
