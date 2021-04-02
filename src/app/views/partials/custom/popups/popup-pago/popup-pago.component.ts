import { SubirComprobanteComponent } from './subir-comprobante/subir-comprobante.component';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
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
  public valorDepositado = new FormControl('', [Validators.required, ValidateDecimal, Validators.max(100) ]);
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
  public aceptar(){
    if(this.formOperacion.valid){
      let wrapperRegistro: WrapperRegistro = {
        comprobante:this.file ? this.file : null,
        intitucionFinanciera: this.intitucionFinanciera.value ? this.intitucionFinanciera.value.codigo : '',
        numeroDeposito: this.numeroDeposito.value,
        valorDepositado: this.valorDepositado.value,
        cuenta: this.cuenta.value,
        fechaPago: this.fechaPago.value,
        tipoPago: this.tipoPago.value.valor
      };
      this.dialogRefGuardar.close(wrapperRegistro);
      console.log('Regresando de Subir Comprobante ----> ' + wrapperRegistro);
    }else{
      this.sinNoticeService.setNotice('COMPLETE EL FORMULARIO','error');
    }
  }
}
