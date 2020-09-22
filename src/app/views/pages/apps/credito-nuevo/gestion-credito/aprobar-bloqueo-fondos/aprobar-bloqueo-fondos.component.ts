import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { DialogoBloqueoFondosComponent } from './dialogo-bloqueo-fondos/dialogo-bloqueo-fondos.component';

@Component({
  selector: 'kt-aprobar-bloqueo-fondos',
  templateUrl: './aprobar-bloqueo-fondos.component.html',
  styleUrls: ['./aprobar-bloqueo-fondos.component.scss']
})
export class AprobarBloqueoFondosComponent implements OnInit {

  columnas: string[] = ['institucionFinanciera', 'cuentas', 'fechadePago','numerodeDeposito','valorpagado','descargar'];
  
  constructor( public dialog: MatDialog){

  }
  datos:Articulo []= [new Articulo('Ec','scs', 'scs',55, 55)];
  
  articuloselect: Articulo = new Articulo("","","",0, 0);
  
  tabla1: MatTable<Articulo>;
  
  
  id;
  aprobar() {
    console.log("entra a popUp aprobar pago")
      let idReferenciaHab = this.id;
      const dialogRef = this.dialog.open(DialogoBloqueoFondosComponent, {
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
      const dialogRef = this.dialog.open(DialogoBloqueoFondosComponent, {
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
  /*subirComponente(){
    if (confirm("Realmente quiere subir?")) {
      
    }
  }*/
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