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
  dataObservable = new BehaviorSubject<Array<any>>(null);
  @Input() set data( list :  Array<any>){
    this.dataObservable.next( list );
  }
  constructor() { 

  }

  ngOnInit() {
    this.dataObservable.subscribe(p=>{
      this.dataSource = new MatTableDataSource<any>(p);
    });
  }

}
