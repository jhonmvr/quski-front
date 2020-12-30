import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-popup-pago',
  templateUrl: './popup-pago.component.html',
  styleUrls: ['./popup-pago.component.scss']
})
export class PopupPagoComponent implements OnInit {

  public formOperacion: FormGroup = new FormGroup({});
  public intitucionFinanciera = new FormControl();
  public numeroDeposito = new FormControl();
  public valorDepositado = new FormControl();
  public cuenta = new FormControl();
  public fechaPago = new FormControl();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRefGuardar: MatDialogRef<any>
  ) {
    this.formOperacion.addControl("intitucionFinanciera", this.intitucionFinanciera);
    this.formOperacion.addControl("numeroDeposito", this.numeroDeposito);
    this.formOperacion.addControl("valorDepositado", this.valorDepositado);
    this.formOperacion.addControl("cuenta", this.cuenta);
    this.formOperacion.addControl("fechaPago", this.fechaPago);
   }

  ngOnInit() {
  }
  public cancelar(){
    this.dialogRefGuardar.close(false);
  }
  public aceptar(){
    this.dialogRefGuardar.close(true);
  }


}
