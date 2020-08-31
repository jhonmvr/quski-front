import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Page } from '../../../../../core/model/page';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { ConsultaOferta } from '../../../../../core/model/calculadora/consultaOferta';
import { OpcionesDeCredito } from '../../../../../core/model/calculadora/opcionesDeCredito';

@Component({
  selector: 'kt-tabla-oferta-credito',
  templateUrl: './tabla-oferta-credito.component.html',
  styleUrls: ['./tabla-oferta-credito.component.scss']
})
export class TablaOfertaCreditoComponent implements OnInit {
  @Input()  consulta: ConsultaOferta;
  @Output() entidades: EventEmitter<Array<OpcionesDeCredito>> = new EventEmitter<Array<OpcionesDeCredito>>();
 



  dataSource
  displayedColumnsOpt = new MatTableDataSource<any>();
  displayedColumnsOpcionesCredito = ['Accion', 'Plazo', 'TipoOperacion', 'PeriodicidadPlazo', 'TipoOferta', 'MontoPreAprobado', 'ValorCouta'
   , 'ARecibirCliente', 'APagarPorCliente', 'ValorAPagarNeto', 'ValoresCreditoAnterior', 'TotalCostosNuevaOpreacion'
   , 'CostoCustodia', 'FormaPagoCustodia', 'CostoTransporte', 'FormaPagoTransporte', 'CostoValoracion', 'FormaPagoValoracion', 'CostoTasacion',
    'FormaPagoTasacion', 'CostoSeguro', 'FormaPagoSeguro', 'CostoResguardo', 'FormaPagoResguardo', 'Solca', 'FormaPagoSolca', 'SaldoCapitaOpAnt'
    , 'SaldoInteresOpAnt', 'FormaPagoInteres', 'SaldoMoraOpAnt', 'FormaPagoMora', 'GastosDeCobranzaOpAnt', 'FormaPagoGastoCobranza', 'CustodiaVencidaOptAnt', 
    'FormaPagoCustodiaVencida', 'AbonoCapitaOpAnterior', 'FormaPagoAbonoCapital', 'MontoDesembolsoBallon', 'ProcentajeFlujoPlaneado'];
  
    
 @ViewChild(MatPaginator, { static: true }) sort: MatSort;
 paginator: MatPaginator;
 totalResults: number;
 pageSize = 5;
 currentPage;
  p: Page;


    constructor(private is: IntegracionService) { }

  ngOnInit() {
  }
  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string,pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    //console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }
  paged() {
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',this.paginator.pageIndex)
    this.cargarDatosOperacion();
  }
  cargarDatosOperacion(){


  }
  buscar() {
    this.initiateTablePaginator();
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',0);
    this.cargarDatosOperacion();
  }
}
