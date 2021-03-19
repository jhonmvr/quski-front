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
  catSeccion:   Array<any>;
  catActividad: Array<any>;

  cargardatos = new BehaviorSubject<boolean>(false);
  displayedColumns = ['proceso', 'actividad', 'seccion', 'codigoBpm', 'codigoOperacionSoftbank', 'usuario', 'fechaCreacion', 'fechaActualizacion', 'tiempoTotal', 'fecha'];
  /**Obligatorio paginacion */
  p = new Page();
  dataSource: MatTableDataSource<TbQoTracking> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  total: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  public formCliente: FormGroup = new FormGroup({});
  public proceso = new FormControl('', [Validators.required, Validators.maxLength(30)]);
  public actividad = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public seccion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public codigoBPM = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  public codigoSoftbank = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  public usuario = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  public fechaDesde = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  public fechaHasta = new FormControl('', [Validators.required, Validators.maxLength(20)]);


  constructor(
    private tra: TrackingService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog
  ) {
    this.tra.setParameter();
  }

  ngOnInit() {
    this.tra.setParameter();

    this.traerEnums();
    this.initiateTablePaginator();
    this.buscar();
  }
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
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
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string, pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    ////console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }
  /**
  * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
  */
  paged() {
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'N', this.paginator.pageIndex);
    this.buscar();
  }
  public buscar() {
    this.cargardatos.next(true);
    let trackingWrapper = new TrakingWrapper();
    if (this.proceso.value)
      trackingWrapper.proceso = this.proceso.value.replace(/ /gi,"_");
    if (this.actividad.value)
      trackingWrapper.actividad = this.actividad.value.replace(/ /gi,"_");
    if (this.seccion.value)
      trackingWrapper.seccion = this.seccion.value.replace(/ /gi,"_");
    if (this.codigoBPM.value)
      trackingWrapper.codigoBpm = this.codigoBPM.value;
    if (this.codigoSoftbank.value)
      trackingWrapper.codigoOperacionSoftbank = this.codigoSoftbank.value;
    if (this.usuario.value)
      trackingWrapper.usuarioCreacion = this.usuario.value;
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
        })
        this.totalResults = data.totalResults;
        this.dataSource.paginator = this.paginator;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
        this.cargardatos.next(false);
      } else {
        this.initiateTablePaginator();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }
    );
  }
  private traerEnums() {
    this.tra.getActividadesProcesosAndSecciones().subscribe( (data: any) =>{
      if(data.entidad && data.entidad.procesos && data.entidad.actividades && data.entidad.secciones ){
        this.catProceso = data.entidad.procesos;
        this.catSeccion = data.entidad.secciones;
        this.catActividad = data.entidad.actividades;

      }
    });
  }

  /*  
  SelectActividad(event) {
    this.enviaprocess = this.proceso.value.replace(/ /gi, "_");
    const listActividad = this.tra.listActividad(this.enviaprocess).subscribe((data: any) => {
      let listActividad = data.entidades;
      this.a = listActividad.map(e => {
        return e.replace(/_/gi, " ");
      });
      this.listActividad = this.a;
      this.listSeccion = null;
      this.actividad.setValue(null);
      this.seccion.setValue(null);
    }, error => {
      this.listActividad = null;
      this.listSeccion = null;
    });
  }  
  SelectSeccion(event) {
    this.enviaActividad = this.actividad.value.replace(/ /gi, "_");
    const listSeccion = this.trackService.listSeccion(this.enviaActividad).subscribe((data: any) => {
      let listSeccion = data.entidades;
      this.s = listSeccion.map(e => {
        return e.replace(/_/gi, " ");
      });
      this.listSeccion = this.s;
    },
      error => { 
        this.listSeccion = null;
      }
    );
  }
  */
} 
export class TrakingWrapper {
  "proceso": any
  "actividad": any
  "seccion": any
  "codigoBpm": any
  "codigoOperacionSoftbank": any
  "usuarioCreacion": any
  //"fechaCreacion": any
  "fechaDesde": any
  "fechaHasta": any

  constructor() {

  }


}