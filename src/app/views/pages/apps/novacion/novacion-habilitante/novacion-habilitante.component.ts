
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { PopupPagoComponent } from '../../../../partials/custom/popups/popup-pago/popup-pago.component';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../environments/environment.prod';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';

@Component({
  selector: 'kt-novacion-habilitante',
  templateUrl: './novacion-habilitante.component.html',
  styleUrls: ['./novacion-habilitante.component.scss']
})
export class NovacionHabilitanteComponent implements OnInit {
  public loading;
  public usuario: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper', { static: true }) myStepper: MatStepper;
  public formOperacion: FormGroup = new FormGroup({});
  public tipoDeCuenta = new FormControl('', [Validators.required]);
  public numeroCuenta = new FormControl('', [Validators.required]);
  public firmaRegularizada = new FormControl('', [Validators.required]);
  public diaFijoPago = new FormControl('', [Validators.required]);
  public firmadaOperacion = new FormControl('', [Validators.required]);
  public firmanteCuenta = new FormControl('', [Validators.required]);
  public tipoCliente = new FormControl('', [Validators.required]);
  public identificacionApoderado = new FormControl('', [Validators.required]);
  public nombreApoderado = new FormControl('', [Validators.required]);
  public fechaNacimientoApoderado = new FormControl('', [Validators.required]);
  public identificacionCodeudor = new FormControl('', [Validators.required]);
  public nombreCodeudor = new FormControl('', [Validators.required]);
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['accion', 'intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','subirComprobante','descargarComprobante'];

  public catCuenta;
  public catfirma = ['SI','NO'];
  public catfirmadaOperacion=['Algo?'];
  public catFirmanteOperacion;
  public catTipoCliente;
  idNegociacion: any;
  credit: any;

  
  

  constructor(
    private cre: CreditoNegociacionService,
    private route: ActivatedRoute,
    private router: Router,
    private sof: SoftbankService,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private subheaderService: SubheaderService
  ) { 
    this.formOperacion.addControl("tipoDeCuenta", this.tipoDeCuenta);
    this.formOperacion.addControl("numeroCuenta", this.numeroCuenta);
    this.formOperacion.addControl("firmaRegularizada", this.firmaRegularizada);
    this.formOperacion.addControl("firmadaOperacion", this.firmadaOperacion);
    this.formOperacion.addControl("firmanteCuenta", this.firmanteCuenta);
    this.formOperacion.addControl("tipoCliente", this.tipoCliente);

  }

  ngOnInit() {
    this.cargarCatalogos();
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.inicioDeFlujo();
  }
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.idNegociacion) {
        this.loadingSubject.next(true);
        this.idNegociacion = json.params.idNegociacion;
        this.loadingSubject.next(true);
        this.cre.buscarRenovacionByIdNegociacion(json.params.idNegociacion).subscribe((data: any) => {
          this.credit = data.entidad;
          if (this.credit ) {
            this.cargarCampos( this.credit  );
          }else{
            this.abrirSalirGestion("Error al intentar cargar el credito.");
          }
        });
      } 
    });
  }
  private cargarCampos(wr) {
    console.log('Data para cargar: ', wr);
    this.subheaderService.setTitle('Codigo Bpm: '+ wr.credito.codigo );
    if(wr.credito.periodoPlazo == 'C'){ this.formOperacion.addControl("diaFijoPago", this.diaFijoPago); }
    this.tipoCliente.setValue (this.catTipoCliente.find(x => x.codigo == 'DEU') );
    this.tipoDeCuenta.setValue( this.catCuenta.find(x => x.id == wr.cuentas[0].banco));
    this.tipoDeCuenta.disable();
    this.numeroCuenta.setValue( wr.cuentas[0].cuenta );
    this.numeroCuenta.disable();
    this.firmanteCuenta.setValue( this.catFirmanteOperacion[0] )
    this.firmanteCuenta.disable();
    this.sinNotSer.setNotice("SE HA CARGADO EL CREDITO: " + wr.credito.codigo + ".", "success");
    this.loadingSubject.next(false);
  }
  public regresar(){
    this.router.navigate(['negociacion/bandeja-operaciones']);
  }
  public agregarComprobante(){
    const dialogRef = this.dialog.open(PopupPagoComponent, {
      width: "800px",
      height: "auto",
      data: null
    });
  }
  public solicitarAprobacion(){}
  public eliminarComprobante(row){}
  public subirComprobante(row){}
  public descargarComprobante(row){}
  /** @FUNCIONALIDAD */
  private cargarCatalogos(){
    this.sof.consultarFirmanteOperacionCS().subscribe( data =>{
      this.catFirmanteOperacion = data.catalogo ? data.catalogo : ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarBancosCS().subscribe( data =>{
      this.catCuenta = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarTipoClienteCS().subscribe( data =>{
      this.catTipoCliente = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
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
      this.router.navigate(['negociacion/bandeja-operaciones']);
    });
  }
  public limpiarGarantes(){
    this.formOperacion.removeControl('nombreApoderado');
      this.nombreApoderado.reset();
      this.nombreApoderado.setErrors(null);
      this.nombreApoderado.setValue(null);
    this.formOperacion.removeControl('fechaNacimientoApoderado');
      this.fechaNacimientoApoderado.reset();
      this.fechaNacimientoApoderado.setErrors(null);
      this.fechaNacimientoApoderado.setValue(null);
    this.formOperacion.removeControl('identificacionApoderado');
      this.identificacionApoderado.reset();
      this.identificacionApoderado.setErrors(null);
      this.identificacionApoderado.setValue(null);
    this.formOperacion.removeControl('identificacionCodeudor');
      this.identificacionCodeudor.reset();
      this.identificacionCodeudor.setErrors(null);
      this.identificacionCodeudor.setValue(null);
    this.formOperacion.removeControl('nombreCodeudor');
      this.nombreCodeudor.reset();
      this.nombreCodeudor.setErrors(null);
      this.nombreCodeudor.setValue(null);
  }
  public cambiarCliente(){
    this.limpiarGarantes();
    console.log('Tipo de cliente solicitado ->', this.tipoCliente.value);
    if(this.tipoCliente.value && (this.tipoCliente.value.codigo == 'SAP' || this.tipoCliente.value.codigo == 'CYA')){
      this.formOperacion.addControl("nombreApoderado", this.nombreApoderado);
      this.formOperacion.addControl("fechaNacimientoApoderado", this.fechaNacimientoApoderado);
      this.formOperacion.addControl("identificacionApoderado", this.identificacionApoderado);
    }
    if(this.tipoCliente.value && (this.tipoCliente.value.codigo == 'SCD' || this.tipoCliente.value.codigo == 'CYA')){
      this.formOperacion.addControl("identificacionCodeudor", this.identificacionCodeudor);
      this.formOperacion.addControl("nombreCodeudor", this.nombreCodeudor);
    }
  }
}
