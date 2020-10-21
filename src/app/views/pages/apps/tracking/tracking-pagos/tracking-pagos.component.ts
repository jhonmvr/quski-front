import { Component, OnInit, ViewChild, Input, SystemJsNgModuleLoader } from '@angular/core';
import { Page } from '../../../../../core/model/page';
import { TbQoTracking } from "../../../../../core/model/quski/TbQoTracking";
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { BehaviorSubject } from 'rxjs';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from '../../../../partials/custom/auth-dialog/auth-dialog.component';
import { AutorizacionService } from "../../../../../core/services/autorizacion.service";

@Component({
  selector: 'kt-tracking-pagos',
  templateUrl: './tracking-pagos.component.html',
  styleUrls: ['./tracking-pagos.component.scss']
})
export class TrackingPagosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  displayedColumns = ['codigoRegistro', 'actividad',  'fechaInicio', 'fechaAsignacion', 'fechaInicioAtencion',
   'situacion', 'usuario', 'tiempoTotal'];
  /**Obligatorio paginacion */
  p = new Page();
  dataSource:MatTableDataSource<TbQoTracking> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  fFini;
  fF;
  fIni;
  fI;
  hour = [];
  minutes = [];
  segundo = [];
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
    //this.verificar();
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
    function addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }
    //console.log("====> paged: " + JSON.stringify( this.p ));
    this.loadingSubject.next(true);
    this.dataSource = null;
    this.trackingService.findAllTracking(this.p).subscribe((data: any) => {
      this.loadingSubject.next(false);
      //console.log("====> datos: " + JSON.stringify( data ));
      if (data.list) {            
        this.totalResults = data.totalResults;
        this.dataSource = new MatTableDataSource<TbQoTracking>(data.list);
        console.log(" daos registro pagos ", data.list);
        //Tracking fecha
        for (let i = 0; i < this.dataSource.data.length; i++) {
          let a = this.dataSource.data[i].fechaInicio;
          this.fIni = new Date(a);
          this.fI = this.fIni.toTimeString();
          //console.log("Hora inicio >>>> ", this.fI)
        }
        
        for (let i = 0; i < this.dataSource.data.length; i++) {
          let a = this.dataSource.data[i].fechaFin;
          this.fFini = new Date(a);
          this.fF = this.fFini.toTimeString();
          //console.log("Hora Fin >>>> ", this.fF) 
        }
      
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
 
}