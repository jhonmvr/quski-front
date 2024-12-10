import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { Page } from '../../../../../core/model/page';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { count } from 'rxjs/operators';
import { xor } from 'lodash';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { CreditoService } from '../../../../../core/services/quski/credito.service';

@Component({
  selector: 'kt-reporte-compromiso-pago',
  templateUrl: './reporte-compromiso-pago.component.html',
  styleUrls: ['./reporte-compromiso-pago.component.scss']
})
export class ReporteCompromisoPagoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  cargardatos = new BehaviorSubject<boolean>(false);
  p = new Page();
  pageSize=5;
  totalResults =0;
  currentPage

  codigo = new FormControl('',[]);
  codigoOperacion = new FormControl('',[]);
  tipoCompromiso = new FormControl('',[]);
  estadoCompromiso = new FormControl('',[]);
  fechaCompromisoDesde = new FormControl('',[]);
  fechaCompromisoHasta = new FormControl('',[]);
  usuarioSolicitud = new FormControl('',[]);
  usuarioAprobador = new FormControl('',[]);
  fechaSolicitudDesde = new FormControl('',[]);
  fechaSolicitudHasta = new FormControl('',[]);
  numeroOperacion = new FormControl('',[]);
  fechaCompromisoAnteriorDesde = new FormControl('',[]);
  fechaCompromisoAnteriorHasta = new FormControl('',[]);
  nombreCliente = new FormControl('',[]);
  identificacionCliente = new FormControl('',[]);
  proceso = new FormControl('',[]);

  catEstadoProceso;
  catProceso;
  dataSource

  constructor(private sinNoticeService: ReNoticeService,
    public sof: SoftbankService,
    public dev: DevolucionService,
    private pro: ProcesoService,
    public cre: CreditoService) {
      this.cre.setParameter();
      this.sof.setParameter();
     }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.pro.getEstadosProceso(["CAMBIO_COMPROMISO_PAGO","COMPROMISO_PAGO"]).subscribe( (dataEstado: any) =>{
      this.catEstadoProceso = dataEstado.entidades ? dataEstado.entidades : [];
      console.log(dataEstado);
      this.catProceso = ["CAMBIO_COMPROMISO_PAGO","COMPROMISO_PAGO"]

    });
  }

  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }
  buscarBoton(pageIndex?, pageSize?){
    if(pageIndex != null){
      this.p.size = pageSize;
      this.p.pageNumber = pageIndex;
    }else{
      this.p.size = 5;
      this.paginator.pageSize =5;
      this.paginator.pageIndex=0;
      this.p.pageNumber = 0;
    }

    this.cre.reporteCompromiso(this.p, {
      codigo: this.codigo.value, 
      codigoOperacion: this.codigoOperacion.value, 
      tipoCompromiso: this.tipoCompromiso.value, 
      estadoCompromiso: this.estadoCompromiso.value, 
      fechaCompromisoDesde: this.fechaCompromisoDesde.value, 
      fechaCompromisoHasta: this.fechaCompromisoHasta.value, 
      usuarioSolicitud: this.usuarioSolicitud.value, 
      usuarioAprobador: this.usuarioAprobador.value, 
      fechaSolicitudDesde: this.fechaSolicitudDesde.value, 
      fechaSolicitudHasta: this.fechaSolicitudHasta.value, 
      numeroOperacion: this.numeroOperacion.value, 
      fechaCompromisoAnteriorDesde: this.fechaCompromisoAnteriorDesde.value, 
      fechaCompromisoAnteriorHasta: this.fechaCompromisoAnteriorHasta.value, 
      nombreCliente: this.nombreCliente.value, 
      identificacionCliente: this.identificacionCliente.value, 
      proceso: this.proceso.value
    }).subscribe((data: any) => {
      if (data.list != null) {
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.totalResults = data.totalResults;
        
        this.cargardatos.next(false);
      } else {
        this.cargardatos.next(false);
        this.initiateTablePaginator();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    } );
  }

  descargarBoton(){
    if(confirm("ESTA SEGURO CON QUE DESEA GENERARL EL REPORTE?. ESTO PODRIA TARDAR VARIOS MINUTOS")){
      this.dev.descargarReporteDevolucion( {
        codigo: this.codigo.value, 
        codigoOperacion: this.codigoOperacion.value, 
        tipoCompromiso: this.tipoCompromiso.value, 
        estadoCompromiso: this.estadoCompromiso.value, 
        fechaCompromisoDesde: this.fechaCompromisoDesde.value, 
        fechaCompromisoHasta: this.fechaCompromisoHasta.value, 
        usuarioSolicitud: this.usuarioSolicitud.value, 
        usuarioAprobador: this.usuarioAprobador.value, 
        fechaSolicitudDesde: this.fechaSolicitudDesde.value, 
        fechaSolicitudHasta: this.fechaSolicitudHasta.value, 
        numeroOperacion: this.numeroOperacion.value, 
        fechaCompromisoAnteriorDesde: this.fechaCompromisoAnteriorDesde.value, 
        fechaCompromisoAnteriorHasta: this.fechaCompromisoAnteriorHasta.value, 
        nombreCliente: this.nombreCliente.value, 
        identificacionCliente: this.identificacionCliente.value, 
        proceso: this.proceso.value
      }).subscribe((data: any) => {
        if (data.documentoHabilitanteByte) {
          const byteCharacters = atob(data.documentoHabilitanteByte);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          
          const blob =  new Blob([byteArray]);
          var url = window.URL.createObjectURL(blob); 
        
          let a = document.createElement("a");
          a.href = url;
          a.target = "_blank"
          
          a.download = 'reporte-entrega.xls';
          
          a.click();
          URL.revokeObjectURL(url);
        }
      } );
    }
    

  }
}
