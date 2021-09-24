import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoDevolucion } from '../../../../../core/model/quski/TbQoDevolucion';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { SubheaderService } from '../../../../../core/_base/layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';

@Component({
  selector: 'kt-solicitud-devolucion',
  templateUrl: './solicitud-devolucion.component.html',
  styleUrls: ['./solicitud-devolucion.component.scss']
})
export class SolicitudDevolucionComponent  extends TrackingUtil  implements OnInit {
  public item: any;
  cod;
  objetoCredito = new Object();
  public idReferencia;
  public wrapperSoft: any;
  public wrapperDevolucion: { proceso: TbQoProceso, devolucion: TbQoDevolucion }
  public catGenero: Array<any>;
  public catEstadoCivil: Array<any>;
  public catEducacion: Array<any>;
  public catPais: Array<any>;
  public catTipoCliente: Array<any>;
  private catDivision: Array<any>;
  public catAgencia: Array<any>;
  catAgencia2
  private usuario: string;
  private agencia: string;
  private totalPesoB;
  private totalValorA;
  public estadoOperacion = 'SOLICITUD'



  public formTipoCliente: FormGroup = new FormGroup({});
  public devolucionForm: FormGroup = new FormGroup({});
  // datos operacion
  public numeroOperacion = new FormControl('');
  public estadoProceso = new FormControl('');



  //datos cliente
  public cedulaCliente = new FormControl('');
  public nombresCompletos = new FormControl('');
  public nivelEducacion = new FormControl('');
  public genero = new FormControl('');
  public estadoCivil = new FormControl('');
  public fechaNacimiento = new FormControl('');
  public nacionalidad = new FormControl('');
  public lugarNacimiento = new FormControl('');
  public edad = new FormControl('');
  //GESTION DEVOLUCION
  public tipoCliente = new FormControl('', [Validators.required]);
  public observaciones = new FormControl('', [Validators.required]);
  public agenciaEntrega = new FormControl('', [Validators.required]);
  public valorCustodia = new FormControl('', []);
  public cedulaHeredero = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public nombreHeredero = new FormControl('', [Validators.required]);
  public cedulaApoderado = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public nombreApoderado = new FormControl('', [Validators.required]);

  dataSourceDetalle = new MatTableDataSource<any>();
  displayedColumnsDetalle = ['fechaAprobacion', 'fechaVencimiento', 'monto']
  dataSourceHeredero = new MatTableDataSource<any>();
  displayedColumnsHeredero = ['accion', 'cedula', 'nombre']
  listTablaHeredero = []

  /**Obligatorio paginacion */

  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  idLugarNacimiento: any;

