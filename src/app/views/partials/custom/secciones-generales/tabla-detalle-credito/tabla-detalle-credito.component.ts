import { Component, OnInit, Input } from '@angular/core';
import { TbQoDetalleCredito } from '../../../../../core/model/quski/TbQoDetalleCredito';
import { MatTableDataSource } from '@angular/material';
import { DetalleCreditoService } from '../../../../../core/services/quski/detalle-credito.service';

@Component({
  selector: 'kt-tabla-detalle-credito',
  templateUrl: './tabla-detalle-credito.component.html',
  styleUrls: ['./tabla-detalle-credito.component.scss']
})
export class TablaDetalleCreditoComponent implements OnInit {
  @Input() idCotizador: number;
  // TABLA DE CREDITO
  displayedColumnsDetalleCredito = ['plazo','periodoPlazo','montoPreaprobado', 'recibirCliente', 'costoNuevaOperacion', 'costoCustodia', 'costoTransporte', 'costoValoracion', 'costoTasacion', 'costoSeguro', 'costoResguardado', 'solca', 'valorCuota'];
  dataSourceDetalleCredito = new MatTableDataSource<TbQoDetalleCredito>();
  constructor(
    private det: DetalleCreditoService
  ) { 
    this.det.setParameter();
  }

  ngOnInit() {
    this.det.setParameter();
    this.iniciaBusqueda( this.idCotizador );
  }
  private iniciaBusqueda( idCotizador : number ){
    if ( idCotizador != null ) {
      if ( idCotizador > 0 ) {
        this.det.listByIdCotizador( idCotizador ).subscribe( (data: any) =>{
          if (data.list) {
            this.dataSourceDetalleCredito.data = data.list;
          } else {
            //console.log("Error ----> Id de cotizacion no existe", idCotizador);
          } 
        });
      } else {
        //console.log("Error ----> id cotizador Incorrecto", idCotizador);
      }
    } else {
      //console.log("Error ----> Ingrese id de cotizador", idCotizador);
    }
  }
}
