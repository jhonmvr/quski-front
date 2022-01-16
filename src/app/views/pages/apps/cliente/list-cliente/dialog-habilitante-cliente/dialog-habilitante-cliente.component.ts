import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-dialog-habilitante-cliente',
  templateUrl: './dialog-habilitante-cliente.component.html',
  styleUrls: ['./dialog-habilitante-cliente.component.scss']
})
export class DialogHabilitanteClienteComponent implements OnInit {
  proceso: string = "CLIENTE";
  rol: string = "1";
  idRef
  title :string = "HABILITANTES DEL CLIENTE";
  useType : string = "FORM";
  estOperacion : string = "DISPONIBLE"


 constructor( @Inject(MAT_DIALOG_DATA) private data: string ) { 
   
 }
 ngOnInit(): void {
   
   this.idRef = this.data;
 }
}