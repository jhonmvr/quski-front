import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { DialogCargarHabilitanteComponent } from './dialog-cargar-habilitante/dialog-cargar-habilitante.component';
import { TbQoCuentaBancariaCliente } from '../../../../../core/model/quski/TbQoCuentaBancariaCliente';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { ClienteCompletoWrapper } from '../../../../../core/model/wrapper/ClienteCompletoWrapper';
import { TbQoDatoTrabajoCliente } from '../../../../../core/model/quski/TbQoDatoTrabajoCliente';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { TbQoDireccionCliente } from '../../../../../core/model/quski/TbQoDireccionCliente';
import { RelacionDependenciaEnum } from '../../../../../core/enum/RelacionDependenciaEnum';
import { TbQoTelefonoCliente } from '../../../../../core/model/quski/TbQoTelefonoCliente';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoPatrimonio } from '../../../../../core/model/quski/TbQoPatrimonio';
import { MatTableDataSource, MatDialog, MatStepper } from '@angular/material';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { ValidateDecimal } from '../../../../../core/util/validateDecimal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


export interface User {
  nombre: string;
  codigo: string;
}

@Component({
  selector: 'kt-gestion-cliente',
  templateUrl: './gestion-cliente.component.html',
  styleUrls: ['./gestion-cliente.component.scss']
})
export class GestionClienteComponent extends TrackingUtil implements OnInit {
  /** @STANDAR_VARIABLES **/
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadBusqueda = new BehaviorSubject<boolean>(false);
  public wrapper: ClienteCompletoWrapper;
  public loading;
  usuario
  agencia
  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  public origen: string;
  private item: any;
  public totalActivo: number = 0;
  public totalPasivo: number = 0;
  public totalValorIngresoEgreso: number = 0;
  public valorValidacion: number = 0;
  /** @TABLA_REFERENCIA **/
  public displayedColumns = ['Accion', 'nombresRef', 'apellidosRef', 'Direccion', 'Parentesco', 'TelefonoMovil', 'TelefonoFijo', 'Estado'];
  public dataSourceReferencia = new MatTableDataSource<TbReferencia>();
  /** @TABLA_PATRIMONIO **/
  displayedColumnsActivo = ['Accion', 'Activo', 'Avaluo'];
  displayedColumnsPasivo = ['Accion', 'Pasivo', 'Avaluo'];
  dataSourcePatrimonioActivo = new MatTableDataSource<TbQoPatrimonio>();
  dataSourcePatrimonioPasivo = new MatTableDataSource<TbQoPatrimonio>();
  /** @TABLA_INGRESO_EGRESO **/
  displayedColumnsII = ['Accion', 'Is', 'Valor'];
  dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();
  /** @TABLA_CUENTA **/
  displayedColumnsCuentas = ['Accion', 'banco', 'cuenta', 'esAhorros'];
  dataSourceCuentas = new MatTableDataSource<TbQoCuentaBancariaCliente>();
  /** @CATALOGOS **/
  public catActividadEconomica: Array<any>;
  public catActividadEconomicaMupi: Array<any>;
  public catPais: Array<any>;
  public catEducacion: Array<any>;
  public catGenero: Array<any>;
  public catEstadoCivil: Array<any>;
  public catSectorVivienda: Array<any>;
  public catTipoVivienda: Array<any>;
  public catOrigenIngreso: Array<any>;
  public catProfesion: Array<any>;
  public catCuenta: Array<any>;
  public catTipoReferencia: Array<any>;
  public catMotivoVisita: Array<any>;
  public catOcupacion: Array<any>;
  public catCargo: Array<any>;
  public catTipoTelefono: Array<any>;
  ;
  /** @ENUMS **/
  /** @DIVISION_POLITICA **/
  private divicionPolitica: User[];
  public catFiltradoLugarNacimiento: Observable<User[]>;
  public catFiltradoUbicacionDomicilio: Observable<User[]>;
  public catFiltradoUbicacionLaboral: Observable<User[]>;

  /** @FORMULARIOS **/
  public formCliente: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public actividadEconomica = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public apellidoPaterno = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public fechaNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public lugarNacimiento = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nivelEducacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cargaFamiliar = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public canalContacto = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public primerNombre = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nacionalidad = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public genero = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public apellidoMaterno = new FormControl('', [Validators.maxLength(50)]);
  public segundoNombre = new FormControl('', [Validators.maxLength(50)]);
  public estadoCivil = new FormControl('', Validators.required);
  public edad = new FormControl('', []);

  public formDatosContacto: FormGroup = new FormGroup({});
  public ubicacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public referenciaUbicacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public callePrincipal = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public barrio = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundaria = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public formDatosDireccionDomicilio: FormGroup = new FormGroup({});
  public tipoVivienda = new FormControl('', Validators.required);
  public sector = new FormControl('', Validators.required);
  public direccionLegalDomicilio = new FormControl('', []);
  public direccionCorreoDomicilio = new FormControl('', []);
  public ubicacionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public referenciaUbicacionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public callePrincipalO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public numeracionO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public barrioO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public calleSecundariaO = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public tipoViviendaO = new FormControl('', Validators.required);
  public formDatosDireccionLaboral: FormGroup = new FormGroup({});
  public sectorO = new FormControl('', Validators.required);
  public direccionLegalLaboral = new FormControl('', []);
  public direccionCorreoLaboral = new FormControl('', []);
  public actividadEconomicaEmpresa = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public actividadEconomicaMupi = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nombreEmpresa = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public origenIngresos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public profesion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public ocupacion = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cargo = new FormControl('', [Validators.required]);
  public formDatosEconomicos: FormGroup = new FormGroup({});
  public relacionDependencia = new FormControl('');
  public valorIngreso = new FormControl('', [Validators.required, ValidateDecimal, Validators.maxLength(13), Validators.max(5000) ]);
  public formDatosIngreso: FormGroup = new FormGroup({});
  public valorEgreso = new FormControl('', [Validators.required, ValidateDecimal, Validators.maxLength(13) ]);
  public formDatosEgreso: FormGroup = new FormGroup({});
  public avaluoActivo = new FormControl('', [Validators.required, ValidateDecimal, Validators.maxLength(13) ]);
  public formDatosPatrimonioActivos: FormGroup = new FormGroup({});
  public activo = new FormControl('', [Validators.maxLength(10)]);
  public avaluoPasivo = new FormControl('', [Validators.required, ValidateDecimal, Validators.maxLength(13) ]);
  public formDatosPatrimonioPasivos: FormGroup = new FormGroup({});
  public pasivo = new FormControl('', [Validators.maxLength(10)]);

