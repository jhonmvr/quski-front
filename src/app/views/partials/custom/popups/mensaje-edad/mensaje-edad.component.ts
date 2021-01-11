import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-mensaje-edad',
  templateUrl: './mensaje-edad.component.html',
  styleUrls: ['./mensaje-edad.component.scss']
})
export class MensajeEdadComponent implements OnInit {

  public mensaje: string;
  constructor(public dialogRef: MatDialogRef<MensajeEdadComponent>, @Inject(MAT_DIALOG_DATA) private data: string) {

  }
  ngOnInit(): void {
    this.mensaje = this.data;
    //console.log('MENSAJE EDAD MensajeEdadComponent===> ', this.mensaje);
  }
  salir() {
    this.dialogRef.close();
  }
}