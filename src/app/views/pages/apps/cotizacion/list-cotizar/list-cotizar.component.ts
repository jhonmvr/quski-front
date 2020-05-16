import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Page } from '../../../../../core/model/page';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { TbMiCliente } from '../../../../../core/model/quski/TbMiCliente';
import { TituloContratoService } from '../../../../../core/services/quski/titulo.contrato.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { merge, tap } from 'rxjs/operators';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';


@Component({
  selector: 'kt-list-cotizar',
  templateUrl: './list-cotizar.component.html',
  styleUrls: ['./list-cotizar.component.scss']
})
export class ListCotizarComponent implements OnInit {

  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);

  cedula = new FormControl('', []);
  fechaNacimiento = new FormControl('', []);
  nombresCompletos = new FormControl('', []);
  edad = new FormControl('', []);
  nacionalidad = new FormControl('', []);
  movil = new FormControl('', []);
  telefonoDomicilio = new FormControl('', []);
  publicidad = new FormControl('', []);
  correoElectronico = new FormControl('', []);
  campania = new FormControl('', []);
  aprobadoWebMupi = new FormControl('', []);
  apellidoCliente = new FormControl('', []);
  //OPCIONES PRECIO ORO
  tipoOro = new FormControl('', []);
  precio = new FormControl('', []);
  precioEstimado = new FormControl('', []);
  pesoNetoEstimado = new FormControl('', []);
  accion = new FormControl('', []);
  //OPCIONES DE CREDITO
  plazo = new FormControl('', []);
  montoPreaprobado = new FormControl('', []);
  aRecibir = new FormControl('', []);
  totalCostosNuevaOperacion = new FormControl('', []);
  costoCustodia = new FormControl('', []);
  costoTransporte = new FormControl('', []);
  costoCredito = new FormControl('', []);
  costoSeguro = new FormControl('', []);
  costoResguardo = new FormControl('', []);
  costoEstimado = new FormControl('', []);
  valorCuota = new FormControl('', []);
  gradoInteres = new FormControl('', []);
  motivoDesestimiento = new FormControl('', []);

  displayedColumns = ['orden', 'variable', 'valor'];
  displayedColumnsI = ['accion', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  displayedColumnsC = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoCredito', 'costoSeguro', 'costoResguardo', 'costoEstimado', 'valorCuota'];

  /**Obligatorio paginacion */
  p = new Page();
  dataSource: MatTableDataSource<TbMiCliente> = new MatTableDataSource<TbMiCliente>();
  dataSourceTipoPrecio: MatTableDataSource<TbQoPrecioOro> = new MatTableDataSource<TbQoPrecioOro>();
  dataSourceCredito = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;



  constructor(public titulo: TituloContratoService,
    private clienteService: ClienteService,
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private noticeService: ReNoticeService,
    public dialog: MatDialog) {
    this.clienteService.setParameter();
  }

  ngOnInit() {
    //this.titulo.setNotice("GESTION DE CLIENTES")
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Cotización');
    this.initiateTablePaginator();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      console.log("sort changed ");
      this.initiateTablePaginator();
      this.buscar()
    });

  }

  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTipoPrecio = new MatTableDataSource();
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
    this.submit();
  }


  /**
  * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
  */
  buscar() {
    this.initiateTablePaginator();
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', 0);
    this.submit();
  }


  submit() {
    //console.log("====> paged: " + JSON.stringify( this.p ));
    /* this.loadingSubject.next(true);
     this.dataSource = null;
     this.clienteService.findClienteByParams(this.p, this.cedula.value, this.nombresCompletos.value, this.apellidoCliente.value
       ,null,null,null,null,null,null,null,null,null).subscribe((data: any) => {
       this.loadingSubject.next(false);
       //console.log("====> datos: " + JSON.stringify( data ));
       if (data.list) {
        
         this.totalResults = data.totalResults;
         this.dataSource = new MatTableDataSource<TbMiCliente>(data.list);
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
     );*/
  }

  editarUsuario() {
    [{
      path: 'add/:id',

    }]

  }

}
