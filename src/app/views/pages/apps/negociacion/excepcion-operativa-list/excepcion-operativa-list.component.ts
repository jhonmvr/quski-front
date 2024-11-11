import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../../../app/core/model/page';
import { ExcepcionOperativaService } from '../../../../../../app/core/services/quski/excepcion-operativa.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { LocalStorage } from '@ng-idle/core';
import { AprobadorExcepcionOperativaComponent } from './aprobador-excepcion-operativa/aprobador-excepcion-operativa.component';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = ['Accion','tipoExcepcion','nivelAprobacion','montoInvolucrado','fechaSolicitud','nombreCliente','identificacion','usuarioSolicitante','numeroOperacion','codigoOperacion','observacionAsesor'];
  public formFiltro: FormGroup = new FormGroup({});
  public cedula = new FormControl('');

  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private excepcionOperativaService: ExcepcionOperativaService,public dialog: MatDialog, private router: Router) {
    this.excepcionOperativaService.setParameter();
    this.loadExcepciones();
  }

  ngOnInit(): void {
    this.excepcionOperativaService.setParameter();
    this.p.isPaginated = "Y";
    this.p.pageSize = 10;
    this.p.currentPage = 0;
    this.loadExcepciones();
  }

  loadExcepciones(cedula?: string) {

    this.excepcionOperativaService.findAllByParamsWithClient(cedula).subscribe({
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

  verDetalle(element:any){
    if(element.nivelAprobacion == 1){
      this.router.navigate(['negociacion/excepcion-operativa/list/aprobadorFabrica/',element.id]);
    }else{
      this.router.navigate(['negociacion/excepcion-operativa/list/aprobador/',element.id]);
    }
    
  }
}
