import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RegistrarPagoService } from './../../../../../../../core/services/quski/registrarPago.service';
import { TbQoRegistrarPago } from './../../../../../../../core/model/quski/TbQoRegistrarPago';

@Component({
  selector: 'kt-dialogo-bloquear-credito',
  templateUrl: './dialogo-bloquear-credito.component.html',
  styleUrls: ['./dialogo-bloquear-credito.component.scss']
})
export class DialogoBloquearCreditoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoBloquearCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TbQoRegistrarPago, public dataService: RegistrarPagoService) {

  }

  institucionFinaciera = new FormControl('', [Validators.required]);

  numeroDeposito = new FormControl('', [Validators.required]);

  valorDeposito = new FormControl('', [Validators.required]);

  cuentas = new FormControl('', [Validators.required]);

  fechaPago = new FormControl(new Date(),);
  public formCliente: FormGroup = new FormGroup({});


  ngOnInit() {
    this.formCliente.addControl('institucionFinaciera', this.institucionFinaciera);
    this.formCliente.addControl('numeroDeposito', this.numeroDeposito);
    this.formCliente.addControl('valorDeposito', this.valorDeposito);
    this.formCliente.addControl('cuentas', this.cuentas);
    this.formCliente.addControl('fechaPago', this.fechaPago);

  }
  /**
   * @description METODO QUE AGREGA UNA NUEVO PAGO
   */
  public nuevoPago() {
    if (this.formCliente.invalid) {
      alert("COMPLETE EL FORMULARIO CORRECTAMENTE");
      return;
    }

    let wrapperRespuesta = {
      institucionFinanciera: this.institucionFinaciera.value,
      numerodeDeposito: this.numeroDeposito.value,
      valorpagado: this.valorDeposito.value,
      cuentas: this.cuentas.value,
      fechadePago: this.fechaPago.value
    }
    this.dialogRef.close(wrapperRespuesta);

  }
  onNoClick() {
    this.dialogRef.close();
  }
}
