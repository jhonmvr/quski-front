import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { TbQoRegistrarPago } from '../../../../../../../core/model/quski/TbQoRegistrarPago';
import { RegistrarPagoService } from '../../../../../../../core/services/quski/registrarPago.service';
import { ReNoticeService } from '../../../../../../../core/services/re-notice.service';

@Component({
  selector: 'kt-dialogo-rechazar-bloqueo-fondos',
  templateUrl: './dialogo-rechazar-bloqueo-fondos.component.html',
  styleUrls: ['./dialogo-rechazar-bloqueo-fondos.component.scss']
})
export class DialogoRechazarBloqueoFondosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  /**
   * 
   * @param  sinNoticeService;
   * 
   */
  constructor(
    public dialogRef: MatDialogRef<DialogoRechazarBloqueoFondosComponent>,
    private sinNoticeService: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) public data: TbQoRegistrarPago, public dataService: RegistrarPagoService) {

  }

  observacion = new FormControl('', [Validators.required]);
  public formRechazarPagos: FormGroup = new FormGroup({});


  ngOnInit() {
    this.formRechazarPagos.addControl('observacion', this.observacion);

  }
  /**
   * @description METODO QUE AGREGA UNA NUEVO PAGO
   */
  

  rechazar() {
    //console.log("voy a rechazar")
    this.loadingSubject.next(true);
    if (this.formRechazarPagos.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS RECHAZAR PAGO", 'warning');
      return;
    }
       
    this.dialogRef.close();
  }


  onNoClick() {
    this.dialogRef.close();
  }
}
