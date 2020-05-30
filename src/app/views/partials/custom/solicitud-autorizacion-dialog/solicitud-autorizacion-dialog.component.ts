import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { CargarFotoDialogComponent } from '../../custom/fotos/cargar-foto-dialog/cargar-foto-dialog.component';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { TbQoCliente } from "../../../../core/model/quski/TbQoCliente";
import { ReFileUploadService } from '../../../../core/services/re-file-upload.service';
import { BehaviorSubject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentoHabilitanteService } from '../../../../core/services/quski/documento-habilitante.service';
import { saveAs } from 'file-saver';

export interface DataUpload {
  name: string;
  type: string;
  process: string;
  fileBase64: string;
  relatedId: number,
  typeAction: string;
  relatedIdStr: string;
}
export interface DialogData {
  idTipoDocumento: string;
  tipo: string;
  idCliente: number;
  identificacion: string;
  idCotizador: string;
  idNegociacion: string;
  nombresCompleto: string;
}

@Component({
  selector: 'm-solicitud-autorizacion-dialog',
  templateUrl: './solicitud-autorizacion-dialog.component.html',
  styleUrls: ['./solicitud-autorizacion-dialog.component.scss']
})
export class SolicitudAutorizacionDialogComponent implements OnInit {
  private uploadSubject = new BehaviorSubject<boolean>(false);
  public uploading;
  public validar;
  private identificacionClienteSubject = new BehaviorSubject<string>("");



  //public dataUpload: DataUpload;
  isDisabledGuardar: any;
  element: any;

  constructor(private dh: DocumentoHabilitanteService, private sinNoticeService: ReNoticeService,
    public dialogRef: MatDialogRef<SolicitudAutorizacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string, public dialog: MatDialog, private upload: ReFileUploadService) {
    console.log(">>><<<<<<<<<<<<<<< DATA COTIZACION" + JSON.stringify(data));
    this.formDatosSolicitud.addControl("nombresCompletos", this.nombresCompletos);
    this.formDatosSolicitud.addControl("identificacion", this.identificacion);

  }

  ngOnInit() {
  }
  // FORM DE CONTACTO  
  public formDatosSolicitud: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', [Validators.required]);
  public identificacion = new FormControl(this.data, [Validators.required]);


  loadArchivoCliente(element) {
    console.log("===>>ingreso: ", this.nombresCompletos.value);
    let d = {
      idTipoDocumento: 1,
      identificacionCliente: this.identificacion.value,
      data: this.data,
    };
    /* if (
      this.nombresCompletos.value 
    ) {  */
    const dialogRef = this.dialog.open(CargarFotoDialogComponent, {
      width: "auto",
      height: "auto",
      data: d

    });
    console.log("===>>envio data: ", this.data);
    dialogRef.afterClosed().subscribe(r => {
      console.log("===>>ertorno al cierre: " + JSON.stringify(r));
      if (r) {
        this.validar = 'ACT';
        this.sinNoticeService.setNotice(
          "ARCHIVO CARGADO CORRECTAMENTE",
          "success"
        );
        //this.validateContratoByHabilitante('false');
      }
      //this.submit();
    });
    /* } else {
      console.log("===>>errorrrr al cierre: ");
      this.sinNoticeService.setNotice(
        "ERROR AL CARGAR NO EXISTE DOCUMENTO ASOCIADO",
        "error"
      );
    } */
  }
  /* loadArchivoCliente(element) {
 
      const dialogRef = this.dialog.open(CargarFotoDialogComponent, {
        width: 'auto',
        height: 'auto',
        //data: any
      });

      dialogRef.afterClosed().subscribe((r) => {
        console.log("===>>ertorno al cierre: " + JSON.stringify( r ) );
        if (r) {
          this.sinNoticeService.setNotice("ARCHIVO CARGADO CORRECTAMENTE", 'success');
          //this.validateContratoByHabilitante();
        }
        //this.submit();
      });
    } else {
      console.log("===>>errorrrr al cierre: "  );
      this.sinNoticeService.setNotice("ERROR AL CARGAR NO EXISTE DOCUMENTO ASOCIADO", 'error');
    } 
  } */

