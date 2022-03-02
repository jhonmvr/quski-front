import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { SoftbankService } from '../../../../../../app/core/services/quski/softbank.service';
import { Page } from '../../../../../../app/core/model/page';
import { DevolucionService } from '../../../../../../app/core/services/quski/devolucion.service';
import { ReNoticeService } from '../../../../../../app/core/services/re-notice.service';
import { count } from 'rxjs/operators';
import { xor } from 'lodash';

@Component({
  selector: 'kt-reporte-entrega-garantia',
  templateUrl: './reporte-entrega-garantia.component.html',
  styleUrls: ['./reporte-entrega-garantia.component.scss']
})
export class ReporteEntregaGarantiaComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  cargardatos = new BehaviorSubject<boolean>(false);
  p = new Page();
  pageSize=5;
  totalResults =0;
  currentPage
  codigoOperacion = new FormControl('',[]);
  codigoBpm = new FormControl('',[]);
  estado = new FormControl('',[]);
  agenciaEntrega = new FormControl('',[]);
  agenciaRecepcion = new FormControl('',[]);
  fechaCreacionDesde = new FormControl('',[]);
  fechaCreacionHasta = new FormControl('',[]);
  fechaArriboDesde = new FormControl('',[]);
  fechaArriboHasta = new FormControl('',[]);
  fechaEntregaDesde = new FormControl('',[]);
  fechaEntregaHasta = new FormControl('',[]);
  catAgencia:Array<any>;

  dataSource
  constructor(private sinNoticeService: ReNoticeService,
    public sof: SoftbankService,
    public dev: DevolucionService) {
      this.dev.setParameter();
      this.sof.setParameter();
     }

  ngOnInit() {
    this.dev.setParameter();
    this.sof.setParameter();
    this.sof.consultarAgenciasCS().subscribe(cat=>{
      this.catAgencia = cat.catalogo;
    });
  }

  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }
  nombreAgencia(idAgencia){
    if(idAgencia && this.catAgencia){
      const x = this.catAgencia.find(x=>x.id==idAgencia);
      return x?x.nombre:'';
    }    
      
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

    
    
    
    this.dev.reporteDevolucion(this.p, {}).subscribe((data: any) => {
      if (data.list != null) {
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.totalResults = data.totalResults;
        
        this.cargardatos.next(false);
      } else {
        this.cargardatos.next(false);
        this.initiateTablePaginator();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }
    );
  }
}
