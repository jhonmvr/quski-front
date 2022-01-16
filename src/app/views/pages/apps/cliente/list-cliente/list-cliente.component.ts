import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Page } from '../../../../../core/model/page';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { TituloContratoService } from '../../../../../core/services/quski/titulo.contrato.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { HabilitanteComponent } from '../../../../../views/partials/custom/habilitante/habilitante.component';
import { DialogHabilitanteClienteComponent } from './dialog-habilitante-cliente/dialog-habilitante-cliente.component';




@Component({
  selector: 'kt-list-cliente',
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss']
})
export class ListClienteComponent implements OnInit {
  
  public date;
  
  
  
  // STANDARD VARIABLES
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);

  proceso:string="DATOSCLIENTE";
  idReferenciaHab:string="1";

  nombreCliente = new FormControl('', []);
  apellidoCliente = new FormControl('', []);
  identificacionCliente = new FormControl('', []); 
  fechaNacimiento = new FormControl('', []);
  estadoCivil = new FormControl('', []);
  genero = new FormControl('', []);

  displayedColumns = ['accion', 'cedula',  'nombreCompleto'];
/*   displayedColumns = ['accion', 'cedula',  'primerNombre', 'nivelEducacion', 'genero', 'estadoCivil',
   'nacionalidad', 'edad', 'actividadEconomica',  'canalContacto'];*/
  /**Obligatorio paginacion */
  p = new Page();
  dataSource:MatTableDataSource<TbQoCliente>=new MatTableDataSource<TbQoCliente>();
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;
  bandera = false;
  /**Obligatorio ordenamiento */
  @ViewChild('sort1', {static: true}) sort: MatSort;
  
  

  constructor(
    public titulo: TituloContratoService,
    private clienteService: ClienteService,
   
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private noticeService:ReNoticeService,
    public dialog: MatDialog) 
    
    {
      this.clienteService.setParameter();
     }

  ngOnInit() {
    this.clienteService.setParameter();
    //this.titulo.setNotice("GESTION DE CLIENTES")
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('GESTION CLIENTE');
    this.initiateTablePaginator();

    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      //console.log("sort changed "  );
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


  submit() {
    //console.log("====> paged: " + JSON.stringify( this.p ));
    this.loadingSubject.next(true);
    this.dataSource = null;
    this.clienteService.findClienteByParams(this.p, this.identificacionCliente.value, this.nombreCliente.value, null
      ,null,null,null,null,null,null,null,null,null).subscribe((data: any) => {
      this.loadingSubject.next(false);
      //console.log("====> datos: " + JSON.stringify( data ));
      if (data.list) {

        this.totalResults = data.totalResults;
        this.dataSource = new MatTableDataSource<TbQoCliente>(data.list);
        //this.dataSource.paginator=this.paginator;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'info');
      } else {
        this.sinNoticeService.setNotice("NO SE ENCONTRAR REGISTROS", 'success');
      }
    });
  }

  editarUsuario() {
    [{
      path: 'add/:id',
    
    }]

  }

  test(){
    //console.log( "====> valor proceso " + this.identificacionCliente.value );
    this.proceso=this.identificacionCliente.value;
  }


  verHabilitantes(row){
   
    
      const dialogRef = this.dialog.open(DialogHabilitanteClienteComponent, {
        width: "1200px",
        height: "auto",
        data:  row.cedulaCliente
      });
      dialogRef.afterClosed().subscribe(r => {
      
      });
    
  }



}
  