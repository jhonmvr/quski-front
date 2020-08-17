import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';
import { TbQoRiesgoAcumulado } from '../../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { SoftbankService } from '../../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../../core/services/re-notice.service';



@Component({
  selector: 'm-credito-vigente-dialog',
  templateUrl: './credito-vigente-dialog.component.html',
  styleUrls: ['./credito-vigente-dialog.component.scss']
})
export class CreditoVigenteDialogComponent implements OnInit {

  displayedColumns = ['NroPrestamo', 'CuentaIndividual', 'TipoCredito', 'CapitaInicial', 'SaldoCapital', 'Plazo',
    'FechaAprobacion', 'FechaFinalCredito', 'CoberturaAnterior', 'CoberturaActual', 'EstatusCredito', 'MotivoBloqueo', 'DiasMora',
    'EstadoMediacion', 'Retanqueo', 'Cuota', 'CapitalCuotaAtrasada', 'InteresCuotaAtrasada', 'Mora', 'GestionCobranza', 'Custodia', 'TotalDeuda',
    'NroCuotasImpagadas', 'UltDivPagado'];
  dataSourceCre = new MatTableDataSource<TbQoRiesgoAcumulado>();



  constructor(
    private softs: SoftbankService,
    private sinNoticeService: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) private data: Array<TbQoRiesgoAcumulado>,
    public dialogRefGuardar: MatDialogRef<CreditoVigenteDialogComponent>) {
    // this.softs.setParameter();
  }

  ngOnInit() {
    this.dataSourceCre.data = this.data;
  }
  salir() {
    this.dialogRefGuardar.close(false);
  }


}
