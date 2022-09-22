import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { BreadcrumbService } from '../../../../core/services/breadcrumb-service.service';
import { UsuariosService } from '../../../../core/services/gestor-documental/usuarios.service';

@Component({
  selector: 'kt-arbol',
  templateUrl: './arbol.component.html',
  styleUrls: ['./arbol.component.scss']
})
export class ArbolComponent implements OnInit {

  @Output() nodo: EventEmitter<TodoItemFlatNode> = new EventEmitter<TodoItemFlatNode>();
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TreeNodo, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  nestedNodeMap = new Map<TreeNodo, TodoItemFlatNode>();
  newList = new Array();
  flatNodeMap = new Map<TodoItemFlatNode, TreeNodo>();
  menu: any;
  treeFlattener: MatTreeFlattener<TreeNodo, TodoItemFlatNode>;

  pais = new FormControl('', [Validators.required]);
  
  pathNode;
  inputBuscar  = new FormControl('', [Validators.required]);
  nodePadre;

  usuario = {nombre: ""}
  entidades =[];
  listaCarpetas = [];
  objetoBusquedaParams = {
    "etiqueta":"",
    "cadena": "",
    "operador": "eq"
  }
  ObjetoEncriptadoWrapper ={
    objectEncripted : ""
  }
  constructor(private us: UsuariosService, private bcService:BreadcrumbService) { 
     /**inicializar elementos del arbol uno */
     this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.findCarpetas();


  }

  
  findRoot(){
    this.objetoBusquedaParams.etiqueta="Name";
    this.objetoBusquedaParams.cadena="root";
    this.entidades.push(this.objetoBusquedaParams)
    
    this.us.findByParams({"entidades":this.entidades}).subscribe((data:any)=>{
      if(data && data.entidades){
        data.entidades.forEach(element => {
          
          //console.log("entidades desencriptadas", JSON.parse(atob(element)))
        });
      }
     
    })
  }

  findCarpetas(){
    this.objetoBusquedaParams.etiqueta="Type";
    this.objetoBusquedaParams.cadena="CARPETA";
    let arregloDeConsulta=[];
    arregloDeConsulta.push(this.objetoBusquedaParams)

    this.us.findByParams({"entidades": arregloDeConsulta}).subscribe((data:any)=>{
      if(data && data.entidades){
        data.entidades.forEach(element => {
          
          this.listaCarpetas.push( JSON.parse(atob(element)))
        });
        this.bcService.listaCarpetas.next(this.listaCarpetas);
        this.dataSource.data = this.generarArbol(this.listaCarpetas);
        //console.log("carpetas desencriptadas",  this.dataSource.data);
      }
      
    })
  }

   /**
  * METODOS DEL ARBOL
  */
    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;
  
    getChildren = (node: TreeNodo): Array<TreeNodo> => node.hijo;
  
    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  
    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.Name === '';
  
    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TreeNodo, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode = existingNode && existingNode.Name === node.Name
        ? existingNode
        : new TodoItemFlatNode();
      flatNode.Name = node.Name;
      flatNode.level = level;
      flatNode.id = node._id.$oid;
      flatNode.ParentId = node.ParentId;
      flatNode.expandable = node.hijo && node.hijo.length >0;
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    }
  
    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      return descAllSelected;
    }
  
    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
      const descendants = this.treeControl.getDescendants(node);
      const result = descendants.some(child => this.checklistSelection.isSelected(child));
      return result && !this.descendantsAllSelected(node);
    }
  
    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
      this.checklistSelection.toggle(node);
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
  
      // Force update for the parent
      descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      this.checkAllParentsSelection(node);
  
  
    }
    isCheked(node: TodoItemFlatNode) {
      this.menu.array.forEach(element => {
  
      });
    }
  
  
    checkFlat(node: TodoItemFlatNode): boolean {
  
      //guardo los objetos seleccionados en una lista
      if (this.checklistSelection.isSelected(node)) {
  
        const index = this.newList.indexOf(node, 0);
        if (index == -1) {
          this.newList.push(node);
        }
      } else {
        const index = this.newList.indexOf(node, 0);
        if (index > -1) {
          this.newList.splice(index, 1);
        }
      }
      return this.checklistSelection.isSelected(node);
    }
  
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
      this.checklistSelection.toggle(node);
      this.checkAllParentsSelection(node);
    }
  
    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TodoItemFlatNode): void {
      let parent: TodoItemFlatNode | null = this.getParentNode(node);
      while (parent) {
        this.checkRootNodeSelection(parent);
        parent = this.getParentNode(parent);
      }
    }
  
    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TodoItemFlatNode): void {
      const nodeSelected = this.checklistSelection.isSelected(node);
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      if (nodeSelected && !descAllSelected) {
        this.checklistSelection.deselect(node);
      } else if (!nodeSelected && descAllSelected) {
        this.checklistSelection.select(node);
      }
    }
  
    /* Get the parent node of a node */
    getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
      const currentLevel = this.getLevel(node);
  
      if (currentLevel < 1) {
        return null;
      }
  
      const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
  
      for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];
  
        if (this.getLevel(currentNode) < currentLevel) {
          return currentNode;
        }
      }
      return null;
    }
  
  
  
  
    /**
     * FIN METODOS DEL ARBOL
     */
  
  
    generarArbol(carpetas: Array<any>){
      let padre:Array<TreeNodo> = carpetas.filter(p=>p.ParentId===null);
  
     
      this.findHijos(padre,carpetas)
      //console.log("padres=>>>>>>>>>>>>>>>>>>>>", padre);
      return padre;
   
    }
    findHijos(padre: Array<any>,carpetas){
      padre.forEach(t=>{
        const x= carpetas.filter(p=>p.ParentId==t._id.$oid);
        if(x != null && x != undefined){
          t.hijo =x;
          this.findHijos(t.hijo,carpetas);
        }
      });
    }


    verNodo(nodoEmitido){
      this.pathNode = new Array<any>();
      //console.log("mi nodo click", nodoEmitido);
      this.nodo.emit(nodoEmitido);
      //this.getParent(nodoEmitido);
      this.bcService.nodo.next(nodoEmitido);
      //console.log("lista nodo", this.pathNode);
    }


 

  
}

export class TreeNodo {
  _id:{$oid : number} ;
  codigo:string;
  ParentId: number;
  Name: string;
  tipoDivision:string;
  hijo:Array<TreeNodo>
}

export class TodoItemFlatNode {
  id: number;
  ParentId: number;
  Name: string;
  level: number;
  expandable: boolean;
}