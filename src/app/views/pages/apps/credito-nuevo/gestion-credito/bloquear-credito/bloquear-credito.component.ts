import { Component, OnInit } from '@angular/core';
import { MatTable, MatDialog } from '@angular/material';
import { DialogCargarHabilitanteComponent } from './../../../cliente/gestion-cliente/dialog-cargar-habilitante/dialog-cargar-habilitante.component';
import { DialogoBloquearCreditoComponent } from './dialogo-bloquear-credito/dialogo-bloquear-credito.component';

@Component({
  selector: 'kt-bloquear-credito',
  templateUrl: './bloquear-credito.component.html',
  styleUrls: ['./bloquear-credito.component.scss']
})
export class BloquearCreditoComponent implements OnInit {

  columnas: string[] = ['accion', 'institucionFinanciera', 'cuentas', 'fechadePago','numerodeDeposito','valorpagado','subir','descargar'];
  
  constructor( public dialog: MatDialog){

  }
  datos:Articulo []= [new Articulo('Ec','scs', 'scs',55, 55)];
  
  articuloselect: Articulo = new Articulo("","","",0, 0);
  
  tabla1: MatTable<Articulo>;
  
  
  id;
  cargarPagos() {
    console.log("entra a popUp angregar pago")
      let idReferenciaHab = this.id;
      const dialogRef = this.dialog.open(DialogoBloquearCreditoComponent, {
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
