import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoDevolucion } from '../../../../../core/model/quski/TbQoDevolucion';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-solicitud-devolucion',
  templateUrl: './solicitud-devolucion.component.html',
  styleUrls: ['./solicitud-devolucion.component.scss']
})
export class SolicitudDevolucionComponent implements OnInit {
  public item: any;
  public wrapperSoft: any;
  public wrapperDevolucion: { proceso: TbQoProceso, devolucion: TbQoDevolucion }
  public catGenero: Array<any>;
  public catEstadoCivil: Array<any>;
  public catEducacion: Array<any>;
  public catPais: Array<any>;
  public catTipoCliente: Array<any>;
  private catDivision: Array<any>;
  public catAgencia: Array<any>;
  private usuario: string;
  private agencia: string;
  private totalPesoB;
  private totalValorA;
  public estadoOperacion = 'SOLICITUD'



  public heredero: FormGroup = new FormGroup({});
  public devolucionForm: FormGroup = new FormGroup({});
  private loadingSubject = new BehaviorSubject<boolean>(false);
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
  public observaciones = new FormControl('');
  public agenciaEntrega = new FormControl('', [Validators.required]);
  public valorCustodia = new FormControl('');
  public cedulaHeredero = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public nombreHeredero = new FormControl('', [Validators.required]);




  listTablaHeredero = []

  displayedColumnsHeredero = ['cedula', 'nombre']
  displayedColumnsCredito = ['fechaAprobacion', 'fechaVencimiento', 'monto']
  /**Obligatorio paginacion */
  dataSourceContrato = new MatTableDataSource;
  dataSourceHeredero = new MatTableDataSource;

  @ViewChild('stepper', { static: true }) stepper: MatStepper;

