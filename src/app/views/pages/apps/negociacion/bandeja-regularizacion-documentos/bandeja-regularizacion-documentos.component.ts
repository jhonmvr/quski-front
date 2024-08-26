import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Page } from '../../../../../../app/core/model/page';
import { RegularizacionDocumentosService } from '../../../../../../app/core/services/quski/regularizacion-documentos.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'kt-bandeja-regularizacion-documentos',
  templateUrl: './bandeja-regularizacion-documentos.component.html',
  styleUrls: ['./bandeja-regularizacion-documentos.component.scss']
})
export class BandejaRegularizacionDocumentosComponent implements OnInit {

  results: any;
  error: string;
  p: Page = new Page();
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Accion', 'codigo', 'codigoOperacion', 'tipoExcepcion',  'usuarioSolicitante', 'fechaSolicitud'];
  public formFiltro: FormGroup = new FormGroup({});
  public codigo = new FormControl('');
  public idNegociacion = new FormControl('');
  public proceso = new FormControl('');
  public fechaCreacionDesde = new FormControl('');
  public fechaCreacionHasta = new FormControl('');
  public estado = new FormControl('');
  public actividad = new FormControl('');
  public codigoBpm = new FormControl('');
  public codigoSoft = new FormControl('');
  public agencia = new FormControl('');
  asesor = new FormControl('');
  public estadoRegularizacion = 'PENDIENTE';
  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private regularizacionDocumentosService: RegularizacionDocumentosService,public dialog: MatDialog, private router: Router) {
    this.regularizacionDocumentosService.setParameter();
  }

  ngOnInit(): void {
    this.regularizacionDocumentosService.setParameter();
    this.p.isPaginated = "Y";
    this.p.pageSize = 10;
    this.p.currentPage = 0;
    if(localStorage.getItem(environment.rolKey) == '4'){
      this.estadoRegularizacion = 'PENDIENTE_APROBACION';
    }
    this.loadExcepciones(null,'PENDIENTE');
  }

  loadExcepciones(usuario?: string, estado?: string, codigo?: string, codigoOperacion?: string, idNegociacion?: string) {
    if (this.paginator) {
      this.p.currentPage = this.paginator.pageIndex;
      this.p.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }

    this.regularizacionDocumentosService.findAllByParams(this.p, null, estado, codigo, codigoOperacion, idNegociacion).subscribe({
      next: (data) => {
        if (data) {
          this.dataSource.data = data.list;
          this.paginator.length = data.totalResults;
        } else {
          this.dataSource.data = null;
          this.paginator.length = 0;
        }
      },
      error: (err) => this.error = 'Error fetching data'
    });
  }

  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  limpiarFiltros() {

  }

  verDetalle(element:any){
    if(element.estadoRegularizacion == 'PENDIENTE'){
      this.router.navigate(['negociacion/regularizacion-documentos/list/detalle/',element.id]);
    }else if(element.estadoRegularizacion == 'PENDIENTE_APROBACION'){
      this.router.navigate(['negociacion/regularizacion-documentos/list/aprobador/',element.id]);
    }
    
  }

  public getErrorMessage(pfield: string) {
    const errorNumero = 'Ingresar solo numeros';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';


    if (pfield && pfield === "identificacion") {
      const input = this.formFiltro.get("identificacion");
      return input.hasError("pattern") ? errorNumero :
        input.hasError("invalid-identification") ? invalidIdentification :
          input.hasError("maxlength") ? errorLogitudExedida :
            input.hasError("minlength") ? errorInsuficiente :
              "";
    }
  }
}
