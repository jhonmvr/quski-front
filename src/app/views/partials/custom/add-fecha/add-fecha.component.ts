import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { diferenciaEnDias } from '../../../../core/util/diferenciaEnDias';
import { DevolucionService } from '../../../../core/services/quski/devolucion.service';

@Component({
  selector: 'kt-add-fecha',
  templateUrl: './add-fecha.component.html',
  styleUrls: ['./add-fecha.component.scss']
})
export class AddFechaComponent implements OnInit {

  min = new Date();
  idDevolucionesSubject:BehaviorSubject<any>=new BehaviorSubject<any>("");
  fechaUtil: diferenciaEnDias

  @Input("idDevoluciones") set idDevoluciones(value: Number[]) {
    this.idDevolucionesSubject.next(value);
  }
  get idDevoluciones():Number[] {
  return this.idDevolucionesSubject.getValue();
  }
 
  fechaArribo = new FormControl('', []);
  constructor(private devSev: DevolucionService,  public dialogRef: MatDialogRef<AddFechaComponent>) { }

  ngOnInit() {

    //console.log("hello",this.idDevoluciones)
  }

  registrarFecha(){
    this.fechaUtil = new diferenciaEnDias(new Date(this.fechaArribo.value))
    if(this.fechaArribo.value){
      //console.log("registrar",this.fechaUtil)
      this.dialogRef.close(this.fechaUtil.convertirFechaAString(this.fechaArribo.value));
    }
    else{
      //console.log("fallamos")
    }

  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  salir(): void {
    this.dialogRef.close();
 }
}
