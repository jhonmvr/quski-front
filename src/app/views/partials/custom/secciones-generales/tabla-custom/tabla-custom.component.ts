import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { type } from 'os';
import { element } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { TablePagoComponent } from './table-pago/table-pago.component';

@Component({
  selector: 'kt-tabla-custom',
  templateUrl: './tabla-custom.component.html',
  styleUrls: ['./tabla-custom.component.scss']
})
export class TablaCustomComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns = new Array();
  dataObservable = new BehaviorSubject<Array<any>>(null);
  @Input() set data( list :  Array<any>){
    this.dataObservable.next( list );
  }
  @Input() nombreRubro;
  @Input() numeroCuota;
  @Input() numeroOperacion;
  constructor(public dialog: MatDialog ) {

   }

  ngOnInit() {
    this.dataObservable.subscribe(p=>{
      this.displayedColumns = new Array();
      let columnas = new Set();
      let cuotas = new Set();
      p.forEach(v=>{
        columnas.add(v[this.nombreRubro]);
        cuotas.add(v[this.numeroCuota]);

      })
      this.displayedColumns.push("Ver Detalle");
      this.displayedColumns.push("Numero Cuota");
      columnas.forEach(c=> this.displayedColumns.push(c));
     
      let datos = new Array();
      cuotas.forEach( numeroc=>{
       
        let dato = new Object();
        dato["Numero Cuota"] = numeroc;
        p.forEach(element=>{
          //console.log("element[this.numeroCuota]=>",element[this.numeroCuota])
          if(numeroc == element[this.numeroCuota]){
            this.displayedColumns.forEach(columna=>{
            
              if(element[this.nombreRubro] == columna){
                dato[columna]=element['proyectado'] + ' - ' + element['estado']
                //console.log("valor ==>>> ", columna, dato[columna])
              }
            });
          }
        
        
        });
        datos.push(dato);
      });
     
      this.dataSource = new MatTableDataSource<any>(datos);
     // console.log("datos==>",datos)

    });
    

  }

  verDetalle(row){
    //console.log("row === > ",this.numeroOperacion,row["Numero Cuota"])
    const dialogRef = this.dialog.open(TablePagoComponent, {
      width: "1200px",
      height: "auto",
      data: {numeroOperacion:this.numeroOperacion,couta:row["Numero Cuota"]}
    });

    dialogRef.afterClosed().subscribe(r => {
     
    });

  }
}
