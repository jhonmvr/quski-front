import { Page } from './../../../../../core/model/page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-riesgo-acumulado',
  templateUrl: './riesgo-acumulado.component.html',
  styleUrls: ['./riesgo-acumulado.component.scss']
})
export class RiesgoAcumuladoComponent implements OnInit {

  private element
  displayedColumns = ['NumeroOperacion', 'TipoOferta', 'Vencimiento', 'Cuotas', 
  'CapitaInicial', 'SaldoCapital', 'Plazo', 'FechaAprobacion', 'FechaFinalCredito', 
  'DiasMora', 'ValorCuota', 'MotivoBloqueo', 'TotalCredito', 'CoberturaAnterior', 
  'CoverturaVigente', 'DeudaTotal','TotalSaldo','RiesgoTotalCliente'];
  dataSourceCre = new MatTableDataSource<any>();
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;
  p = new Page();
  constructor() { }

  ngOnInit() {
  }







}
