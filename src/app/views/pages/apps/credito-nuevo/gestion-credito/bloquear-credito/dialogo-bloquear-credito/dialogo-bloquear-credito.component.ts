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

  institucionFinanciera = new FormControl('', [Validators.required]);

  numeroDeposito = new FormControl('', [Validators.required]);

  valorPagado = new FormControl('', [Validators.required]);

  cuentas = new FormControl('', [Validators.required]);

  fechaPago = new FormControl('',[Validators.required]);

  public formCliente: FormGroup = new FormGroup({});


  ngOnInit() {
    this.formCliente.addControl('institucionFinanciera', this.institucionFinanciera);
    this.formCliente.addControl('numeroDeposito', this.numeroDeposito);
    this.formCliente.addControl('valorPagado', this.valorPagado);
    this.formCliente.addControl('cuentas', this.cuentas);
    this.formCliente.addControl('fechaPago', this.fechaPago);
    this.institucionFinanciera.setValue("Mutualista Pichincha");
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
      institucionFinanciera: this.institucionFinanciera.value,
      numeroDeposito: this.numeroDeposito.value,
      valorPagado: this.valorPagado.value,
      cuentas: this.cuentas.value,
      fechaPago: this.fechaPago.value
    }
    this.dialogRef.close(wrapperRespuesta);

  }
  onNoClick() {
    this.dialogRef.close();
  }
}
