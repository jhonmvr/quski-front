import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TbQoRegistrarPago } from './../../../../../../../core/model/quski/TbQoRegistrarPago';
import { RegistrarPagoService } from './../../../../../../../core/services/quski/registrarPago.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'kt-registar-pago-dialog',
  templateUrl: './registrar-pago-dialog.html',
  styleUrls: ['./registar-pago-dialog.scss']
})
export class RegistarPagoDialogComponent implements OnInit {

   
    constructor( public dialogRef: MatDialogRef<RegistarPagoDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data:TbQoRegistrarPago  , public dataService: RegistrarPagoService ) { 
    
      }

      institucionFinanciera = new FormControl('',[Validators.required]);
    
    numerodeDeposito = new FormControl('',[Validators.required]);
    
    valorpagado = new FormControl('',[Validators.required]);
    
    cuentas = new FormControl('',[Validators.required]);
    
    fechadePago = new FormControl('');

    public formCliente: FormGroup = new FormGroup({});
 

      ngOnInit(){
        this.formCliente.addControl('institucionFinaciera',this.institucionFinanciera);
        this.formCliente.addControl('numerodeDeposito',this.numerodeDeposito);
        this.formCliente.addControl('valorpagado',this.valorpagado);
        this.formCliente.addControl('cuentas',this.cuentas);
        this.formCliente.addControl('fechadePago',this.fechadePago);

      }
  /**
   * @description METODO QUE AGREGA UNA NUEVO PAGO
   */
  public nuevoPago() {
    if (this.formCliente.invalid){
      alert("COMPLETE EL FORMULARIO CORRECTAMENTE");
      return;
    }

    let wrapperRespuesta={
      institucionFinanciera:this.institucionFinanciera.value,
      numerodeDeposito:this.numerodeDeposito.value,
      valorpagado:this.valorpagado.value,
      cuentas:this.cuentas.value,
      fechadePago:this.fechadePago.value
    }
    this.dialogRef.close(wrapperRespuesta);

  }
  onNoClick(){
    this.dialogRef.close();
  }
}
