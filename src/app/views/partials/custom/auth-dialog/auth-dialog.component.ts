import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AutorizacionService } from '../../../../core/services/autorizacion.service';
import { environment } from '../../../../../environments/environment';



export interface DialogData {
  mensaje: string;
}


@Component({
  selector: 'kt-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  public mensaje:string;

  constructor(public dialogRef: MatDialogRef<AuthDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private authService:AutorizacionService) {
    //console.log( "==> error mensaje " + data.mensaje );
    this.mensaje=data.mensaje;
   }

  ngOnInit() {
    
  }

  

  cerrar(){
    this.authService.logoutDialog();
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.authService.logoutDialog();
    this.dialogRef.close();
  }
  


}
