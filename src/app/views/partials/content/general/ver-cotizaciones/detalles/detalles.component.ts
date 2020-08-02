import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: string,
  ) { }

  ngOnInit() {
    if(this.data){
      console.log("Data dentro de detalles ---->   ", this.data); 
      // this.cedula = this.data;
      // this.buscar();
    } 
  }

}
