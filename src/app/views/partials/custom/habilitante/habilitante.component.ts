import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { MatTableDataSource, MatDialog, MatPaginator } from "@angular/material";
import { BehaviorSubject } from "rxjs";
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
  TYPE_LIST="LIST"

  rolSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  tipoDocumentoSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  referenciaSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  procesoSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  estadoOperacionSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  useTypeSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");

   /**Obligatorio paginacion */
   p = new Page();
   dataSourcesHabilitantes:MatTableDataSource<HabilitanteWrapper> = new MatTableDataSource<HabilitanteWrapper>([]);
   @ViewChild(MatPaginator, { static: true }) 
   paginator: MatPaginator;
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
    "archivoCargado"
  ];
  private uploadSubject = new BehaviorSubject<boolean>(true);
  public uploading;

  acciones:Array<TbQoRolTipoDocumento>= new Array<TbQoRolTipoDocumento>();

  enableEnd:boolean=false;

  constructor(
    private sinNoticeService: ReNoticeService,
    private dh: DocumentoHabilitanteService,
    private os:ObjectStorageService,
    public dialog: MatDialog  ) {
    //console.log("===========> entra en componente habilitantes");
    this.uploading = this.uploadSubject.asObservable();
    console.log("cargando rol: " + this.rol);
    console.log("cargando proceso: " + this.proceso);
    console.log("cargando referencia: " + this.referencia);
    console.log("cargando estadoOperacion: " + this.estadoOperacion);
    console.log("cargando tipoDocumento: " + this.tipoDocumento);
    this.dh.setParameter();
    this.os.setParameter();
    this.procesoSubject.subscribe(()=>{
      this.validateLoadData();
    });
    this.referenciaSubject.subscribe(()=>{
      this.validateLoadData();
    });
    this.tipoDocumentoSubject.subscribe(()=>{
      this.validateLoadData();
    });
    this.estadoOperacionSubject.subscribe(()=>{
      this.validateLoadData();
    }); 
    this.useTypeSubject.subscribe(()=>{
      this.validateLoadData();
    });
  }

  ngOnInit() {
    
  }

  validateLoadData(  ){
    if( this.useType && this.useType === this.TYPE_FORM && this.proceso && this.referencia ){
      console.log("====Carga informacion para  " + this.TYPE_FORM);
      this.buscar();
    } else if( this.useType && this.useType === this.TYPE_LIST  ){
      console.log("====Carga informacion para  " + this.TYPE_LIST);
      this.buscar();
    }
  }
 

  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSourcesHabilitantes = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSourcesHabilitantes.paginator = this.paginator;
  }

   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string,pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    //console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }

  
   /**
   * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
   */
  paged() {
    this.p=this.getPaginacion(null, null, 'Y',this.paginator.pageIndex)
    this.submit();
  } 

  buscar() {
    this.initiateTablePaginator();
    this.p=this.getPaginacion(null, null, 'Y',0);
    this.submit();
    //return of("respuesta");
  }

  submit() {
    console.log("loadDocumentoHabilitante cargando rol: " + this.rol);
    console.log("loadDocumentoHabilitante cargando proceso: " + this.proceso);
    console.log("loadDocumentoHabilitante cargando referencia: " + this.referencia);
    console.log("loadDocumentoHabilitante cargando estadoOperacion: " + this.estadoOperacion);
    console.log("loadDocumentoHabilitante cargando tipoDocumento: " + this.tipoDocumento);
    console.log("==>entra a documentos habilitantes loadDocumentoHabilitante");
    //this.uploadSubject.next(false);
    this.dataSourcesHabilitantes = new MatTableDataSource<any>();
    this.dh.findByRolTipoDocumentoReferenciaProcesoEstadoOperacion(localStorage.getItem(environment.rolKey),this.tipoDocumento, this.referencia,
    this.proceso,this.estadoOperacion, this.p  ).subscribe(
        (data: any) => {
          console.log("resultadotipos de documento " + JSON.stringify(data));
          if (data && data.list) {
            let existentes=data.list.filter(e=>e.estaCargado==true);
            if( existentes && existentes.length==data.list.length ){
              this.enableEnd=true;
            } else {
              this.enableEnd=false;
            }
            this.dataSourcesHabilitantes = new MatTableDataSource<HabilitanteWrapper>(data.list);
            this.getPermisoAccion();
            this.totalResults=data.totalResults;
          } else {
            console.log("no hay datos ");
            this.sinNoticeService.setNotice("NO SE ENCONTRARON HABILITANTES PARA ESTE PROCESO ","warning");
          }
        },
        error => {
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
    
    console.log("descargarArchivoHabilitante");
    
    this.os.getObjectById( row.objectId,this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
      //console.log("entra a submit var json " + JSON.stringify( atob(data.entidad) ));
      if( data && data.entidad ){
        let obj=JSON.parse( atob(data.entidad) );
        console.log("entra a retorno json " + JSON.stringify( obj ));
        const byteCharacters = atob(obj.fileBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: row.mimeType});
        saveAs(blob , row.descripcionTipoDocumento + ".pdf");
      }else {
        this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA", "error" );
      }
    },
    error => {
      console.log("================>error: " + JSON.stringify(error));
      this.sinNoticeService.setNotice("ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO", "error" );
    });
  }

  descargarPlantillaHabilitante(row:HabilitanteWrapper) {
    //console.log(      "<<<<<<<<<<<<<<<<descargarPlantillaHabilitante id>>>>>>>>>>>>>>>>",      this.codigoContratoLocal    );
    //console.log("entra a submit var json " + row.id);
    this.dh.generatePlantillaHabilitantesByParams(
        row.servicio,row.idReferencia?String(row.idReferencia):null,
        row.idTipoDocumento?String(row.idTipoDocumento):null, row.proceso, 
        row.estadoOperacion, 
        row.idDocumentoHabilitante?String(row.idDocumentoHabilitante):null,"PDF"
      ).subscribe((data: any) => {
          console.log("descargarNotificacion datos xx " + data);
          //console.log("descargarNotificacion datos " + JSON.stringify(data));
          if (data) {            
            let blob = new Blob([data], { type: 'application/pdf'});
            saveAs(blob, row.descripcionTipoDocumento + ".pdf");
            this.sinNoticeService.setNotice("ARCHIVO DESCARGADO", "success");
          } else {
            this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA","error");
          }
        },
        error => {
          console.log("================>error: " + JSON.stringify(error));
          this.sinNoticeService.setNotice("ERROR DESCARGA DE PLANTILLA HABILITANTE","error");
        }
      );
    //console.log("descargarNotificacion");
  }

    
  navigatetoList(){
    
  }

  /*descargaPlantilla: boolean;
  cargaDocumento: boolean;
  descargaDocumento: boolean;
  cargaDocumentoAdicional: boolean;
  descargaDocumentoAdicional: boolean;*/
  getPermiso(tipo:string, permisos:Array<TbQoRolTipoDocumento> ):boolean{
    if( permisos && permisos.length>0 ){
      //console.log("===> getPermiso rol " + localStorage.getItem( environment.rolKey ) + " tipo: " +  tipo + " datos "+ JSON.stringify( permisos));
      let existPermisos=permisos.filter(p=>p.idRol === Number( localStorage.getItem( environment.rolKey ) ));
      //console.log("===> permisos filter " + JSON.stringify( existPermisos));
      if( existPermisos &&  existPermisos.length >0 ){
        if( tipo === "DESCARGA_PLA" &&  existPermisos[0].descargaPlantilla && existPermisos[0].descargaPlantilla===true  ){
          return true;
        }
        if( tipo === "CARGA_ARC" &&  existPermisos[0].cargaDocumento && existPermisos[0].cargaDocumento===true  ){
          return true;
        }
        if( tipo === "DESCARGA_ARC" &&  existPermisos[0].descargaDocumento && existPermisos[0].descargaDocumento===true  ){
          return true;
        }
        if( tipo === "CARGA_ARC_ADC" &&  existPermisos[0].cargaDocumentoAdicional && existPermisos[0].cargaDocumentoAdicional===true  ){
          return true;
        }
        if( tipo === "DESCARGA_ARCADC" &&  existPermisos[0].descargaDocumentoAdicional && existPermisos[0].descargaDocumentoAdicional===true  ){
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
        //console.log("==> acciones permisos " + JSON.stringify( data.entidades ));
        this.acciones=data.entidades.filter(p=>p.idTipoDocumento==null);
        //console.log("==> acciones permisos filtrado " + JSON.stringify( this.acciones ));
      } else {
        this.sinNoticeService.setNotice("ERROR NO EXISTE ASIGNACION DE PERMISOS EN COMPONENTE HABILITANTE PARA REALIZAR ACCIONES");
      }
    });
  }

  loadArchivoCliente(element) {
    let envioModel={
      proceso:this.proceso,
      estadoOperacion:this.estadoOperacion,
      referencia:this.referencia,
      tipoDocumento:element.idTipoDocumento,
      documentoHabilitante:element.idDocumentoHabilitante
    };

    if (this.referencia) {
      const dialogRef = this.dialog.open(HabilitanteDialogComponent, {
        width: "auto",
        height: "auto",
        data: envioModel
      });

      dialogRef.afterClosed().subscribe(r => {
        //console.log("===>>ertorno al cierre: " + JSON.stringify(r));
        if (r) {
          //console.log("===>>va a recargar: " );
          this.buscar();
          this.sinNoticeService.setNotice("ARCHIVO CARGADO CORRECTAMENTE","success");
          //this.validateContratoByHabilitante('false');
        }
        //this.submit();
      });
    } else {
      console.log("===>>errorrrr al cierre: ");
      this.sinNoticeService.setNotice("ERROR AL CARGAR NO EXISTE DOCUMENTO ASOCIADO","error");
    }
  }

}

