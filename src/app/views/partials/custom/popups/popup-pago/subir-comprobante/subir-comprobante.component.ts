import { ReFileUploadService } from '../../../../../../core/services/re-file-upload.service';
import { ReNoticeService } from '../../../../../../core/services/re-notice.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { DataUpload } from '../popup-pago.component';
import { BehaviorSubject } from 'rxjs';

export interface DialogData {
  idTipoDocumento: string;
  idCredito: string;
  data: string;
}
@Component({
  selector: 'kt-subir-comprobante',
  templateUrl: './subir-comprobante.component.html',
  styleUrls: ['./subir-comprobante.component.scss']
})
export class SubirComprobanteComponent implements OnInit {
  private uploadSubject = new BehaviorSubject<boolean>(false);
  public uploading;
  public dataUpload: DataUpload;
  isDisabledGuardar: any;
  element: any;

  constructor(
    private sinNoticeService: ReNoticeService,
    public dialogRef: MatDialogRef<SubirComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private upload: ReFileUploadService
    ) { }

    ngOnInit() {
      this.uploading = this.uploadSubject.asObservable();
    }
    onFileChange(event, elemento) {
      let relatedstr = this.data.idCredito;
      let process = "NOVACION";
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
                  typeAction: this.data.idTipoDocumento,
                  fileBase64: (<string>reader.result).split(',')[1]
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
      console.log("Subir-Comprobante: Lo que se guarda ===>",this.dataUpload)
      this.dialogRef.close(this.dataUpload);

      /* this.upload.uploadFile( this.upload.appResourcesUrl + "uploadRestController/loadFileHabilitante", this.dataUpload).subscribe( (data: any) => {
      },error => {
        console.log("error llegado " + JSON.stringify(error.error));
        if (JSON.stringify(error.error).indexOf("codError") > 0) {
          this.sinNoticeService.setNotice("ERROR EN LA CARGA DE ARCHIVO " , 'error');
        } else {
          console.log("error no java " + error);
        }
      }); */
    }
}
