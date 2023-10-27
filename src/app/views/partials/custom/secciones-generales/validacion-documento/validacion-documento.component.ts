import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { TablePagoComponent } from '../tabla-custom/table-pago/table-pago.component';
import { CreditoNegociacionService } from '../../../../../../app/core/services/quski/credito.negociacion.service';

@Component({
  selector: 'kt-validacion-documento',
  templateUrl: './validacion-documento.component.html',
  styleUrls: ['./validacion-documento.component.scss']
})
export class ValidacionDocumentoComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns = new Array();
  idNegociacionObservable = new BehaviorSubject<number>(null);
  @Input() set idNegociacion( idNegociacion :  number){
    this.idNegociacionObservable.next( idNegociacion );
  }

  constructor(private cre: CreditoNegociacionService,public dialog: MatDialog ) {

   }

  ngOnInit() {
    this.idNegociacionObservable.subscribe(p=>{
      this.displayedColumns = new Array();
      let columnas = new Set();
      let filas = new Set();
      let datos = new Array();
      this.cre.listValidacionDocumento(p).subscribe(datosValidacion=>{
        datosValidacion.forEach(v=>{
          Object.keys(v).forEach(y=>{
            columnas.add(y);
          });

        });
        console.log("columnas", columnas.keys());

      columnas.forEach(c=> {
        if(c!=="tbQoCreditoNegociacion" && c!=="id" )
          this.displayedColumns.push(c);
        }); /*
        this.displayedColumns.push("Total Cuota");

        filas.forEach( row=>{

          let dato = new Object();
           dato["Numero Cuota"] = numeroc;
          datosValidacion.forEach(element=>{
            //console.log("element[this.numeroCuota]=>",element[this.numeroCuota])
            if(numeroc == element[this.numeroCuota]){
              this.displayedColumns.forEach(columna=>{

                if(element[this.nombreRubro] == columna){
                  dato[columna]=( Number(element['proyectado']) - Number(element['cobrado']) );
                  dato[columna+' Estado'] = element['estado'];
                  if(dato["Total Cuota"]){
                    dato["Total Cuota"] = dato["Total Cuota"] +  dato[columna]
                  }else{
                    dato["Total Cuota"] =  dato[columna];
                  }

                  //console.log("valor ==>>> ", columna, dato[columna])
                }
              });
            }


          }); */
          //datos.push(dato);
          this.dataSource = new MatTableDataSource<any>(datosValidacion);
      })



      });


     // console.log("datos==>",datos)

   // });


  }



}
