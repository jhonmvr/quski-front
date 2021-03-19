import { SimulacionPrecancelacion } from '../../../../../core/model/softbank/SimulacionPrecancelacion';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'kt-ventana-precancelacion',
  templateUrl: './ventana-precancelacion.component.html',
  styleUrls: ['./ventana-precancelacion.component.scss']
})
export class VentanaPrecancelacionComponent implements OnInit {
  
  public formDisabled: FormGroup = new FormGroup({});
  public fechaSimulacion  = new FormControl('', [Validators.required]);
  capital = new FormControl();
  capitalCastigado = new FormControl();
  interes = new FormControl();
  mora = new FormControl();
  otros = new FormControl();
  valorTotal = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) private numeroOperacion: string,
    private sinNotSer: ReNoticeService,
    private sof: SoftbankService

  ) {
    this.formDisabled.addControl('capital', this.capital);
    this.formDisabled.addControl('capitalCastigado', this.capitalCastigado);
    this.formDisabled.addControl('interes', this.interes);
    this.formDisabled.addControl('mora', this.mora);
    this.formDisabled.addControl('otros', this.otros);
    this.formDisabled.addControl('valorTotal', this.valorTotal);
   }

  ngOnInit() {
    this.formDisabled.disable();
  }
  public simular(){
    if(!this.numeroOperacion){
      this.sinNotSer.setNotice('ERROR EN LA LECTURA DE DATOS. FALTA NUMERO DE OPERACION.', 'error');
      return;
    }
    if(!this.fechaSimulacion.valid){
      this.sinNotSer.setNotice('INGRESE UNA FECHA VALIDA', 'warning');
    }
    let x: Date = this.fechaSimulacion.value;
    let mont = x.getMonth() > Number(9) ? x.getMonth() : "0" + x.getMonth();
    let date = x.getDate() > Number(9) ? x.getDate() : "0" + x.getDate();
    let y: string = x.getFullYear() + "-" + mont + '-' + date;
    console.log(' Fecha de simulacion =>', y);
    let w: SimulacionPrecancelacion = { 
      numeroPrestamo: this.numeroOperacion,
      fechaPrecancelacion: y
    }
    this.sof.simularPrecancelacionCS( w ).subscribe( ( data: any) =>{
      this.sinNotSer.setNotice('SIMULACION CARGADA.', 'success')
      if(data.existeError){
        this.sinNotSer.setNotice('RESPUESTA SOFTBANK: '+ data.mensaje, 'warning');
      }
      this.valorTotal.setValue(data.valorTotal);
      this.capital.setValue(data.capital);
      this.capitalCastigado.setValue(data.capitalCastigado);
      this.interes.setValue(data.interes);
      this.mora.setValue(data.mora);
      this.otros.setValue(data.otros); 
    });
  }

}
