import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Page } from '../../../../../core/model/page';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';

@Component({
  selector: 'kt-lista-pendientes',
  templateUrl: './lista-pendientes.component.html',
  styleUrls: ['./lista-pendientes.component.scss']
})
export class ListaPendientesComponent implements OnInit {
  //public formFiltros: FormGroup = new FormGroup({});
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  selection = new SelectionModel<any>(true, []);
 
  idReferenciaHab:string="1";

  codigoOperacion = new FormControl('', []);



  displayedColumns = ['accion', 'fechaSolicitud', 'codigoOperacionMadre', 'codigoOperacion',
   'nombreCliente', 'identificacion', 'fundaMadre' , 'fundaActual', 'ciudadTevcol' ,  'fechaArriboAgencia',  'fechaAprobacion', 'valorAvaluo', 'pesoBruto'];
  /**Obligatorio paginacion */
  p = new Page();
  dataSource:MatTableDataSource<TbQoCliente>=new MatTableDataSource<TbQoCliente>();
  @ViewChild(MatPaginator, { static: true }) 
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', {static: true}) sort: MatSort;
  
  

  constructor(public ds: DevolucionService,
    
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private noticeService:ReNoticeService,
		public dialog: MatDialog) {
     
     }

  ngOnInit() {
  
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Pendiente de arribo');
    this.initiateTablePaginator();
    this.buscar();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      console.log("sort changed "  );
      this.initiateTablePaginator();
      this.buscar();
    });
    
  }

  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }

   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string,pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    //console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }

  
   /**
   * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
   */
  paged() {
  this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',this.paginator.pageIndex)
  this.submit();
  }

  
   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  buscar() {
    
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',0);
    this.submit();
  }


  submit() {

    this.loadingSubject.next(true);
    this.dataSource = null;
    this.ds.busquedaArribo(this.p, this.codigoOperacion.value == null? "": this.codigoOperacion.value).subscribe((data:any)=>{
      if(data){
        console.log(data.list)
        this.paginator.length = data.totalResults;
        this.dataSource=new MatTableDataSource<any>(data.list);
        this.loadingSubject.next(false);
      }
    })
  }





isCheck(row): boolean {
  if (this.selection.selected.find(c => c.id == row.id)) {
    return true;
  } else {
    return false;
  }
}

addRemove(row) {
  if (this.selection.isSelected(row.id)) {
    this.selection.deselect(row.id);
    console.log(row.id)
  } else {
    this.selection.select(row.id);
  }
}

eliminarSelect() {
  this.selection.clear();
}

confirmarArribo(){
  if( this.selection && this.selection.selected && this.selection.selected.length>0 ){
    let listFundaPeso =[];
    let listIdDevolucion = [];
    console.log("seleccion" ,this.selection.selected[0])
    console.log(typeof( this.selection.selected))
    let fundaPeso = {
      "funda" : "",
      "peso" : ""
    }
 
    this.selection
    this.selection.selected.forEach(x=> listFundaPeso.push( "\n Funda: " + x.fundaActual + "      peso: " + x.pesoBruto.toFixed(2).toString().padStart(13, " ") ))
    this.selection.selected.forEach(x=> listIdDevolucion.push(x.id))
    console.log(this.selection.selected[0])
     if (confirm('Usted confirma la recepción de las fundas:  ' + listFundaPeso  )) {
      this.ds.registrarArribo(listIdDevolucion).subscribe((data:any)=>{
        if(data){
          console.log(data)
          this.noticeService.setNotice("Se ha registrado exitosamente" , "success")
          this.eliminarSelect();
          this.buscar();
        } else {
          this.eliminarSelect();
          this.buscar();
          this.noticeService.setNotice("Error al registrar" , "error")
        } 
      
      })
   // }
}


 
  


}
}
}