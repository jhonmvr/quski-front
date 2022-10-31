import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadcrumbService } from '../../../../../app/core/services/breadcrumb-service.service';
import { TodoItemFlatNode } from '../arbol/arbol.component';

@Component({
  selector: 'kt-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})
export class PathComponent implements OnInit {
  path
  @Output() nodo: EventEmitter<TodoItemFlatNode> = new EventEmitter<TodoItemFlatNode>();
  @Input() set listaNodos(object: any) {
    //this.dataObservableLista.next(object);
  } 

  constructor(private bcService:BreadcrumbService) { }

  async ngOnInit() {
    this.bcService.path.subscribe(p=>{
      console.log("este es mi path",p);
      //console.log("este es mi path",p.reverse());
      this.path = p;
    })
  }
  
  abrir(){

  }
  verNodo(node){
    let flatNode: TodoItemFlatNode;
    if(  !(node instanceof TodoItemFlatNode)){
      console.log("node===>>> click", node);
      flatNode = new TodoItemFlatNode() ;
      flatNode.Name = node.Name;
      //flatNode.level = level;
      flatNode.id = node._id.$oid;
      flatNode.ParentId = node.ParentId;
      flatNode.expandable = node.hijo && node.hijo.length >0;
      //this.pathNode = new Array<any>();
    }else{
      flatNode = node;
    }
   
    
    this.nodo.emit(flatNode);
    //this.getParent(nodoEmitido);
    this.bcService.nodo.next(flatNode);
    //console.log("lista nodo", this.pathNode);
  }

}
