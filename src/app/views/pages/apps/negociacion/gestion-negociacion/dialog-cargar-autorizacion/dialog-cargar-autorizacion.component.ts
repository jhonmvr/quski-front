import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-dialog-cargar-autorizacion',
  templateUrl: './dialog-cargar-autorizacion.component.html',
  styleUrls: ['./dialog-cargar-autorizacion.component.scss']
})
export class DialogCargarAutorizacionComponent implements OnInit {
  proceso: string = "NUEVO";
  rol: string = "1";
  idRef
  title :string = "CARGAR AUTORIZACION DE BURO";
  useType : string = "FORM";
  estOperacion : string = "AUTORIZACION"


 constructor( @Inject(MAT_DIALOG_DATA) private data: string ) { 
   
 }
 ngOnInit(): void {
   
   this.idRef = this.data;
 }


 
}
