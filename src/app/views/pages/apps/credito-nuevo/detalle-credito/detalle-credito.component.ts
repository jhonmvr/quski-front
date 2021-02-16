import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-detalle-credito',
  templateUrl: './detalle-credito.component.html',
  styleUrls: ['./detalle-credito.component.scss']
})
export class DetalleCreditoComponent implements OnInit {

  public  loading;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public  wrapper: any; 

  public formInformacion: FormGroup = new FormGroup({});
  public nombre = new FormControl();
  public cedula = new FormControl();
  public email = new FormControl();
  public telefonoMovil = new FormControl();
  public telefonoCasa = new FormControl();
  public numeroOperacion = new FormControl();
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
  public diasMora = new FormControl();
  public estadoUbicacion = new FormControl();
  public estadoProceso = new FormControl();
  public descripcionBloqueo = new FormControl();
  public esMigrado = new FormControl();
  public numeroCuotas = new FormControl();

  public displayedColumnsRubro = ['rubro','numeroCuota', 'proyectado', 'calculado', 'estado'];
  public dataSourceRubro = new MatTableDataSource<any>();

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
    this.formInformacion.addControl("numeroOperacion", this.numeroOperacion);
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
      if(e.codigoTipoTelefono == "CEL" && e.activo){
        this.telefonoMovil.setValue( e.numero );
      }
      if(e.codigoTipoTelefono == "DOM" && e.activo){
        this.telefonoCasa.setValue( e.numero );
      }
    });
    this.telefonoMovil.setValue( this.telefonoMovil.value ? this.telefonoMovil.value : 'No aplica');
    this.telefonoCasa.setValue( this.telefonoCasa.value ? this.telefonoCasa.value : 'No aplica');
    this.numeroOperacion.setValue( this.wrapper.credito.numeroOperacion );
    this.fechaAprobacion.setValue( this.wrapper.credito.fechaAprobacion );
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
  regresar(){
    this.router.navigate(['credito-nuevo/']);
  }
}
