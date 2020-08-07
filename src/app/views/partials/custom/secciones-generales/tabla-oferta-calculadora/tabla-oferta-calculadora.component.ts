import { Component, OnInit, Input } from '@angular/core';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { ConsultaOferta } from '../../../../../core/model/calculadora/consultaOferta';
import { OpcionesDeCredito } from '../../../../../core/model/calculadora/opcionesDeCredito';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-tabla-oferta-calculadora',
  templateUrl: './tabla-oferta-calculadora.component.html',
  styleUrls: ['./tabla-oferta-calculadora.component.scss']
})
export class TablaOfertaCalculadoraComponent implements OnInit {
  @Input() consulta: ConsultaOferta;
  // TABLA DE CREDITO
  displayedColumnsOpcionesDeCredito = ['plazo','periodoPlazo','montoFinanciado', 'valorARecibir', 'totalGastosNuevaOperacion','costoCustodia', 'costoTransporte', 'costoValoracion', 'costoTasacion', 'costoSeguro', 'costoCustodia', 'impuestoSolca', 'valorAPagar'];
  dataSourceOpcionesDeCredito = new MatTableDataSource<OpcionesDeCredito>();
  constructor(
    private cal: IntegracionService
  ) { }

  ngOnInit() {
    this.iniciaBusqueda( this.consulta );
  }
  private iniciaBusqueda( consulta : ConsultaOferta ){
    if ( consulta != null ) {
      this.cal.getInformacionOferta( consulta ).subscribe( (data: any) =>{
        if (data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion != null) {
          this.dataSourceOpcionesDeCredito.data = data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion;
        } else {
          console.log("Error ----> Id de cotizacion no existe", consulta);
        } 
      });
    } else {
      console.log("Error ----> Ingrese id de cotizador", consulta);
    }
  }

}
