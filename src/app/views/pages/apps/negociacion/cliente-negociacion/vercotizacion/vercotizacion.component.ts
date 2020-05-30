import { TbMiCliente } from './../../../../../../core/model/quski/TbMiCliente';
import { Page } from './../../../../../../core/model/page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-vercotizacion',
  templateUrl: './vercotizacion.component.html',
  styleUrls: ['./vercotizacion.component.scss']
})
export class VercotizacionComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);

  displayedColumns = ['accion', 'nCotización',  'Fecha', 'Precio', 'pesoNetoEstimado'];


  /**Obligatorio paginacion */
  p = new Page();
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;
   /**Obligatorio ordenamiento */
   @ViewChild('sort1', {static: true}) sort: MatSort;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

}
