import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoDevolucion } from '../../../../../core/model/quski/TbQoDevolucion';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'kt-verificacion-firma',
  templateUrl: './verificacion-firma.component.html',
  styleUrls: ['./verificacion-firma.component.scss']
})
export class VerificacionFirmaComponent implements OnInit {
  public formCreditoNuevo: FormGroup = new FormGroup({});
  public numeroOperacion = new FormControl('');
  public estadoProceso = new FormControl('');
  public cedulaCliente = new FormControl('');
  public nombresCompletos = new FormControl('');
  public nivelEducacion = new FormControl('');
  public genero = new FormControl('');
  public estadoCivil = new FormControl('');
  public separacionBienes = new FormControl('');
  public fechaNacimiento = new FormControl('');
  public nacionalidad = new FormControl('');
  public lugarNacimiento = new FormControl('');
  public edad = new FormControl('');
  public tipoCliente = new FormControl('');
  public observaciones = new FormControl('');
  public agenciaEntrega = new FormControl('');
  public valorCustodia = new FormControl('');
  public cedulaApoderado = new FormControl('');
  public nombreApoderado = new FormControl('');
  public item: any;
  public titulo: any;
  public wrapperSoft: any;
  public wrapperDevolucion: { proceso: TbQoProceso, devolucion: TbQoDevolucion }
  public catGenero: Array<any>;
  public catEstadoCivil: Array<any>;
  public catEducacion: Array<any>;
  public catPais: Array<any>;
  public catTipoCliente: Array<any>;
  public catAgencia: Array<any>;
  public catDivision: Array<any>;
  public dataSourceDetalle = new MatTableDataSource<any>();
  public displayedColumnsDetalle = ['fechaAprobacion', 'fechaVencimiento', 'monto'];
  public dataSourceHeredero = new MatTableDataSource<any>();
  public displayedColumnsHeredero = ['cedula', 'nombre'];
  idReferencia
  @ViewChild('stepper', { static: true }) stepper: MatStepper;