  public formCuentas: FormGroup = new FormGroup({});
  public tipoCuenta = new FormControl('', [Validators.maxLength(50)]);
  public numeroCuenta = new FormControl('', [Validators.maxLength(20)]);
  public esAhorro = new FormControl('', []);

  public formDatosReferenciasPersonales: FormGroup = new FormGroup({});
  public telefonoFijoR = new FormControl('', [Validators.minLength(9), Validators.maxLength(9)]);
  public estadoR = new FormControl('', [Validators.required]);
  public telefonoMovilR = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
  public apellidosRef = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public nombresRef = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public parentescoR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public direccionR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public element;


  ///datos de contacto cliente
  dataSourceTelefonosCliente = new MatTableDataSource<any>();
  tipoTelefonoCliente = new FormControl('', [Validators.required]);
  public telefonoMovil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public email = new FormControl('', [Validators.email, Validators.maxLength(100), Validators.required]);
  public telefonoOtro = new FormControl('', [Validators.required]);
  public telefonoFijo = new FormControl('', [Validators.minLength(9), Validators.maxLength(9)]);
  teleId;

  constructor(
    private css: SoftbankService,
    private cli: ClienteService,
    public dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
    private sp: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    public tra: TrackingService,
  ) {
    super(tra);
    this.css.setParameter();
    this.cli.setParameter();
    this.sp.setParameter();
    /** @FORMULARIOS **/
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
    this.formCliente.addControl("nivelEducacion ", this.nivelEducacion);
    this.formCliente.addControl("actividadEconomica  ", this.actividadEconomica);
    this.formCliente.addControl("canalContacto  ", this.canalContacto);
    this.formDatosContacto.addControl("telefonoFijo  ", this.telefonoFijo);
    this.formDatosContacto.addControl("telefonoMovil  ", this.telefonoMovil);
    this.formDatosContacto.addControl("telefonoOtro  ", this.telefonoOtro);
    this.formDatosContacto.addControl("email  ", this.email);
    this.formDatosDireccionDomicilio.addControl("ubicacion   ", this.ubicacion);
    this.formDatosDireccionDomicilio.addControl("tipoVivienda    ", this.tipoVivienda);
    this.formDatosDireccionDomicilio.addControl("callePrincipal", this.callePrincipal);
    this.formDatosDireccionDomicilio.addControl("barrio    ", this.barrio);
    this.formDatosDireccionDomicilio.addControl("numeracion    ", this.numeracion);
    this.formDatosDireccionDomicilio.addControl("calleSecundaria", this.calleSecundaria);
    this.formDatosDireccionDomicilio.addControl("referenciaUbicacion", this.referenciaUbicacion);
    this.formDatosDireccionDomicilio.addControl("sector     ", this.sector);
    this.formDatosDireccionLaboral.addControl("tipoViviendaO    ", this.tipoViviendaO);
    this.formDatosDireccionLaboral.addControl("ubicacionO     ", this.ubicacionO);
    this.formDatosDireccionLaboral.addControl("barrioO    ", this.barrioO);
    this.formDatosDireccionLaboral.addControl("sectorO      ", this.sectorO);
    this.formDatosDireccionLaboral.addControl("callePrincipalO    ", this.callePrincipalO);
    this.formDatosDireccionLaboral.addControl("numeracionO      ", this.numeracionO);
    this.formDatosDireccionLaboral.addControl("calleSecundariaO    ", this.calleSecundariaO);
    this.formDatosDireccionLaboral.addControl("referenciaUbicacionO", this.referenciaUbicacionO);
    this.formDatosEconomicos.addControl("relacionDependencia", this.relacionDependencia);
    this.formDatosEconomicos.addControl("nombreEmpresa", this.nombreEmpresa);
    this.formDatosEconomicos.addControl("actividadEconomicaEmpresa", this.actividadEconomicaEmpresa);
    this.formDatosEconomicos.addControl("actividadEconomicaMupi", this.actividadEconomicaMupi);
    this.formDatosEconomicos.addControl("ocupacion", this.ocupacion);
    this.formDatosEconomicos.addControl("cargo", this.cargo);
    this.formDatosEconomicos.addControl("profesion", this.profesion);
    this.formDatosEconomicos.addControl("origenIngresos", this.origenIngresos);
    this.formDatosIngreso.addControl("valorIngreso ", this.valorIngreso);
    this.formDatosEgreso.addControl("valorEgreso ", this.valorEgreso);
    this.formDatosPatrimonioActivos.addControl("activo      ", this.activo);
    this.formDatosPatrimonioActivos.addControl("avaluoActivo", this.avaluoActivo);
    this.formDatosPatrimonioPasivos.addControl("pasivo      ", this.pasivo);
    this.formDatosPatrimonioPasivos.addControl("avaluoPasivo", this.avaluoPasivo);
    this.formCuentas.addControl("tipoCuenta      ", this.tipoCuenta);
    this.formCuentas.addControl("numeroCuenta", this.numeroCuenta);
    this.formCuentas.addControl("esAhorro      ", this.esAhorro);
    this.formDatosReferenciasPersonales.addControl("apellidosRef", this.apellidosRef);
    this.formDatosReferenciasPersonales.addControl("nombresRef", this.nombresRef);
    this.formDatosReferenciasPersonales.addControl("parentescoR      ", this.parentescoR);
    this.formDatosReferenciasPersonales.addControl("direccionR       ", this.direccionR);
    this.formDatosReferenciasPersonales.addControl("telefonoMovilR   ", this.telefonoMovilR);
    this.formDatosReferenciasPersonales.addControl("telefonoFijoR    ", this.telefonoFijoR);
    this.formDatosReferenciasPersonales.addControl("estadoR          ", this.estadoR);

  }

