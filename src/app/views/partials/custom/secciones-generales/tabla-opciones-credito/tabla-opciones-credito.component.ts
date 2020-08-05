import { Component, OnInit, Input } from '@angular/core';
import { TbQoDetalleCredito } from '../../../../../core/model/quski/TbQoDetalleCredito';
import { MatTableDataSource } from '@angular/material';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';

@Component({
  selector: 'kt-tabla-opciones-credito',
  templateUrl: './tabla-opciones-credito.component.html',
  styleUrls: ['./tabla-opciones-credito.component.scss']
})
export class TablaOpcionesCreditoComponent implements OnInit {
  @Input() dataPopup: DataPopup;
  // TABLA DE CREDITO
  displayedColumnsCredito = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoValoracion', 'costoTasacion', 'costoSeguro', 'costoResguardo', 'solca', 'valorCuota'];
  dataSourceCredito = new MatTableDataSource<TbQoDetalleCredito>();
  constructor() { }

  ngOnInit() {
  }

}
