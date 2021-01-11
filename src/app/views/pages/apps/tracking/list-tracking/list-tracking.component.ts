import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Page } from './../../../../../core/model/page';
import { TbQoTracking } from './../../../../../core/model/quski/TbQoTracking';
import { AutorizacionService } from './../../../../../core/services/autorizacion.service';
import { TrackingService } from './../../../../../core/services/quski/tracking.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-list-tracking',
  templateUrl: './list-tracking.component.html',
  styleUrls: ['./list-tracking.component.scss']
})
export class ListTrackingComponent implements OnInit {
  [x: string]: any;

  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  cargardatos = new BehaviorSubject<boolean>(false);
  displayedColumns = ['proceso', 'actividad', 'seccion', 'codigoBpm', 'codigoOperacionSoftbank', 'usuario', 'fechaCreacion', 'fechaActualizacion',
    'tiempoTotal', 'fecha'];
  /**Obligatorio paginacion */
  p = new Page();
  dataSource: MatTableDataSource<TbQoTracking> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  total: number;
  listActividad: [];
  actividades: any;
  procesos: any;
  listSeccion: [];
  entidadTrackingService: any;
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
    private trackService: TrackingService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog
  ) {
    this.trackService.setParameter();
  }

  ngOnInit() {
    this.trackService.setParameter();
    //this.submit();
    this.loading = this.loadingSubject.asObservable();
    this.SelectProceso();
    this.initiateTablePaginator();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    /*this.sort.sortChange.subscribe(() => {
      this.initiateTablePaginator();
      //this.submit();
      this.paged();
      //this.buscar();
    });*/
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
    //this.submit();
    this.buscar();
  }



  buscar() {
    //this.dataSource.paginator = this.paginator;
    //this.initiateTablePaginator();
    this.cargardatos.next(true);

    let trackingWrapper = new TrakingWrapper();
    if (this.proceso.value)
      trackingWrapper.proceso = this.enviaprocess;
    if (this.actividad.value)
      trackingWrapper.actividad = this.enviaActividad;
    if (this.seccion.value)
      trackingWrapper.seccion = this.seccion.value.replace(/ /gi, "_");
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

    //console.log("datos enviando", this.p, trackingWrapper);
    this.trackService.busquedaTracking(this.p, trackingWrapper).subscribe((data: any) => {
      // //console.log("====> datos: " + JSON.stringify(data));

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

  SelectProceso() {
    const listProcesos = this.trackService.listProceso(this.p).subscribe((data: any) => {
      let listProcesos = data.entidades;
      //console.log("Busqueda proceso --->>> ", listProcesos);
      this.e = listProcesos.map(e => {
        return e.replace(/_/gi, " ");
      });
      this.procesos = this.e;
      //console.log("Elimina guion --->>> ", this.procesos);
    });

  }
  SelectActividad(event) {
    this.enviaprocess = this.proceso.value.replace(/ /gi, "_");
    //console.log("Envia proceso con guion --->>> ", this.enviaprocess);
    const listActividad = this.trackService.listActividad(this.enviaprocess).subscribe((data: any) => {
      let listActividad = data.entidades;
      //console.log("Filtro para la activi --->>> ", this.listActividad);

      this.a = listActividad.map(e => {
        return e.replace(/_/gi, " ");
      });
      this.listActividad = this.a;
      //console.log("Elimina guion --->>> ", this.listActividad);

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
      //console.log("Filtro para la seccion --->>> ", this.listSeccion);

      this.s = listSeccion.map(e => {
        return e.replace(/_/gi, " ");
      });
      this.listSeccion = this.s;
      //console.log("Elimina guion --->>> ", this.listSeccion);

    },
      error => { 
        this.listSeccion = null;
      }
    );
  }

  /*submit() {
    ////console.log("====> paged: " + JSON.stringify( this.p ));
    this.loadingSubject.next(true);
    this.dataSource = null;
    this.trackService.findAllTracking(this.p).subscribe((data: any) => {
      this.loadingSubject.next(false);
      //console.log("====> datos: " + JSON.stringify(data));
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
  //"fechaCreacion": any
  "fechaDesde": any
  "fechaHasta": any

  constructor() {

  }


}