import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { AprobacionWrapper } from '../../../../../core/model/wrapper/AprobacionWrapper';
import { OperacionAprobar } from '../../../../../core/model/softbank/OperacioAprobar';
import { CatalogosWrapper } from '../../../../../core/model/wrapper/CatalogosWrapper';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { TrackingUtil } from '../../../../../core/util/TrakingUtil';
import { DatosRegistro } from '../../../../../core/model/softbank/DatosRegistro';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoPatrimonio } from '../../../../../core/model/quski/TbQoPatrimonio';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { environment } from '../../../../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { TbQoRegistrarPago } from '../../../../../core/model/quski/TbQoRegistrarPago';
import { Observable } from 'rxjs';
import { ValidateDecimal } from '../../../../../core/util/validator.decimal';
import { LayoutConfigService } from '../../../../../core/_base/layout';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { TbQoCompromisoPago } from '../../../../../core/model/quski/TbQoCompromisoPago';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';

export interface CatalogoWrapper {
  nombre: string;
  id: string;
}
export interface cliente {
  identificacion: string;
  fechaNacimiento: string;
}

@Component({
  selector: 'kt-aprobacion-compromiso-pago',
  templateUrl: './aprobacion-compromiso-pago.component.html',
  styleUrls: ['./aprobacion-compromiso-pago.component.scss']
})
export class AprobacionCompromisoPagoComponent extends TrackingUtil implements OnInit {
  public credit: { credito: TbQoCreditoNegociacion, cuentas: any, proceso: TbQoProceso, };
  private compromisoNumeroOperacion: string
  private compromisoProceso: string
  public compromisoProcesoTracking: string
  private compromisoTipo: string
  public compromisoActividad: string

  diasMax;
  diasMin;
  mostrarInputActa: boolean = false;
  mostrarObsAprobador: boolean = false;
  mostrarBotonSolicitar: boolean = false;
  mostrarBotonesGestion: boolean = false;
  usuario
  agencia
  nombreUsuario



  public wrapper: {
    cliente: any,
    pagMed: any,
    credito: any,
    garantias: any[],
    variables: any,
    riesgos: any,
    procesos: TbQoProceso[],
    compromisos: TbQoCompromisoPago[],
  };
  public proceso: TbQoProceso
  public compromiso: TbQoCompromisoPago
  public catTipoCompromiso: any
  public riesgos;
  public variablesInternas
  public datosBloqueo = new MatTableDataSource<any>();
  public datosCuotas = new MatTableDataSource<any>();
  public formInformacion: FormGroup = new FormGroup({});
  public formCompromiso: FormGroup = new FormGroup({});

  /** @Información_Del_Proceso */
  public numeroOperacion = new FormControl();
  public numeroOperacionMadre = new FormControl();
  public numeroOperacionMupi = new FormControl();
  public procesoBPM = new FormControl('', []);
  public codigoBPM = new FormControl('', []);
  public estadoProcesoBPM = new FormControl('', []);

  /** @Información_Del_Cliente */
  public nombre = new FormControl();
  public cedula = new FormControl();
  public email = new FormControl();
  public telefonoMovil = new FormControl();
  public telefonoCasa = new FormControl();

  /** @Información_Del_Credito */
  public fechaAprobacion = new FormControl();
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
  public descripcionBloqueo = new FormControl();
  public esMigrado = new FormControl();
  public numeroCuotas = new FormControl();

  /** @Resultado_del_Compromiso */
  public tipoCompromisoPago = new FormControl();
  public fechaCompromiso = new FormControl();
  public fechaCompromisoActa = new FormControl();
  public observacionSolicitud = new FormControl();
  public observacionAprobador = new FormControl();

  public saldoCapital = new FormControl();
  public cuotasPagadas = new FormControl();
  public diasMoraDiaHoy = new FormControl();
  public tablaAmortizacionMupi = new FormControl();
  public fechaAudiencia = new FormControl();

