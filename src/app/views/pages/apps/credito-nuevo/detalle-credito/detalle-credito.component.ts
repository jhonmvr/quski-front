import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';

@Component({
  selector: 'kt-detalle-credito',
  templateUrl: './detalle-credito.component.html',
  styleUrls: ['./detalle-credito.component.scss']
})
export class DetalleCreditoComponent implements OnInit {

  formatoFecha = 'yyyy-MM-dd'
  public  loading;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public  wrapper: any; 
  public catTipoGarantia: Array<any>;
  public catTipoCobertura: Array<any>;
  public catAgencia: Array<any>;
  public catTipoJoya: Array<any>;
  public catEstadoJoya: Array<any>;
  public catTipoOro: Array<any>;
  public catEstadoProceso: Array<any>;
  public catEstadoUbicacion: Array<any>;

  public formInformacion: FormGroup = new FormGroup({});
  public nombre = new FormControl();
  public cedula = new FormControl();
  public email = new FormControl();
  public telefonoMovil = new FormControl();
  public telefonoCasa = new FormControl();
  public telefonoOficina = new FormControl();
  public numeroOperacion = new FormControl();
  public fechaCreacion = new FormControl();
  public fechaVencimiento = new FormControl();
  public montoFinanciado = new FormControl();
  public asesor = new FormControl();
  public estadoOperacion = new FormControl();
  public tipoCredito = new FormControl();
  public tablaAmortizacion = new FormControl();
  public plazo = new FormControl();
  public impago = new FormControl();
  public retanqueo = new FormControl();
  public coberturaActual = new FormControl();
  public coberturaInicial = new FormControl();
  public diasMora = new FormControl();
  public estadoUbicacion = new FormControl();
  public estadoProceso = new FormControl();
  public descripcionBloqueo = new FormControl();
  public esMigrado = new FormControl();
  public numeroCuotas = new FormControl();

  public displayedColumnsRubro = ['rubro','numeroCuota', 'proyectado', 'calculado', 'estado'];
  public dataSourceRubro = new MatTableDataSource<any>();

  public displayedColumnsGarantia = ['numeroGarantia','numeroExpediente','codigoTipoGarantia','descripcion','tipoCobertura','valorComercial','valorAvaluo',
  'valorRealizacion','valorOro','fechaAvaluo','idAgenciaRegistro','idAgenciaCustodia','referencia','codigoTipoJoya','descripcionJoya','codigoEstadoJoya',
  'codigoTipoOro','pesoBruto','tienePiedras','detallePiedras','descuentoPiedras','pesoNeto','codigoEstadoProceso','codigoEstadoUbicacion','numeroFundaMadre',
  'numeroFundaJoya','numeroPiezas','descuentoSuelda'];
  public dataSourceGarantia = new MatTableDataSource<any>();

