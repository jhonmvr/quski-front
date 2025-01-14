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
  displayedColumns = ['cuota','fechaPago','capital','interes','otros','total','saldoCapital',];
  dataSource = new MatTableDataSource<CuotasAmortizacion>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private list: Array<CuotasAmortizacion>,
    public dialogRefGuardar: MatDialogRef<any>,

  ) { }

  ngOnInit(): void {
    
    this.dataSource.data = this.list;
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }

}
