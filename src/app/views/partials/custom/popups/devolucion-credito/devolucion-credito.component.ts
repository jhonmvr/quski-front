import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface EntryData{
  titulo: string;
  mensajeAprobador: string;
  motivoDevolucion: string;
  aprobador: string;
  codigoBpm: string;
}

@Component({
  selector: 'kt-devolucion-credito',
  templateUrl: './devolucion-credito.component.html',
  styleUrls: ['./devolucion-credito.component.scss']
})
export class DevolucionCreditoComponent implements OnInit {
  public v: EntryData;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: EntryData,
    public dialogRefGuardar: MatDialogRef<any>,
  ) { }

  ngOnInit() {
    this.v = this.data;
    this.v.titulo = 'OPERACION DEVUELTA';
  }

  public salir(result: boolean){
    this.dialogRefGuardar.close(result);
  }

}
