import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Page } from '../../../../../../../app/core/model/page';
import { TbQoTracking } from '../../../../../../../app/core/model/quski/TbQoTracking';
import { TrackingService } from '../../../../../../../app/core/services/quski/tracking.service';
import { ReNoticeService } from '../../../../../../../app/core/services/re-notice.service';

@Component({
  selector: 'kt-traking-detalle',
  templateUrl: './traking-detalle.component.html',
  styleUrls: ['./traking-detalle.component.scss']
})
export class TrakingDetalleComponent implements OnInit {
  catProceso:   Array<any>;
  cargardatos = new BehaviorSubject<boolean>(false);
  displayedActividad = [ 'proceso','codigoBPM','codigoSoftbank','fechaCreacion','actividad', 'tiempoTranscurrido', 'usuario'];
  displayedSeccion = [ 'proceso','codigoBPM','codigoSoftbank','fechaCreacion','actividad', 'seccion', 'usuario', 'horaInicio', 'horaFin', 'tiempoTranscurrido','observacion'];
  displayedSeccionConsolidado = [ 'proceso','codigoBPM','seccion','tiempoTranscurrido'];
  displayedArea = [ 'proceso','codigoBPM','fechaCreacion','area', 'tiempoTranscurrido'];
  displayedColumns = this.displayedActividad;
  /**Obligatorio paginacion */
  p = new Page();
  dataSource: MatTableDataSource<any> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  totalTiempo: number;
  total: number;
  pageSize = 5;
  currentPage;
  varBoton = 'SECCION';

  public codigoBPM;


  constructor(
    private route: ActivatedRoute,
    private tra: TrackingService,
    private sinNoticeService: ReNoticeService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRefGuardar: MatDialogRef<any>,
  ) {
    this.tra.setParameter();

    
  }

  ngOnInit() {
    this.tra.setParameter();
    this.codigoBPM = this.data.codigoBpm;
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        this.codigoBPM = data.params.id;
        this.buscarSeccion();
      }
    });
    
  }
  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  
  /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  getPaginacion(paginado: string, pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.isPaginated = paginado;
    p.sortDirections = 'asc';
    p.sortFields = 'id';
    return p;
  }
  buscarActividad(pageIndex?, pageSize?){
    this.cargardatos.next(false);
    if(pageIndex != null){
      this.p.size = pageSize;
      this.p.pageNumber = pageIndex;
    }else{
      this.p.size = 5;
      //
      //
      this.p.pageNumber = 0;
    }
    this.displayedColumns = this.displayedActividad;
    this.tra.findTrakingActividadByCodigoBpm(this.p, this.codigoBPM).subscribe((data: any) => {
      this.cargardatos.next(true);
      if (data.list != null) {
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.totalResults = data.totalResults;
      } else {
        this.totalResults =0;
        this.dataSource = new MatTableDataSource<any>();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    });
  }
  buscarSeccion(pageIndex?, pageSize?){
    console.log("datos de paguina", pageIndex, pageSize);
    this.cargardatos.next(false);
    if(pageIndex != null){
      this.p.size = pageSize;
      this.p.pageNumber = pageIndex;
    }else{
      this.p.size = 5;
      this.p.pageNumber = 0;
    }
    console.log("datos de paguina", this.p);
    this.displayedColumns = this.displayedSeccion;
    this.tra.findTrakingSeccionByCodigoBpm(this.p, this.codigoBPM).subscribe((data: any) => {
      this.cargardatos.next(true);
      if (data.list != null) {
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.totalResults = data.totalResults;
        
      } else {
        this.totalResults =0;
        this.dataSource = new MatTableDataSource<any>();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    });
  }
  buscarSeccionConsolidado(pageIndex?, pageSize?){
    this.cargardatos.next(false);
    if(pageIndex != null){
      this.p.size = pageSize;
      this.p.pageNumber = pageIndex;
    }else{
      this.p.size = 5;
      
      
      this.p.pageNumber = 0;
    }
    this.displayedColumns = this.displayedSeccionConsolidado;
    this.tra.findTrakingSeccionConsolidadoByCodigoBpm(this.p, this.codigoBPM).subscribe((data: any) => {
      this.cargardatos.next(true);
      if (data.list != null) {
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.totalResults = data.totalResults;
        
      } else {
        this.totalResults =0;
        this.dataSource = new MatTableDataSource<any>();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    });
  }
  buscarArea(pageIndex?, pageSize?){
    this.cargardatos.next(false);
    if(pageIndex != null){
      this.p.size = pageSize;
      this.p.pageNumber = pageIndex;
    }else{
      this.p.size = 5;
      
      
      this.p.pageNumber = 0;
    }
    this.displayedColumns = this.displayedArea;
    this.tra.findTrakingAreaByCodigoBpm(this.p, this.codigoBPM).subscribe((data: any) => {
      this.cargardatos.next(true);
      if (data.list != null) {
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.totalResults = data.totalResults;
        
      } else {
        this.totalResults =0;
        this.dataSource = new MatTableDataSource<any>();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    });
  }

  sumarTiempo(){
   
    let hour =0;
    let minute = 0;
    let second =0;
    if(this.dataSource.data && this.dataSource.data.length >0){
      this.dataSource.data.forEach(p=>{
        if(p.tiempoTranscurrido && p.tiempoTranscurrido != " "){
          var splitTime1=  p.tiempoTranscurrido.split(':');
          hour = hour + parseInt(splitTime1[0]);
          minute = minute + parseInt(splitTime1[1]);
          hour = hour + minute/60;
          minute = minute%60;
          second = second + parseInt(splitTime1[2]);
          minute = minute + second/60;
          second = second%60;
          minute = Math.trunc(minute);
          hour = Math.trunc(hour);
        }
      });
    }
    return String(hour).padStart(2, '0') +':'+String(minute).padStart(2, '0')+':'+String(second).padStart(2, '0');
    
  }

}