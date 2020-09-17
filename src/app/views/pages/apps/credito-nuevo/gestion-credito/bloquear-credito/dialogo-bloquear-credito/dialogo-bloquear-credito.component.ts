import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-dialogo-bloquear-credito',
  templateUrl: './dialogo-bloquear-credito.component.html',
  styleUrls: ['./dialogo-bloquear-credito.component.scss']
})
export class DialogoBloquearCreditoComponent implements OnInit {

  private proceso: string = "CLIENTE";
  private rol: string = "1";
  private idRef
  private title :string = "DIALOGO BLOQUEAR CREDITO";
  private useType : string = "FORM";
  private estOperacion : string = "DISPONIBLE"


  constructor(@Inject(MAT_DIALOG_DATA) private data: string) { }


  ngOnInit(): void {
    this.idRef = this.data;
  }

}
