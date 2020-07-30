import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';
import { Page } from '../../../../../core/model/page';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';



@Component({
  selector: 'm-credito-vigente-dialog',
  templateUrl: './credito-vigente-dialog.component.html',
  styleUrls: ['./credito-vigente-dialog.component.scss']
})
export class CreditoVigenteDialogComponent implements OnInit {

  public cedulaCliente: string;
  public consulta: ConsultaCliente;

  p = new Page();

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;
  private element;
  displayedColumns = ['NroPrestamo', 'CuentaIndividual', 'TipoCredito', 'CapitaInicial', 'SaldoCapital', 'Plazo',
    'FechaAprobacion', 'FechaFinalCredito', 'CoberturaAnterior', 'CoberturaActual', 'EstatusCredito', 'MotivoBloqueo', 'DiasMora',
    'EstadoMediacion', 'Retanqueo', 'Cuota', 'CapitalCuotaAtrasada', 'InteresCuotaAtrasada', 'Mora', 'GestionCobranza', 'Custodia', 'TotalDeuda',
    'NroCuotasImpagadas', 'UltDivPagado'];
  dataSourceCre = new MatTableDataSource<any>();




  public totalSize = 0;



  constructor(
    private softs: SoftbankService,
    private sinNoticeService: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) private data: string,
    public dialogRefGuardar: MatDialogRef<CreditoVigenteDialogComponent>) {
    // this.softs.setParameter();
  }

  ngOnInit() {
    this.cedulaCliente = this.data;
    console.log('cedulaOninit', this.cedulaCliente);
    this.submit();

  }
  submit() {
    this.consulta = new ConsultaCliente();
    this.consulta.identificacion = this.cedulaCliente;
    this.consulta.idTipoIdentificacion = 1;
    console.log('CONSULTA SUBMIT', JSON.stringify(this.consulta));
    this.softs.consultaRiesgoAcumuladoCS(this.consulta).subscribe(data => {
      if (data) {
        console.log(" data de consultaRiesgoAcumuladoCS ------> ", JSON.stringify(data));
        console.log("Funciona -----> consultaRiesgoAcumuladoCS");
      } else {
        this.sinNoticeService.setNotice("no me trajo data consultaRiesgoAcumuladoCS :C", "error");
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.setmsgError, 'error');
      } else {
        this.sinNoticeService.setNotice("No se pudo capturar el error :c", 'error');
      }
    });
  }





  salir() {
    this.dialogRefGuardar.close(false);
  }


}
