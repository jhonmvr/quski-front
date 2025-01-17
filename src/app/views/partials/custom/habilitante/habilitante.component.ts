import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from "@angular/core";
import { MatTableDataSource, MatDialog, MatPaginator, MAT_DIALOG_DATA } from "@angular/material";
import { BehaviorSubject, concat } from "rxjs";
import { ReNoticeService } from "../../../../core/services/re-notice.service";
import { Page } from "../../../../core/model/page";
import { DocumentoHabilitanteService } from "../../../../core/services/quski/documento-habilitante.service";
//import { ContratoService } from "../../../../../core/services/contrato.service";
import { Router } from "@angular/router";
import { HabilitanteWrapper } from '../../../../core/model/wrapper/habilitante-wrapper';
import { TbQoRolTipoDocumento } from '../../../../core/model/quski/TbQoRolTipoDocumento';
import { environment } from '../../../../../environments/environment';
import { HabilitanteDialogComponent } from './habilitante-dialog/habilitante-dialog.component';
import { DialogDataHabilitante } from '../../../../core/interfaces/dialog-data-habilitante';
import { ObjectStorageService } from '../../../../core/services/object-storage.service';
import { saveAs } from 'file-saver';

@Component({
  selector: "re-habilitante",
  templateUrl: "./habilitante.component.html",
  styleUrls: ["./habilitante.component.scss"]
})
export class HabilitanteComponent implements OnInit {

  TYPE_FORM="FORM";
  TYPE_LIST="LIST";
  buscarObservable:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(true);
  descargarCargado:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  rolSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  tipoDocumentoSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  referenciaSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  procesoSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  estadoOperacionSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  useTypeSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");

   /**Obligatorio paginacion */
   p = new Page();
   dataSourcesHabilitantes:MatTableDataSource<HabilitanteWrapper> = new MatTableDataSource<HabilitanteWrapper>([]);
   //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
   totalResults: number;
   pageSize = 5;
   currentPage;

  // Validacion de archivos subidos en su totalidad
  @Output() completado = new EventEmitter();

  @Output()
  estadoFinalizacion: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input("rol") set rol(value: string) {
      this.rolSubject.next(value);
  }

  get rol():string {
    return this.rolSubject.getValue();
  }

  @Input() set proceso(value: string) {
      this.procesoSubject.next(value);
  }

  get proceso():string {
    return this.procesoSubject.getValue();
  }

  @Input("tipoDocumento") set tipoDocumento(value: string) {
      this.tipoDocumentoSubject.next(value);
  }

  get tipoDocumento():string {
    return this.tipoDocumentoSubject.getValue();
  }

  @Input("referencia") set referencia(value: string) {
      this.referenciaSubject.next(value);
  }

  get referencia():string {
    return this.referenciaSubject.getValue();
  }

  @Input("estadoOperacion") set estadoOperacion(value: string) {
      this.estadoOperacionSubject.next(value);
  }

  get estadoOperacion():string {
    return this.estadoOperacionSubject.getValue();
  }

  /**
   * FORM/LIST
   */
  @Input("useType") set useType(value: string) {
      this.useTypeSubject.next(value);
  }

  get useType():string {
    return this.useTypeSubject.getValue();
  }

  //varviables comunes

  displayedColumnDocumentos = [
    "N",
    "descripcion",
    "generar",
    "respaldar",
    "archivoCargado",
    "archivo"
  ];
  private uploadSubject = new BehaviorSubject<boolean>(true);
  public uploading;

  acciones:Array<TbQoRolTipoDocumento>= new Array<TbQoRolTipoDocumento>();

  enableEnd:boolean=false;

  constructor(
    private sinNoticeService: ReNoticeService,
    private router: Router,
    private dh: DocumentoHabilitanteService,
    private os:ObjectStorageService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
      ) {
    this.uploading = this.uploadSubject.asObservable();
    this.dh.setParameter();
    this.os.setParameter();
  
  }

  ngOnInit() {
    const suscrip =concat(this.referenciaSubject,this.procesoSubject,this.useTypeSubject);
    suscrip.subscribe(arg => this.validateLoadData());
    /* this.procesoSubject.subscribe(()=>{
      
    });
    this.referenciaSubject.subscribe(()=>{
      this.validateLoadData();
    });
    this.tipoDocumentoSubject.subscribe(()=>{
      this.validateLoadData();
    }); */
    this.estadoOperacionSubject.subscribe(()=>{
      this.validateLoadData();
    }); /* 
    this.useTypeSubject.subscribe(()=>{
      this.validateLoadData();
    }); */
  }

