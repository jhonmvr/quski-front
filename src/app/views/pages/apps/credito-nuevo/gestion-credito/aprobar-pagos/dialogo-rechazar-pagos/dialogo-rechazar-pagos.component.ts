import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { TbQoRegistrarPago } from './../../../../../../../core/model/quski/TbQoRegistrarPago';
import { RegistrarPagoService } from './../../../../../../../core/services/quski/registrarPago.service';
import { ReNoticeService } from './../../../../../../../core/services/re-notice.service';

@Component({
  selector: 'kt-dialogo-rechazar-pagos',
  templateUrl: './dialogo-rechazar-pagos.component.html',
  styleUrls: ['./dialogo-rechazar-pagos.component.scss']
})
export class DialogoRechazarPagosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  /**
   * 
   * @param  sinNoticeService;
   * 
   */
  constructor(
    public dialogRef: MatDialogRef<DialogoRechazarPagosComponent>,
    private sinNoticeService: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) public data: TbQoRegistrarPago, public dataService: RegistrarPagoService) {
      this.dataService.setParameter();
  }

  observacion = new FormControl('', [Validators.required]);
  public formRechazarPagos: FormGroup = new FormGroup({});


  ngOnInit() {
      this.dataService.setParameter();
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
