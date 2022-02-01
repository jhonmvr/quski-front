import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TrackingService } from './../../../../../core/services/quski/tracking.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { TbQoTracking } from './../../../../../core/model/quski/TbQoTracking';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Page } from './../../../../../core/model/page';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'kt-list-tracking',
  templateUrl: './list-tracking.component.html',
  styleUrls: ['./list-tracking.component.scss']
})
export class ListTrackingComponent implements OnInit {
  catProceso:   Array<any>;
  cargardatos = new BehaviorSubject<boolean>(false);
  displayedColumns = [ 'accion','proceso','codigoBPM','codigoSoftbank','fechaCreacion','horaInicio', 'horaFin', 'tiempoTranscurrido', 'vendedor', 'aprobador', 'observacion'];

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
    //this.buscarBoton();
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
    p.sortDirections = 'asc';
    p.sortFields = 'id';
    return p;
  }
  buscarBoton(pageIndex?, pageSize?){
    
    if(pageIndex){
      this.p.size = pageSize;
      this.p.pageNumber = pageIndex;
    }else{
      this.p.size = 5;
      this.paginator.pageSize =5;
      this.paginator.pageIndex=0;
      this.p.pageNumber = 0;
    }
    
    
    this.tra.findTrakingByCodigoBpm(this.p, this.codigoBPM.value).subscribe((data: any) => {
      if (data.list != null) {
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.totalResults = data.totalResults;
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
    this.buscarBoton();
  }
  calcularTiempo( ms ){
    var duration = moment.duration(ms);
    if (duration.asHours() > 1) {
      return Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");
    } else {
      return moment.utc(duration.asMilliseconds()).format("mm:ss");
    }
  }

  calcularTotales(xd){
    const datos = this.dataSource.data;
    if(datos.length >0 ){
      return datos.map(t=>t[xd]).reduce((r, n) =>r+n,0);
    }
  }

  verDetalle(element){
    
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
