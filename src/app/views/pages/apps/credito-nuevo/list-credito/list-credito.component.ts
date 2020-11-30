import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Page } from '../../../../../core/model/page';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';

@Component({
  selector: 'kt-list-credito',
  templateUrl: './list-credito.component.html',
  styleUrls: ['./list-credito.component.scss']
})
export class ListCreditoComponent implements OnInit {

  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);

 
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

  displayedColumns = ['accion', 'cliente', 'codigoOperacion', 'fechaCreacion', 'fechaVencimiento',
   'montoOperacion', 'asesor', 'estadoOperacion' , 'tipoCredito', 'codigoTablaAmortizacion' ,
   'impago', 'retanqueo', 'coberturaActual' , 'coberturaInicial','descripcionBloqueo', 'diasMora',
  'estadoUbicacion', 'estadoProceso'];
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
  
  

  constructor(public cs: CreditoNegociacionService,
    private clienteService: ClienteService,
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private noticeService:ReNoticeService,
		public dialog: MatDialog) {
      this.clienteService.setParameter();
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
   // this.submit();
  }
/*

  submit() {
    //console.log("====> paged: " + JSON.stringify( this.p ));
    this.loadingSubject.next(true);
    this.dataSource = null;
    this.clienteService.findClienteByParams(this.p, this.identificacionCliente.value, this.nombreCliente.value, this.apellidoCliente.value
      ,null,null,null,null,null,null,null,null,null).subscribe((data: any) => {
      this.loadingSubject.next(false);
      //console.log("====> datos: " + JSON.stringify( data ));
      if (data.list) {
       
        this.totalResults = data.totalResults;
    //    this.dataSource = new MatTableDataSource<TbQoCliente>(data.list);
        //this.dataSource.paginator=this.paginator;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'info');
      } else {
        this.sinNoticeService.setNotice("NO SE ENCONTRAR REGISTROS", 'success');
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

  editarUsuario() {
    [{
      path: 'add/:id',
    
    }]

  }

  test(){
    console.log( "====> valor proceso " + this.identificacionCliente.value );
    this.proceso=this.identificacionCliente.value;
  }
*/
}
