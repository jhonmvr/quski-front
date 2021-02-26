import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { Page } from '../../../../../core/model/page';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'kt-lista-pendientes',
  templateUrl: './lista-pendientes.component.html',
  styleUrls: ['./lista-pendientes.component.scss']
})
export class ListaPendientesComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  public formFiltros: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('', []);
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns = ['accion', 'codigo', 'codigoOperacion', 'identificacion', 'nombreCliente', 'fundaMadre', 'fundaActual', 'ciudadTevcol', 'valorAvaluo', 'pesoBruto', 'fechaSolicitud', 'fechaAprobacion', 'fechaArriboAgencia'];
  private agencia: number;
  
  p = new Page();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;
  @ViewChild('sort1', { static: true }) sort: MatSort;

  constructor(
    public dev: DevolucionService,
    private subheaderService: SubheaderService,
    private noticeService: ReNoticeService,
    public dialog: MatDialog
    ) {
    this.dev.setParameter();
  }

  ngOnInit() {
    this.dev.setParameter();
    this.subheaderService.setTitle('Pendiente de arribo');
    this.agencia = Number(localStorage.getItem( 'idAgencia' ));
    this.initiateTablePaginator();
    this.buscar();
    this.sort.sortChange.subscribe(() => {
      this.initiateTablePaginator();
      this.buscar();
    });
  }
  public initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }
  public getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string, pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    ////console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }
  public paged() {
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', this.paginator.pageIndex)
    this.submit();
  }
  public buscar() {
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', 0);
    this.submit();
  }
  public submit() {
    this.dataSource = null;
    let codigoOperacion = this.codigoOperacion.value ? this.codigoOperacion.value : null;
    this.dev.buscarDevolucionPendienteArribo(this.p, codigoOperacion, this.agencia).subscribe((data: any) => {
      if (data) {
        //console.log(data.list)
        this.paginator.length = data.totalResults;
        this.dataSource = new MatTableDataSource<any>(data.list);
      }
    })
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
      //console.log(row.id)
    } else {
      this.selection.select(row.id);
    }
  }
  public eliminarSelect() {
    this.selection.clear();
  }
  public confirmarArribo() {
    if (!this.selection || !this.selection.selected || this.selection.selected.length < 1) {
      this.noticeService.setNotice("SELECCIONE AL MENOS ALGUN ITEM DE LA LISTA.", 'warning');
      return;
    }
    let mensaje = 'Aceptar el arribo de las fundas para los procesos de devolucion: ';
    this.selection.selected.forEach(x => {
      mensaje = mensaje.concat(x.codigo + ", ");
    });
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        let listIdDevolucion = [];
        this.selection.selected.forEach(x => listIdDevolucion.push(x.id))
        this.dev.registrarArribo(listIdDevolucion).subscribe((data: any) => {
          this.eliminarSelect();
          this.buscar();
          if (data) {
            this.noticeService.setNotice("SE HA ACEPTADO CORRECTAMENTE EL ARRIBO DE LAS FUNDAS.", "success")
          } else {
            this.noticeService.setNotice("ERROR AL REGISTRAR.", "error")
          }
        });
      } else {
        this.noticeService.setNotice("SE CANCELO LA ACCION", 'warning');
      }
    });
  }
}