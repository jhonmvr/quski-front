import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';



@Component({
  selector: 'kt-mensaje-excepcion-component',
  templateUrl: './mensaje-excepcion-component.html',
  styleUrls: ['./mensaje-excepcion-component.scss']
})
export class MensajeExcepcionComponent implements OnInit {


  public mensaje: string;
  constructor(public dialogRef: MatDialogRef<MensajeExcepcionComponent>, @Inject(MAT_DIALOG_DATA) private data: string) {

  }
  ngOnInit(): void {
    this.mensaje = this.data;
  }
  salir() {
    this.dialogRef.close();
  }











}