  salir() {
    this.dialogRef.close();
  }

  consultar() {
    this.validar;
    console.log("llegaaaa", this.validar);
    if (this.validar == 'ACT') {
      this.dialogRef.close(this.validar);
    } else {
      this.sinNoticeService.setNotice("POR FAVOR DEBE CARGAR EL DOCUMENTO DE AUTORIZACION", 'warning');
    }

  }

  onFileChange(event) {
    console.log(
      "===>contraro relate idContrato: " + JSON.stringify(this.data)
    );

    let relatedstr = "";
    let process = "";
    if (this.data !== "") {
      relatedstr = this.data;
      process = "CLIENTE";

      let reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.uploadSubject.next(true);
          /*  this.dataUpload = {
             name: file.name,
             type: file.type,
             process: process,
             relatedId: 0,
             relatedIdStr: relatedstr,
             typeAction: this.data.idTipoDocumento,
             fileBase64: reader.result.split(",")[1]
           }; */
        };
      } else {
        this.uploadSubject.next(false);
      }
    }
  }



  descargarPlantillaHabilitante(row) {

    console.log("<<<<<<<<<<<<<<<<descargarPlantillaHabilitante id>>>>>>>>>>>>>>>>", this.nombresCompletos.value, this.data);

    this.dh.downloadAutorizacionPlantilla(1, "PDF", this.nombresCompletos.value, this.identificacion.value).subscribe(
      (data: any) => {
        //console.log("descargarNotificacion datos xx " + data.entidad);
        //console.log("descargarNotificacion datos " + JSON.stringify(data));
        if (data) {
          //this.sinNoticeService.setNotice("ARCHIVO DESCARGADO", "success");
          //console.log("datos de salida",data);
          saveAs(data, "Carta solicitud Autorizacion Buro" + ".pdf");
        } else {
          this.sinNoticeService.setNotice(
            "NO SE ENCONTRO REGISTRO PARA DESCARGA",
            "error"
          );
        }
      },
      error => {
        console.log("================>error: " + JSON.stringify(error));
        this.sinNoticeService.setNotice(
          "ERROR DESCARGA DE PLANTILLA HABILITANTE",
          "error"
        );
      }
    );
    //console.log("descargarNotificacion");
  }


  public subirArchivoHabilitante() {
    console.log(
      "===> subirArchivoHabilitantecontraro relate id: " +
      JSON.stringify(this.data)
    );

    this.sinNoticeService.setNotice("SE SUBIO EXITOSAMENTE ", 'success');
    this.validar = 'ACT';


    /* this.upload
      .uploadFile(
        this.upload.apiUrlResources +
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
      ); */
  }
  /*  console.log(
      "<<<<<<<<<<<<<<<< id>>>>>>>>>>>>>>>>",
      this.codigoContratoLocal
    );
    console.log("descargarArchivoHabilitante");
    console.log("entra a submit var json " + row.id);
    this.dh
      .downloadHabilitante(
        row.id
        ,
        this.codigoContrato,
        this.joya,
        this.abono,
        this.idVentaLote
      )
      .subscribe(
        (data: any) => {
          console.log("descargarNotificacion datos xx " + data);
          console.log("descargarNotificacion datos " + JSON.stringify(data));
          if (data) {
            this.sinNoticeService.setNotice("ARCHIVO DESCARGADO", "success");
            saveAs(data, row.descripcion + ".pdf");
          } else {
            this.sinNoticeService.setNotice(
              "NO SE ENCONTRO REGISTRO PARA DESCARGA",
              "error"
            );
          }
        },
        error => {
          console.log("================>error: " + JSON.stringify(error));
          this.sinNoticeService.setNotice(
            "ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO",
            "error"
          );
        }
      );

    //console.log("descargarNotificacion"); */
}


