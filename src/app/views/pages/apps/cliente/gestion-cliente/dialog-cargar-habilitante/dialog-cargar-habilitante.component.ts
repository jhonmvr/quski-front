import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'kt-dialog-cargar-habilitante',
  templateUrl: './dialog-cargar-habilitante.component.html',
  styleUrls: ['./dialog-cargar-habilitante.component.scss']
})
export class DialogCargarHabilitanteComponent implements OnInit {
  private proceso: string = "CLIENTE";
  private rol: string = "1";
  private idRef
  private title :string = "HABILITANTES DEL CLIENTE";
  private useType : string = "FORM";


  constructor( @Inject(MAT_DIALOG_DATA) private data: string ) { }
  ngOnInit(): void {
    this.idRef = this.data;
  }
}
