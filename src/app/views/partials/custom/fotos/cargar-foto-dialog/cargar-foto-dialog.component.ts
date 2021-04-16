import { Component, OnInit, Inject } from '@angular/core';
import { ReFileUploadService } from '../../../../../core/services/re-file-upload.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { DataUpload } from '../../popups/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ObjectStorageService } from '../../../../../core/services/object-storage.service';
import { environment } from '../../../../../../environments/environment';


export interface DialogData {
  idTipoDocumento: string;
  nombresCompletos: string;
  identificacionCliente: string;
  idCotizador: string;
  idNegociacion: string;
  data: string;
}
@Component({
  selector: 'm-cargar-foto-dialog',
  templateUrl: './cargar-foto-dialog.component.html',
  styleUrls: ['./cargar-foto-dialog.component.scss']
})
export class CargarFotoDialogComponent implements OnInit {


  private uploadSubject = new BehaviorSubject<boolean>(false);
  public uploading;
  public dataUpload: DataUpload;
  isDisabledGuardar: any;
  element: any;


  constructor(private sinNoticeService: ReNoticeService, public dialogRef: MatDialogRef<CargarFotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private os:ObjectStorageService,
    private upload: ReFileUploadService) {
      this.os.setParameter();
    //console.log( "===>cargando dialog habilitante: " + JSON.stringify(this.data));
  }

  ngOnInit() {
    this.os.setParameter();
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
            process: 'CLIENTE',
            relatedId: 0,
            relatedIdStr: this.data.identificacionCliente,
            typeAction: this.data.idTipoDocumento,
            fileBase64: (<string>reader.result).split(',')[1],
            objectId:''
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
    this.os.createObject( btoa( JSON.stringify( this.dataUpload ) ), this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe( (objectData:any)=>{
      if( objectData && objectData.entidad ){
        this.dataUpload.objectId=objectData.entidad;
        this.upload.uploadFile(this.upload.appResourcesUrl +"uploadRestController/loadFileHabilitante",this.dataUpload).subscribe((data: any) => {
          this.sinNoticeService.setNotice("ARCHIVO SUBIDO CORRECTAMENTE", 'success');
          this.dialogRef.close(data.relatedIdStr);
        });
      }
    });
  }
}
