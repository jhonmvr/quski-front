import { Page } from './../../../../../core/model/page';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-variables-crediticias',
  templateUrl: './variables-crediticias.component.html',
  styleUrls: ['./variables-crediticias.component.scss']
})
export class VariablesCrediticiasComponent implements OnInit {


///Columnas de las tablas 
displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
  public pageSize = 5;
  public currentPage = 0;ic
  public totalSize = 0;
  public totalResults = 0;
 p = new Page ();
  constructor() { }

  ngOnInit() {
  }

}
