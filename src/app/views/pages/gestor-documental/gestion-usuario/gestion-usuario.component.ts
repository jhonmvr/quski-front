import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { UsuariosService } from '../../../../core/services/gestor-documental/usuarios.service';
import { PerfilesService } from '../../../../core/services/gestor-documental/perfiles.service';
import { CatalogoService } from '../../../../core/services/quski/catalogo.service';
import { TodoItemFlatNode } from '../../../../views/partials/custom/arbol/arbol.component';

@Component({
  selector: 'kt-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.scss']
})
export class GestionUsuarioComponent implements OnInit {
  public formFiltros: FormGroup = new FormGroup({});
  public codigoUsuario = new FormControl('', []);
  perfil
  usuariosPorPerfil
  perfilesDelUsuario
  nodoAEnviar;
  dataSourceUsuarios = new MatTableDataSource<any>();
  displayedColumnsUsuarios = ['accion', 'usuario', 'verPerfil']
  dataSourceUsuarioPerfil = new MatTableDataSource<any>();
  displayedColumnPerfiles = ['accion', 'usuario']
  roles = ["1","2","3","4","5","6","7","8","9","10"]
  perfilSeleccionado
  // listaUsuarios = new Set()
   userList = [];
   usuariosFiltrados= [];
  usuariosFinal = [];
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;
  busqueda
  selection = new SelectionModel<Element>(true, []);
  listaPerfiles;
  listaUsuariosMongo;
  usuario = {nombre: ""}
  entidades =[];
  objetoBusquedaParams = {
    "etiqueta":"",
    "cadena": "",
    "operador": "eq"
  }
  ObjetoEncriptadoWrapper ={
    objectEncripted : ""
  }
  constructor(private cs: CatalogoService, private ps: PerfilesService, private us: UsuariosService) { }

  ngOnInit() {
    this.getUsuarios();
    this.getPerfiles();
    this.getUsuariosMongo();
    this.findRoot();
  }



  verPerfil(){

  }
  getUsuarios(){
    
    this.cs.consultarAsesoresCS(this.roles).subscribe((data:any)=>{
      data.catalogo.forEach(element => {
        this.userList.push(element.codigo);
      });
      this.usuariosFiltrados =this.useFilter(this.userList);
      this.usuariosFiltrados.forEach(x=> this.usuariosFinal.push({"codigo": x}))
      console.log(this.usuariosFinal)
      this.buscar();
    })
  }

   useFilter = arr => {
    return arr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  };

  //check
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceUsuarios.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceUsuarios.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  buscar(){
    this.busqueda =  this.usuariosFinal.filter(x=> x.codigo.includes(this.codigoUsuario.value))
    this.dataSourceUsuarios = new MatTableDataSource<any>(this.busqueda);
    this.dataSourceUsuarios.paginator = this.paginator
    console.log("busqueda", this.busqueda)
  }

  agregarUsuarioAPerfil(){
      if( !this.selection || !this.selection.selected || this.selection.selected.length < 1 ){
        //this.notice.setNotice("SELECCIONE AL MENOS UN ITEM DE LA TABLA", "warning");
        alert("SELECCIONE AL MENOS UN ITEM DE LA TABLA")
        return;
      }
      console.log("seleccionados",  this.selection.selected)
      console.log("sderfil seleccionado", this.perfilSeleccionado)
      this.selection.selected.forEach((x:any)=> {
        console.log("find", this.perfilSeleccionado.usuarios.some(usua=> usua.codigo == x.codigo))
        if(!this.perfilSeleccionado.usuarios.some(usua=> usua.codigo == x.codigo)){
            console.log(x)
            this.perfilSeleccionado.usuarios.push(x)
        }
        
        })
     
      this.ObjetoEncriptadoWrapper.objectEncripted =  btoa(unescape(encodeURIComponent(JSON.stringify(this.perfilSeleccionado))));
     
      this.ps.actualizarUsuarioPerfiles(this.perfilSeleccionado._id.$oid, this.ObjetoEncriptadoWrapper).subscribe((data:any)=>{

      })
  }

  getPerfiles(){
    this.ps.findPerfiles().subscribe((data:any)=>{
      console.log("perfiles", data.entidades)
      this.listaPerfiles = data.entidades.map(x=> {return  JSON.parse(atob(x))})
      console.log("xd", this.perfil)
    })
  }
  
  getUsuariosMongo(){
    this.us.findUsuarios().subscribe((data:any)=>{
      console.log("usuarios", data.entidades)
      this.listaUsuariosMongo = data.entidades.map(x=> {return  JSON.parse(atob(x))})
      console.log("usuarios Mongos", this.listaUsuariosMongo)
    })
  
}

  getUsuariosPorPerfil(selectedPerfil){
    console.log("perfil seleccionado",selectedPerfil)
    this.perfilSeleccionado = selectedPerfil;
    this.usuariosPorPerfil = this.listaPerfiles.find(x=> x.nombre == selectedPerfil.nombre).usuarios
    console.log(" usuariosPorPerfilxd", this.usuariosPorPerfil)
 /*  
    this.usuariosPorPerfil = this.listaUsuariosMongo.map(x=>{
      if(x.perfiles.some(x=> x.nombre== selectedPerfil.nombre) ){
        return x;
      }
    
    })
*/
console.log(" xd xd", this.usuariosPorPerfil)
   
  }

  verPerfiles(element){
    console.log("elemento xd", element.codigo)
    console.log(this.listaPerfiles)
    this.listaPerfiles.forEach(perfil => {
      console.log("los estas cosas", perfil.usuarios)
      console.log("deberian ir 2" ,perfil.usuarios.some(x=> x.codigo == element.codigo))
    });
    this.perfilesDelUsuario = this.listaPerfiles.map(x=>{
      if(x.usuarios.some(x=> x.codigo== element.codigo) ){
        
        return x;
      }
     
    })
    console.log("los perfiles ", this.perfilesDelUsuario)
  }


  findRoot(){
    this.objetoBusquedaParams.etiqueta="Name";
    this.objetoBusquedaParams.cadena="root";
    this.entidades.push(this.objetoBusquedaParams)
    
    this.us.findByParams({"entidades":this.entidades}).subscribe((data:any)=>{
      if(data && data.entidades){
        data.entidades.forEach(element => {
          console.log("entidades desencriptadas", JSON.parse(atob(element)))
        });
      }
     
    })
  }

  verNodo(nodeins:TodoItemFlatNode){
    console.log("el nodo emitido", nodeins)
    this.nodoAEnviar = nodeins
    console.log("llega aca", this.nodoAEnviar)
  }
}
