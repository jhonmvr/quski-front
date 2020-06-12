import { Component, OnInit, Inject } from '@angular/core';
import { ReFileUploadService } from '../../../../../core/services/re-file-upload.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { DataUpload } from '../../solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';


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
  

  constructor(private sinNoticeService: ReNoticeService,public dialogRef: MatDialogRef<CargarFotoDialogComponent>,
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
    if (this.data.identificacionCliente && this.data.identificacionCliente !== "") {
      relatedstr = this.data.identificacionCliente;
      process = "CLIENTE";
    } else if (this.data.idCotizador && this.data.idCotizador !== "") {
      relatedstr = this.data.idCotizador;
      process = "COTIZADOR";
    } else if (this.data.idNegociacion && this.data.idNegociacion !== "") {
      relatedstr = this.data.idNegociacion;
      process = "NEGOCIACION";
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
    console.log("Ingresa al archivo subir",this.dataUpload)
    console.log("===>>llego a subir: ",JSON.stringify(this.data) );
    console.log(
      "===> subirArchivoHabilitantecontraro relate id: " +
        JSON.stringify(this.data.nombresCompletos)
    );
    console.log(
      "===> subirArchivoHabilitante contraro relate tipo: " +
        JSON.stringify(this.data.idTipoDocumento)
    );
    console.log("===> va a upload con dagtos: " + JSON.stringify(this.dataUpload));
    this.upload
      .uploadFile(
        this.upload.appResourcesUrl +
          "uploadRestController/loadFileHabilitante",
        this.dataUpload
      )
      .subscribe(
        (data: any) => {
          this.sinNoticeService.setNotice("ARCHIVO SUBIDO CORRECTAMENTE", 'success');
          this.dialogRef.close(data.relatedIdStr);
        },
        error => {
          console.log("error llegado " + JSON.stringify(error.error));
          if (JSON.stringify(error.error).indexOf("codError") > 0) {
            //let b = JSON.parse( error._body );
           // let b = error.error;
            
           this.sinNoticeService.setNotice("ERROR EN LA CARGA DE ARCHIVO " , 'error');
          } else {
            console.log("error no java " + error);
            // this.alert={id: 2,type: "danger",message: "ERROR EN LA CARGA DE ARCHIVO " };
            //this.sinNoticeService.setNotice("ERROR EN LA CARGA DE ARCHIVO", 'error');
          }
        }
      );
  }
  onFileChangeArchivos(event) {
    let relatedstr = "";
    let process = "";
    if (this.data.identificacionCliente && this.data.identificacionCliente !== "") {
      relatedstr = this.data.identificacionCliente;
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
              typeAction: this.data.idTipoDocumento,
              fileBase64: (<string>reader.result).split(',')[1]
          }; 
         
      };

  } else {
    this.uploadSubject.next(false);
  }
  }
}
