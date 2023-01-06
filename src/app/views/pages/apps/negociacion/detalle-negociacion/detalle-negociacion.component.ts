import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DetalleNegociacionWrapper } from '../../../../../core/model/wrapper/DetalleNegociacionWrapper';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { LayoutConfigService, SubheaderService } from '../../../../../core/_base/layout';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';

@Component({
  selector: 'kt-detalle-negociacion',
  templateUrl: './detalle-negociacion.component.html',
  styleUrls: ['./detalle-negociacion.component.scss']
})
export class DetalleNegociacionComponent implements OnInit {
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
    private sinNotSer: ReNoticeService,
    private par: ParametroService,
    private sof: SoftbankService,
    private procesoService: ProcesoService,
    private layoutService: LayoutConfigService,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    private router: Router
  ) {
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
        this.referencia = data.params.id
        this.procesoService.getCabecera(data.params.id,'RENOVACION').subscribe(datosCabecera=>{
          this.layoutService.setDatosContrato(datosCabecera);
        });
        this.cre.findHistoricoOperativaByidNegociacion(this.referencia).subscribe((data: any) => {
          this.dataHistoricoOperativa = data.entidades;
        });
        this.cre.findHistoricoObservacionByIdCredito(this.referencia).subscribe(result=>{
          this.dataHistoricoObservacion = result.entidades;
        });
        this.cre.traerCreditoNegociacion(data.params.id).subscribe((data: any) => {
          if (!data.entidad.existeError) {
            this.detalle = data.entidad;
            if(this.detalle.credito.numeroOperacionAnterior){
              this.displayedColumnsCreditoNegociacion = this.renovacion;
            }
            this.setearValores( this.detalle );
          }else{
            this.salirDeGestion("Error al intentar cargar el credito: "+ data.entidad.mensaje);
          }
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
    this.titulo = 'DETALLE DEL PROCESO: ' + ap.credito.codigo;
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
}
