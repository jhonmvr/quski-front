import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ObjectStorageService } from '../../../../core/services/object-storage.service';
import { DocumentoHabilitanteService } from '../../../../core/services/quski/documento-habilitante.service';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { environment } from '../../../../../environments/environment';
import { UsuariosService } from '../../../../core/services/gestor-documental/usuarios.service';
import { saveAs } from 'file-saver';
import { BreadcrumbService } from '../../../../core/services/breadcrumb-service.service';

@Component({
  selector: 'kt-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  nodoValue;
  loadBusqueda = new BehaviorSubject<boolean>(false);
  
  empyFlat = new BehaviorSubject<boolean>(false);
  myObservableArray: Observable<any[]>;
 listaArchivos =[];
  objetoBusquedaParams = {
    "etiqueta":"",
    "cadena": "",
    "operador": "eq"
  }
  @Input() set nodo(object: any) {
    this.dataObservableIdParent.next(object);
  } 
  @Input() set busqueda(object: any) {
    this.dataObservableBusqueda.next(object);
  } 
  private dataObservableIdParent: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private dataObservableBusqueda: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private observableLista: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private us: UsuariosService, private sinNoticeService: ReNoticeService,
    private router: Router,
    private os:ObjectStorageService, private bcService:BreadcrumbService) { }

  async ngOnInit() {
    this.os.setParameter();
  
    
    this.dataObservableIdParent.subscribe(async p=> {  
      this.loadBusqueda.next(true);
      if(p){
        this.nodoValue= p;
       await this.obtenerArchivosPadre();
      }
      this.loadBusqueda.next(false);
 
    });

    this.dataObservableBusqueda.subscribe(async p=> {  
      this.loadBusqueda.next(true);
      if(p){
        
       await this.busquedaBD(p);
      }
      this.loadBusqueda.next(false);
 
    });
    
  }
  

  async busquedaBD(p){
    this.objetoBusquedaParams.etiqueta="Name";
    this.objetoBusquedaParams.cadena= p;
    let entidades =[];
    entidades.push(this.objetoBusquedaParams)
    this.listaArchivos =[]
    await this.us.findByParams({"entidades":entidades}).subscribe((data:any)=>{
      if(data && data.entidades && data.entidades[0]){
        this.empyFlat.next(true);
        data.entidades.forEach(element => {
           
          this.listaArchivos.push(JSON.parse(atob(element)));
          this.myObservableArray= of(this.listaArchivos);
        });
      console.log("mi lista de contenido", this.myObservableArray, this.listaArchivos);
      }else{
        this.empyFlat.next(false);
      }
     
    });
      
  }


  async obtenerArchivosPadre(){
    this.objetoBusquedaParams.etiqueta="ParentId";
    this.objetoBusquedaParams.cadena=this.nodoValue.id;
    let entidades =[];
    entidades.push(this.objetoBusquedaParams)
    this.listaArchivos =[]
    await this.us.findByParams({"entidades":entidades}).subscribe((data:any)=>{
      if(data && data.entidades && data.entidades[0]){
        this.empyFlat.next(true);
        data.entidades.forEach(element => {
           
          this.listaArchivos.push(JSON.parse(atob(element)));
          this.myObservableArray= of(this.listaArchivos);
        });
      console.log("mi lista de contenido", this.myObservableArray, this.listaArchivos);
      }else{
        this.empyFlat.next(false);
      }
     
    });
      
  }

  


  abrir(item){
    this.bcService.nodo.next(item);
    if(item.Type =="CARPETA"){
    this.objetoBusquedaParams.etiqueta="ParentId";
    this.objetoBusquedaParams.cadena=item._id.$oid;
    let entidades =[];
    entidades.push(this.objetoBusquedaParams)
    this.listaArchivos =[]
    this.us.findByParams({"entidades":entidades}).subscribe((data:any)=>{
      if(data && data.entidades){
        data.entidades.forEach(element => {
           
          this.listaArchivos.push(JSON.parse(atob(element)))
          this.myObservableArray= of(this.listaArchivos)
        });
        
      }
     
    });
    }else{
      this.descargarPlantillaHabilitante(item);
  
    }

  }
  
  descargarPlantillaHabilitante(row) {  
   
            this.os.getObjectById(row._id.$oid, this.os.mongoDb, row.referenceCollection ).subscribe((data:any)=>{
              //////console.log("entra a submit var json " + JSON.stringify( atob(data.entidad) ));
              if( data && data.entidad ){
                let obj=JSON.parse( atob(data.entidad) );
                this.openOrSave(obj);
               /*  //console.log("entra a retorno json " , obj);
                const byteCharacters = atob(obj.fileBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray]);
                saveAs(blob , obj.name); */
              }else {//console
                this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA", "error" );
              }
            },
            error => {
              ////console.log("================>error: " + JSON.stringify(error));
              this.sinNoticeService.setNotice("ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO", "error" );
            });
  }

  openOrSave(obj){
    if(obj){
      const byteCharacters = atob(obj.fileBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      //console.log('tipo de archivo',obj.type);
      if(obj.type == 'pdf' || obj.type == 'PDF' || obj.type == 'CREAR'){
        obj.type = 'application/pdf';
      }else if(obj.type != 'image/jpeg' && obj.type != 'application/pdf' && obj.type != 'image/png' ){
        const blob = new Blob([byteArray]);
        saveAs(blob , obj.name); 
        return;
      }
      const blob =  new Blob([byteArray],{type:obj.type});
      var url = window.URL.createObjectURL(blob); 
    
      let a = document.createElement("a");
      a.href = url;
      a.target = "_blank"
      if(!obj.type){
        a.download = obj.name
      }
      a.click();
      URL.revokeObjectURL(url);
    }else{
      this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA", "error" );
    }
  }
}
