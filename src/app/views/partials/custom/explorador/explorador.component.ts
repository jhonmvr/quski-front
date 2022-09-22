import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodoItemFlatNode } from '../arbol/arbol.component';

@Component({
  selector: 'kt-explorador',
  templateUrl: './explorador.component.html',
  styleUrls: ['./explorador.component.scss']
})
export class ExploradorComponent implements OnInit {

  path;
  nodoAEnviar;
  
  @Input() set listaNodos(object: any) {
    this.dataObservableLista.next(object);
  } 

  private dataObservableLista: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor() { }

  async ngOnInit() {
    this.dataObservableLista.subscribe(async p=> {  
      
      if(p){
        this.path= p;
        console.log(this.path)
      }
 
    })
    
  }



  
  verNodo(nodeins:TodoItemFlatNode){
    console.log("el nodo emitido", nodeins)
    this.nodoAEnviar = nodeins
    console.log("llega aca", this.nodoAEnviar)
  }
}
