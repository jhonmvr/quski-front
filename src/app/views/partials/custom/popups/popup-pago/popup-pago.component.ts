import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { SubirComprobanteComponent } from './subir-comprobante/subir-comprobante.component';
import { ReFileUploadService } from '../../../../../core/services/re-file-upload.service';
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
export interface DialogData {
  idTipoDocumento: string;
  tipo: string;
  idCliente: number;
  identificacion: string;
  idCotizador: string;
  idNegociacion: string;
  nombresCompleto: string;
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
    private sinNotSer: ReNoticeService,
    private dh: DocumentoHabilitanteService,
    private upload: ReFileUploadService,
    private dialog: MatDialog,

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
    if(this.formOperacion.valid){
      const dialogRef = this.dialog.open(SubirComprobanteComponent, {
        width: "800px",
        height: "auto",
        data: null
      });
      //this.dialogRefGuardar.close(true);
    }else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');
    }
  }  
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
