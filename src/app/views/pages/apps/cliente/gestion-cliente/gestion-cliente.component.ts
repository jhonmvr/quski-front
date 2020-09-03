import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { Page } from '../../../../../core/model/page';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { SeparacionBienesEnum } from '../../../../../core/enum/SeparacionBienesEnum';
import { ProfesionEnum } from '../../../../../core/enum/ProfesionEnum';
import { EstadoCivilEnum } from '../../../../../core/enum/EstadoCivilEnum';
import { NivelEstudioEnum } from '../../../../../core/enum/NivelEstudioEnum';
import { SectorEnum } from '../../../../../core/enum/SectorEnum';
import { OrigenIngresosEnum } from '../../../../../core/enum/OrigenIngresosEnum';
import { OcupacionInmuebleEnum } from '../../../../../core/enum/OcupacionInmuebleEnum';
import { GeneroEnum } from '../../../../../core/enum/GeneroEnum';
import { CargaFamiliarEnum } from '../../../../../core/enum/CargaFamiliarEnum';
import { RelacionDependenciaEnum } from '../../../../../core/enum/RelacionDependenciaEnum';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TbQoPatrimonioCliente } from '../../../../../core/model/quski/TbQoPatrimonioCliente';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { PaisesEnum } from '../../../../../core/enum/PaisesEnum';
import { ParroquiaService } from '../../../../../core/services/quski/parroquia.service';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { DireccionClienteService } from '../../../../../core/services/quski/direccion-cliente.service';
import { TbQoDireccionCliente } from '../../../../../core/model/quski/TbQoDireccionCliente';
import { PatrimonioService } from '../../../../../core/services/quski/patrimonio.service';
import { ReferenciaPersonalService } from '../../../../../core/services/quski/referenciaPersonal.service';
import { ParaDesarrolloEnum } from '../../../../../core/enum/ParaDesarrolloEnum';
import { SituacionTrackingEnum } from '../../../../../core/enum/SituacionTrackingEnum';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';

import { DialogCargarHabilitanteComponent } from './dialog-cargar-habilitante/dialog-cargar-habilitante.component';
import { ReferenciaParentescoEnum } from '../../../../../core/enum/ReferenciaParentescoEnum';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { CrearCliente } from '../../../../../core/model/softbank/CrearCliente';
import { ActividadEconomicaCliente } from '../../../../../core/model/softbank/ActividadEconomicaCliente';
import { ContactosCliente } from '../../../../../core/model/softbank/ContactosCliente';
import { CuentasBancariasCliente } from '../../../../../core/model/softbank/CuentasBancariasCliente';
import { TelefonosCliente } from '../../../../../core/model/softbank/TelefonosCliente';
import { EditarCliente } from '../../../../../core/model/softbank/EditarCliente';
import { SimulacionPrecancelacion } from '../../../../../core/model/softbank/SimulacionPrecancelacion';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { SimulacionTablaAmortizacion } from '../../../../../core/model/softbank/SimulacionTablaAmortizacion';
import { OperacionAbono } from '../../../../../core/model/softbank/OperacionAbono';
import { OperacionCancelar } from '../../../../../core/model/softbank/OperacionCancelar';
import { Rubros } from '../../../../../core/model/softbank/Rubros';
import { OperacionCrear } from '../../../../../core/model/softbank/OperacionCrear';
import { OperacionRenovar } from '../../../../../core/model/softbank/OperacionRenovar';
import { DatosImpCom } from '../../../../../core/model/softbank/DatosImpCom';
import { ConsultaSolca } from '../../../../../core/model/softbank/ConsultaSolca';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../../../../../src/environments/environment';
import { ClienteSoftbank } from '../../../../../core/model/softbank/ClienteSoftbank';
//import { TbQoNegociacion } from '../../../../../../../src/app/core/model/quski/TbQoNegociacion';




export interface User {
  name: string;
}

@Component({
  selector: 'kt-gestion-cliente',
  templateUrl: './gestion-cliente.component.html',
  styleUrls: ['./gestion-cliente.component.scss']
})
export class GestionClienteComponent implements OnInit {
  [x: string]: any;
  //private entidadNegociacion: TbQoNegociacion;
  public date;


  ubications: User[]; /////---------------->>>>>>>>>>>

  filteredOptions: Observable<User[]>;
  filteredOptions2: Observable<User[]>;
  filteredOptions3: Observable<User[]>;


  // VARIABLES DE BUSQUEDA EN NEGOCIACION
  public habilitarBtActualizar: boolean;
  public idDireccionDomicilio: string;
  public idDireccionLaboral: string;
  private idNegociacion: number;
  public provinciaD: string;
  public parroquiaD: string;
  public parroquiaL: string;
  public provinciaL: string;
  public cantonD: string;
  public cantonL: string;
  public id: string;

