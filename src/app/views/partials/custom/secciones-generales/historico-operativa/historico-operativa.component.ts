import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-historico-operativa',
  templateUrl: './historico-operativa.component.html',
  styleUrls: ['./historico-operativa.component.scss']
})
export class HistoricoOperativaComponent implements OnInit {

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
