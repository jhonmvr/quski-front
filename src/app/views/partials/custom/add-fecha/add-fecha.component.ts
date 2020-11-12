import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DevolucionService } from '../../../../core/services/quski/devolucion.service';

@Component({
  selector: 'kt-add-fecha',
  templateUrl: './add-fecha.component.html',
  styleUrls: ['./add-fecha.component.scss']
})
export class AddFechaComponent implements OnInit {

  idDevolucionesSubject:BehaviorSubject<any>=new BehaviorSubject<any>("");


  @Input("idDevoluciones") set idDevoluciones(value: Number[]) {
    this.idDevolucionesSubject.next(value);
  }
  get idDevoluciones():Number[] {
  return this.idDevolucionesSubject.getValue();
  }
 
  fechaArribo = new FormControl('', []);
  constructor(private devSev: DevolucionService) { }

  ngOnInit() {
  }



  registrarFecha(arrayIdDevolucion: Number[]){
    this.devSev.registrarFechaArribo(arrayIdDevolucion, this.fechaArribo.value).subscribe((data:any)=>{
      if(data){
        console.log(data)
      }  
    
    })
    
  }
}
