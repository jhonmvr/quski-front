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
import { SeparacionBienesEnum } from '../../../../../core/enum/SeparacionBienesEnum';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoPatrimonio } from '../../../../../core/model/quski/TbQoPatrimonio';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
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
export class GestionClienteComponent implements OnInit {
  /** @STANDAR_VARIABLES **/
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private wrapper: ClienteCompletoWrapper;
  private idNegociacion;
  public loading;
  public totalActivo: number = 0;
  public totalPasivo: number = 0;
  public totalValorIngresoEgreso: number = 0;
  public valorValidacion: number = 0;
  /** @TABLA_REFERENCIA **/
  public displayedColumns = ['Accion', 'N', 'nombresRef', 'apellidosRef', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  public dataSource = new MatTableDataSource<TbReferencia>();
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
  public catOcupacion: Array<any>;
  public catCargo: Array<any>;
  /** @ENUMS **/
  public catSeparacionBienes = Object.values(SeparacionBienesEnum);
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
  public separacionBienes = new FormControl('', []);
  public edad = new FormControl('', []);
  public telefonoMovil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public email = new FormControl('', [Validators.email, Validators.maxLength(100), Validators.required]);
  public telefonoOtro = new FormControl('', [Validators.minLength(9), Validators.maxLength(10)]);
  public telefonoFijo = new FormControl('', [Validators.minLength(9), Validators.maxLength(9)]);
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
  public valorIngreso = new FormControl('', [Validators.maxLength(50)]);
  public formDatosIngreso: FormGroup = new FormGroup({});
  public valorEgreso = new FormControl('', [Validators.maxLength(50)]);
  public formDatosEgreso: FormGroup = new FormGroup({});
  public avaluoActivo = new FormControl('', [Validators.maxLength(50)]);
  public formDatosPatrimonioActivos: FormGroup = new FormGroup({});
  public activo = new FormControl('', [Validators.maxLength(50)]);
  public avaluoPasivo = new FormControl('', [Validators.maxLength(50)]);
  public formDatosPatrimonioPasivos: FormGroup = new FormGroup({});
  public pasivo = new FormControl('', [Validators.maxLength(50)]);
  
  public formCuentas: FormGroup = new FormGroup({});
  public tipoCuenta = new FormControl('', [Validators.maxLength(50)]);
  public numeroCuenta = new FormControl('', [Validators.maxLength(20)]);
  public esAhorro = new FormControl('', []);
  
  public formDatosReferenciasPersonales: FormGroup = new FormGroup({});
  public telefonoFijoR = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public telefonoMovilR = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public apellidosRef = new FormControl('', [Validators.required,  Validators.maxLength(50)]);
  public nombresRef = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public parentescoR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public direccionR = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public element;

  constructor(
    private css: SoftbankService,
    private cli: ClienteService,
    public dialog: MatDialog,
    private sinNoticeService: ReNoticeService,
    private sp: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
  ) {
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
    this.formCliente.addControl("actividadEconomica  ", this.actividadEconomica);
    this.formCliente.addControl("separacionBienes  ", this.separacionBienes);
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
  }

  ngOnInit() {
    this.subheaderService.setTitle("Gestion de Cliente");
    this.loading = this.loadingSubject.asObservable();
    this.buscarCliente();
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private cargarCampos() {
    console.log(' thiswrapper -> ', this.wrapper);
    this.nombresCompletos.setValue(this.wrapper.cliente.nombreCompleto);
    this.nombresCompletos.disable();
    this.identificacion.setValue(this.wrapper.cliente.cedulaCliente);
    this.identificacion.disable();
    this.fechaNacimiento.setValue( new Date(this.wrapper.cliente.fechaNacimiento) );
    this.onChangeFechaNacimiento();
    this.nivelEducacion.setValue(this.catEducacion.find(x => x.codigo == this.wrapper.cliente.nivelEducacion));
    if (this.wrapper.telefonos) {
      this.wrapper.telefonos.forEach(e => {
        if (e.tipoTelefono == "M") {
          this.telefonoMovil.setValue(e.numero);
        }
        if (e.tipoTelefono == "F") {
          this.telefonoFijo.setValue(e.numero);
        }
        if (e.tipoTelefono == "CEL") {
          this.telefonoOtro.setValue(e.numero);
        }
      });
    }
    this.nacionalidad.setValue(this.catPais.find(x => x.id == this.wrapper.cliente.nacionalidad));
    this.email.setValue(this.wrapper.cliente.email);
    this.primerNombre.setValue(this.wrapper.cliente.primerNombre);
    this.segundoNombre.setValue(this.wrapper.cliente.segundoNombre);
    this.apellidoPaterno.setValue(this.wrapper.cliente.apellidoPaterno);
    this.apellidoMaterno.setValue(this.wrapper.cliente.apellidoMaterno);
    this.genero.setValue(this.catGenero.find(x => x.codigo == this.wrapper.cliente.genero));
    this.estadoCivil.setValue(this.catEstadoCivil.find(x => x.codigo == this.wrapper.cliente.estadoCivil));
    this.cargaFamiliar.setValue(this.wrapper.cliente.cargasFamiliares);
    this.separacionBienes.setValue(this.wrapper.cliente.separacionBienes);
    this.habilitarCampo();
    if (this.wrapper.cliente.lugarNacimiento) {
      this.catFiltradoLugarNacimiento.subscribe((data: any) => {
        this.lugarNacimiento.setValue(data.find(x => x.id == this.wrapper.cliente.lugarNacimiento));
      });
    }
    this.edad.setValue(this.wrapper.cliente.edad);
    this.canalContacto.setValue(this.wrapper.cliente.canalContacto);
    if (this.wrapper.datosTrabajo) {
      this.origenIngresos.setValue(this.catOrigenIngreso.find(x => x.codigo == this.wrapper.datosTrabajo.origenIngreso));
      this.relacionDependencia.setValue(this.wrapper.datosTrabajo.esRelacionDependencia ? "SI" : "NO");
      this.nombreEmpresa.setValue(this.wrapper.datosTrabajo.nombreEmpresa);
      this.cargo.setValue(this.catCargo.find(x => x.codigo == this.wrapper.datosTrabajo.cargo));
      this.ocupacion.setValue(this.catOcupacion.find(x => x.codigo == this.wrapper.datosTrabajo.ocupacion));
      this.setRelacionDependencia();
      this.actividadEconomicaMupi.setValue( 
        this.catActividadEconomicaMupi.find(x => x.codigo == this.wrapper.datosTrabajo.actividadEconomicaMupi) ? 
          this.catActividadEconomicaMupi.find(x => x.codigo == this.wrapper.datosTrabajo.actividadEconomicaMupi) :
            this.catActividadEconomicaMupi.find(x => x.esPorDefecto == true ) );
      this.actividadEconomicaEmpresa.setValue(
        this.catActividadEconomica.find(x => x.id.toString() == this.wrapper.datosTrabajo.actividadEconomica) ? 
          this.catActividadEconomica.find(x => x.id.toString() == this.wrapper.datosTrabajo.actividadEconomica) : 
            this.catActividadEconomica.find(x => x.esPorDefecto == true) );
    }
    if (this.wrapper.cliente.actividadEconomica) {
      this.actividadEconomica.setValue(this.catActividadEconomica.find(x => x.id.toString() == this.wrapper.cliente.actividadEconomica));
    }
    if (this.wrapper.cliente.profesion) {
      this.profesion.setValue(this.catProfesion.find(x => x.codigo == this.wrapper.cliente.profesion));
    }
    this.direccionLegalDomicilio.setValue(true);
    this.direccionCorreoDomicilio.setValue(true);
    this.direccionLegalLaboral.setValue(false);
    this.direccionCorreoLaboral.setValue(false);
    if (this.wrapper.direcciones) {
      this.wrapper.direcciones.forEach(e => {
        if (e.tipoDireccion == "OFI") {
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
        }
        if (e.tipoDireccion == "DOM") {
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
        }
      });
    }
    if (this.wrapper.cliente.ingresos) {
      this.dataSourceIngresoEgreso.data.push( new TbQoIngresoEgresoCliente( this.wrapper.cliente.ingresos, true ) )  
      this.calcularIngresoEgreso();
    }
    if (this.wrapper.cliente.egresos) {
      this.dataSourceIngresoEgreso.data.push( new TbQoIngresoEgresoCliente( this.wrapper.cliente.egresos, false ) )  
      this.calcularIngresoEgreso();
    }
    
    if (this.wrapper.cliente.pasivos) {
      this.dataSourcePatrimonioPasivo = new MatTableDataSource<TbQoPatrimonio>();
      this.dataSourcePatrimonioPasivo.data.push( new TbQoPatrimonio(this.wrapper.cliente.pasivos, false) );
      this.calcularPasivo();
    }
    if (this.wrapper.cliente.activos) {
      this.dataSourcePatrimonioActivo = new MatTableDataSource<TbQoPatrimonio>();
      this.dataSourcePatrimonioActivo.data.push( new TbQoPatrimonio(this.wrapper.cliente.activos, false) );
      this.calcularActivo();
    }
    if(this.wrapper.cuentas){
      this.dataSourceCuentas.data = this.wrapper.cuentas;
      this.dataSourceCuentas.data.forEach(e=>{
        const item = this.catCuenta.find(x => x.id == e.banco);
        e.banco = item.nombre; 
      })
    }
    if (this.wrapper.referencias) {
      this.wrapper.referencias.forEach(e => {
        const referencia = this.catTipoReferencia.find(x => x.codigo == e.parentesco);
        e.parentesco = referencia ? referencia.nombre : 'error' ;
      });
      this.dataSource.data = this.wrapper.referencias;
    }
    this.loadingSubject.next(false);
  }
  private buscarCliente() {
    this.route.paramMap.subscribe((data: any) => {
      this.loadingSubject.next(true);
      if (data.params.origen == "NEG") {
        this.idNegociacion = data.params.item
        this.cli.traerClienteByIdNegociacion(data.params.item).subscribe((data: any) => {
          if (!data.entidad.existeError) {
            this.wrapper = data.entidad;
            this.traerCatalogos();
          } else {
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice('NO EXISTE CLEINTE: ' + data.entidad.mensaje, 'error');
          }
        });
      } else if (data.params.origen == "CED") {
        this.cli.traerClienteByCedula(data.params.item).subscribe((data: any) => {
          if (!data.entidad.existeError) {
            this.wrapper = data.entidad;
            this.traerCatalogos();
          } else {
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice('NO EXISTE CLEINTE: ' + data.entidad.mensaje, 'error');
          }
        });
      } else {
        this.loadingSubject.next(false);

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
                            this.css.consultarCargoOcupacion().subscribe((data: any) => {
                              this.catCargo = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                              this.css.consultarDivicionPoliticaCS().subscribe((data: any) => {
                                if (!data.existeError) {
                                  const localizacion = data.catalogo;
                                  let bprovinces = localizacion.filter(e => e.tipoDivision == "PROVINCIA");
                                  let bCantons = localizacion.filter(e => e.tipoDivision == 'CANTON');
                                  let bParroqui = localizacion.filter(e => e.tipoDivision == "PARROQUIA");
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
  public habilitarCampo() {
    this.separacionBienes.setValue('');
    this.separacionBienes.disable();
    this.catEstadoCivil.forEach(e => {
      if (this.estadoCivil.value && this.estadoCivil.value.codigo == "C") {
        this.separacionBienes.setValidators([Validators.required]);
        this.separacionBienes.enable();
        this.sinNoticeService.setNotice("SELECCIONE LA OPCION DE SEPARACIÒN DE BIENES ", 'warning');
      }
    });
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
    if (this.wrapper.cliente.id != null && this.wrapper.cliente.id != 0) {
      const dialogRef = this.dialog.open(DialogCargarHabilitanteComponent, {
        width: "auto-max",
        height: "auto-max",
        data: this.wrapper.cliente.id
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
        const patrimonioCliente = new TbQoPatrimonio( this.avaluoActivo.value, true );
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
        const patrimonioCliente = new TbQoPatrimonio( this.avaluoPasivo.value, false );
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
    this.sinNoticeService.setNotice(null);
    this.valorEgreso.setValue(null);
    if (this.formDatosIngreso.valid) {
      if (this.valorIngreso.value > this.valorValidacion) {
        const ingresoEgreso = new TbQoIngresoEgresoCliente( this.valorIngreso.value, true );
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
    this.sinNoticeService.setNotice(null);
    this.valorIngreso.setValue(null);
    if (this.formDatosEgreso.valid) {
      if (this.valorEgreso.value > this.valorValidacion) {
        const ingresoEgreso = new TbQoIngresoEgresoCliente( this.valorEgreso.value, false);
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
  public deleteIngresoEgreso(element) {
    const index = this.dataSourceIngresoEgreso.data.indexOf(element);
    this.dataSourceIngresoEgreso.data.splice(index, 1);
    const data = this.dataSourceIngresoEgreso.data;
    this.dataSourceIngresoEgreso.data = data;
    this.calcularIngresoEgreso();
  }
  public deleteActivo(element) {
    const index = this.dataSourcePatrimonioActivo.data.indexOf(element);
    this.dataSourcePatrimonioActivo.data.splice(index, 1);
    const data = this.dataSourcePatrimonioActivo.data;
    this.dataSourcePatrimonioActivo.data = data;
    this.calcularActivo();
  }
  public deletePasivo(element) {
    const index = this.dataSourcePatrimonioPasivo.data.indexOf(element);
    this.dataSourcePatrimonioPasivo.data.splice(index, 1);
    const data = this.dataSourcePatrimonioPasivo.data;
    this.dataSourcePatrimonioPasivo.data = data;
    this.calcularPasivo();
  }
  public editar(element) {
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
  public editarActivo(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.activo.setValue(element.activos);
    this.avaluoActivo.setValue(element.avaluo);
  }
  public editarPasivo(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.pasivo.setValue(element.pasivos);
    this.avaluoPasivo.setValue(element.avaluo);
  }
  private limpiarCampos() {
    Object.keys(this.formDatosPatrimonioActivos.controls).forEach((name) => {
      let control = this.formDatosPatrimonioActivos.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.updateValueAndValidity();
    });
    Object.keys(this.formDatosPatrimonioPasivos.controls).forEach((name) => {
      let control = this.formDatosPatrimonioPasivos.controls[name];
      control.setErrors(null);
      control.setValue(null);
      control.updateValueAndValidity();
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
    });
    Object.keys(this.formCuentas.controls).forEach((name) => {
      let control = this.formCuentas.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });
  }
  public nuevaReferencia() {
    const referencia = new TbReferencia;
    if (this.formDatosReferenciasPersonales.valid) {
      if (this.apellidosRef.value != null && this.nombresRef.value != "") {
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
              referencia.apellidos = this.apellidosRef.value.toUpperCase();
              referencia.nombres = this.nombresRef.value.toUpperCase();
              referencia.parentesco = this.parentescoR.value.nombre;
              referencia.direccion = this.direccionR.value.toUpperCase();
              referencia.telefonoMovil = this.telefonoMovilR.value;
              referencia.telefonoFijo = this.telefonoFijoR.value;
              if (this.element) {
                const index = this.dataSource.data.indexOf(this.element);
                this.dataSource.data.splice(index, 1);
                const data = this.dataSource.data;
                this.dataSource.data = data;
              }
              const data = this.dataSource.data;
              data.push(referencia);
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
        this.sinNoticeService.setNotice("NOMBRE O APELLIDO NO VALIDO", 'error');
      }
    } else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
    }
  }
  public deleteReferencia(element) {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    const data = this.dataSource.data;
    this.dataSource.data = data;
  }
  public editarReferencia(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.apellidosRef.setValue(element.apellidosRef);
    this.nombresRef.setValue(element.nombresRef);
    this.parentescoR.setValue( this.catTipoReferencia.find (x => x.nombre == element.parentesco) );
    this.direccionR.setValue(element.direccion);
    this.telefonoMovilR.setValue(element.telefonoMovil);
    this.telefonoFijoR.setValue(element.telefonoFijo);
  }
  public nuevaCuenta() {
    const cuenta = new TbQoCuentaBancariaCliente;
    if (this.formCuentas.valid) {
      cuenta.banco = this.tipoCuenta.value.nombre;
      cuenta.cuenta = this.numeroCuenta.value;
      cuenta.esAhorros = this.esAhorro.value == true ? true : false ;
      cuenta.tbQoCliente = this.wrapper.cliente;
      if (this.element) {
        const index = this.dataSourceCuentas.data.indexOf(this.element);
        this.dataSourceCuentas.data.splice(index, 1);
        const data = this.dataSourceCuentas.data;
        this.dataSourceCuentas.data = data;
      }
      const data = this.dataSourceCuentas.data;
      data.push(cuenta);
      this.dataSourceCuentas.data = data;
      this.element = null;
      this.limpiarCampos();
    }else {
      this.sinNoticeService.setNotice("COMPLETE CORRECTAMENTE EL FORMULARIO", 'error');
    }
  }
  public deleteCuenta(element) {
    const index = this.dataSourceCuentas.data.indexOf(element);
    this.dataSourceCuentas.data.splice(index, 1);
    const data = this.dataSourceCuentas.data;
    this.dataSourceCuentas.data = data;
  }
  public editarCuenta(element) {
    this.sinNoticeService.setNotice("EDITAR INFORMACION ", 'success');
    this.element = element;
    this.tipoCuenta.setValue( this.catCuenta.find(x => x.nombre == element.banco ) );
    this.numeroCuenta.setValue(element.cuenta);
    this.esAhorro.setValue(element.esAhorro);
  }
  public guardar() {
    this.loadingSubject.next(true);
    if (this.formCliente.valid) {
      if (this.formDatosContacto.valid) {
        if (this.formDatosDireccionDomicilio.valid) {
          if (this.formDatosDireccionLaboral.valid) {
            if (this.formDatosEconomicos.valid) {
              if (this.dataSourceIngresoEgreso.data.length > 0) {
                if ((this.dataSourcePatrimonioActivo.data.length > 0) || (this.dataSourcePatrimonioPasivo.data.length > 0)) {
                  if(this.dataSourceCuentas.data.length >= 1){
                    if (this.dataSource.data.length > 1) {
                      this.wrapper.cliente.actividadEconomica = this.actividadEconomica.value ? this.actividadEconomica.value.id : null;
                      this.wrapper.cliente.apellidoMaterno = this.apellidoMaterno.value;
                      this.wrapper.cliente.primerNombre = this.primerNombre.value;
                      this.wrapper.cliente.apellidoPaterno = this.apellidoPaterno.value;
                      this.wrapper.cliente.canalContacto = this.canalContacto.value;
                      this.wrapper.cliente.cargasFamiliares = this.cargaFamiliar ? Number(this.cargaFamiliar.value) : null;
                      this.wrapper.cliente.cedulaCliente = this.identificacion.value;
                      this.wrapper.cliente.edad = this.edad.value;
                      this.wrapper.cliente.email = this.email.value;
                      this.wrapper.cliente.estadoCivil = this.estadoCivil.value ? this.estadoCivil.value.codigo : null;
                      this.wrapper.cliente.fechaNacimiento = this.fechaNacimiento.value;
                      this.wrapper.cliente.genero = this.genero.value ? this.genero.value.codigo : null;
                      this.wrapper.cliente.lugarNacimiento = this.lugarNacimiento.value.id;
                      this.wrapper.cliente.nacionalidad = this.nacionalidad.value ? this.nacionalidad.value.id : null;
                      this.wrapper.cliente.nivelEducacion = this.nivelEducacion.value ? this.nivelEducacion.value.codigo : null;
                      this.wrapper.cliente.profesion = this.profesion.value ? this.profesion.value.codigo : null;
                      this.wrapper.cliente.segundoNombre = this.segundoNombre.value;
                      this.wrapper.cliente.separacionBienes = this.separacionBienes.value;
                      this.wrapper.cliente.pasivos = this.totalPasivo;
                      this.wrapper.cliente.activos = this.totalActivo;
                      let totalEgreso = 0;
                      let totalIngreso = 0;
                      this.dataSourceIngresoEgreso.data.forEach(e=>{
                        if( e.esEgreso ){
                          totalEgreso = totalEgreso + e.valor;
                        }
                        if( e.esIngreso ){
                          totalIngreso = totalIngreso + e.valor;
                        }
                      });
                      this.wrapper.cliente.ingresos = totalIngreso;
                      this.wrapper.cliente.egresos = totalEgreso;
                      if (!this.wrapper.datosTrabajo) {
                        this.wrapper.datosTrabajo = new TbQoDatoTrabajoCliente();
                        this.wrapper.datosTrabajo.origenIngreso = this.origenIngresos.value.codigo;
                        this.wrapper.datosTrabajo.tbQoCliente = this.wrapper.cliente;
                      }
                      this.wrapper.datosTrabajo.nombreEmpresa = this.nombreEmpresa.value;
                      this.wrapper.datosTrabajo.cargo = this.cargo.value.codigo;
                      this.wrapper.datosTrabajo.actividadEconomica = this.actividadEconomicaEmpresa.value ? this.actividadEconomicaEmpresa.value.id : null;
                      this.wrapper.datosTrabajo.actividadEconomicaMupi = this.actividadEconomicaMupi.value ? this.actividadEconomicaMupi.value.codigo : null;
                      this.wrapper.datosTrabajo.ocupacion = this.ocupacion.value ? this.ocupacion.value.codigo : null;
                      this.wrapper.datosTrabajo.esprincipal = true;
                      this.wrapper.datosTrabajo.esRelacionDependencia = this.relacionDependencia.value == 'SI' ? true : false;
                      this.wrapper.datosTrabajo.origenIngreso = this.origenIngresos.value.codigo;
                      if (!this.wrapper.telefonos) {
                        this.wrapper.telefonos = new Array<TbQoTelefonoCliente>()
                        this.wrapper.telefonos[0] = new TbQoTelefonoCliente();
                        this.wrapper.telefonos[0].numero = this.telefonoMovil.value;
                        this.wrapper.telefonos[0].tipoTelefono = "M";
                        this.wrapper.telefonos[0].tbQoCliente = this.wrapper.cliente;
                        if (this.telefonoFijo.value) {
                          this.wrapper.telefonos[1] = new TbQoTelefonoCliente();
                          this.wrapper.telefonos[1].numero = this.telefonoFijo.value;
                          this.wrapper.telefonos[1].tipoTelefono = "F";
                          this.wrapper.telefonos[1].tbQoCliente = this.wrapper.cliente;
                        }
                        if (this.telefonoOtro.value) {
                          this.wrapper.telefonos[2] = new TbQoTelefonoCliente();
                          this.wrapper.telefonos[2].numero = this.telefonoOtro.value;
                          this.wrapper.telefonos[2].tipoTelefono = "CEL";
                          this.wrapper.telefonos[2].tbQoCliente = this.wrapper.cliente;
                        }
                      } else {
                        this.wrapper.telefonos.forEach(e => {
                          if (e.tipoTelefono == "M") {
                            e.numero = this.telefonoMovil.value;
                          }
                          if (e.tipoTelefono == "F") {
                            e.numero = this.telefonoFijo.value;
                          }
                          if (e.tipoTelefono == "CEL") {
                            e.numero = this.telefonoOtro.value;
                          }
                        });
                      }
                      if (!this.wrapper.direcciones) {
                        console.log('Creando direcciones -> ', this.wrapper.direcciones);
                        this.wrapper.direcciones = new Array<TbQoDireccionCliente>();
                        this.wrapper.direcciones[0] = new TbQoDireccionCliente();
                        this.wrapper.direcciones[1] = new TbQoDireccionCliente();
                        this.wrapper.direcciones[0].tipoDireccion = "OFI";
                        this.wrapper.direcciones[1].tipoDireccion = "DOM";
                        this.wrapper.direcciones[0].tbQoCliente = this.wrapper.cliente;
                        this.wrapper.direcciones[1].tbQoCliente = this.wrapper.cliente;
                      }
                      this.wrapper.direcciones.forEach(e => {
                        if (e.tipoDireccion == "OFI") {
                          e.divisionPolitica = this.ubicacionO.value.id;
                          e.direccionEnvioCorrespondencia = this.direccionCorreoLaboral.value;
                          e.direccionLegal = this.direccionLegalLaboral.value;
                          e.barrio = this.barrioO.value ? this.barrioO.value.toUpperCase() : null;
                          e.callePrincipal = this.callePrincipalO.value ? this.callePrincipalO.value.toUpperCase() : null;
                          e.calleSegundaria = this.calleSecundariaO.value ? this.calleSecundariaO.value.toUpperCase() : null;
                          e.numeracion = this.numeracionO.value ? this.numeracionO.value.toUpperCase() : null;
                          e.referenciaUbicacion = this.referenciaUbicacionO.value ? this.referenciaUbicacionO.value.toUpperCase() : null;
                          e.sector = this.sectorO.value ? this.sectorO.value.codigo : null;
                          e.tipoVivienda = this.tipoViviendaO.value ? this.tipoViviendaO.value.codigo : null;
                        }
                        if (e.tipoDireccion == "DOM") {
                          e.divisionPolitica = this.ubicacion.value.id;
                          e.direccionEnvioCorrespondencia = this.direccionCorreoDomicilio.value;
                          e.direccionLegal = this.direccionLegalDomicilio.value;
                          e.barrio = this.barrio.value ? this.barrio.value.toUpperCase() : null;
                          e.callePrincipal = this.callePrincipal.value ? this.callePrincipal.value.toUpperCase() : null;
                          e.calleSegundaria = this.calleSecundaria.value ? this.calleSecundaria.value.toUpperCase() : null;
                          e.numeracion = this.numeracion.value ? this.numeracion.value.toUpperCase() : null;
                          e.referenciaUbicacion = this.referenciaUbicacion.value ? this.referenciaUbicacion.value.toUpperCase() : null;
                          e.sector = this.sector.value ? this.sector.value.codigo : null;
                          e.tipoVivienda = this.tipoVivienda.value ? this.tipoVivienda.value.codigo : null;
                        }
                      });
                      if(this.dataSourceCuentas.data){
                        this.dataSourceCuentas.data.forEach(e=>{
                          const item = this.catCuenta.find(x => x.nombre == e.banco );
                          e.banco = item.id;
                          e.tbQoCliente = this.wrapper.cliente;
                        });
                        this.wrapper.cuentas = this.dataSourceCuentas.data;
                      }
                      if (this.dataSource.data) {
                        this.dataSource.data.forEach(e => {
                          const codigo = this.catTipoReferencia.find(x => x.nombre == e.parentesco);
                          e.parentesco = codigo.codigo;
                          e.tbQoCliente = this.wrapper.cliente;
                        });
                        this.wrapper.referencias = this.dataSource.data;
                      }
                      this.cli.registrarCliente(this.wrapper).subscribe((data: any) => {
                        if (data.entidad && data.entidad.isCore && data.entidad.isSoftbank) {
                          this.sinNoticeService.setNotice("CLIENTE REGISTRADO CORRECTAMENTE", 'success');
                          this.loadingSubject.next(false);
                          if (this.idNegociacion) {
                            this.router.navigate(['credito-nuevo/generar-credito/', this.idNegociacion]);
                          } else {
                            this.router.navigate(['negociacion/bandeja-operaciones']);
                          }
                        } else {
                          this.loadingSubject.next(false);
                          this.sinNoticeService.setNotice("NO SE PUDO REGISTRAR EL CLIENTE EN SOFTBANK", 'error');
                          if (this.idNegociacion) {
                            this.router.navigate(['credito-nuevo/generar-credito/', this.idNegociacion]);
                          } else {
                            this.router.navigate(['negociacion/bandeja-operaciones']);
                          }
                        }
                      });
                    } else {
                      this.loadingSubject.next(false);
                      this.sinNoticeService.setNotice("AGREGUE AL MENOS 2 REFERENCIAS EN  LA SECCION DE REFERENCIAS PERSONALES", 'error');
                    }
                  }else {
                    this.loadingSubject.next(false);
                    this.sinNoticeService.setNotice("AGREGUE AL MENOS 1 CUENTA RELACIONADA AL CLIENTE", 'error');
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
    } else {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS PERSONALES DEL CLIENTE", 'error');
    }
  }

}