  validateLoadData(  ){
   
    if( this.useType && this.useType === this.TYPE_FORM && this.proceso && this.referencia ){
      this.buscar();
    } else if( this.useType && this.useType === this.TYPE_LIST  ){
     
      this.buscar();
    }
  }
 

  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
 

   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string,pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
  
    return p;
  }

  
   /**
   * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
   */
  paged() {
    this.p=this.getPaginacion(null, null, 'Y',0)
    this.submit();
  } 

  buscar() {
    this.p=this.getPaginacion(null, null, 'Y',0);
    this.submit();
    //return of("respuesta");
  }

  submit() {
    this.buscarObservable.next(true);
   
    this.dataSourcesHabilitantes = new MatTableDataSource<any>();
    this.dh.findByRolTipoDocumentoReferenciaProcesoEstadoOperacion(localStorage.getItem(environment.rolKey),this.tipoDocumento, this.referencia,
    this.proceso,this.estadoOperacion, this.p  ).subscribe(
        (data: any) => {
          
          if (data && data.list) {
            let existentes=data.list.filter(e=>e.estaCargado==true);
            if( existentes && existentes.length==data.list.length ){
              this.enableEnd=true;
            } else {
              this.enableEnd=false;
            }
            this.dataSourcesHabilitantes = new MatTableDataSource<HabilitanteWrapper>(data.list);
            this.buscarObservable.next(false);
            this.totalResults=data.totalResults;
          } else {
            this.sinNoticeService.setNotice("NO SE ENCONTRARON HABILITANTES PARA ESTE PROCESO ","warning");
          }
        },
        error => {
          this.buscarObservable.next(false);
          this.uploadSubject.next(true);
          if (JSON.stringify(error).indexOf("codError") > 0) {
            let b = error.error;
            this.sinNoticeService.setNotice(b.msgError, "error");
          } else {
            this.sinNoticeService.setNotice("ERROR AL CARGAR HABILITANTES INFORMACION DE ENTRADA INCORRECTA: PROCESO-" +
            this.proceso + " REFERENCIA-" + this.referencia + " OPERACION-" + this.estadoOperacion + " TIPODOC-" +  this.tipoDocumento, "error");
          }
        }
      );
      
  }

  descargarArchivoHabilitante(row:HabilitanteWrapper) {
    
    
    this.os.getObjectById( row.objectId,this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
      if( data && data.entidad ){
        let obj=JSON.parse( atob(data.entidad) );
        this.openOrSave(obj);
        
      }else {
        this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA", "error" );
      }
    },
    error => {
      this.sinNoticeService.setNotice("ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO", "error" );
    });
  }
  descargarArchivoHabilitanteDes(row:HabilitanteWrapper) {
    
    
    this.os.getObjectById( row.objectId,this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
      if( data && data.entidad ){
        let obj=JSON.parse( atob(data.entidad) );
        const byteCharacters = atob(obj.fileBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray]);
        saveAs(blob , obj.name); 
        
      }else {
        this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA", "error" );
      }
    },
    error => {
      this.sinNoticeService.setNotice("ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO", "error" );
    });
  }

  descargarPlantillaHabilitante(row:HabilitanteWrapper) {
    
   
    this.dh.generatePlantillaHabilitantesByParams(
        row.servicio, row.idReferencia == null ? this.referencia :  String(row.idReferencia),
        row.idTipoDocumento?String(row.idTipoDocumento):null, row.proceso, 
        row.estadoOperacion, 
        row.idDocumentoHabilitante?String(row.idDocumentoHabilitante):null,"PDF"
      ).subscribe((data: any) => {
          if(data.uriHabilitantes){
            this.os.getObjectById(data.uriHabilitantes, this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
              ////console.log("entra a submit var json " + JSON.stringify( atob(data.entidad) ));
              if( data && data.entidad ){
                let obj=JSON.parse( atob(data.entidad) );
                this.openOrSave(obj);
               /*  console.log("entra a retorno json " , obj);
                const byteCharacters = atob(obj.fileBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray]);
                saveAs(blob , obj.name); */
              }else {
                this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA", "error" );
              }
            },
            error => {
              //console.log("================>error: " + JSON.stringify(error));
              this.sinNoticeService.setNotice("ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO", "error" );
            });
          }else if(data.objectoStorage){
                let obj=JSON.parse( atob(data.objectoStorage) );
                this.openOrSave(obj);
              
            
          }else if (data.documentoHabilitanteByte) {            
           
            const byteCharacters = atob(data.documentoHabilitanteByte);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray]);
            saveAs(blob, row.descripcionTipoDocumento + ".pdf");
            this.sinNoticeService.setNotice("ARCHIVO DESCARGADO", "success");
          } else {
            this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA","error");
          }
        },
        error => {
          this.sinNoticeService.setNotice("ERROR DESCARGA DE PLANTILLA HABILITANTE","error");
        }
      );
  }

  openOrSave(obj){
    if(obj){
      const byteCharacters = atob(obj.fileBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      console.log('tipo de archivo',obj.type);
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
    
  navigatetoList(){
    
  }


  descargarDocumento(element){
    let existPermisos = element.roles;
    if(element && existPermisos && existPermisos.length > 0 && existPermisos[0].descargaDocumento && existPermisos[0].descargaDocumento===true && element.objectId ){
      return true;
    }
    return false;
  }

  getPermiso(tipo:string, permisos, objectid? ):boolean{
    this.buscarObservable.next(true);
    if( permisos && permisos.length>0 ){
      let existPermisos=permisos.filter(p=>p.idRol === Number( localStorage.getItem( environment.rolKey ) ));
      if( existPermisos &&  existPermisos.length >0 ){
        this.buscarObservable.next(false);
        if( tipo === "DESCARGA_PLA" &&  existPermisos[0].descargaPlantilla && existPermisos[0].descargaPlantilla===true  ){
          return true;
        }
        if( tipo === "CARGA_ARC" &&  existPermisos[0].cargaDocumento && existPermisos[0].cargaDocumento===true  ){
          return true;
        }
        if( tipo === "DESCARGA_ARC" &&  existPermisos[0].descargaDocumento && existPermisos[0].descargaDocumento===true && objectid && objectid.objectId  ){
          return true;
        }
        if( tipo === "CARGA_ARC_ADC" &&  existPermisos[0].cargaDocumentoAdicional && existPermisos[0].cargaDocumentoAdicional===true  ){
          return true;
        }
        if( tipo === "DESCARGA_ARCADC" &&  existPermisos[0].descargaDocumentoAdicional && existPermisos[0].descargaDocumentoAdicional===true ){
          return true;
        }
        if( tipo === "ACCION_UNO" &&  existPermisos[0].accionUno && existPermisos[0].accionUno===true  ){
          return true;
        }
        if( tipo === "ACCION_DOS" &&  existPermisos[0].accionDos && existPermisos[0].accionDos===true  ){
          return true;
        }
        if( tipo === "ACCION_TRES" &&  existPermisos[0].accionTres && existPermisos[0].accionTres===true  ){
          return true;
        }
      }
      
    }
    return false;
  }


  getPermisoAccion(){
    let page= new Page();
    page.isPaginated="N";
    this.dh.findByRolTipoDocumentoProcesoEstadoOperacion(localStorage.getItem(environment.rolKey),this.tipoDocumento,this.proceso,this.estadoOperacion, page).subscribe((data:any)=>{
      if( data && data.entidades ){
        this.acciones=data.entidades.filter(p=>p.idTipoDocumento==null);
      } else {
        this.sinNoticeService.setNotice("ERROR NO EXISTE ASIGNACION DE PERMISOS EN COMPONENTE HABILITANTE PARA REALIZAR ACCIONES");
      }
    });
  }

  loadArchivoCliente(element) {
    let envioModel={
      proceso:element.proceso,
      estadoOperacion:this.estadoOperacion,
      referencia:this.referencia,
      tipoDocumento:element.idTipoDocumento,
      documentoHabilitante:element.idDocumentoHabilitante,
      objectId : element.objectId

    };

    if (this.referencia) {
      const dialogRef = this.dialog.open(HabilitanteDialogComponent, {
        width: "auto",
        height: "auto",
        data: envioModel
      });

      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          this.buscar();
          this.sinNoticeService.setNotice("ARCHIVO CARGADO CORRECTAMENTE","success");
        }
      });
    } else {
      this.sinNoticeService.setNotice("ERROR AL CARGAR NO EXISTE DOCUMENTO ASOCIADO","error");
    }
  }

  accionUno(){

  }
  
  accionDos(){

  }
  accionTres(){

  }

}

