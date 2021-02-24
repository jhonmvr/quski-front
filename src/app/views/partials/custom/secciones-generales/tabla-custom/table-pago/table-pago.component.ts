import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SoftbankService } from '../../../../../../../app/core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../../../app/core/services/re-notice.service';

@Component({
  selector: 'kt-table-pago',
  templateUrl: './table-pago.component.html',
  styleUrls: ['./table-pago.component.scss']
})
export class TablePagoComponent implements OnInit {
  dataSource= new MatTableDataSource<any>();
  dataRubro=new MatTableDataSource<any>();
  catRubros;
  constructor(private css: SoftbankService,
    private sinNoticeService: ReNoticeService,
    public dialogRef: MatDialogRef<TablePagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
   // console.log("detallee======================",this.data);
    this.css.consultarRubroPrestamosCS().subscribe(p=>{
      this.catRubros = p.catalogo;
    })
    this.css.consultaAbonos(this.data.numeroOperacion,this.data.couta).subscribe(respo=>{
      if(respo && respo.abonos&& respo.abonos.length > 0){
        this.dataSource = new MatTableDataSource<any>(respo.abonos);
       // console.log("repuesta abonos ", respo)
      }else{
        this.sinNoticeService.setNotice('NO EXISTEN PAGOS PARA ESA CUOTA','info');
        this.dialogRef.close();
      }
     
    })

  }
  setDataRubro(elem){
    this.dataRubro = new MatTableDataSource<any>(elem);

  }

  rubro(element){
    //console.log("rubrosss ==>> ",element,this.catRubros)
    if(element && this.catRubros){
      const c = this.catRubros.find(p=>p.id==element);
      return c?c.nombre:'';
    }
    return '';
  }

}
