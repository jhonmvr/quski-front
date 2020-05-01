import { Component, OnInit, Inject } from '@angular/core';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CargarFotoDialogComponent } from '../fotos/cargar-foto-dialog/cargar-foto-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { ReFileUploadService } from '../../../../core/services/re-file-upload.service';

@Component({
  selector: 'm-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.scss']
})
export class ArchivoComponent implements OnInit {
    
 
  
  constructor(private sinNoticeService : ReNoticeService,
    public dialogRef: MatDialogRef<ArchivoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string, public dialog: MatDialog,private upload: ReFileUploadService) { }

  ngOnInit() {
  }

  loadArchivoCliente(element) {
    
     let d = {
      idTipoArchivo: 1,
  
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
     // console.log("===>>envio data: ",this.data );
      dialogRef.afterClosed().subscribe(r => {
        console.log("===>>ertorno al cierre: " + JSON.stringify(r));
        if (r) {
        //  this.validar='ACT';
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

  cancelar(){
    
  }
}
