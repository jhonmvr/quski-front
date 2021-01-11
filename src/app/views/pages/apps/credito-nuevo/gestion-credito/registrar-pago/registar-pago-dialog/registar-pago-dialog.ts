import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TbQoRegistrarPago } from './../../../../../../../core/model/quski/TbQoRegistrarPago';
import { RegistrarPagoService } from './../../../../../../../core/services/quski/registrarPago.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-registar-pago-dialog',
  templateUrl: './registrar-pago-dialog.html',
  styleUrls: ['./registar-pago-dialog.scss']
})
export class RegistarPagoDialogComponent implements OnInit {
  public formCliente: FormGroup = new FormGroup({});
  public institucionFinanciera = new FormControl('',[Validators.required]);
  public numeroDeposito = new FormControl('',[Validators.required]);
  public valorPagado = new FormControl('',[Validators.required]);
  public cuentas = new FormControl('',[Validators.required]);
  public fechaPago = new FormControl('',[Validators.required]);

  loadingSubject = new BehaviorSubject<boolean>(false);
  constructor( public dialogRef: MatDialogRef<RegistarPagoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:TbQoRegistrarPago  , public dataService: RegistrarPagoService ) { 
      this.dataService.setParameter();
  }
  ngOnInit(){
    this.dataService.setParameter();
    this.institucionFinanciera.setValue("Mutualista Pichincha");
    this.formCliente.addControl('institucionFinanciera',this.institucionFinanciera);
    this.formCliente.addControl('numeroDeposito',this.numeroDeposito);
    this.formCliente.addControl('valorPagado',this.valorPagado);
    this.formCliente.addControl('cuentas',this.cuentas);
    this.formCliente.addControl('fechaPago',this.fechaPago);
  }
  /**
   * @description METODO QUE AGREGA UNA NUEVO PAGO
   */
  public nuevoPago() {
    this.loadingSubject.next(true);
    if (this.formCliente.invalid){
      this.loadingSubject.next(false);
      alert("COMPLETE EL FORMULARIO CORRECTAMENTE");
      return;
    }

    let wrapperRespuesta={
      institucionFinanciera:this.institucionFinanciera.value,
      numeroDeposito:this.numeroDeposito.value,
      valorPagado:this.valorPagado.value,
      cuentas:this.cuentas.value,
      fechaPago:this.fechaPago.value
    }
    this.dialogRef.close(wrapperRespuesta);

  }
  onNoClick(){
    this.dialogRef.close();
  }
}
