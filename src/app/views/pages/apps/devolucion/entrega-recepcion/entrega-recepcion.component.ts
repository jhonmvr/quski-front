import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoDevolucion } from '../../../../../core/model/quski/TbQoDevolucion';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { SubheaderService } from '../../../../../core/_base/layout';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'kt-entrega-recepcion',
  templateUrl: './entrega-recepcion.component.html',
  styleUrls: ['./entrega-recepcion.component.scss']
})
export class EntregaRecepcionComponent extends TrackingUtil implements OnInit {
  varHabilitante = 'ENTREGA';
  public titulo: any;
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
  public dataSourceDetalle: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumnsDetalle = ['fechaAprobacion', 'fechaVencimiento', 'monto'];
  public dataSourceHeredero: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumnsHeredero = ['cedula', 'nombre']

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
  idReferencia

  constructor(
    private sinNoticeService: ReNoticeService,
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    private par: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private dev: DevolucionService) {
    super();
    this.cre.setParameter();
    this.par.setParameter();
    this.dev.setParameter();
    this.sof.setParameter();
    this.formCreditoNuevo.addControl("numeroOperacion",  this.numeroOperacion );
    this.formCreditoNuevo.addControl("procesoDev",       this.procesoDev );
    this.formCreditoNuevo.addControl("cedulaCliente",    this.cedulaCliente );
    this.formCreditoNuevo.addControl("nombresCompletos", this.nombresCompletos );
    this.formCreditoNuevo.addControl("nivelEducacion",   this.nivelEducacion );
    this.formCreditoNuevo.addControl("genero",           this.genero );
    this.formCreditoNuevo.addControl("estadoCivil",      this.estadoCivil );
    this.formCreditoNuevo.addControl("fechaNacimiento",  this.fechaNacimiento );
    this.formCreditoNuevo.addControl("nacionalidad",     this.nacionalidad );
    this.formCreditoNuevo.addControl("lugarNacimiento",  this.lugarNacimiento );
    this.formCreditoNuevo.addControl("edad",             this.edad );
    this.formCreditoNuevo.addControl("tipoCliente",      this.tipoCliente );
    this.formCreditoNuevo.addControl("observaciones",    this.observaciones );
    this.formCreditoNuevo.addControl("agenciaEntrega",   this.agenciaEntrega );
    this.formCreditoNuevo.addControl("valorCustodia",    this.valorCustodia );
    this.formCreditoNuevo.addControl("cedulaApoderado",  this.cedulaApoderado );
    this.formCreditoNuevo.addControl("nombreApoderado",  this.nombreApoderado );
  }
  ngOnInit() {
    this.dev.setParameter();
    this.cre.setParameter();
    this.sof.setParameter();
    this.par.setParameter();
    this.cargarCatalogos();
    this.subheaderService.setTitle('FLUJO DE DEVOLUCION');
  }
  private decodeObjetoDatos(entrada) {
    return JSON.parse(atob(entrada))
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
              if(this.wrapperSoft.credito.esMigrado){
                this.varHabilitante ='TERMINACIONCONTRATO,ENTREGA';
              }
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
    this.titulo = "ENTREGA RECEPCION: " + this.wrapperDevolucion.devolucion.codigo;
    this.numeroOperacion.setValue( this.wrapperDevolucion.devolucion.codigoOperacion);
    this.procesoDev.setValue( this.wrapperDevolucion.proceso.estadoProceso.replace(/_/gi," ")  );
    this.nombresCompletos.setValue( this.wrapperDevolucion.devolucion.nombreCliente );
    this.cedulaCliente.setValue( this.wrapperDevolucion.devolucion.cedulaCliente );
    this.fechaNacimiento.setValue( this.wrapperDevolucion.devolucion.fechaNacimiento );
    this.onChangeFechaNacimiento();
    this.tipoCliente.setValue(this.wrapperDevolucion.devolucion.tipoCliente);
    this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
    this.agenciaEntrega.setValue(this.wrapperDevolucion.devolucion.agenciaEntrega);
    this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);

