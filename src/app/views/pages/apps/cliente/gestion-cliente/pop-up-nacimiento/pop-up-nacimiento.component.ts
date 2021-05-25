import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatTreeFlatDataSource, MatTreeFlattener, MAT_DIALOG_DATA } from '@angular/material';
import { ReNoticeService } from '../../../../../../../app/core/services/re-notice.service';
import { SoftbankService } from '../../../../../../../app/core/services/quski/softbank.service';
export class TodoItemFlatNode {
  id: number;
  idPadre: number;
  nombre: string;
  level: number;
  expandable: boolean;
}
export class TreeDivisionPolitica {
  id: number;
  codigo:string;
  idPadre: number;
  nombre: string;
  tipoDivision:string;
  hijo:Array<TreeDivisionPolitica>
}
@Component({
  selector: 'kt-pop-up-nacimiento',
  templateUrl: './pop-up-nacimiento.component.html',
  styleUrls: ['./pop-up-nacimiento.component.scss']
})
export class PopUpNacimientoComponent implements OnInit {
  catPais;
  catalogo;
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TreeDivisionPolitica, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  nestedNodeMap = new Map<TreeDivisionPolitica, TodoItemFlatNode>();
  newList = new Array();
  flatNodeMap = new Map<TodoItemFlatNode, TreeDivisionPolitica>();
  menu: any;
  treeFlattener: MatTreeFlattener<TreeDivisionPolitica, TodoItemFlatNode>;

  pais = new FormControl('', [Validators.required]);
  ciudadSlected = new FormControl('', [Validators.required]);
  selected;
  inputBuscar  = new FormControl('', [Validators.required]);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private sinNoticeService: ReNoticeService, private css: SoftbankService,public dialogRefGuardar: MatDialogRef<any>,) {
    /**inicializar elementos del arbol uno */
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.css.setParameter();
    this.css.consultarPaisCS().subscribe(p => {
      this.catPais = p.catalogo
    });
    //console.log("abirndo popUP",this.data)
    if(this.data.esLugarNacimiento !=='N'){
      this.buscarDivisionPolitica(52,false);
    }
    if(this.data.esLugarNacimiento == 'N'){
      this.buscarDivisionPolitica(this.data.nacionalidad,true);
    }
    
  }

  buscarDivisionPolitica(v,n) {
    if (v) {
      this.css.consultarDivicionPoliticabyIdPais(v,n).subscribe(p => {
       this.catalogo = p.catalogo
        this.dataSource.data = this.generarArbol(p.catalogo);
      });
    }
  }
  selectCiudad(node) {
    this.ciudadSlected.setValue('');
    if(node){
      this.selected = node;
      let x = this.findTreeByNode(node);
      this.nombreCiudadSelect(x);
      console.log("select ciudad",x)
    }
    
  }

  nombreCiudadSelect(nodo){
    console.log("====nombre",nodo)
    if(this.ciudadSlected.value){
      this.ciudadSlected.setValue(this.ciudadSlected.value+'/'+nodo.nombre);
    }else{
      let pais = '';
      if(this.data.esLugarNacimiento =='N') {
        pais =( this.catPais.find( x => x.id == this.data.nacionalidad ) ? this.catPais.find( x => x.id == this.data.nacionalidad ).nombre : '') + '/';
      }
      this.ciudadSlected.setValue( pais + nodo.nombre );
    }
    if(nodo.hijo &&nodo.hijo.length>0){
      this.nombreCiudadSelect(nodo.hijo[0]);
    }
  }


  findTreeByNode(node:TreeDivisionPolitica){
    const x = this.catalogo.find(p=>p.id==node.idPadre);
    if(x){
      let element:TreeDivisionPolitica = {
        id:x.id,
        idPadre:x.idPadre,
        nombre:x.nombre,
        codigo:x.codigo,
        tipoDivision:x.tipoDivision,
        hijo:[node]
      }
     return this.findTreeByNode(element)
    }else{
      return node;
    }

  }



  /**
  * METODOS DEL ARBOL
  */
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TreeDivisionPolitica): Array<TreeDivisionPolitica> => node.hijo;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.nombre === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TreeDivisionPolitica, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.nombre === node.nombre
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.nombre = node.nombre;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.idPadre = node.idPadre;
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


  generarArbol(catalogoDivisionPolitica: Array<any>){
    let padre:Array<TreeDivisionPolitica> = catalogoDivisionPolitica.filter(p=>p.idPadre==0);

   
    this.findHijos(padre,catalogoDivisionPolitica)
    console.log("padres=>>>>>>>>>>>>>>>>>>>>", padre);
    return padre;
 
  }
  findHijos(padre: Array<any>,catalogoDivisionPolitica){
    padre.forEach(t=>{
      const x= catalogoDivisionPolitica.filter(p=>p.idPadre==t.id);
      if(x != null && x != undefined){
        t.hijo =x;
        this.findHijos(t.hijo,catalogoDivisionPolitica);
      }
    });
  }

  filtrar(nombre){
    if(nombre){
      console.log("===>>>",nombre);
      const filterValue = nombre.toLowerCase();
      const x = this.catalogo.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
      this.dataSource.data = x;
  
      console.log("resultado",x) ;
    }else{
      this.dataSource.data = this.catalogo;
    }
  }


  cerrar(accion){
    if(accion=='Aceptar'){
      if(!this.selected){
        this.sinNoticeService.setNotice('Selecciona una ciudad','warning');
        return;
      }
      this.dialogRefGuardar.close({"control":this.ciudadSlected, "nodo":this.selected});
    }else{
      this.dialogRefGuardar.close();
    }
  }
 

}
