
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { PopupPagoComponent } from '../../../../partials/custom/popups/popup-pago/popup-pago.component';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../environments/environment.prod';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
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
  public tipoDeCuenta = new FormControl();
  public numeroCuenta = new FormControl();
  public firmaRegularizada = new FormControl();
  public diaFijoPago = new FormControl();
  public firmadaOperacion = new FormControl();
  public firmanteCuenta = new FormControl();
  public tipoCliente = new FormControl();
  public identificacionApoderado = new FormControl();
  public nombreApoderado = new FormControl();
  public fechaNacimientoApoderado = new FormControl();
  public identificacionCodeudor = new FormControl();
  public nombreCodeudor = new FormControl();
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['accion', 'intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','subirComprobante','descargarComprobante'];

  public catCuenta:[];
  public firmaCat = ['SI','NO'];
  public firmadaOperacionCat:[];
  public firmanteCuentaCat:[];
  public tipoClienteCat;
  numeroOperacion: any;
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
    this.formOperacion.addControl("diaFijoPago", this.diaFijoPago);
    this.formOperacion.addControl("firmadaOperacion", this.firmadaOperacion);
    this.formOperacion.addControl("firmanteCuenta", this.firmanteCuenta);
    this.formOperacion.addControl("tipoCliente", this.tipoCliente);
    this.formOperacion.addControl("nombreApoderado", this.nombreApoderado);
    this.formOperacion.addControl("fechaNacimientoApoderado", this.fechaNacimientoApoderado);
    this.formOperacion.addControl("identificacionCodeudor", this.identificacionCodeudor);
    this.formOperacion.addControl("nombreCodeudor", this.nombreCodeudor);
    this.formOperacion.addControl("identificacionApoderado", this.identificacionApoderado);
  }

  ngOnInit() {
    this.cargarCatalogos();
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.inicioDeFlujo();
  }
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.numeroOperacion) {
        this.loadingSubject.next(true);
        this.numeroOperacion = json.params.numeroOperacion;
        this.loadingSubject.next(true);
        this.cre.buscarRenovacionByNumeroOperacionMadre(json.params.numeroOperacion).subscribe((data: any) => {
          this.credit = data.entidad;
          console.log("datos ->", this.credit);
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
    this.subheaderService.setTitle('Codigo Bpm: '+ wr.credito.codigo );
    this.tipoCliente.setValue (this.tipoClienteCat.find(x => x.codigo == 'DEU') );
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
  public solicitarExcepcion(){}
  public solicitarAprobacion(){}
  public eliminarComprobante(row){}
  public subirComprobante(row){}
  public descargarComprobante(row){}
  /** @FUNCIONALIDAD */
  private cargarCatalogos(){
    this.sof.consultarFirmanteOperacionCS().subscribe( data =>{
      this.firmanteCuentaCat = data.catalogo ? data.catalogo : ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarBancosCS().subscribe( data =>{
      this.catCuenta = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
    });
    this.sof.consultarTipoClienteCS().subscribe( data =>{
      this.tipoClienteCat = data.catalogo ? data.catalogo :  ['No se cargo el catalogo. Error'];
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
}
