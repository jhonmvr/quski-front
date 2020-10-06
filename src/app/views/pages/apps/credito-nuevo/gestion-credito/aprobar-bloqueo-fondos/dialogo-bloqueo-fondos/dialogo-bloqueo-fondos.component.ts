import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-dialogo-bloqueo-fondos',
  templateUrl: './dialogo-bloqueo-fondos.component.html',
  styleUrls: ['./dialogo-bloqueo-fondos.component.scss']
})
export class DialogoBloqueoFondosComponent implements OnInit {
  private proceso: string = "CLIENTE";
  private rol: string = "1";
  private idRef
  private title :string = "DIALOGO BLOQUEAR FONDOS";
  private useType : string = "FORM";
  private estOperacion : string = "DISPONIBLE"


  constructor(@Inject(MAT_DIALOG_DATA) private data: string) { }


  ngOnInit(): void {
    this.idRef = this.data;
  }

}
