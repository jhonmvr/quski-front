import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'kt-vercotizacion',
  templateUrl: './vercotizacion.component.html',
  styleUrls: ['./vercotizacion.component.scss']
})
export class VercotizacionComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

}
