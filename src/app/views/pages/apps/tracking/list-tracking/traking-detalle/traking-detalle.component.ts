import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Page } from '../../../../../../../app/core/model/page';
import { TbQoTracking } from '../../../../../../../app/core/model/quski/TbQoTracking';
import { TrackingService } from '../../../../../../../app/core/services/quski/tracking.service';
import { ReNoticeService } from '../../../../../../../app/core/services/re-notice.service';

@Component({
  selector: 'kt-traking-detalle',
  templateUrl: './traking-detalle.component.html',
  styleUrls: ['./traking-detalle.component.scss']
})
export class TrakingDetalleComponent implements OnInit {
  catProceso:   Array<any>;
  cargardatos = new BehaviorSubject<boolean>(false);
  displayedActividad = [ 'proceso','codigoBPM','codigoSoftbank','fechaCreacion','actividad', 'tiempoTranscurrido', 'usuario'];
  displayedSeccion = [ 'proceso','codigoBPM','codigoSoftbank','fechaCreacion','actividad', 'seccion', 'usuario', 'horaInicio', 'horaFin', 'tiempoTranscurrido','observacion'];
  displayedSeccionConsolidado = [ 'proceso','codigoBPM','seccion','tiempoTranscurrido'];
  displayedArea = [ 'proceso','codigoBPM','fechaCreacion','area', 'tiempoTranscurrido'];
  displayedColumns = this.displayedActividad;
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
 

}