import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { ArchivoUploadDialogComponent } from '../../../../../views/partials/custom/archivo/archivo-upload-dialog/archivo-upload-dialog.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EstadoJoyaEnum } from '../../../../../core/enum/EstadoJoyaEnum';
import { MatTableDataSource, MatDialog, MatDialogRef, MatPaginator, MatStepper, MAT_DIALOG_DATA } from '@angular/material';
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
import { startWith } from 'rxjs/operators';
import { WebcamImage } from 'ngx-webcam';
import { PatrimonioWrapper } from '../../../../../core/model/quski/PatrimonioWrapper';
import { CatalogoService } from '../../../../../core/services/quski/catalogo.service';
import { AddFotoComponent } from '../../../../../views/partials/custom/fotos/add-foto/add-foto.component';
import { ReFileUploadService } from '../../../../../core/services/re-file-upload.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}
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
  checked = false;
  disableConsultar;
  @Input() nombreParroquia: string;
  disableConsultarSubject = new BehaviorSubject<boolean>(true);


  //autocompletado
  myControl = new FormControl();
  options: User[] = [
    { name: 'Mary' },
    { name: 'Shelley' },
    { name: 'Igor' }
  ];
  filteredOptions: Observable<User[]>;

  public estadosJoyaSelect: Array<string> = [EstadoJoyaEnum[EstadoJoyaEnum.EXISTENCIA], EstadoJoyaEnum[EstadoJoyaEnum.PERFECCIONADO],
  EstadoJoyaEnum[EstadoJoyaEnum.EXISTENCIA_LOTE], EstadoJoyaEnum[EstadoJoyaEnum.EXISTENCIA_VITRINA], EstadoJoyaEnum[EstadoJoyaEnum.CUSTODIA],
  EstadoJoyaEnum[EstadoJoyaEnum.CANCELADA], EstadoJoyaEnum[EstadoJoyaEnum.DEVUELTA]];
  nombreQuery: any;
  panelOpenState = false;
  displayedColumns: string[] = ['Accion', 'N', 'NombresCompletos', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSource = new MatTableDataSource<TbReferencia>();
  displayedColumnsI = ['Accion', 'Activo', 'Avaluo', 'Pasivo', 'Ifis', 'Infocorp'];
  dataSourcePatrimonio = new MatTableDataSource<any>();
  public ingresoOrigen: Array<string> = [];
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public totalResults = 0;
  p = new Page();

  canal = null;
  actividad = null;
  actividadeco = null;
  ocupaciones = null;
  origen = null;


  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public lCreate;

  // STREPPER
  isLinear = true;
  // VARIABLE FOTO
  public webcamImage: WebcamImage = null;
  cliente: TbQoCliente[] = new Array();
  urlimage: string;
  // LISTAS & ENUMS
  listSeparacionBienes = [SeparacionBienesEnum.S_SI, SeparacionBienesEnum.S_NO];
  listProfesion = [ProfesionEnum.profesion];
  listEstadoCivil = [
    EstadoCivilEnum.SOLTERO,
    EstadoCivilEnum.CASADO,
    EstadoCivilEnum.DIVORCIADO,
    EstadoCivilEnum.CASADO_SEP_BIENES,
    EstadoCivilEnum.UNION_DE_HECHO,
    EstadoCivilEnum.UNION_LIBRE,
    EstadoCivilEnum.VIUDO
  ];
  listNivel = [
    NivelEstudioEnum.PRIMARIA,
    NivelEstudioEnum.SECUNDARIA,
    NivelEstudioEnum.SUPERIOR,
    NivelEstudioEnum.NINGUNA,
    NivelEstudioEnum.POSTGRADO,
    NivelEstudioEnum.TECNICA
  ];
  listSector = [SectorEnum.NORTE, SectorEnum.CENTRO, SectorEnum.SUR, SectorEnum.VALLE];
  listOrigenIngreso = [
    OrigenIngresosEnum.EMPLEADO_PRIVADO,
    OrigenIngresosEnum.EMPLEADO_PUBLICO,
    OrigenIngresosEnum.AMA_CASA,
    OrigenIngresosEnum.REMESAS,
    OrigenIngresosEnum.RENTISTAS,
    OrigenIngresosEnum.JUBILADO
  ];
  listTipoVivienda = [
    OcupacionInmuebleEnum.PROPIO,
    OcupacionInmuebleEnum.ARRENDADO,
    OcupacionInmuebleEnum.FAMILIAR,
    OcupacionInmuebleEnum.HIPOTECA
  ];
  listGenero = [
    GeneroEnum.FEMENINO,
    GeneroEnum.MASCULINO
  ];
  listCargaFamiliar = Object.keys(CargaFamiliarEnum); /* [
    CargaFamiliarEnum.CERO,
    CargaFamiliarEnum.UNO,
    CargaFamiliarEnum.DOS,
    CargaFamiliarEnum.TRES,
    CargaFamiliarEnum.CUATRO,
    CargaFamiliarEnum.CINCO,
    CargaFamiliarEnum.SEIS,
    CargaFamiliarEnum.SIETE,
    CargaFamiliarEnum.OCHO,
    CargaFamiliarEnum.NUEVE,
    CargaFamiliarEnum.DIES
  ];*/
  listaParroquias = [];
  listRelacionDependencia = [RelacionDependenciaEnum.SI, RelacionDependenciaEnum.NO, RelacionDependenciaEnum.NO_APLICA];
  // FORM DATOS CLIENTES
  public formCliente: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public primerNombre = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public segundoNombre = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public apellidoMaterno = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public apellidoPaterno = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public genero = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public estadoCivil = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cargaFamiliar = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public fechaNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public lugarNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nacionalidad = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nivelEducacion = new FormControl('', []);
  public actividadEconomica = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public canalContacto = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public separacionBienes = new FormControl('', [Validators.required]);
  public nombresCompletosApoderado = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cedulaCodeudor = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cedulaApoderado = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public edad = new FormControl('', []);
  public nombresCompletosCodeudor = new FormControl('', []);

  // FORM DE CONTACTO  
  public formDatosContacto: FormGroup = new FormGroup({});
  public telefonoFijo = new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(9)]);
  public telefonoAdicional = new FormControl('', [Validators.minLength(7), Validators.maxLength(10)]);
  public telefonoMovil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoOtro = new FormControl('', [Validators.minLength(7), Validators.maxLength(10)]);
  public email = new FormControl('', [Validators.email, Validators.maxLength(100), Validators.required]);
  // FORM DE  DOMICILIO 
  public formDatosDireccionDomicilio: FormGroup = new FormGroup({});
  public ubicacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public tipoVivienda = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public callePrincipal = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundaria = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public referenciaUbicacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public sector = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  // FORM DE  OFICINA 
  public formDatosDireccionLaboral: FormGroup = new FormGroup({});
  public ubicacionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public sectorO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public callePrincipalO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundariaO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public referenciaUbicacionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  // FORM DE DATOS ECONOMICOS CLIENTE 
  public formDatosEconomicos: FormGroup = new FormGroup({});
  public relacionDependencia = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public actividadEmpresa = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public actividadCliente = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public ocupacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cargo = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public profesion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public origenIngresos = new FormControl('', [Validators.required, Validators.maxLength(50)]);

  // FORM DE PATRIMONIO 
  public formDatosPatrimonio: FormGroup = new FormGroup({});
  public activo = new FormControl('', [Validators.required]);
  public avaluo = new FormControl('', [Validators.required, Validators.maxLength(50)]);

  // FORM DE REFERENCIAS PERSONALES
  public formDatosReferenciasPersonales: FormGroup = new FormGroup({});
  public nombresCompletosR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public parentescoR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public direccionR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public telefonoMovilR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public telefonoFijoR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  patrimonioClienteVector = [];
  patrimonioCliente: PatrimonioWrapper;
  referencia: TbReferencia;
  //Global datasource
  public element;
  public nombreArreglo: string;
  private idNegociacion;
  private idCliente;
  //Variables de calculo de ingreso-egreso
  public totalActivo: number = 0;
  public totalIfis: number = 0;
  public valorValidacion: number = 0;

  constructor(
    private cas: CatalogoService,
    private cs: ClienteService,
    public dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
    private svcParametros: ParametroService,
    private route: ActivatedRoute,
    private subheaderService: SubheaderService
  ) {
    this.svcParametros.setParameter();
    //DATOS CLIENTES
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
    this.formCliente.addControl("nombresCompletosApoderado ", this.nombresCompletosApoderado);
    this.formCliente.addControl("cedulaCodeudor ", this.cedulaCodeudor);
    this.formCliente.addControl("edad ", this.edad);

    //FORM DE CONTACTO  
    this.formDatosContacto.addControl("telefonoFijo  ", this.telefonoFijo);
    this.formDatosContacto.addControl("telefonoAdicional  ", this.telefonoAdicional);
    this.formDatosContacto.addControl("telefonoMovil  ", this.telefonoMovil);
    this.formDatosContacto.addControl("telefonoOtro  ", this.telefonoOtro);
    this.formDatosContacto.addControl("email  ", this.email);
    // FORM DE  DOMICILIO 
    this.formDatosDireccionDomicilio.addControl("ubicacion   ", this.ubicacion);
    this.formDatosDireccionDomicilio.addControl("tipoVivienda    ", this.tipoVivienda);
    this.formDatosDireccionDomicilio.addControl("callePrincipal    ", this.callePrincipal);
    this.formDatosDireccionDomicilio.addControl("numeracion    ", this.numeracion);
    this.formDatosDireccionDomicilio.addControl("calleSecundaria    ", this.calleSecundaria);
    this.formDatosDireccionDomicilio.addControl("referenciaUbicacion      ", this.referenciaUbicacion);
    this.formDatosDireccionDomicilio.addControl("sector     ", this.sector);
    // FORM DE OFICINA
    this.formDatosDireccionLaboral.addControl("ubicacionO     ", this.ubicacionO);
    this.formDatosDireccionLaboral.addControl("sectorO      ", this.sectorO);
    this.formDatosDireccionLaboral.addControl("callePrincipalO      ", this.callePrincipalO);
    this.formDatosDireccionLaboral.addControl("numeracionO      ", this.numeracionO);
    this.formDatosDireccionLaboral.addControl("calleSecundariaO      ", this.calleSecundariaO);
    this.formDatosDireccionLaboral.addControl("referenciaUbicacionO        ", this.referenciaUbicacionO);
    // FORM DE DATOS ECONOMICOS CLIENTE 
    this.formDatosEconomicos.addControl("relacionDependencia      ", this.relacionDependencia);
    this.formDatosEconomicos.addControl("actividadEmpresa       ", this.actividadEmpresa);
    this.formDatosEconomicos.addControl("actividadCliente       ", this.actividadCliente);
    this.formDatosEconomicos.addControl("ocupacion       ", this.ocupacion);
    this.formDatosEconomicos.addControl("cargo       ", this.cargo);
    this.formDatosEconomicos.addControl("profesion         ", this.profesion);
    this.formDatosEconomicos.addControl("origenIngresos          ", this.origenIngresos);
    // FORM DE INGRESO-EGRESO CLIENTE 
    this.formDatosPatrimonio.addControl("activo       ", this.activo);
    this.formDatosPatrimonio.addControl("avaluo        ", this.avaluo);
    // FORM DE REFERENCIAS PERSONALES
    this.formDatosReferenciasPersonales.addControl("nombresCompletosR        ", this.nombresCompletosR);
    this.formDatosReferenciasPersonales.addControl("parentescoR         ", this.parentescoR);
    this.formDatosReferenciasPersonales.addControl("direccionR        ", this.direccionR);
    this.formDatosReferenciasPersonales.addControl("telefonoMovilR         ", this.telefonoMovilR);
    this.formDatosReferenciasPersonales.addControl("telefonoFijoR        ", this.telefonoFijoR);

    //Disable
    this.nombresCompletos.disable();
    this.cedulaApoderado.disable();
    this.separacionBienes.disable();
    this.relacionDependencia.disable();
    this.profesion.disable();
  }

  ngOnInit() {

    this.disableConsultar = this.disableConsultarSubject.asObservable();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith('')
    );
    this.clienteNegociacion();
    this.buscarCatalogobyTipo();
    this.loadActividad();
    this.loadActividadEco();
    this.loadOcupacion();
    this.loadOrigenIngresos();
    this.subheaderService.setTitle("Gestion de Clientes");
    /* reader.result.split(',')[1] */

  }


  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  clienteNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      console.log("esta es la ruta q llega para el id de negociacion ", data);
      if (data.params.id) {
        console.log("id d negociacion ", data.params.id)
        this.idNegociacion = data.params.id;
        console.log('idNegociacion ', this.idNegociacion);
        this.cas.findNegociacionById(this.idNegociacion).subscribe((data: any) => {
          if (data.entidad) {

            console.log('cliente entidad ', data.entidad.tbQoCliente.cedulaCliente);
            this.idCliente = data.entidad.tbQoCliente.cedulaCliente;
            this.cliente = data.entidad.tbQoCliente.id;
            this.cs.findClienteByIdentificacion(this.idCliente).subscribe((data: any) => {
              console.log('identificacion ', this.idCliente);
              this.loadingSubject.next(false);
              console.log('cliente ', data.entidad);
              if (data.entidad) {
                console.log('cliente entidad ', data.entidad);
                this.nombresCompletos.setValue(data.entidad.primerNombre + ' ' + data.entidad.segundoNombre
                  + ' ' + data.entidad.apellidoPaterno + ' ' + data.entidad.apellidoMaterno);
                this.identificacion.setValue(data.entidad.cedulaCliente);
                this.primerNombre.setValue(data.entidad.primerNombre);
                this.segundoNombre.setValue(data.entidad.segundoNombre);
                this.nivelEducacion.setValue(data.entidad.nivelEducacion)
                this.apellidoPaterno.setValue(data.entidad.apellidoPaterno);
                this.apellidoMaterno.setValue(data.entidad.apellidoMaterno);
                this.genero.setValue(data.entidad.genero);
                this.estadoCivil.setValue(data.entidad.estadoCivil);
                this.cargaFamiliar.setValue(data.entidad.cargasFamiliares);
                this.fechaNacimiento.setValue(data.entidad.fechaNacimiento);
                this.nacionalidad.setValue(data.entidad.nacionalidad);
                this.lugarNacimiento.setValue(data.entidad.lugarNacimiento);
                this.edad.setValue(data.entidad.edad);
                this.telefonoFijo.setValue(data.entidad.telefonoFijo);
                this.telefonoMovil.setValue(data.entidad.telefonoMovil);
                this.email.setValue(data.entidad.email);
                this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
                this.loadingSubject.next(false);
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
            }
            );
          }
        }
        );
      }
    });
  }

  /* 
    onChangeFechaNacimiento() {
      this.loadingSubject.next(true);
      const fechaSeleccionada = new Date(
        this.formCliente.get('fechaNacimiento').value
      );
      if (fechaSeleccionada) {
        this.getDiffFechas(fechaSeleccionada, 'dd/MM/yyy');
      } else {
        this.sinNoticeService.setNotice(
          'El valor de la fecha es nulo',
          'warning'
        );
        this.loadingSubject.next(false);
      }
    }
    getDiffFechas(fecha: Date, format: string) {
      this.loadingSubject.next(true);
      const convertFechas = new RelativeDateAdapter();
      this.svcParametros.getDiffBetweenDateInicioActual(
          convertFechas.format(fecha, 'input'),
          format
        )
        .subscribe(
          (rDiff: any) => {
            const diff: YearMonthDay = rDiff.entidad;
            this.formCliente.get('edad').setValue(diff.year);
            const edad = this.formCliente.get('edad').value;
            if (edad != undefined && edad != null && edad < 18) {
              this.formCliente.get('edad').setErrors({'server-error' : 'error'});
            }
            this.loadingSubject.next(false);
          },
          error => {
            if (JSON.stringify(error).indexOf('codError') > 0) {
              const b = error.error;
              this.sinNoticeService.setNotice(b.msgError, 'error');
            } else {
              this.sinNoticeService.setNotice(
                'Error obtener diferencia de fechas',
                'error'
              );
              console.log(error);
            }
            this.loadingSubject.next(false);
          }
        );
    }
   */
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
      return this.avaluo.hasError('required') ? errorrequiredo : this.avaluo.hasError('invalido') ? errorFormatoIngreso : this.avaluo.hasError('min') ? 'Valor invalido' : ' ';
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

    if (pfield && pfield === 'actividadEconomica') {
      const input = this.actividadEconomica;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'canalContacto') {
      const input = this.canalContacto;
      return input.hasError('required') ? errorRequerido : '';
    }

    /* if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formDatosContacto.get('telefonoDomicilio');
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    } */
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
    if (pfield && pfield === 'actividadCliente') {
      const input = this.actividadCliente;
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
    if (pfield && pfield === 'nombresCompletosR') {
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
    }
  }


  setRelacionDependencia() {
    this.cargo.enable();
    this.actividadEmpresa.enable();
    //this.cargo.enable();
    //this.actividadEmpresa.enable();
    this.cargo.setValue('');
    this.actividadEmpresa.setValue('');
    const ingresoObtenido = this.origenIngresos.value;
    //console.log(">>>>>>>>>>>>>>>>>>>> origen ingresos ",ingresoObtenido);
    if (ingresoObtenido == OrigenIngresosEnum.EMPLEADO_PRIVADO || ingresoObtenido == OrigenIngresosEnum.EMPLEADO_PUBLICO) {
      this.relacionDependencia.setValue(RelacionDependenciaEnum.SI);
    } else {
      this.relacionDependencia.setValue(RelacionDependenciaEnum.NO);
      this.cargo.setValue('NO APLICA');
      this.actividadEmpresa.setValue('NO APLICA');
      // this.cargo.disable();
      // this.actividadEmpresa.disable();
      this.cargo.disable();
      this.actividadEmpresa.disable();
      //console.log(">>>>>>>>>>>>>>>>>>>> final set ",this.cargo);
    }
  }

  habilitarCampo() {
    this.separacionBienes.setValue('');
    const estadoCivilIngresado = this.estadoCivil.value;
    // console.log(">>>>>>>>>>>>>>>>>>>> entrando a estado civil ",estadoCivilIngresado);
    if (estadoCivilIngresado == EstadoCivilEnum.CASADO) {
      this.separacionBienes.enable();
      this.sinNoticeService.setNotice("SELECCIONE LA OPCION DE SEPARACIÒN DE BIENES ", 'warning');
    } else {
      this.separacionBienes.disable();
    }
  }

  onClick(event) {

    event.preventDefault();
    console.log('onClick this.ref._checked ' + this.ref._checked);
    if (this.ref._checked == false) {
      this.nombresCompletosApoderado.enable();
      this.cedulaApoderado.enable();
      this.sinNoticeService.setNotice("INGRESE LOS DATOS DEL APODERADO ", 'warning');
    } else {
      this.nombresCompletosApoderado.disable();
      this.cedulaApoderado.disable();
    }
    this.ref._checked = !this.ref._checked;
  }

  nuevo() {
    this.valorValidacion = 5000;
    this.sinNoticeService.setNotice(null);
    //console.log(">>>>>>>>>>>>>>>>>>>> Ingresando a egreso ");
    this.patrimonioCliente = new PatrimonioWrapper;
    if (this.formDatosPatrimonio.valid) {
      if (this.avaluo.value <= this.valorValidacion) {
        //console.log(">>>>>>>>>>>>>>>>>>>>validacion ingreso ",this.formDatosIngresosEgresos.get('ingreso').value);
        this.patrimonioCliente.avaluo = this.avaluo.value;
        this.patrimonioCliente.activo = this.activo.value;
        console.log(">>>>>>>>>>>>>>>>>>>>valor a egreso ", this.patrimonioCliente.avaluo);
        if (this.element) {
          const index = this.dataSourcePatrimonio.data.indexOf(this.element);
          this.dataSourcePatrimonio.data.splice(index, 1);
          const data = this.dataSourcePatrimonio.data;
          this.dataSourcePatrimonio.data = data;
        }
        const data = this.dataSourcePatrimonio.data;
        data.push(this.patrimonioCliente);
        this.dataSourcePatrimonio.data = data;
        this.element = null;
        this.calcular();
        this.limpiarCampos();
        console.log("datos ingresos - egresos  >>>><<<<" + JSON.stringify(this.patrimonioCliente));
      } else {
        this.sinNoticeService.setNotice("NO  PUEDE SER EL INGRESO MAYOR DE $5000.00", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'warning');
    }
  }

  calcular() {
    this.totalActivo = 0;
    this.totalIfis = 0;
    if (this.dataSourcePatrimonio.data) {
      //console.log("<<<<<<<<<<total totalPesoNeto >>>>>>>>>> "+this.totalPesoNeto);
      this.dataSourcePatrimonio.data.forEach(element => {
        this.totalActivo = Number(this.totalActivo) + Number(element.avaluo);
        this.totalIfis = Number(this.totalIfis) + Number(element.ifis);
        // console.log("<<<<<<<<<<total totalPesoNeto >>>>>>>>>> "+this.totalPesoNeto);
      });
    }
  }


  delete(element) {
    const index = this.dataSourcePatrimonio.data.indexOf(element);
    this.dataSourcePatrimonio.data.splice(index, 1);
    const data = this.dataSourcePatrimonio.data;
    this.dataSourcePatrimonio.data = data;
    this.calcular();
  }


  editar(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    console.log(JSON.stringify(element));
    this.activo.setValue(element.activo);
    this.avaluo.setValue(element.avaluo);
    //console.log("element  " + JSON.stringify(element));
  }


  limpiarCampos() {
    Object.keys(this.formDatosPatrimonio.controls).forEach((name) => {
      //console.log( "==limpiando " + name )
      let control = this.formDatosPatrimonio.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
    Object.keys(this.formDatosReferenciasPersonales.controls).forEach((name) => {
      //console.log( "==limpiando " + name )
      let control = this.formDatosReferenciasPersonales.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }

  nuevaReferencia() {
    this.sinNoticeService.setNotice(null);
    this.referencia = new TbReferencia;
    if (this.formDatosReferenciasPersonales.valid) {
      this.referencia.nombresCompletos = this.nombresCompletosR.value;
      this.referencia.parentesco = this.parentescoR.value;
      this.referencia.direccion = this.direccionR.value;
      this.referencia.telefonoMovil = this.telefonoMovilR.value;
      this.referencia.telefonoFijo = this.telefonoFijoR.value;
      //console.log("datos regerencia personal>>>><<<<" + JSON.stringify(this.referencia));      
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
      console.log("datos ingresos - egresos  >>>><<<<" + JSON.stringify(this.patrimonioCliente));
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'warning');
    }
  }

  deleteReferencia(element) {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    const data = this.dataSource.data;
    this.dataSource.data = data;
    console.log(">>>>>eliminando", this.dataSource.data);
  }

  editarReferencia(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    console.log(JSON.stringify(element));
    this.nombresCompletosR.setValue(element.nombresCompletos);
    this.parentescoR.setValue(element.parentesco);
    this.direccionR.setValue(element.direccion);
    this.telefonoFijoR.setValue(element.telefonoMovil);
    this.telefonoFijoR.setValue(element.telefonoFijo);
    //console.log("element  " + JSON.stringify(element));
  }

  subirImagen() {
    console.log("===> va a subir imagen");
    const dialogRef = this.dialog.open(AddFotoComponent, {
      data: {
        fileBase64: ""
      }
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log("===> afterAllClosed va a subir imagen " + data);
      if (data) {
        console.log("data " + JSON.stringify(data))
      }
    });
  }


  consultarPasivos() {

    this.cs.consultarPasivos(38).subscribe((element: any) => {
      console.log(element)
      if (element.list) {
        this.disableConsultarSubject.next(false);
        console.log("lista  >>>>" + JSON.stringify(element.list));
        const data = this.dataSourcePatrimonio.data;
        element.list.forEach(pat => data.push(pat))
        this.dataSourcePatrimonio.data = data;
        console.log(this.dataSourcePatrimonio.data)
        this.dataSource.data = data;

        this.calcular();
      } else {
        this.sinNoticeService.setNotice("No se puedo cargar el credito", 'info');
      }

    }, error => {

      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("ERROR AL CARGAR", 'error');
      }
    }
    );

  }


  cargarCombo(event: any) {
    console.log("mi event _____>>>>", event)
    this.nombreQuery = this.ubicacion.value;
    this.cs.consultarUbicaciones(this.nombreQuery).subscribe((data: any) => {
      this.listaParroquias = [];
      if (data.entidades) {
        data.entidades.forEach(row => {
          let nombre = row.canton.provincia.nombreProvincia + '/' + row.canton.nombreCanton + '/' + row.nombreParroquia
          this.listaParroquias.push(nombre)
          //console.log(row['nombreParroquia'])
        })
      }

    }, () => {
      this.listaParroquias = [];
    })
  }


  buscarCatalogobyTipo() {
    this.cas.findCatalogoByTipo("Canal de Contacto").subscribe((data: any) => {
      if (data.list) {
        console.log("lista  >>>>" + JSON.stringify(data.list));
        this.canal = data.list;
      }
    }
    );
  }

  loadActividad() {
    this.cas.findCatalogoByTipo("Actividad Economica Empresa").subscribe((data: any) => {
      if (data.list) {
        this.actividad = data.list;
      }
    }
    );
  }

  loadActividadEco() {
    this.cas.findCatalogoByTipo("Actividad Economica Cliente (MUPI)").subscribe((data: any) => {
      if (data.list) {
        this.actividadeco = data.list;
      }
    }
    );
  }

  loadOcupacion() {
    this.cas.findCatalogoByTipo("Ocupacion").subscribe((data: any) => {
      if (data.list) {
        this.ocupaciones = data.list;
      }
    }
    );
  }

  loadOrigenIngresos() {
    this.cas.findCatalogoByTipo("Origen de ingresos").subscribe((data: any) => {
      if (data.list) {
        this.origen = data.list;
      }
    }
    );
  }

  guardar() {
    if (this.nombresCompletos.value != '') {
      console.log("Entra a actualizarce  " + this.cliente)
      console.log("cliente>>>>  " + this.cliente)
    }
    else { console.log("Entra a ser nuevo" + this.cliente) }
  }

}
