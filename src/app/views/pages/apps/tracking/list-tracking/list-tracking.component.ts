import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TrackingService } from './../../../../../core/services/quski/tracking.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { TbQoTracking } from './../../../../../core/model/quski/TbQoTracking';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Page } from './../../../../../core/model/page';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-list-tracking',
  templateUrl: './list-tracking.component.html',
  styleUrls: ['./list-tracking.component.scss']
})
export class ListTrackingComponent implements OnInit {
  catProceso:   Array<any>;
  cargardatos = new BehaviorSubject<boolean>(false);
  displayedColumns = [ 'codigoBpm','codigoOperacionSoftbank','proceso','actividad','seccion', 'usuario', 'fechaCreacion', 'fechaActualizacion', 'tiempoTotal', 'fecha'];

  /**Obligatorio paginacion */
  p = new Page();
  dataSource: MatTableDataSource<TbQoTracking> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  totalTiempo: number;
  total: number;
  pageSize = 5;
  currentPage;

  public formCliente: FormGroup = new FormGroup({});
  public proceso = new FormControl('', [Validators.maxLength(50)]);
  public actividad = new FormControl('', [Validators.maxLength(50)]);
  public seccion = new FormControl('', [Validators.maxLength(50)]);
  public codigoBPM = new FormControl('', [Validators.maxLength(50)]);
  public codigoSoftbank = new FormControl('', [Validators.maxLength(50)]);
  public usuario = new FormControl('', [Validators.maxLength(50)]);
  public fechaDesde = new FormControl('', []);
  public fechaHasta = new FormControl('', []);


  constructor(
    private tra: TrackingService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog
  ) {
    this.tra.setParameter();

    this.formCliente.addControl("proceso", this.proceso);
    this.formCliente.addControl("actividad", this.actividad);
    this.formCliente.addControl("seccion", this.seccion);
    this.formCliente.addControl("codigoBPM", this.codigoBPM);
    this.formCliente.addControl("codigoSoftbank", this.codigoSoftbank);
    this.formCliente.addControl("usuario", this.usuario);
    this.formCliente.addControl("fechaDesde", this.fechaDesde);
    this.formCliente.addControl("fechaHasta", this.fechaHasta);
  }

  ngOnInit() {
    this.tra.setParameter();
    this.traerEnums();
    this.initiateTablePaginator();
    this.buscarBoton();
  }
  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }
  /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  getPaginacion(paginado: string, pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.isPaginated = paginado;
    return p;
  }
  /**
  * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
  */
  paged() {
    this.p = this.getPaginacion('Y', this.paginator.pageIndex);
    this.buscar();
  }
  buscarBoton(){
    this.dataSource.paginator = this.paginator;
    this.p = this.getPaginacion('Y', 0);
    this.buscar();
  }
  public buscar() {
    this.cargardatos.next(true);
    this.totalTiempo = 0;
    let trackingWrapper = new TrakingWrapper();
    if (this.proceso.value)
      trackingWrapper.proceso = this.proceso.value.replace(/ /gi,"_");
    if (this.actividad.value)
      trackingWrapper.actividad = this.actividad.value.toUpperCase();
    if (this.seccion.value)
      trackingWrapper.seccion = this.seccion.value;
    if (this.codigoBPM.value)
      trackingWrapper.codigoBpm = this.codigoBPM.value;
    if (this.codigoSoftbank.value)
      trackingWrapper.codigoOperacionSoftbank = this.codigoSoftbank.value;
    if (this.usuario.value)
      trackingWrapper.usuarioCreacion = this.usuario.value.toLowerCase();
    if (this.fechaDesde.value)
      trackingWrapper.fechaDesde = this.fechaDesde.value;
    if (this.fechaHasta.value)
      trackingWrapper.fechaHasta = this.fechaHasta.value;

    this.tra.busquedaTracking(this.p, trackingWrapper).subscribe((data: any) => {
      if (data.list != null) {
        
        this.dataSource = new MatTableDataSource<TbQoTracking>(data.list);
        this.dataSource.data.forEach(e => {
          e.proceso = e.proceso.replace(/_/gi, " ");
          e.actividad = e.actividad.replace(/_/gi, " ");
          e.seccion = e.seccion.replace(/_/gi, " ");
          this.totalTiempo = this.totalTiempo + e.tiempoTranscurrido;
        })
        this.totalResults = data.totalResults;
        //this.dataSource.paginator = this.paginator;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
        this.cargardatos.next(false);
      } else {
        this.cargardatos.next(false);
        this.initiateTablePaginator();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }
    );
  }
  private traerEnums() {
    this.tra.getActividadesProcesosAndSecciones().subscribe( (data: any) =>{
      if(data.entidad && data.entidad.procesos){
        this.catProceso = data.entidad.procesos;
      }
    });
  }
  public limpiarFiltros(){
    Object.keys(this.formCliente.controls).forEach((name) => {
      const control = this.formCliente.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.buscar();
  }
  calcularTiempo( timeElem ){
    // element.tiempoTranscurrido >= 3600000 ? (element.tiempoTranscurrido - 25200000 | date : 'h:mm:ss') : (element.tiempoTranscurrido | date : 'mm:ss') 
    // totalTiempo >= 3600000 ? (totalTiempo - 25200000 | date : 'h:mm:ss') : (totalTiempo | date : 'mm:ss') 
    if(timeElem >= 3600000 ){
      let time : Date = new Date(timeElem - 25200000);
      let construc = time.getHours()+":"+( time.getMinutes() >= 10 ? time.getMinutes() : "0"+time.getMinutes() )+":"+time.getSeconds();
      return construc;
    }
    let time : Date = new Date(timeElem);
    return "00:"+( time.getMinutes() >= 10 ? time.getMinutes() : "0"+time.getMinutes() )+":"+time.getSeconds();

  }
}
  export class TrakingWrapper {
  proceso: any
  actividad: any
  seccion: any
  codigoBpm: any
  codigoOperacionSoftbank: any
  usuarioCreacion: any
  fechaDesde: any
  fechaHasta: any
  constructor() {}
}
