import { Component, OnInit, ViewChild, Input, SystemJsNgModuleLoader } from '@angular/core';
import { Page } from '../../../../../../core/model/page';
import { TbQoTracking } from "../../../../../../core/model/quski/TbQoTracking";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ProcesoTrackingEnum } from '../../../../../../core/enum/ProcesoTrackingEnum';
import { TrackingService } from '../../../../../../core/services/quski/tracking.service';
import { BehaviorSubject } from 'rxjs';
import { ReNoticeService } from '../../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from '../../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { AutorizacionService } from "../../../../../../core/services/autorizacion.service";
@Component({
  selector: 'kt-tabla-tracking',
  templateUrl: './tabla-tracking.component.html',
  styleUrls: ['./tabla-tracking.component.scss']
})
export class TablaTrackingComponent implements OnInit { 
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  @Input() proceso : ProcesoTrackingEnum = ProcesoTrackingEnum.COTIZACION;

  displayedColumns = ['proceso', 'codigoRegistro', 'actividad',  'fechaInicio', 'fechaAsignacion', 'fechaInicioAtencion', 'fechaFin',
   'estado', 'usuario', 'tiempoTotal',  'observacion'];
  /**Obligatorio paginacion */
  p = new Page();
  dataSource:MatTableDataSource<TbQoTracking> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', {static: true}) sort: MatSort;
  total: string;
  
  constructor(
    private autorizacionService: AutorizacionService,
    private trackingService: TrackingService,
    private sinNoticeService: ReNoticeService,
    private noticeService:ReNoticeService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    //this.titulo.setNotice("GESTION DE CLIENTES")
    this.loading = this.loadingSubject.asObservable();
    this.initiateTablePaginator();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      this.initiateTablePaginator();
      this.buscar();
    });
    this.initiateTablePaginator();
    this.buscar();
    this.verificar();
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
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string,pagina): Page {
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
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',this.paginator.pageIndex)
    this.submit();
  }

  
   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  buscar() {
    this.initiateTablePaginator();
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',0);
    this.submit();
  }
  getTiempoTotal() {
    return "00:20:20";
  }

  submit() {

    //console.log("====> paged: " + JSON.stringify( this.p ));
    this.loadingSubject.next(true);
    this.dataSource = null;
    this.trackingService.findAllTracking(this.p).subscribe((data: any) => {
      this.loadingSubject.next(false);
      //console.log("====> datos: " + JSON.stringify( data ));
      if (data.list) {      
        this.totalResults = data.totalResults;
        this.dataSource = new MatTableDataSource<TbQoTracking>(data.list);
        let hour :    number = 0;
        let minutes : number = 0;
        let segundo:  number = 0;
        for (let i = 0; i < this.dataSource.data.length; i++) {
          let a = +this.dataSource.data[i].tiempoTotal.slice(0,2);
          hour = hour + a;
          let b = +this.dataSource.data[i].tiempoTotal.slice(3,5);
          minutes = minutes + b;
          let c = +this.dataSource.data[i].tiempoTotal.slice(6,8);
          segundo = segundo + c;

          if (minutes >= 60) {
            minutes = 0;
            hour = hour + 1;
          }
          if(segundo >= 60){
            segundo = 0;
            minutes = minutes + 1;
          }
        }
        let hours
        if (hour < 10) {
          hours = "0"+hour;
        }else{
          hours = hour;
        }
        let minute
        if (minutes < 10) {
          minute = "0"+minutes;
        }else{
          minute = minutes;
        }
        let segundos
        if (segundo < 10) {
          segundos = "0"+segundo;
        }else{
          segundos = segundo;
        }
        this.total = hours+":"+minute+":"+segundos;  
        this.dataSource.paginator=this.paginator;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
      } else {
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }, error => {
      this.loadingSubject.next(false);
      if(  error.error ){
				this.noticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
			} else if(  error.statusText && error.status==401 ){
				this.dialog.open(AuthDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
			} else {
				this.noticeService.setNotice("Error al cargar las notificaciones o alertas", 'error');
			}
    }                                                                                                                                                                 
    );
  }
  verificar() {
    this.loadingSubject.next(true);
    this.autorizacionService.getUserByToken().subscribe((result: any) => {
      this.loadingSubject.next(false);
      if (result.entidad) {      

        console.log( "hola, si funciono ==>"+ result.entidad);
      } else {
        console.log( "hola, no funciono");
      }
    }, error => {
      this.loadingSubject.next(false);
      if(  error.error ){
				this.noticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
			} else if(  error.statusText && error.status==401 ){
				this.dialog.open(AuthDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
			} else {
				this.noticeService.setNotice("Error al cargar las notificaciones o alertas", 'error');
			}
    }
    );
  }
}