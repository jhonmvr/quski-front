import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Page } from './../../../../../core/model/page';
import { TbQoTracking } from './../../../../../core/model/quski/TbQoTracking';
import { AutorizacionService } from './../../../../../core/services/autorizacion.service';
import { TrackingService } from './../../../../../core/services/quski/tracking.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from './../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { SubheaderService } from '../../../../../core/_base/layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnyCnameRecord } from 'dns';

@Component({
  selector: 'kt-list-tracking',
  templateUrl: './list-tracking.component.html',
  styleUrls: ['./list-tracking.component.scss']
})
export class ListTrackingComponent implements OnInit {
  [x: string]: any;

  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  displayedColumns = ['proceso', 'actividad', 'seccion', 'codigoBpm', 'codigoOperacionSoftbank', 'usuario', 'fechaCreacion', 'fechaActualizacion',
    'tiempoTotal', 'fecha'];
  /**Obligatorio paginacion */
  p = new Page();
  dataSource: MatTableDataSource<TbQoTracking> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  listProcesos: [];
  listActividad: [];
  listSeccion: [];
  entidadTrackingService: any;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  total: string;
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
    private autorizacionService: AutorizacionService,
    private trackService: TrackingService,
    private sinNoticeService: ReNoticeService,
    private noticeService: ReNoticeService,
    public dialog: MatDialog
  ) {


  }

  ngOnInit() {
    //this.submit();
    this.SelectProceso();
    this.loading = this.loadingSubject.asObservable();
    this.initiateTablePaginator();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      this.initiateTablePaginator();
      //this.submit();
      //this.buscar();
    });
    this.initiateTablePaginator();
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
    //console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }
  /**
  * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
  */
  paged() {
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', this.paginator.pageIndex)
    //this.submit();
    this.buscar();
  }



  buscar() {
    //this.dataSource.paginator = this.paginator;
    //this.initiateTablePaginator();
    
    let trackingWrapper = new TrakingWrapper();
    if (this.proceso.value)
      trackingWrapper.proceso = this.proceso.value;
    if (this.actividad.value)
      trackingWrapper.actividad = this.actividad.value;
    if (this.seccion.value)
      trackingWrapper.seccion = this.seccion.value;
    if (this.codigoBPM.value)
      trackingWrapper.codigoBpm = this.codigoBPM.value;
    if (this.codigoSoftbank.value)
      trackingWrapper.codigoOperacionSoftbank = this.codigoSoftbank.value;
    if (this.usuario.value)
      trackingWrapper.usuarioCreacion = this.usuario.value;
    if (this.fechaDesde.value )
      trackingWrapper.fechaCreacion = this.fechaDesde.value;
    if(this.fechaHasta.value)
    trackingWrapper.fechaCreacion = this.fechaHasta.value;


    this.trackService.busquedaTracking(trackingWrapper).subscribe((data: any) => {
      console.log("====> datos: " + JSON.stringify(data));

      if (data.list) {
        this.totalResults = data.totalResults;
        this.dataSource = new MatTableDataSource<TbQoTracking>(data.list);
        this.dataSource.paginator = this.paginator;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
      } else {
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }
    );

  }

  SelectProceso() {
    const listProcesos = this.trackService.listProceso(this.p).subscribe((data: any) => {
      this.listProcesos = data.entidades;
      console.log("Filtro para el combo --->>> ", this.listProcesos);

    });

  }
  SelectActividad() {
    const listActividad = this.trackService.listActividad(this.proceso.value).subscribe((data: any) => {
      this.listActividad = data.entidades;
      console.log("Filtro para la activi --->>> ", this.listActividad);
      this.listSeccion = null;
      this.actividad.setValue(null);
      this.seccion.setValue(null);
    },error=>{
      this.listActividad = null;
      this.listSeccion = null;
    });
  }
  SelectSeccion() {

    const listSeccion = this.trackService.listSeccion(this.actividad.value).subscribe((data: any) => {
      this.listSeccion = data.entidades;
      console.log("Filtro para la seccion --->>> ", this.listSeccion);

    },
    error=>{
      this.listSeccion = null;
    }
    );
  }

  /*submit() {
    //console.log("====> paged: " + JSON.stringify( this.p ));
    this.loadingSubject.next(true);
    this.dataSource = null;
    this.trackService.findAllTracking(this.p).subscribe((data: any) => {
      this.loadingSubject.next(false);
      console.log("====> datos: " + JSON.stringify(data));
      if (data.list) {
        this.totalResults = data.totalResults;
        this.dataSource = new MatTableDataSource<TbQoTracking>(data.list);

        this.dataSource.paginator = this.paginator;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
      } else {
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (error.error) {
        this.noticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: "Error " + error.statusText + " - " + error.message
          }
        });
      } else {
        this.noticeService.setNotice("Error al cargar las notificaciones o alertas", 'error');
      }
    });
  }*/

}

export class TrakingWrapper {
  "proceso": any
  "actividad": any
  "seccion": any
  "codigoBpm": any
  "codigoOperacionSoftbank": any
  "usuarioCreacion": any
  "fechaCreacion": any
 

  constructor() {

  }


}