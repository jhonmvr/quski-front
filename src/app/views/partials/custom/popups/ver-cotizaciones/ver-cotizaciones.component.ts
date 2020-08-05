import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatDialogRef, MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Page } from '../../../../../core/model/page';
import { PrecioOroService } from '../../../../../core/services/quski/precioOro.service';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';
import { DetallesComponent } from './detalles/detalles.component';

@Component({
  selector: 'kt-ver-cotizaciones',
  templateUrl: './ver-cotizaciones.component.html',
  styleUrls: ['./ver-cotizaciones.component.scss']
})
export class VerCotizacionesComponent implements OnInit {
  // STANDARD VARIABLES
  public loading;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private  cedula;

  // ENTIDADES
  private preciosOros : Array<TbQoPrecioOro>;

  // PAGINACION 
  @ViewChild(MatPaginator, { static: true })
  private paginator: MatPaginator;
  private p: Page;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;

  
  // TABLA PRECIOS ORO
  displayedColumnsPrecioOro = ['Accion', 'CodigoCotizacion', 'FechaCreacion', 'Precio','PesoNetoEstimado'];
  dataSourcePrecioOro = new MatTableDataSource<TbQoPrecioOro>();

  constructor(
    public dialogRefGuardar: MatDialogRef<any>,
    public dialogGuardar: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: string,
    private pre: PrecioOroService,
  ) { }

  ngOnInit() {
    this.loading = this.loadingSubject.asObservable();
    if(this.data){
      this.cedula = this.data;
      this.buscar();
    } 
  }
  buscar(){
    this.p = new Page();
    this.totalResults = 0;
    this.paginator.pageIndex = 0;
    this.p.isPaginated = "Y";
    this.p.size = 5;
    this.p.pageNumber = 0;
    this.submit( this.cedula );
  }
  paged(){
    this.p.isPaginated = "Y";
    this.p.pageNumber = this.paginator.pageIndex;
    this.p.currentPage = this.paginator.pageIndex;
    this.p.size = this.paginator.pageSize;
    this.submit( this.cedula );
  }
  submit(cedula: string){
    this.loadingSubject.next(true);
    this.pre.findByCedula( this.p, cedula ).subscribe((data:any)=>{
      if(data.list){
        this.loadingSubject.next(false);
        this.totalResults = data.totalResults;
        this.preciosOros = new Array<TbQoPrecioOro>(); 
        data.list.forEach(pOro => {
          this.preciosOros.push( pOro);
        });
        this.dataSourcePrecioOro.data = this.preciosOros;
      }else{
        this.loadingSubject.next(false);
      }
    });
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }
  detalleCotizacion( precioOro: TbQoPrecioOro ) {
    const dialogRefGuardar = this.dialogGuardar.open(DetallesComponent, {
      width: 'auto',
      height: 'auto',
      data: precioOro
    });
  
    dialogRefGuardar.afterClosed().subscribe((respuesta:any) => {
      if(respuesta)
      this.submit( this.cedula);
    });
      
  }


}
