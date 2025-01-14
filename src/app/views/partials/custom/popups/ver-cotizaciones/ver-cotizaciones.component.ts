import { MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatDialogRef, MatDialog } from '@angular/material';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DetallesComponent } from './detalles/detalles.component';
import { Page } from '../../../../../core/model/page';

@Component({
  selector: 'kt-ver-cotizaciones',
  templateUrl: './ver-cotizaciones.component.html',
  styleUrls: ['./ver-cotizaciones.component.scss']
})
export class VerCotizacionesComponent implements OnInit {
  // STANDARD VARIABLES
  private cedula;

  // PAGINACION 
  @ViewChild(MatPaginator, { static: true })
  private paginator: MatPaginator;
  private p: Page;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;

  
  // TABLA PRECIOS ORO
  displayedColumns = ['Accion', 'CodigoCotizacion', 'gradoInteres', 'motivo','FechaCreacion'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialogRefGuardar: MatDialogRef<any>,
    public dialogGuardar: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: string,
    private cot: CotizacionService
  ) { 
    this.cot.setParameter();
  }

  ngOnInit() {
    this.cot.setParameter();
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
    this.cot.findByCedula( this.p, cedula ).subscribe((data:any)=>{
      if(data.list){
        this.totalResults = data.totalResults;
        this.dataSource.data = data.list;
      }
    });
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }
  detalleCotizacion( event ) {
    const dialogRefGuardar = this.dialogGuardar.open(DetallesComponent, {
      width: '900px',
      height: 'auto',
      data: event.id
    });
  
    dialogRefGuardar.afterClosed().subscribe((respuesta:any) => {
      if(respuesta)
      this.submit( this.cedula);
    });
      
  }


}
