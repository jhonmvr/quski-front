import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { CalculadoraService } from '../../../../../core/services/quski/calculadora.service';
import { NegociacionWrapper } from '../../../../../core/model/wrapper/NegociacionWrapper';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { ValidateDecimal } from '../../../../../core/util/validator.decimal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import 'hammerjs';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ProcesoService } from '../../../../../../app/core/services/quski/proceso.service';
import { LayoutConfigService } from '../../../../../../app/core/_base/layout';


@Component({
  selector: 'kt-excepciones-cobertura',
  templateUrl: './excepciones-cobertura.component.html',
  styleUrls: ['./excepciones-cobertura.component.scss']
})
export class ExcepcionesCoberturaComponent  extends TrackingUtil implements OnInit {
  public observacion: string;
  public excepcion: TbQoExcepcion;
  public usuario;
  public agencia;
  public simulado: boolean;
  codigoAgencia
  dataSourceTelefonosCliente = new MatTableDataSource<any>();

  public wp: NegociacionWrapper = null;
  public formDisable: FormGroup = new FormGroup({});
  public cliente = new FormControl('', []);
  public cedula  = new FormControl('', []);
  public fechaCreacion = new FormControl('', []);
  public proceso = new FormControl('', []);
  public email = new FormControl('', []);
  dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>();
  displayedColumnsCreditoNegociacion = ['plazo','periodicidadPlazo', 'montoFinanciado', 'valorARecibir', 'valorAPagar',
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
  public usuarioAsesor = new FormControl('', []);

  public coberturaActual = new FormControl('', []);
  public montoActual = new FormControl('', [ValidateDecimal]);
  public valorComercial = new FormControl('', [ValidateDecimal]);
  public valorAvaluo = new FormControl('', [ValidateDecimal]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private dialog: MatDialog,
    private cre: CreditoNegociacionService,
    private exc: ExcepcionService,
    private par: ParametroService,
    private sof: SoftbankService,
    private cal: CalculadoraService,
    private procesoService: ProcesoService,
    private layouteService: LayoutConfigService,
    public tra: TrackingService,
  ) {
    super(tra);
    this.cre.setParameter();
    this.exc.setParameter();
    this.cal.setParameter();
    this.procesoService.setParameter();
    this.formDisable.addControl('cliente', this.cliente);
    this.formDisable.addControl('cedula', this.cedula);
    this.formDisable.addControl('fechaCreacion', this.fechaCreacion);
    this.formDisable.addControl('proceso', this.proceso);
    this.formDisable.addControl('email', this.email);
    this.formDisable.addControl('observacionAsesor', this.observacionAsesor);
    this.formDisable.addControl('usuarioAsesor', this.usuarioAsesor);
    this.formDatosExcepcion.addControl('observacionAprobador', this.observacionAprobador);
    this.formDatosExcepcion.addControl('cobertura', this.cobertura);
  }

  ngOnInit() {
    this.cre.setParameter();
    this.exc.setParameter();
    this.cal.setParameter();
    this.procesoService.setParameter();
    this.wp = null;
    this.busquedaNegociacion();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    console.log('El aprobador? =====>',this.usuario);
    this.agencia = localStorage.getItem( 'idAgencia' );
  }
  private camposAdicinales(wp: NegociacionWrapper){
    let totalValorAvaluo: number = 0;
    let totalValorComercial: number = 0;
    !this.wp.joyas ? null : this.wp.joyas.forEach(e=>{
      totalValorAvaluo += e.valorAvaluo;
      totalValorComercial += e.valorComercial;
    }); 
    this.coberturaActual.setValue( this.wp.variables.find( v => v.codigo == 'Cobertura') ? this.wp.variables.find( v => v.codigo == 'Cobertura').valor : 'No aplica');
    this.valorComercial.setValue( totalValorComercial.toFixed(2) );
    this.valorAvaluo.setValue( totalValorAvaluo.toFixed(2) );
    this.montoActual.disable();
    this.coberturaActual.disable();
    this.valorComercial.disable();
    this.valorAvaluo.disable();
  }
  private busquedaNegociacion(){
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        let excepcionRol = JSON.parse(atob(data.params.id));
        this.procesoService.getCabecera(excepcionRol.idNegociacion,'NUEVO').subscribe(datosCabecera=>{
          this.layouteService.setDatosContrato(datosCabecera);
        });
        this.cre.traerCreditoNegociacion(excepcionRol.idNegociacion).subscribe( (data: any)=>{
          if(data.entidad){
            this.wp = data.entidad;
            if(this.wp.credito && this.wp.excepciones && this.wp.excepciones.find(e => e.id == excepcionRol.id ) && this.wp.proceso.estadoProceso == 'PENDIENTE_EXCEPCION' ){
              this.excepcion = this.wp.excepciones.find(e => e.id == excepcionRol.id );
              this.sof.consultarAgenciasCS().subscribe(data=>{
                const catalogoAgencia = data.catalogo;
                if(catalogoAgencia){

                  this.codigoAgencia = catalogoAgencia.find(p=>p.id==this.wp.credito.idAgencia );
                  if(this.codigoAgencia){
                    this.codigoAgencia
                  }else{
                    console.log("error al asignar codigo de la agencia");
                  }
                }
              })
              this.cargarCampos(this.wp) 
            }else{
              this.sinNoticeService.setNotice('ERROR CARGANDO EXCEPCION','error');            
            }
          }else{
            this.sinNoticeService.setNotice('ERROR CARGANDO NEGOCIACION','error');
          }
        });
      }
    });
  }
  public regresar(){
    this.router.navigate(['aprobador/bandeja-excepciones']);
  }
  private cargarCampos( wp: NegociacionWrapper){
    this.sinNoticeService.setNotice('OPERACION CARGADA CORRECTAMENTE','success')
    this.formDisable.disable();
    this.subheaderService.setTitle('Operacion: '+wp.credito.codigo);

    this.guardarTraking(wp ? wp.proceso ? wp.proceso.proceso : null : null,
      wp ? wp.credito ? wp.credito.codigo : null : null, 
      ['Información Operación','Datos Contacto Cliente','Variables crediticias','Riesgo Acumulado','Tasacion','Opciones de Crédito','Excepción'], 
      0, 'EXCEPCION COBERTURA', wp ? wp.credito ? wp.credito.numeroOperacion : null : null )

    this.cliente.setValue( wp.credito.tbQoNegociacion.tbQoCliente.nombreCompleto );
    this.cedula.setValue( wp.credito.tbQoNegociacion.tbQoCliente.cedulaCliente );
    this.fechaCreacion.setValue( wp.credito.tbQoNegociacion.fechaCreacion );
    this.proceso.setValue( wp.proceso.proceso );
    if (wp.telefonos) {
      this.dataSourceTelefonosCliente = new MatTableDataSource<any>(wp.telefonos);
    }
    this.email.setValue( wp.credito.tbQoNegociacion.tbQoCliente.email );
    this.calcularOpciones();
    this.camposAdicinales( wp );
    this.observacionAsesor.setValue( this.excepcion.observacionAsesor );
    this.usuarioAsesor.setValue( this.excepcion.idAsesor );
  }
  public simular(){ 
    this.par.findByNombre('COBERTURA_MINIMA').subscribe( (data: any) =>{
      if(data.entidad){
        if(!this.cobertura.valid || this.cobertura.value < Number(data.entidad.valor) ){
          this.sinNoticeService.setNotice('VALOR DE COBERTURA INVALIDO. ESCOJA UN PORCENTAJE MAYOR A: '+ data.entidad.valor, 'warning');
          return;
        }
        if(this.observacionAprobador.valid){
          this.wp.proceso.proceso == "RENOVACION" ? 
          this.cal.simularOfertaExcepcionadaRenovacion(this.wp.credito.id, this.cobertura.value,this.codigoAgencia.codigo).subscribe( (data: any) =>{
            !data.entidades ? this.sinNoticeService.setNotice('NO TRAJE OPCIONES','error'): this.dataSourceCobertura.data = data.entidades;
            this.simulado = data.entidades ? true : false;
          }): this.cal.simularOfertaExcepcionada(this.wp.credito.id, this.cobertura.value, this.agencia).subscribe( (data: any) =>{
            !data.entidades ? this.sinNoticeService.setNotice('NO TRAJE OPCIONES','error'): this.dataSourceCobertura.data = data.entidades;
            this.simulado = data.entidades ? true : false;
            });
        }else{
          this.sinNoticeService.setNotice('INGRESE UNA OBSERVACION PARA SIMULAR.','warning');
        }
      }else{
        this.sinNoticeService.setNotice('ERROR CARGANDO PARAMETRO DE COBERTURA MINIMA','error');

      }
    });
    
  }
  public calcularOpciones() {
    if (this.wp && this.wp.joyas && this.wp.joyas.length > 0) {
      this.cal.simularOfertaExcepcion(this.wp.credito.id, null, null,this.codigoAgencia.codigo).subscribe((data: any) => {
        if (data.entidad.simularResult && data.entidad.simularResult.xmlOpcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion 
          && data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion) {
            this.montoActual.setValue(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion[0].montoFinanciado.toFixed(2));
            this.dataSourceCreditoNegociacion = new MatTableDataSource<any>(data.entidad.simularResult.xmlOpcionesRenovacion.opcionesRenovacion.opcion);
        }
        if(data.entidad && data.entidad.simularResult && data.entidad.simularResult.xmlVariablesInternas  && data.entidad.simularResult.xmlVariablesInternas.variablesInternas && data.entidad.simularResult.xmlVariablesInternas.variablesInternas.variable ){
          this.wp.variables = data.entidad.simularResult.xmlVariablesInternas.variablesInternas && data.entidad.simularResult.xmlVariablesInternas.variablesInternas.variable;
          //console.log("estas son las variabes", this.variablesInternas)
        }
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
      //console.log('ME FUI A NEGAR')
      this.simulado = false;
      let mensaje = 'Negar la excepcion de cobertura para: ' + this.wp.credito.codigo+'?'; 
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.exc.negarExcepcion(this.excepcion.id, this.observacionAprobador.value, this.usuario, this.wp.proceso.proceso).subscribe( (data: any) =>{
            if(data.entidad){ 
              this.sinNoticeService.setNotice('EXCEPCION DE COBERTURA NEGADA','success');
              this.router.navigate(['aprobador/bandeja-excepciones']);  
            } else{ 
              this.sinNoticeService.setNotice('Error al negar la excepcion','error')
            }
          });
        }
      });
    }else{ this.sinNoticeService.setNotice('COMPLETE EL CAMPO DE OBSERVACION','error') }
  }
  public aprobar(){ 
    if(this.observacionAprobador.valid && this.cobertura.valid){
      //console.log('ME FUI A APROBAR')
      let mensaje = 'Aprobar la excepcion de cobertura para: ' + this.wp.credito.codigo+'?'; 
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          this.exc.aprobarCobertura(this.excepcion.id, this.observacionAprobador.value, this.usuario, this.cobertura.value, this.wp.proceso.proceso).subscribe( (data: any) =>{
            if(data.entidad){ 
              this.sinNoticeService.setNotice('EXCEPCION DE COBERTURA APROBADA','success');
              this.router.navigate(['aprobador/bandeja-excepciones']);  
            } else{ 
              this.sinNoticeService.setNotice('Error  al aprobar la excepcion','error')
            }
          });
        }
      });
    }else{ this.sinNoticeService.setNotice('COMPLETE EL CAMPO DE OBSERVACION','error') }
  }
}
