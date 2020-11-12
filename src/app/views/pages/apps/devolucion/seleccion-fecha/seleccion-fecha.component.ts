import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { BusquedaDevolucionWrapper } from '../../../../../core/model/quski/BusquedaDevolucionWrapper';
import { Page } from '../../../../../core/model/page';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { AddFechaComponent } from '../../../../partials/custom/add-fecha/add-fecha.component';

@Component({
  selector: 'kt-seleccion-fecha',
  templateUrl: './seleccion-fecha.component.html',
  styleUrls: ['./seleccion-fecha.component.scss']
})
export class SeleccionFechaComponent implements OnInit {
  //public formFiltros: FormGroup = new FormGroup({});
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  selection = new SelectionModel<Element>(true, []);
 
  idReferenciaHab:string="1";

  codigoOperacion = new FormControl('', []);
  codigoOperacionMadre = new FormControl('', []);
  agencia = new FormControl('', []);
  proceso = new FormControl('', []);
  estado = new FormControl('', []); 
  fechaCreacionDesde = new FormControl('', []);
  fechaCreacionFin = new FormControl('', []);
  fechaVencimientoDesde = new FormControl('', []);
  fechaVencimientoFin = new FormControl('', []);
  fechaAprobacionDesde = new FormControl('', []);
  fechaAprobacionFin = new FormControl('', []);
  tipoCredito = new FormControl('', []);
  cliente = new FormControl('', []);
  cedulaCliente = new FormControl('', []);
  plazo = new FormControl('', []);
  opciones = ['SI', 'NO']

  displayedColumns = ['accion', 'fechaSolicitud', 'agenciaSolicitud', 'agenciaEntrega', 'codigoOperacionMadre', 'codigoOperacion',
   'nombreCliente', 'identificacion', 'fundaMadre' , 'fundaActual', 'ciudadTevcol' ,  'fechaArriboAgencia', 'nombreAsesor', 'fechaAprobacion'];
  /**Obligatorio paginacion */
  p = new Page();
  dataSource:MatTableDataSource<TbQoCliente>=new MatTableDataSource<TbQoCliente>();
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', {static: true}) sort: MatSort;
  
  wrapperBusquedaDevolucion = {
    
  }

  constructor(public ds: DevolucionService,
    
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private noticeService:ReNoticeService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddFechaComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
     
     }

  ngOnInit() {
  
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Gestion credito');
    this.initiateTablePaginator();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      console.log("sort changed "  );
      this.initiateTablePaginator();
      this.buscar();
    });
    
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
  //  this.submit();
  }

  
   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  buscar() {
    this.initiateTablePaginator();
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',0);
    this.submit();
  }


  submit() {
    let busquedaDevWrapper = new BusquedaDevolucionWrapper
    busquedaDevWrapper.codigoOperacion = this.codigoOperacion.value.toUpperCase()
    busquedaDevWrapper.agencia = this.agencia.value.toUpperCase()
    busquedaDevWrapper.fechaAprobacionDesde = this.fechaAprobacionDesde.value
    busquedaDevWrapper.fechaAprobacionHasta = this.fechaAprobacionFin.value
    busquedaDevWrapper.identificacion = this.cedulaCliente.value


    //console.log("====> paged: " + JSON.stringify( this.p ));
    this.loadingSubject.next(true);
    this.dataSource = null;
    this.ds.busquedaSeleccionarFechas(busquedaDevWrapper).subscribe((data:any)=>{
      if(data){
        console.log(data)
      }
    })

}


  isCheck(row): boolean {
    if (this.selection.selected.find(c => c.id == row.id)) {
      return true;
    } else {
      return false;
    }
  }

  addRemove(row) {
    if (this.selection.isSelected(row.id)) {
      this.selection.deselect(row.id);
    } else {
      this.selection.select(row.id);
    }
  }

  eliminarSelect() {
    this.selection.clear();
  }

  seleccionarFecha(){

    const dialogRef = this.dialog.open(AddFechaComponent, {
      width: '650px',
      height: 'auto',
      data: this.dataSource.data
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        //console.log("resultado dialog " + JSON.stringify(resultado.id));
        //CAMBIAR POR EL METODO QUE TRAE TODAS LAS JOYAS POR ID COTIZACION
     
          //console.log("data>>>>>>>>>>>>>>>>>" + JSON.stringify(data));
        //  this.limpiarCampos();
  

      }

    });
  }

}