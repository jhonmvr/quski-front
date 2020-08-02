import { Component, OnInit } from '@angular/core';
import { TbQoDetalleCredito } from 'src/app/core/model/quski/TbQoDetalleCredito';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-tabla-opciones-credito',
  templateUrl: './tabla-opciones-credito.component.html',
  styleUrls: ['./tabla-opciones-credito.component.scss']
})
export class TablaOpcionesCreditoComponent implements OnInit {
  // TABLA DE CREDITO
  displayedColumnsCredito = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoValoracion', 'costoTasacion', 'costoSeguro', 'costoResguardo', 'solca', 'valorCuota'];
  dataSourceCredito = new MatTableDataSource<TbQoDetalleCredito>();
  constructor() { }

  ngOnInit() {
  }

}
