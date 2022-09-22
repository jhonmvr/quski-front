import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { PerfilesService } from './../../../../core/services/gestor-documental/perfiles.service';

@Component({
  selector: 'kt-usuarios-perfil-table',
  templateUrl: './usuarios-perfil-table.component.html',
  styleUrls: ['./usuarios-perfil-table.component.scss']
})
export class UsuariosPerfilTableComponent implements OnInit {
  datasource:MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumnPerfiles = ['accion', 'usuario']
  selection = new SelectionModel<Element>(true, []);
  bandera: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  listaPerfiles
  perfilSeleccionado
  @Input() set listaUsuarios(list: Array<any>) {
    this.dataObservable.next(list);
  }
  @Input() set listaPerfilesInput(list: Array<any>) {
    this.dataObservablePerfiles.next(list);
  }
  @Input() set perfilSeleccionadoInput(object: any) {
    this.dataObservablePerfilSeleccionado.next(object);
  }
  private dataObservable: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(null);
  private dataObservablePerfiles: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(null);
  private dataObservablePerfilSeleccionado: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  ObjetoEncriptadoWrapper ={
    objectEncripted : ""
  }
  constructor(private ps: PerfilesService) { }

  ngOnInit() {
    this.bandera.next(true);
    this.dataObservable.subscribe(p=> {  
      console.log("subscribe",p)
      if(p != null){
        this.datasource=  new MatTableDataSource<any>(p);
      }
      this.bandera.next(false);
    })
    this.dataObservablePerfiles.subscribe(p=> {  
      console.log("subscribe",p)
      if(p != null){
        this.listaPerfiles= p;
      }
    })
    this.dataObservablePerfilSeleccionado.subscribe(p=> {  
      console.log("perfile seleccionado",p)
      if(p != null){
        this.perfilSeleccionado= p;
      }
    })
  }

   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.datasource.data);
  }
  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  eliminarPerfil(){
    let perfilSeleccionadoTemporal = this.perfilSeleccionado
    console.log("perfil", perfilSeleccionadoTemporal)
   console.log( " perfil Seleccionado xd vamo ahi ", this.perfilSeleccionado.usuarios)
  
   this.selection.selected.forEach((x:any)=> {
    
    let indice =  perfilSeleccionadoTemporal.usuarios.indexOf(perfilSeleccionadoTemporal.usuarios.find(usua=> usua.codigo == x.codigo))
    let deletedScores = this.perfilSeleccionado.usuarios.splice(indice, 1);
    console.log("despues de borrar", perfilSeleccionadoTemporal.usuarios)

 
  } )
  this.ObjetoEncriptadoWrapper.objectEncripted =  btoa(unescape(encodeURIComponent(JSON.stringify(perfilSeleccionadoTemporal))));
     
  this.ps.actualizarUsuarioPerfiles(perfilSeleccionadoTemporal._id.$oid, this.ObjetoEncriptadoWrapper).subscribe((data:any)=>{

  })
}
  
}
