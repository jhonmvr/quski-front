import { ConfirmarAccionComponent } from '../../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { PopupPagoComponent } from '../../../../../partials/custom/popups/popup-pago/popup-pago.component';
import { SimulacionPrecancelacion } from '../../../../../../core/model/softbank/SimulacionPrecancelacion';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { SubheaderService } from '../../../../../../core/_base/layout/services/subheader.service';
import { ParametroService } from './../../../../../../core/services/quski/parametro.service';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { ClienteService } from '../../../../../../core/services/quski/cliente.service';
import { ReNoticeService } from '../../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../../src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource} from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';


/**
 * @title Dialog Overview
 */
@Component({
  selector: 'kt-registrar-pago',
  templateUrl: './registrar-pago.component.html',
  styleUrls: ['./registrar-pago.component.scss']
})
export class RegistrarPagoComponent implements OnInit {
  /** @TABLAS **/
  public displayedColumnsRubro = ['rubro','numeroCuota', 'proyectado', 'calculado', 'estado'];
  public dataSourceRubro = new MatTableDataSource<any>();
  public loadComprobante  = new BehaviorSubject<boolean>(false);
  private datosMupi: any;
  private totalValorDepositado: any;
  private usuario;
  private agencia;
  catTipoPagoProceso: Array<any>;
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['accion','intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','tipoPago','descargarComprobante'];
  public formRegistrarPago: FormGroup = new FormGroup({});
  public nombreCliente = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cedula = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public codigoOperacion = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public codigoCuentaMupi = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public tipoCredito = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorPreCancelado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorDepositado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public observacion = new FormControl('', [Validators.maxLength(150)]);
  public tipoPagoProceso = new FormControl('', [Validators.required, Validators.maxLength(13)]);

