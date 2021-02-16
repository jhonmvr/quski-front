import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'kt-riesgo-acumulado',
  templateUrl: './riesgo-acumulado.component.html',
  styleUrls: ['./riesgo-acumulado.component.scss']
})
export class RiesgoAcumuladoComponent implements OnInit {
  public identificacion: string;
  public idCliente: number;
  public isGuardar: boolean;
  public isPaged: boolean;
  public core: boolean = false;
  public soft: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<RiesgoAcumuladoComponent>,
  ) { }

  ngOnInit() {
    this.isGuardar = this.data.isGuardar != null ? this.data.isGuardar : false;
    this.isPaged = this.data.isPaged != null ? this.data.isPaged : false;
    this.identificacion = this.data.cedula != null ? this.data.cedula : null;
    this.idCliente = this.data.idCliente != null ? this.data.idCliente : null;

    this.soft = this.identificacion != null ? true : false;
    this.core = this.idCliente != null ? true : false;
  }
  salir() {
    this.dialogRef.close();
  }

}
