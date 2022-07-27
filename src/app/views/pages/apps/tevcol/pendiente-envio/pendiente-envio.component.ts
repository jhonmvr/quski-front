import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DevolucionService } from '../../../../../../app/core/services/quski/devolucion.service';
import { Page } from '../../../../../../app/core/model/page';
import { TbQoTracking } from '../../../../../../app/core/model/quski/TbQoTracking';
import { SoftbankService } from '../../../../../../app/core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../../app/core/services/re-notice.service';
import { WrapperBusqueda } from '../../credito-nuevo/list-credito/list-credito.component';
import { SelectionModel } from '@angular/cdk/collections';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'kt-pendiente-envio',
  templateUrl: './pendiente-envio.component.html',
  styleUrls: ['./pendiente-envio.component.scss']
})
export class PendienteEnvioComponent implements OnInit {
  catProceso:   Array<any>;
  cargardatos = new BehaviorSubject<boolean>(false);
  displayedColumns = [ 'select','numeroOperacion','numeroOperacionMadre','numeroFundaActual','numeroFundaMadre','agencia', 'estadoGarantia', 'ubicacionGarantia', 'nombreCliente', 'identificacionCliente'];

  /**Obligatorio paginacion */
  p = new Page();
  dataSource: MatTableDataSource<any> = new MatTableDataSource<TbQoTracking>();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  totalTiempo: number;
  total: number;
  pageSize = 100;
  currentPage;
  catAgencia;

  //seleccion
  selection = new SelectionModel<any>(true, []);

  public formCliente: FormGroup = new FormGroup({});
  public agencia = new FormControl('', [Validators.maxLength(50)]);
  operaciones: any;
  w: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sof: SoftbankService,
    private dev: DevolucionService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog
  ) {
    this.sof.setParameter();

    this.formCliente.addControl("agencia", this.agencia);
  }

  ngOnInit() {
    this.sof.setParameter();
    this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
      this.catAgencia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
    this.initiateTablePaginator();
    //this.buscarBoton();
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        this.agencia.setValue(data.params.id);
        this.buscarBoton();
      }
    });
  }
  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 100;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }
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

  enviar(){
    if(this.selection.isEmpty()){
      this.sinNoticeService.setNotice("DEBES SELECCIONAR ALMENOS UNA OPERACION", 'warning');
      return;
    }
    if(!this.w.idAgencia){
      this.sinNoticeService.setNotice("PRIMERO DEBE SELECCIONAR UNA AGENCIA", 'warning');
      return;
    }
    let totalAvaluo = this.selection.selected.map(p=> {return p.totalValorAvaluo }).reduce((p,n) =>   p + n, 0 );
    let totalGarantias = this.selection.selected.length;
    
    if(confirm("Esta seguro que decea enviar a tevcol " + totalGarantias + " garantias de la agencia: " + this.nombreAgencia(this.w.idAgencia) + " con un total avaluo de: " + totalAvaluo)){
      this.dev.enTransporteTevcol(this.selection.selected.map(p=>{ return {codigoOperacion: p.numeroOperacion, cedulaCliente: p.identificacion}})).subscribe(t=>{
        
        this.buscarBoton();
      });
    }
  }

  noEnviar(){
    if(this.selection.isEmpty()){
      this.sinNoticeService.setNotice("DEBES SELECCIONAR ALMENOS UNA OPERACION", 'warning');
      return;
    }
    if(!this.w.idAgencia){
      this.sinNoticeService.setNotice("PRIMERO DEBE SELECCIONAR UNA AGENCIA", 'warning');
      return;
    }
    let totalAvaluo = this.selection.selected.map(p=> {return p.totalValorAvaluo }).reduce((p,n) =>   p + n, 0 );
    let totalGarantias = this.selection.selected.length;
    
    if(confirm("Confirma que no envia " + totalGarantias + " garantias de la agencia: " + this.nombreAgencia(this.w.idAgencia) + " con un total avaluo de: " + totalAvaluo)){
      this.dev.noEnviarTevcol(this.selection.selected.map(p=>{ return {codigoOperacion: p.numeroOperacion, cedulaCliente: p.identificacion}})).subscribe(t=>{
        
        this.buscarBoton();
      });
    }
  }

  buscarBoton(pageIndex?, pageSize?){
    this.selection.clear();
    if(pageIndex != null){
      this.p.size = pageSize;
      this.p.pageNumber = pageIndex;
    }else{
      this.p.size = 100;
      this.paginator.pageSize =100;
      this.paginator.pageIndex=0;
      this.p.pageNumber = 0;
    }
    this.w = {} as WrapperBusqueda;
    this.w.numeroPagina = !pageIndex ? 1 :pageIndex + 1;
    this.w.tamanioPagina = this.p.size;
    
    this.paginator.pageSize = this.w.tamanioPagina         
    this.w.idAgencia = localStorage.getItem('idAgencia');
    this.w.codigoEstadoProceso="PEC";
    this.w.codigoEstadoUbicacion="CUS";
    this.sof.buscarCreditoEstado(this.w).subscribe((data: any) => {
      if (data.operaciones != null) {
        this.dataSource = new MatTableDataSource<any>(data.operaciones);
        this.totalResults = data.numeroTotalRegistros;
        this.operaciones = data.operaciones;
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
        this.cargardatos.next(false);
      } else {
        this.cargardatos.next(false);
        this.initiateTablePaginator();
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }
    );
  }
  public limpiarFiltros(){
    Object.keys(this.formCliente.controls).forEach((name) => {
      const control = this.formCliente.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.buscarBoton();
  }
  calcularTiempo( ms ){
    var duration = moment.duration(ms);
    if (duration.asHours() > 1) {
      return Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");
    } else {
      return moment.utc(duration.asMilliseconds()).format("mm:ss");
    }
  }

  calcularTotales(xd){
    const datos = this.dataSource.data;
    if(datos.length >0 ){
      return datos.map(t=>t[xd]).reduce((r, n) =>r+n,0);
    }
  }

  nombreAgencia(element){
    //console.log("rubrosss ==>> ",element,this.catRubros)
    if(element && this.catAgencia){
      const c = this.catAgencia.find(p=>p.id==element);
      return c?c.nombre:'';
    }
    return '';
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}