import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-impuestos-com-table',
  templateUrl: './impuestos-com-table.component.html',
  styleUrls: ['./impuestos-com-table.component.scss']
})
export class ImpuestosComTableComponent implements OnInit {
  dataSource= new MatTableDataSource<any>();
  totalCreditoAnterior = 0;
  totalCreditoNuevo = 0;
  valorARecibir;
  valorAPagar;
  valorNeto;
  dataObservable = new BehaviorSubject<any>(null);
  @Input() set data( list :  any){
    this.dataObservable.next( list );
  }
  constructor() { 

  }

  ngOnInit() {
    this.dataObservable.subscribe(p=>{
      if(p){
        this.valorARecibir = p.valorRecibir;
        this.valorAPagar = p.valorPagar;
        this.valorNeto = p.valorNeto;
        if(p.listaImpCom){
          let x :Array<any> =p.listaImpCom; 
          let y =  x.sort((a,c)=>a.orden-c.orden);
          console.log("ordenado", y , x);
          this.dataSource = new MatTableDataSource<any>(y);
        }
        if(p.listaImpCom instanceof Array && p.listaImpCom.length>0){
          p.listaImpCom.forEach(x=>{
            if(x.esCreditoAnterior){
              this.totalCreditoAnterior = this.totalCreditoAnterior + x.valor;
            }else{
              this.totalCreditoNuevo = this.totalCreditoNuevo + x.valor;
            }
           
          })
        }
      }
      
    });
  }

}