  constructor(
    private css: SoftbankService,
    private cli: ClienteService,
    private reg: RegistrarPagoService,
    private par: ParametroService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    ) {
      this.css.setParameter();
      this.reg.setParameter();
      this.formRegistrarPago.addControl("nombresCliente", this.nombreCliente);
      this.formRegistrarPago.addControl("cedula", this.cedula);
      this.formRegistrarPago.addControl("codigoOperacion", this.codigoOperacion);
      this.formRegistrarPago.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
      this.formRegistrarPago.addControl("tipoCredito", this.tipoCredito);
      this.formRegistrarPago.addControl("valorPreCancelado", this.valorPreCancelado);
      this.formRegistrarPago.addControl("valorDepositado", this.valorDepositado);
  }
  ngOnInit() {
    this.css.setParameter();
    this.reg.setParameter();
    this.cargarCatalogos();
    this.iniciarBusqueda();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );    
    this.subheaderService.setTitle("Registrar Pago");
    this.formRegistrarPago.disable();
  }
  private iniciarBusqueda(){
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.item) {
        let row = JSON.parse(atob(data.params.item));
        this.cli.consultarCuentaMupi( row.identificacion ).subscribe( (dta: any) =>{
          if(dta.entidad){
            this.datosMupi = dta.entidad;
            this.codigoCuentaMupi.setValue(dta.entidad.numeroCuenta);
            this.cedula.setValue( row.identificacion );
            this.codigoOperacion.setValue( row.numeroOperacion );
            this.nombreCliente.setValue(row.nombreCliente);
            this.tipoCredito.setValue( row.tipoCredito );
            this.consultaRubros( row.numeroOperacion);
            this.simulacionPrecancelacion( row.numeroOperacion );
          }
        });
      }
    });
  }
  private consultaRubros( numero ) {
    this.css.consultaRubrosCS(numero).subscribe((data: any) => {
      if (data) {
        
        this.dataSourceRubro = new MatTableDataSource<any>(data.rubros);
      } else {
        this.sinNoticeService.setNotice("No me trajo datos 'consultaRubrosCS'", 'error');
      }
    });
  }
  private simulacionPrecancelacion( numeroOperacion ){
    this.cli.getSystemDate().subscribe( (data: any) =>{
      let fecha  = new Date(data.entidad)
      let meses  = (fecha.getMonth() > Number(9) ? '' : '0') + fecha.getMonth();
      let dias   = (fecha.getDate()  > Number(9) ? '' : '0') + fecha.getDate();
      let fechaC = fecha.getFullYear() + '-' + meses + '-' + dias;
      let wrapper: SimulacionPrecancelacion = { 
        numeroPrestamo: numeroOperacion, 
        fechaPrecancelacion: fechaC
      }
      this.css.simularPrecancelacionCS( wrapper ).subscribe( (data: any) =>{
        if(data){
          this.valorPreCancelado.setValue( data.valorTotal );
        }
      });
    });
  }
  public agregarComprobante(){
    this.loadComprobante.next(true);
    const dialogRef = this.dialog.open(PopupPagoComponent, {
      width: "800px",
      height: "auto",
      data: { id : null, banco: this.datosMupi.institucionFinanciera, numeroCuenta: this.datosMupi.numeroCuenta }
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.sinNoticeService.setNotice('ARCHIVO CARGADO CORRECTAMENTE','success');
        this.cargarComprobante(r);
      }else{
        this.loadComprobante.next(false);
        this.sinNoticeService.setNotice('ERROR CARGANDO ARCHIVO','error');
      }
    });
  }
  private cargarComprobante(r) {
    const data = this.dataSourceComprobante.data;
    data.push(r);
    this.dataSourceComprobante = new MatTableDataSource<any>( data );
    this.calcularValor();
    this.loadComprobante.next(false);
  }
  private calcularValor(){
    this.totalValorDepositado = 0;
    if(this.dataSourceComprobante && this.dataSourceComprobante.data && this.dataSourceComprobante.data.length > 0){
      this.dataSourceComprobante.data.forEach( e=>{
        e.valorDepositado
        this.totalValorDepositado  = (Number(this.totalValorDepositado) + Number(e.valorDepositado)).toFixed(2);
      });
      this.valorDepositado.setValue( this.totalValorDepositado );
    }
  }
  public eliminarComprobante(row){
    const index = this.dataSourceComprobante.data.indexOf(row);
    this.dataSourceComprobante.data.splice(index, 1);
    const data = this.dataSourceComprobante.data;
    this.dataSourceComprobante.data = data;
    this.calcularValor();
  }  
  public descargarComprobante(row){
    saveAs(this.cli.dataURItoBlob(row.comprobante.fileBase64), row.comprobante.name);    
  }
  public enviarAprobador(){
    if(!this.dataSourceComprobante || !this.dataSourceComprobante.data || this.dataSourceComprobante.data.length < 1){
      this.sinNoticeService.setNotice('INGRESE AL MENOS UN COMPROBANTE DE PAGOS','warning')
      return;
    }
    if(!this.observacion.value ){
      this.sinNoticeService.setNotice('INGRESE UNA OBSERVACION PARA EL APROBADOR','warning')
      return;
    }
    let mensaje = "Crear un nuevo proceso de registro de pago para el cliente: " + this.nombreCliente.value+"?.";
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        let list = new Array<any>( );
        this.dataSourceComprobante.data.forEach( e=>{
          let item: { comprobante, cuenta, fechaPago, intitucionFinanciera, numeroDeposito, valorDepositado, tipoPago} = {
            comprobante: e.comprobante,
            cuenta: e.cuenta,
            fechaPago: e.fechaPago,
            intitucionFinanciera: e.intitucionFinanciera.id,
            numeroDeposito: e.numeroDeposito,
            valorDepositado: e.valorDepositado,
            tipoPago: e.tipoPago
          };
          list.push( item );
        });
        let wrapper = {
          pagos: list,
          asesor: this.usuario,
          agencia: this.agencia,
          cedula: this.cedula.value,
          nombreCompleto:  this.nombreCliente.value,
          tipoCredito: this.tipoCredito.value, 
          numeroOperacion: this.codigoOperacion.value,
          observacion: this.observacion.value,
          valorDepositado: this.valorDepositado.value,
          valorPrecancelado: this.valorPreCancelado.value,
          idBanco: this.datosMupi.institucionFinanciera,
          tipoPagoProceso: this.tipoPagoProceso.value.valor
        }
        console.log('wrapper => ', wrapper);
        this.reg.iniciarProcesoRegistrarPago( wrapper ).subscribe( (data: any) =>{
          if(data.entidad && data.entidad.proceso && data.entidad.proceso.estadoProceso == "PENDIENTE_APROBACION"){
            this.sinNoticeService.setNotice("PROCESO CREADO BAJO EL CODIGO BPM: "+data.entidad.cliente.codigo+".", 'success');
            this.router.navigate(['negociacion/bandeja-operaciones']);
          }else{
            this.sinNoticeService.setNotice("ERROR NO IDENTIFICADO", 'error');
          }
    
        }, error => {
          this.sinNoticeService.setNotice(error.error.msgError, 'error');
        });
      }else{
        this.sinNoticeService.setNotice('SE CANCELO LA ACCION','error');
      }
    });
  }
  public regresar(){
    this.router.navigate(['credito-nuevo/lista-credito']);
  }
  public cargarCatalogos(){
    this.par.findByTipo('TIPO-PAGO-PROCESO').subscribe( (data: any) =>{
      this.catTipoPagoProceso = data.entidades ? data.entidades : {nombre: 'ERR', valor: 'Error al cargar catalogo'}
    });
  }
}
