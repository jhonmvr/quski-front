import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Page } from '../../../../../core/model/page';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { TituloContratoService } from '../../../../../core/services/quski/titulo.contrato.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { merge, tap } from 'rxjs/operators';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { TbQoVariableCrediticia } from '../../../../../core/model/quski/TbQoVariableCrediticia';

import { DialogSolicitudDeAutorizacionComponent } from './dialog-solicitud-de-autorizacion/dialog-solicitud-de-autorizacion.component';


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

  //OPCIONES DE CREDITO
  plazo = new FormControl('', []);
  montoPreAprobado = new FormControl('', []);
  aRecibir = new FormControl('', []);
  totalCostosOperacion = new FormControl('', []);
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

  displayedColumnsVarCredi = ['orden', 'variable', 'valor'];
  displayedColumnsPrecioOro = ['accion', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  displayedColumnsCreditoNegociacion = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoCredito', 'costoSeguro', 'costoResguardo', 'costoEstimado', 'valorCuota'];
  /**Obligatorio paginacion */
  p = new Page();

  //DATASOURCE
  dataSourceVarCredi: MatTableDataSource<TbQoVariableCrediticia> = new MatTableDataSource<TbQoVariableCrediticia>();
  dataSourcePrecioOro: MatTableDataSource<TbQoPrecioOro> = new MatTableDataSource<TbQoPrecioOro>();
  dataSourceCredito: MatTableDataSource<TbQoCreditoNegociacion> = new MatTableDataSource<TbQoCreditoNegociacion>();




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
    this.dataSourceVarCredi = new MatTableDataSource();
    this.dataSourcePrecioOro = new MatTableDataSource();
    this.dataSourceCredito = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSourceVarCredi.paginator = this.paginator;
    this.dataSourcePrecioOro.paginator = this.paginator;
    this.dataSourceCredito.paginator = this.paginator;
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

  seleccionarEditar() {
    console.log(">>>INGRESA AL DIALOGO ><<<<<<");
    const dialogRefGuardar = this.dialog.open(DialogSolicitudDeAutorizacionComponent, {
      width: '600px',
      height: 'auto',


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log("envio de datos ");
      if (respuesta)
        this.submit();

    });



  }


}
