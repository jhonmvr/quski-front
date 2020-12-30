
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
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['accion', 'intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','subirComprobante','descargarComprobante'];

  public catCuenta:[];
  public firmaCat = ['SI','NO'];
  public firmadaOperacionCat:[];
  public firmanteCuentaCat:[];
  public tipoClienteCat:[];
  
  

  constructor(
    private cre: CreditoNegociacionService,
    private route: ActivatedRoute,
    private router: Router,
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
  }

  ngOnInit() {
    this.subheaderService.setTitle('Negociación');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.inicioDeFlujo();
  }
  private inicioDeFlujo() {
    this.route.paramMap.subscribe((json: any) => {
      if (json.params.numeroOperacion) {
        this.loadingSubject.next(true);
        // Agregar busqueda el credito;
      } 
    });
  }

  public regresar(){}
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
}
