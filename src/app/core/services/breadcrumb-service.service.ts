import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  currentViewFolder:BehaviorSubject<any> = new BehaviorSubject<any>({});
  listaCarpetas:BehaviorSubject<any> = new BehaviorSubject<any>({});
  path:BehaviorSubject<any> = new BehaviorSubject<any>({});
  listCar;
  pathNode;
  nodo:BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor() { 
    // this.clearnBreadCrum()
    this.listaCarpetas.subscribe(p=>{
      console.log("mi lista de carpetas",p);
      this.listCar = p;
    });

    this.nodo.subscribe(nodo=>{
      console.log("ver nodo",nodo);
      this.pathNode = new Array<any>();
      this.getParent(nodo);
      this.path.next(this.pathNode);
    });

  }

  clearnBreadCrum(){
    this.currentViewFolder.next({});
  }


  async removeAt(breadState){
    
  }

  async refreshAfterAction(){
   
  }

  async requestPath(path:string){
  

  }


  getParent(nodo){
    //console.log("====nombre",nodo)
    this.pathNode.unshift(nodo);
    if(nodo.ParentId){
      nodo=  this.listCar.find(x=>x._id.$oid == nodo.ParentId);
      //console.log("el false", nodo)
      this.getParent(nodo)
    }
  }

 
}