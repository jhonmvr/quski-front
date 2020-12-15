import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { NegociacionWrapper } from '../../../../../core/model/wrapper/NegociacionWrapper';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatTableDataSource } from '@angular/material';
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
  public observacion: string;
  public excepcion: TbQoExcepcion;
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
    private dialog: MatDialog,
    private neg: NegociacionService,
    private exc: ExcepcionService,
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
            this.excepcion = this.wp.excepciones.find(e => e.tipoExcepcion == 'EXCEPCION_COBERTURA' && e.estadoExcepcion == 'PENDIENTE'); 
            this.wp.credito && this.wp.proceso.estadoProceso == 'PENDIENTE_EXCEPCION' && this.excepcion ?  
            this.cargarCampos(this.wp) : this.sinNoticeService.setNotice('ERROR CARGANDO EXCEPCION','error');
            this.loadingSubject.next(false);
          }else{
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice('ERROR CARGANDO NEGOCIACION','error');
          }
        });
      }
    }, error =>{this.loadingSubject.next(false)});
  }
  private cargarCampos( wp: NegociacionWrapper){
    this.sinNoticeService.setNotice('OPERACION CARGADA CORRECTAMENTE','success')
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
    console.log('Mi excepcion --> ', this.excepcion);
    this.observacion = this.excepcion.observacionAsesor;
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
    if(this.observacionAprobador.valid){
      console.log('ME FUI A NEGAR')
      this.excepcionado = false;
      this.simulado = false;
      let mensaje = 'Negar la excepcion de cobertura para: ' + this.wp.credito.codigo+'?'; 
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.exc.negarExcepcion(this.excepcion.id, this.observacionAprobador.value, this.usuario).subscribe( (data: any) =>{
            if(data.entidad){ this.router.navigate(['aprobador/bandeja-excepciones']);  } else{ this.sinNoticeService.setNotice('Error al negar la excepcion','error')}
          });
        }
      });
    }else{ this.sinNoticeService.setNotice('COMPLETE EL CAMPO DE OBSERVACION','error') }
  }
  public aprobar(){ 
    if(this.observacionAprobador.valid && this.cobertura.valid){
      console.log('ME FUI A APROBAR')
      let mensaje = 'Aprobar la excepcion de cobertura para: ' + this.wp.credito.codigo+'?'; 
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.exc.aprobarCobertura(this.excepcion.id, this.observacionAprobador.value, this.usuario, this.cobertura.value).subscribe( (data: any) =>{
            if(data.entidad){ this.router.navigate(['aprobador/bandeja-excepciones']);  } else{ this.sinNoticeService.setNotice('Error  al aprobar la excepcion','error')}
          });
        }
      });
    }else{ this.sinNoticeService.setNotice('COMPLETE EL CAMPO DE OBSERVACION','error') }
  }
  

}
