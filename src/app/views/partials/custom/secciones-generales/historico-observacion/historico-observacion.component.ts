import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-historico-observacion',
  templateUrl: './historico-observacion.component.html',
  styleUrls: ['./historico-observacion.component.scss']
})
export class HistoricoObservacionComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  private dataObservable: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(null);
  @Input() set data(list: Array<any>) {
    this.dataObservable.next(list);
  }
  constructor() { }

  ngOnInit() {
    this.dataObservable.subscribe(p => {
      this.dataSource = new MatTableDataSource<any>(p);
    });
  }

}
