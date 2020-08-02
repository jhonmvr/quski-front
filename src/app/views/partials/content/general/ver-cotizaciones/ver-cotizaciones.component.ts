import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatDialogRef, MatDialog } from '@angular/material';
import { TbQoCotizador } from '../../../../../core/model/quski/TbQoCotizador';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { BehaviorSubject } from 'rxjs';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
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
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loading;
  private  cedula;
  // ENTIDADES
  private preciosOros : Array<TbQoPrecioOro>;

  // PAGINACION 
  private paginator: MatPaginator;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;
  p = new Page();

  
  // TABLA PRECIOS ORO
  displayedColumnsPrecioOro = ['Accion', 'FechaCreacion', 'Precio','PesoNetoEstimado'];
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
      console.log("Cedula para busqueda ---->   ", this.data); 
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
    this.submit();
  }
  paged(){
    this.p.isPaginated = "Y";
    this.p.pageNumber = this.paginator.pageIndex;
    this.p.currentPage = this.paginator.pageIndex;
    this.p.size = this.paginator.pageSize;
    this.submit();
  }
  submit(){
    this.loadingSubject.next(true);
    this.pre.findByCedula( this.p, this.cedula ).subscribe((data:any)=>{
      if(data.list){
        this.loadingSubject.next(false);
        this.totalResults = data.totalResults;
        this.preciosOros = new Array<TbQoPrecioOro>(); 
        data.list.forEach(pOro => {
          this.preciosOros.push( pOro);
        });
        this.dataSourcePrecioOro.data = this.preciosOros;
       console.log("data precios oro ------> ",data.list);  
      }else{
        console.log("data precios oro ------> ",data);
      }
    });
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }
  detalleCotizacion( precioOro ) {
    console.log("Precio oro ",precioOro)
    const dialogRefGuardar = this.dialogGuardar.open(DetallesComponent, {
      width: 'auto',
      height: 'auto',
      data: precioOro
    });
  
    dialogRefGuardar.afterClosed().subscribe((respuesta:any) => {
      if(respuesta)
      this.submit();
    });
      
  }


}
