import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'kt-riesgo-acumulado',
  templateUrl: './riesgo-acumulado.component.html',
  styleUrls: ['./riesgo-acumulado.component.scss']
})
export class RiesgoAcumuladoComponent implements OnInit {
  private identificacionLocal: string;
  private idClienteLocal: number;
  private isGuardarLocal: boolean;
  private isPagedLocal  : boolean;
  public core: boolean = false;
  public soft: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private identificacion: string,
    @Inject(MAT_DIALOG_DATA) private idCliente: number,
    @Inject(MAT_DIALOG_DATA) private isGuardar: boolean,
    @Inject(MAT_DIALOG_DATA) private isPaged: boolean,
    public dialogRefGuardar: MatDialogRef<any>,
  ) { }

  ngOnInit() {
    this.isGuardarLocal = this.isGuardar;
    if(this.identificacion != ""){
      this.identificacionLocal =  this.identificacion;
      this.soft = true;
    } else {
      if(this.idCliente != 0){
        this.idClienteLocal = this.idCliente;
        if(this.isPaged){
          this.isPagedLocal = this.isPaged;
        }
        this.core = true;
      } else{
        console.log("Datos no ingresados --->", this.idCliente, this.identificacion);
      }
    }

  }

}
