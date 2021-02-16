import { TbQoVariablesCrediticia } from '../../../../../../core/model/quski/TbQoVariablesCrediticia';
import { CotizacionService } from '../../../../../../core/services/quski/cotizacion.service';
import { TbQoDetalleCredito } from '../../../../../../core/model/quski/TbQoDetalleCredito';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { TbQoCotizador } from '../../../../../../core/model/quski/TbQoCotizador';
import { TbQoTasacion } from '../../../../../../core/model/quski/TbQoTasacion';
import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'kt-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {
  public wCotiz : { joyas: TbQoTasacion[], variables: TbQoVariablesCrediticia[], opciones: TbQoDetalleCredito[], cotizacion: TbQoCotizador}
  dataSource = new MatTableDataSource<TbQoDetalleCredito>();
  displayedColumns = ['plazo','periodicidadPlazo','montoFinanciado','valorARecibir','cuota','totalGastosNuevaOperacion','costoCustodia','costoTasacion','costoSeguro','costoFideicomiso','impuestoSolca'];
  
  constructor(
    public dialogRefGuardar: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private cot: CotizacionService

  ) { }

  ngOnInit() {
    if(this.data){
     this.bucarDatosCotizacion( this.data );
    } 
  }
  private bucarDatosCotizacion(id){
    this.cot.buscarGestionCotizacion(id).subscribe( (data: any) =>{
      if(data.entidad){
        this.wCotiz = data.entidad;
        this.dataSource.data = this.wCotiz.opciones
      }
    });
  }
  salir(){
    this.dialogRefGuardar.close(false);
  }

}
