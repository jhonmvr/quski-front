import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { NegociacionWrapper } from '../../../../../core/model/wrapper/NegociacionWrapper';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import 'hammerjs';


@Component({
  selector: 'kt-excepciones-cobertura',
  templateUrl: './excepciones-cobertura.component.html',
  styleUrls: ['./excepciones-cobertura.component.scss']
})
export class ExcepcionesCoberturaComponent implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public observacion;
  public usuario;
  public agencia;
  public excepcionado: boolean;
  public simulado: boolean;

  public wp: NegociacionWrapper = null;
  public formDisable: FormGroup = new FormGroup({});
  public cliente = new FormControl('', []);
  public cedula  = new FormControl('', []);
  public fechaCreacion = new FormControl('', []);
  public proceso = new FormControl('', []);
  public telefonoDomicilio = new FormControl('', []);
  public telefonoMovil = new FormControl('', []);
  public email = new FormControl('', []);

  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();
  displayedColumnsTasacion = ['NumeroPiezas', 'TipoOro', 'PesoBruto', 'DescuentoPesoPiedra', 'DescuentoSuelda', 'PesoNeto', 'precioOro', 'ValorAvaluo', 'ValorAplicable', 'ValorRealizacion', 'valorComercial', 'tienePiedras', 'detallePiedras','TipoJoya', 'EstadoJoya', 'Descripcion',];
  dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>();
  displayedColumnsCreditoNegociacion = ['plazo', 'periodoPlazo', 'periodicidadPlazo', 'montoFinanciado', 'valorARecibir', 'valorAPagar',
  'costoCustodia', 'costoFideicomiso', 'costoSeguro', 'costoTasacion', 'costoTransporte', 'costoValoracion', 'impuestoSolca',
  'formaPagoImpuestoSolca', 'formaPagoCapital', 'formaPagoCustodia', 'formaPagoFideicomiso', 'formaPagoInteres', 'formaPagoMora',
  'formaPagoGastoCobranza', 'formaPagoSeguro', 'formaPagoTasador', 'formaPagoTransporte', 'formaPagoValoracion', 'saldoInteres',
  'saldoMora', 'gastoCobranza', 'cuota', 'saldoCapitalRenov', 'montoPrevioDesembolso', 'totalGastosNuevaOperacion',
  'totalCostosOperacionAnterior', 'custodiaDevengada', 'formaPagoCustodiaDevengada', 'tipooferta', 'porcentajeflujoplaneado',
  'dividendoflujoplaneado', 'dividendosprorrateoserviciosdiferido'];
  dataSourceCobertura = new MatTableDataSource<any>();
  displayedColumnsCobertura = ['plazo','montoCredito','riesgoAcumulado','valorDesembolso','cuota'];

  public formDatosExcepcion: FormGroup = new FormGroup({});
  public cobertura = new FormControl('', [Validators.required]);
  public observacionAprobador = new FormControl('', [Validators.required]);
  public observacionAsesor = new FormControl('', []);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private neg: NegociacionService,
    private cal: CalculadoraService

  ) {
    this.formDisable.addControl('cliente', this.cliente);
    this.formDisable.addControl('cedula', this.cedula);
    this.formDisable.addControl('fechaCreacion', this.fechaCreacion);
    this.formDisable.addControl('proceso', this.proceso);
    this.formDisable.addControl('telefonoDomicilio', this.telefonoDomicilio);
    this.formDisable.addControl('telefonoMovil', this.telefonoMovil);
    this.formDisable.addControl('email', this.email);
    this.formDatosExcepcion.addControl('observacionAprobador', this.observacionAprobador);
    this.formDatosExcepcion.addControl('cobertura', this.cobertura);
  }

  ngOnInit() {
    this.wp = null;
    this.subheaderService.setTitle('Excepción de Cobertura');
    this.loading = this.loadingSubject.asObservable();
    this.busquedaNegociacion();
    this.usuario = localStorage.getItem(atob(environment.userKey));
    this.agencia = 2;
  }
  private busquedaNegociacion(){
    this.loadingSubject.next(true);
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        this.neg.traerNegociacionExistente(data.params.id).subscribe( (data: any)=>{
          if(data.entidad){
            this.wp = data.entidad;
            this.wp.credito && this.wp.proceso.estadoProceso == 'PENDIENTE_EXCEPCION' ? 
              this.sinNoticeService.setNotice('OPERACION CARGADA CORRECTAMENTE','success') :
                this.sinNoticeService.setNotice('ERROR CARGANDO EXCEPCION','error');
            this.cargarCampos(this.wp);
          }else{
            this.sinNoticeService.setNotice('ERROR CARGANDO NEGOCIACION','error');
          }
        });
      }
    }, error =>{this.loadingSubject.next(false)});
  }
  private cargarCampos( wp: NegociacionWrapper){
    this.formDisable.disable();
    this.cliente.setValue( wp.credito.tbQoNegociacion.tbQoCliente.nombreCompleto );
    this.cedula.setValue( wp.credito.tbQoNegociacion.tbQoCliente.cedulaCliente );
    this.fechaCreacion.setValue( wp.credito.tbQoNegociacion.fechaCreacion );
    this.proceso.setValue( wp.proceso.proceso );
    this.telefonoDomicilio.setValue( wp.telefonoDomicilio ? wp.telefonoDomicilio.numero : null );
    this.telefonoMovil.setValue( wp.telefonoMovil ? wp.telefonoMovil.numero : null );
    this.email.setValue( wp.credito.tbQoNegociacion.tbQoCliente.email );
    this.dataSourceTasacion.data = wp.joyas;
    this.dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>(); 
    this.dataSourceCreditoNegociacion.data.push( wp.credito );
    this.observacionAsesor.disable();
    this.observacion = this.wp.excepciones.find(e => e.tipoExcepcion == 'EXCEPCION_COBERTURA') ? this.wp.excepciones.find(e => e.tipoExcepcion == 'EXCEPCION_COBERTURA').observacionAsesor : this.sinNoticeService.setNotice('ERROR CARGANDO LA EXCEPCION','error');
    this.loadingSubject.next(false);
  }
  public formatLabel(value: number) {
    return value+'%';
  }
  public slideChange(event) {
    console.log('valor capturado es ', event);
  }
  public excepcionar( resp: boolean){
    !this.observacionAprobador.valid ? this.sinNoticeService.setNotice('COMPLETE EL CAMPO DE OBSERVACION','error') : resp ? this.sinNoticeService.setNotice('ESCOJA UN PORCENTAJE DE COBERTURA','success') : this.negar();
    this.excepcionado = this.observacionAprobador.valid && resp ? resp : false;
  }
  public simular(){ 
    this.loadingSubject.next(true);
    console.log('COBERTURA ---> ', this.cobertura.value )
    !this.cobertura.valid ? 
      this.sinNoticeService.setNotice('SELECCIONE UNA COBERTURA CORRECTA','error'):
        this.cal.simularOfertaExcepcionada(this.wp.credito.id, this.cobertura.value, this.agencia).subscribe( (data: any) =>{
          !data.entidades ? this.sinNoticeService.setNotice('NO TRAJE OPCIONES','error'): this.dataSourceCobertura.data = data.entidades;
          this.simulado = data.entidades ? true : false;
          this.loadingSubject.next(false);
        });
        this.loadingSubject.next(false);

  }
  public negar(){ 
    console.log('ME FUI A NEGAR')
    this.excepcionado = false;
    this.simulado = false;
  }
  public aprobar(){ 
    console.log('ME FUI A APROBAR')
  }
}
