import { SubirComprobanteComponent } from './subir-comprobante/subir-comprobante.component';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
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
  public file: any;
  catBanco: {id: number, nombre:string}[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { id : number, banco: number, numeroCuenta: string },
    public dialogRefGuardar: MatDialogRef<any>,
    private dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
    private sof: SoftbankService,
  ) {
    this.formOperacion.addControl("intitucionFinanciera", this.intitucionFinanciera);
    this.formOperacion.addControl("numeroDeposito", this.numeroDeposito);
    this.formOperacion.addControl("valorDepositado", this.valorDepositado);
    this.formOperacion.addControl("cuenta", this.cuenta);
    this.formOperacion.addControl("fechaPago", this.fechaPago);
   }

  ngOnInit() {
    this.cargarCatalogos();
  }
  private cargarCatalogos(){
    this.sof.consultarBancosCS().subscribe( data =>{
      this.catBanco = data.catalogo ? data.catalogo :  {nombre: 'No se cargo el catalogo. Error', id: 0};
      this.intitucionFinanciera.setValue(this.catBanco.find(x => x.id == this.data.banco) ? this.catBanco.find(x => x.id == this.data.banco) : {nombre: 'No se cargo el catalogo. Error', id: 0});
      this.intitucionFinanciera.value.nombre ? this.cuenta.setValue( this.data.numeroCuenta ) : 'Error cargando numero de cuenta'; 
    });
  }
  public chanceBanco(){
    
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
  loadArchivoCliente() {
    if(this.formOperacion.valid){
      let d = {
        idTipoDocumento: 10,
        idCredito: this.data.id
      };
      const dialogRef = this.dialog.open(SubirComprobanteComponent, {
        width: '500px',
        height: 'auto',
        data: d
      });
      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          this.file = r;
          this.sinNoticeService.setNotice('ARCHIVO CARGADO','success');
        }else{
          this.sinNoticeService.setNotice('ERROR CARGANDO ARCHIVO','error');
        }
      });
    }
  }
  public aceptar(){
    if(this.formOperacion.valid){
      let wrapperRegistro: WrapperRegistro = {
        comprobante:this.file ? this.file : null,
        intitucionFinanciera: this.intitucionFinanciera.value,
        numeroDeposito: this.numeroDeposito.value,
        valorDepositado: this.valorDepositado.value,
        cuenta: this.cuenta.value,
        fechaPago: this.fechaPago.value
      };
      this.dialogRefGuardar.close(wrapperRegistro);
      console.log('Regresando de Subir Comprobante ----> ' + wrapperRegistro);
    }else{
      this.sinNoticeService.setNotice('COMPLETE EL FORMULARIO','error');
    }
  }
}
