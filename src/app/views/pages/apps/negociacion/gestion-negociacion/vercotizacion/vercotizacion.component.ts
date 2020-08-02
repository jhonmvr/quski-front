import { SubheaderService } from './../../../../../../core/_base/layout/services/subheader.service';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { CotizacionService } from './../../../../../../core/services/quski/cotizacion.service';
import { DetalleCotizacionComponent } from './../../../cotizacion/detalle-cotizacion/detalle-cotizacion.component';
import { TbCotizacion } from './../../../../../../core/model/quski/TbCotizacion';

import { Page } from './../../../../../../core/model/page';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-vercotizacion',
  templateUrl: './vercotizacion.component.html',
  styleUrls: ['./vercotizacion.component.scss']
})
export class VercotizacionComponent implements OnInit {
  public loadingSubject = new BehaviorSubject<boolean>(false);
  paginator: MatPaginator;
  
 public identificacion;
  displayedColumns = ['Accion','fecha','gradoInteres','identificacion'];
  dataSource = new MatTableDataSource<TbCotizacion>();

  constructor(public dialogRefGuardar: MatDialogRef<DetalleCotizacionComponent>,
     @Inject(MAT_DIALOG_DATA) private data:TbCotizacion,
     public dialogGuardar: MatDialog, private cs:CotizacionService,
     private noticeService: ReNoticeService, 
     private subheaderService: SubheaderService) { }
  
  public alert;
  public id;
 public pageSize = 5;
 public currentPage = 0;
 public totalSize = 0;
 public totalResults = 0;
 p = new Page();
  ngOnInit() {
    if(this.data){
      console.log("id cotizacion data  ", this.data); 
      this.identificacion = this.data;
      this.buscar();
     } 
   // this.route.paramMap.subscribe((data:any)=>{
   //   console.log("esta es la ruta q llega de ",data);
    //  if(data.params.identificacion){
    //    console.log("vamos a buscar el cliente con ",data.params.identificacion)
      //  this.identificacion = data.params.identificacion;
      //  this.buscar();
      //  this.paged();
    //  }  
  //  }); 
  }

  salir(){
    this.dialogRefGuardar.close(false);
  }

  identificacionPrueba(mensaje) {
    this.identificacion = mensaje;
    console.log("....................................", mensaje);
     //this.cargar();
  }
  
  paged(){
    this.p.isPaginated = "Y";
    this.p.pageNumber = this.paginator.pageIndex;
    this.p.currentPage = this.paginator.pageIndex;
    this.p.size = this.paginator.pageSize;
    this.buscar();
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
  
  
detalleCotizacion(cotizacion) {
  console.log("id cotizacion",cotizacion)
  const dialogRefGuardar = this.dialogGuardar.open(DetalleCotizacionComponent, {
    width: 'auto',
    height: 'auto',
    data: cotizacion
  });

  dialogRefGuardar.afterClosed().subscribe((respuesta:any) => {
    if(respuesta)
    this.submit();
  });
    
}
  submit(){
    this.loadingSubject.next(true);
    this.dataSource= null;
    this.cs.findByIdCliente( this.identificacion).subscribe((data:any)=>{
      this.loadingSubject.next(false);
      if(data.list){
        this.totalResults = data.totalResults;
        this.dataSource = new MatTableDataSource<TbCotizacion>(data.list);
       //console.log("data>>>>>>>>>>>>>>>>>" + JSON.stringify( this.dataSource));
       console.log("data cotizacion ",data.list);  
    }else{
        this.noticeService.setNotice("NO SE ENCONTRAR REGISTROS", 'info');
      }
    },error=>{
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.noticeService.setNotice(b.msgError, 'error');
      } else {
        this.noticeService.setNotice("ERROR AL CARGAR", 'error');
      }
     }
    );
  }
}