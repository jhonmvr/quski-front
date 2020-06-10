import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTableDataSource, MatDialog} from '@angular/material';
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
import { ActivatedRoute } from '@angular/router';
import { TbQoPatrimonioCliente } from '../../../../../core/model/quski/TbQoPatrimonioCliente';
import { CatalogoService } from '../../../../../core/services/quski/catalogo.service';
import { ReFileUploadService } from '../../../../../core/services/re-file-upload.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { saveAs } from 'file-saver';
import { CargarFotoDialogComponent } from '../../../../../views/partials/custom/fotos/cargar-foto-dialog/cargar-foto-dialog.component';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { PaisesEnum } from '../../../../../core/enum/PaisesEnum';
import { ParroquiaService } from '../../../../../core/services/quski/parroquia.service';
import { Parroquia } from '../../../../../core/model/quski/Parroquia';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { DireccionClienteService } from '../../../../../core/services/quski/direccion-cliente.service';
import { TbQoDireccionCliente } from '../../../../../core/model/quski/TbQoDireccionCliente';
import { PatrimonioService } from '../../../../../core/services/quski/patrimonio.service';
import { ReferenciaPersonalService } from '../../../../../core/services/quski/referenciaPersonal.service';
import { ParaDesarrolloEnum } from '../../../../../core/enum/ParaDesarrolloEnum';
import { element } from 'protractor';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { TbQoTracking } from '../../../../../core/model/quski/TbQoTracking';
import { UsuarioEnum } from '../../../../../core/enum/UsuarioEnum';
import { TareaTrackingEnum } from '../../../../../core/enum/TareaTrackingEnum';
import { SituacionTrackingEnum } from '../../../../../core/enum/SituacionTrackingEnum';
import { ActividadEnum } from '../../../../../core/enum/ActividadEnum';
import { ProcesoEnum } from '../../../../../core/enum/ProcesoEnum';

export interface User {
  name: string;
}

@Component({
  selector: 'kt-gestion-cliente',
  templateUrl: './gestion-cliente.component.html',
  styleUrls: ['./gestion-cliente.component.scss']
})
export class GestionClienteComponent implements OnInit {

  public agrupacionEstado: Array<string> = ["-", "Mostrar existencias", "Mostrar joyas en custodia", "Mostrar vitrina"];
  public agrupacionEstadoSelected: string;
  public estadoSelected: string;
  public id;
  @ViewChild('ref', { static: true }) ref;
  disableConsultar;
  disableConsultarSubject = new BehaviorSubject<boolean>(true);

