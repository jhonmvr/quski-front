import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { CuotasAmortizacion } from '../../../../../core/model/softbank/CuotasAmortizacion';

@Component({
  selector: 'kt-tabla-amortizacion',
  templateUrl: './tabla-amortizacion.component.html',
  styleUrls: ['./tabla-amortizacion.component.scss']
})
export class TablaAmortizacionComponent implements OnInit {
  /** ** @TABLA ** */
  displayedColumns = ['cuota','fechaPago','saldoCapital','capital','interes','seguro','otros','total'];
  dataSource = new MatTableDataSource<CuotasAmortizacion>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private list: Array<CuotasAmortizacion>,
    public dialogRefGuardar: MatDialogRef<any>,

  ) { }

  ngOnInit(): void {
    !this.list ? null : this.list.forEach(e=>{
      let date = new Date( e.fechaPago );
      e.fechaPago = date.getDate() +'-'+date.getMonth()+'-'+date.getFullYear();
    });
    this.dataSource.data = this.list;
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }

}
