import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'kt-error-carga-inicial',
  templateUrl: './error-carga-inicial.component.html',
  styleUrls: ['./error-carga-inicial.component.scss']
})
export class ErrorCargaInicialComponent implements OnInit {
  public mensaje: string;
  public titulo: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRefGuardar: MatDialogRef<any>,

  ) { }

  ngOnInit(): void {
    this.mensaje = this.data.mensaje;
    this.titulo = this.data.titulo? this.data.titulo: "ERROR";
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }
}