  constructor(
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    private router: Router,
    private sinNotSer: ReNoticeService,
  ) { 
    this.cre.setParameter();
    this.sof.setParameter();

    this.formInformacion.addControl("nombre", this.nombre);
    this.formInformacion.addControl("cedula", this.cedula);
    this.formInformacion.addControl("email", this.email);
    this.formInformacion.addControl("telefonoMovil", this.telefonoMovil);
    this.formInformacion.addControl("telefonoCasa", this.telefonoCasa);
    this.formInformacion.addControl("telefonoOficina", this.telefonoOficina);
    this.formInformacion.addControl("numeroOperacion", this.numeroOperacion);
    this.formInformacion.addControl("fechaCreacion", this.fechaCreacion);
    this.formInformacion.addControl("fechaVencimiento", this.fechaVencimiento);
    this.formInformacion.addControl("montoFinanciado", this.montoFinanciado);
    this.formInformacion.addControl("asesor", this.asesor);
    this.formInformacion.addControl("estadoOperacion", this.estadoOperacion);
    this.formInformacion.addControl("tipoCredito", this.tipoCredito);
    this.formInformacion.addControl("tablaAmortizacion", this.tablaAmortizacion);
    this.formInformacion.addControl("plazo", this.plazo);
    this.formInformacion.addControl("impago", this.impago);
    this.formInformacion.addControl("fechaVencimiento", this.fechaVencimiento);
    this.formInformacion.addControl("montoFinanciado", this.montoFinanciado);
    this.formInformacion.addControl("retanqueo", this.retanqueo);
    this.formInformacion.addControl("coberturaActual", this.coberturaActual);
    this.formInformacion.addControl("coberturaInicial", this.coberturaInicial);
    this.formInformacion.addControl("diasMora", this.diasMora);
    this.formInformacion.addControl("estadoUbicacion", this.estadoUbicacion); 
    this.formInformacion.addControl("estadoProceso", this.estadoProceso); 
    this.formInformacion.addControl("descripcionBloqueo", this.descripcionBloqueo); 
    this.formInformacion.addControl("esMigrado", this.esMigrado); 
    this.formInformacion.addControl("numeroCuotas", this.numeroCuotas); 
  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.formInformacion.disable();
    this.cargarCats();
    this.loading = this.loadingSubject.asObservable();
    this.subheaderService.setTitle('Detalle de credito');
    this.traerCredito();
  }
  private traerCredito(){
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.numeroOperacion) {
        this.loadingSubject.next(true);
        this.cre.traerCreditoVigente(json.params.numeroOperacion).subscribe((data: any) => {
          if (data.entidad) {
            this.wrapper = data.entidad;
            this.cargarCampos();
          }else{
            this.salirDeGestion("Error al intentar cargar el credito.");
          }
        });
      }
    });
  }
  private cargarCampos(){
    this.nombre.setValue( this.wrapper.cliente.nombreCompleto );
    this.cedula.setValue( this.wrapper.cliente.identificacion );
    this.email.setValue( this.wrapper.cliente.email );
    !this.wrapper.cliente.telefonos ? null : this.wrapper.cliente.telefonos.forEach(e => {
      if(e.codigoTipoTelefono == "M" && e.activo){
        this.telefonoMovil.setValue( e.numero );
      }
      if(e.codigoTipoTelefono == "F" && e.activo){
        this.telefonoCasa.setValue( e.numero );
      }
      if(e.codigoTipoTelefono == "CEL" && e.activo){
        this.telefonoOficina.setValue( e.numero );
      }
    });
    this.telefonoMovil.setValue( this.telefonoMovil.value ? this.telefonoMovil.value : 'No aplica');
    this.telefonoCasa.setValue( this.telefonoCasa.value ? this.telefonoCasa.value : 'No aplica');
    this.telefonoOficina.setValue( this.telefonoOficina.value ? this.telefonoOficina.value : 'No aplica');
    this.numeroOperacion.setValue( this.wrapper.credito.numeroOperacion );
    this.fechaCreacion.setValue( this.wrapper.credito.fechaSolicitud );
    this.fechaVencimiento.setValue( this.wrapper.credito.fechaVencimiento );
    this.montoFinanciado.setValue( this.wrapper.credito.montoFinanciado );
    this.asesor.setValue( this.wrapper.credito.codigoUsuarioAsesor );
    this.estadoOperacion.setValue( this.wrapper.credito.codigoEstadoOperacion );
    this.tipoCredito.setValue( this.wrapper.credito.tipoCredito );
    this.tablaAmortizacion.setValue( this.wrapper.credito.codigoTipoTablaArmotizacionQuski );
    this.impago.setValue( this.wrapper.credito.impago ? 'SI':'NO' );
    this.retanqueo.setValue( this.wrapper.credito.retanqueo ? 'SI':'NO' );
    this.esMigrado.setValue( this.wrapper.credito.esMigrado ? 'SI':'NO' );
    this.coberturaActual.setValue( this.wrapper.credito.coberturaActual );
    this.coberturaInicial.setValue( this.wrapper.credito.coberturaInicial );
    this.numeroCuotas.setValue( this.wrapper.credito.numeroCuotas );
    this.diasMora.setValue( this.wrapper.credito.diasMora );
    this.plazo.setValue( this.wrapper.credito.plazo );
    this.estadoUbicacion.setValue( this.wrapper.credito.codigoEstadoUbicacionGrantia );
    this.estadoProceso.setValue( this.wrapper.credito.codigoEstadoProcesoGarantia );
    this.descripcionBloqueo.setValue( this.wrapper.credito.datosBloqueo ? this.wrapper.credito.datosBloqueo : 'No presenta bloqueos');
    this.dataSourceRubro.data = this.wrapper.rubros;
    this.dataSourceGarantia.data = this.wrapper.garantias;
    this.dataSourceGarantia.data.forEach(e=>{
      //console.log("Catalogo de cobertura ->", this.catTipoGarantia);
      e.codigoTipoGarantia = this.catTipoGarantia.find(x => x.codigo == e.codigoTipoGarantia) ? this.catTipoGarantia.find(x => x.codigo == e.codigoTipoGarantia).nombre : 'Error en catalogo';
      e.tipoCobertura = this.catTipoCobertura.find(x => x.codigo == e.tipoCobertura ) ? this.catTipoCobertura.find(x => x.codigo == e.tipoCobertura).nombre : 'Error en catalogo';
      e.nombreAgenciaCustodia = this.catAgencia.find(x => x.id == e.idAgenciaCustodia).nombre;
      e.nombreAgenciaRegistro = this.catAgencia.find(x => x.id == e.idAgenciaRegistro).nombre;
      e.codigoTipoJoya = this.catTipoJoya.find(x => x.codigo == e.codigoTipoJoya) ? this.catTipoJoya.find( x => x.codigo == e.codigoTipoJoya).nombre : 'Error en catalogo';
      e.tienePiedras = e.tienePiedras? 'Si': 'No';
      e.codigoEstadoJoya = this.catEstadoJoya.find(x=> x.codigo == e.codigoEstadoJoya) ? this.catEstadoJoya.find(x=> x.codigo == e.codigoEstadoJoya).nombre : 'Error en catalogo';
      e.codigoTipoOro = this.catTipoOro.find(x => x.codigo ==e.codigoTipoOro) ? this.catTipoOro.find(x => x.codigo == e.codigoTipoOro).nombre : 'Error en catalogo';
      e.detallePiedras = e.detallePiedras ? e.detallePiedras : 'Sin detalle';  
      e.codigoEstadoProceso = this.catEstadoProceso.find(x=> x.codigo == e.codigoEstadoProceso) ? this.catEstadoProceso.find(x=> x.codigo == e.codigoEstadoProceso).nombre: 'Error en catalogo';
      e.codigoEstadoUbicacion = this.catEstadoUbicacion.find(x=> x.codigo == e.codigoEstadoUbicacion) ? this.catEstadoUbicacion.find(x=> x.codigo == e.codigoEstadoUbicacion).nombre: 'Error en catalogo';
      e.numeroFundaMadre = e.numeroFundaMadre ? e.numeroFundaMadre : 'Sin funda madre';  

    });
    this.sinNotSer.setNotice('CREDITO CARGADO CORRECTAMENTE','success');
    this.loadingSubject.next(false);
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
  private cargarCats(){
    this.sof.consultarTipoJoyaCS().subscribe( (data: any) =>{
      this.catTipoGarantia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });  
    this.sof.consultarTipoCoberturaCS().subscribe( (data: any) =>{
      this.catTipoCobertura = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
    this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
      this.catAgencia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
    this.sof.consultarTipoJoyaCS().subscribe( (data: any) =>{
      this.catTipoJoya = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });     
    this.sof.consultarEstadoJoyaCS().subscribe( (data: any) =>{
      this.catEstadoJoya = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
    this.sof.consultarTipoOroCS().subscribe( (data: any) =>{
      this.catTipoOro = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });  
    this.sof.consultarEstadoProcesoCS().subscribe( (data: any) =>{
      this.catEstadoProceso = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });
    this.sof.consultarEstadoUbicacionCS().subscribe( (data: any) =>{
      this.catEstadoUbicacion= !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
    });  
  }
  regresar(){
    this.router.navigate(['credito-nuevo/']);

  }
}
