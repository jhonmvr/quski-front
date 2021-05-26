import { SubirComprobanteComponent } from './subir-comprobante/subir-comprobante.component';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { ValidateDecimal } from '../../../../../core/util/validator.decimal';
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
  tipoPago;
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
  public valorDepositado = new FormControl('', [Validators.required, ValidateDecimal, Validators.maxLength(13) ]);
  public tipoPago = new FormControl('', [Validators.required]);
  public cuenta = new FormControl('', [Validators.required]);
  public fechaPago = new FormControl('', [Validators.required]);
  public file: any;
  catBanco: {id: number, nombre:string}[];
  catTipoPago; any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { id : number, banco: number, numeroCuenta: string },
    public dialogRefGuardar: MatDialogRef<any>,
    private dialog: MatDialog,
    private par: ParametroService,
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
    this.intitucionFinanciera.disable();
    this.cuenta.disable();
  }
  private cargarCatalogos(){
    this.sof.consultarBancosCS().subscribe( data =>{
      this.catBanco = data.catalogo ? data.catalogo :  {nombre: 'No se cargo el catalogo. Error', id: 0};
      let banco = this.catBanco.find(x => x.id == this.data.banco);
      if(banco){
        this.intitucionFinanciera.setValue( banco );
        this.cuenta.setValue( this.data.numeroCuenta );
      }
    });
    this.par.findByTipo('TIPO-PAGO-COMP').subscribe( (data: any) =>{
      this.catTipoPago = data.entidades ? data.entidades : {nombre: 'ERR', valor: 'Error al cargar catalogo'}
      this.tipoPago.setValue( this.catTipoPago.find( x => x.nombre == 'EFECTIVO') );
    });
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
        idCredito: this.data.id ? this.data.id : null,
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
  public getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingrese valores';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorDecimal = 'Ingrese valores decimales: 0.00';
    if (pfield && pfield === 'valorDepositado') {
      const input = this.formOperacion.get("valorDepositado");
      return input.hasError("required") ? errorRequerido : input.hasError("invalido") ? errorDecimal : input.hasError("maxlength") ? errorLogitudExedida : "";
    }if (pfield && pfield === 'intitucionFinanciera') {
      const input = this.formOperacion.get("intitucionFinanciera");
      return input.hasError("required") ? errorRequerido : "";
    }if (pfield && pfield === 'numeroDeposito') {
      const input = this.formOperacion.get("numeroDeposito");
      return input.hasError("required") ? errorRequerido : "";
    }if (pfield && pfield === 'cuenta') {
      const input = this.formOperacion.get("cuenta");
      return input.hasError("required") ? errorRequerido : "";
    }if (pfield && pfield === 'fechaPago') {
      const input = this.formOperacion.get("fechaPago");
      return input.hasError("required") ? errorRequerido : "";
    }
  }
  public aceptar(){
    if(this.formOperacion.valid){
      console.log('Institucion? =>' , this.intitucionFinanciera.value);
      let wrapperRegistro: WrapperRegistro = {
        comprobante:this.file ? this.file : null,
        intitucionFinanciera: this.intitucionFinanciera.value ? this.intitucionFinanciera.value : '',
        numeroDeposito: this.numeroDeposito.value,
        valorDepositado: this.valorDepositado.value,
        cuenta: this.cuenta.value,
        fechaPago: this.fechaPago.value,
        tipoPago: this.tipoPago.value.valor
      };
      this.dialogRefGuardar.close(wrapperRegistro);
    }else{
      this.sinNoticeService.setNotice('COMPLETE EL FORMULARIO','error');
    }
  }
}