  constructor(
    private cre: CreditoNegociacionService,
    private dev: DevolucionService,
    private pro: ProcesoService,
    private sof: SoftbankService,
    private subheaderService: SubheaderService,
    private par: ParametroService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public tra: TrackingService,
  ) {
    super(tra);
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();

    this.devolucionForm.addControl("tipoCliente", this.tipoCliente);
    this.devolucionForm.addControl("observaciones", this.observaciones);
    this.devolucionForm.addControl("valorCustodia", this.valorCustodia);
    this.devolucionForm.addControl("agenciaEntrega", this.agenciaEntrega);

    this.formTipoCliente.addControl("cedulaHeredero", this.cedulaHeredero);
    this.formTipoCliente.addControl("nombreHeredero", this.nombreHeredero);
    this.formTipoCliente.addControl("cedulaApoderado", this.cedulaApoderado);
    this.formTipoCliente.addControl("nombreApoderado", this.nombreApoderado);


  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();
    this.valorCustodia.disable();
    this.cargarCatalogos();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem('idAgencia');
    this.subheaderService.setTitle('FLUJO DE DEVOLUCION');

  }
  private inicioFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.cod && json.params.item) {
        this.cod = json.params.cod;
        if (json.params.cod == 'NUEV') {
          this.item = json.params.item;
          this.cre.traerCreditoVigente(json.params.item).subscribe((data: any) => {
            if (data.entidad) {
              this.wrapperSoft = data.entidad;
              this.cargarCampos();
            } else {
              this.salirDeGestion("Error al intentar cargar el credito.");
            }
          });
        }
        if (json.params.cod == 'CREA' || json.params.cod == 'EDIT') {
          this.item = json.params.item;
          this.dev.buscarProcesoDevolucion(this.item).subscribe((data: any) => {
            this.wrapperDevolucion = data.entidad;
            this.idReferencia = data.entidad.devolucion.id
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
      }
    });
  }
  private validacion(numeroOperacion) {
    if (this.cod != 'EDIT') {
      this.dev.validarProcesoActivo(numeroOperacion).subscribe((data: any) => {
        if (data.entidad && data.entidad.existe) {
          this.salirDeGestion(data.entidad.mensaje, 'Proceso Activo.');
        }
      });
    }
  }
  private cargarCampos() {
    this.validacion(this.wrapperSoft.credito.numeroOperacion);
    !this.wrapperSoft.garantias || this.wrapperSoft.garantias.length < 1 ? this.salirDeGestion('No existen joyas relacionadas a este credito.', 'Faltan Joyas.') : null;

    this.guardarTraking(this.wrapperDevolucion ? this.wrapperDevolucion.proceso ? this.wrapperDevolucion.proceso.proceso : null : null,
      this.wrapperDevolucion ? this.wrapperDevolucion.devolucion ? this.wrapperDevolucion.devolucion.codigo : null : null, 
      ['Información Operación','Datos Personales del cliente','Detalle de Crédito','Detalle de Garantía','Gestion Devolución','Documento Habilitantes'], 
      0, 'SOLICITUD DE DEVOLUCION',this.wrapperDevolucion ? this.wrapperDevolucion.devolucion ? this.wrapperDevolucion.devolucion.codigoOperacion : null : null )
    
      this.numeroOperacion.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.codigoOperacion : this.wrapperSoft.credito.numeroOperacion);
    this.estadoProceso.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.proceso.estadoProceso.replace(/_/gi, " ",) : 'PROCESO NO INICIADO');
    this.nombresCompletos.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.nombreCliente : this.wrapperSoft.cliente.nombreCompleto);
    this.cedulaCliente.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.cedulaCliente : this.wrapperSoft.cliente.identificacion);

    let codEducacion = this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.nivelEducacion : this.wrapperSoft.cliente.codigoEducacion;
    this.nivelEducacion.setValue( this.cargarItem(this.catEducacion, codEducacion, true));
    let codGenero = this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.genero : this.wrapperSoft.cliente.codigoSexo;
    this.genero.setValue(this.cargarItem(this.catGenero, codGenero, true));
    let codEstadoCivil = this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.estadoCivil : this.wrapperSoft.cliente.codigoEstadoCivil;
    this.estadoCivil.setValue(this.cargarItem(this.catEstadoCivil, codEstadoCivil, true));
    let codNacionalidad = this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.nacionalidad : this.wrapperSoft.cliente.idPaisNacimiento;
    this.nacionalidad.setValue(this.cargarItem(this.catPais, codNacionalidad, false));
    this.idLugarNacimiento = this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.lugarNacimiento : this.wrapperSoft.cliente.idLugarNacimiento;
    let itemParroquia = this.cargarItem(this.catDivision, this.idLugarNacimiento, false);
    let itemCanton = this.cargarItem(this.catDivision, itemParroquia.idPadre, false);
    let itemProvincia = itemCanton ? this.cargarItem(this.catDivision, itemCanton.idPadre, false) : null;
    this.lugarNacimiento.setValue( (itemParroquia ? itemParroquia.nombre : '' ) + (itemCanton ? ' / ' + itemCanton.nombre : '' ) + (itemProvincia ? ' / ' + itemProvincia.nombre : '') );
    this.tipoCliente.setValue(this.catTipoCliente.find(x => x.codigo == 'DEU'));

    this.fechaNacimiento.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.fechaNacimiento : this.wrapperSoft.cliente.fechaNacimiento);
    this.objetoCredito['fechaAprobacion'] = this.wrapperSoft.credito.fechaAprobacion
    this.objetoCredito['fechaVencimiento'] = this.wrapperSoft.credito.fechaVencimiento
    this.objetoCredito['monto'] = this.wrapperSoft.credito.montoFinanciado
    this.dataSourceDetalle = new MatTableDataSource<any>([this.objetoCredito]);
    this.onChangeFechaNacimiento();
    if (this.wrapperDevolucion) {
      let objetoHeredero = this.decodeObjetoDatos(this.wrapperDevolucion.devolucion.codeHerederos);
      this.dataSourceHeredero = new MatTableDataSource<any>(objetoHeredero.heredero);
      this.nombreApoderado.setValue(this.wrapperDevolucion.devolucion.nombreApoderado);
      this.cedulaApoderado.setValue(this.wrapperDevolucion.devolucion.cedulaApoderado);
      this.observaciones.setValue(this.wrapperDevolucion.devolucion.observaciones);
      this.valorCustodia.setValue(this.wrapperDevolucion.devolucion.valorCustodiaAprox);
      this.agenciaEntrega.setValue(this.catAgencia.find(x => x.id == this.wrapperDevolucion.devolucion.agenciaEntregaId));
      this.tipoCliente.setValue(this.catTipoCliente.find(x => x.codigo == this.wrapperDevolucion.devolucion.tipoCliente));
      let objetoCredito = this.decodeObjetoDatos(this.wrapperDevolucion.devolucion.codeDetalleCredito);
      this.dataSourceDetalle = new MatTableDataSource<any>(objetoCredito);
    }
    this.desactivarCampos();
    this.sinNoticeService.setNotice('CREDITO CARGADO CORRECTAMENTE', 'success');
    if(this.catAgencia instanceof Array && this.wrapperSoft.garantias && this.wrapperSoft.garantias[0]){
      let agenciaResgistro = this.catAgencia.find(p=>p.id == this.wrapperSoft.garantias[0].idAgenciaRegistro);
      this.catAgencia2 = this.catAgencia.filter(p=>p.idUbicacionTevcol == agenciaResgistro.idUbicacionTevcol);
    }else{
      this.sinNoticeService.setNotice('NO SE PUDO LEER LA CIUDAD TEVCOL', 'error');
    }
    
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

  /** ********************************************* @FUNCIONALIDAD ********************* **/
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
      this.router.navigate(['credito-nuevo/']);
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
      this.sinNoticeService.setNotice("EL VALOR DE LA FECHA ES NULO.", "warning"
      );
    }
  }
  private cargarCatalogos() {
    this.sof.consultarAgenciasCS().subscribe((data: any) => {
      this.catAgencia = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      
    });
      this.sof.consultarPaisCS().subscribe((data: any) => {
        this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
        this.sof.consultarEducacionCS().subscribe((data: any) => {
          this.catEducacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.sof.consultarEstadosCivilesCS().subscribe((data: any) => {
            this.catEstadoCivil = !data.existeError ? data.catalogo : "Error al cargar catalogo";
            this.sof.consultarGeneroCS().subscribe((data: any) => {
              this.catGenero = !data.existeError ? data.catalogo : "Error al cargar catalogo";
              this.sof.consultarDivicionPoliticaCS().subscribe((data: any) => {
                if (!data.existeError) {
                  this.catDivision = !data.existeError ? data.catalogo : { nombre: 'Error al cargar catalogo' };
                  this.sof.consultarTipoClienteCS().subscribe((data: any) => {
                    let tipoCliente = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                    this.catTipoCliente = new Array<any>();
                    this.catTipoCliente.push(tipoCliente.find(x => x.codigo == 'DEU'));
                    this.catTipoCliente.push(tipoCliente.find(x => x.codigo == 'SAP'));
                    this.catTipoCliente.push({ codigo: "HER", nombre: "HEREDERO" });
                    this.inicioFlujo();
                  });
                }
              });
            });
          });
        });
      });
  }
  forAgenciaCustodia(e) {
    let x = this.catAgencia.find(x => x.id == e);
    if (e && this.catAgencia && x) {
      let idTecCol = x.idUbicacionTevcol;
      let m = this.catDivision.find(x => x.id == idTecCol);
      if (idTecCol && m) {
        return m.nombre;
      }else{
        return 'No se encuentra ciudad.' ;
      }
    } else {
      return 'Error Catalogo';
    }
  }
  forCiudadEntrega(e) {
    let x = this.catAgencia.find(x => x.id == e);
    if (e && this.catAgencia && x) {
      let idResidencia = x.idResidencia;
      let m = this.catDivision.find(x => x.id == idResidencia);
      console.log(' catDivision => ', m);
      if (idResidencia && m) {
        console.log(' m.nombre => ', m.nombre);
        return m.nombre;
      }else{
        return 'No se encuentra ciudad.' ;
      }
    } else {
      return 'Error Catalogo';
    }
  }
  idResidencia

  private calcular() {
    this.totalPesoB = 0;
    this.totalValorA = 0;
    if (this.wrapperSoft.garantias) {
      this.wrapperSoft.garantias.forEach(element => {
        this.totalPesoB = (Number(this.totalPesoB) + Number(element.pesoBruto)).toFixed(2);
        this.totalValorA = Number(this.totalValorA) + Number(element.valorAvaluo);
      });
    }
  }
  public getErrorMessage(pfield: string) { //@TODO: Revisar campos 
    const errorRequerido = 'Ingresar valores';
    const errorNumero = 'Ingresar solo numeros';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    if (pfield && pfield === "cedulaHeredero") {
      const input = this.cedulaHeredero.value
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalid-identification")
            ? invalidIdentification
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : input.hasError("minlength")
                ? errorInsuficiente
                : "";
    }
    if (pfield && pfield === 'nombreHeredo') {
      const input = this.nombreHeredero;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === "cedulaApoderado") {
      const input = this.cedulaHeredero.value
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalid-identification")
            ? invalidIdentification
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : input.hasError("minlength")
                ? errorInsuficiente
                : "";
    }
    if (pfield && pfield === 'nombreApoderado') {
      const input = this.nombreHeredero;
      return input.hasError('required') ? errorRequerido : '';
    }
  }
  /** ********************************************* @FLUJO ********************* **/
  public registrarDevolucion() {
    if (this.devolucionForm.invalid || !this.wrapperSoft || !this.wrapperSoft.garantias) {
      this.sinNoticeService.setNotice('COMPLETE LOS DATOS REQUERIDOS', 'warning');
      return;
    }
    let mensaje = " Crear o actualizar el proceso de devolucon para el credito: " + this.wrapperSoft.credito.numeroOperacion;
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        let wrapper = new TbQoDevolucion();
        wrapper.id = this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.id : null;
        wrapper.asesor = this.usuario;
        wrapper.idAgencia = this.agencia;
        wrapper.nombreAgenciaSolicitud = localStorage.getItem("nombreAgencia");
        wrapper.nombreCliente = this.nombresCompletos.value;
        wrapper.cedulaCliente = this.cedulaCliente.value;
        wrapper.codigoOperacion = this.numeroOperacion.value;
        wrapper.nivelEducacion = this.nivelEducacion.value.codigo;
        wrapper.estadoCivil = this.estadoCivil.value.codigo;
        wrapper.genero = this.genero.value.codigo;
        wrapper.nacionalidad = this.nacionalidad.value.id;
        wrapper.lugarNacimiento = this.idLugarNacimiento;
        wrapper.esMigrado = this.wrapperSoft.credito.esMigrado;
        wrapper.fechaNacimiento = this.fechaNacimiento.value;
        wrapper.tipoCliente = this.tipoCliente.value.codigo;
        wrapper.observaciones = this.observaciones.value;
        wrapper.agenciaEntrega = this.agenciaEntrega.value.nombre;
        wrapper.agenciaEntregaId = this.agenciaEntrega.value.id;
        wrapper.ciudadEntrega = this.forCiudadEntrega(this.agenciaEntrega.value.id);
        wrapper.codigoOperacionMadre = this.wrapperSoft.credito.numeroOperacionMadre ? this.wrapperSoft.credito.numeroOperacionMadre : null;
        wrapper.fundaActual = this.wrapperSoft.garantias[0].numeroFundaJoya;
        wrapper.fundaMadre = this.wrapperSoft.garantias[0].numeroFundaMadre;
        wrapper.ciudadTevcol = this.forAgenciaCustodia(this.wrapperSoft.garantias[0].idAgenciaCustodia);
        this.calcular();
        wrapper.valorAvaluo = this.totalValorA;
        wrapper.pesoBruto = this.totalPesoB;
        //wrapper.fechaEfectiva = this.wrapperSoft.credito.fechaAprobacion;
        //wrapper.valorCustodiaAprox = this.valorCustodia.value;
        wrapper.codeHerederos = this.encodeObjetos({ heredero: this.listTablaHeredero });
        wrapper.codeDetalleCredito = this.encodeObjetos([this.objetoCredito]);
        wrapper.codeDetalleGarantia = this.encodeObjetos(this.wrapperSoft.garantias);
        wrapper.nombreApoderado = this.nombreApoderado.value ? this.nombreApoderado.value : null;
        wrapper.cedulaApoderado = this.cedulaApoderado.value ? this.cedulaApoderado.value : null;
        wrapper.correoCliente = this.wrapperSoft.cliente.email;
        wrapper.correoAsesor = localStorage.getItem("email")
        this.dev.registrarSolicitudDevolucion(wrapper).subscribe((data: any) => {
          if (data.entidad) {
            console.log('data Devolucion =>', data.entidad);
            this.wrapperDevolucion = data.entidad;
            this.idReferencia = data.entidad.devolucion.id;
            this.setTipoHabilitantePorTipoCliente();
            this.sinNoticeService.setNotice("PROCESO DE DEVOLUCION: " + this.wrapperDevolucion.devolucion.codigo + ". CREADO CORRECTAMENTE.", "success");
            this.stepper.selectedIndex = 5;
          } else {
            this.sinNoticeService.setNotice(" ERROR AL GUARDAR PROCESO. ", 'error');
          }
        });
      } else {
        this.sinNoticeService.setNotice('SE CANCELO LA ACCION', 'warning');
      }
    });
  }
  public solicitarAprobacion() {
    let mensaje = " Enviar a aprobador la solicitud de devolucion de garantia para el proceso: " + this.wrapperDevolucion.devolucion.codigo;
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.dev.validateSolicitarAprobacion(this.idReferencia).subscribe((data: any) => {
          if (data.entidad) {
            this.sinNoticeService.setNotice( 'EL PROCESO DE DEVOLUCION SE ENVIO A APROBACION', 'success');
            this.router.navigate(['negociacion/bandeja-operaciones']);
          }
        }, error =>{
          this.sinNoticeService.setNotice( error.error.codError.replace(/_/gi, " "), 'warning');
        })
      } else {
        this.sinNoticeService.setNotice('SE CANCELO LA ACCION', 'warning');
      }
    });
  }
  /** ********************************************* @HEREDERO ********************* **/
  public agregarHeredero() {
    if (this.cedulaHeredero.invalid) {
      this.sinNoticeService.setNotice('INGRESE UN NUMERO DE CEDULA VALIDO', 'warning');
      return;
    }
    if (this.nombreHeredero.invalid) {
      this.sinNoticeService.setNotice('INGRESE NOMBRE DEL HEREDERO', 'warning');
      return;
    }
    let objetoHeredero = { cedula: "", nombre: "" }
    if (this.cedulaHeredero.value && this.nombreHeredero.value) {
      objetoHeredero.cedula = this.cedulaHeredero.value
      objetoHeredero.nombre = this.nombreHeredero.value
      this.listTablaHeredero.push(objetoHeredero)
      this.dataSourceHeredero = new MatTableDataSource<any>(this.listTablaHeredero);
      this.limpiarCampos();
    } else {
      this.sinNoticeService.setNotice("INGRESE CORRECTAMENTE LOS CAMPOS DE HEREDERO", 'warning');
    }
  }
  public eliminarHeredero(row) {
    let lits = this.dataSourceHeredero.data;
    const index = lits.indexOf(row);
    lits.splice(index, 1);
    const dataC = lits;
    this.dataSourceHeredero.data = dataC;
    if (this.dataSourceHeredero.data.length < 1) {
      this.dataSourceHeredero.data = null;
    } else {
      this.listTablaHeredero = new Array<any>();
      this.dataSourceHeredero.data.forEach(e => {
        let objetoHeredero = { cedula: "", nombre: "" }
        objetoHeredero.cedula = e.cedula;
        objetoHeredero.nombre = e.nombre;
        this.listTablaHeredero.push(objetoHeredero);
      });
    }
  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public limpiarCampos() {
    Object.keys(this.formTipoCliente.controls).forEach((name) => {
      const control = this.formTipoCliente.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.reset();
    });
    this.formTipoCliente.reset();
  }
  private desactivarCampos() {
    this.numeroOperacion.disable();
    this.estadoProceso.disable();
    this.cedulaCliente.disable();
    this.nombresCompletos.disable();
    this.nivelEducacion.disable();
    this.genero.disable();
    this.estadoCivil.disable();
    this.fechaNacimiento.disable();
    this.nacionalidad.disable();
    this.lugarNacimiento.disable();
    this.edad.disable();
  }
  private setTipoHabilitantePorTipoCliente() {
    console.log(this.tipoCliente.value)
    if (this.tipoCliente.value.codigo == 'HER') {
      this.estadoOperacion = "SOLICITUDHEREDEROS"
    }
    if (this.tipoCliente.value.codigo == 'SAP') {
      this.estadoOperacion = "SOLICITUDHEREDEROS"
    }
    if (this.tipoCliente.value.codigo == 'DEU') {
      this.estadoOperacion = "SOLICITUD"
    }
  }
  decodeObjetoDatos(entrada) {
    return JSON.parse(atob(entrada))
  }
  encodeObjetos(entrada) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(entrada))))
  }

} 