  constructor(
    private cre: CreditoNegociacionService,
    private sof: SoftbankService,
    private par: ParametroService,
    private layoutService: LayoutConfigService,
    private sinNotSer: ReNoticeService,
    private route: ActivatedRoute,
    private cal: CalculadoraService,
    private router: Router,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    public tra: TrackingService

  ) {
    super(tra);
    this.cre.setParameter();
    this.sof.setParameter();

    /** @Información_Del_Proceso */
    this.formInformacion.addControl('numeroOperacion', this.numeroOperacion);
    this.formInformacion.addControl('numeroOperacionMadre', this.numeroOperacionMadre);
    this.formInformacion.addControl('numeroOperacionMupi', this.numeroOperacionMupi);
    this.formInformacion.addControl('procesoBPM', this.procesoBPM);
    this.formInformacion.addControl('codigoBPM', this.codigoBPM);
    this.formInformacion.addControl('estadoProcesoBPM', this.estadoProcesoBPM);

    this.formInformacion.addControl("nombre", this.nombre);
    this.formInformacion.addControl("cedula", this.cedula);
    this.formInformacion.addControl("email", this.email);
    this.formInformacion.addControl("telefonoMovil", this.telefonoMovil);
    this.formInformacion.addControl("telefonoCasa", this.telefonoCasa);

    this.formInformacion.addControl("fechaAprobacion", this.fechaAprobacion);
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
    this.formInformacion.addControl("descripcionBloqueo", this.descripcionBloqueo);
    this.formInformacion.addControl("esMigrado", this.esMigrado);
    this.formInformacion.addControl("numeroCuotas", this.numeroCuotas);
    this.formInformacion.addControl("saldoCapital", this.saldoCapital);
    this.formInformacion.addControl("cuotasPagadas", this.cuotasPagadas);
    this.formInformacion.addControl("diasMoraDiaHoy", this.diasMoraDiaHoy);
    this.formInformacion.addControl("tablaAmortizacionMupi", this.tablaAmortizacionMupi);
    this.formInformacion.addControl("fechaAudiencia", this.fechaAudiencia);
    this.formInformacion.addControl("fechaCompromisoActa", this.fechaCompromisoActa);

    this.formCompromiso.addControl("tipoCompromisoPago", this.tipoCompromisoPago);
    this.formCompromiso.addControl("fechaCompromiso", this.fechaCompromiso);

    this.formCompromiso.addControl("observacionSolicitud", this.observacionSolicitud);
    this.formCompromiso.addControl("observacionAprobador", this.observacionAprobador);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.sof.setParameter();
    this.formInformacion.disable();
    this.subheaderService.setTitle('Detalle de credito');
    this.usuario = localStorage.getItem("reUser");
    this.agencia = localStorage.getItem('idAgencia');

    this.traerCredito();

  }
  private traerCredito() {
    this.route.paramMap.subscribe((json: any) => {
      if (!json.params.proceso || !json.params.tipo || !json.params.numeroOperacion) {
        this.salirDeGestion("Error al intentar cargar proceso.");
      }
      this.compromisoProceso = json.params.proceso
      this.compromisoTipo = json.params.tipo
      this.compromisoNumeroOperacion = json.params.numeroOperacion
      this.compromisoActividad =
        this.compromisoProceso == 'create' && this.compromisoTipo == 'request' ? 'SOLICITUD COMPROMISO PAGO' :
          this.compromisoProceso == 'create' && this.compromisoTipo == 'approval' ? 'APROBACION COMPROMISO PAGO' :
            this.compromisoProceso == 'update' && this.compromisoTipo == 'request' ? 'SOLICITUD CAMBIO COMPROMISO' :
              this.compromisoProceso == 'update' && this.compromisoTipo == 'approval' ? 'APROBACION CAMBIO COMPROMISO' :
                'SIN ACTIVIDAD';
      this.compromisoProcesoTracking =
        this.compromisoProceso == 'create' ? 'COMPROMISO_PAGO' :
          this.compromisoProceso == 'update' ? 'CAMBIO_COMPROMISO_PAGO' :
            'SIN PROCESO';
      this.cre.traerCreditoCompromiso(this.compromisoNumeroOperacion, this.compromisoProcesoTracking).subscribe((data: any) => {
        if (data.entidad) {
          this.wrapper = data.entidad;
          this.cargarCampos();
          this.validarProceso(this.compromiso, this.compromisoActividad);
        }
      });

    });
  }
  private cargarCampos() {
    this.nombre.setValue(this.wrapper.cliente.nombreCompleto);
    this.cedula.setValue(this.wrapper.cliente.identificacion);
    this.email.setValue(this.wrapper.cliente.email);
    !this.wrapper.cliente.telefonos ? null : this.wrapper.cliente.telefonos.forEach(e => {
      if (e.codigoTipoTelefono == "CEL" && e.activo) {
        this.telefonoMovil.setValue(e.numero);
      }
      if (e.codigoTipoTelefono == "DOM" && e.activo) {
        this.telefonoCasa.setValue(e.numero);
      }
    });
    this.telefonoMovil.setValue(this.telefonoMovil.value ? this.telefonoMovil.value : 'No aplica');
    this.telefonoCasa.setValue(this.telefonoCasa.value ? this.telefonoCasa.value : 'No aplica');
    this.numeroOperacion.setValue(this.wrapper.credito.numeroOperacion);
    this.numeroOperacionMupi.setValue(this.wrapper.credito.numeroOperacionMupi);
    this.numeroOperacionMadre.setValue(this.wrapper.credito.numeroOperacionMadre)
    this.fechaAprobacion.setValue(this.wrapper.credito.fechaAprobacion);
    this.fechaVencimiento.setValue(this.wrapper.credito.fechaVencimiento);
    this.montoFinanciado.setValue(this.wrapper.credito.montoFinanciado);
    this.asesor.setValue(this.wrapper.credito.codigoUsuarioAsesor);
    this.estadoOperacion.setValue(this.wrapper.credito.codigoEstadoOperacion);
    this.tipoCredito.setValue(this.wrapper.credito.tipoCredito);
    this.tablaAmortizacion.setValue(this.wrapper.credito.codigoTipoTablaArmotizacionQuski);
    this.impago.setValue(this.wrapper.credito.impago ? 'SI' : 'NO');
    this.retanqueo.setValue(this.wrapper.credito.retanqueo ? 'SI' : 'NO');
    this.esMigrado.setValue(this.wrapper.credito.esMigrado ? 'SI' : 'NO');
    this.coberturaActual.setValue(this.wrapper.credito.coberturaActual);
    this.coberturaInicial.setValue(this.wrapper.credito.coberturaInicial);
    this.numeroCuotas.setValue(this.wrapper.credito.numeroCuotas);
    this.plazo.setValue(this.wrapper.credito.plazo);
    this.saldoCapital.setValue(this.wrapper.pagMed.saldoCapital)
    this.cuotasPagadas.setValue('sin definicion')
    this.diasMoraDiaHoy.setValue(this.wrapper.pagMed.diasMora)
    this.tablaAmortizacionMupi.setValue('sin definicion')
    this.fechaAudiencia.setValue(this.wrapper.pagMed.fechaMediacion ? new Date(this.wrapper.pagMed.fechaMediacion).toISOString().split('T')[0] : '')
    if(this.wrapper.credito && this.wrapper.credito.datosBloqueo){
      this.datosBloqueo = new MatTableDataSource<any>();
      this.datosBloqueo.data.push(this.wrapper.credito.datosBloqueo);
    }
    if(this.wrapper.pagMed && this.wrapper.pagMed.cuotasAtrasadas){
      this.datosCuotas = new MatTableDataSource<any>(this.wrapper.pagMed.cuotasAtrasadas);
    }
    


    if (this.wrapper.procesos) {
      this.proceso = this.wrapper.procesos.find((item) => item.proceso === this.compromisoProcesoTracking);
      this.compromiso = this.wrapper.compromisos.find((item) => item.id === this.proceso.idReferencia);
    }
    this.riesgoAcumulado(this.wrapper.cliente.identificacion);
    this.simularOpciones()
    this.par.findByTipo('TIPO-COMPROMISO',).subscribe((data: any) => {
      this.catTipoCompromiso = data.entidades ? data.entidades : { codigo: 'ERR', mensaje: 'Error al cargar catalogo' }
    });
    this.guardarTraking(this.compromisoProcesoTracking, this.compromiso ? (this.compromiso.codigo ? this.compromiso.codigo : null) : null,
      ['Datos Proceso', 'Datos Cliente', 'Datos Credito', 'Variables crediticias', 'Riesgo Acumulado', 'Garantias', 'Resultado del Compromiso'],
      0, this.compromisoActividad, this.compromiso ? this.compromiso.numeroOperacion ? this.compromiso.numeroOperacion : null : null);

    this.procesoBPM.setValue(this.proceso ? this.proceso.proceso.replace(/_/g, ' ') : 'Sin Asignar')
    this.codigoBPM.setValue(this.compromiso ? this.compromiso.codigo : 'Sin Asignar')
    this.estadoProcesoBPM.setValue(this.compromiso ? this.compromiso.estadoCompromiso.replace(/_/g, ' ') : 'Sin Asignar')
    /**  @CAMPOS_UTILES  */
    this.tipoCompromisoPago.setValue(this.compromiso.tipoCompromiso);
    this.fechaCompromiso.setValue(this.compromiso.fechaCompromisoPago ? new Date(this.compromiso.fechaCompromisoPago) : null);
    if (this.compromiso.estadoCompromiso === 'CREADO') {
      this.fechaCompromisoActa.setValue(this.wrapper.pagMed.fechaCompromisoPago ? new Date(this.wrapper.pagMed.fechaCompromisoPago).toISOString().split('T')[0] : null)
    } else {
      this.fechaCompromisoActa.setValue(this.compromiso.fechaCompromisoPagoAnterior ? new Date(this.compromiso.fechaCompromisoPagoAnterior).toISOString().split('T')[0] : null);
    }
    this.observacionSolicitud.setValue(this.compromiso.observacionSolicitud);
    this.observacionAprobador.setValue(this.compromiso.observacionAprobador);

    this.sinNotSer.setNotice('CREDITO CARGADO CORRECTAMENTE', 'success');
  }
  solicitarCompromiso(): void {
    if (!this.tipoCompromisoPago.value) {
      this.sinNotSer.setNotice('ESCOJA UN TIPO DE COMPROMISO', 'warning');
      return;
    }
    if (!this.fechaCompromiso.value) {
      this.sinNotSer.setNotice('INGRESE LA FECHA DE COMPROMISO DE PAGO', 'warning');
      return;
    }
    if (!this.observacionSolicitud.value) {
      this.sinNotSer.setNotice('INGRESE LA OBSERVACION DE LA SOLICITUD', 'warning');
      return;
    }

    let mensaje = 'Solicitar la aprobacion del proceso: ' + this.compromiso.codigo;
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.compromiso.fechaCompromisoPago = this.fechaCompromiso.value
        this.compromiso.fechaCompromisoPagoAnterior = this.fechaCompromisoActa.value
        this.compromiso.observacionSolicitud = this.observacionSolicitud.value
        this.compromiso.tipoCompromiso = this.tipoCompromisoPago.value
        this.compromiso.correoSolicitud = localStorage.getItem("email");

        this.cre.solicitarCompromiso(this.compromiso, this.compromisoProcesoTracking).subscribe((data: any) => {
          if (!data.entidad) {
            this.sinNotSer.setNotice('ERROR ENVIANDO LA SOLICITUD: ' + data.entidad, 'error');
            return
          }
          this.sinNotSer.setNotice('SOLICITUD ENVIADA CORRECTAMENTE', 'success');
          this.router.navigate(['credito-nuevo/lista-credito'])
        });
      } else {
        this.sinNotSer.setNotice('SE CANCELO LA  ACCION', 'warning');
      }
    });

  }
  resolucionCompromiso(aprobado): void {
    if (!this.observacionAprobador.value) {
      this.sinNotSer.setNotice('INGRESE LA OBSERVACION DE LA APROBACION', 'warning');
      return;
    }
    let mensaje = (aprobado ? 'Aprobar la fecha de compromiso de pago de proceso: ' : 'Rechazar la fecha de compromiso de pago de proceso: ') + this.compromiso.codigo;
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.compromiso.observacionAprobador = this.observacionAprobador.value
        this.cre.resolucionCompromiso(this.compromiso, this.compromisoProcesoTracking, aprobado).subscribe((data: any) => {
          if (!data.entidad) {
            this.sinNotSer.setNotice('ERROR RESOLVIENDO LA SOLICITUD: ' + data.entidad, 'error');
            return
          }
          this.sinNotSer.setNotice('SOLICITUD RESUELTA CORRECTAMENTE', 'success');
          this.router.navigate(['aprobador/bandeja-compromiso']) 
        },error =>{
          console.log('error: ',error)
        });
      } else {
        this.sinNotSer.setNotice('SE CANCELO LA  ACCION', 'warning');
      }
    });
  }
  riesgoAcumulado(identificacion) {
    let clienteConsultar: ConsultaCliente = { idTipoIdentificacion: 0, identificacion: "" }
    clienteConsultar.idTipoIdentificacion = 1;
    clienteConsultar.identificacion = identificacion
    this.sof.consultaRiesgoAcumuladoCS(clienteConsultar).subscribe((data: any) => {
      if (data) {
        this.riesgos = data.operaciones
      }
    })
  }
  public simularOpciones() {
    let cliente = {} as cliente;
    cliente.identificacion = this.wrapper.cliente.identificacion;
    let fecha = this.wrapper.cliente.fechaNacimiento.split("-")
    cliente.fechaNacimiento = fecha[2] + '/' + fecha[1] + '/' + fecha[0];

    let wrapper: any = { cliente: null, credito: null, garantias: null }
    wrapper.cliente = cliente;
    wrapper.credito = this.wrapper.credito
    wrapper.garantias = this.wrapper.garantias
    let cobertura = this.wrapper.credito ? this.wrapper.credito.coberturaActual ? this.wrapper.credito.coberturaActual : 0 : 0;
    let monto = this.wrapper.credito ? this.wrapper.credito.montoSolicitado ? this.wrapper.credito.montoSolicitado : null : null;
    this.cal.simularOfertaRenovacion(0, 0, this.agencia, monto, wrapper).subscribe((data: any) => {
      if (data.entidad) {
        if (data.entidad && data.entidad.simularResult && data.entidad.simularResult.xmlVariablesInternas && data.entidad.simularResult.xmlVariablesInternas.variablesInternas && data.entidad.simularResult.xmlVariablesInternas.variablesInternas.variable) {
          this.variablesInternas = data.entidad.simularResult.xmlVariablesInternas.variablesInternas && data.entidad.simularResult.xmlVariablesInternas.variablesInternas.variable;
        }
      }
    });
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
  regresar() {
    this.compromisoTipo == 'request' ?
      this.router.navigate(['credito-nuevo/lista-credito']) :
      this.router.navigate(['credito-nuevo/'])
  }
  onlyOdds = (d: Date): boolean => {
    const date = d.getDate();
    return date < 26;
  }
  private validarProceso(compromiso: TbQoCompromisoPago, actividad: string): void {
    switch (actividad) {
      case 'SOLICITUD COMPROMISO PAGO':
        if (this.usuario != compromiso.usuarioSolicitud) {
          this.salirDeGestion('El proceso de compromiso de pago ya fue iniciado por ' + compromiso.usuarioSolicitud, 'Proceso Invalido');
        }
        if (['PENDIENTE_COMPROMISO', 'APROBADO', 'RECHAZADO'].includes(compromiso.estadoCompromiso)) {
          this.formCompromiso.disable();
        } else if (compromiso.estadoCompromiso === 'CREADO') {
          this.formCompromiso.enable();
          this.observacionAprobador.disable();
          this.mostrarBotonSolicitar = true;
        } else {
          this.salirDeGestion('El proceso en estado invalido.', 'Proceso Invalido');
        }
        break;
      case 'APROBACION COMPROMISO PAGO':
        if (['CREADO'].includes(compromiso.estadoCompromiso)) {
          this.salirDeGestion('El proceso de compromiso aun esta en creacion.', 'Proceso Invalido');
        } else if (['APROBADO', 'RECHAZADO'].includes(compromiso.estadoCompromiso)) {
          this.salirDeGestion('El proceso de compromiso de pago ya fue revisado por ' + compromiso.usuarioAprobador, 'Proceso Invalido');
        } else if (compromiso.estadoCompromiso === 'PENDIENTE_COMPROMISO') {
          this.formCompromiso.disable();
          this.observacionAprobador.enable();
          this.mostrarObsAprobador = true;
          this.mostrarBotonesGestion = true;
        } else {
          this.salirDeGestion('El proceso en estado invalido.', 'Proceso Invalido');
        }
        break;
      case 'SOLICITUD CAMBIO COMPROMISO':
        this.mostrarInputActa = true;
        if (this.usuario != compromiso.usuarioSolicitud) {
          this.salirDeGestion('El proceso de compromiso de pago ya fue iniciado por ' + compromiso.usuarioSolicitud, 'Proceso Invalido');
        }
        if (['PENDIENTE_COMPROMISO', 'APROBADO', 'RECHAZADO'].includes(compromiso.estadoCompromiso)) {
          this.formCompromiso.disable();
        } else if (compromiso.estadoCompromiso === 'CREADO') {
          this.formCompromiso.enable();
          this.observacionAprobador.disable();
          this.mostrarBotonSolicitar = true
        } else {
          this.salirDeGestion('El proceso en estado invalido.', 'Proceso Invalido');
        }
        break;
      case 'APROBACION CAMBIO COMPROMISO':
        this.mostrarInputActa = true;
        this.mostrarObsAprobador = true;
        if (['CREADO'].includes(compromiso.estadoCompromiso)) {
          this.salirDeGestion('El proceso de compromiso aun esta en creacion.', 'Proceso Invalido');
        } else if (['APROBADO', 'RECHAZADO'].includes(compromiso.estadoCompromiso)) {
          this.salirDeGestion('El proceso de compromiso de pago ya fue revisado por ' + compromiso.usuarioAprobador, 'Proceso Invalido');
        } else if (compromiso.estadoCompromiso === 'PENDIENTE_COMPROMISO') {
          this.formCompromiso.disable();
          this.observacionAprobador.enable();
          this.mostrarBotonesGestion = true;
        } else {
          this.salirDeGestion('El proceso en estado invalido.', 'Proceso Invalido');
        }
        break;

      default:
        break;
    }
  }
}
