import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { EstadoExcepcionEnum } from '../../../../../core/enum/EstadoExcepcionEnum';
import { TipoExcepcionEnum } from '../../../../../core/enum/TipoExcepcionEnum';
import { TbQoExcepcione } from '../../../../../core/model/quski/TbQoExcepcione';

@Component({
  selector: 'kt-lista-excepciones',
  templateUrl: './lista-excepciones.component.html',
  styleUrls: ['./lista-excepciones.component.scss']
})
export class ListaExcepcionesComponent implements OnInit {
  public bloqueo : string = "";
  public isSalir: boolean = false;
  // TABLA EXCEPCIONES
  displayedColumns = ['tipoExcepcion','estadoExcepcion','revisar'];
  dataSource = new MatTableDataSource<TbQoExcepcione>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TbQoExcepcione[],
    public dialogRefGuardar: MatDialogRef<any>,
  ) { }

  ngOnInit() {
    if(this.data != null ){
      if( this.data != null){
        this.dataSource.data = this.data;
        const dataLimpia : TbQoExcepcione[] = null; 
        this.data.forEach(e =>{
          if(e.estadoExcepcion == EstadoExcepcionEnum.NEGADO && e.tipoExcepcion != TipoExcepcionEnum.EXCEPCION_COBERTURA){
            this.bloqueo = "Su \"" + e.tipoExcepcion + "\" fue negada. Se cerrará la negociacion.";
            this.isSalir = true;
          }
        });
      }
    }
  }
  salir(isFinalizar: boolean){
    this.dialogRefGuardar.close( isFinalizar );
  }
}
