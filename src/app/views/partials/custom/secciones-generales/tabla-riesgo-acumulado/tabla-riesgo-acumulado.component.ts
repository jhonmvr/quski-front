import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Page } from '../../../../../core/model/page';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { BehaviorSubject } from 'rxjs';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { RiesgoAcumuladoService } from '../../../../../core/services/quski/riesgoAcumulado.service';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';

@Component({
  selector: 'kt-tabla-riesgo-acumulado',
  templateUrl: './tabla-riesgo-acumulado.component.html',
  styleUrls: ['./tabla-riesgo-acumulado.component.scss']
})
export class TablaRiesgoAcumuladoComponent implements OnInit {
  @Input() dataPopupRiesgo: DataPopup;
  // INPUT BUSQUEDA CORE
  @Input() idCliente: number = null;
  @Input() isPaged: boolean = false;
  // INPUT BUSQUEDA SOFTBANK
  @Input() cedula: string = null;
  // INPUT GENERAL
  @Input() isGuardar: boolean = false;

  /**Obligatorio paginacion */
  public p: Page = new Page();
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  total: string;


  @Output() list: EventEmitter<Array<TbQoRiesgoAcumulado>> = new EventEmitter<Array<TbQoRiesgoAcumulado>>();
  // ENTIDADES  
  private entidadesRiesgo: Array<TbQoRiesgoAcumulado>;

  // VARIABLES STANDARS  
  private mensaje = "ERROR AL CARGAR RIESGO ACUMULADO";
  public loading;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // TABLA DE CREDITO
  displayedColumnsRiesgoAcumulado = ['codigoCarteraQuski', 'diasMoraActual', 'estadoOperacion', 'estadoPrimeraCuotaVigente', 'fechaEfectiva', 'fechaVencimiento', 'interesMora', 'nombreProducto', 'numeroCuotasFaltantes', 'numeroCuotasTotales', 'primeraCuotaVigente', 'referencia', 'valorAlDia', 'valorCancelaPrestamo', 'saldo'];
  dataSourceRiesgoAcumulado = new MatTableDataSource<TbQoRiesgoAcumulado>();
  constructor(
    private sof: SoftbankService,
    private cli: ClienteService,
    private rie: RiesgoAcumuladoService,
    private siN: ReNoticeService
  ) { }

  ngOnInit() {
    this.loading = this.loadingSubject.asObservable();
    if (this.idCliente != null && this.cedula == null) {
      this.initiateTablePaginator();
      this.busquedaCore();
    } else {
      if (this.cedula != null && this.idCliente == null) {
        this.busquedaSoftbank();
      }
    }
  }
  public busquedaCore() {
    if (this.idCliente != null) {
      this.loadingSubject.next(true);
      this.rie.findRiesgoAcumuladoByIdCliente(this.p, this.idCliente).subscribe((data: any) => {
        if (!data.list != null) {
          this.entidadesRiesgo = data.list;
          this.dataSourceRiesgoAcumulado.data = this.entidadesRiesgo;
          this.enviarAlPadre(this.entidadesRiesgo);
          this.loadingSubject.next(false);
          if (this.isGuardar) {
            this.guardarCore(this.entidadesRiesgo);
          }
        } else {
          this.loadingSubject.next(false);
          this.siN.setNotice("NO EXISTEN RIESGOS ACUMULADOS REGISTRADOS PARA ESTE CLIENTE", 'error');
        }
      }, error => {
        this.loadingSubject.next(false);
        if (JSON.stringify(error).indexOf("codError") > 0) {
          let b = error.error;
          this.siN.setNotice(b.msgError, 'error');
        } else {
          this.siN.setNotice('ERROR DESCONOCIDO', 'error');
        }
      });
    }
  }
  public busquedaSoftbank() {
    if (this.cedula != "") {
      this.loadingSubject.next(true);
      const consulta = new ConsultaCliente()
      consulta.identificacion = this.cedula;
      this.sof.consultaRiesgoAcumuladoCS(consulta).subscribe((data: any) => {
        if (!data.existeError && data.operaciones != null) {
          this.entidadesRiesgo = data.operaciones;
          this.entidadesRiesgo.forEach(e => {
            e.idSoftbank = e.id;
            e.id = null;

          });
          this.dataSourceRiesgoAcumulado.data = this.entidadesRiesgo;
          this.enviarAlPadre(this.entidadesRiesgo);
          this.loadingSubject.next(false);
          if (this.isGuardar) {
            this.guardarCore(this.entidadesRiesgo);
          }
        } else {
          this.mensaje += " existeError: " + data.mensaje;
          this.siN.setNotice(this.mensaje, 'error');
          this.loadingSubject.next(false);
        }
      }, error => {
        this.loadingSubject.next(false);
        if (JSON.stringify(error).indexOf("codError") > 0) {
          let b = error.error;
          this.siN.setNotice(b.msgError, 'error');
        } else {
          this.siN.setNotice('ERROR AL CARGAR CLIENTE 2', 'error');
        }
      });
    }
  }
  private guardarCore(guardarCore: Array<TbQoRiesgoAcumulado>) {
    this.loadingSubject.next(true);
    this.cli.findClienteByIdentificacion(this.cedula).subscribe((data: any) => {
      if (data.entidad) {
        guardarCore.forEach(e => {
          e.tbQoCliente = new TbQoCliente();
          e.tbQoCliente.id = data.entidad.id;

        });
        this.rie.persistEntities(guardarCore).subscribe((data: any) => {
          if (data.entidades != null) {
            console.log("Data guardada en base ---> ", data.entidades);
            this.loadingSubject.next(false);
          } else {
            this.loadingSubject.next(false);
            this.siN.setNotice('ERROR AL GUARDAR RIESGOS ACUMULADOS', 'error');
          }
        }, error => {
          this.loadingSubject.next(false);
          if (JSON.stringify(error).indexOf("codError") > 0) {
            let b = error.error;
            this.siN.setNotice(b.msgError, 'error');
          } else {
            this.siN.setNotice('ERROR AL GUARDAR RIESGO ACUMULADO', 'error');
          }
        });
      } else {
        this.siN.setNotice('ERROR AL GUARDAR RIESGO ACUMULADO', 'error');

      }
    });

  }
  private enviarAlPadre(entidades: Array<TbQoRiesgoAcumulado>) {
    console.log(" Esto estoy enviando al padre -----> ", entidades);
    this.list.emit(entidades);
  }

  /**
  * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
  */
  initiateTablePaginator(): void {
    this.dataSourceRiesgoAcumulado = new MatTableDataSource<TbQoRiesgoAcumulado>();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSourceRiesgoAcumulado.paginator = this.paginator;
  }
  /**
  * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
  */
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string, pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    return p;
  }
  /**
  * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
  */
  paged() {
    this.initiateTablePaginator();
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', this.paginator.pageIndex)
    if (this.idCliente != null && this.cedula == null) {
      this.busquedaCore();
    } else {
      if (this.cedula != null && this.idCliente == null) {
        this.busquedaSoftbank();
      }
    }
  }
}