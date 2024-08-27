import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SubheaderService, LayoutConfigService } from '../../../../../../../app/core/_base/layout';
import { TbQoCreditoNegociacion } from '../../../../../../../app/core/model/quski/TbQoCreditoNegociacion';
import { TbQoExcepcion } from '../../../../../../../app/core/model/quski/TbQoExcepcion';
import { TbQoVariablesCrediticia } from '../../../../../../../app/core/model/quski/TbQoVariablesCrediticia';
import { NegociacionWrapper } from '../../../../../../../app/core/model/wrapper/NegociacionWrapper';
import { CalculadoraService } from '../../../../../../../app/core/services/quski/calculadora.service';
import { CreditoNegociacionService } from '../../../../../../../app/core/services/quski/credito.negociacion.service';
import { ExcepcionService } from '../../../../../../../app/core/services/quski/excepcion.service';
import { ProcesoService } from '../../../../../../../app/core/services/quski/proceso.service';
import { SoftbankService } from '../../../../../../../app/core/services/quski/softbank.service';
import { TrackingService } from '../../../../../../../app/core/services/quski/tracking.service';
import { ReNoticeService } from '../../../../../../../app/core/services/re-notice.service';
import { ConfirmarAccionComponent } from '../../../../../../../app/views/partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { environment } from '../../../../../../../environments/environment';
import { ExcepcionOperativaService } from '../../../../../../../app/core/services/quski/excepcion-operativa.service';
import { TbQoExcepcionOperativa } from '../.././../../../../../app/core/model/quski/TbQoExcepcionOperativa';

