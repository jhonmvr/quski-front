import { ConfirmarAccionComponent } from '../../../../../../app/views/partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoCreditoNegociacion } from '../../../../../../app/core/model/quski/TbQoCreditoNegociacion';
import { CalculadoraService } from '../../../../../../app/core/services/quski/calculadora.service';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { NegociacionWrapper } from '../../../../../core/model/wrapper/NegociacionWrapper';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { environment } from '../../../../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
@Component({
  selector: 'kt-excepciones-riesgo',
  templateUrl: './excepciones-riesgo.component.html',
  styleUrls: ['./excepciones-riesgo.component.scss']
})
export class ExcepcionesRiesgoComponent extends TrackingUtil implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public observacion: string;
  public excepcion: TbQoExcepcion;
  public usuario;
  public agencia; 
  dataSourceTelefonosCliente = new MatTableDataSource<any>();
  public simulado: boolean;
  public loadVariables = new BehaviorSubject<boolean>(false);
  public wp: NegociacionWrapper = null;
  public formDisable: FormGroup = new FormGroup({});
  public cliente = new FormControl('', []);
  public cedula  = new FormControl('', []);
  public fechaCreacion = new FormControl('', []);
  public proceso = new FormControl('', []);
  public email = new FormControl('', []);
  public componenteVariable: boolean;
  negoW: NegociacionWrapper;
  mensaje;


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
  public cobertura = new FormControl('', [Validators.required, ]);
  public observacionAprobador = new FormControl('', [Validators.required]);
  public observacionAsesor = new FormControl('', []);

  public coberturaActual = new FormControl('', []);
  public montoActual = new FormControl('', []);
  public valorComercial = new FormControl('', []);
  public valorAvaluo = new FormControl('', []);
  public usuarioAsesor = new FormControl('', []);


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog,
    private cre: CreditoNegociacionService,
    private exc: ExcepcionService,
    private cal: CalculadoraService,
    private sinNotSer: ReNoticeService,
    public tra: TrackingService,

  ) {
    super(tra);
    this.cre.setParameter();
    this.exc.setParameter();
    this.cal.setParameter();
    this.formDisable.addControl('cliente', this.cliente);
    this.formDisable.addControl('cedula', this.cedula);
    this.formDisable.addControl('fechaCreacion', this.fechaCreacion);
    this.formDisable.addControl('proceso', this.proceso);
    this.formDisable.addControl('email', this.email);
    this.formDisable.addControl('usuarioAsesor', this.usuarioAsesor);
    this.formDatosExcepcion.addControl('observacionAprobador', this.observacionAprobador);
    this.formDatosExcepcion.addControl('cobertura', this.cobertura);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.exc.setParameter();
    this.cal.setParameter();
    this.wp = null;
    this.loading = this.loadingSubject.asObservable();
    this.busquedaNegociacion();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );
  }
  private camposAdicinales(){
    let totalValorAvaluo: number = 0;
    let totalValorComercial: number = 0;
    !this.wp.joyas ? null : this.wp.joyas.forEach(e=>{
      totalValorAvaluo += e.valorAvaluo;
      totalValorComercial += e.valorComercial;
    }); 
    this.coberturaActual.setValue( this.wp.variables.find( v => v.codigo == 'Cobertura') ? this.wp.variables.find( v => v.codigo == 'Cobertura').valor : 'No aplica');
    this.valorComercial.setValue( totalValorComercial );
    this.valorAvaluo.setValue( totalValorAvaluo );
  }
  private busquedaNegociacion(){
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        let excepcionRol = JSON.parse(atob(data.params.id));
        this.mensaje = excepcionRol.mensajeBre;
        this.cre.traerCreditoNegociacion(excepcionRol.idNegociacion).subscribe( (data: any)=>{
          if(data.entidad){
            this.wp = data.entidad;
            this.formDisable.disable();
            if(this.wp.credito && this.wp.excepciones && this.wp.excepciones.find(e => e.id == excepcionRol.id ) && this.wp.proceso.estadoProceso == 'PENDIENTE_EXCEPCION' ){
              this.excepcion = this.wp.excepciones.find(e => e.id == excepcionRol.id );
              this.cargarCampos(this.wp) 
            }else{
              this.sinNoticeService.setNotice('ERROR CARGANDO EXCEPCION','error');            
            }
          }else{
            this.sinNoticeService.setNotice('ERROR CARGANDO NEGOCIACION','error');
          }
        });
      }
    }, () =>{this.loadingSubject.next(false)});
  }
  public regresar(){
    this.router.navigate(['aprobador/bandeja-excepciones']);
  }
  private cargarCampos( wp: NegociacionWrapper){
    this.sinNoticeService.setNotice('OPERACION CARGADA CORRECTAMENTE','success')
    this.subheaderService.setTitle('Operacion: '+this.wp.credito.codigo);

    this.guardarTraking(wp ? wp.proceso ? wp.proceso.proceso : null : null,
      wp ? wp.credito ? wp.credito.codigo : null : null, 
      ['Información Operación','Datos Contacto Cliente','Variables crediticias','Riesgo Acumulado','Tasacion','Opciones de Crédito','Excepción'], 
      0, 'EXCEPCION RIESGO', wp ? wp.credito ? wp.credito.numeroOperacion : null : null )

    this.cliente.setValue( wp.credito.tbQoNegociacion.tbQoCliente.nombreCompleto );
    this.cedula.setValue( wp.credito.tbQoNegociacion.tbQoCliente.cedulaCliente );
    this.fechaCreacion.setValue( wp.credito.tbQoNegociacion.fechaCreacion );
    this.proceso.setValue( wp.proceso.proceso );
    if (wp.telefonos) {
      this.dataSourceTelefonosCliente = new MatTableDataSource<any>(wp.telefonos);
    }
    this.email.setValue( wp.credito.tbQoNegociacion.tbQoCliente.email );
    this.observacionAsesor.disable();
    this.calcularOpciones();
    this.camposAdicinales( );
    this.observacion = this.excepcion.observacionAsesor;
    this.observacionAsesor.setValue( this.excepcion.observacionAsesor );
    this.usuarioAsesor.setValue( this.excepcion.idAsesor);
    this.loadingSubject.next(false);
  }
  public simular(){ 
    this.loadingSubject.next(true);
    //console.log('COBERTURA ---> ', this.cobertura.value )
    !this.cobertura.valid && this.observacionAprobador.valid  && this.cobertura.value >= 80 ? 
      this.sinNoticeService.setNotice('COMPLETE LA SECCION CORRECTAMENTE','error'):
        this.cal.simularOfertaExcepcionada(this.wp.credito.id, this.cobertura.value, this.agencia).subscribe( (data: any) =>{
          !data.entidades ? this.sinNoticeService.setNotice('NO TRAJE OPCIONES','error'): this.dataSourceCobertura.data = data.entidades;
          console.log(data.entidades)
          this.simulado = data.entidades ? true : false;
          this.loadingSubject.next(false);
        });
        this.loadingSubject.next(false);
  }
  public calcularOpciones() {
    if (this.wp && this.wp.joyas && this.wp.joyas.length > 0) {
      this.loadingSubject.next(true);
      this.cal.simularOferta(this.wp.credito.id, null, null).subscribe((data: any) => {
        this.loadingSubject.next(false);
        console.log("info", data.entidad)
        if (data.entidad.simularResult && data.entidad.simularResult.xmlOpcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion) {
            this.montoActual.setValue(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion[0].montoFinanciado);
            this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
            this.mapearVariables(data.entidad.simularResult.xmlVariablesInternas.variablesInternas.variable)
          }
      },()=>{
        this.loadingSubject.next(false);
      });
    } else {
      this.sinNoticeService.setNotice("INGRESE ALGUNA JOYA PARA CALCULAR LAS OPCIONES DE OFERTA", 'error');
    }

  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public negar(){ 
    if(this.observacionAprobador.valid){
      this.simulado = false;
      let mensaje = 'Negar la excepcion de cobertura para: ' + this.wp.credito.codigo+'?'; 
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.exc.negarExcepcion(this.excepcion.id, this.observacionAprobador.value, this.usuario,this.wp.proceso.proceso).subscribe( (data: any) =>{
            if(data.entidad){ this.router.navigate(['aprobador/bandeja-excepciones']);  } else{ this.sinNoticeService.setNotice('Error al negar la excepcion','error')}
          });
        }
      });
    }else{ this.sinNoticeService.setNotice('COMPLETE EL CAMPO DE OBSERVACION','error') }
  }
  aprobarExcepcion(aprueba){
    if(this.observacionAprobador.invalid){
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL LOS CAMPOS OBLIGATORIOS','warning');
      return;
    }
    let mensaje = aprueba == 'SI' ? 'Aprobar la excepcion de riesgo para: ' + this.wp.credito.codigo+'?' :
    'Negar la excepcion de riesgo para: ' + this.wp.credito.codigo+'?'; 
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        this.exc.aprobarExcepcion(this.excepcion.id,this.observacionAprobador.value,aprueba).subscribe(()=>{
          if(aprueba){
            this.sinNoticeService.setNotice('EXCEPCION DE RIESGO APROBADA','success');
          }else{
            this.sinNoticeService.setNotice('EXCEPCION DE RIESGO NEGADA','success');
          }
          this.router.navigate(['../../aprobador/bandeja-excepciones']);
        })
      }
    });
    
  }
  private mapearVariables(variables: Array<any>){
    let variablesBase : Array<TbQoVariablesCrediticia> = new Array<TbQoVariablesCrediticia>();
    this.loadVariables.next(true);
    variables.forEach( e=>{
      let variableBase : TbQoVariablesCrediticia = new TbQoVariablesCrediticia();
      variableBase.codigo = e.codigo;
      variableBase.nombre = e.nombre;
      variableBase.valor  = e.valor;
      variableBase.orden  = e.orden;
      variablesBase.push( variableBase );
    });
    this.componenteVariable = false;
    this.negoW.variables = variablesBase;
    console.log("Las variables de bre =>", variablesBase);
    this.sinNotSer.setNotice("LAS VARIABLES CREDITICIAS FUERON ACTUALIZADAS", 'success');
    this.componenteVariable = true;
    this.loadVariables.next(false);
  }
}
