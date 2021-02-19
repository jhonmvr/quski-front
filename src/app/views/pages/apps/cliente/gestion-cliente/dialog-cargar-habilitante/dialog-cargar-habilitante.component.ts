import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'kt-dialog-cargar-habilitante',
  templateUrl: './dialog-cargar-habilitante.component.html',
  styleUrls: ['./dialog-cargar-habilitante.component.scss']
})
export class DialogCargarHabilitanteComponent implements OnInit {
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
