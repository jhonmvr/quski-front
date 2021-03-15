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
  listImpCom =
  ["CostoCustodia",
  "CostoFideicomiso",
  "CostoSeguro",
  "CostoTasacion",
  "CostoTransporte",
  "CostoValoracion",
  "SaldoInteres",
  "SaldoMora",
  "GastoCobranza"];
  totalCreditoAnterior = 0;
  totalCreditoNuevo = 0;
  dataObservable = new BehaviorSubject<Array<any>>(null);
  @Input() set data( list :  Array<any>){
    this.dataObservable.next( list );
  }
  constructor() { 

  }

  ngOnInit() {
    this.dataObservable.subscribe(p=>{
      if(p){

        this.dataSource = new MatTableDataSource<any>(p);
        if(p instanceof Array && p.length>0){
          p.forEach(p=>{
            if(this.listImpCom.find(x=>x==p.codigo)){
              this.totalCreditoNuevo = this.totalCreditoNuevo + p.valor;
            }else{
              this.totalCreditoAnterior = this.totalCreditoAnterior + p.valor;
            }
           
          })
        }
      }
      
    });
  }

}
