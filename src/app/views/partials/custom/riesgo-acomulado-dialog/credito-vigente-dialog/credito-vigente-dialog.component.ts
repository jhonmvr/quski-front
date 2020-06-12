import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MatPaginator } from '@angular/material';
import { RiesgoAcumuladoService } from '../../../../../core/services/quski/riesgoAcumulado.service';
import { RiesgoAcumuladoWrapper } from '../../../../../core/model/quski/RiesgoAcumuladoWrapper';
import { Page } from '../../../../../core/model/page';


@Component({
  selector: 'm-credito-vigente-dialog',
  templateUrl: './credito-vigente-dialog.component.html',
  styleUrls: ['./credito-vigente-dialog.component.scss']
})
export class CreditoVigenteDialogComponent implements OnInit {


 p = new Page ();
  
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;
  private element
  displayedColumns = ['NroPrestamo', 'CuentaIndividual', 'TipoCredito','CapitaInicial','SaldoCapital','Plazo', 
  'FechaAprobacion','FechaFinalCredito','CoberturaAnterior','CoberturaActual','EstatusCredito','MotivoBloqueo','DiasMora',
 'EstadoMediacion','Retanqueo','Cuota','CapitalCuotaAtrasada','InteresCuotaAtrasada','Mora','GestionCobranza','Custodia','TotalDeuda',
'NroCuotasImpagadas','UltDivPagado' ];
dataSourceCre = new MatTableDataSource<any>();
 
 


  public totalSize = 0;



  constructor(
    private cs: RiesgoAcumuladoService, public dialogRefGuardar: MatDialogRef<CreditoVigenteDialogComponent>) { 
    }

  ngOnInit() {
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

  paged(){
    this.p.isPaginated = "Y";
    this.p.pageNumber = this.paginator.pageIndex;
    this.p.currentPage = this.paginator.pageIndex;
    this.p.size = this.paginator.pageSize;
    this.submit();
   
  }


  submit(){
    this.cs.riesgoAcumulado().subscribe((data:any)=>{
   
   console.log("Rieso acumulado >>>>" + JSON.stringify(data));
   if(data.list){
    console.log("lista  >>>>" + JSON.stringify(data.list));
 
    this.totalResults = data.totalResults;
    this.dataSourceCre = new MatTableDataSource<RiesgoAcumuladoWrapper>(data.list);
    //console.log("lista 2 >>>>" + JSON.stringify(this.dataSourceCre));
    this.element = null;
    
  }else{
    //is.sinNoticeService.setNotice("NO SE ENCONTRAR REGISTROS", 'info');
  }
},error=>{
  //this.loadingSubject.next(false);
  if (JSON.stringify(error).indexOf("codError") > 0) {
    let b = error.error;
  //  this.sinNoticeService.setNotice(b.msgError, 'error');
  } else {
   // this.sinNoticeService.setNotice("ERROR AL CARGAR", 'error');
  }
}
);


 }





  salir(){
    this.dialogRefGuardar.close(false);
  }
 
  
}
