import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { TbQoExcepcione } from '../../../../../core/model/quski/TbQoExcepcione';

@Component({
  selector: 'kt-lista-excepciones',
  templateUrl: './lista-excepciones.component.html',
  styleUrls: ['./lista-excepciones.component.scss']
})
export class ListaExcepcionesComponent implements OnInit {
  // TABLA PRECIOS ORO
  displayedColumns = [ 'tipoExcepcion', 'estadoExcepcion', 'idAprobador', 'observacionAsesor','observacionAprobador'];
  dataSource = new MatTableDataSource<TbQoExcepcione>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TbQoExcepcione[],
    public dialogRefGuardar: MatDialogRef<any>,
  ) { }

  ngOnInit() {
    if(this.data != null ){
      this.dataSource.data = this.data;
    }
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }

}
