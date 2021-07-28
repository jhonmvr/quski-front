import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren } from "@angular/core";
import { ReFileUploadService } from "../../../../../core/services/re-file-upload.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BehaviorSubject } from "rxjs";
import { ReNoticeService } from '../../../../../core/services/re-notice.service';

import { DataUpload } from "../../../../../core/interfaces/data-upload";
import { DialogDataHabilitante } from '../../../../../core/interfaces/dialog-data-habilitante';
import { ObjectStorageService } from '../../../../../core/services/object-storage.service';
import { environment } from '../../../../../../environments/environment';
import { AddFotoComponent } from '../../../../../views/partials/custom/fotos/add-foto/add-foto.component';


@Component({
  selector: "re-habilitante-dialog",
  templateUrl: "./habilitante-dialog.component.html",
  styleUrls: ["./habilitante-dialog.component.scss"]
})
export class HabilitanteDialogComponent implements OnInit {
  private uploadSubject = new BehaviorSubject<boolean>(false);
  public uploading;
  public dataUpload: DataUpload;
  isDisabledGuardar: any;
  element: any;
  //@ViewChild("fileInput") fileInput: ElementRef;
  fileBase64:string;

  constructor(
    private dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
    public dialogRef: MatDialogRef<HabilitanteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataHabilitante,
    private upload: ReFileUploadService, private os:ObjectStorageService
  ) {
    this.upload.setParameter();
    this.os.setParameter();
  }

  ngOnInit() {
    this.uploading = this.uploadSubject.asObservable();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public onFileChange(event) {
    let reader = new FileReader();
    this.uploadSubject.next(true)
    if (event.target.files && event.target.files.length > 0) {
      let file = <File>event.target.files[0];
      let mimeType = file.type;
      let mimeSize = file.size;
      let size:number = Number(((mimeSize/1024)/1024).toFixed(2)); 
      if (size < 7) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.uploadSubject.next(true);
          this.dataUpload = {
            name: file.name,
            type: file.type,
            process: this.data.proceso,
            relatedId: this.data.documentoHabilitante?Number(this.data.documentoHabilitante):null,
            relatedIdStr: this.data.referencia,
            typeAction: this.data.tipoDocumento,
            fileBase64: String(reader.result).split(",")[1],
            objectId:""
          };
        };
        this.uploadSubject.next(false)
      } else {
        this.uploadSubject.next(false)
        this.dataUpload =null;
        this.sinNoticeService.setNotice("EL ARCHIVO ES MUY GRANDE PARA SER GUARDADO", 'error');
      }
    }
  }

  public subirArchivoHabilitante() {
    this.uploadSubject.next(true);
    this.os.createObject( JSON.stringify( this.dataUpload ), this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe( (objectData:any)=>{
      if( objectData && objectData.entidad ){
        let archivo:DataUpload = {fileBase64:"",
        name:this.dataUpload.name,
        objectId:objectData.entidad,
        process:this.dataUpload.process,
        relatedId:this.dataUpload.relatedId,
        relatedIdStr:this.dataUpload.relatedIdStr,
        type:this.dataUpload.type,
        typeAction:this.dataUpload.typeAction,

        }
        this.dataUpload.objectId=objectData.entidad;
        this.fileBase64=null;
        this.upload.uploadFile(this.upload.appResourcesUrl +"uploadRestController/loadFileHabilitanteSimplified",archivo).subscribe((data: any) => {
          this.dialogRef.close(data.relatedIdStr);
          this.uploadSubject.next(false);
        });
      }
    });
  }


  foto(){
    const dialogRef = this.dialog.open(AddFotoComponent, {
      width: "auto",
      height: "auto",
      data: this.data
    });
    dialogRef.afterClosed().subscribe(r => {
      console.log('r => ', r);
      if (r) {
        console.log("datos de la fotito",r)
        this.dataUpload = {
          name: Date()+'.jpg',
          type: 'jpg',
          process: this.data.proceso,
          relatedId: this.data.documentoHabilitante?Number(this.data.documentoHabilitante):null,
          relatedIdStr: this.data.referencia,
          typeAction: this.data.tipoDocumento,
          fileBase64:r.fileBase64,
          objectId:""
        };
        this.uploadSubject.next(true);
      }else{
        this.uploadSubject.next(false);
      }
    });
  }
}
