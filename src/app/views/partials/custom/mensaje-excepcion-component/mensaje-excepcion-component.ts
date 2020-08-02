import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'kt-mensaje-excepcion-component',
  templateUrl: './mensaje-excepcion-component.html',
  styleUrls: ['./mensaje-excepcion-component.scss']
})
export class MensajeExcepcionComponent implements OnInit {

  public formMensajeBloqueo: FormGroup = new FormGroup({});
  public mensajeBloqueo = new FormControl('', [Validators.required]);
  public mensaje: string;
  constructor(public dialogRef: MatDialogRef<MensajeExcepcionComponent>, @Inject(MAT_DIALOG_DATA) private data: string) { 
    this.formMensajeBloqueo.addControl('Mensaje de Bloqueo  ', this.mensajeBloqueo);
  }
  ngOnInit(): void {
    this.mensaje = this.data;
    console.log('MENSAJE DE BLOLQUEO ',JSON.stringify( this.mensaje));
    this.mensajeBloqueo.setValue( this.mensaje);
  }
  salir() {
    this.dialogRef.close();
  }











}


