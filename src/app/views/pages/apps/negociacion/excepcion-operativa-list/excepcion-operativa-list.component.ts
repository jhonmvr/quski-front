import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../../../app/core/model/page';
import { ExcepcionOperativaService } from '../../../../../../app/core/services/quski/excepcion-operativa.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { LocalStorage } from '@ng-idle/core';

@Component({
  selector: 'kt-excepcion-operativa-list',
  templateUrl: './excepcion-operativa-list.component.html',
  styleUrls: ['./excepcion-operativa-list.component.scss']
})
export class ExcepcionOperativaListComponent implements OnInit {

  results: any;
  error: string;
  p: Page = new Page();
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Accion', 'codigo', 'codigoOperacion', 'tipoExcepcion', 'nivelAprobacion', 'estadoExcepcion', 'montoInvolucrado', 'usuarioSolicitante', 'fechaSolicitud', 'fechaRespuesta', 'observacionAsesor', 'observacionAprobador', 'usuarioAprobador'];
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
  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private excepcionOperativaService: ExcepcionOperativaService) {
    this.excepcionOperativaService.setParameter();
  }

  ngOnInit(): void {
    this.excepcionOperativaService.setParameter();
    this.p.isPaginated = "Y";
    this.p.pageSize = 10;
    this.p.currentPage = 0;
    this.loadExcepciones();
  }

  loadExcepciones(usuario?: string, estado?: string, codigo?: string, codigoOperacion?: string, idNegociacion?: string) {
    if (this.paginator) {
      this.p.currentPage = this.paginator.pageIndex;
      this.p.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    }

    this.excepcionOperativaService.findAllByParams(this.p, localStorage.getItem('reUser'), estado, codigo, codigoOperacion, idNegociacion).subscribe({
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