  constructor(
    private cre: CreditoNegociacionService,
    private dev: DevolucionService,
    private pro: ProcesoService,
    private sof: SoftbankService,
    private par: ParametroService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();

    this.heredero.addControl("cedulaHeredero", this.cedulaHeredero);
    this.heredero.addControl("nombreHeredero", this.nombreHeredero);
    this.devolucionForm.addControl("tipoCliente", this.tipoCliente);
    this.devolucionForm.addControl("observaciones", this.observaciones);
    this.devolucionForm.addControl("agenciaEntrega", this.agenciaEntrega);
    this.devolucionForm.addControl("valorCustodia", this.valorCustodia);

  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.dev.setParameter();
    this.cargarCatalogos();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );
    this.inicioFlujo();
  }
  private inicioFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.cod && json.params.item) {
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
        if (json.params.cod == 'CREA') {
          this.item = json.params.item;
          this.dev.buscarProcesoDevolucion( this.item ).subscribe( (data:any) =>{
            this.wrapperDevolucion = data.entidad;
            this.cre.traerCreditoVigente( this.wrapperDevolucion.devolucion.codigoOperacion ).subscribe((data: any) => {
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
  private validacion() {
  }
  private cargarCampos() {
    this.validacion();
    console.log('Wrapper SOFTBANK => ', this.wrapperSoft);
    console.log('Wrapper PROCESO => ', this.wrapperDevolucion);
    this.numeroOperacion.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.codigoOperacion : this.wrapperSoft.credito.numeroOperacion );
    this.estadoProceso.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.proceso.estadoProceso : 'No Iniciado');
    this.nombresCompletos.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.nombreCliente : this.wrapperSoft.cliente.nombreCompleto);
    this.cedulaCliente.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.cedulaCliente : this.wrapperSoft.cliente.identificacion);
    this.nivelEducacion.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.nivelEducacion : this.wrapperSoft.cliente.codigoEducacion);
    this.genero.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.genero : this.wrapperSoft.cliente.codigoSexo);
    this.estadoCivil.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.estadoCivil : this.wrapperSoft.cliente.codigoEstadoCivil);
    this.fechaNacimiento.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.fechaNacimiento : this.wrapperSoft.cliente.fechaNacimiento);
    this.nacionalidad.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.nacionalidad : this.wrapperSoft.cliente.idPaisNacimiento);
    this.lugarNacimiento.setValue(this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.lugarNacimiento : this.wrapperSoft.cliente.idLugarNacimiento);
    this.onChangeFechaNacimiento();
    this.sinNoticeService.setNotice('CREDITO CARGADO CORRECTAMENTE', 'success');
  }
  
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  private salirDeGestion(dataMensaje: string, dataTitulo?: string) {
    this.loadingSubject.next(false);
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
    this.loadingSubject.next(true);
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
        this.loadingSubject.next(false);
      });
    } else {
      this.sinNoticeService.setNotice(
        "El valor de la fecha es nulo",
        "warning"
      );
      this.loadingSubject.next(false);
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
      this.catTipoCliente.push( tipoCliente.find(x => x.codigo == 'SAP') );
      this.catTipoCliente.push( tipoCliente.find(x => x.codigo == 'DEU') );
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
        this.catDivision= !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
      }
    }); 
  }
  forAgenciaCustodia(e){
    let agenciaCustodia = e.idAgenciaCustodia;
    let x = this.catAgencia.find(x => x.id == agenciaCustodia);
    if(agenciaCustodia && this.catAgencia && x){
      let idTecCol = x.idUbicacionTevcol;
      let m = this.catDivision.find(x => x.id == agenciaCustodia);
      if(idTecCol && m){
        return m.nombre;
      }
    }else{
      return 'Error Catalogo' ;
    }
  }
  private calcular() {
    this.totalPesoB = 0;
    this.totalValorA = 0;
    if (this.wrapperSoft.garantias) {
      this.wrapperSoft.garantias.forEach(element => {
        this.totalPesoB  = (Number(this.totalPesoB) + Number(element.pesoBruto)).toFixed(2);
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
  }
  /** ********************************************* @FLUJO ********************* **/
  public registrarDevolucion() {
    if (this.devolucionForm.invalid) {
      this.sinNoticeService.setNotice('Llene los datos requeridos', 'warning');
      return;
    }
    let wrapper = new TbQoDevolucion();
    wrapper.id = this.wrapperDevolucion ? this.wrapperDevolucion.devolucion.id : null;
    wrapper.asesor = this.usuario;
    wrapper.idAgencia = this.agencia;
    wrapper.nombreAgenciaSolicitud = localStorage.getItem("nombreAgencia");
    wrapper.nombreCliente = this.nombresCompletos.value;
    wrapper.cedulaCliente = this.cedulaCliente.value;
    wrapper.codigoOperacion = this.numeroOperacion.value;
    wrapper.nivelEducacion = this.nivelEducacion.value;
    wrapper.estadoCivil = this.estadoCivil.value;
    wrapper.fechaNacimiento = this.fechaNacimiento.value;
    wrapper.nacionalidad = this.nacionalidad.value;
    wrapper.genero = this.genero.value;
    wrapper.lugarNacimiento = this.lugarNacimiento.value;
    wrapper.tipoCliente = this.tipoCliente.value.codigo;
    wrapper.observaciones = this.observaciones.value;
    wrapper.agenciaEntrega = this.agenciaEntrega.value.nombre;
    wrapper.agenciaEntregaId = this.agenciaEntrega.value.id;
    wrapper.codigoOperacionMadre = this.wrapperSoft.credito.numeroOperacionMadre ? this.wrapperSoft.credito.numeroOperacionMadre : null;
    wrapper.fundaActual = this.wrapperSoft.garantias[0].numeroFundaJoya;
    wrapper.fundaMadre = this.wrapperSoft.garantias[0].numeroFundaMadre;
    wrapper.ciudadTevcol = this.forAgenciaCustodia(this.wrapperSoft.garantias[0]);
    this.calcular();
    wrapper.valorAvaluo = this.totalValorA;
    wrapper.pesoBruto = this.totalPesoB;
    wrapper.fechaEfectiva = this.wrapperSoft.credito.fechaAprobacion;
    wrapper.valorCustodiaAprox = 12.00
    //wrapper.codeHerederos;
	  //wrapper.valorCustodiaAprox;
	  //wrapper.arribo;
	  //wrapper.devuelto;
	  //wrapper.nombreApoderado;
	  //wrapper.cedulaApoderado; 
    this.dev.registrarSolicitudDevolucion(wrapper).subscribe((data: any) => {
      if (data.entidad) {
        console.log( 'data Devolucion =>', data.entidad);
        this.wrapperDevolucion = data.entidad;
        this.setTipoHabilitantePorTipoCliente();
        this.sinNoticeService.setNotice("Guardado correctamente","success");
      } else {
        this.sinNoticeService.setNotice( "Ocurrio un error al guardar","warning"  );
      }
    })
  }
  public solicitarAprobacion(){
    this.pro.cambiarEstadoProceso(this.wrapperDevolucion.devolucion.id, this.wrapperDevolucion.proceso.proceso, 'PENDIENTE_APROBACION').subscribe( (data: any) =>{
      if(data.entidad && data.entidad.estadoProceso == 'PENDIENTE_APROBACION'){
        this.router.navigate(['negociacion/bandeja-operaciones']);
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
      //console.log(this.listTablaHeredero)
    } else {
      this.sinNoticeService.setNotice("Debe agregar el nombre del heredero", 'error');
    }
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
/* 
  decodeObjetoDatos(entrada) {
    return JSON.parse(atob(entrada))
  }
  encodeObjetos(entrada) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(entrada))))
  }
   */
} 