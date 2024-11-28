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
  displayedColumns: string[] = ['Accion','codigoOperacion','fechaSolicitud', 'nombreCompleto', 'identificacionCliente', 'usuarioSolicitante', 'usuarioAprobador', 'numeroOperacion'];


  public formFiltro: FormGroup = new FormGroup({});
  public cedula = new FormControl('');

  public estadoRegularizacion = 'PENDIENTE_APROBACION';
  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private regularizacionDocumentosService: RegularizacionDocumentosService, public dialog: MatDialog, private router: Router) {
    this.regularizacionDocumentosService.setParameter();
  }

  ngOnInit(): void {
    this.regularizacionDocumentosService.setParameter();
    this.p.isPaginated = "Y";
    this.p.pageSize = 10;
    this.p.currentPage = 0;
    if (localStorage.getItem(environment.rolKey) == '4') {
      //this.estadoRegularizacion = 'PENDIENTE';
    }
    this.loadExcepciones(null);
  }

  loadExcepciones(cedula?: string) {
    this.regularizacionDocumentosService.findAllByParamsWithClient(cedula).subscribe({
      next: (data) => {
        if (data) {
          this.dataSource.data = data;
        } else {
          this.dataSource.data = null;
        }
      },
      error: (err) => this.error = 'Error fetching data'
    });
  }

  verDetalle(element: any) {
    if (element.estadoRegularizacion == 'PENDIENTE') {
      this.router.navigate(['negociacion/regularizacion-documentos/list/detalle/', element.id]);
    } else if (element.estadoRegularizacion == 'PENDIENTE_APROBACION') {
      this.router.navigate(['negociacion/regularizacion-documentos/list/aprobador/', element.id]);
    }

  }
}
