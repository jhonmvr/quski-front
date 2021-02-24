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
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kt-aprobacion-solicitud',
  templateUrl: './aprobacion-solicitud.component.html',
  styleUrls: ['./aprobacion-solicitud.component.scss']
})
export class AprobacionSolicitudComponent implements OnInit {
  public item: any;
  public wrapperSoft: any;
  public wrapperDevolucion: { proceso: TbQoProceso, devolucion: TbQoDevolucion }
  public catGenero: Array<any>;
  public catEstadoCivil: Array<any>;
  public catEducacion: Array<any>;
  public catPais: Array<any>;
  public catTipoCliente: Array<any>;
  public catAgencia: Array<any>;
  public catDivision: Array<any>;


  public formCreditoNuevo: FormGroup = new FormGroup({});
  public numeroOperacion = new FormControl('');
  public proceso = new FormControl('');


  //datos cliente
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

  //GESTION DEVOLUCION
  public tipoCliente = new FormControl('');
  public observaciones = new FormControl('');
  public agenciaEntrega = new FormControl('');
  public valorCustodia = new FormControl('');
  public cedulaHeredero = new FormControl('');
  public nombreHeredero = new FormControl('');


  //observables
  objetoCredito = {
    "fechaAprobacion": "",
    "fechaVencimiento": "",
    "monto": ""
  }




  displayedColumnsHeredero = ['cedula', 'nombre']
  displayedColumnsCredito = ['fechaAprobacion', 'fechaVencimiento', 'monto']
  dataSourceContrato = new MatTableDataSource;
  dataSourceHeredero = new MatTableDataSource;
  @ViewChild('stepper', { static: true }) stepper: MatStepper;

  constructor(
    private cre: CreditoNegociacionService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog,
    private sof: SoftbankService,
    private par: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private dev: DevolucionService) {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();

  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();
    this.cargarCatalogos();
    this.inicioFlujo();
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
  private validacion() {
  }
  private cargarCampos() {
    this.validacion();
    console.log('Wrapper SOFTBANK => ', this.wrapperSoft);
    console.log('Wrapper PROCESO => ', this.wrapperDevolucion);
    this.numeroOperacion.setValue( this.wrapperDevolucion.devolucion.codigoOperacion);
    this.proceso.setValue( this.wrapperDevolucion.proceso.proceso );
    this.nombresCompletos.setValue( this.wrapperDevolucion.devolucion.nombreCliente );
    this.cedulaCliente.setValue( this.wrapperDevolucion.devolucion.cedulaCliente );
    this.nivelEducacion.setValue( this.wrapperDevolucion.devolucion.nivelEducacion);
    this.genero.setValue( this.wrapperDevolucion.devolucion.genero );
    this.estadoCivil.setValue( this.wrapperDevolucion.devolucion.estadoCivil );
    this.fechaNacimiento.setValue( this.wrapperDevolucion.devolucion.fechaNacimiento );
    this.nacionalidad.setValue( this.wrapperDevolucion.devolucion.nacionalidad);
    this.lugarNacimiento.setValue( this.wrapperDevolucion.devolucion.lugarNacimiento );
    this.onChangeFechaNacimiento();
    this.tipoCliente.setValue(this.wrapperDevolucion.devolucion.tipoCliente);
    this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
    this.agenciaEntrega.setValue(this.wrapperDevolucion.devolucion.agenciaEntrega);
    this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);
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
      this.router.navigate(['aprobador/bandeja-aprobador']);
    });
  }
  public regresar() {
    this.router.navigate(['credito-nuevo/']);
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
  public respuesta( aprobado ) {
    let mensaje = aprobado ? 'Aprobar la solicitud de devolucion garantia para el proceso: ' + this.wrapperDevolucion.devolucion.codigo+'.':
      'Negar la solicitud de devolucion garantia para el proceso: ' + this.wrapperDevolucion.devolucion.codigo+'.';
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.dev.aprobarNegarSolicitudDevolucion(this.item, aprobado).subscribe((data: any) => {
            if(data.entidad){
              if( aprobado && data.entidad.proceso.estadoProceso == 'PENDIENTE_FECHA'){
                this.sinNoticeService.setNotice("SE HA APROBADO CORRECTAMENTE LA SOLICITUD DE DEVOLUCION", "success");
                this.router.navigate(['aprobador/bandeja-aprobador']);
              }else if( !aprobado && data.entidad.proceso.estadoProceso == 'RECHAZADO'){
                this.sinNoticeService.setNotice("SE HA RECHAZADO CORRECTAMENTE LA SOLICITUD DE DEVOLUCION", "success");
                this.router.navigate(['aprobador/bandeja-aprobador']);
              } else{
                this.sinNoticeService.setNotice("ERROR AL APROBAR O NEGAR EL PROCESO", 'error');
              }
            }
          }, error => {
            this.sinNoticeService.setNotice(error.error.msgError, 'error');
          })
        }else{
          this.sinNoticeService.setNotice("SE CANCELO LA ACCION", 'warning');
        }
      });
  }

} 