  // TABLA DE REFERENCIAS PERSONALES
  displayedColumns = ['Accion', 'N', 'NombresCompletos', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSource = new MatTableDataSource<TbReferencia>();
  // TABLA DE PATRIMONIO ACTIVO
  displayedColumnsActivo = ['Accion', 'Activo', 'Avaluo'];
  dataSourcePatrimonioActivo = new MatTableDataSource<TbQoPatrimonioCliente>();
  // TABLA DE PATRIMONIO PASIVO
  displayedColumnsPasivo = ['Accion', 'Pasivo', 'Avaluo'];
  dataSourcePatrimonioPasivo = new MatTableDataSource<TbQoPatrimonioCliente>();
  // TABLA DE INGRESO EGRESO
  displayedColumnsII = ['Accion', 'Is', 'Valor'];
  dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();
  // ARRAY CARGADOS DE SOFTBANK <-------------> ESPERANDO WEB SERVICES <----------------->
  public canal = [];
  public actividadeco = [];
  public ocupaciones = [];
  public profesiones = [];
  public parroquias = [];


  //BUSQUEDA POR UBICACION  
  public bParroqui = [];
  //public parroquia     = [];
  public bCantons = [];
  //public cantones      = []; 
  public bProvinces = [];
  //public provincias    = [];
  public uubicacion = [];
  public bUbicaciones = [];
  public bNombre = [];
  public localizacion;

  // ENUM ESPERANDO WEB SERVICE DE SOFTBANK
  listProfesion = Object.keys(ProfesionEnum);
  listPaises = Object.values(PaisesEnum);

  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public p = new Page();
  disableConsultar;
  disableConsultarSubject = new BehaviorSubject<boolean>(true);

  // VARIABLES DE TRACKING
  public horaInicioDatosCliente: Date;
  public horaAsignacionDatosCliente: Date = null;
  public horaAtencionDatosCliente: Date;
  public horaFinalDatosCliente: Date = null;
  public procesoDatosCliente: string;
  public actividad: string;



  // ENUMS
  public listReferencia = Object.values(ReferenciaParentescoEnum);
  public listRelacionDependencia = Object.keys(RelacionDependenciaEnum);
  public listSeparacionBienes = Object.values(SeparacionBienesEnum);
  public listTipoVivienda = Object.keys(OcupacionInmuebleEnum);
  public listParaDesarrolloEnum = Object.values(ParaDesarrolloEnum);
  public listOrigenIngreso = Object.values(OrigenIngresosEnum);
  public listCargaFamiliar = Object.values(CargaFamiliarEnum);
  public listNivel = Object.values(NivelEstudioEnum);
  public listEstadoCivil = Object.values(EstadoCivilEnum);
  public listGenero = Object.values(GeneroEnum)
  public listSector = Object.keys(SectorEnum);
  // OBJETOS DE ENTIDADES
  public ubicacionEntity = new Array();
  public ingresoEgresoGuardado: TbQoIngresoEgresoCliente;
  public ingresoEgreso: TbQoIngresoEgresoCliente;
  public patrimonioActivo: TbQoPatrimonioCliente;
  public patrimonioPasivo: TbQoPatrimonioCliente;
  public patrimonioCliente: TbQoPatrimonioCliente;
  public direccionDomicilio: TbQoDireccionCliente;
  public direccionLaboral: TbQoDireccionCliente;
  public referenciaGuardado: TbReferencia;
  public cliente: TbQoCliente;
  public referencia: TbReferencia;
  // FORM DATOS CLIENTES
  public formCliente: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public actividadEconomica = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public apellidoPaterno = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public fechaNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public lugarNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  //public lugarNacimiento0   = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  public nivelEducacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cargaFamiliar = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public canalContacto = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public primerNombre = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nacionalidad = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public genero = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public apellidoMaterno = new FormControl('', [Validators.maxLength(50)]);
  public segundoNombre = new FormControl('', [Validators.maxLength(50)]);
  public estadoCivil = new FormControl('', Validators.required);
  public separacionBienes = new FormControl('', []);
  public edad = new FormControl('', []);
  // FORM DE CONTACTO  
  public telefonoMovil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public email = new FormControl('', [Validators.email, Validators.maxLength(100), Validators.required]);
  public telefonoAdicional = new FormControl('', [Validators.minLength(9), Validators.maxLength(10)]);
  public telefonoOtro = new FormControl('', [Validators.minLength(9), Validators.maxLength(10)]);
  public telefonoFijo = new FormControl('', [Validators.minLength(9), Validators.maxLength(9)]);
  public formDatosContacto: FormGroup = new FormGroup({});
  // FORM DE  DOMICILIO 
  public referenciaUbicacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public callePrincipal = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public barrio = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundaria = new FormControl('', [Validators.maxLength(50)]);
  public formDatosDireccionDomicilio: FormGroup = new FormGroup({});
  public tipoVivienda = new FormControl('', Validators.required);
  public ubicacion = new FormControl('', Validators.required);
  public sector = new FormControl('', Validators.required);
  public drLgDo = new FormControl('', []);
  public drCrDo = new FormControl('', []);
  // FORM DE  OFICINA 
  public referenciaUbicacionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public callePrincipalO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public barrioO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundariaO = new FormControl('', [Validators.maxLength(50)]);
  public tipoViviendaO = new FormControl('', Validators.required);
  public formDatosDireccionLaboral: FormGroup = new FormGroup({});
  public ubicacionO = new FormControl('', Validators.required);
  public sectorO = new FormControl('', Validators.required);
  public drLgLb = new FormControl('', []);
  public drCrLb = new FormControl('', []);

  // FORM DE DATOS ECONOMICOS CLIENTE 
  public actividadEconomicaEmpresa = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public actividadEmpresa = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public origenIngresos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public profesion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public ocupacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cargo = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public formDatosEconomicos: FormGroup = new FormGroup({});
  public relacionDependencia = new FormControl('');
  // FORM DE INGRESO  
  public valorIngreso = new FormControl('', [Validators.maxLength(50)]);
  public formDatosIngreso: FormGroup = new FormGroup({});
  // FORM DE EGRESO 
  public valorEgreso = new FormControl('', [Validators.maxLength(50)]);
  public formDatosEgreso: FormGroup = new FormGroup({});
  // FORM DE PATRIMONIO ACTIVO
  public avaluoActivo = new FormControl('', [Validators.maxLength(50)]);
  public formDatosPatrimonioActivos: FormGroup = new FormGroup({});
  public activo = new FormControl('', [Validators.maxLength(50)]);
  // FORM DE PATRIMONIO PASIVO
  public avaluoPasivo = new FormControl('', [Validators.maxLength(50)]);
  public formDatosPatrimonioPasivos: FormGroup = new FormGroup({});
  public pasivo = new FormControl('', [Validators.maxLength(50)]);
  // FORM DE REFERENCIAS PERSONALES
  public telefonoMovilR = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoFijoR = new FormControl('', [Validators.minLength(9), Validators.maxLength(9)]);
  public nombresCompletosR = new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]);
  public formDatosReferenciasPersonales: FormGroup = new FormGroup({});
  public parentescoR = new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]);
  public direccionR = new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]);
  //GLOBAL DATASOURCE
  public element;
  //VARIABLES DE CALCULO INGRESO, EGRESO Y PATRIMONIO
  public totalActivo: number = 0;
  public totalPasivo: number = 0;
  public totalValorIngresoEgreso: number = 0;
  public valorValidacion: number = 0;



  /**
   * 
   * @param cas 
   * @param neg 
   * @param dialog 
   * @param sinNoticeService 
   * @param sp 
   * @param route 
   * @param subheaderService 
   * @param dh 
   * @param pr 
   * @param dc 
   * @param pm 
   * @param re 
   * @param tr 
   */
  constructor(
    ///>>>>>>>>>
    private _formBuilder: FormBuilder,
    ///>>>>>>>>

    private css: SoftbankService,
    private neg: NegociacionService,
    private cs: ClienteService,
    public dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
    private sp: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private dh: DocumentoHabilitanteService,
    //private pr: ParroquiaService,
    private dc: DireccionClienteService,
    private pm: PatrimonioService,
    private re: ReferenciaPersonalService,
    private tr: TrackingService
  ) {
    //LLAMADA A SERVICIO DE PARAMETROS
    this.sp.setParameter();
    this.getActividadEconomica();
    this.getCanalDeContacto();
    //this.cargarUbicacion();

    //FORM DATOS CLIENTES
    this.formCliente.addControl("identificacion", this.identificacion);
    this.formCliente.addControl("nombresCompletos ", this.nombresCompletos);
    this.formCliente.addControl("primerNombre ", this.primerNombre);
    this.formCliente.addControl("segundoNombre ", this.segundoNombre);
    this.formCliente.addControl("apellidoMaterno ", this.apellidoMaterno);
    this.formCliente.addControl("apellidoPaterno ", this.apellidoPaterno);
    this.formCliente.addControl("genero ", this.genero);
    this.formCliente.addControl("estadoCivil ", this.estadoCivil);
    this.formCliente.addControl("cargaFamiliar ", this.cargaFamiliar);
    this.formCliente.addControl("fechaNacimiento ", this.fechaNacimiento);
    this.formCliente.addControl("lugarNacimiento ", this.lugarNacimiento);
    this.formCliente.addControl("nacionalidad ", this.nacionalidad);
    this.formCliente.addControl("actividadEconomica  ", this.actividadEconomica);
    this.formCliente.addControl("separacionBienes  ", this.separacionBienes);
    this.formCliente.addControl("canalContacto  ", this.canalContacto);
    //FORM DE CONTACTO  
    this.formDatosContacto.addControl("telefonoFijo  ", this.telefonoFijo);
    this.formDatosContacto.addControl("telefonoAdicional", this.telefonoAdicional);
    this.formDatosContacto.addControl("telefonoMovil  ", this.telefonoMovil);
    this.formDatosContacto.addControl("telefonoOtro  ", this.telefonoOtro);
    this.formDatosContacto.addControl("email  ", this.email);
    // FORM DE  DOMICILIO 
    this.formDatosDireccionDomicilio.addControl("ubicacion   ", this.ubicacion);
    this.formDatosDireccionDomicilio.addControl("tipoVivienda    ", this.tipoVivienda);
    this.formDatosDireccionDomicilio.addControl("callePrincipal", this.callePrincipal);
    this.formDatosDireccionDomicilio.addControl("barrio    ", this.barrio);
    this.formDatosDireccionDomicilio.addControl("numeracion    ", this.numeracion);
    this.formDatosDireccionDomicilio.addControl("calleSecundaria", this.calleSecundaria);
    this.formDatosDireccionDomicilio.addControl("referenciaUbicacion", this.referenciaUbicacion);
    this.formDatosDireccionDomicilio.addControl("sector     ", this.sector);
    // FORM DE OFICINA
    this.formDatosDireccionLaboral.addControl("tipoViviendaO    ", this.tipoViviendaO);
    this.formDatosDireccionLaboral.addControl("ubicacionO     ", this.ubicacionO);
    this.formDatosDireccionLaboral.addControl("barrioO    ", this.barrioO);
    this.formDatosDireccionLaboral.addControl("sectorO      ", this.sectorO);
    this.formDatosDireccionLaboral.addControl("callePrincipalO    ", this.callePrincipalO);
    this.formDatosDireccionLaboral.addControl("numeracionO      ", this.numeracionO);
    this.formDatosDireccionLaboral.addControl("calleSecundariaO    ", this.calleSecundariaO);
    this.formDatosDireccionLaboral.addControl("referenciaUbicacionO", this.referenciaUbicacionO);
    // FORM DE DATOS ECONOMICOS CLIENTE 
    this.formDatosEconomicos.addControl("relacionDependencia", this.relacionDependencia);
    this.formDatosEconomicos.addControl("actividadEmpresa", this.actividadEmpresa);
    this.formDatosEconomicos.addControl("actividadCliente", this.actividadEconomicaEmpresa);
    this.formDatosEconomicos.addControl("ocupacion", this.ocupacion);
    this.formDatosEconomicos.addControl("cargo", this.cargo);
    this.formDatosEconomicos.addControl("profesion", this.profesion);
    this.formDatosEconomicos.addControl("origenIngresos", this.origenIngresos);
    // FORM DE INGRESO CLIENTE 
    this.formDatosIngreso.addControl("valorIngreso ", this.valorIngreso);
    // FORM DE EGRESO CLIENTE 
    this.formDatosEgreso.addControl("valorEgreso ", this.valorEgreso);
    // FORM DE PATRIMONIO CLIENTE 
    this.formDatosPatrimonioActivos.addControl("activo      ", this.activo);
    this.formDatosPatrimonioActivos.addControl("avaluoActivo", this.avaluoActivo);
    // FORM DE PATRIMONIO CLIENTE 
    this.formDatosPatrimonioPasivos.addControl("pasivo      ", this.pasivo);
    this.formDatosPatrimonioPasivos.addControl("avaluoPasivo", this.avaluoPasivo);
    // FORM DE REFERENCIAS PERSONALES
    this.formDatosReferenciasPersonales.addControl("nombresCompletosR", this.nombresCompletosR);
    this.formDatosReferenciasPersonales.addControl("parentescoR      ", this.parentescoR);
    this.formDatosReferenciasPersonales.addControl("direccionR       ", this.direccionR);
    this.formDatosReferenciasPersonales.addControl("telefonoMovilR   ", this.telefonoMovilR);
    this.formDatosReferenciasPersonales.addControl("telefonoFijoR    ", this.telefonoFijoR);
    //CAMPOS DE LECTURA
    this.nombresCompletos.disable();
    this.separacionBienes.disable();
    this.relacionDependencia.disable();
    this.actividadEmpresa.disable();
    this.cargo.disable();
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.ubications.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    return this.ubications.filter(Dd => Dd.name.toLowerCase().indexOf(filterValue) === 0);
  }
  

  ngOnInit() {
    this.filteredOptions = this.lugarNacimiento.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : name),
        map(name => name ? this._filter(name) : this.ubications)
      );
    this.filteredOptions2 = this.lugarNacimiento.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : name),
      map(name => name ? this._filter(name) : this.ubications)
    );
    this.filteredOptions3 = this.lugarNacimiento.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : name),
      map(name => name ? this._filter(name) : this.ubications)
    );


    this.loading = this.loadingSubject.asObservable();
    this.habilitarBtActualizar = false;
    this.implementacionServiciosSoftbankTEST();
    //SET VALORES POR DEFECTO DE CHECKS
    this.drLgDo.setValue(true);
    this.drCrDo.setValue(true);
    this.drLgLb.setValue(false);
    this.drCrLb.setValue(false);



    //TRACKING

    this.capturaHoraInicio();

    // BUSQUEDA DE CLIENTE POR NEGOCIACION
    this.llamarCatalogos();
    this.clienteNegociacion();
    this.subheaderService.setTitle("Gestion de Clientes");
  }


  /**
   * @description METODO QUE BUSCA EL CLIENTE MEDIANTE LA VARIABLE DE ID NEGOCIACION
   * @description PASADA POR this.route.paramMap
   */
  clienteNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      data.params.id
      if (data.params.id) {
        this.idNegociacion = data.params.id;
        this.neg.findNegociacionById(this.idNegociacion).subscribe((data: any) => {
          if (data.entidad) {
            this.situacion = data.entidad.situacion
            console.log('SITUACION', this.situacion);
            this.capturaHoraAsignacion();
            this.capturaHoraAtencion()

            this.id = data.entidad.tbQoCliente.cedulaCliente;
            this.cs.findClienteByIdentificacion(this.id).subscribe((data: any) => {
              this.loadingSubject.next(false);
              if (data.entidad) {

                this.id = data.entidad.id;
                this.nombresCompletos.setValue(data.entidad.primerNombre + ' ' + data.entidad.segundoNombre
                  + ' ' + data.entidad.apellidoPaterno + ' ' + data.entidad.apellidoMaterno);
                this.identificacion.setValue(data.entidad.cedulaCliente);
                this.primerNombre.setValue(data.entidad.primerNombre);
                this.segundoNombre.setValue(data.entidad.segundoNombre);
                this.nivelEducacion.setValue(data.entidad.nivelEducacion);
                this.apellidoPaterno.setValue(data.entidad.apellidoPaterno);
                this.apellidoMaterno.setValue(data.entidad.apellidoMaterno);
                this.genero.setValue(data.entidad.genero);
                this.estadoCivil.setValue(data.entidad.estadoCivil);
                this.cargaFamiliar.setValue(data.entidad.cargasFamiliares);
                this.fechaNacimiento.setValue(data.entidad.fechaNacimiento);
                this.separacionBienes.setValue(data.entidad.separacionBienes);
                this.nacionalidad.setValue(data.entidad.nacionalidad);
                this.lugarNacimiento.setValue(data.entidad.lugarNacimiento);
                this.edad.setValue(data.entidad.edad);
                this.telefonoFijo.setValue(data.entidad.telefonoFijo);
                this.telefonoMovil.setValue(data.entidad.telefonoMovil);
                this.telefonoAdicional.setValue(data.entidad.telefonoAdicional);
                this.telefonoOtro.setValue(data.entidad.telefonoTrabajo);
                this.canalContacto.setValue(data.entidad.canalContacto);
                let email: string = data.entidad.email;
                //console.log("origenIngresos ===> "+ JSON.stringify(data.entidad));
                this.origenIngresos.setValue(data.entidad.origenIngreso);
                this.actividadEconomica.setValue(data.entidad.actividadEconomica);
                this.actividadEmpresa.setValue(data.entidad.nombreEmpresa);
                this.actividadEconomicaEmpresa.setValue(data.entidad.actividadEconomicaEmpresa);
                this.relacionDependencia.setValue(data.entidad.relacionDependencia);
                this.cargo.setValue(data.entidad.cargo);
                this.profesion.setValue(data.entidad.profesion);
                this.ocupacion.setValue(data.entidad.ocupacion);
                email = email.toLocaleUpperCase();
                //console.log("email formateado ===> ", email);
                this.email.setValue(email);


                this.dc.findDireccionByIdCliente(this.id, "DOMICILIO").subscribe((data: any) => {
                  if (data.entidad) {
                    let direccion: TbQoDireccionCliente = data.entidad;
                    this.idDireccionDomicilio = direccion.id
                    this.ubicacion.setValue(direccion.parroquia.toUpperCase());
                    this.provinciaD = direccion.provincia.toUpperCase();
                    this.parroquiaD = direccion.parroquia.toUpperCase();
                    this.cantonD = direccion.canton.toUpperCase();
                    this.tipoVivienda.setValue(direccion.tipoVivienda.toUpperCase());
                    this.callePrincipal.setValue(direccion.callePrincipal.toUpperCase());
                    this.barrio.setValue(direccion.barrio.toUpperCase());
                    this.numeracion.setValue(direccion.numeracion.toUpperCase());
                    this.calleSecundaria.setValue(direccion.calleSegundaria.toUpperCase());
                    this.referenciaUbicacion.setValue(direccion.referenciaUbicacion.toUpperCase());
                    this.sector.setValue(direccion.sector.toUpperCase());
                    this.dc.findDireccionByIdCliente(this.id, "LABORAL").subscribe((data: any) => {
                      if (data.entidad) {
                        let direccionO: TbQoDireccionCliente = data.entidad;
                        this.idDireccionLaboral = direccionO.id;
                        this.ubicacionO.setValue(direccionO.parroquia.toUpperCase());
                        this.cantonL = direccionO.canton.toUpperCase();
                        this.provinciaL = direccionO.provincia.toUpperCase();
                        this.parroquiaL = direccionO.parroquia.toUpperCase();
                        this.tipoViviendaO.setValue(direccionO.tipoVivienda.toUpperCase());
                        this.callePrincipalO.setValue(direccionO.callePrincipal.toUpperCase());
                        this.barrioO.setValue(direccionO.barrio.toUpperCase());
                        this.numeracionO.setValue(direccionO.numeracion.toUpperCase());
                        this.calleSecundariaO.setValue(direccionO.calleSegundaria.toUpperCase());
                        this.referenciaUbicacionO.setValue(direccionO.referenciaUbicacion.toUpperCase());
                        this.sectorO.setValue(direccionO.sector.toUpperCase());
                        this.habilitarBtActualizar = true;

                        this.capturaHoraAsignacion();
                        this.capturaHoraAtencion();

                        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
                        this.loadingSubject.next(false);
                      } else {
                        this.idDireccionLaboral = null
                        this.loadingSubject.next(false);
                      }
                    }, error => {
                      this.loadingSubject.next(false);
                      if (JSON.stringify(error).indexOf("codError") > 0) {
                        let b = error.error;
                        this.sinNoticeService.setNotice(b.msgError, 'error');
                      } else {
                        this.sinNoticeService.setNotice("ERROR AL CARGAR DIRECCION LABORAL", 'error');
                      }
                    });

                  } else {
                    this.idDireccionDomicilio = null;
                    this.loadingSubject.next(false);
                  }

                }, error => {
                  this.loadingSubject.next(false);
                  if (JSON.stringify(error).indexOf("codError") > 0) {
                    let b = error.error;
                    this.sinNoticeService.setNotice(b.msgError, 'error');
                  } else {
                    this.sinNoticeService.setNotice("ERROR AL CARGAR DIRECCION DE DOMICILIO", 'error');
                  }
                });

              } else {
                this.limpiarCampos();
                this.nombresCompletos.setValue('');
              }
            }, error => {
              this.loadingSubject.next(false);
              if (JSON.stringify(error).indexOf("codError") > 0) {
                let b = error.error;
                this.sinNoticeService.setNotice(b.msgError, 'error');
              } else {
                this.sinNoticeService.setNotice("ERROR AL CARGAR", 'error');
              }
            });
          } else {
            this.capturaHoraAsignacion();
            this.capturaHoraAtencion()
          }
        });
      } else {
        this.capturaHoraAsignacion();
        this.capturaHoraAtencion()
      }
    });
  }
  /**
   * 
   * @description METODO QUE CALCULA LA EDAD
   */
  onChangeFechaNacimiento() {
    this.loadingSubject.next(true);
    //console.log("VALOR DE LA FECHA" + this.fechaNacimiento.value);
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    //console.log("FECHA SELECCIONADA" + fechaSeleccionada);
    if (fechaSeleccionada) {
      this.getDiffFechas(fechaSeleccionada, "dd/MM/yyy");
    } else {
      this.sinNoticeService.setNotice(
        "El valor de la fecha es nulo",
        "warning"
      );
      this.loadingSubject.next(false);
    }
  }
  /**
   * 
   * @param fecha 
   * @param format 
   * @description CALCULA LA DIFERENCIA ENTRE LA FECHA PASADA Y LA ACTUAL.
   * @description IMPLEMENTA UN SERVICIO DEL CORE ASINCRONO.
   */
  getDiffFechas(fecha: Date, format: string) {
    this.loadingSubject.next(true);
    const convertFechas = new RelativeDateAdapter();
    this.sp
      .getDiffBetweenDateInicioActual(
        convertFechas.format(fecha, "input"),
        format
      )
      .subscribe(
        (rDiff: any) => {
          const diff: YearMonthDay = rDiff.entidad;
          this.edad.setValue(diff.year);
          const edad = this.edad.value;
          if (edad != undefined && edad != null && edad < 18) {
            this.edad
              .get("edad")
              .setErrors({ "server-error": "error" });
          }
          this.loadingSubject.next(false);
        },
        error => {
          if (JSON.stringify(error).indexOf("codError") > 0) {
            const b = error.error;
            this.sinNoticeService.setNotice(b.msgError, "error");
          } else {
            this.sinNoticeService.setNotice(
              "Error obtener diferencia de fechas",
              "error"
            );
            //console.log(error);
          }
          this.loadingSubject.next(false);
        }
      );
  }
  /**
   * @description TRAE UNA LISTA DE CANALES DE CONTACTO DEL SERVIDOR.
   * @description IMPLEMENTA UN METODO ASINCRONO
   */
  getCanalDeContacto() {
    this.sp.findByNombreTipoOrdered("", "CANAL", "Y").subscribe((wrapper: any) => {
      //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        //console.log("lista  >>>>" + JSON.stringify( wrapper.entidades ));
        for (let i = 0; i < wrapper.entidades.length; i++) {
          this.canal.push(wrapper.entidades[i].valor.toUpperCase());
          //console.log("lista canal >>>>" + JSON.stringify( this.canal ));
        }
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice("ERROR AL CARGAR LOS CANALES DE CONTACTO", 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: "Error " + error.statusText + " - " + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice("Error al cargar Canales de contacto", 'error');
      }
    });
  }
  /**
   *  @description TRAE UNA LISTA DE ACTIVIDADES ECONOMICAS DEL SERVIDOR.
   *  @description IMPLEMENTA UN METODO ASINCRONO
   */
  getActividadEconomica() {
    this.sp.findByNombreTipoOrdered("", "ACT-ECON", "Y").subscribe((wrapper: any) => {
      //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        //console.log("lista  >>>>" + JSON.stringify( wrapper.entidades ));
        for (let i = 0; i < wrapper.entidades.length; i++) {
          this.actividadeco.push(wrapper.entidades[i].valor.toUpperCase());
          //console.log("lista canal >>>>" + JSON.stringify( this.canal ));
        }
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice("Error al cargar parametros de Actividad Economica", 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: "Error " + error.statusText + " - " + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice("Error al cargar Actividad Economica", 'error');
      }
    });
  }
  /**
   * 
   * @param pfield 
   * @description MENSAJES DE ERRORES.
   */
  getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorEmail = 'Correo Incorrecto';
    const errorNumero = 'Ingreso solo numeros';
    const errorFormatoIngreso = 'Use el formato : 0.00';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    let errorrequiredo = "Ingresar valores";

    if (pfield && pfield === "identificacion") {
      const input = this.formCliente.get("identificacion");
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

    //Validaciones de ingreso-egreso
    if (pfield && pfield == "activo") {
      return this.activo.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "avaluo") {
      return this.avaluoActivo.hasError('required') ? errorrequiredo : this.avaluoActivo.hasError('invalido') ? errorFormatoIngreso : this.avaluoActivo.hasError('min') ? 'Valor invalido' : ' ';
    }
    //Validaciones de datos personales
    if (pfield && pfield === 'apellidoMaterno') {
      const input = this.apellidoMaterno;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'apellidoPaterno') {
      const input = this.apellidoPaterno;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'genero') {
      const input = this.genero;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'estadoCivil') {
      const input = this.estadoCivil;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'cargaFamiliar') {
      const input = this.cargaFamiliar;
      return input.hasError('required') ? errorRequerido : '';

    }
    if (pfield && pfield === 'fechaNacimiento') {
      const input = this.fechaNacimiento;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'lugarNacimiento') {
      const input = this.lugarNacimiento;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'nacionalidad') {
      const input = this.nacionalidad;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'canalContacto') {
      const input = this.canalContacto;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'email') {
      const input = this.email;
      return input.hasError('email')
        ? errorEmail
        : input.hasError('maxlength')
          ? errorLogitudExedida
          : '';
    }
    if (pfield && pfield === 'telefonoFijo') {
      const input = this.telefonoFijo;
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    }
    if (pfield && pfield === 'telefonoMovil') {
      const input = this.telefonoMovil;
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    }
    if (pfield && pfield === 'telefonoAdicional') {
      const input = this.telefonoAdicional;
      return input.hasError('pattern')
        ? errorNumero
        : input.hasError('maxlength')
          ? errorLogitudExedida
          : input.hasError('minlength')
            ? errorInsuficiente
            : '';
    }
    if (pfield && pfield === 'telefonoOtro') {
      const input = this.telefonoOtro;
      return input.hasError('pattern')
        ? errorNumero
        : input.hasError('maxlength')
          ? errorLogitudExedida
          : input.hasError('minlength')
            ? errorInsuficiente
            : '';
    }
    //Validacion driccion domicilio

    if (pfield && pfield === 'ubicacion') {
      const input = this.ubicacion;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'tipoVivienda') {
      const input = this.tipoVivienda;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'callePrincipal') {
      const input = this.callePrincipal;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'barrio') {
      const input = this.barrio;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'numeracion') {
      const input = this.numeracion;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'calleSecundaria') {
      const input = this.calleSecundaria;
      return input.hasError('required') ? errorRequerido : '';

    }
    if (pfield && pfield === 'referenciaUbicacion') {
      const input = this.referenciaUbicacion;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'sector') {
      const input = this.sector;
      return input.hasError('required') ? errorRequerido : '';
    }
    //Validacion driccion laboral

    if (pfield && pfield === 'ubicacionO') {
      const input = this.ubicacionO;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'barrioO') {
      const input = this.barrioO;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'tipoViviendaO') {
      const input = this.tipoViviendaO;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'sectorO') {
      const input = this.sectorO;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'callePrincipalO') {
      const input = this.callePrincipalO;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'numeracionO') {
      const input = this.numeracionO;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'calleSecundariaO') {
      const input = this.calleSecundariaO;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'referenciaUbicacionO') {
      const input = this.referenciaUbicacionO;
      return input.hasError('required') ? errorRequerido : '';
    }
    //Datos economicos clientes
    if (pfield && pfield === 'actividadEmpresa') {
      const input = this.actividadEmpresa;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'actividadEconomicaEmpresa') {
      const input = this.actividadEconomicaEmpresa;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'ocupacion') {
      const input = this.ocupacion;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'cargo') {
      const input = this.cargo;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'profesion') {
      const input = this.profesion;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'origenIngresos') {
      const input = this.origenIngresos;
      return input.hasError('required') ? errorRequerido : '';
    }
  }
  cargarComponenteHabilitante() {
    if (this.id != null && this.id != "") {
      let idReferenciaHab = this.id;
      const dialogRef = this.dialog.open(DialogCargarHabilitanteComponent, {
        width: "auto-max",
        height: "auto-max",
        data: idReferenciaHab
      });
      dialogRef.afterClosed().subscribe(r => {
        if (r) {
          //console.log("Data de subscribe ---> " + r);
        }
      });
    } else {
      this.sinNoticeService.setNotice("ERROR NO HAY CLIENTE PARA ACTUALIZAR LOS HABILITANTES", 'error');
    }
  }
  /**
   * @description MEOTOD QUE SETEA VALORES EN CAMPOS DE:
   * @description RELACION DE DEPENDENCIA, CARGO Y ACTIVIDAD EMPRESA.
   */
  setRelacionDependencia() {
    this.cargo.enable();
    this.actividadEmpresa.enable();
    this.cargo.setValue('');
    this.actividadEmpresa.setValue('');
    const ingresoObtenido = this.origenIngresos.value;
    //console.log(">>>>>>>>>>>>>>>>>>>> origen ingresos ",ingresoObtenido);
    if (ingresoObtenido == OrigenIngresosEnum.EMPLEADO_PRIVADO.toString() || ingresoObtenido == OrigenIngresosEnum.EMPLEADO_PUBLICO.toString()) {
      this.relacionDependencia.setValue(RelacionDependenciaEnum.SI);
    } else {
      this.relacionDependencia.setValue(RelacionDependenciaEnum.NO);
      this.cargo.setValue('NO APLICA');
      this.actividadEmpresa.setValue('NO APLICA');
      this.cargo.disable();
      this.actividadEmpresa.disable();
    }
  }
  /**
   * @description METODO QUE HABILITA CAMPOS DE SEPARACION DE BIENES. 
   */
  habilitarCampo() {
    this.separacionBienes.setValue('');
    const estadoCivilIngresado = this.estadoCivil.value;
    if (estadoCivilIngresado == EstadoCivilEnum.CASADO.toString()) {
      this.separacionBienes.setValidators([Validators.required]);
      this.separacionBienes.enable();
      this.sinNoticeService.setNotice("SELECCIONE LA OPCION DE SEPARACIÒN DE BIENES ", 'warning');
    } else {
      this.separacionBienes.disable();
    }
  }
  /**
   * @description FUNCION EN BOTON QUE AGREGA UN NUEVO ACTIVO A LA TABLA DE PATRIMONIO ACTIVOS
   */
  nuevoActivo() {
    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);
    this.patrimonioCliente = new TbQoPatrimonioCliente;
    if (this.formDatosPatrimonioActivos.valid) {
      if (this.avaluoActivo.value > this.valorValidacion && this.activo.value != "" && this.activo.value != null) {
        this.patrimonioCliente.avaluo = this.avaluoActivo.value;
        this.patrimonioCliente.activos = this.activo.value.toUpperCase();
        if (this.element) {
          const index = this.dataSourcePatrimonioActivo.data.indexOf(this.element);
          this.dataSourcePatrimonioActivo.data.splice(index, 1);
          const data = this.dataSourcePatrimonioActivo.data;
          this.dataSourcePatrimonioActivo.data = data;
        }
        const data = this.dataSourcePatrimonioActivo.data;
        data.push(this.patrimonioCliente);
        this.dataSourcePatrimonioActivo.data = data;
        this.element = null;
        this.calcularActivo();
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALORES AGREAGADOS PARA UN NUEVO PASIVO NO ES VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'warning');
    }
  }
  /**
   * @description FUNCION EN BOTON QUE AGREGA UN NUEVO PASIVO A LA TABLA DE PATRIMONIO PASIVOS
   */
  nuevoPasivo() {


    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);


    this.patrimonioCliente = new TbQoPatrimonioCliente;
    if (this.formDatosPatrimonioPasivos.valid) {
      if (this.avaluoPasivo.value > this.valorValidacion && this.pasivo.value != null && this.pasivo.value != "") {
        this.patrimonioCliente.avaluo = this.avaluoPasivo.value;
        this.patrimonioCliente.pasivos = this.pasivo.value.toUpperCase();
        if (this.element) {
          const index = this.dataSourcePatrimonioPasivo.data.indexOf(this.element);
          this.dataSourcePatrimonioPasivo.data.splice(index, 1);
          const data = this.dataSourcePatrimonioPasivo.data;
          this.dataSourcePatrimonioPasivo.data = data;
        }
        const data = this.dataSourcePatrimonioPasivo.data;
        data.push(this.patrimonioCliente);
        this.dataSourcePatrimonioPasivo.data = data;
        this.element = null;
        this.calcularPasivo();
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALORES AGREAGADOS PARA UN NUEVO PASIVO NO ES VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
    }
  }
  /**
   * @description FUNCION EN BOTON QUE AGREGA UN NUEVO INGRESO A LA TABLA DE INGRESOS / EGRESOS 
   */
  nuevoIngreso() {
    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);
    this.valorEgreso.setValue(null);
    this.ingresoEgreso = new TbQoIngresoEgresoCliente;
    if (this.formDatosIngreso.valid) {
      if (this.valorIngreso.value > this.valorValidacion) {
        this.ingresoEgreso.valor = this.valorIngreso.value;
        this.ingresoEgreso.esIngreso = true;
        this.ingresoEgreso.esEgreso = false;
        if (this.element) {
          const index = this.dataSourceIngresoEgreso.data.indexOf(this.element);
          this.dataSourceIngresoEgreso.data.splice(index, 1);
          const data = this.dataSourceIngresoEgreso.data;
          this.dataSourceIngresoEgreso.data = data;
        }
        const data = this.dataSourceIngresoEgreso.data;
        data.push(this.ingresoEgreso);
        this.dataSourceIngresoEgreso.data = data;
        this.element = null;
        this.calcularIngresoEgreso();

        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALOR DEL INGRESO NO VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'warning');
    }
  }
  /**
   * @description FUNCION EN BOTON QUE AGREGA UN NUEVO EGRESO A LA TABLA DE INGRESOS / EGRESOS 
   */
  nuevoEgreso() {
    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);
    this.valorIngreso.setValue(null);
    this.ingresoEgreso = new TbQoIngresoEgresoCliente;
    if (this.formDatosEgreso.valid) {
      if (this.valorEgreso.value > this.valorValidacion) {
        this.ingresoEgreso.valor = this.valorEgreso.value;
        this.ingresoEgreso.esIngreso = false;
        this.ingresoEgreso.esEgreso = true;
        if (this.element) {
          const index = this.dataSourceIngresoEgreso.data.indexOf(this.element);
          this.dataSourceIngresoEgreso.data.splice(index, 1);
          const data = this.dataSourceIngresoEgreso.data;
          this.dataSourceIngresoEgreso.data = data;
        }
        const data = this.dataSourceIngresoEgreso.data;
        data.push(this.ingresoEgreso);
        this.dataSourceIngresoEgreso.data = data;
        this.element = null;
        this.calcularIngresoEgreso();
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALOR DEL EGRESO NO VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
    }
  }
  /**
   * @description METODO QUE CALCULA EL NUEVO VALOR DEL ACTIVO TOTAL CUANDO SE AGREA A LA TABLA 
   */
  calcularActivo() {
    this.totalActivo = 0;
    if (this.dataSourcePatrimonioActivo.data) {
      this.dataSourcePatrimonioActivo.data.forEach(element => {
        this.totalActivo = Number(this.totalActivo) + Number(element.avaluo);
      });
    }
  }
  /**
   * @description METODO QUE CALCULA EL NUEVO VALOR DEL PASIVO TOTAL CUANDO SE AGREA A LA TABLA 
   */
  calcularPasivo() {
    this.totalPasivo = 0;
    if (this.dataSourcePatrimonioPasivo.data) {
      this.dataSourcePatrimonioPasivo.data.forEach(element => {
        this.totalPasivo = Number(this.totalPasivo) + Number(element.avaluo);
      });
    }
  }
  /**
   * @description METODO QUE CALCULA EL NUEVO VALOR DEL INGRESO / EGRESO TOTAL CUANDO SE AGREA A LA TABLA 
   */
  calcularIngresoEgreso() {
    this.totalValorIngresoEgreso = 0;
    if (this.dataSourceIngresoEgreso.data) {
      this.dataSourceIngresoEgreso.data.forEach(element => {
        if (element.esIngreso && element.esEgreso == false) {
          this.totalValorIngresoEgreso = Number(this.totalValorIngresoEgreso) + Number(element.valor);
        } else {
          if (element.esIngreso == false && element.esEgreso) {
            this.totalValorIngresoEgreso = Number(this.totalValorIngresoEgreso) - Number(element.valor);

          } else {
            this.sinNoticeService.setNotice("ERROR DE DESARROLLO", 'error');
          }
        }

      });
      if (this.totalValorIngresoEgreso >= 5000) {
        this.sinNoticeService.setNotice("INGRESO NETO SOBREPASA LOS $5000", 'error');

      }

    }
  }

  /**
   * @param element 
   * @description METODO QUE BORRA UN INGRESO O EGRESO DE LA TABLA
   */
  deleteIngresoEgreso(element) {
    const index = this.dataSourceIngresoEgreso.data.indexOf(element);
    this.dataSourceIngresoEgreso.data.splice(index, 1);
    const data = this.dataSourceIngresoEgreso.data;
    this.dataSourceIngresoEgreso.data = data;
    this.calcularIngresoEgreso();
  }
  /**
   * @param element 
   * @description METODO QUE BORRA UN ACTIVO DE LA TABLA
   */
  deleteActivo(element) {
    const index = this.dataSourcePatrimonioActivo.data.indexOf(element);
    this.dataSourcePatrimonioActivo.data.splice(index, 1);
    const data = this.dataSourcePatrimonioActivo.data;
    this.dataSourcePatrimonioActivo.data = data;
    this.calcularActivo();
  }
  /**
   * @param element 
   * @description METODO QUE BORRA UN PASIVO O EGRESO DE LA TABLA
   */
  deletePasivo(element) {
    const index = this.dataSourcePatrimonioPasivo.data.indexOf(element);
    this.dataSourcePatrimonioPasivo.data.splice(index, 1);
    const data = this.dataSourcePatrimonioPasivo.data;
    this.dataSourcePatrimonioPasivo.data = data;
    this.calcularPasivo();
  }
  /**
   * @param element 
   * @description METODO QUE EDITA UN INGRESO O EGRESO DE LA TABLA
   */
  editar(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    //console.log(JSON.stringify(element));
    if (element.esIngreso && element.esEgreso == false) {
      this.valorIngreso.setValue(element.valor);
    } else {
      if (element.esIngreso == false && element.esEgreso) {
        this.valorEgreso.setValue(element.valor);
      } else {
        this.sinNoticeService.setNotice("ERROR DE DESARROLLO", 'error');
      }
    }
  }

  /**
   * 
   */
  implementacionServiciosSoftbankTEST() {

    //Cliente
    //this.testConsultarClienteCS();
    //this.testConsultarDireccionesTelefonosClienteCS(); 
    //this.testConsultarIngresosEgresosClienteCS(); 
    //this.testConsultarReferenciasClienteCS(); 
    //this.testCrearClienteCS();  
    //this.testEditarClienteCS(); 


    //Catalogo
    this.testConsultarDivicionPoliticaCS();
    //this.testConsultarAgenciasCS(); 
    //this.testConsultarAsesoresCS();
    //this.testConsultarActividadEconomicaCS(); 
    //this.testConsultarEducacionCS(); 
    //this.testConsultarRubroPrestamosCS(); 
    //this.testConsultarSectorViviendaCS(); 
    //this.testConsultarEstadosCivilesCS(); 
    //this.testConsultarViviendaCS(); 
    //this.testConsultarProfesionesCS(); 
    //this.testConsultarTipoIdentificacionCS(); 
    //this.testConsultarBancosCS(); 
    //this.testConsultarTipoReferenciaCS(); 
    //this.testConsultarTipoPrestamosCS(); 
    //this.testConsultarTipoCarteraCS(); 
    //this.testConsultarTablaAmortizacionCS(); 
    //this.testConsultarDivicionPoliticaConsolidadaCS(); 

    // Prestamo
    //this.testConsultaTablaAmortizacionOperacionAprobadaCS(); 
    //this.testSimularPrecancelacionCS(); 
    //this.testOperacionCancelarCS(); 
    //this.testOperacionAbonoCS(); 
    //this.testOperacionConsultaCS(); 
    //this.testConsultaRiesgoAcumuladoCS(); 
    //this.testConsultaRubrosCS(); 

    // Credito Operacion
    //this.testOperacionCrearCS(); 
    //this.testOperacionRenovarCS(); 
    //this.testOperacionAprobarCS();
    //this.testOperacionNegarCS();

    //Credito Simulacion
    //this.testSimularTablaAmortizacionCS(); 

    // Credito Consulta
    //this.testCalcularSolcaCS(); 
  }
  // CLIENTE
  /*testConsultarClienteCS() {
    let entidadConsultaCliente = new ConsultaCliente();
    //entidadConsultaCliente.identificacion = "1311066441";
    //entidadConsultaCliente.idTipoIdentificacion = 1;
    this.css.consultarClienteCS(entidadConsultaCliente).subscribe((data: any) => {
      if (data) {
        //console.log("consultarClienteCS --> Funciona");
        console.log("Consulta del cliente en Cloustudio --> " + JSON.stringify(data) );
      } else {
        this.sinNoticeService.setNotice("No me trajo datos 'entidadConsultaCliente'", 'error');
      }

    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("Error no fue cacturado en 'consultarClienteCS' :(", 'error');

      }
    });
  }*/
  
  testConsultarDivicionPoliticaCS() {

    this.css.consultarDivicionPoliticaCS().subscribe((data: any) => {
      
        //console.log("funciona -----> consultarDivicionPoliticaCS");
        //console.log("Consulta de catalogos de Divicion Politica ----->" + JSON.stringify(data));
      if (!data.existeError) {
        this.localizacion = data.catalogo;
        //console.log(" desde aqui >>> ",this.localizacion)
        this.bprovinces = this.localizacion.filter(e => e.tipoDivision == "PROVINCIA")
        /*for (let i = 0; i < this.bprovinces.length; i++) {
        this.provincias.push(this.bprovinces [i].nombre);
        // console.log(" PROVINCIA >>>",this.provincias)
        }*/

        this.bCantons = this.localizacion.filter(e => e.tipoDivision == 'CANTON')
        /*for (let j = 0; j < this.bCantons.length; j++) {
        this.cantones.push(this.bCantons [j].nombre);
        //console.log(" CANTON >>>",this.cantones)
        }*/

        this.bParroqui = this.localizacion.filter(e => e.tipoDivision == "PARROQUIA")
        /*for (let x = 0; x < this.bParroqui.length; x++) {
        this.parroquia.push(this.bParroqui [x].nombre);
       // console.log(" PARROQUIAS >>>",this.parroquia)
        }*/


        let ubicacion = [];
        ubicacion = this.bParroqui.map(parro => {
          const cant = this.bCantons.find(c => c.id == parro.idPadre) || {};
          const pro = this.bprovinces.find(p => p.id == cant.idPadre) || {};

          return { nombre: parro.nombre + " / " + cant.nombre + " / " + pro.nombre, idParroquia: parro.id, idCanton: cant.id, idProvincia: pro.id, 
                  parroquia: parro.nombre,
                  canton:cant.nombre,
                  provincia:pro.nombre};
        }
        );
        this.uubicacion = ubicacion;
        this.bNombre = this.uubicacion.filter(e => e.nombre)
        for (let i = 0; i < this.bNombre.length; i++) {
          this.bUbicaciones.push(this.bNombre[i].nombre);
          //console.log("<<<ubicaciones>>>>>>>",this.bUbicaciones);
        };
        this.ubications = new Array<User>();
        this.bUbicaciones.forEach(e => {
          let user = {} as User;
          user.name = e;
          this.ubications.push(user)
        });
      } else {
        console.log("No me trajo data de catalogos de Divicion Politica ----->" + JSON.stringify(data));
      } error => {
        if (JSON.stringify(error).indexOf("codError") > 0) {
          let b = error.error;
          this.sinNoticeService.setNotice(b.setmsgError, 'error');
        } else {
          this.sinNoticeService.setNotice("No se pudo capturar el error :c", 'error');
        }
      }
    });
  }
  
  /**
   * @param element 
   * @description METODO QUE EDITA UN ACTIVO DE LA TABLA
   */
  editarActivo(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.activo.setValue(element.activos);
    this.avaluoActivo.setValue(element.avaluo);
  }
  /**
   * @param element 
   * @description METODO QUE EDITA UN PASIVO DE LA TABLA
   */
  editarPasivo(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.pasivo.setValue(element.pasivos);
    this.avaluoPasivo.setValue(element.avaluo);
  }
  /**
   * @description METODO INTERNO QUE LIMPIA LOS CAMPOS
   */
  limpiarCampos() {
    Object.keys(this.formDatosPatrimonioActivos.controls).forEach((name) => {
      let control = this.formDatosPatrimonioActivos.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formDatosPatrimonioPasivos.controls).forEach((name) => {
      let control = this.formDatosPatrimonioPasivos.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formDatosReferenciasPersonales.controls).forEach((name) => {
      let control = this.formDatosReferenciasPersonales.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formDatosIngreso.controls).forEach((name) => {
      let control = this.formDatosIngreso.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.updateValueAndValidity();
    });
    Object.keys(this.formDatosEgreso.controls).forEach((name) => {
      let control = this.formDatosEgreso.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.updateValueAndValidity();
    });
  }
  /**
   * @description METODO QUE AGREGA UNA NUEVA REFERENCIA A LA TABLA DE REFERENCIA
   */
  nuevaReferencia() {
    this.referencia = new TbReferencia;
    if (this.formDatosReferenciasPersonales.valid) {
      if (this.nombresCompletosR.value != null && this.nombresCompletosR.value != "") {
        if (this.parentescoR.value != null && this.parentescoR.value != "") {
          if (this.direccionR.value != null && this.direccionR.value != "") {
            let a = 0;
            let b = 0;
            if (this.telefonoMovilR.value != null && this.telefonoMovilR.value != "") {
              a = Number(this.telefonoMovilR.value);
            }
            if (this.telefonoFijoR.value && this.telefonoFijoR.value != "") {
              b = Number(this.telefonoFijoR.value);
            }
            if (a > 0 && b > 0) {
              this.referencia.nombresCompletos = this.nombresCompletosR.value.toUpperCase();
              this.referencia.parentesco = this.parentescoR.value.toUpperCase();
              this.referencia.direccion = this.direccionR.value.toUpperCase();
              this.referencia.telefonoMovil = this.telefonoMovilR.value;
              this.referencia.telefonoFijo = this.telefonoFijoR.value;
              if (this.element) {
                const index = this.dataSource.data.indexOf(this.element);
                this.dataSource.data.splice(index, 1);
                const data = this.dataSource.data;
                this.dataSource.data = data;
              }
              const data = this.dataSource.data;
              data.push(this.referencia);
              this.dataSource.data = data;
              this.element = null;
              this.limpiarCampos();
            } else {
              this.sinNoticeService.setNotice("NUMERO DE TELEFONO NO VALIDO", 'error');
            }
          } else {
            this.sinNoticeService.setNotice("DIRECCION NO VALIDA", 'error');
          }
        } else {
          this.sinNoticeService.setNotice("PARENTESCO NO VALIDO", 'error');
        }
      } else {
        this.sinNoticeService.setNotice("NOMBRE COMPLETO NO VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
    }
  }
  /**
   * @description
   * @param element 
   */
  deleteReferencia(element) {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    const data = this.dataSource.data;
    this.dataSource.data = data;
  }
  /**
   * 
   * @param element 
   */
  editarReferencia(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.nombresCompletosR.setValue(element.nombresCompletos);
    this.parentescoR.setValue(element.parentesco);
    this.direccionR.setValue(element.direccion);
    this.telefonoMovilR.setValue(element.telefonoMovil);
    this.telefonoFijoR.setValue(element.telefonoFijo);
  }
  /**
   * 
   */


  crearUbicacionDomicilio() {
    if (this.ubicacion.value) {
      for (let i = 0; i < this.ubicacionEntity.length; i++) {

        if (this.ubicacionEntity[i].nombreParroquia.toUpperCase() == this.ubicacion.value) {
          let value = this.ubicacionEntity[i].nombreParroquia.toUpperCase() + " / "
            + this.ubicacionEntity[i].canton.nombreCanton.toUpperCase() + " / "
            + this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase();
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion ", value);
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion form ", this.ubicacion.value);
          this.cantonD = this.ubicacionEntity[i].canton.nombreCanton.toUpperCase();
          this.parroquiaD = this.ubicacionEntity[i].nombreParroquia.toUpperCase()
          this.provinciaD = this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase()
        }
      }
    }
  }
  /**
   * 
   */
  crearUbicacionLaboral() {
    if (this.ubicacionO.value) {
      for (let i = 0; i < this.ubicacionEntity.length; i++) {

        if (this.ubicacionEntity[i].nombreParroquia.toUpperCase() == this.ubicacion.value) {
          let value = this.ubicacionEntity[i].nombreParroquia.toUpperCase() + " / "
            + this.ubicacionEntity[i].canton.nombreCanton.toUpperCase() + " / "
            + this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase();
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion ", value);
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion form ", this.ubicacion.value);
          this.cantonL = this.ubicacionEntity[i].canton.nombreCanton.toUpperCase();
          this.parroquiaL = this.ubicacionEntity[i].nombreParroquia.toUpperCase()
          this.provinciaL = this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase()
        }
      }
    }
  }
  /**
   * 
   */
  direccionLegalD() {
    if (this.drLgDo.value) {
      this.drLgLb.setValue(false);
    } else {
      this.drLgLb.setValue(true);
    }
    if (this.drLgLb.value) {
      this.drLgDo.setValue(false);
    }
  }
  /**
   * 
   */
  direccionLegalL() {
    if (this.drLgLb.value) {
      this.drLgDo.setValue(false);
    } else {
      this.drLgDo.setValue(true);
    }
  }
  /**
   * 
   */
  direccionCorreoD() {
    if (this.drCrDo.value) {
      this.drCrLb.setValue(false);
    } else {
      this.drCrLb.setValue(true);
    }
  }
  /**
   * 
   */
  direccionCorreoL() {
    if (this.drCrLb.value) {
      this.drCrDo.setValue(false);
    } else {
      this.drCrDo.setValue(true);
    }
  }
  /**
   * 
   */
  guardar() {
    this.loadingSubject.next(true);
    if (this.formCliente.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS PERSONALES DEL CLIENTE", 'error');
      return;
    }
    
    if (this.formDatosContacto.valid) {
      if (this.formDatosDireccionDomicilio.valid) {
        console.log(" >>>>>>>> "+ this.formDatosDireccionDomicilio)
        if (this.formDatosDireccionLaboral.valid) {
          if (this.formDatosEconomicos.valid) {
            if (this.dataSourceIngresoEgreso.data.length > 0) {
              if ((this.dataSourcePatrimonioActivo.data.length > 0) || (this.dataSourcePatrimonioPasivo.data.length > 0)) {
                if (this.dataSource.data.length > 1) {
                  this.cliente = new TbQoCliente;
                  // **************  SET DE DATOS DE CLIENTE 
                  if (this.id != null && this.id != "") {
                    this.cliente.id = Number(this.id);
                  }
                  this.cliente.actividadEconomica = this.actividadEconomica.value;
                  this.cliente.actividadEconomicaEmpresa = this.actividadEconomicaEmpresa.value;
                  if (this.apellidoMaterno.value) {
                    this.cliente.apellidoMaterno = this.apellidoMaterno.value.toUpperCase();
                  }
                  this.cliente.apellidoPaterno = this.apellidoPaterno.value.toUpperCase();
                  this.cliente.canalContacto = this.canalContacto.value.toUpperCase();
                  this.cliente.cargasFamiliares = this.cargaFamiliar.value;
                  this.cliente.cargo = this.cargo.value.toUpperCase();
                  this.cliente.cedulaCliente = this.identificacion.value;
                  this.cliente.edad = this.edad.value;
                  this.cliente.email = this.email.value.toUpperCase();
                  this.cliente.estadoCivil = this.estadoCivil.value.toUpperCase();
                  this.cliente.fechaNacimiento = this.fechaNacimiento.value;
                  this.cliente.genero = this.genero.value.toUpperCase();
                  this.cliente.lugarNacimiento = this.lugarNacimiento.value;
                  this.cliente.nacionalidad = this.nacionalidad.value.toUpperCase();
                  this.cliente.nivelEducacion = this.nivelEducacion.value.toUpperCase();
                  this.cliente.nombreEmpresa = this.actividadEmpresa.value.toUpperCase();
                  this.cliente.ocupacion = this.ocupacion.value.toUpperCase();
                  this.cliente.origenIngreso = this.origenIngresos.value.toUpperCase();
                  this.cliente.primerNombre = this.primerNombre.value.toUpperCase();
                  this.cliente.profesion = this.profesion.value.toUpperCase();
                  if (this.relacionDependencia.value) {
                    this.cliente.relacionDependencia = this.relacionDependencia.value.toUpperCase();
                  }
                  if (this.segundoNombre.value) {
                    this.cliente.segundoNombre = this.segundoNombre.value.toUpperCase();
                  }
                  if (this.separacionBienes.value) {
                    this.cliente.separacionBienes = this.separacionBienes.value.toUpperCase();
                  }

                  this.cliente.telefonoAdicional = this.telefonoAdicional.value;
                  this.cliente.telefonoFijo = this.telefonoFijo.value;
                  this.cliente.telefonoMovil = this.telefonoMovil.value;
                  this.cliente.telefonoTrabajo = this.telefonoOtro.value;
                  // ******************* SET DE DIRECCION DE DOMICILIO
                  this.direccionDomicilio = new TbQoDireccionCliente();
                  this.direccionDomicilio.barrio = this.barrio.value.toUpperCase();
                  this.direccionDomicilio.callePrincipal = this.callePrincipal.value.toUpperCase();
                  this.direccionDomicilio.calleSegundaria = this.calleSecundaria.value.toUpperCase();
                  this.direccionDomicilio.canton = this.cantonD.toUpperCase();
                  this.direccionDomicilio.provincia = this.provinciaD.toUpperCase();
                  this.direccionDomicilio.parroquia = this.parroquiaD.toUpperCase();
                  this.direccionDomicilio.direccionEnvioCorrespondencia = this.drCrDo.value;
                  this.direccionDomicilio.direccionLegal = this.drLgDo.value;
                  this.direccionDomicilio.numeracion = this.numeracion.value.toUpperCase();
                  this.direccionDomicilio.referenciaUbicacion = this.referenciaUbicacion.value.toUpperCase();
                  this.direccionDomicilio.sector = this.sector.value.toUpperCase();
                  this.direccionDomicilio.tipoDireccion = "DOMICILIO";
                  this.direccionDomicilio.tipoVivienda = this.tipoVivienda.value.toUpperCase();
                  if (this.idDireccionDomicilio != null) {
                    this.direccionDomicilio.id = this.idDireccionDomicilio;
                  }
                  this.cliente.tbQoDireccionClientes.push(this.direccionDomicilio);
                  // ******************* SET DE DIRECCION LABORAL
                  this.direccionLaboral = new TbQoDireccionCliente();
                  this.direccionLaboral.barrio = this.barrioO.value.toUpperCase();
                  this.direccionLaboral.callePrincipal = this.callePrincipalO.value.toUpperCase();
                  this.direccionLaboral.calleSegundaria = this.calleSecundariaO.value.toUpperCase();
                  this.direccionLaboral.canton = this.cantonL.toUpperCase();
                  this.direccionLaboral.provincia = this.provinciaL.toUpperCase();
                  this.direccionLaboral.parroquia = this.parroquiaL.toUpperCase();
                  this.direccionLaboral.direccionEnvioCorrespondencia = this.drCrLb.value;
                  this.direccionLaboral.direccionLegal = this.drLgLb.value;
                  this.direccionLaboral.numeracion = this.numeracionO.value.toUpperCase();
                  this.direccionLaboral.referenciaUbicacion = this.referenciaUbicacionO.value.toUpperCase();
                  this.direccionLaboral.sector = this.sectorO.value.toUpperCase();
                  this.direccionLaboral.tipoDireccion = "LABORAL";
                  this.direccionLaboral.tipoVivienda = this.tipoViviendaO.value.toUpperCase();
                  if (this.idDireccionLaboral != null) {
                    this.direccionLaboral.id = this.idDireccionLaboral
                  }
                  this.cliente.tbQoDireccionClientes.push(this.direccionLaboral);
                  // ******************* SET DE INGRESO EGRESO
                  this.dataSourceIngresoEgreso.data.forEach(element => {
                    this.ingresoEgresoGuardado = new TbQoIngresoEgresoCliente();
                    this.ingresoEgresoGuardado.esEgreso = element.esEgreso;
                    this.ingresoEgresoGuardado.esIngreso = element.esIngreso;
                    this.ingresoEgresoGuardado.valor = element.valor;
                    this.cliente.tbQoIngresoEgresoClientes.push(this.ingresoEgresoGuardado);
                  });
                  // ******************* SET DE PATRIMONIO ACTIVO
                  this.dataSourcePatrimonioActivo.data.forEach(element => {
                    this.patrimonioActivo = new TbQoPatrimonioCliente();
                    this.patrimonioActivo.activos = element.activos;
                    this.patrimonioActivo.pasivos = element.pasivos;
                    this.patrimonioActivo.avaluo = element.avaluo;
                    this.cliente.tbQoPatrimonios.push(this.patrimonioActivo);
                  });
                  // ******************* SET DE PATRIMONIO PASIVO
                  this.dataSourcePatrimonioPasivo.data.forEach(element => {
                    this.patrimonioPasivo = new TbQoPatrimonioCliente();
                    this.patrimonioPasivo.activos = element.activos;
                    this.patrimonioPasivo.pasivos = element.pasivos;
                    this.patrimonioPasivo.avaluo = element.avaluo;
                    this.cliente.tbQoPatrimonios.push(this.patrimonioPasivo);
                  });
                 
                 
                  // ******************* SET DE REFERENCIAS
                  this.dataSource.data.forEach(element => {
                    this.referenciaGuardado = new TbReferencia();
                    this.referenciaGuardado.direccion = element.direccion;
                    this.referenciaGuardado.nombresCompletos = element.nombresCompletos;
                    this.referenciaGuardado.parentesco = element.parentesco;
                    this.referenciaGuardado.telefonoFijo = element.telefonoFijo;
                    this.referenciaGuardado.telefonoMovil = element.telefonoMovil;
                    this.cliente.tbQoReferenciaPersonals.push(this.referenciaGuardado);
                  });


                  this.cs.crearClienteConRelaciones(this.cliente,this.idNegociacion).subscribe((respuesta: any) => {
                    console.log('numero de creditos',respuesta.entidad.numeroCreditos);
                    if (respuesta.entidad) {
                      let clienteSoftBank = new ClienteSoftbank();
                      this.cs.crearClienSoftBank(clienteSoftBank);
                      clienteSoftBank.nombreCompleto
                      clienteSoftBank.primerNombre = this.primerNombre.value
                      clienteSoftBank.segundoNombre = this.segundoNombre.value
                      clienteSoftBank.primerApellido= this.apellidoPaterno.value
                      clienteSoftBank.segundoApellido = this.apellidoMaterno.value
                      clienteSoftBank.idPaisNacimiento = this.nacionalidad.value
                      clienteSoftBank.idLugarNacimiento = this.lugarNacimiento.value
                      clienteSoftBank.actividadEconomica.idActividadEconomica = Number(this.cliente.actividadEconomica)
                      clienteSoftBank.fechaNacimiento = this.fechaNacimiento.value
                      clienteSoftBank.codigoSexo = this.genero.value
                      clienteSoftBank.codigoProfesion = this.profesion.value
                      clienteSoftBank.codigoEstadoCivil = this.estadoCivil.value
                      clienteSoftBank.codigoEducacion = this.nivelEducacion.value
                      clienteSoftBank.numeroCargasFamiliares = this.cargaFamiliar.value
                      clienteSoftBank.email = this.email.value
                      //clienteSoftBank.codigoUsuarioAsesor 
                      //clienteSoftBank.direcciones = this.direccionDomicilio
                      //clienteSoftBank.telefonos = this.telefonoFijo.valueChanges
                      //clienteSoftBank.cuentasBancariasCliente
                      //clienteSoftBank.contactosCliente = this.referencia
                      clienteSoftBank.datosTrabajoCliente = this.referenciaUbicacionO.value  
                      clienteSoftBank.activos = this.activo.value
                      clienteSoftBank.pasivos = this.pasivo.value
                      //clienteSoftBank.ingresos = this.ingresoEgresoGuardado.esIngreso.values
                      //clienteSoftBank.egresos = this.totalValorIngresoEgreso.valueOf
                      
                      if(this.situacion =='EN PROCESO' && respuesta.entidad.numeroCreditos && respuesta.entidad.numeroCreditos == 1){
                        console.log("tiene q navegar al generar credito ");
                        this.router.navigate(['../../generar-credito/generar-credito'])
                      }
                      if(respuesta.entidad.numeroCreditos && respuesta.entidad.numeroCreditos >1){
                        console.log("tiene q navegar a la bandeja principal de asesores ");
                      }
                      this.id = respuesta.entidad.id
                      this.loadingSubject.next(false);
                      this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
                      this.capturaHoraFinal()
                      this.router.navigate(['credito-nuevo/', this.idNegociacion]);
                      //console.log(" JSON CLIENTE----->" + JSON.stringify(data.entidad))

                    }
                  }, error => {
                    this.loadingSubject.next(false);
                    if (JSON.stringify(error).indexOf("codError") > 0) {
                      let b = error.error;
                      this.sinNoticeService.setNotice(b.msgError, 'error');
                    } else {
                    }
                  });
                } else {
                  this.loadingSubject.next(false);
                  this.sinNoticeService.setNotice("AGREGUE AL MENOS 2 REFERENCIAS EN  LA SECCION DE REFERENCIAS PERSONALES", 'error');
                }
              } else {
                this.loadingSubject.next(false);
                this.sinNoticeService.setNotice("AGREGUE AL MENOS UN PATRIMONIO ACTIVO O PASIVO", 'error');
              }
            } else {
              this.loadingSubject.next(false);
              this.sinNoticeService.setNotice("AGREGUE AL MENOS UN INGRESO O UN EGRESO", 'error');
            }
          } else {
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS ECONOMICOS DEL CLIENTE", 'error');
          }
        } else {
          this.loadingSubject.next(false);
          this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DIRECCION LABORAL", 'error');
        }
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DIRECCION DE DOMICILIO", 'error');
      }
    } else {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS DE CONTACTO DEL CLIENTE", 'error');
    }

  }

  public llamarCatalogos() {
    this.loadingSubject.next(true);
    //this.consultaCatalogos();
    this.capturaDatosTraking();

  }

  /********************************************  @TRACKING  ***********************************************************/
  /**
  * @author 
  * @description Captura la hora de inicio de Tracking
  */

  private capturaHoraInicio() {
    this.tr.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.horaInicioDatosCliente = hora.entidad;
      }
    });
  }
  private capturaHoraAsignacion() {
    this.tr.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.horaAsignacionDatosCliente = hora.entidad;
      }
    });
  }
  private capturaHoraAtencion() {
    this.tr.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.horaAtencionDatosCliente = hora.entidad;
      }
    });
  }
  private capturaHoraFinal() {
    this.tr.getSystemDate().subscribe((hora: any) => {
      if (hora.entidad) {
        this.horaFinalDatosCliente = hora.entidad;
        this.registroNegociacion(this.idNegociacion, this.horaInicioDatosCliente, this.horaAsignacionDatosCliente,
          this.horaAtencionDatosCliente, this.horaFinalDatosCliente);
      }
    });
  }
  private capturaDatosTraking() {
    this.sp.findByNombreTipoOrdered('NEGOCIACION', 'ACTIVIDAD', 'Y').subscribe((data: any) => {
      if (data.entidades) {
        this.actividad = data.entidades[0].nombre;
        this.sp.findByNombreTipoOrdered('DATOS_CLIENTE', 'PROCESO', 'Y').subscribe((data: any) => {
          if (data.entidades) {
            this.procesoDatosCliente = data.entidades[0].nombre;
          }
        });
      }
    });
  }
  public registroNegociacion(codigoRegistro: number, fechaInicio: Date, fechaAsignacion: Date, fechaInicioAtencion: Date, fechaFin: Date) {
    const tracking: TbQoTracking = new TbQoTracking();
    this.loadingSubject.next(true);
    tracking.actividad = this.actividad;
    tracking.proceso = this.procesoDatosCliente;
    tracking.observacion = '';
    tracking.codigoRegistro = codigoRegistro;
    tracking.situacion = SituacionTrackingEnum.EN_PROCESO; // Por definir
    tracking.usuario = atob(localStorage.getItem(environment.userKey)); // Modificar al id del asesor
    tracking.fechaInicio = fechaInicio;
    tracking.fechaAsignacion = fechaAsignacion;
    tracking.fechaInicioAtencion = fechaInicioAtencion;
    tracking.fechaFin = fechaFin;
    this.tr.guardarTracking(tracking).subscribe((data: any) => {
      if (data.entidad) {
        console.log('data de tracking para Negociacion ----> ', data.entidad);
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING', 'error');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf('codError') > 0) {
        const b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice('ERROR AL GUARDAR TRACKING', 'error');
      }
    });
  }
}
