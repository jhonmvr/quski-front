import { Component } from '@angular/core';
import { RegistarPagoDialogComponent } from './registar-pago-dialog/registar-pago-dialog';
import { MatDialog, MatTable } from '@angular/material';
import { constructor } from 'lodash';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'kt-registrar-pago',
  templateUrl: './registrar-pago.component.html',
  styleUrls: ['./registrar-pago.component.scss']
})
export class RegistrarPagoComponent  {
  
  
  columnas: string[] = ['accion', 'institucionFinanciera', 'cuentas', 'fechadePago','numerodeDeposito','valorpagado','subir','descargar'];
  columna: string[] = ['rubro', 'valor'];
  constructor( public dialog: MatDialog){

  }
  datos:Articulo []= [new Articulo('Ec','scs', 'scs',57, 55)];
  dato:Arti []= [new Arti(58, 55)];
  articuloselect: Articulo = new Articulo("","","",0, 0);
  artiselect: Arti = new Arti(0, 0);
  tabla1: MatTable<Articulo>;
  tabla: MatTable<Arti>;
  
 
  id;
  cargarPagos() {
    console.log("entra a popUp angregar pago")
      let idReferenciaHab = this.id;
      const dialogRef = this.dialog.open(RegistarPagoDialogComponent, {
        width: "auto-max",
        height: "auto-max",
        data: idReferenciaHab
      });
      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          //console.log("Data de subscribe ---> " + r);
        }
      });
  }
  borrarFila() {
    if (confirm("Realmente quiere borrarlo?")) {
      this.datos.splice(1);
      this.tabla1.renderRows();
    }
  }
  subirComponente(){
    if (confirm("Realmente quiere subir?")) {
      
    }
  }
  descargarComponente(){
    if (confirm("Realmente quiere descargar?")) {
      
    }
  }
  
  agregar() {
    //this.datos.push(new Articulo(this.articuloselect.institucionFinanciera, this.articuloselect.cuentas, this.articuloselect.fechadepago,this.articuloselect.numerodeDeposito,this.articuloselect.valorDepositado));
    //this.tabla1.renderRows();
    //this.articuloselect = new Articulo("",""," ",0, 0);
    
  }
  
  ngOnInit() {
    
  }
}
export class Articulo {
      constructor(public institucionFinanciera: String, public cuentas: string, public fechadepago:String, public numerodeDeposito: number,public valorDepositado: number) {}
        
}

export class Arti {
  constructor(public rubro: number,public valor: number) {}
    
}
