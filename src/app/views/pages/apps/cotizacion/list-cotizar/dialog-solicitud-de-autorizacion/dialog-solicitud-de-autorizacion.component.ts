import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'kt-dialog-solicitud-de-autorizacion',
  templateUrl: './dialog-solicitud-de-autorizacion.component.html',
  styleUrls: ['./dialog-solicitud-de-autorizacion.component.scss']
})
export class DialogSolicitudDeAutorizacionComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  seleccionarEditar() {
    console.log(">>>INGRESA AL DIALOGO ><<<<<<");
    const dialogRefGuardar = this.dialog.open(DialogSolicitudDeAutorizacionComponent, {
      width: '600px',
      height: 'auto',


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log("envio de datos ");
      if (respuesta)

        console.log("Ingresa al metodo");// this.submit();

    });



  }


}