  ngOnInit() {
    this.css.setParameter();
    this.cli.setParameter();
    this.sp.setParameter();
    this.subheaderService.setTitle("Gestion de Cliente");
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem('idAgencia');
    this.buscarCliente();
  }
  public regresar() {
    let mensaje = "Los datos del cliente no se han guardado. Si desea regresar se perderan los datos ingresados";
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        if (this.origen == 'NEG') {
          this.router.navigate(['negociacion/gestion-negociacion/NEG/', this.item]);
        }
        if (this.origen == 'NOV') {
          this.router.navigate(['novacion/crear-novacion/NOV/', this.item]);
        }
      }
    });

  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private cargarCampos() {
    if (this.wrapper) {
      this.nombresCompletos.setValue(this.wrapper.cliente.nombreCompleto);
      this.nombresCompletos.disable();
      this.numeroCuenta.disable();
      this.esAhorro.disable();
      this.direccionLegalDomicilio.setValue(true);
      this.direccionCorreoDomicilio.setValue(true);
      this.direccionLegalLaboral.setValue(false);
      this.direccionCorreoLaboral.setValue(false);
      this.tipoCuenta.disable();
      this.identificacion.setValue(this.wrapper.cliente.cedulaCliente);
      this.identificacion.disable();
      this.fechaNacimiento.setValue(new Date(this.wrapper.cliente.fechaNacimiento));
      this.onChangeFechaNacimiento();
      this.nivelEducacion.setValue(this.catEducacion.find(x => x.codigo == this.wrapper.cliente.nivelEducacion));
      this.nacionalidad.setValue(this.catPais.find(x => x.id == this.wrapper.cliente.nacionalidad));
      this.email.setValue(this.wrapper.cliente.email);
      this.primerNombre.setValue(this.wrapper.cliente.primerNombre);
      this.segundoNombre.setValue(this.wrapper.cliente.segundoNombre);
      this.apellidoPaterno.setValue(this.wrapper.cliente.apellidoPaterno);
      this.apellidoMaterno.setValue(this.wrapper.cliente.apellidoMaterno);
      this.genero.setValue(this.catGenero.find(x => x.codigo == this.wrapper.cliente.genero));
      this.estadoCivil.setValue(this.catEstadoCivil.find(x => x.codigo == this.wrapper.cliente.estadoCivil));
      this.cargaFamiliar.setValue(this.wrapper.cliente.cargasFamiliares);
      if (this.wrapper.cliente.lugarNacimiento) {
        this.catFiltradoLugarNacimiento.subscribe((data: any) => {
          this.lugarNacimiento.setValue(data.find(x => x.id == this.wrapper.cliente.lugarNacimiento));
        });
      }
      this.edad.setValue(this.wrapper.cliente.edad);
      this.canalContacto.setValue(this.catMotivoVisita.find(x => x.codigo == this.wrapper.cliente.canalContacto));
      let countFijo: number = 0;
      let countOtro: number = 0;
      let countMovil: number = 0;
      if (this.wrapper.telefonos) {
        this.dataSourceTelefonosCliente = new MatTableDataSource<any>(this.wrapper.telefonos);
      }
      let countOfi: number = 0;
      let countDom: number = 0;
      !this.wrapper.datosTrabajos ? null : this.wrapper.datosTrabajos.forEach(t => {
        if (t.esprincipal && t.estado == 'ACT') {
          this.origenIngresos.setValue(this.catOrigenIngreso.find(x => x.codigo == t.origenIngreso));
          this.relacionDependencia.setValue(t.esRelacionDependencia ? "SI" : "NO");
          this.nombreEmpresa.setValue(t.nombreEmpresa);
          this.cargo.setValue(this.catCargo.find(x => x.codigo == t.cargo));
          this.ocupacion.setValue(this.catOcupacion.find(x => x.codigo == t.ocupacion));
          this.setRelacionDependencia();
          this.actividadEconomicaMupi.setValue(
            this.catActividadEconomicaMupi.find(x => x.codigo == t.actividadEconomicaMupi) ?
              this.catActividadEconomicaMupi.find(x => x.codigo == t.actividadEconomicaMupi) :
              this.catActividadEconomicaMupi.find(x => x.esPorDefecto == true));
          this.actividadEconomicaEmpresa.setValue(
            this.catActividadEconomica.find(x => x.id.toString() == t.actividadEconomica) ?
              this.catActividadEconomica.find(x => x.id.toString() == t.actividadEconomica) :
              this.catActividadEconomica.find(x => x.esPorDefecto == true));
          if (this.wrapper.cliente.actividadEconomica) {
            this.actividadEconomica.setValue(this.catActividadEconomica.find(x => x.id.toString() == this.wrapper.cliente.actividadEconomica));
          }
          if (this.wrapper.cliente.profesion) {
            this.profesion.setValue(this.catProfesion.find(x => x.codigo == this.wrapper.cliente.profesion));
          }
        } else {
          t.estado = 'INA';
          t.esprincipal = false;
        }
      });
      !this.wrapper.direcciones ? null : this.wrapper.direcciones.forEach(e => {
        if (e.tipoDireccion == "OFI" && e.estado == 'ACT' && countOfi < 1) {
          this.catFiltradoUbicacionLaboral.subscribe((data: any) => {
            this.ubicacionO.setValue(data.find(x => x.id == e.divisionPolitica));
          });
          this.tipoViviendaO.setValue(this.catTipoVivienda.find(x => x.codigo == e.tipoVivienda));
          this.callePrincipalO.setValue(e.callePrincipal.toUpperCase());
          this.barrioO.setValue(e.barrio ? e.barrio.toUpperCase() : null);
          this.numeracionO.setValue(e.numeracion.toUpperCase());
          this.calleSecundariaO.setValue(e.calleSegundaria.toUpperCase());
          this.referenciaUbicacionO.setValue(e.referenciaUbicacion.toUpperCase());
          this.sectorO.setValue(this.catSectorVivienda.find(x => x.codigo == e.sector));
          this.direccionLegalLaboral.setValue(e.direccionLegal);
          this.direccionCorreoLaboral.setValue(e.direccionEnvioCorrespondencia);
          countOfi++;
        } else if (e.tipoDireccion == "DOM" && e.estado == 'ACT' && countDom < 1) {
          this.catFiltradoUbicacionDomicilio.subscribe((data: any) => {
            this.ubicacion.setValue(data.find(x => x.id == e.divisionPolitica));
          });
          this.tipoVivienda.setValue(this.catTipoVivienda.find(x => x.codigo == e.tipoVivienda));
          this.callePrincipal.setValue(e.callePrincipal);
          this.numeracion.setValue(e.numeracion);
          this.calleSecundaria.setValue(e.calleSegundaria);
          this.referenciaUbicacion.setValue(e.referenciaUbicacion);
          this.sector.setValue(this.catSectorVivienda.find(x => x.codigo == e.sector));
          this.barrio.setValue(e.barrio);
          this.direccionLegalDomicilio.setValue(e.direccionLegal);
          this.direccionCorreoDomicilio.setValue(e.direccionEnvioCorrespondencia);
          countDom++;
        } else {
          e.estado = 'INA';
          e.barrio = 'No Espeficicado';
        }
      });
      !this.wrapper.cuentas ? null : this.wrapper.cuentas.forEach(e => {
        e.estado = 'INA';
      });
      if (this.wrapper.cuentas) {
        this.wrapper.cuentas[0].estado = 'ACT';
        let item = this.catCuenta.find(x => x.id == this.wrapper.cuentas[0].banco)
        this.tipoCuenta.setValue(item.nombre)
        this.numeroCuenta.setValue(this.wrapper.cuentas[0].cuenta);
        this.esAhorro.setValue(this.wrapper.cuentas[0].esAhorros ? 'SI' : 'NO');
      }
      this.dataSourceReferencia = new MatTableDataSource<any>(this.wrapper.referencias);
      this.valorIngreso.setValue(this.wrapper.cliente.ingresos.toFixed(2));
      this.valorEgreso.setValue(this.wrapper.cliente.egresos.toFixed(2));
      this.avaluoPasivo.setValue(this.wrapper.cliente.pasivos.toFixed(2));
      this.avaluoActivo.setValue(this.wrapper.cliente.activos.toFixed(2));
      this.guardarTraking(this.origen == 'NEG' ? 'NUEVO' : this.origen == 'NOV' ? 'RENOVACION': null,
      this.wrapper ? this.wrapper.codigoBpm : null, ['Datos Personales','Datos de contacto','Dirección Domicilio','Dirección Laboral','Datos Económico','Ingresos / Egresos','Patrimonio','Cuentas Bancarias','Referencias Personales'], 
      0, 'GESTION CLIENTE','');
    } else {
      this.sinNoticeService.setNotice('Error cargando cliente', 'error');
    }
  }
  private buscarCliente() {
    this.route.paramMap.subscribe((data: any) => {
      this.loadBusqueda.next(true);
      this.origen = data.params.origen;
      this.item = data.params.item;
      if (data.params.origen == "NEG" || data.params.origen == "NOV") {
        this.item = data.params.item
        this.cli.traerClienteByIdNegociacion(data.params.item).subscribe((data: any) => {
          if (!data.entidad.existeError) {
            this.wrapper = data.entidad;
            this.traerCatalogos();
          } else {
            this.loadBusqueda.next(false);
            this.sinNoticeService.setNotice('NO EXISTE CLIENTE: ' + data.entidad.mensaje, 'error');
          }
        });
      } else if (data.params.origen == "CED") {
        this.cli.traerClienteByCedula(data.params.item).subscribe((data: any) => {
          if (!data.entidad.existeError) {
            this.wrapper = data.entidad;
            this.traerCatalogos();
          } else {
            this.loadBusqueda.next(false);
            this.sinNoticeService.setNotice('NO EXISTE CLIENTE: ' + data.entidad.mensaje, 'error');
          }
        });
      } else {
        this.loadBusqueda.next(false);
        this.sinNoticeService.setNotice('ERROR EN EL CODIGO DE ENTRADA', 'error');
      }
    });
  }
  private traerCatalogos() {
    this.css.consultarActividadEconomicaCS().subscribe((data1: any) => {
      if (!data1.existeError) {
        let nombreconsultaActividadEconomica = data1.catalogo; // .filter(e=>e.nombre)
        this.catActividadEconomica = nombreconsultaActividadEconomica.map(activi => {
          const subActivi = nombreconsultaActividadEconomica.find(sa => sa.id == activi.idPadre) || {};
          const padre = subActivi.nombre ? " / " + subActivi.nombre : "";
          return { nombre: activi.nombre + padre, id: activi.id, esPorDefecto: activi.esPorDefecto };
        });
        this.css.consultarActividadEconomicaMupiCS().subscribe((data: any) => {
          this.catActividadEconomicaMupi = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.css.consultarPaisCS().subscribe((data: any) => {
            this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
            this.css.consultarGeneroCS().subscribe((data: any) => {
              this.catGenero = !data.existeError ? data.catalogo : "Error al cargar catalogo";
              this.css.consultarEstadosCivilesCS().subscribe((data: any) => {
                this.catEstadoCivil = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                this.css.consultarSectorViviendaCS().subscribe((data: any) => {
                  this.catSectorVivienda = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                  this.css.consultarTipoViviendaCS().subscribe((data: any) => {
                    this.catTipoVivienda = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                    this.css.consultarProfesionesCS().subscribe((data: any) => {
                      this.catProfesion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                      this.css.consultarBancosCS().subscribe((data: any) => {
                        this.catCuenta = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                        this.css.consultarTipoReferenciaCS().subscribe((data: any) => {
                          this.catTipoReferencia = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                          this.css.consultarOcupacionCS().subscribe((data: any) => {
                            this.catOcupacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                            this.css.consultarMotivoVisita().subscribe((data: any) => {
                              this.catMotivoVisita = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                              this.css.consultarCargoOcupacion().subscribe((data: any) => {
                                this.catCargo = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                                this.css.consultarTipoTelefonoCS().subscribe(tipoTel => {
                                  this.catTipoTelefono = tipoTel.catalogo;
                                })
                                this.css.consultarDivicionPoliticaCS().subscribe((data: any) => {
                                  if (!data.existeError) {
                                    const localizacion = data.catalogo;
                                    let bprovinces = localizacion.filter(e => e.tipoDivision == 'PROVINCIA');
                                    let bCantons = localizacion.filter(e => e.tipoDivision == 'CANTON');
                                    let bParroqui = localizacion.filter(e => e.tipoDivision == 'PARROQUIA');
                                    let ubicacion: User[] = bParroqui.map(parro => {
                                      const cant = bCantons.find(c => c.id == parro.idPadre) || {};
                                      const pro = bprovinces.find(p => p.id == cant.idPadre) || {};
                                      return { nombre: parro.nombre + " / " + cant.nombre + " / " + pro.nombre, id: parro.id };
                                    });
                                    this.divicionPolitica = ubicacion;
                                    this.catFiltradoLugarNacimiento = this.lugarNacimiento.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : name), map(nombre => nombre ? this._filter(nombre) : ubicacion));
                                    this.catFiltradoUbicacionDomicilio = this.ubicacion.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : name), map(nombre => nombre ? this._filter(nombre) : ubicacion));
                                    this.catFiltradoUbicacionLaboral = this.ubicacionO.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : name), map(nombre => nombre ? this._filter(nombre) : ubicacion));
                                    this.css.consultarEducacionCS().subscribe((data: any) => {
                                      this.catEducacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                                      this.css.consultarOrigenIngresoCS().subscribe((data: any) => {
                                        this.catOrigenIngreso = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                                        this.cargarCampos();
                                      });
                                    });
                                  } else {
                                    this.loadingSubject.next(false);
                                    this.sinNoticeService.setNotice('Catalogos de softbank no se encuentran disponibles', 'error');
                                  }
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @FUNCIONALIDAD ** */
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public onChangeFechaNacimiento() {
    this.loadingSubject.next(true);
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    if (fechaSeleccionada) {
      const convertFechas = new RelativeDateAdapter();
      this.sp.getDiffBetweenDateInicioActual(convertFechas.format(fechaSeleccionada, "input"), "dd/MM/yyy").subscribe((rDiff: any) => {
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
  public getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorEmail = 'Correo Incorrecto';
    const errorNumero = 'Ingreso solo numeros';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    const errorDecimal = 'Ingrese valores decimales: 0.00';

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

     if (pfield && pfield == "avaluoActivo") {
      const input = this.avaluoActivo;
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalido") 
            ? errorDecimal 
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : "";
    }if (pfield && pfield == "avaluoPasivo") {
      const input = this.avaluoPasivo;
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalido") 
            ? errorDecimal 
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : "";
    }if (pfield && pfield == "valorEgreso") {
      const input = this.valorEgreso;
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalido") 
            ? errorDecimal 
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : "";
    }if (pfield && pfield === 'valorIngreso') {
      const input = this.valorIngreso;
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalido") 
            ? errorDecimal 
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : input.hasError('max') 
                ? 'El ingreso total no puede ser mayor a 5000' 
                : '';
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
    if (pfield && pfield === 'actividadEconomica') {
      const input = this.actividadEconomica;
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
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("maxlength")
          ? errorLogitudExedida
          : /* this.lugarNacimiento.value && (!this.lugarNacimiento.value.id || this.lugarNacimiento.value.id == 0)
            ? 'Direccion no valida.' 
            : */ "";
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
    if (pfield && pfield === 'telefonoMovilR') {
      const input = this.telefonoMovilR;
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
    if (pfield && pfield === 'telefonoFijoR') {
      const input = this.telefonoFijoR;
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
    if (pfield && pfield === 'nombreEmpresa') {
      const input = this.nombreEmpresa;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'actividadEconomicaEmpresa') {
      const input = this.actividadEconomicaEmpresa;
      return input.hasError('required') ? errorRequerido : '';
    }
    if (pfield && pfield === 'actividadEconomicaMupi') {
      const input = this.actividadEconomicaMupi;
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
  public _filter(nombre: string): User[] {
    const filterValue = nombre.toLowerCase();
    return this.divicionPolitica.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
  }
  public displayFn(user: User): string {
    return user && user.nombre ? user.nombre : '';
  }
  public setRelacionDependencia() {
    const ingresoObtenido = this.origenIngresos.value.codigo;
    if (ingresoObtenido == "1" || ingresoObtenido == "2") {
      this.actividadEconomicaEmpresa.enable();
      this.actividadEconomicaEmpresa.setValue(null);
      this.actividadEconomicaMupi.disable();
      this.actividadEconomicaMupi.setValue(this.catActividadEconomicaMupi.find(x => x.esPorDefecto == true));
      this.relacionDependencia.setValue(RelacionDependenciaEnum.SI);
      this.relacionDependencia.disable();
      this.nombreEmpresa.enable();
      this.cargo.enable();
    } else {
      this.actividadEconomicaMupi.enable();
      this.actividadEconomicaMupi.setValue(null);
      this.actividadEconomicaEmpresa.disable();
      this.actividadEconomicaEmpresa.setValue(this.catActividadEconomica.find(x => x.esPorDefecto == true));
      this.relacionDependencia.setValue(RelacionDependenciaEnum.NO);
      this.relacionDependencia.disable();

      this.cargo.setValue(this.catCargo.find(x => x.codigo == 'C1403'));
      this.cargo.disable();
      this.nombreEmpresa.setValue("NO APLICA");
      this.nombreEmpresa.disable();

    }
  }
  public direccionLegalD() {
    if (this.direccionLegalDomicilio.value) {
      this.direccionLegalLaboral.setValue(false);
    } else {
      this.direccionLegalLaboral.setValue(true);
    }
  }
  public direccionLegalL() {
    if (this.direccionLegalLaboral.value) {
      this.direccionLegalDomicilio.setValue(false);
    } else {
      this.direccionLegalDomicilio.setValue(true);
    }
  }
  public direccionCorreoD() {
    if (this.direccionCorreoDomicilio.value) {
      this.direccionCorreoLaboral.setValue(false);
    } else {
      this.direccionCorreoLaboral.setValue(true);
    }
  }
  public direccionCorreoL() {
    if (this.direccionCorreoLaboral.value) {
      this.direccionCorreoDomicilio.setValue(false);
    } else {
      this.direccionCorreoDomicilio.setValue(true);
    }
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BOTONES ** */
  public cargarComponenteHabilitante() {
    if (this.wrapper.cliente.id != null && this.wrapper.cliente.id != 0 && this.identificacion.value) {
      const dialogRef = this.dialog.open(DialogCargarHabilitanteComponent, {
        width: "900px",
        height: "400px",
        data: this.identificacion.value
      });
    } else {
      this.sinNoticeService.setNotice("ERROR NO HAY CLIENTE PARA ACTUALIZAR LOS HABILITANTES", 'error');
    }
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @PASIVOS @ACTIVOS @INGRESOS @EGRESOS @PATRIMONIO ** */
  public nuevoActivo() {
    this.valorValidacion = 0;
    if (this.formDatosPatrimonioActivos.valid) {
      if (this.avaluoActivo.value > this.valorValidacion && this.activo.value != "" && this.activo.value != null) {
        const patrimonioCliente = new TbQoPatrimonio(this.avaluoActivo.value, true);
        patrimonioCliente.activos = this.activo.value.toUpperCase();
        if (this.element) {
          const index = this.dataSourcePatrimonioActivo.data.indexOf(this.element);
          this.dataSourcePatrimonioActivo.data.splice(index, 1);
          const data = this.dataSourcePatrimonioActivo.data;
          this.dataSourcePatrimonioActivo.data = data;
        }
        const data = this.dataSourcePatrimonioActivo.data;
        data.push(patrimonioCliente);
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
  public nuevoPasivo() {
    this.valorValidacion = 0;
    if (this.formDatosPatrimonioPasivos.valid) {
      if (this.avaluoPasivo.value > this.valorValidacion && this.pasivo.value != null && this.pasivo.value != "") {
        const patrimonioCliente = new TbQoPatrimonio(this.avaluoPasivo.value, false);
        patrimonioCliente.pasivos = this.pasivo.value.toUpperCase();
        if (this.element) {
          const index = this.dataSourcePatrimonioPasivo.data.indexOf(this.element);
          this.dataSourcePatrimonioPasivo.data.splice(index, 1);
          const data = this.dataSourcePatrimonioPasivo.data;
          this.dataSourcePatrimonioPasivo.data = data;
        }
        const data = this.dataSourcePatrimonioPasivo.data;
        data.push(patrimonioCliente);
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
  public nuevoIngreso() {
    this.valorValidacion = 0;
    if (this.formDatosIngreso.valid) {
      if (this.valorIngreso.value > this.valorValidacion) {
        const ingresoEgreso = new TbQoIngresoEgresoCliente(this.valorIngreso.value, true);
        if (this.element) {
          const index = this.dataSourceIngresoEgreso.data.indexOf(this.element);
          this.dataSourceIngresoEgreso.data.splice(index, 1);
          const data = this.dataSourceIngresoEgreso.data;
          this.dataSourceIngresoEgreso.data = data;
        }
        const data = this.dataSourceIngresoEgreso.data;
        data.push(ingresoEgreso);
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
  public nuevoEgreso() {
    this.valorValidacion = 0;
    if (this.formDatosEgreso.valid) {
      if (this.valorEgreso.value > this.valorValidacion) {
        const ingresoEgreso = new TbQoIngresoEgresoCliente(this.valorEgreso.value, false);
        if (this.element) {
          const index = this.dataSourceIngresoEgreso.data.indexOf(this.element);
          this.dataSourceIngresoEgreso.data.splice(index, 1);
          const data = this.dataSourceIngresoEgreso.data;
          this.dataSourceIngresoEgreso.data = data;
        }
        const data = this.dataSourceIngresoEgreso.data;
        data.push(ingresoEgreso);
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
  private calcularActivo() {
    this.totalActivo = 0;
    if (this.dataSourcePatrimonioActivo.data) {
      this.dataSourcePatrimonioActivo.data.forEach(element => {
        this.totalActivo = Number(this.totalActivo) + Number(element.avaluo);
      });
    }
  }
  private calcularPasivo() {
    this.totalPasivo = 0;
    if (this.dataSourcePatrimonioPasivo.data) {
      this.dataSourcePatrimonioPasivo.data.forEach(element => {
        this.totalPasivo = Number(this.totalPasivo) + Number(element.avaluo);
      });
    }
  }
  private calcularIngresoEgreso() {
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
  private limpiarCampos() {
    Object.keys(this.formDatosReferenciasPersonales.controls).forEach((name) => {
      let control = this.formDatosReferenciasPersonales.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.reset();
    });
  }
  public nuevaReferencia() {
    const referencia = new TbReferencia;
    if (!this.formDatosReferenciasPersonales.valid) {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
      return;
    }
    if (this.apellidosRef.invalid) {
      this.sinNoticeService.setNotice("NOMBRE O APELLIDO NO VALIDO", 'error');
      return;
    }
    if (!this.parentescoR.value || !this.catTipoReferencia.find(x => x.codigo == this.parentescoR.value.codigo)) {
      this.sinNoticeService.setNotice("PARENTESCO NO VALIDO", 'error');
      return;
    }
    if (!this.direccionR.value) {
      this.sinNoticeService.setNotice("DIRECCION NO VALIDA", 'error');
      return;
    }
    let b = 0;
    if (this.telefonoFijoR.invalid && this.telefonoMovilR.invalid) {
      this.sinNoticeService.setNotice("NUMERO DE TELEFONO NO VALIDO", 'error');
      return;
    }
    referencia.apellidos = this.apellidosRef.value.toUpperCase();
    referencia.nombres = this.nombresRef.value.toUpperCase();
    referencia.parentesco = this.parentescoR.value.codigo;
    referencia.direccion = this.direccionR.value.toUpperCase();
    referencia.telefonoMovil = this.telefonoMovilR.value;
    referencia.telefonoFijo = this.telefonoFijoR.value;
    referencia.estado = this.estadoR.value;
    if (this.element) {
      referencia.idSoftbank = this.element.idSoftbank;
      referencia.id = this.element.id;
      const index = this.dataSourceReferencia.data.indexOf(this.element);
      this.dataSourceReferencia.data.splice(index, 1);
      const data = this.dataSourceReferencia.data;
      this.dataSourceReferencia.data = data;
    }
    const data = this.dataSourceReferencia.data ? this.dataSourceReferencia.data : new Array<any>();
    data.push(referencia);
    this.dataSourceReferencia.data = data;
    this.element = null;
    this.limpiarCampos();
  }
  public traerCodigoReferencia(parentescoCodigo: string) {
    if (parentescoCodigo) {
      const item = this.catTipoReferencia ? this.catTipoReferencia.find(x => x.codigo == parentescoCodigo) : null;
      return item ? item.nombre : null;
    }
  }
  public editarReferencia(element: TbReferencia) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.apellidosRef.setValue(element.apellidos);
    this.nombresRef.setValue(element.nombres);
    this.parentescoR.setValue(this.catTipoReferencia.find(x => x.codigo == element.parentesco));
    this.direccionR.setValue(element.direccion);
    this.telefonoMovilR.setValue(element.telefonoMovil);
    this.telefonoFijoR.setValue(element.telefonoFijo);
    this.estadoR.setValue(element.estado);
  }
  validarReferencias() {
    console.log('validacion ===> ', this.dataSourceReferencia.data.find(x => !x.apellidos || !x.nombres || !x.parentesco || ( !x.telefonoFijo && !x.telefonoMovil ) ) ? true : false);
    return this.dataSourceReferencia.data.find(x => !x.apellidos || !x.nombres || !x.parentesco || ( !x.telefonoFijo && !x.telefonoMovil ) ) ? true : false;
  }
  validarReferencia(x) {
    if (!x.apellidos || !x.nombres || !x.parentesco || ( !x.telefonoFijo && !x.telefonoMovil )) {
      return { 'background-color': '#ffa000', 'color': 'aliceblue !important' };
    }
    return { 'background-color': '#ffffff00' };
  }
  private validarReferenciasActivas(){
    if(  this.dataSourceReferencia.data.length < 2 ){
      return true;
    }
    let count = 0;
    this.dataSourceReferencia.data.forEach(element => {
      if( element.estado == 'ACT' ){
        count++
      }
    });
    if(count < 2){
      return true;
    }
  }
  public guardar() {
    if (!this.formCliente.valid) {
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS PERSONALES DEL CLIENTE.", 'warning');
      this.stepper.selectedIndex = 0
      return;
    }
    if (!this.lugarNacimiento.value || !this.lugarNacimiento.value.id) {
      this.sinNoticeService.setNotice("VALOR EN EL CAMPO DE LUGAR DE NACIMIENTO NO VALIDO.", 'warning');
      this.stepper.selectedIndex = 0
      return;
    }
    if (this.dataSourceTelefonosCliente.data.length < 1) {
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS DE CONTACTO DEL CLIENTE", 'warning');
      this.stepper.selectedIndex = 1
      return;
    }
    if (!this.formDatosDireccionDomicilio.valid) {
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DIRECCION DE DOMICILIO", 'warning');
      this.stepper.selectedIndex = 2
      return;
    }
    if (!this.formDatosDireccionLaboral.valid) {
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DIRECCION LABORAL", 'warning');
      this.stepper.selectedIndex = 3
      return;
    }
    if (!this.formDatosEconomicos.valid) {
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS ECONOMICOS DEL CLIENTE", 'warning');
      this.stepper.selectedIndex = 4
      return;
    }
    if (!this.formDatosIngreso.valid) {
      this.sinNoticeService.setNotice("AGREGUE AL MENOS UN INGRESO O UN EGRESO", 'warning');
      this.stepper.selectedIndex = 5
      return;
    }
    if (Number(this.valorIngreso.value) < Number(this.valorEgreso.value)) {
      this.sinNoticeService.setNotice('EL EGRESO NO PUEDE SER MAYOR AL INGRESO DEL CLIENTE', 'warning');
      this.stepper.selectedIndex = 5
      return;
    }
    if (!this.avaluoActivo.valid && !this.avaluoPasivo.valid) {
      this.sinNoticeService.setNotice("AGREGUE AL MENOS UN PATRIMONIO ACTIVO O PASIVO", 'warning');
      this.stepper.selectedIndex = 6
      return;
    }
    if (this.validarReferencias()) {
      this.sinNoticeService.setNotice('ERROR ENCONTRADO EN LAS REFERENCIAS, REVISE ANTES DE GUARDAR', 'warning');
      this.stepper.selectedIndex = 8
      return;
    }
    if ( this.validarReferenciasActivas() ) {
      this.sinNoticeService.setNotice("AGREGUE AL MENOS 2 REFERENCIAS ACTIVAS EN LA SECCION DE REFERENCIAS PERSONALES", 'warning');
      this.stepper.selectedIndex = 8
      return;
    }
    this.wrapper.cliente.actividadEconomica = this.actividadEconomica.value ? this.actividadEconomica.value.id : null;
    this.wrapper.cliente.apellidoMaterno = this.apellidoMaterno.value;
    this.wrapper.cliente.primerNombre = this.primerNombre.value;
    this.wrapper.cliente.apellidoPaterno = this.apellidoPaterno.value;
    this.wrapper.cliente.canalContacto = this.canalContacto.value.codigo;
    this.wrapper.cliente.cargasFamiliares = this.cargaFamiliar ? Number(this.cargaFamiliar.value) : null;
    this.wrapper.cliente.cedulaCliente = this.identificacion.value;
    this.wrapper.cliente.edad = this.edad.value;
    this.wrapper.cliente.nombreCompleto = null;
    this.wrapper.cliente.email = this.email.value;
    this.wrapper.cliente.estadoCivil = this.estadoCivil.value ? this.estadoCivil.value.codigo : null;
    this.wrapper.cliente.fechaNacimiento = this.fechaNacimiento.value;
    this.wrapper.cliente.genero = this.genero.value ? this.genero.value.codigo : null;
    this.wrapper.cliente.lugarNacimiento = this.lugarNacimiento.value.id;
    this.wrapper.cliente.nacionalidad = this.nacionalidad.value ? this.nacionalidad.value.id : null;
    this.wrapper.cliente.nivelEducacion = this.nivelEducacion.value ? this.nivelEducacion.value.codigo : null;
    this.wrapper.cliente.profesion = this.profesion.value ? this.profesion.value.codigo : null;
    this.wrapper.cliente.segundoNombre = this.segundoNombre.value;
    this.wrapper.cliente.usuario = this.usuario;
    this.wrapper.cliente.agencia = this.agencia;

    this.wrapper.cliente.pasivos = this.avaluoPasivo.value;
    this.wrapper.cliente.activos = this.avaluoActivo.value;
    this.wrapper.cliente.ingresos = this.valorIngreso.value;
    this.wrapper.cliente.egresos = this.valorEgreso.value;
    this.wrapper.datosTrabajos ? this.wrapper.datosTrabajos.forEach(t => {
      if (t.esprincipal && t.estado == 'ACT') {
        t.nombreEmpresa = this.nombreEmpresa.value;
        t.cargo = this.cargo.value.codigo;
        t.actividadEconomica = this.actividadEconomicaEmpresa.value ? this.actividadEconomicaEmpresa.value.id : null;
        t.actividadEconomicaMupi = this.actividadEconomicaMupi.value ? this.actividadEconomicaMupi.value.codigo : null;
        t.ocupacion = this.ocupacion.value ? this.ocupacion.value.codigo : null;
        t.esRelacionDependencia = this.relacionDependencia.value == 'SI' ? true : false;
        t.origenIngreso = this.origenIngresos.value.codigo;
        t.tbQoCliente = this.wrapper.cliente;
      }
    }) : null;
    if (!this.wrapper.datosTrabajos) {
      let trabajo = new TbQoDatoTrabajoCliente();
      trabajo.nombreEmpresa = this.nombreEmpresa.value;
      trabajo.cargo = this.cargo.value.codigo;
      trabajo.actividadEconomica = this.actividadEconomicaEmpresa.value ? this.actividadEconomicaEmpresa.value.id : null;
      trabajo.actividadEconomicaMupi = this.actividadEconomicaMupi.value ? this.actividadEconomicaMupi.value.codigo : null;
      trabajo.ocupacion = this.ocupacion.value ? this.ocupacion.value.codigo : null;
      trabajo.esRelacionDependencia = this.relacionDependencia.value == 'SI' ? true : false;
      trabajo.origenIngreso = this.origenIngresos.value.codigo;
      trabajo.tbQoCliente = this.wrapper.cliente;
      trabajo.estado = 'ACT';
      trabajo.esprincipal = true;
      this.wrapper.datosTrabajos = new Array<TbQoDatoTrabajoCliente>();
      this.wrapper.datosTrabajos.push(trabajo);
    }

    this.wrapper.telefonos = this.dataSourceTelefonosCliente.data;
    this.wrapper.direcciones = new Array<TbQoDireccionCliente>();
    this.wrapper.direcciones[0] = new TbQoDireccionCliente();
    this.wrapper.direcciones[1] = new TbQoDireccionCliente();
    this.wrapper.direcciones[0].tipoDireccion = "OFI";
    this.wrapper.direcciones[1].tipoDireccion = "DOM";
    this.wrapper.direcciones[0].tbQoCliente = this.wrapper.cliente;
    this.wrapper.direcciones[1].tbQoCliente = this.wrapper.cliente;
    this.wrapper.direcciones[0].estado = 'ACT';
    this.wrapper.direcciones[1].estado = 'ACT';
    this.wrapper.direcciones.forEach(e => {
      if (e.tipoDireccion == "OFI" && e.estado == 'ACT') {
        e.divisionPolitica = this.ubicacionO.value.id;
        e.direccionEnvioCorrespondencia = this.direccionCorreoLaboral.value;
        e.direccionLegal = this.direccionLegalLaboral.value;
        e.barrio = this.barrioO.value ? this.barrioO.value.toUpperCase() : 'No Espeficicado';
        e.callePrincipal = this.callePrincipalO.value ? this.callePrincipalO.value.toUpperCase() : 'No Espeficicado';
        e.calleSegundaria = this.calleSecundariaO.value ? this.calleSecundariaO.value.toUpperCase() : 'No Espeficicado';
        e.numeracion = this.numeracionO.value ? this.numeracionO.value.toUpperCase() : 'No Espeficicado';
        e.referenciaUbicacion = this.referenciaUbicacionO.value ? this.referenciaUbicacionO.value.toUpperCase() : 'No Espeficicado';
        e.sector = this.sectorO.value ? this.sectorO.value.codigo : 'No Espeficicado';
        e.tipoVivienda = this.tipoViviendaO.value ? this.tipoViviendaO.value.codigo : 'No Espeficicado';
      }
      if (e.tipoDireccion == "DOM" && e.estado == 'ACT') {
        e.divisionPolitica = this.ubicacion.value.id;
        e.direccionEnvioCorrespondencia = this.direccionCorreoDomicilio.value;
        e.direccionLegal = this.direccionLegalDomicilio.value;
        e.barrio = this.barrio.value ? this.barrio.value.toUpperCase() : 'No Espeficicado';
        e.callePrincipal = this.callePrincipal.value ? this.callePrincipal.value.toUpperCase() : 'No Espeficicado';
        e.calleSegundaria = this.calleSecundaria.value ? this.calleSecundaria.value.toUpperCase() : 'No Espeficicado';
        e.numeracion = this.numeracion.value ? this.numeracion.value.toUpperCase() : 'No Espeficicado';
        e.referenciaUbicacion = this.referenciaUbicacion.value ? this.referenciaUbicacion.value.toUpperCase() : 'No Espeficicado';
        e.sector = this.sector.value ? this.sector.value.codigo : 'No Espeficicado';
        e.tipoVivienda = this.tipoVivienda.value ? this.tipoVivienda.value.codigo : 'No Espeficicado';
      }
    });
    this.dataSourceReferencia.data.forEach(e => {
      e.tbQoCliente = this.wrapper.cliente;
      e.telefonoFijo = e.telefonoFijo ? e.telefonoFijo : null;
      e.telefonoMovil = e.telefonoMovil ? e.telefonoMovil : null;
    });
    this.wrapper.referencias = this.dataSourceReferencia.data;
    this.cli.registrarCliente(this.wrapper).subscribe((data: any) => {
      if (data.entidad && data.entidad.isCore) {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("CLIENTE REGISTRADO CORRECTAMENTE", 'success');
        if (this.origen == 'NEG') { this.router.navigate(['credito-nuevo/generar-credito/', this.item]); }
        if (this.origen == 'NOV') { this.router.navigate(['novacion/novacion-habilitante/', this.item]); }
        if (this.origen == 'CED') { this.router.navigate(['negociacion/bandeja-operaciones']); }
      } else {
        this.sinNoticeService.setNotice("NO SE PUDO REGISTRAR EL CLIENTE EN SOFTBANK", 'warning');
      }
    });
  }
  cambiarTipoTelefonoCliente() {
    if (this.tipoTelefonoCliente.value.codigo == 'DOM') {
      this.telefonoFijo = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
    }
    if (this.tipoTelefonoCliente.value.codigo == 'CEL') {
      this.telefonoFijo = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    }
    this.telefonoFijo = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]);

  }

  agregarTelefonoCliente() {
    if (this.tipoTelefonoCliente.invalid) {
      this.sinNoticeService.setNotice('Selecione un tipo de telefono', 'warning');
      return;
    }
    if (this.telefonoFijo.valid) {
      const tel = this.dataSourceTelefonosCliente.data;
      let telefono: TbQoTelefonoCliente = {
        id: this.teleId ? this.teleId.id : null,
        tipoTelefono: this.tipoTelefonoCliente.value.codigo,
        numero: this.telefonoFijo.value,
        estado: 'ACT',
        tbQoCliente: this.wrapper.cliente,
        idSoftbank: this.teleId ? this.teleId.idSoftbank : null

      }
      if (this.teleId) {
        const index = this.dataSourceTelefonosCliente.data.indexOf(this.teleId);
        this.dataSourceTelefonosCliente.data.splice(index, 1);
        const data = this.dataSourceTelefonosCliente.data;
        this.dataSourceTelefonosCliente.data = data;
      }
      const data = this.dataSourceTelefonosCliente.data;
      data.push(telefono);
      this.dataSourceTelefonosCliente.data = data;

      this.teleId = null;
      this.tipoTelefonoCliente.setValue(null);
      this.telefonoFijo.setValue(null);
    } else {
      this.sinNoticeService.setNotice('Ingrese un numero de telefono valido', 'warning');
      return;
    }
  }

  editarTelefono(element) {
    this.teleId = element;
    this.tipoTelefonoCliente.setValue(this.catTipoTelefono ? this.catTipoTelefono.find(p => p.codigo == element.codigoTipoTelefono) : '');
    this.telefonoFijo.setValue(element.numero);
  }


}
