import { SubirComprobanteComponent } from './subir-comprobante/subir-comprobante.component';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
export interface DataUpload {
  name: string;
  type: string;
  process: string;
  fileBase64: string;
  relatedId: number;
  typeAction: string;
  relatedIdStr: string;
}
export interface WrapperRegistro{
  comprobante;
  intitucionFinanciera;
  numeroDeposito;
  valorDepositado;
  cuenta;
  fechaPago;
}

@Component({
  selector: 'kt-popup-pago',
  templateUrl: './popup-pago.component.html',
  styleUrls: ['./popup-pago.component.scss']
})
export class PopupPagoComponent implements OnInit {

  public formOperacion: FormGroup = new FormGroup({});
  public intitucionFinanciera = new FormControl('', [Validators.required]);
  public numeroDeposito = new FormControl('', [Validators.required]);
  public valorDepositado = new FormControl('', [Validators.required]);
  public cuenta = new FormControl('', [Validators.required]);
  public fechaPago = new FormControl('', [Validators.required]);
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRefGuardar: MatDialogRef<any>,
    private dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
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
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  loadArchivoCliente(element) {
    console.log('Data desde el componente', this.data );
    if(this.formOperacion.valid){
      let d = {
        idTipoDocumento: 10,
        idCredito: this.data
      };
      const dialogRef = this.dialog.open(SubirComprobanteComponent, {
        width: '500px',
        height: 'auto',
        data: d
      });
      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          let wrapperRegistro: WrapperRegistro = {
            comprobante:r,
            intitucionFinanciera: this.intitucionFinanciera.value,
            numeroDeposito: this.numeroDeposito.value,
            valorDepositado: this.valorDepositado.value,
            cuenta: this.cuenta.value,
            fechaPago: this.fechaPago.value
          };
          console.log('Regresando de Subir Comprobante ----> ' + wrapperRegistro);
          this.dialogRefGuardar.close(wrapperRegistro);
        }else{
          this.sinNoticeService.setNotice('ERROR CARGANDO ARCHIVO','error');
        }
      });
    }
  }
}