    this.nivelEducacion.setValue( this.cargarItem(this.catEducacion, this.wrapperDevolucion.devolucion.nivelEducacion, true).nombre);
    this.genero.setValue(this.cargarItem(this.catGenero, this.wrapperDevolucion.devolucion.genero, true).nombre);
    this.estadoCivil.setValue(this.cargarItem(this.catEstadoCivil, this.wrapperDevolucion.devolucion.estadoCivil, true).nombre);
    this.nacionalidad.setValue(this.cargarItem(this.catPais, this.wrapperDevolucion.devolucion.nacionalidad, false).nacionalidad);
    let itemParroquia = this.cargarItem(this.catDivision, this.wrapperDevolucion.devolucion.lugarNacimiento, false);
    let itemCanton = this.cargarItem(this.catDivision, itemParroquia.idPadre, false);
    let itemProvincia = this.cargarItem(this.catDivision, itemCanton.idPadre, false);
    this.lugarNacimiento.setValue( (itemParroquia ? itemParroquia.nombre : '' ) + (itemCanton ? ' / ' + itemCanton.nombre : '' ) + (itemProvincia ? ' / ' + itemProvincia.nombre : '') );

    this.idReferencia = this.wrapperDevolucion.devolucion.id
    if(this.wrapperDevolucion){
      let objetoHeredero = this.decodeObjetoDatos( this.wrapperDevolucion.devolucion.codeHerederos );
      this.dataSourceHeredero = new MatTableDataSource<any>(objetoHeredero.heredero);
      this.nombreApoderado.setValue( this.wrapperDevolucion.devolucion.nombreApoderado );
      this.cedulaApoderado.setValue( this.wrapperDevolucion.devolucion.cedulaApoderado );
      this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
      this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);
      this.agenciaEntrega.setValue( this.wrapperDevolucion.devolucion.agenciaEntrega );
      this.tipoCliente.setValue( this.catTipoCliente.find( x => x.codigo == this.wrapperDevolucion.devolucion.tipoCliente ));
      let objetoCredito = this.decodeObjetoDatos( this.wrapperDevolucion.devolucion.codeDetalleCredito );
      console.log('CODE DE CREDITO =>', this.decodeObjetoDatos( this.wrapperDevolucion.devolucion.codeDetalleCredito ));
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
    }else if(!index && catalogo){
      let item = catalogo.find(x => x.id == cod);
      if (catalogo && item) {
        return item;
      }
    }
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
  public regresar() {
    this.router.navigate(['negociacion/bandeja-operaciones']);
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
    this.sof.consultarTipoClienteCS().subscribe((data: any) => {
      let tipoCliente = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.catTipoCliente = new Array<any>();
      this.catTipoCliente.push({ codigo: "HER", nombre: "HEREDERO" });
      this.catTipoCliente.push(tipoCliente.find(x => x.codigo == 'SAP'));
      this.catTipoCliente.push(tipoCliente.find(x => x.codigo == 'DEU'));
      this.sof.consultarAgenciasCS().subscribe((data: any) => {
        this.catAgencia = !data.existeError ? data.catalogo : "Error al cargar catalogo";
        this.sof.consultarPaisCS().subscribe((data: any) => {
          this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.sof.consultarEducacionCS().subscribe((data: any) => {
            this.catEducacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
            this.sof.consultarEstadosCivilesCS().subscribe((data: any) => {
              this.catEstadoCivil = !data.existeError ? data.catalogo : "Error al cargar catalogo";
              this.sof.consultarGeneroCS().subscribe((data: any) => {
                this.catGenero = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                this.sof.consultarDivicionPoliticaCS().subscribe((data: any) => {
                  this.catDivision = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                  this.inicioFlujo();
                });
              });
            });
          });
        });
      });
    });
  }
  public guardar() {
    let mensaje = " Generar acta de entrega y enviar al aprobador para verificacion de firmas.";
    
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        this.dev.guardarEntregaRecepcion(this.item).subscribe( (data: any) => {
          if(data.entidad){
            this.sinNoticeService.setNotice('PROCESO DE DEVOLUCION ENVIADO A APROBACION DE FIRMAS','success');
            this.router.navigate(['negociacion/bandeja-operaciones']);
          }else {
            this.sinNoticeService.setNotice('ERROR AL CAMBIAR DE ESTADO DE DEVOLUCION', 'error');
          }
        }, error => {
          this.sinNoticeService.setNotice(error.error.codError.replace(/_/gi, " "), 'warning');
        });
      }else{
          this.sinNoticeService.setNotice('SE CANCELO LA ACCION','warning');
      }
    });
  }
} 