import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TbQoRegistrarPago } from '../../../../../../../core/model/quski/TbQoRegistrarPago';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RegistrarPagoService } from '../../../../../../../core/services/quski/registrarPago.service';
import { BehaviorSubject } from 'rxjs';
import { ReNoticeService } from '../../../../../../../core/services/re-notice.service';
import { TbQoClientePago } from '../../../../../../../core/model/quski/TbQoClientePago';

@Component({
  selector: 'kt-dialogo-aprobar-bloqueo-fondos',
  templateUrl: './dialogo-aprobar-bloqueo-fondos.component.html',
  styleUrls: ['./dialogo-aprobar-bloqueo-fondos.component.scss']
})
export class DialogoAprobarBloqueoFondosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  /**
   * 
   * @param  sinNoticeService;
   * 
   */
  constructor(
    private registrarPagoService: RegistrarPagoService,
    public dialogRef: MatDialogRef<DialogoAprobarBloqueoFondosComponent>,
    private sinNoticeService: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) public data: TbQoRegistrarPago, public dataService: RegistrarPagoService) {

  }

  observacion = new FormControl('', [Validators.required]);
  public formAprobarPagos: FormGroup = new FormGroup({});


  ngOnInit() {
    this.formAprobarPagos.addControl('observacion', this.observacion);

  }
  /**
   * @description METODO QUE AGREGA UNA NUEVO PAGO
   */
  

  aprobar() {
    console.log("voy a aprobar ")
    this.loadingSubject.next(true);
    if (this.formAprobarPagos.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS APROBAR PAGO", 'warning');
      return;
    }
       
    this.dialogRef.close();
  }


  onNoClick() {
    this.dialogRef.close();
  }
}
