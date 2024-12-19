import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutConfigService, SubheaderService } from '../../../../../../../app/core/_base/layout';
import { TbQoCreditoNegociacion } from '../../../../../../../app/core/model/quski/TbQoCreditoNegociacion';
import { DetalleNegociacionWrapper } from '../../../../../../../app/core/model/wrapper/DetalleNegociacionWrapper';
import { CreditoNegociacionService } from '../../../../../../../app/core/services/quski/credito.negociacion.service';
import { ParametroService } from '../../../../../../../app/core/services/quski/parametro.service';
import { ProcesoService } from '../../../../../../../app/core/services/quski/proceso.service';
import { SoftbankService } from '../../../../../../../app/core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../../../app/core/services/re-notice.service';
import { ErrorCargaInicialComponent } from '../../../../../../../app/views/partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { RegularizacionDocumentosService } from '../../../../../../../app/core/services/quski/regularizacion-documentos.service';

import { ConfirmarAccionComponent } from '../../../../../../../app/views/partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { TbQoRegularizacionDocumento } from '../../../../../../../app/core/model/quski/TbQoRegularizacionDocumento';
import { TrackingUtil } from '../../../../../../../app/core/util/TrakingUtil';
import { TrackingService } from '../../../../../../../app/core/services/quski/tracking.service';

@Component({
  selector: 'kt-aprodador-regularizacion-documentos',
  templateUrl: './aprodador-regularizacion-documentos.component.html',
  styleUrls: ['./aprodador-regularizacion-documentos.component.scss']
})
export class AprodadorRegularizacionDocumentosComponent extends TrackingUtil implements OnInit {

  parametrosHabilitante = [];
  varHabilitante = {proceso:'CLIENTE',referencia:''};
  dataHistoricoOperativa;
  dataHistoricoObservacion;
  referencia;
  titulo;
  operacionMadre;
  public detalle: DetalleNegociacionWrapper;
  public catPais: Array<any>;
  public formDisable: FormGroup = new FormGroup({});
  public nombre = new FormControl('',[])
  public cedula = new FormControl('',[])
  public fechaNacimiento = new FormControl('',[])
  public edad = new FormControl('',[])
  public nacionalidad = new FormControl('',[])
  public telefonoMovil = new FormControl('',[])
  public telefonoDomicilio = new FormControl('',[])
  public publicidad = new FormControl('',[])
  public correo = new FormControl('',[])
  public campania = new FormControl('',[])
  public aprobadoMupi = new FormControl('',[])
  dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>();
  displayedColumnsCreditoNegociacion = ['plazo','periodicidadPlazo','tipooferta','montoFinanciado','valorARecibir','cuota','totalGastosNuevaOperacion','costoCustodia', 'costoTransporte','costoTasacion','costoSeguro','costoFideicomiso','impuestoSolca'];
  renovacion = ['plazo', 'periodicidadPlazo', 'montoFinanciado', 'cuota', 'valorARecibir', 'valorAPagar',
  'totalCostosOperacionAnterior','totalGastosNuevaOperacion', 'costoCustodia', 'costoTasacion', 'costoFideicomiso', 'costoSeguro', 'impuestoSolca',
  'saldoCapitalRenov', 'saldoInteres','abonoCapital', 'saldoMora', 'gastoCobranza', 'custodiaDevengada', 'porcentajeflujoplaneado','formaPagoCustodia','formaPagoTasador', 
  'formaPagoFideicomiso', 'formaPagoSeguro',  'formaPagoImpuestoSolca', 'formaPagoGastoCobranza','formaPagoAbonoCapital'];
  constructor(
    private route: ActivatedRoute,
    private cre: CreditoNegociacionService,
    private regularizacionDocumentosService: RegularizacionDocumentosService,
    private sinNotSer: ReNoticeService,
    private par: ParametroService,
    private sof: SoftbankService,
    private procesoService: ProcesoService,
    private layoutService: LayoutConfigService,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    private router: Router,
    public tra: TrackingService

  ) {
    super(tra);
    this.par.setParameter();
    this.cre.setParameter();
    this.sof.setParameter();
    this.formDisable.addControl('nombre', this.nombre);
    this.formDisable.addControl('cedula', this.cedula);
    this.formDisable.addControl('fechaNacimiento', this.fechaNacimiento);
    this.formDisable.addControl('edad', this.edad);
    this.formDisable.addControl('nacionalidad', this.nacionalidad);
    this.formDisable.addControl('telefonoMovil', this.telefonoMovil);
    this.formDisable.addControl('telefonoDomicilio', this.telefonoDomicilio);
    this.formDisable.addControl('publicidad', this.publicidad);
    this.formDisable.addControl('correo', this.correo);
    this.formDisable.addControl('campania', this.campania);
    this.formDisable.addControl('aprobadoMupi', this.aprobadoMupi);
  }

