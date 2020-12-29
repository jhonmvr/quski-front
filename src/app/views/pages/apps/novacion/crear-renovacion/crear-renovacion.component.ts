import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { CreditoSoftbankWrapper } from '../../../../../core/model/wrapper/CreditoSoftbankWrapper';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { environment } from '../../../../../../../src/environments/environment.prod';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-crear-renovacion',
  templateUrl: './crear-renovacion.component.html',
  styleUrls: ['./crear-renovacion.component.scss']
})
export class CrearRenovacionComponent implements OnInit {
  public loading;
  public usuario: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  private creditoSoftbank: any;
  public fechaUtil: diferenciaEnDias;
  private fechaServer;
  totalPesoB
  totalPesoN
  totalValorO
  totalNumeroJoya
  totalValorA
  totalValorR
  totalValorC
  /** @FORMULARIOS */
  public formOperacion: FormGroup = new FormGroup({});
  public codigoBpm = new FormControl();
  public codigoOperacion = new FormControl();
  public proceso = new FormControl();
  public estadoProceso = new FormControl();
  public nombreCompleto = new FormControl();
  public cedulaCliente = new FormControl();
  public fechaCuota = new FormControl();
  
  public dataSourceTasacion = new MatTableDataSource<any>();
  public displayedColumnsTasacion = ['NumeroPiezas', 'TipoOro', 'PesoBruto', 'DescuentoPesoPiedra', 'DescuentoSuelda', 'PesoNeto', 'precioOro', 'ValorAvaluo', 'ValorAplicable', 'ValorRealizacion', 'valorComercial', 'tienePiedras', 'detallePiedras','TipoJoya', 'EstadoJoya', 'Descripcion',];
  public dataSourceCreditoNegociacion = new MatTableDataSource<any>();
  public displayedColumnsCreditoNegociacion = ['plazo', 'periodoPlazo', 'periodicidadPlazo', 'montoFinanciado', 'valorARecibir', 'valorAPagar',
    'costoCustodia', 'costoFideicomiso', 'costoSeguro', 'costoTasacion', 'costoTransporte', 'costoValoracion', 'impuestoSolca',
    'formaPagoImpuestoSolca', 'formaPagoCapital', 'formaPagoCustodia', 'formaPagoFideicomiso', 'formaPagoInteres', 'formaPagoMora',
    'formaPagoGastoCobranza', 'formaPagoSeguro', 'formaPagoTasador', 'formaPagoTransporte', 'formaPagoValoracion', 'saldoInteres',
    'saldoMora', 'gastoCobranza', 'cuota', 'saldoCapitalRenov', 'montoPrevioDesembolso', 'totalGastosNuevaOperacion',
    'totalCostosOperacionAnterior', 'custodiaDevengada', 'formaPagoCustodiaDevengada', 'tipooferta', 'porcentajeflujoplaneado',
    'dividendoflujoplaneado', 'dividendosprorrateoserviciosdiferido'];
  constructor(
    private cre: CreditoNegociacionService,
    private cal: CalculadoraService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService
  ) { 
    this.formOperacion.addControl("codigoBpm", this.codigoBpm);
    this.formOperacion.addControl("codigoOperacion", this.codigoOperacion);
    this.formOperacion.addControl("proceso", this.proceso);
    this.formOperacion.addControl("estadoProceso", this.estadoProceso);
    this.formOperacion.addControl("nombreCompleto", this.nombreCompleto);
    this.formOperacion.addControl("cedulaCliente", this.cedulaCliente);
    this.formOperacion.addControl("fechaCuota", this.fechaCuota);
  }

  ngOnInit() {
    this.subheaderService.setTitle('Negociación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.setFechaSistema();
    this.inicioDeFlujo();
  }
  /** @CREDITO */
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.numeroOperacion) {
        this.loadingSubject.next(true);
        this.cre.buscarRenovacion(json.params.numeroOperacion).subscribe((data: any) => {
          if (data.entidad) {
            console.log("datos ->", data.entidad)
            this.cargarCampos( data.entidad );
          }else{
            this.abrirSalirGestion("Error al intentar cargar el credito.");
          }
        });
      } 
    });
  }
  private cargarCampos(wr) {
    this.codigoBpm.setValue( wr.credito? wr.credito.codigo : 'Sin asignar')
    this.codigoOperacion.setValue(wr.detalle.credito.numeroOperacion);
    this.proceso.setValue(wr.proceso ? wr.proceso.proceso : 'Renovacion');
    this.estadoProceso.setValue(wr.proceso ? wr.proceso.estadoProceso : 'Creado');
    this.nombreCompleto.setValue(wr.detalle.cliente.nombreCompleto);
    this.cedulaCliente.setValue(wr.detalle.cliente.identificacion);
    this.formOperacion.disable();
    this.dataSourceTasacion.data = wr.detalle.garantias;
    this.sinNotSer.setNotice("SE HA CARGADO EL CREDITO: " + wr.detalle.credito.numeroOperacion + ".", "success");
    this.loadingSubject.next(false);
  }
  public solicitarCobertura(){}
  public actualizarCliente(){}
  public simularOpciones(){}

  /** @FUNCIONALIDAD */
  public regresar(){
    this.router.navigate(['credito-nuevo/lista-credito']);
  }
  public abrirSalirGestion(mensaje: string, titulo?: string) {
    let data = {
      mensaje: mensaje,
      titulo: titulo ? titulo : null
    }
    const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
      width: "800px",
      height: "auto",
      data: data
    });
    dialogRef.afterClosed().subscribe(r => {
      this.regresar();
    });
  }
  public validacionFecha() {
    this.fechaUtil = new diferenciaEnDias(new Date(this.fechaCuota.value), new Date(this.fechaServer))
    if (Math.abs(this.fechaUtil.obtenerDias()) >= 30 && Math.abs(this.fechaUtil.obtenerDias()) <= 45) {
      console.log("Esta dentro del rango")
    } else {
      this.sinNotSer.setNotice("DEBE ESCOGER ENTRE 30 Y 45 DÍAS", 'error');
    }
    console.log("los dias  de diferencia", this.fechaUtil.obtenerDias())
  }
  private setFechaSistema() {
    this.cre.getSystemDate().subscribe((fechaSistema: any) => {
      this.fechaServer = new Date(fechaSistema.entidad);
    })
  }
}