@Component({
  selector: 'kt-aprobador-excepcion-operativa',
  templateUrl: './aprobador-excepcion-operativa.component.html',
  styleUrls: ['./aprobador-excepcion-operativa.component.scss']
})
export class AprobadorExcepcionOperativaComponent implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  public observacion: string;
  public excepcion: TbQoExcepcionOperativa;
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
  public valorDescuentoServicios = new FormControl('', []);
  aprobadoWebMupi = new FormControl('', []);
  public componenteVariable: boolean;
  negoW: NegociacionWrapper;
  mensaje;


  dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>();
  displayedColumnsCreditoNegociacion = ['plazo', 'periodicidadPlazo', 'montoFinanciado', 'cuota', 'valorARecibir', 'valorAPagar',
  'totalCostosOperacionAnterior','totalGastosNuevaOperacion', 'costoCustodia', 'costoTasacion', 'costoFideicomiso', 'costoSeguro', 'impuestoSolca',
  'saldoCapitalRenov', 'saldoInteres','abonoCapital', 'saldoMora', 'gastoCobranza', 'custodiaDevengada', 'porcentajeflujoplaneado','formaPagoCustodia','formaPagoTasador', 
  'formaPagoFideicomiso', 'formaPagoSeguro',  'formaPagoImpuestoSolca', 'formaPagoGastoCobranza','formaPagoAbonoCapital'];
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
  codigoAgencia;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog,
    private cre: CreditoNegociacionService,
    private excepcionOperativaService: ExcepcionOperativaService,
    private cal: CalculadoraService,
    private sof: SoftbankService,
    private sinNotSer: ReNoticeService,
    private procesoService: ProcesoService,
    private layoutService: LayoutConfigService,
    public tra: TrackingService,
    public dialogRef: MatDialogRef<AprobadorExcepcionOperativaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.cre.setParameter();
    this.cal.setParameter();
    this.sof.setParameter();
    this.procesoService.setParameter();
    this.formDisable.addControl('cliente', this.cliente);
    this.formDisable.addControl('cedula', this.cedula);
    this.formDisable.addControl('fechaCreacion', this.fechaCreacion);
    this.formDisable.addControl('proceso', this.proceso);
    this.formDisable.addControl('email', this.email);
    this.formDisable.addControl('aprobadoWebMupi', this.aprobadoWebMupi);
    this.formDisable.addControl('usuarioAsesor', this.usuarioAsesor);
    this.formDatosExcepcion.addControl('observacionAprobador', this.observacionAprobador);
    this.formDatosExcepcion.addControl('cobertura', this.cobertura);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.cal.setParameter();
    this.sof.setParameter();
    this.procesoService.setParameter();
    this.wp = null;
    this.loading = this.loadingSubject.asObservable();
    this.busquedaNegociacion();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  private camposAdicinales(){
    let totalValorAvaluo: number = 0;
    let totalValorComercial: number = 0;
    !this.wp.joyas ? null : this.wp.joyas.forEach(e=>{
      totalValorAvaluo += e.valorAvaluo;
      totalValorComercial += e.valorComercial;
    }); 
    if(this.wp.variables){
      this.coberturaActual.setValue( this.wp.variables.find( v => v.codigo == 'Cobertura') ? this.wp.variables.find( v => v.codigo == 'Cobertura').valor : 'No aplica');
    }
    this.valorComercial.setValue( totalValorComercial );
    this.valorAvaluo.setValue( totalValorAvaluo );
  }
  private busquedaNegociacion(){
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        
        this.excepcionOperativaService.traerCreditoNegociacionByExcepcionOperativa(data.params.id).subscribe( (data: any)=>{
          if(data){
            this.wp = data;
            this.excepcion = this.wp.excepcionOperativa;
            this.formDisable.disable();
            this.procesoService.getCabecera(this.wp.credito.tbQoNegociacion.id,this.wp.proceso.proceso).subscribe(datosCabecera=>{
              this.layoutService.setDatosContrato(datosCabecera);
            });
            this.sof.consultarAgenciasCS().subscribe(data=>{
              const catalogoAgencia = data.catalogo;
              if(catalogoAgencia){

                this.codigoAgencia = catalogoAgencia.find(p=>p.id==this.wp.credito.idAgencia );
                
                if(this.codigoAgencia){
                  this.calcularOpciones();
                }else{
                  console.log("error al asignar codigo de la agencia");
                }
              }
            });
            this.cargarCampos(this.wp);
          }else{
            this.sinNoticeService.setNotice('ERROR CARGANDO NEGOCIACION','error');
          }
        });
      }
    }, () =>{this.loadingSubject.next(false)});
  }
  public regresar(){
    this.router.navigate(['negociacion/excepcion-operativa/list']);
  }
  private cargarCampos( wp: NegociacionWrapper){
    this.sinNoticeService.setNotice('OPERACION CARGADA CORRECTAMENTE','success')
    this.subheaderService.setTitle('Operacion: '+this.wp.credito.codigo);



    this.cliente.setValue( wp.credito.tbQoNegociacion.tbQoCliente.nombreCompleto );
    this.cedula.setValue( wp.credito.tbQoNegociacion.tbQoCliente.cedulaCliente );
    this.fechaCreacion.setValue( wp.credito.tbQoNegociacion.fechaCreacion );
    this.proceso.setValue( wp.proceso.proceso );
    if (wp.telefonos) {
      this.dataSourceTelefonosCliente = new MatTableDataSource<any>(wp.telefonos);
    }
    this.email.setValue( wp.credito.tbQoNegociacion.tbQoCliente.email );
    this.aprobadoWebMupi.setValue(wp.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi == 'S'? 'Si' : 'No');
    this.observacionAsesor.disable();
    //this.calcularOpciones();
    this.camposAdicinales( );
    this.observacion = this.excepcion.observacionAsesor;
    this.observacionAsesor.setValue( this.excepcion.observacionAsesor );
    this.valorDescuentoServicios.setValue(this.excepcion.montoInvolucrado);
    //this.usuarioAsesor.setValue( this.excepcion.idAsesor);
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
      this.cal.simularOfertaExcepcion(this.wp.credito.id, null, null,this.codigoAgencia.codigo,this.wp.credito.numeroOperacionAnterior).subscribe((data: any) => {
        this.loadingSubject.next(false);
        console.log("info", data.entidad)
        if (data.entidad.simularResult && data.entidad.simularResult.xmlOpcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion) {
            if(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion[0]){
              this.montoActual.setValue(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion[0].montoFinanciado);
            
            }
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
  aprobarExcepcion(aprueba){
    if(this.observacionAprobador.invalid){
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL LOS CAMPOS OBLIGATORIOS','warning');
      return;
    }
    let mensaje = aprueba == 'APROBADO' ? 'Aprobar la excepcion : ' + this.wp.credito.codigo+'?' :
    'Negar la excepcion : ' + this.wp.credito.codigo+'?'; 
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        this.excepcion.estadoExcepcion = aprueba;
        this.excepcion.observacionAprobador = this.observacionAprobador.value;
        this.excepcionOperativaService.resolverExcepcion(this.excepcion, this.wp.proceso.proceso).subscribe(p=>{
          if(aprueba=='APROBADO'){
            this.sinNoticeService.setNotice('EXCEPCION  APROBADA','success');
          }else{
           this.sinNoticeService.setNotice('EXCEPCION  NEGADA','success');
          }
        });
        //this.exc.aprobarExcepcion(this.excepcion.id,this.observacionAprobador.value,aprueba).subscribe(()=>{
          
          this.router.navigate(['negociacion/excepcion-operativa/list']);
        //})
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
    //this.negoW.variables = variablesBase;
    //console.log("Las variables de bre =>", variablesBase);
    this.sinNotSer.setNotice("LAS VARIABLES CREDITICIAS FUERON ACTUALIZADAS", 'success');
    this.componenteVariable = true;
    this.loadVariables.next(false);
  }
}