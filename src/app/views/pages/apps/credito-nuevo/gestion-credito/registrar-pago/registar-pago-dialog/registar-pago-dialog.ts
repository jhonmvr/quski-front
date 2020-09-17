import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-registar-pago-dialog',
  templateUrl: './registrar-pago-dialog.html',
  styleUrls: ['./registar-pago-dialog.scss']
})
export class RegistarPagoDialogComponent implements OnInit {

    private proceso: string = "CLIENTE";
    private rol: string = "1";
    private idRef
    private title :string = "REGISTRAR PAGOS";
    private useType : string = "FORM";
    private estOperacion : string = "DISPONIBLE"
  
  
    constructor( @Inject(MAT_DIALOG_DATA) private data: string ) { 
      
    }
    ngOnInit(): void {
      this.idRef = this.data;
    }

}
