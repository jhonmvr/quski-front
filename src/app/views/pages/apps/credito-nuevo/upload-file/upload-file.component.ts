import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';

@Component({
  selector: 'kt-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  private uploadSubject = new BehaviorSubject<boolean>(false);
  loadImg = new BehaviorSubject<boolean>(false);
  public uploading;
  public dataUpload: any;
  isDisabledGuardar: any;
  element: any;

  constructor(public dialogRef: MatDialogRef<UploadFileComponent>,
    private notificaciones: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.uploading = this.uploadSubject.asObservable();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileChange(event) {
    
    this.loadImg.next(true);
   
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {

      let size:number = Number(((event.target.files[0].size/1024)/1024).toFixed(2)); 
      if (size > 2) {
        this.notificaciones.setNotice("ARCHIVO MUY GRANDE. Max. 2 MB", 'error');
        this.loadImg.next(false);
        return;
      }
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      //console.log("mi archivo", reader)
      reader.onload = () => {
        this.loadImg.next(false);
        this.uploadSubject.next(true);
        //console.log("el base 64",(<string>reader.result).split(',')[1])
        this.dataUpload = {
          nombreArchivo: file.name,
          archivo: (<string>reader.result).split(',')[1],
          estado: 'ACT'
        };
      };
    } else {
      this.loadImg.next(false);
      this.uploadSubject.next(false);
    }
  }

  public subirArchivoHabilitante() {
    
    this.dialogRef.close(this.dataUpload);
  }

}
