import { Component, OnInit } from '@angular/core';
import { DialogoBloqueoFondosComponent } from './../aprobar-bloqueo-fondos/dialogo-bloqueo-fondos/dialogo-bloqueo-fondos.component';
import { MatTable, MatDialog } from '@angular/material';
import { DialogoBloquearCreditoComponent } from '../bloquear-credito/dialogo-bloquear-credito/dialogo-bloquear-credito.component';
import { DialogoAprobarPagosComponent } from './dialogo-aprobar-pagos/dialogo-aprobar-pagos.component';

@Component({
  selector: 'kt-aprobar-pagos',
  templateUrl: './aprobar-pagos.component.html',
  styleUrls: ['./aprobar-pagos.component.scss']
})
export class AprobarPagosComponent implements OnInit {

  columnas: string[] = ['accion', 'institucionFinanciera', 'cuentas', 'fechadePago','numerodeDeposito','valorpagado','descargar'];
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
  aprobar() {
    console.log("entra a popUp aprobar pago")
      let idReferenciaHab = this.id;
      const dialogRef = this.dialog.open(DialogoAprobarPagosComponent, {
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
  rechazar() {
    console.log("entra a popUp rechazar pago")
      let idReferenciaHab = this.id;
      const dialogRef = this.dialog.open(DialogoAprobarPagosComponent, {
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
