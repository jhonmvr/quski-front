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
import { environment } from '../../../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'kt-aprobacion-cancelacion',
  templateUrl: './aprobacion-cancelacion.component.html',
  styleUrls: ['./aprobacion-cancelacion.component.scss']
})
export class AprobacionCancelacionComponent implements OnInit {
  public formCreditoNuevo: FormGroup = new FormGroup({});
  public numeroOperacion = new FormControl('');
  public procesoDev = new FormControl('');
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
  public fechaSolicitud = new FormControl('');
  public fechaAprobacion = new FormControl('');
  public fechaArribo = new FormControl('');
  public fechaRecepcionAgencia = new FormControl('');
  public item: any;
  private usuario: string;
  private agencia: string;
  public wrapperSoft: any;
  public wrapperDevolucion: { proceso: TbQoProceso, devolucion: TbQoDevolucion }
  public catGenero: Array<any>;
  public catEstadoCivil: Array<any>;
  public catEducacion: Array<any>;
  public catPais: Array<any>;
  public catTipoCliente: Array<any>;
  public catAgencia: Array<any>;
  public catDivision: Array<any>;
  public dataSourceDetalle: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumnsDetalle = ['fechaAprobacion', 'fechaVencimiento', 'monto'];
  public dataSourceHeredero: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumnsHeredero = ['cedula', 'nombre'];
  titulo: string;
  @ViewChild('stepper', { static: true }) stepper: MatStepper;

  constructor(
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private par: ParametroService,
    private dev: DevolucionService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();
    this.formCreditoNuevo.addControl("numeroOperacion", this.numeroOperacion);
    this.formCreditoNuevo.addControl("procesoDev", this.procesoDev);
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

    this.formCreditoNuevo.addControl("fechaSolicitud", this.fechaSolicitud);
    this.formCreditoNuevo.addControl("fechaAprobacion", this.fechaAprobacion);
    this.formCreditoNuevo.addControl("fechaArribo", this.fechaArribo);
    this.formCreditoNuevo.addControl("fechaRecepcionAgencia", this.fechaRecepcionAgencia);

  }
  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();
    this.cargarCatalogos();
    this.inicioFlujo();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem('idAgencia');
  }

  public regresar() {
    this.router.navigate(['aprobador/bandeja-aprobador']);
  }
  private decodeObjetoDatos(entrada) {
    return JSON.parse(atob(entrada))
  }
  private inicioFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.item) {
        this.item = json.params.item;
        this.dev.buscarProcesoCancelacion(this.item).subscribe((data: any) => {
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
  private cargarCampos() {
    this.formCreditoNuevo.disable();
    this.titulo = 'APROBACION DE ANULACION DE DEVOLUCION: ' + this.wrapperDevolucion.devolucion.codigo;
    this.numeroOperacion.setValue(this.wrapperDevolucion.devolucion.codigoOperacion);
    this.procesoDev.setValue(this.wrapperDevolucion.proceso.estadoProceso.replace(/_/gi, " "));
    this.nombresCompletos.setValue(this.wrapperDevolucion.devolucion.nombreCliente);
    this.cedulaCliente.setValue(this.wrapperDevolucion.devolucion.cedulaCliente);
    this.nivelEducacion.setValue(this.wrapperDevolucion.devolucion.nivelEducacion);
    this.genero.setValue(this.wrapperDevolucion.devolucion.genero);
    this.estadoCivil.setValue(this.wrapperDevolucion.devolucion.estadoCivil);
    this.fechaNacimiento.setValue(this.wrapperDevolucion.devolucion.fechaNacimiento);
    this.nacionalidad.setValue(this.wrapperDevolucion.devolucion.nacionalidad);
    this.lugarNacimiento.setValue(this.wrapperDevolucion.devolucion.lugarNacimiento);
    this.onChangeFechaNacimiento();
    this.tipoCliente.setValue(this.wrapperDevolucion.devolucion.tipoCliente);
    this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
    this.agenciaEntrega.setValue(this.wrapperDevolucion.devolucion.agenciaEntrega);
    this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);
    let objetoHeredero = this.decodeObjetoDatos(this.wrapperDevolucion.devolucion.codeHerederos);
    this.dataSourceHeredero = new MatTableDataSource<any>(objetoHeredero.heredero);
    this.nombreApoderado.setValue(this.wrapperDevolucion.devolucion.nombreApoderado);
    this.cedulaApoderado.setValue(this.wrapperDevolucion.devolucion.cedulaApoderado);
    this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
    this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);
    this.agenciaEntrega.setValue(this.wrapperDevolucion.devolucion.agenciaEntrega);
    this.tipoCliente.setValue(this.catTipoCliente.find(x => x.codigo == this.wrapperDevolucion.devolucion.tipoCliente));
    let objetoCredito = this.decodeObjetoDatos(this.wrapperDevolucion.devolucion.codeDetalleCredito);
    console.log('CODE DE CREDITO =>', this.decodeObjetoDatos(this.wrapperDevolucion.devolucion.codeDetalleCredito));
    this.dataSourceDetalle = new MatTableDataSource<any>(objetoCredito);
    this.fechaSolicitud.setValue(this.wrapperDevolucion.devolucion.fechaCreacion ? this.wrapperDevolucion.devolucion.fechaCreacion : 'No Aplica')
    this.fechaAprobacion.setValue(this.wrapperDevolucion.devolucion.fechaAprobacionSolicitud ? this.wrapperDevolucion.devolucion.fechaAprobacionSolicitud : 'No Aplica')
    this.fechaArribo.setValue(this.wrapperDevolucion.devolucion.fechaArribo ? this.wrapperDevolucion.devolucion.fechaArribo : 'No Aplica')
    this.fechaRecepcionAgencia.setValue(this.wrapperDevolucion.devolucion.fechaEfectiva ? this.wrapperDevolucion.devolucion.fechaEfectiva : 'No Aplica')
    this.sinNoticeService.setNotice('CREDITO CARGADO CORRECTAMENTE', 'success');
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
      this.router.navigate(['negociacion/bandeja-operaciones']);
    });
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
  
  public enviarRespuesta(aprobado) {
    let mensaje = aprobado ? 'Aprobar la solicitud de devolucion garantia para el proceso: ' + this.wrapperDevolucion.devolucion.codigo + '.' :
      'Negar la solicitud de devolucion garantia para el proceso: ' + this.wrapperDevolucion.devolucion.codigo + '.';
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        if( aprobado ){
          this.dev.aprobarCancelacionSolicitudDevolucion(this.item).subscribe((data: any) => {
            if (data.entidad) {
              this.sinNoticeService.setNotice("SE HA CANCELADO CORRECTAMENTE LA DEVOLUCION: " + this.wrapperDevolucion.devolucion.codigo, "success");
              this.router.navigate(['aprobador/bandeja-aprobador']);
            }
          }, error =>{
            this.sinNoticeService.setNotice(error.error.codError, 'warning')
          });
        }else{
          this.dev.rechazarCancelacionSolicitudDevolucion(this.item).subscribe((data: any) => {
            if (data.entidad) {
              this.sinNoticeService.setNotice("SE HA CANCELADO CORRRECTAMENTE LA DEVOLUCION: "+ this.wrapperDevolucion.devolucion.codigo, "success")
              this.router.navigate(['aprobador/bandeja-aprobador']);
            } 
          }, error =>{
            this.sinNoticeService.setNotice(error.error.msgError, "error")
          });
        }
      } else {
        this.sinNoticeService.setNotice("SE CANCELO LA ACCION", 'warning');
      }
    });
  }
} 