  ngOnInit() {
    this.par.setParameter();
    this.cre.setParameter();    
    this.sof.setParameter();
    this.formDisable.disable();
    this.subheaderService.setTitle('GESTION CREDITO');
    this.traerCatalogos();
  }
  private traerCreditoNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        
        
        
        this.regularizacionDocumentosService.traerCreditoNegociacionByRegularizacion(data.params.id).subscribe((data: any) => {
          
            this.detalle = data;
            this.referencia = this.detalle.credito.tbQoNegociacion.id;
            this.procesoService.getCabecera(this.detalle.credito.tbQoNegociacion.id,this.detalle.proceso.proceso).subscribe(datosCabecera=>{
              this.layoutService.setDatosContrato(datosCabecera);
            });
            if(this.detalle.credito.numeroOperacionAnterior){
              this.displayedColumnsCreditoNegociacion = this.renovacion;
            }
            this.cre.findHistoricoOperativaByidNegociacion(this.detalle.credito.id).subscribe((data: any) => {
              this.dataHistoricoOperativa = data.entidades;
            });
            this.cre.findHistoricoObservacionByIdCredito(this.detalle.credito.id).subscribe(result=>{
              this.dataHistoricoObservacion = result.entidades;
            });
            this.setearValores( this.detalle );
         
        });
      } else {
        this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO', 'error');
      }
    });
  }

  private traerCatalogos() {
    this.sof.consultarPaisCS().subscribe((data: any) => {
      this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
      this.traerCreditoNegociacion();
    });
  }
  private setearValores(ap: DetalleNegociacionWrapper) {
    this.guardarTraking(ap ? ap.proceso ? ap.proceso.proceso : null : null,
      ap ? ap.credito ? ap.credito.codigo : null : null, 
      ['Información Del Cliente','Variables crediticias','Riesgo Acumulado','Tasacion','Opciones de Crédito','Habilitantes','Observaciones'], 
      0, 'REGULARIZACION DOCUMENTOS', ap ? ap.credito ? ap.credito.numeroOperacion : null : null );

    this.titulo = ap.credito.codigo;
    this.nombre.setValue( ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto );
    this.cedula.setValue( ap.credito.tbQoNegociacion.tbQoCliente.cedulaCliente );
    this.fechaNacimiento.setValue( ap.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento );
    this.edad.setValue( ap.credito.tbQoNegociacion.tbQoCliente.edad );
    this.nacionalidad.setValue(this.cargarItem(this.catPais,  ap.credito.tbQoNegociacion.tbQoCliente.nacionalidad).nacionalidad );
    this.publicidad.setValue( ap.credito.tbQoNegociacion.tbQoCliente.publicidad );
    this.correo.setValue( ap.credito.tbQoNegociacion.tbQoCliente.email );
    this.campania.setValue( ap.credito.tbQoNegociacion.tbQoCliente.campania );
    this.aprobadoMupi.setValue( ap.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi == 'S' ? 'Si' : 'No' );
    this.operacionMadre = ap.credito.numeroOperacionMadre;
    !ap.telefonos ? null : ap.telefonos.forEach( e=>{
      if( e.tipoTelefono == 'CEL'){
        this.telefonoMovil.setValue( e.numero );
      }
      if(e.tipoTelefono == 'DOM'){
        this.telefonoDomicilio.setValue( e.numero );
      }
    }); 
    this.dataSourceCreditoNegociacion.data.push( ap.credito? ap.credito : null );
    this.varHabilitante.referencia= this.referencia;
    if(ap.proceso.proceso == 'NUEVO'){
      this.varHabilitante.proceso='NUEVO,FUNDA';
    }else{
      this.varHabilitante.proceso='NOVACION';
    }
    this.parametrosHabilitante = [
      { procesos: {proceso:'CLIENTE'}, estados: 'DETALLE', idReferencia: this.cedula.value },
      { procesos: { proceso: 'NUEVO' }, estados: 'DETALLE', idReferencia: this.referencia },
      { procesos: { proceso: 'RENOVACION' }, estados: 'DETALLE', idReferencia: this.referencia },
    ];
    this.sinNotSer.setNotice('DETALLE DE CREDITO EN PROCESO CARGADO', 'success');
  }
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  private cargarItem(catalogo, id) {
    if(catalogo){
      let item = catalogo.find(x => x.id == id);
      if (catalogo && item) {
        return item;
      }
    }
  }
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
        this.router.navigate(['negociacion/']);
      });
  }
  regresar(){
    this.router.navigate(['negociacion/']);
  }

  enviarRespuesta(respuesta){

    


    const dialogRefGuardar = this.dialog.open(ConfirmarAccionComponent, {
      width: '800px',
      height: 'auto',
      data: 'Solicitar aprobacion documentos'
    });
    dialogRefGuardar.afterClosed().subscribe((result: any) => {
      if (result) {
        this.detalle.tbQoRegularizacionDocumento
        let regularizacion : TbQoRegularizacionDocumento = this.detalle.tbQoRegularizacionDocumento;
        regularizacion.usuarioAprobador = localStorage.getItem('reUser');
        regularizacion.estadoRegularizacion = respuesta;

        this.regularizacionDocumentosService.enviarRespuesta(regularizacion).subscribe(p=>{
          this.router.navigate(['negociacion/regularizacion-documentos/list']);    
        })
      }
    })

  }
}
