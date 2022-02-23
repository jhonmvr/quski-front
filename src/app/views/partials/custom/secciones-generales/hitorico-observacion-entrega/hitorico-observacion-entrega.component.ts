import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { DevolucionService } from '../../../../../../app/core/services/quski/devolucion.service';

@Component({
  selector: 'kt-hitorico-observacion-entrega',
  templateUrl: './hitorico-observacion-entrega.component.html',
  styleUrls: ['./hitorico-observacion-entrega.component.scss']
})
export class HitoricoObservacionEntregaComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  private dataObservable: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(null);
  private idObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  @Input() set data(list: Array<any>) {
    this.dataObservable.next(list);
  }
  @Input() set id(id: any) {
    this.idObservable.next(id);
  }
  constructor(
    private dev: DevolucionService) { }

  ngOnInit() {
    this.idObservable.subscribe(idEntrega => {
      if(idEntrega){
        this.dev.historicoEntregaByIdEntrega(idEntrega).subscribe(p=>{
          if(p.entidades){
            this.dataSource = new  MatTableDataSource<any>(p.entidades);
          }
        })
      }
     
    });
  }

}
