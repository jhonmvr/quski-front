import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { AddFechaComponent } from '../../../../partials/custom/add-fecha/add-fecha.component';
import { RegistroFechaArribo } from '../../../../../core/model/wrapper/RegistroFechaArribo';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { Page } from '../../../../../core/model/page';

@Component({
  selector: 'kt-seleccion-fecha',
  templateUrl: './seleccion-fecha.component.html',
  styleUrls: ['./seleccion-fecha.component.scss']
})
export class SeleccionFechaComponent implements OnInit {
  public formFiltros: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('', []);
  public cedulaCliente = new FormControl('', []);
  public agenciaEntrega = new FormControl('', []);
  public fechaAprobacionDesde = new FormControl('', []);
  public fechaAprobacionFin = new FormControl('', []);

  public catAgencia: Array<any>;
  @ViewChild('sort1', {static: true}) sort: MatSort;
  p = new Page();
  dataSource : MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns = ['accion','codigo','codigoOperacion', 'identificacion','nombreCliente',
  'agenciaSolicitud','fundaMadre' ,'fundaActual', 'ciudadTevcol', 'agenciaEntrega', 'nombreAsesor', 'fechaSolicitud',
  'fechaAprobacion','fechaArriboAgencia','estadoProceso','estadoUbicacion','bloqueo'];
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  selection = new SelectionModel<Element>(true, []);
  //busquedaDevWrapper = new BusquedaDevolucionWrapper


  constructor(
    private dev: DevolucionService,
    private subheaderService: SubheaderService,
    private sof: SoftbankService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog 
    ) {
      this.dev.setParameter();
      this.sof.setParameter();
      this.formFiltros.addControl('codigoOperacion', this.codigoOperacion);
      this.formFiltros.addControl('cedulaCliente', this.cedulaCliente);
      this.formFiltros.addControl('agenciaEntrega', this.agenciaEntrega);
      this.formFiltros.addControl('fechaAprobacionDesde', this.fechaAprobacionDesde);
      this.formFiltros.addControl('fechaAprobacionFin', this.fechaAprobacionFin);
     }

  ngOnInit() {
    this.dev.setParameter();
    this.sof.setParameter();
    this.cargarCatalogos();
    this.buscar();
    this.subheaderService.setTitle('FLUJO DE DEVOLUCION');
  }
  private cargarCatalogos() {
    this.sof.consultarAgenciasCS().subscribe((data: any) => {
      this.catAgencia = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    
  }
  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  private initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
    //this.busquedaDevWrapper.numberPage =0 ;
    //this.busquedaDevWrapper.numberItems = 5;
  }
   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  private getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string,pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    //this.busquedaDevWrapper.numberItems = this.paginator.pageSize;
    //this.busquedaDevWrapper.numberPage = pagina
    ////console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }
   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  buscar() {
    this.initiateTablePaginator();
    this.p= this.getPaginacion(this.sort.active, this.sort.direction, 'Y',0);
    this.submit();
  }
  submit() {  
    this.p.pageNumber = this.paginator.pageIndex;
    let codigoOperacion = this.codigoOperacion.value ? this.codigoOperacion.value : null;
    let cedula = this.cedulaCliente.value ? this.cedulaCliente.value : null;
    let agencia = null;
    let fechaDesde = null;
    let fechaHasta = null;
    let fechaUtil = new diferenciaEnDias;  

    if(this.fechaAprobacionDesde.value){
      fechaDesde = fechaUtil.convertirFechaAString( this.fechaAprobacionDesde.value );
    }
    if(this.fechaAprobacionFin.value){
      fechaHasta = fechaUtil.convertirFechaAString( this.fechaAprobacionFin.value );
    }
    if(this.agenciaEntrega.value && this.agenciaEntrega.value.nombre){
      agencia = this.agenciaEntrega.value.nombre;
    }
    this.dev.buscarDevolucion(this.p, codigoOperacion, agencia, fechaDesde, fechaHasta, cedula).subscribe((data:any)=>{
      if(data){
        this.dataSource = new MatTableDataSource<any>();
        console.log("Data de la busqueda =>", data.list);
        this.setEstadoGarantias(data.list);
        this.paginator.length = data.totalResults;
        this.dataSource.data = data.list;
      }
    })
  }
  setEstadoGarantias(dataList){
    let listOperaciones = dataList.map(p=>{return p.codigoOperacion});
    this.sof.resumenOperacion(listOperaciones).subscribe(data=>{

      if(data && data.operaciones){
        dataList.forEach(lista => {
          data.operaciones.forEach(estados => {
            if(lista.codigoOperacion == estados.numeroOperacion){
              lista.bloqueo = estados.datosBloqueo?estados.datosBloqueo.descripcion:'NINGUNO';
              lista.estadoProceso = estados.codigoEstadoProcesoGarantia;
              lista.estadoUbicacion = estados.codigoEstadoUbicacionGrantia;
            }
          });
        });
        return dataList;
      }
    });
   
  }
   /**
   * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
   */
  paged() {
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',this.paginator.pageIndex)
    this.submit();
  }
  public limpiarFiltros(){
    Object.keys(this.formFiltros.controls).forEach((name) => {
      const control = this.formFiltros.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.buscar();
  }

  public isCheck(row): boolean {
    if (this.selection.selected.find(c => c.id == row.id)) {
      return true;
    } else {
      return false;
    }
  }
  public addRemove(row) {
    if (this.selection.isSelected(row.id)) {
      this.selection.deselect(row.id);
    } else {
      this.selection.select(row.id);
    }
  }
  private eliminarSelect() {
    this.selection.clear();
  }
  public seleccionarFecha(){
    if( !this.selection || !this.selection.selected || this.selection.selected.length < 1 ){
      this.sinNoticeService.setNotice("SELECCIONE AL MENOS UN ITEM DE LA TABLA", "warning");
      return;
    }
    let mensaje = "Seleccionar fecha de arribo para las entregas de garantias seleccionadas?";
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        const dialogRef = this.dialog.open(AddFechaComponent, {
          height: 'auto',
          width: '700px'
        });
        dialogRef.afterClosed().subscribe((resultado) => {
          if (resultado) {
            let listIdDevolucion =[];
            this.selection.selected.forEach(x=> listIdDevolucion.push(x.id))
            let objetoRegistroFechaArribo = new RegistroFechaArribo
            objetoRegistroFechaArribo.fechaArribo = resultado;
            objetoRegistroFechaArribo.idDevoluciones = listIdDevolucion;
            this.dev.registrarFechaArribo(objetoRegistroFechaArribo).subscribe((data:any)=>{
              if(data){
                this.sinNoticeService.setNotice("SE HA ASIGNADO LA FECHA DE ARRIBO A LA(s) DEVOLUCION(es) SELECCIONADA(s)", "success")
                this.eliminarSelect();
                this.buscar();
              } 
            },error =>{
              this.sinNoticeService.setNotice( error.error.codError, 'warning');
            });
          }else {
            this.eliminarSelect();
            this.buscar();
          }
        });
      }else{
          this.sinNoticeService.setNotice('SE CANCELO LA ACCION','warning');
      }
    });
  }
}