  constructor(
    private cre: CreditoNegociacionService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog,
    private subheaderService: SubheaderService,
    private sof: SoftbankService,
    private par: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private dev: DevolucionService) {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();
    this.formCreditoNuevo.addControl("numeroOperacion", this.numeroOperacion);
    this.formCreditoNuevo.addControl("estadoProceso", this.estadoProceso);
    this.formCreditoNuevo.addControl("cedulaCliente", this.cedulaCliente);
    this.formCreditoNuevo.addControl("nombresCompletos", this.nombresCompletos);
    this.formCreditoNuevo.addControl("nivelEducacion", this.nivelEducacion);
    this.formCreditoNuevo.addControl("genero", this.genero);
    this.formCreditoNuevo.addControl("estadoCivil", this.estadoCivil);
    this.formCreditoNuevo.addControl("fechaNacimiento", this.fechaNacimiento);
    this.formCreditoNuevo.addControl("nacionalidad", this.nacionalidad);
    this.formCreditoNuevo.addControl("lugarNacimiento", this.lugarNacimiento);
    this.formCreditoNuevo.addControl("edad", this.edad);
    this.formCreditoNuevo.addControl("tipoCliente", this.tipoCliente);
    this.formCreditoNuevo.addControl("observaciones", this.observaciones);
    this.formCreditoNuevo.addControl("agenciaEntrega", this.agenciaEntrega);
    this.formCreditoNuevo.addControl("valorCustodia", this.valorCustodia);
    this.formCreditoNuevo.addControl("cedulaApoderado", this.cedulaApoderado);
    this.formCreditoNuevo.addControl("nombreApoderado", this.nombreApoderado);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();
    this.cargarCatalogos();
    this.inicioFlujo();
    this.subheaderService.setTitle('FLUJO DE DEVOLUCION');

  }
  private inicioFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.item) {
        this.item = json.params.item;
        this.dev.buscarProcesoDevolucion(this.item).subscribe((data: any) => {
          this.wrapperDevolucion = data.entidad;
          this.cre.traerCreditoVigente(this.wrapperDevolucion.devolucion.codigoOperacion).subscribe((data: any) => {
            if (data.entidad) {
              this.wrapperSoft = data.entidad;
              this.cargarCampos();
            } else {
              this.salirDeGestion("Error al intentar cargar el credito.");
            }
          });
        });
      }
    });
  }
  public regresar() {
    this.router.navigate(['aprobador/bandeja-aprobador']);
  }
  public onChangeFechaNacimiento() {
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    if (fechaSeleccionada) {
      const convertFechas = new RelativeDateAdapter();
      this.par.getDiffBetweenDateInicioActual(convertFechas.format(fechaSeleccionada, "input"), "dd/MM/yyy").subscribe((rDiff: any) => {
        const diff: YearMonthDay = rDiff.entidad;
        this.edad.setValue(diff.year);
        const edad = this.edad.value;
        if (edad != undefined && edad != null && edad < 18) {
          this.edad.get("edad").setErrors({ "server-error": "error" });
        }
      });
    } else {
      this.sinNoticeService.setNotice("El valor de la fecha es nulo", "warning");
    }
  }
  private cargarCatalogos() {
    this.sof.consultarAgenciasCS().subscribe((data: any) => {
      this.catAgencia = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarTipoClienteCS().subscribe((data: any) => {
      let tipoCliente = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.catTipoCliente = new Array<any>();
      this.catTipoCliente.push({ codigo: "HER", nombre: "HEREDERO" });
      this.catTipoCliente.push(tipoCliente.find(x => x.codigo == 'SAP'));
      this.catTipoCliente.push(tipoCliente.find(x => x.codigo == 'DEU'));
      console.log(' cat tipo cliente =>', this.catTipoCliente);
    });
    this.sof.consultarPaisCS().subscribe((data: any) => {
      this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarEducacionCS().subscribe((data: any) => {
      this.catEducacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarEstadosCivilesCS().subscribe((data: any) => {
      this.catEstadoCivil = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarGeneroCS().subscribe((data: any) => {
      this.catGenero = !data.existeError ? data.catalogo : "Error al cargar catalogo";
    });
    this.sof.consultarDivicionPoliticaCS().subscribe((data: any) => {
      if (!data.existeError) {
        this.catDivision = !data.existeError ? data.catalogo : { nombre: 'Error al cargar catalogo' };
      }
    });
  }
  private salirDeGestion(dataMensaje: string, dataTitulo?: string) {
    let pData = {
      mensaje: dataMensaje,
      titulo: dataTitulo ? dataTitulo : null
    }
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "800px",
      height: "auto",
      data: pData
    });
    dialogRef.afterClosed().subscribe(r => {
      this.router.navigate(['aprobador/bandeja-aprobador']);
    });
  }
  private cargarCampos() {
    console.log('Wrapper SOFTBANK => ', this.wrapperSoft);
    console.log('Wrapper PROCESO => ', this.wrapperDevolucion);
    this.titulo = "VERIFICACION DE FIRMAS DE DEVOLUCION: " + this.wrapperDevolucion.devolucion.codigo;
    this.formCreditoNuevo.disable();
    this.idReferencia = this.wrapperDevolucion.devolucion.id
    this.numeroOperacion.setValue(this.wrapperDevolucion.devolucion.codigoOperacion);
    this.estadoProceso.setValue(this.wrapperDevolucion.proceso.estadoProceso.replace(/_/gi, " "));
    this.nombresCompletos.setValue(this.wrapperDevolucion.devolucion.nombreCliente);
    this.cedulaCliente.setValue(this.wrapperDevolucion.devolucion.cedulaCliente);
    this.fechaNacimiento.setValue(this.wrapperDevolucion.devolucion.fechaNacimiento);

    this.nivelEducacion.setValue(this.cargarItem(this.catEducacion, this.wrapperDevolucion.devolucion.nivelEducacion, true).nombre);
    this.genero.setValue(this.cargarItem(this.catGenero, this.wrapperDevolucion.devolucion.genero, true).nombre);
    this.estadoCivil.setValue(this.cargarItem(this.catEstadoCivil, this.wrapperDevolucion.devolucion.estadoCivil, true).nombre);
    this.nacionalidad.setValue(this.cargarItem(this.catPais, this.wrapperDevolucion.devolucion.nacionalidad, false).nacionalidad);
    let itemParroquia = this.cargarItem(this.catDivision, this.wrapperDevolucion.devolucion.lugarNacimiento, false);
    let itemCanton = this.cargarItem(this.catDivision, itemParroquia.idPadre, false);
    let itemProvincia = this.cargarItem(this.catDivision, itemCanton.idPadre, false);
    this.lugarNacimiento.setValue((itemParroquia ? itemParroquia.nombre : '') + (itemCanton ? ' / ' + itemCanton.nombre : '') + (itemProvincia ? ' / ' + itemProvincia.nombre : ''));

    this.onChangeFechaNacimiento();
    this.tipoCliente.setValue(this.wrapperDevolucion.devolucion.tipoCliente);
    this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
    this.agenciaEntrega.setValue(this.wrapperDevolucion.devolucion.agenciaEntrega);
    this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);
    if (this.wrapperDevolucion) {
      let objetoHeredero = this.decodeObjetoDatos(this.wrapperDevolucion.devolucion.codeHerederos);
      console.log('Wrapper  => objetoHeredero', objetoHeredero.heredero);
      this.dataSourceHeredero = new MatTableDataSource<any>(objetoHeredero.heredero);
      this.nombreApoderado.setValue(this.wrapperDevolucion.devolucion.nombreApoderado);
      this.cedulaApoderado.setValue(this.wrapperDevolucion.devolucion.cedulaApoderado);
      this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
      this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);
      this.agenciaEntrega.setValue(this.wrapperDevolucion.devolucion.agenciaEntrega);
      this.tipoCliente.setValue(this.catTipoCliente.find(x => x.codigo == this.wrapperDevolucion.devolucion.tipoCliente));
      let objetoCredito = this.decodeObjetoDatos(this.wrapperDevolucion.devolucion.codeDetalleCredito);
      this.dataSourceDetalle = new MatTableDataSource<any>(objetoCredito);
    }
    this.sinNoticeService.setNotice('CREDITO CARGADO CORRECTAMENTE', 'success');
  }
  private cargarItem(catalogo, cod, index) {
    if (index && catalogo) {
      let item = catalogo.find(x => x.codigo == cod);
      if (catalogo && item) {
        return item;
      }
    } else if (!index && catalogo) {
      let item = catalogo.find(x => x.id == cod);
      if (catalogo && item) {
        return item;
      }
    }
  }
  private decodeObjetoDatos(entrada) {
    return JSON.parse(atob(entrada))
  }
  public enviarRespuesta(aprobar) {
    let mensaje = aprobar ? " Aprobar la verificacion de firmas del proceso: " + this.wrapperDevolucion.devolucion.codigo + '. ' :
      'Devolver la verificacion de firmas del proceso: ' + this.wrapperDevolucion.devolucion.codigo + '. ';
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r && aprobar) {
        this.dev.aprobarVerificacionFirmas(this.item).subscribe((data: any) => {
          this.sinNoticeService.setNotice(" SE APROBO LA VERIFICACION DE FIRMAS.", "success");
          this.router.navigate(['aprobador/bandeja-aprobador']);
        }, error => {
          this.sinNoticeService.setNotice(error.error.codError.replace(/_/gi, " "), 'warning');
        });
      } else if (r && !aprobar) {
        this.dev.rechazarVerificacionFirmas(this.item).subscribe((data: any) => {
          this.sinNoticeService.setNotice("SE RECHAZO LA VERIFICACION DE FIRMAS.", "success");
          this.router.navigate(['aprobador/bandeja-aprobador']);
        }, error => {
          this.sinNoticeService.setNotice(error.error.codError.replace(/_/gi, " "), 'warning');
        })
      } else {
        this.sinNoticeService.setNotice('SE CANCELO LA ACCION', 'warning');
      }
    });
  }
} 
