import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TbQoPrecioOro } from '../../../../../../core/model/quski/TbQoPrecioOro';
import { DataPopup } from '../../../../../../core/model/wrapper/dataPopup';

@Component({
  selector: 'kt-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {
  private dataPopup: DataPopup;
  constructor(
    public dialogRefGuardar: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: TbQoPrecioOro,
  ) { }

  ngOnInit() {
    if(this.data){
      this.dataPopup = new DataPopup();
      this.dataPopup.idBusqueda = this.data.tbQoCotizador.id;
      this.dataPopup.isCotizacion = true;
      this.dataPopup.isNegociacion = false;
    } 
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }

}