  // TABLA DE REFERENCIAS PERSONALES
  displayedColumns = ['Accion', 'N', 'NombresCompletos', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSource = new MatTableDataSource<TbReferencia>();
  //TABLA DE PATRIMONIO ACTIVO
  displayedColumnsActivo = ['Accion', 'Activo', 'Avaluo'];
  dataSourcePatrimonioActivo = new MatTableDataSource<TbQoPatrimonioCliente>();
  //TABLA DE PATRIMONIO PASIVO
  displayedColumnsPasivo = ['Accion', 'Pasivo', 'Avaluo'];
  dataSourcePatrimonioPasivo = new MatTableDataSource<TbQoPatrimonioCliente>();
  //TABLA DE INGRESO EGRESO
  displayedColumnsII = ['Accion','Is', 'Valor'];
  dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();

  public ingresoOrigen: Array<string> = [];
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;
  p = new Page();

  canal =[];
  actividadeco =[];
  ocupaciones = null;
  origen = null;


  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public lCreate;
  idDireccionDomicilio: string;
  idDireccionLaboral: string;
  cantonD : string;
  parroquiaD : string;
  provinciaD : string;
  cantonL : string;
  parroquiaL: string;
  provinciaL: string;

  // STREPPER
  isLinear = true;
  //TRACKING
  public idTotalTracking : string[];
  public idTracking1 : any;
  public idTracking2 : any;
  public idTracking3 : any;
  public idTracking4 : any;
  public idTracking5 : any;
  public idTracking6 : any;
  public idTracking7 : any;

  
  // LISTAS & ENUMS
  listSeparacionBienes    = Object.values(SeparacionBienesEnum);
  listEstadoCivil         = Object.values(EstadoCivilEnum);
  listNivel               = Object.values(NivelEstudioEnum);
  listParaDesarrolloEnum  = Object.values(ParaDesarrolloEnum);
  listSector              = Object.keys(SectorEnum);
  listOrigenIngreso       = Object.values(OrigenIngresosEnum);
  listTipoVivienda        = Object.keys(OcupacionInmuebleEnum);
  listGenero              = Object.values(GeneroEnum)
  listCargaFamiliar       = Object.values(CargaFamiliarEnum);
  listRelacionDependencia = Object.keys(RelacionDependenciaEnum);


  listProfesion           = Object.keys(ProfesionEnum);
  listPaises              = Object.values(PaisesEnum);

  listNombreParroquia = [];
  cliente             : TbQoCliente;
  direccionDomicilio : TbQoDireccionCliente;
  direccionLaboral : TbQoDireccionCliente;
  ingresoEgresoGuardado : TbQoIngresoEgresoCliente;
  patrimonioActivo : TbQoPatrimonioCliente;
  patrimonioPasivo : TbQoPatrimonioCliente;
  referenciaGuardado : TbReferencia;
  ubicacionEntity     : Parroquia[]   = new Array();
  urlimage            : string;
  
  // FORM DATOS CLIENTES
  public formCliente: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public primerNombre = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public segundoNombre = new FormControl('', [Validators.maxLength(50)]);
  public apellidoMaterno = new FormControl('', [Validators.maxLength(50)]);
  public apellidoPaterno = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public genero = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public estadoCivil = new FormControl('', Validators.required);
  public cargaFamiliar = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public fechaNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public lugarNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nacionalidad = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nivelEducacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public actividadEconomica = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public canalContacto = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public separacionBienes = new FormControl('', []);
  public edad = new FormControl('', []);
  // FORM DE CONTACTO  
  public formDatosContacto: FormGroup = new FormGroup({});
  public telefonoFijo = new FormControl('', [Validators.minLength(9), Validators.maxLength(9)]);
  public telefonoAdicional = new FormControl('', [Validators.minLength(9), Validators.maxLength(10)]);
  public telefonoMovil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoOtro = new FormControl('', [Validators.minLength(9), Validators.maxLength(10)]);
  public email = new FormControl('', [Validators.email, Validators.maxLength(100), Validators.required]);
  // FORM DE  DOMICILIO 
  public formDatosDireccionDomicilio: FormGroup = new FormGroup({});
  public ubicacion = new FormControl('', Validators.required);
  public tipoVivienda = new FormControl('', Validators.required);
  public callePrincipal = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public barrio = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundaria = new FormControl('', [Validators.maxLength(50)]);
  public referenciaUbicacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public sector = new FormControl('', Validators.required);
  public drLgDo = new FormControl('', []);
  public drCrDo = new FormControl('', []);
  // FORM DE  OFICINA 
  public formDatosDireccionLaboral: FormGroup = new FormGroup({});
  public barrioO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public ubicacionO = new FormControl('', Validators.required);
  public sectorO = new FormControl('', Validators.required);
  public callePrincipalO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundariaO = new FormControl('', [Validators.maxLength(50)]);
  public referenciaUbicacionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public tipoViviendaO = new FormControl('', Validators.required);
  public drLgLb = new FormControl('', []);
  public drCrLb = new FormControl('', []);

  // FORM DE DATOS ECONOMICOS CLIENTE 
  public formDatosEconomicos: FormGroup = new FormGroup({});
  public relacionDependencia = new FormControl('');
  public actividadEmpresa = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public actividadEconomicaEmpresa = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public ocupacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cargo = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public profesion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public origenIngresos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  // FORM DE INGRESO  
   public formDatosIngreso: FormGroup = new FormGroup({});
   public valorIngreso = new FormControl('',[Validators.maxLength(50)]);
  // FORM DE EGRESO 
  public formDatosEgreso: FormGroup = new FormGroup({});
  public valorEgreso = new FormControl('',[Validators.maxLength(50)]);
  // FORM DE PATRIMONIO ACTIVO
  public formDatosPatrimonioActivos: FormGroup = new FormGroup({});
  public activo = new FormControl('',[Validators.maxLength(50)]);
  public avaluoActivo = new FormControl('',[Validators.maxLength(50)]);
  // FORM DE PATRIMONIO PASIVO
  public formDatosPatrimonioPasivos: FormGroup = new FormGroup({});
  public pasivo = new FormControl('',[Validators.maxLength(50)]);
  public avaluoPasivo = new FormControl('',[Validators.maxLength(50)]);
  // FORM DE REFERENCIAS PERSONALES
  public formDatosReferenciasPersonales: FormGroup = new FormGroup({});
  public nombresCompletosR = new FormControl('', [Validators.maxLength(50)]);
  public parentescoR = new FormControl('', [Validators.maxLength(50)]);
  public direccionR = new FormControl('', [Validators.maxLength(50)]);
  public telefonoMovilR = new FormControl('',[Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoFijoR = new FormControl('', [Validators.minLength(9), Validators.maxLength(9)]);

  // WRAPPERS Y ENTIDADES
  patrimonioCliente : TbQoPatrimonioCliente;
  ingresoEgreso     : TbQoIngresoEgresoCliente;
  referencia        : TbReferencia;
  //GLOBAL DATASOURCE
  public  element;
  private idNegociacion;
  private idCliente;
  //VARIABLES DE CALCULO INGRESO, EGRESO Y PATRIMONIO
  public totalActivo            : number = 0;
  public totalPasivo            : number = 0;
  public totalValorIngresoEgreso: number = 0;
  public valorValidacion        : number = 0;


  constructor(
    private cas: CatalogoService,
    private cs: ClienteService,
    public dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
    private sp: ParametroService,
    private route: ActivatedRoute,
    private subheaderService: SubheaderService,
    private dh: DocumentoHabilitanteService,
    private pr: ParroquiaService,
    private dc: DireccionClienteService,
    private pm: PatrimonioService,
    private re: ReferenciaPersonalService,
    private tr: TrackingService
  ) {
    //LLAMADA A SERVICIO DE PARAMETROS
    this.sp.setParameter();
    this.getActividadEconomica();
    this.getCanalDeContacto();

    //DATOS CLIENTES
    this.formCliente.addControl("identificacion"            , this.identificacion);
    this.formCliente.addControl("nombresCompletos "         , this.nombresCompletos);
    this.formCliente.addControl("primerNombre "             , this.primerNombre);
    this.formCliente.addControl("segundoNombre "            , this.segundoNombre);
    this.formCliente.addControl("apellidoMaterno "          , this.apellidoMaterno);
    this.formCliente.addControl("apellidoPaterno "          , this.apellidoPaterno);
    this.formCliente.addControl("genero "                   , this.genero);
    this.formCliente.addControl("estadoCivil "              , this.estadoCivil);
    this.formCliente.addControl("cargaFamiliar "            , this.cargaFamiliar);
    this.formCliente.addControl("fechaNacimiento "          , this.fechaNacimiento);
    this.formCliente.addControl("lugarNacimiento "          , this.lugarNacimiento);
    this.formCliente.addControl("nacionalidad "             , this.nacionalidad);
    this.formCliente.addControl("actividadEconomica  "      , this.actividadEconomica);
    this.formCliente.addControl("separacionBienes  "        , this.separacionBienes);
    this.formCliente.addControl("canalContacto  "           , this.canalContacto);


    //FORM DE CONTACTO  
    this.formDatosContacto.addControl("telefonoFijo  "    , this.telefonoFijo);
    this.formDatosContacto.addControl("telefonoAdicional" , this.telefonoAdicional);
    this.formDatosContacto.addControl("telefonoMovil  "   , this.telefonoMovil);
    this.formDatosContacto.addControl("telefonoOtro  "    , this.telefonoOtro);
    this.formDatosContacto.addControl("email  "           , this.email);
    // FORM DE  DOMICILIO 
    this.formDatosDireccionDomicilio.addControl("ubicacion   "        , this.ubicacion);
    this.formDatosDireccionDomicilio.addControl("tipoVivienda    "    , this.tipoVivienda);
    this.formDatosDireccionDomicilio.addControl("callePrincipal"      , this.callePrincipal);
    this.formDatosDireccionDomicilio.addControl("barrio    "          , this.barrio);
    this.formDatosDireccionDomicilio.addControl("numeracion    "      , this.numeracion);
    this.formDatosDireccionDomicilio.addControl("calleSecundaria"     , this.calleSecundaria);
    this.formDatosDireccionDomicilio.addControl("referenciaUbicacion" , this.referenciaUbicacion);
    this.formDatosDireccionDomicilio.addControl("sector     "         , this.sector);
    // FORM DE OFICINA
    this.formDatosDireccionLaboral.addControl("tipoViviendaO    "    , this.tipoViviendaO);
    this.formDatosDireccionLaboral.addControl("ubicacionO     "     , this.ubicacionO);
    this.formDatosDireccionLaboral.addControl("barrioO    "          , this.barrioO);
    this.formDatosDireccionLaboral.addControl("sectorO      "       , this.sectorO);
    this.formDatosDireccionLaboral.addControl("callePrincipalO    " , this.callePrincipalO);
    this.formDatosDireccionLaboral.addControl("numeracionO      "   , this.numeracionO);
    this.formDatosDireccionLaboral.addControl("calleSecundariaO    ", this.calleSecundariaO);
    this.formDatosDireccionLaboral.addControl("referenciaUbicacionO", this.referenciaUbicacionO);
    // FORM DE DATOS ECONOMICOS CLIENTE 
    this.formDatosEconomicos.addControl("relacionDependencia" , this.relacionDependencia);
    this.formDatosEconomicos.addControl("actividadEmpresa"    , this.actividadEmpresa);
    this.formDatosEconomicos.addControl("actividadCliente"    , this.actividadEconomicaEmpresa);
    this.formDatosEconomicos.addControl("ocupacion"           , this.ocupacion);
    this.formDatosEconomicos.addControl("cargo"               , this.cargo);
    this.formDatosEconomicos.addControl("profesion"           , this.profesion);
    this.formDatosEconomicos.addControl("origenIngresos"      , this.origenIngresos);
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

    //Disable
    this.nombresCompletos.disable();
    this.separacionBienes.disable();
    this.relacionDependencia.disable();
    this.actividadEmpresa.disable();
    this.cargo.disable();
  }

  ngOnInit() {
    this.registrarTracking( TareaTrackingEnum.REGISTRO_DE_INFORMACION_DEL_CLIENTE,
                            null,
                            null,
                            SituacionTrackingEnum.EN_PROCESO, 
                            UsuarioEnum.ASESOR, 
                            true,
                            true,
                            true, 
                            false )
    this.disableConsultar = this.disableConsultarSubject.asObservable();
    /* this.listNombreParroquia = this.ubicacion.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      ); */
    this.clienteNegociacion();
    this.cargarUbicacion();
    //this.buscarCatalogobyTipo();
    //this.loadActividad();
    //this.loadActividadEco();
    //this.loadOcupacion();
    //this.loadOrigenIngresos();
    this.subheaderService.setTitle("Gestion de Clientes");
    /* reader.result.split(',')[1] */

  }
  /* private _filter(value: string): string[] {
    const filterValue = value.toUpperCase();

    return this.listNombreParroquia.filter(option => option.toLowerCase().includes(filterValue));
  } */


  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  clienteNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      //console.log("esta es la ruta q llega para el id de negociacion ", data);
      //data.params.id
      if (true) {
        //console.log("id d negociacion ", data.params.id)
        //this.idNegociacion = data.params.id;
        this.idNegociacion = "109";
        //console.log('idNegociacion ', this.idNegociacion);
        this.cas.findNegociacionById(this.idNegociacion).subscribe((data: any) => {
          if (data.entidad) {
            this.registrarTracking( 
              TareaTrackingEnum.PRESENTAR_DATOS_DE_CLIENTE_EXISTENTE,
              null,
              null,
              SituacionTrackingEnum.EN_PROCESO, 
              UsuarioEnum.QUSKI_ORO, 
              true,
              true,
              true, 
              false );
            //console.log('cliente entidad ', data.entidad.tbQoCliente.cedulaCliente);
            this.idCliente = data.entidad.tbQoCliente.cedulaCliente;
            this.cs.findClienteByIdentificacion(this.idCliente).subscribe((data: any) => {
              //console.log('identificacion ', this.idCliente);
              this.loadingSubject.next(false);
              //console.log('cliente ', data.entidad);
              if (data.entidad) {
                //console.log('cliente entidad ', data.entidad);
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
                let email : string = data.entidad.email;
                console.log("origenIngresos ===> "+ JSON.stringify(data.entidad));
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


                this.dc.findDireccionByIdCliente(this.id, "DOMICILIO").subscribe((data :any) =>{
                  if (data.entidad) {
                    let direccion : TbQoDireccionCliente = data.entidad;
                    this.idDireccionDomicilio = direccion.id
                    this.ubicacion.setValue(direccion.parroquia.toUpperCase());
                    this.provinciaD = direccion.provincia.toUpperCase();
                    this.parroquiaD = direccion.parroquia.toUpperCase();
                    this.cantonD    = direccion.canton.toUpperCase();
                    this.tipoVivienda.setValue(direccion.tipoVivienda.toUpperCase());
                    this.callePrincipal.setValue(direccion.callePrincipal.toUpperCase());
                    this.barrio.setValue(direccion.barrio.toUpperCase());
                    this.numeracion.setValue(direccion.numeracion.toUpperCase());
                    this.calleSecundaria.setValue(direccion.calleSegundaria.toUpperCase());
                    this.referenciaUbicacion.setValue(direccion.referenciaUbicacion.toUpperCase());
                    this.sector.setValue(direccion.sector.toUpperCase());
                    this.dc.findDireccionByIdCliente(this.id, "LABORAL").subscribe((data:any) =>{
                      if(data.entidad){
                        let direccionO : TbQoDireccionCliente = data.entidad;
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
                        this.registrarTracking( 
                          TareaTrackingEnum.PRESENTAR_DATOS_DE_CLIENTE_EXISTENTE,
                          this.id,
                          this.idTracking3,
                          SituacionTrackingEnum.FINALIZADO, 
                          UsuarioEnum.QUSKI_ORO, 
                          false,
                          false,
                          false, 
                          true );
                        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
                        this.loadingSubject.next(false);
                      } else{
                        this.idDireccionLaboral = null
                        this.loadingSubject.next(false);
                      }
                    }, error =>{
                      this.loadingSubject.next(false);
                      if (JSON.stringify(error).indexOf("codError") > 0) {
                        let b = error.error;
                        this.sinNoticeService.setNotice(b.msgError, 'error');
                      } else {
                        this.sinNoticeService.setNotice("ERROR AL CARGAR DIRECCION LABORAL", 'error');
                      }
                    });
                    
                  }else{
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
          }
        }
        );
      }
    });
  }
  

  
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
  getCanalDeContacto( ){
    this.sp.findByNombreTipoOrdered("","CANAL","Y").subscribe( (wrapper:any)=>{
      //console.log("retornos "+ JSON.stringify(wrapper)  );
        if( wrapper && wrapper.entidades ){
          //console.log("lista  >>>>" + JSON.stringify( wrapper.entidades ));
          for (let i = 0; i < wrapper.entidades.length; i++) {
            this.canal.push(wrapper.entidades[i].valor.toUpperCase());
            //console.log("lista canal >>>>" + JSON.stringify( this.canal ));
          }
        }
        /* if (element.list) {
          //console.log("lista  >>>>" + JSON.stringify(element));
          this.ubicacionEntity = element.list;
          for (let i = 0; i < this.ubicacionEntity.length; i++) {
            //console.log(">>>>>>>>>>>>>>>>>>>> Nombre Parroquia ", this.ubicacionEntity[i].canton.provincia);
            this.listNombreParroquia.push(this.ubicacionEntity[i].nombreParroquia.toUpperCase());
  
            //console.log("lista Parroquia >>>>" + JSON.stringify(this.listNombreParroquia));
          }
        } */
    },error => {
      if(  error.error ){
        if( error.error.codError ){
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
        } else {
          this.sinNoticeService.setNotice("Error al cargar parametros de Canal de contacto"  , 'error');
        }
			} else if(  error.statusText && error.status==401 ){
				this.dialog.open(AuthDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
			} else {
				this.sinNoticeService.setNotice("Error al cargar Canales de contacto", 'error');
			}
    } );
  }
  getActividadEconomica(){
    this.sp.findByNombreTipoOrdered("","ACT-ECON","Y").subscribe( (wrapper:any)=>{
      //console.log("retornos "+ JSON.stringify(wrapper)  );
        if( wrapper && wrapper.entidades ){
          //console.log("lista  >>>>" + JSON.stringify( wrapper.entidades ));
          for (let i = 0; i < wrapper.entidades.length; i++) {
            this.actividadeco.push(wrapper.entidades[i].valor.toUpperCase());
            //console.log("lista canal >>>>" + JSON.stringify( this.canal ));
          }
        }
    },error => {
      if(  error.error ){
        if( error.error.codError ){
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
        } else {
          this.sinNoticeService.setNotice("Error al cargar parametros de Actividad Economica"  , 'error');
        }
			} else if(  error.statusText && error.status==401 ){
				this.dialog.open(AuthDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
			} else {
				this.sinNoticeService.setNotice("Error al cargar Actividad Economica", 'error');
			}
    } );
  }
  //Mensages
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
    //Datos referencias personales
    /* if (pfield && pfield === 'nombresCompletosR') {
      const input = this.nombresCompletosR;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'parentescoR') {
      const input = this.parentescoR;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'direccionR') {
      const input = this.direccionR;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'telefonoMovilR') {
      const input = this.telefonoMovilR;
      return input.hasError('pattern')
        ? errorNumero
        : input.hasError('maxlength')
          ? errorLogitudExedida
          : input.hasError('minlength')
            ? errorInsuficiente
            : '';
    }
    if (pfield && pfield === 'telefonoFijoR') {
      const input = this.telefonoFijoR;
      return input.hasError('pattern')
        ? errorNumero
        : input.hasError('maxlength')
          ? errorLogitudExedida
          : input.hasError('minlength')
            ? errorInsuficiente
            : '';
    } */
  }


  descargarPlantillaHabilitante() {
    this.registrarTracking( 
      TareaTrackingEnum.REGISTRO_DE_DOCUMENTOS_DEL_CLIENTE,
      null,
      null,
      SituacionTrackingEnum.EN_PROCESO, 
      UsuarioEnum.BPM, 
      true,
      false,
      false, 
      false );
    this.dh.downloadAutorizacionPlantilla(1, "PDF", this.nombresCompletos.value, this.identificacion.value).subscribe(
      (data: any) => {
        if (data) {
          saveAs(data, "Documento Habilitante" + ".pdf");
          this.registrarTracking( 
            TareaTrackingEnum.REGISTRO_DE_DOCUMENTOS_DEL_CLIENTE,
            null,
            this.idTracking2,
            SituacionTrackingEnum.EN_PROCESO, 
            UsuarioEnum.BPM, 
            false,
            true,
            true, 
            false );
        } else {
          this.sinNoticeService.setNotice(
            "NO SE ENCONTRO REGISTRO PARA DESCARGA",
            "error"
          );
        }
      },
      error => {
        //console.log("================>error: " + JSON.stringify(error));
        this.sinNoticeService.setNotice(
          "ERROR DESCARGA DE PLANTILLA HABILITANTE",
          "error"
        );
      }
    );
  }
  seleccionarActualizar() {
    let d = {
      idTipoDocumento: 1,
      identificacionCliente: this.identificacion.value,
      data: this.identificacion.value
    };
    const dialogRef = this.dialog.open(CargarFotoDialogComponent, {
      width: "auto",
      height: "auto",
      data: d

    });
    dialogRef.afterClosed().subscribe(r => {
      //console.log("===>>ertorno al cierre: " + JSON.stringify(r));
      if (r) {
        this.registrarTracking( 
          TareaTrackingEnum.REGISTRO_DE_DOCUMENTOS_DEL_CLIENTE,
          null,
          this.idTracking2,
          SituacionTrackingEnum.FINALIZADO, 
          UsuarioEnum.BPM, 
          false,
          false,
          false, 
          true );
        this.sinNoticeService.setNotice(
          "METODO NO IMPLEMENTADO",
          "error"
        );
      }
    });
  }
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
  nuevoActivo() {
    this.registrarTracking( 
      TareaTrackingEnum.CALCULO_DE_PATRIMONIO_DEL_CLIENTE,
      null,
      null,
      SituacionTrackingEnum.EN_PROCESO, 
      UsuarioEnum.BPM, 
      true,
      true,
      true, 
      false );
    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);
    this.patrimonioCliente = new TbQoPatrimonioCliente;
    if (this.formDatosPatrimonioActivos.valid) {
      if (this.avaluoActivo.value > this.valorValidacion) {
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
        this.registrarTracking( 
          TareaTrackingEnum.CALCULO_DE_PATRIMONIO_DEL_CLIENTE,
          null,
          this.idTracking5,
          SituacionTrackingEnum.FINALIZADO, 
          UsuarioEnum.BPM, 
          false,
          false,
          false, 
          true );
          this.idTracking5 = null;
        this.element = null;
        this.calcularActivo();
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALOR DE ACTIVO INGRESADO EN AVALUO NO ES VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'warning');
    }
  }
  nuevoPasivo() {
    this.registrarTracking( 
      TareaTrackingEnum.CALCULO_DE_PATRIMONIO_DEL_CLIENTE,
      null,
      null,
      SituacionTrackingEnum.EN_PROCESO, 
      UsuarioEnum.BPM, 
      true,
      true,
      true, 
      false );
    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);
    this.patrimonioCliente = new TbQoPatrimonioCliente;
    if (this.formDatosPatrimonioPasivos.valid) {
      if (this.avaluoPasivo.value > this.valorValidacion) {
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
        this.registrarTracking( 
          TareaTrackingEnum.CALCULO_DE_PATRIMONIO_DEL_CLIENTE,
          null,
          this.idTracking5,
          SituacionTrackingEnum.FINALIZADO, 
          UsuarioEnum.BPM, 
          false,
          false,
          false, 
          true );
          this.idTracking5 = null;
        this.element = null;
        this.calcularPasivo();
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALOR DE PASIVO INGRESADO EN AVALUO NO ES VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
    }
  }
  nuevoIngreso() {
    this.registrarTracking( 
      TareaTrackingEnum.CALCULO_DE_NIVEL_DE_ENDEUDAMIENTO_EN_INGRESOS_Y_EGRESOS,
      null,
      null,
      SituacionTrackingEnum.EN_PROCESO, 
      UsuarioEnum.BPM, 
      true,
      true,
      true, 
      false );
  
    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);
    this.valorEgreso.setValue(null);
    this.ingresoEgreso = new TbQoIngresoEgresoCliente;
    if (this.formDatosIngreso.valid) {
      if (this.valorIngreso.value > this.valorValidacion) {
        this.ingresoEgreso.valor = this.valorIngreso.value;
        this.ingresoEgreso.esIngreso  = true;
        this.ingresoEgreso.esEgreso   = false; 
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
        this.registrarTracking( 
          TareaTrackingEnum.CALCULO_DE_NIVEL_DE_ENDEUDAMIENTO_EN_INGRESOS_Y_EGRESOS,
          null,
          this.idTracking4,
          SituacionTrackingEnum.FINALIZADO, 
          UsuarioEnum.BPM, 
          false,
          false,
          false, 
          true );
          this.idTracking4 = null;
        this.calcularIngresoEgreso();
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALOR DEL INGRESO NO VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'warning');
    }
  }
  nuevoEgreso() {
    this.registrarTracking( 
      TareaTrackingEnum.CALCULO_DE_NIVEL_DE_ENDEUDAMIENTO_EN_INGRESOS_Y_EGRESOS,
      null,
      null,
      SituacionTrackingEnum.EN_PROCESO, 
      UsuarioEnum.BPM, 
      true,
      true,
      true, 
      false );
    this.valorValidacion = 0;
    this.sinNoticeService.setNotice(null);
    this.valorIngreso.setValue(null);
    this.ingresoEgreso = new TbQoIngresoEgresoCliente;
    if (this.formDatosEgreso.valid) {
      if (this.valorEgreso.value > this.valorValidacion) {
        this.ingresoEgreso.valor = this.valorEgreso.value;
        this.ingresoEgreso.esIngreso  = false;
        this.ingresoEgreso.esEgreso   = true; 
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
        this.registrarTracking( 
          TareaTrackingEnum.CALCULO_DE_NIVEL_DE_ENDEUDAMIENTO_EN_INGRESOS_Y_EGRESOS,
          null,
          this.idTracking4,
          SituacionTrackingEnum.FINALIZADO, 
          UsuarioEnum.BPM, 
          false,
          false,
          false, 
          true );
          this.idTracking4 = null;
        this.calcularIngresoEgreso();
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("VALOR DEL EGRESO NO VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
    }
  }
  calcularActivo() {
    this.totalActivo = 0;
    if (this.dataSourcePatrimonioActivo.data) {
      this.dataSourcePatrimonioActivo.data.forEach(element => {
        this.totalActivo = Number(this.totalActivo) + Number(element.avaluo);
      });
    }
  }
  calcularPasivo() {
    this.totalPasivo = 0;
    if (this.dataSourcePatrimonioPasivo.data) {
      this.dataSourcePatrimonioPasivo.data.forEach(element => {
        this.totalPasivo = Number(this.totalPasivo) + Number(element.avaluo);
      });
    }
  }
  calcularIngresoEgreso() {
    this.totalValorIngresoEgreso = 0;
    if (this.dataSourceIngresoEgreso.data) {
      this.dataSourceIngresoEgreso.data.forEach(element => {
        if (element.esIngreso && element.esEgreso == false) {
          this.totalValorIngresoEgreso = Number(this.totalValorIngresoEgreso) + Number(element.valor);
        } else{
          if (element.esIngreso == false && element.esEgreso){
            this.totalValorIngresoEgreso = Number(this.totalValorIngresoEgreso) - Number(element.valor);
          } else {
            this.sinNoticeService.setNotice("Error de desarrollo", 'error');
          }
        }
      });
    }
  }
  deleteIngresoEgreso(element) {
    const index = this.dataSourceIngresoEgreso.data.indexOf(element);
    this.dataSourceIngresoEgreso.data.splice(index, 1);
    const data = this.dataSourceIngresoEgreso.data;
    this.dataSourceIngresoEgreso.data = data;
    this.calcularIngresoEgreso();
  }

  deleteActivo(element) {
    const index = this.dataSourcePatrimonioActivo.data.indexOf(element);
    this.dataSourcePatrimonioActivo.data.splice(index, 1);
    const data = this.dataSourcePatrimonioActivo.data;
    this.dataSourcePatrimonioActivo.data = data;
    this.calcularActivo();
  }
  deletePasivo(element) {
    const index = this.dataSourcePatrimonioPasivo.data.indexOf(element);
    this.dataSourcePatrimonioPasivo.data.splice(index, 1);
    const data = this.dataSourcePatrimonioPasivo.data;
    this.dataSourcePatrimonioPasivo.data = data;
    this.calcularPasivo();
  }


  editar(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    console.log(JSON.stringify(element));
    if (element.esIngreso && element.esEgreso == false) {
      this.valorIngreso.setValue(element.valor);
    } else{
      if (element.esIngreso == false && element.esEgreso){
        this.valorEgreso.setValue(element.valor);
      } else {
        this.sinNoticeService.setNotice("Error de desarrollo", 'error');
      }
    }
  }
  editarActivo(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.activo.setValue(element.activos);
    this.avaluoActivo.setValue(element.avaluo);
  }
  editarPasivo(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.pasivo.setValue(element.pasivos);
    this.avaluoPasivo.setValue(element.avaluo);
  }


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
    Object.keys(this.formDatosIngreso.controls).forEach( (name) => {
      let control = this.formDatosIngreso.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.updateValueAndValidity();
    });
    Object.keys(this.formDatosEgreso.controls).forEach( (name) => {
      let control = this.formDatosEgreso.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.updateValueAndValidity();
    });
  }

  nuevaReferencia() {
    this.registrarTracking( 
      TareaTrackingEnum.AGREGANDO_REFERENCIAS_PERSONALES_DEL_CLIENTE,
      null,
      null,
      SituacionTrackingEnum.EN_PROCESO, 
      UsuarioEnum.BPM, 
      true,
      true,
      true, 
      false );
    this.sinNoticeService.setNotice(null);
    this.referencia = new TbReferencia;
    if (this.formDatosReferenciasPersonales.valid) {
      let a = 0;
      let b = 0;
      if (this.telefonoMovilR.value != null) {
        a = Number(this.telefonoMovilR.value);
      }
      if (this.telefonoFijoR.value) {
        b = Number(this.telefonoFijoR.value);
      }

      if (a >= 0 && b >= 0) {
        this.referencia.nombresCompletos  = this.nombresCompletosR.value.toUpperCase();
        this.referencia.parentesco        = this.parentescoR.value.toUpperCase();
        this.referencia.direccion         = this.direccionR.value.toUpperCase();
        this.referencia.telefonoMovil     = this.telefonoMovilR.value;
        this.referencia.telefonoFijo      = this.telefonoFijoR.value;
        if (this.element) {
          const index = this.dataSource.data.indexOf(this.element);
          this.dataSource.data.splice(index, 1);
          const data = this.dataSource.data;
          this.dataSource.data = data;
        }
        const data = this.dataSource.data;
        data.push(this.referencia);
        this.dataSource.data = data;
        this.registrarTracking( 
          TareaTrackingEnum.AGREGANDO_REFERENCIAS_PERSONALES_DEL_CLIENTE,
          null,
          this.idTracking6,
          SituacionTrackingEnum.FINALIZADO, 
          UsuarioEnum.BPM, 
          false,
          false,
          false, 
          true );
          this.idTracking6 = null;
        this.element = null;
        this.limpiarCampos();
      } else {
        this.sinNoticeService.setNotice("NUMERO DE TELEFONO NO VALIDO", 'warning');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'warning');
    }
  }

  deleteReferencia(element) {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    const data = this.dataSource.data;
    this.dataSource.data = data;
  }

  editarReferencia(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.nombresCompletosR.setValue(element.nombresCompletos);
    this.parentescoR.setValue(element.parentesco);
    this.direccionR.setValue(element.direccion);
    this.telefonoMovilR.setValue(element.telefonoMovil);
    this.telefonoFijoR.setValue(element.telefonoFijo);
  }

  cargarUbicacion(){
    this.pr.findAllEntities(this.p).subscribe((element : any) =>{
      if (element.list) {
        //console.log("lista  >>>>" + JSON.stringify(element));
        this.ubicacionEntity = element.list;
        for (let i = 0; i < this.ubicacionEntity.length; i++) {
          //console.log(">>>>>>>>>>>>>>>>>>>> Nombre Parroquia ", this.ubicacionEntity[i].canton.provincia);
          this.listNombreParroquia.push(this.ubicacionEntity[i].nombreParroquia.toUpperCase());

          //console.log("lista Parroquia >>>>" + JSON.stringify(this.listNombreParroquia));
        }
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("ERROR AL CARGAR", 'error');
      }
    });

  }
  crearUbicacionDomicilio(){
    if (this.ubicacion.value) {
      for (let i = 0; i < this.ubicacionEntity.length; i++) {
        
        if (this.ubicacionEntity[i].nombreParroquia.toUpperCase() == this.ubicacion.value) {
          let value = this.ubicacionEntity[i].nombreParroquia.toUpperCase() + " / " + this.ubicacionEntity[i].canton.nombreCanton.toUpperCase() + " / " + this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase();
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion ", value);
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion form ", this.ubicacion.value);
          this.cantonD    = this.ubicacionEntity[i].canton.nombreCanton.toUpperCase();
          this.parroquiaD = this.ubicacionEntity[i].nombreParroquia.toUpperCase()
          this.provinciaD = this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase()
        }
      }
    } 
  }
  crearUbicacionLaboral(){
    if (this.ubicacionO.value) {
      for (let i = 0; i < this.ubicacionEntity.length; i++) {
        
        if (this.ubicacionEntity[i].nombreParroquia.toUpperCase() == this.ubicacion.value) {
          let value = this.ubicacionEntity[i].nombreParroquia.toUpperCase() + " / " + this.ubicacionEntity[i].canton.nombreCanton.toUpperCase() + " / " + this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase();
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion ", value);
          //console.log(">>>>>>>>>>>>>>>>>>>> Ubicacion form ", this.ubicacion.value);
          this.cantonL    = this.ubicacionEntity[i].canton.nombreCanton.toUpperCase();
          this.parroquiaL = this.ubicacionEntity[i].nombreParroquia.toUpperCase()
          this.provinciaL = this.ubicacionEntity[i].canton.provincia.nombreProvincia.toUpperCase()
        }
      }
    } 
  }
  direccionLegalD(){
    if (this.drLgDo.value) {
      this.drLgLb.setValue(false);
    }else{
      this.drLgLb.setValue(true);
    }
    if (this.drLgLb.value) {
      this.drLgDo.setValue(false);
    }
  }
  direccionLegalL(){
    if (this.drLgLb.value) {
      this.drLgDo.setValue(false);
    } else {
      this.drLgDo.setValue(true);
    }
  }
  direccionCorreoD(){
    if (this.drCrDo.value){
      this.drCrLb.setValue(false);
    } else{
      this.drCrLb.setValue(true);
    }
  }
  direccionCorreoL(){
    if (this.drCrLb.value){
      this.drCrDo.setValue(false);
    } else{
      this.drCrDo.setValue(true);
    }
  }
  guardar(){
    this.loadingSubject.next(true);
    if (this.formCliente.valid) {
      if(this.formDatosContacto.valid){
        if(this.formDatosDireccionDomicilio.valid){
          if(this.formDatosDireccionLaboral.valid ){
            if(this.formDatosEconomicos.valid ){
              if(this.dataSourceIngresoEgreso.data.length > 0){
                if( (this.dataSourcePatrimonioActivo.data.length > 0) || (this.dataSourcePatrimonioPasivo.data.length > 0)){
                  if (this.dataSource.data.length > 1) {
                    this.cliente    = new TbQoCliente;
                    // **************  SET DE DATOS DE CLIENTE 
                    if (this.id != null && this.id != "") {
                      this.cliente.id = this.id;
                    }
                    this.cliente.actividadEconomica = this.actividadEconomica.value;
                    this.cliente.actividadEconomicaEmpresa = this.actividadEconomicaEmpresa.value;
                    this.cliente.apellidoMaterno = this.apellidoMaterno.value.toUpperCase();
                    this.cliente.apellidoPaterno = this.apellidoPaterno.value.toUpperCase();
                    console.log('canalito ----> '+ this.canalContacto.value );
                    this.cliente.canalContacto = this.canalContacto.value.toUpperCase();
                    this.cliente.cargasFamiliares = this.cargaFamiliar.value;
                    this.cliente.cargo = this.cargo.value.toUpperCase();
                    this.cliente.cedulaCliente = this.identificacion.value;
                    this.cliente.edad = this.edad.value;
                    this.cliente.email = this.email.value.toUpperCase();
                    this.cliente.estadoCivil = this.estadoCivil.value.toUpperCase();
                    this.cliente.fechaNacimiento = this.fechaNacimiento.value;
                    this.cliente.genero = this.genero.value.toUpperCase();
                    this.cliente.lugarNacimiento = this.lugarNacimiento.value.toUpperCase();
                    this.cliente.nacionalidad = this.nacionalidad.value.toUpperCase();
                    this.cliente.nivelEducacion = this.nivelEducacion.value.toUpperCase();
                    this.cliente.nombreEmpresa = this.actividadEmpresa.value.toUpperCase();
                    this.cliente.ocupacion = this.ocupacion.value.toUpperCase();
                    this.cliente.origenIngreso = this.origenIngresos.value.toUpperCase();
                    this.cliente.primerNombre = this.primerNombre.value.toUpperCase();
                    this.cliente.profesion = this.profesion.value.toUpperCase();
                    this.cliente.relacionDependencia = this.relacionDependencia.value.toUpperCase();
                    this.cliente.segundoNombre = this.segundoNombre.value.toUpperCase();
                    this.cliente.separacionBienes = this.separacionBienes.value.toUpperCase();
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
                    this.direccionDomicilio.numeracion =this.numeracion.value.toUpperCase();
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
                    this.direccionLaboral.numeracion =this.numeracionO.value.toUpperCase();
                    this.direccionLaboral.referenciaUbicacion = this.referenciaUbicacionO.value.toUpperCase();
                    this.direccionLaboral.sector = this.sectorO.value.toUpperCase();
                    this.direccionLaboral.tipoDireccion = "LABORAL";
                    this.direccionLaboral.tipoVivienda = this.tipoViviendaO.value.toUpperCase();
                    if (this.idDireccionLaboral != null) {
                      this.direccionLaboral.id = this.idDireccionLaboral
                    }
                    this.cliente.tbQoDireccionClientes.push(this.direccionLaboral);
                    // ******************* SET DE INGRESO EGRESO
                    this.dataSourceIngresoEgreso.data.forEach(element =>{
                      this.ingresoEgresoGuardado = new TbQoIngresoEgresoCliente();
                      this.ingresoEgresoGuardado.esEgreso = element.esEgreso;
                      this.ingresoEgresoGuardado.esIngreso= element.esIngreso;
                      this.ingresoEgresoGuardado.valor    = element.valor;
                      this.cliente.tbQoIngresoEgresoClientes.push(this.ingresoEgresoGuardado);
                    });
                    // ******************* SET DE PATRIMONIO ACTIVO
                    this.dataSourcePatrimonioActivo.data.forEach(element =>{
                      this.patrimonioActivo = new TbQoPatrimonioCliente();
                      this.patrimonioActivo.activos = element.activos;
                      this.patrimonioActivo.pasivos = element.pasivos;
                      this.patrimonioActivo.avaluo = element.avaluo;
                      this.cliente.tbQoPatrimonios.push(this.patrimonioActivo);
                    });
                    // ******************* SET DE PATRIMONIO PASIVO
                    this.dataSourcePatrimonioPasivo.data.forEach(element =>{
                      this.patrimonioPasivo = new TbQoPatrimonioCliente();
                      this.patrimonioPasivo.activos = element.activos;
                      this.patrimonioPasivo.pasivos = element.pasivos;
                      this.patrimonioPasivo.avaluo = element.avaluo;
                      this.cliente.tbQoPatrimonios.push(this.patrimonioPasivo);
                    });
                    // ******************* SET DE PATRIMONIO PASIVO
                    this.dataSource.data.forEach(element => {
                      this.referenciaGuardado = new TbReferencia();
                      this.referenciaGuardado.direccion = element.direccion;
                      this.referenciaGuardado.nombresCompletos = element.nombresCompletos;
                      this.referenciaGuardado.parentesco = element.parentesco;
                      this.referenciaGuardado.telefonoFijo = element.telefonoFijo;
                      this.referenciaGuardado.telefonoMovil = element.telefonoMovil;
                      this.cliente.tbQoReferenciaPersonals.push(this.referenciaGuardado);
                    });
                    //console.log(" JSON----->" + JSON.stringify(this.cliente))
                    this.cs.crearClienteConRelaciones(this.cliente).subscribe((data:any) =>{
                      if(data.entidad){
                        this.loadingSubject.next(false);
                        this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
                        //console.log("Id de cliente creado ----->" + JSON.stringify( data.entidad) );
                        this.registrarTracking( 
                          TareaTrackingEnum.REGISTRO_DE_INFORMACION_DEL_CLIENTE,
                          data.entidad.id,
                          this.idTracking1,
                          SituacionTrackingEnum.FINALIZADO, 
                          UsuarioEnum.ASESOR, 
                          false,
                          false,
                          false, 
                          true );
                        /* this.idTotalTracking.forEach(element => {
                          this.registrarTracking(null, data.entidad.id, element, null,null,false,false,false,false);
                        }); */
                      }
                    }, error =>{
                      this.loadingSubject.next(false);
                      if (JSON.stringify(error).indexOf("codError") > 0) {
                        let b = error.error;
                        this.sinNoticeService.setNotice(b.msgError, 'error');
                      } else {
                        this.sinNoticeService.setNotice("ERROR AL GUARDAR DATOS DEL CLIENTE", 'error');
                      }
                    });
                  } else {
                    this.loadingSubject.next(false);
                    this.sinNoticeService.setNotice("AGREGUE AL MENOS 2 REFERENCIAS PERSONALES", 'error');
                  }
                }else{
                  this.loadingSubject.next(false);
                  this.sinNoticeService.setNotice("AGREGUE AL MENOS ALGUN PATRIMONIO", 'error');
                }
              }else{
                this.loadingSubject.next(false);
                this.sinNoticeService.setNotice("AGREGUE AL MENOS ALGUN INGRESO O EGRESO", 'error');
              }
            }else{
              this.loadingSubject.next(false);
              this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS ECONOMICOS DEL CLIENTE", 'error');
            }
          } else {
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DIRECCION LABORAL", 'error');
          }
        }else {
          this.loadingSubject.next(false); 
          this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DIRECCION DE DOMICILIO", 'error');
        }
      }else { 
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS DE CONTACTO DEL CLIENTE", 'error');
      }
    }else { 
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS DEL CLIENTE", 'error');
    }
  }
  /**
   * 
   * @param observacion string
   * @param codigoRegistro string
   * @param id string
   * @param estado string
   * @param usuario string
   * @param fechaInicio    Boolean
   * @param fechaAsignacion    Boolean
   * @param fechaInicioAtencion    Boolean
   * @param fechaFin    Boolean
   * */
  public registrarTracking (  observacion : TareaTrackingEnum, 
                      codigoRegistro : string, 
                      id : string,
                      estado : SituacionTrackingEnum, 
                      usuario:UsuarioEnum, 
                      fechaInicio: Boolean,
                      fechaAsignacion: Boolean,
                      fechaInicioAtencion: Boolean,
                      fechaFin: Boolean,
                    ){

    let tracking : TbQoTracking = new TbQoTracking();
    tracking.actividad = ActividadEnum.NEGOCIACION.toString();
    tracking.proceso = ProcesoEnum.DATOS_CLIENTE;


    if (id != null && id != "") {
      tracking.id = id;
    }else{
      tracking.id = null
    }
    if (observacion != null) {
      tracking.observacion = observacion.toString();
    } else{
      tracking.observacion = null;
    }
    if (codigoRegistro != null) {
      tracking.codigoRegistro = codigoRegistro;
    } else {
      tracking.codigoRegistro = null;
    }
    if (estado != null) {
      tracking.estado = estado.toString();
    } else {
      tracking.estado = null;
    }
    if (usuario != null) {
      tracking.usuario = usuario.toString();
    } else {
      tracking.usuario = null;
    }
    if (fechaInicio) {
      tracking.fechaInicio = Date.now();
    }else{
      tracking.fechaInicio = null;
    }
    if (fechaAsignacion) {
      tracking.fechaAsignacion = Date.now();
    }else{
      tracking.fechaAsignacion = null;
    }
    if (fechaInicioAtencion) {
      tracking.fechaInicioAtencion = Date.now();
    }else{
      tracking.fechaInicioAtencion = null;
    }
    if (fechaFin) {
      tracking.fechaFin = Date.now();
    }else{
      tracking.fechaFin = null;
    }
    tracking.totalTiempo = null
    this.tr.guardarTracking(tracking).subscribe((data:any) =>{
      if (data.entidad) {
        //let a = this.idTotalTracking.push(data.entidad.id);
        //console.log("Numeros de trackin's creados ---->" + a +" / " + this.idTotalTracking)
        console.log("Tracking creado ------>" + JSON.stringify(data.entidad));
        if (observacion == TareaTrackingEnum.REGISTRO_DE_INFORMACION_DEL_CLIENTE) {
          this.idTracking1 = data.entidad.id;
          console.log("id registrado ------>" + this.idTracking1);

        }
        if (observacion == TareaTrackingEnum.REGISTRO_DE_DOCUMENTOS_DEL_CLIENTE) {
          this.idTracking2 = data.entidad.id;
          console.log("id registrado ------>" + this.idTracking2);

        }
        if (observacion == TareaTrackingEnum.PRESENTAR_DATOS_DE_CLIENTE_EXISTENTE) {
          this.idTracking3 = data.entidad.id;
          console.log("id registrado ------>" + this.idTracking3);

        }
        if (observacion == TareaTrackingEnum.CALCULO_DE_NIVEL_DE_ENDEUDAMIENTO_EN_INGRESOS_Y_EGRESOS) {
          this.idTracking4 = data.entidad.id;
          console.log("id registrado ------>" + this.idTracking4);

        }
        if (observacion == TareaTrackingEnum.CALCULO_DE_PATRIMONIO_DEL_CLIENTE) {
          this.idTracking5 = data.entidad.id;
          console.log("id registrado ------>" + this.idTracking5);

        }
        if (observacion == TareaTrackingEnum.AGREGANDO_REFERENCIAS_PERSONALES_DEL_CLIENTE) {
          this.idTracking6 = data.entidad.id;
          console.log("id registrado ------>" + this.idTracking6);

        }
        this.loadingSubject.next(false);

      } else {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("ERROR AL GUARDAR DATOS DEL CLIENTE", 'error');
      }
    }, error =>{
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("ERROR AL GUARDAR DATOS DEL CLIENTE", 'error');
      }
    });
  }

}
