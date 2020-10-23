import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface EntryData{
  mensaje: string;
  titulo: string;
}
@Component({
  selector: 'kt-confirmar-accion',
  templateUrl: './confirmar-accion.component.html',
  styleUrls: ['./confirmar-accion.component.scss']
})
export class ConfirmarAccionComponent implements OnInit {
  valores: EntryData;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: string,
    public dialogRefGuardar: MatDialogRef<any>,
  ) { }

  ngOnInit() {
    this.cargarValores();
  }
  private cargarValores(){
    this.valores = { 
      mensaje: '¿Esta seguro que desea realizar la siguiente acción?: ' + this.data,
      titulo: 'CONFIRMAR ACCION'
    }

  }
  public salir(result: boolean){
    this.dialogRefGuardar.close(result);
  }
}
