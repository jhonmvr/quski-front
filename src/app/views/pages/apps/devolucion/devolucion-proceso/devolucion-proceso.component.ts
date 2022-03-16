import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OperacionesProcesoWrapper } from '../../../../../../app/core/model/wrapper/OperacionesProcesoWrapper';
import { ParametroService } from '../../../../../../app/core/services/quski/parametro.service';
import { ReasignarUsuarioComponent } from '../../../../../../app/views/partials/custom/popups/reasignar-usuario/reasignar-usuario.component';
import { environment } from '../../../../../../environments/environment';
import { Page } from '../../../../../../app/core/model/page';
import { DevolucionService } from '../../../../../../app/core/services/quski/devolucion.service';
import { ProcesoService } from '../../../../../../app/core/services/quski/proceso.service';
import { SoftbankService } from '../../../../../../app/core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../../app/core/services/re-notice.service';

@Component({
  selector: 'kt-devolucion-proceso',
  templateUrl: './devolucion-proceso.component.html',
  styleUrls: ['./devolucion-proceso.component.scss']
})
export class DevolucionProcesoComponent implements OnInit {
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
  nombreCliente = new FormControl('',[]);
  identificacionCliente = new FormControl('',[]);
  catAgencia:Array<any>;
  catEstadoProceso;
  catRolReasignacion;
  usuario;
  rol;
  dataSource;
  idAgencia;
  constructor(private sinNoticeService: ReNoticeService,
    public sof: SoftbankService,
    private pro: ProcesoService,
    private par: ParametroService,
    private router: Router,
    private dialog: MatDialog,
    public dev: DevolucionService) {
      this.dev.setParameter();
      this.sof.setParameter();
     }

  ngOnInit() {
    this.dev.setParameter();
    this.sof.setParameter();
    this.rol = localStorage.getItem( 're1001' );
    this.idAgencia = localStorage.getItem( 'idAgencia' );

    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.sof.consultarAgenciasCS().subscribe(cat=>{
      this.catAgencia = cat.catalogo;
    });
    this.pro.getEstadosProceso(["DEVOLUCION"]).subscribe( (dataEstado: any) =>{
      this.catEstadoProceso = dataEstado.entidades ? dataEstado.entidades : [];
    });
    this.par.findByTipo('PERFIL-REASIG').subscribe( (data: any) =>{
      this.catRolReasignacion = data.entidades ? data.entidades : null;
     
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

    this.dev.procesoEntrega(this.p, {
      codigoOperacion : this.codigoOperacion.value,
      codigoBpm : this.codigoBpm.value,
      estados : this.estado.value?this.estado.value:null,
      agenciaEntrega : this.agenciaEntrega.value,
      agenciaRecepcion : this.agenciaRecepcion.value,
      fechaCreacionDesde : this.fechaCreacionDesde.value,
      fechaCreacionHasta : this.fechaCreacionHasta.value,
      fechaArriboDesde : this.fechaArriboDesde.value,
      fechaArriboHasta : this.fechaArriboHasta.value,
      fechaEntregaDesde : this.fechaEntregaDesde.value,
      fechaEntregaHasta : this.fechaEntregaHasta.value,
      nombreCliente : this.nombreCliente.value,
      identificacionCliente : this.identificacionCliente.value
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
        codigoOperacion : this.codigoOperacion.value,
        codigoBpm : this.codigoBpm.value,
        estado : this.estado.value,
        agenciaEntrega : this.agenciaEntrega.value,
        agenciaRecepcion : this.agenciaRecepcion.value,
        fechaCreacionDesde : this.fechaCreacionDesde.value,
        fechaCreacionHasta : this.fechaCreacionHasta.value,
        fechaArriboDesde : this.fechaArriboDesde.value,
        fechaArriboHasta : this.fechaArriboHasta.value,
        fechaEntregaDesde : this.fechaEntregaDesde.value,
        fechaEntregaHasta : this.fechaEntregaHasta.value
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

  public verDetalle(row: OperacionesProcesoWrapper ){
    if(row.id != null){
      if(row.proceso == 'NUEVO'){
        this.router.navigate(['negociacion/detalle-negociacion/', row.id]);       
      }else if(row.proceso == 'RENOVACION'){
        this.router.navigate(['negociacion/detalle-negociacion/', row.id]);      
      }else if(row.proceso == 'DEVOLUCION'){
        this.router.navigate(['devolucion/detalle-devolucion/',row.id]);
      }else if(row.proceso == 'PAGO' && row.codigoOperacion){
        this.router.navigate(['negociacion/pago/detalle-pago/',row.id]);
      }else if(row.proceso == 'PAGO' && !row.codigoOperacion){
        this.router.navigate(['negociacion/pago/detalle-bloqueo/',row.id]);
      }
   
    }
  }
  public cancelarDevolucion(row: OperacionesProcesoWrapper ){
    if(row.id != null){
        this.router.navigate(['devolucion/cancelacion-solicitud/', row.id]);       
    }
  }
  public verOperacion(row: OperacionesProcesoWrapper ){
    if(row.id != null){
      if(row.proceso == 'NUEVO'){
        this.router.navigate(['negociacion/gestion-negociacion/NEG/',row.id]);    
      }else if(row.proceso == 'RENOVACION'){
        this.router.navigate(['negociacion/crear-novacion/NOV/', row.id]);
      }else if(row.proceso == 'DEVOLUCION' && row.estadoProceso == 'ARRIBADO'){
        this.router.navigate(['devolucion/entrega-recepcion/',row.id]);
      }else if(row.proceso == 'DEVOLUCION' && row.estadoProceso == 'CREADO' ){
        this.router.navigate(['devolucion/solicitud-devolucion/EDIT/',row.id]);
      }
    }
  }

  verTraking(row){
    this.router.navigate(['tracking/list-tracking/',row.codigoBpm]);
  }
  public reasignar(row: OperacionesProcesoWrapper ){
    const dialogRefGuardar = this.dialog.open(ReasignarUsuarioComponent, {
      width: '500px',
      maxHeight:'700px',
      data: row
    });
    dialogRefGuardar.afterClosed().subscribe((result: true) => {
      if (result) {
        this.sinNoticeService.setNotice('USUARIO REASIGNADO PARA '+ row.codigoOperacion, 'success');
        this.buscarBoton();
      } else {
        this.sinNoticeService.setNotice('SE CANCELÓ LA REASIGNACIÓN DE LA OPERACIÓN', 'error');
      }
    });
    
  }
  public validarReasignacion( element ){
    if(element.estadoProceso != 'APROBADO' && element.estadoProceso != 'RECHAZADO' && element.estadoProceso != 'CANCELADO' && element.estadoProceso != 'CADUCADO'){
      if( element.asesor == this.usuario ){
        return true;
      }
      if( this.catRolReasignacion ){
        if( this.catRolReasignacion.find( x => x.valor == this.rol ) ){
          return true;
        }
      }
    }
    return false;
  }

  allSelecEstados(all) {
    if (all.selected) {
      this.estado
        .patchValue([...this.catEstadoProceso.map(item => item), 0]);
    } else {
      this.estado.patchValue([]);
    }
  }

}
