import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { CargarFotoDialogComponent } from '../../fotos/cargar-foto-dialog/cargar-foto-dialog.component';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { ReFileUploadService } from '../../../../../core/services/re-file-upload.service';
import { BehaviorSubject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { saveAs } from 'file-saver';

export interface DataUpload {
  name: string;
  type: string;
  process: string;
  fileBase64: string;
  relatedId: number;
  typeAction: string;
  relatedIdStr: string;
  objectId: string;
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

  constructor(private dh: DocumentoHabilitanteService, private sinNoticeService: ReNoticeService,
    public dialogRef: MatDialogRef<SolicitudAutorizacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string, public dialog: MatDialog, private upload: ReFileUploadService,
    private cs: ClienteService) {
      this.dh.setParameter();
    //console.log('>>><<<<<<<<<<<<<<< DATA COTIZACION' + JSON.stringify(data));
    this.formDatosSolicitud.addControl('nombresCompletos', this.nombresCompletos);
    this.formDatosSolicitud.addControl('identificacion', this.identificacion);

  }
  private uploadSubject = new BehaviorSubject<boolean>(false);
  public uploading;
  public validar;
  private identificacionClienteSubject = new BehaviorSubject<string>('');

  public enableLoadArchivoButton;
  public enableLoadArchivo = new BehaviorSubject<boolean>(false);
  public enableConsultarButton;
  public enableConsultar = new BehaviorSubject<boolean>(false);
  public enableDownLoadrPlantillaButton;
  public enableDownload = new BehaviorSubject<boolean>(true);

  //public dataUpload: DataUpload;
  isDisabledGuardar: any;
  element: any;
  tipoIdentificacion = '';
  equifax: String;
  // FORM DE CONTACTO  
  public formDatosSolicitud: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', [Validators.required]);
  public identificacion = new FormControl(this.data, [Validators.required]);

  ngOnInit() {
    this.dh.setParameter();
    this.enableLoadArchivoButton = this.enableLoadArchivo.asObservable();
    this.enableLoadArchivo.next(false);
    this.enableConsultarButton = this.enableConsultar.asObservable();
    this.enableConsultar.next(false);
    this.enableDownLoadrPlantillaButton = this.enableDownload.asObservable();
    this.enableDownload.next(true);
  }


  loadArchivoCliente(element) {
    let d = {
      idTipoDocumento: 1,
      identificacionCliente: this.identificacion.value,
      data: this.data,
    };
    const dialogRef = this.dialog.open(CargarFotoDialogComponent, {
      width: '500px',
      height: 'auto',
      data: d

    });
    //console.log('===>>envio data: ', this.data);
    dialogRef.afterClosed().subscribe(r => {
      //console.log('===>>ertorno al cierre: ' + JSON.stringify(r));
      if (r) {
        this.validar = 'ACT';
        this.enableConsultar.next(true);
        this.enableLoadArchivo.next(false);
        this.sinNoticeService.setNotice('ARCHIVO CARGADO CORRECTAMENTE','success');
      }

    });
  }
  

  salir() {
    this.dialogRef.close();
  }

  consultar() {

    this.validar;
    //console.log('llegaaaa', this.validar);
    if (this.validar == 'ACT') {
      this.dialogRef.close(this.validar);
      this.equifax = 'Equifax';

    } else {
      this.sinNoticeService.setNotice('POR FAVOR DEBE CARGAR EL DOCUMENTO DE AUTORIZACION', 'warning');
    }

  }

  descargarPlantillaHabilitante(row) {

    if (this.nombresCompletos.value != '') {

      this.dh.downloadAutorizacionPlantilla(1, 'PDF', this.nombresCompletos.value, this.identificacion.value).subscribe(
        (data: any) => {
          if (data) {
            saveAs( data, 'Carta solicitud Autorizacion Buro' + '.pdf');
            this.enableLoadArchivo.next(true);
            this.enableConsultar.next(false);
            this.enableDownload.next(false);
          } else {
            this.sinNoticeService.setNotice('NO SE ENCONTRO REGISTRO PARA DESCARGA','error');
          }
        });
    } else
      this.sinNoticeService.setNotice('INGRESA LOS NOMBRES COMPLETOS  ', 'error');
  }

  
}


