import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TbQoRegistrarPago } from './../../../../../../../core/model/quski/TbQoRegistrarPago';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RegistrarPagoService } from './../../../../../../../core/services/quski/registrarPago.service';
import { ReNoticeService } from './../../../../../../../core/services/re-notice.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-dialogo-bloqueo-fondos',
  templateUrl: './dialogo-bloqueo-fondos.component.html',
  styleUrls: ['./dialogo-bloqueo-fondos.component.scss']
})
export class DialogoBloqueoFondosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  /**
   * 
   * @param  sinNoticeService;
   * 
   */
  constructor(public dialogRef: MatDialogRef<DialogoBloqueoFondosComponent>,
    private sinNoticeService: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) public data: TbQoRegistrarPago, public dataService: RegistrarPagoService) {

  }

  observacion = new FormControl('', [Validators.required]);
  public formBloqueoFondos: FormGroup = new FormGroup({});


  ngOnInit() {
    this.formBloqueoFondos.addControl('observacion', this.observacion);

  }
  /**
   * @description METODO QUE AGREGA UNA NUEVO PAGO
   */
  public nuevoPago() {
    if (this.formBloqueoFondos.invalid) {
      alert("COMPLETE EL FORMULARIO CORRECTAMENTE");
      return;
    }

    let wrapperRespuesta = {
      observacion: this.observacion.value,
    
    }
    this.dialogRef.close(wrapperRespuesta);

  }
  aprobar() {
    console.log("voy a aprobar ")
    this.loadingSubject.next(true);
    if (this.formBloqueoFondos.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS BLOQUEAR FONDOS", 'warning');
      return;
    }
  }
    rechazar() {
      console.log("voy a rechazar ")
      this.loadingSubject.next(true);
      if (this.formBloqueoFondos.invalid) {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS BLOQUEAR FONDOS", 'warning');
        return;
      }
    }
  onNoClick() {
    this.dialogRef.close();
  }
}
