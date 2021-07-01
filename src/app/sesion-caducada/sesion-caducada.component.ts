import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { AutorizacionService } from '../core/services/autorizacion.service';

@Component({
  selector: 'kt-sesion-caducada',
  templateUrl: './sesion-caducada.component.html',
  styleUrls: ['./sesion-caducada.component.scss']
})
export class SesionCaducadaComponent implements OnInit {

  public mensaje: string;
  idleState = 'STARTED';
	messageState='INICIA TIMER IDLE'
	timedOut = false;
	lastPing?: Date = null;

  constructor(public dialogRef: MatDialogRef<SesionCaducadaComponent>, @Inject(MAT_DIALOG_DATA) private data: {message:string, timeOut:number},
  private idle: Idle, private keepalive: Keepalive, private as:AutorizacionService) {
    idle.onIdleEnd.subscribe(() =>{
      console.log("====>>>onIdleEnd");
      this.idleState = 'NOT_IDLE';
      this.messageState="SALIENDO DE ESTADO INACTIVO";
    } );
  
    idle.onTimeout.subscribe(() => {
      console.log("====>>>onTimeout")
      this.idleState = 'TIMED_OUT';
      this.messageState="ESTADO INACTIVO ENVIO A LOGIN";
      this.timedOut = true;
      this.as.logoutDialog();
    });
  
    idle.onTimeoutWarning.subscribe((countdown) =>{
      console.log("====>>>onTimeoutWarning");
      this.idleState = 'STARTING_IDLE';
      this.messageState = 'TU TIEMPO DE INACTIVADAD A SUPERADO EL LIMITIE, SALDRAS DEL SISTEMA EN ' + countdown + ' seconds!';
      this.mensaje='TU TIEMPO DE INACTIVADAD A SUPERADO EL LIMITIE, SALDRAS DEL SISTEMA EN ' + countdown + ' seconds!';
    } );
  }
  ngOnInit(): void {
    this.mensaje = this.data.message;
    console.log('MENSAJE EDAD MensajeEdadComponent===> ', this.mensaje);
    
  }
  salir() {
    this.dialogRef.close();
  }

  reset() {
		this.idle.watch();
		this.idleState = 'Started.';
		this.timedOut = false;
    this.dialogRef.close();
	}

  

}
