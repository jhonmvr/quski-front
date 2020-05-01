import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataUpload } from '../../solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReFileUploadService } from '../../../../../core/services/re-file-upload.service';


export interface DialogData {
  idTipoArchivo: string;
  idCliente: string;
  data: string;
}

@Component({
  selector: 'm-archivo-upload-dialog',
  templateUrl: './archivo-upload-dialog.component.html',
  styleUrls: ['./archivo-upload-dialog.component.scss']
})
export class ArchivoUploadDialogComponent implements OnInit {
  private uploadSubject = new BehaviorSubject<boolean>(false);
  public uploading;
  public dataUpload: DataUpload;
  isDisabledGuardar: any;
  element: any;
  

  constructor(public dialogRef: MatDialogRef<ArchivoUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private upload: ReFileUploadService) {
      console.log(
        "===>cargando dialog habilitante: " + JSON.stringify(this.data)
      );
     }

  ngOnInit() {
    this.uploading = this.uploadSubject.asObservable();
  }

  onFileChange(event, elemento) {
    let relatedstr = "";
    let process = "";
    if (this.data.idCliente && this.data.idCliente !== "") {
      relatedstr = this.data.idCliente;
      process = "CLIENTE";
    } 
    let reader = new FileReader();
  if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadSubject.next(true);
             this.dataUpload = {
              name: file.name,
              type: file.type,
              process:process,
              relatedId: 0,
              relatedIdStr: relatedstr,
              typeAction: this.data.idTipoArchivo,
              fileBase64:  (<string>(reader.result)).split(',')[1]
          }; 
         
      };

  } else {
    this.uploadSubject.next(false);
  }
  }

  
  onNoClick(): void {
    this.dialogRef.close();
  }

  public subirArchivoHabilitante(elemento) {
    console.log(this.dataUpload)
    console.log("===>>llego a subir: ",this.data );
  
    console.log(
      "===> subirArchivoHabilitante contraro relate tipo: " +
        JSON.stringify(this.data.data)
    );
    //console.log("===> va a upload con dagtos: " + JSON.stringify(this.dataUpload));
    this.upload
      .uploadFile(
        this.upload.appResourcesUrl +
          "uploadRestController/loadFileHabilitante",
        this.dataUpload
      )
      .subscribe(
        (data: any) => {
          //this.sinNoticeService.setNotice("ARCHIVO SUBIDO CORRECTAMENTE", 'success');
          this.dialogRef.close(data.relatedIdStr);
        },
        error => {
          console.log("error llegado " + JSON.stringify(error.error));
          if (JSON.stringify(error.error).indexOf("codError") > 0) {
            //let b = JSON.parse( error._body );
            let b = error.error;
            // this.alert={id: 2,type: "danger",message: "ERROR EN LA CARGA DE ARCHIVO " + b.msgError};
            //this.sinNoticeService.setNotice("ERROR EN LA CARGA DE ARCHIVO " + b.msgError, 'error');
          } else {
            console.log("error no java " + error);
            // this.alert={id: 2,type: "danger",message: "ERROR EN LA CARGA DE ARCHIVO " };
            //this.sinNoticeService.setNotice("ERROR EN LA CARGA DE ARCHIVO", 'error');
          }
        }
      );
  }
 
}
