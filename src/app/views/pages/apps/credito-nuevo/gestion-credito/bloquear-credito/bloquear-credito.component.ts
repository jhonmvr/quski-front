import { ConfirmarAccionComponent } from './../../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { PopupPagoComponent } from './../../../../../partials/custom/popups/popup-pago/popup-pago.component';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { ClienteSoftbank } from './../../../../../../core/model/softbank/ClienteSoftbank';
import { ClienteService } from './../../../../../../core/services/quski/cliente.service';
import { TbQoClientePago } from './../../../../../../core/model/quski/TbQoClientePago';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../../src/environments/environment';
import { MatDialog, MatStepper, MatTableDataSource } from '@angular/material';
import { ValidateCedula } from './../../../../../../core/util/validate.util';
import { SubheaderService } from './../../../../../../core/_base/layout';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'kt-bloquear-credito',
  templateUrl: './bloquear-credito.component.html',
  styleUrls: ['./bloquear-credito.component.scss']
})
export class BloquearCreditoComponent implements OnInit {
  public loadComprobante  = new BehaviorSubject<boolean>(false);
  private datosMupi: any;
  private totalValorDepositado: any;
  private usuario;
  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  private agencia;
  private catBanco: {id: number, nombre:string}[];
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['accion', 'intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','descargarComprobante'];
  public formBusqueda: FormGroup = new FormGroup({});
  public formDisable: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public cedula = new FormControl('', []);
  public nombreCliente  = new FormControl('', []);
  public codigoCuentaMupi  = new FormControl('', []);
  public institucionFinanciera  = new FormControl('', []);
  public valorDepositado  = new FormControl('', []);
  public observacion = new FormControl('', [Validators.maxLength(150)]);

  constructor(
    private sof: SoftbankService,
    private cli: ClienteService,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private router: Router,
    private reg: RegistrarPagoService,
    public dialog: MatDialog
    ) {
    this.sof.setParameter();
    this.reg.setParameter();
    this.formBusqueda.addControl("identificacion", this.identificacion);
    this.formDisable.addControl("cedula", this.cedula);
    this.formDisable.addControl("nombreCliente", this.nombreCliente);
    this.formDisable.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
    this.formDisable.addControl("institucionFinanciera", this.institucionFinanciera);
    this.formDisable.addControl("valorDepositado", this.valorDepositado);
  }
  ngOnInit() {
    this.cargarCatalogos();
    this.sof.setParameter();
    this.reg.setParameter();
    this.subheaderService.setTitle("Bloqueo de Fondos");
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );  
    this.formDisable.disable();
  }  
  /********************************************* @BUSQUEDA *********************    */
  public buscarCliente(){
    if(!this.formBusqueda.valid){
      this.sinNoticeService.setNotice('INGRESE UNA CEDULA VALIDA','warning');
      return;
    }
    this.cli.consultarCuentaMupi( this.identificacion.value ).subscribe( (dta: any) =>{
      if(dta.entidad){
        console.log('Data =>', dta.entidad);
        this.datosMupi = dta.entidad;
        this.codigoCuentaMupi.setValue(dta.entidad.numeroCuenta);
        this.cedula.setValue( this.identificacion.value );
        let banco = this.catBanco.find(x => x.id == dta.entidad.institucionFinanciera);
        if(banco){
          this.institucionFinanciera.setValue( banco.nombre );
        }
        let consulta = new ClienteSoftbank();
        consulta.identificacion = this.identificacion.value;
        consulta.idTipoIdentificacion = 1;
        this.sof.consultarClienteSoftbankCS( consulta ).subscribe((data: any) => {
          if (data) {
            this.nombreCliente.setValue(data.nombreCompleto);
            this.stepper.selectedIndex = 1;
            this.sinNoticeService.setNotice('DATOS CARGADOS CORRECTAMENTE','success');
          } else {
            this.sinNoticeService.setNotice("Error no fue cacturado en 'consultarClienteCS'", 'error');
          }
        }, error => {
            this.sinNoticeService.setNotice(error.error.msgError, 'error');
        });
      }
    }, error => {
      this.sinNoticeService.setNotice(error.error.msgError, 'error');
    });
  }
  
  Enviar() {

    let registrarBloqueoFondoWrapper = {
      cliente: {},
      bloqueos: {}
    }

    let cliente = new TbQoClientePago();
    cliente.nombreCliente = this.nombreCliente.value;
    cliente.cedula = this.cedula.value;
    cliente.codigoCuentaMupi = this.codigoCuentaMupi.value;
    cliente.valorDepositado = this.valorDepositado.value;
    cliente.observacion = this.observacion.value;
    cliente.tipo = ('BLOQUEO_FONDO')
    registrarBloqueoFondoWrapper.cliente = cliente;
    if (this.dataSourceComprobante.data.length > 0) {
      registrarBloqueoFondoWrapper.bloqueos = this.dataSourceComprobante.data;
    } else {
      registrarBloqueoFondoWrapper.bloqueos = null;
    }
    this.reg.iniciarProcesoRegistrarBloqueo(registrarBloqueoFondoWrapper).subscribe((p:any) => {
      //console.log("Datos que se van a guardar >>> ", this.registrarPagoService);
      if(p.entidad && p.entidad.pagos){
        this.dataSourceComprobante.data = p.entidad.pagos;
      }
      this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
    }, error => {
    }

    )
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
    let mensaje = "Crear un nuevo proceso de registro de Bloqueo para el cliente: " + this.nombreCliente.value+"?.";
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        let list = new Array<any>( );
        this.dataSourceComprobante.data.forEach( e=>{
          let item: { comprobante, cuenta, fechaPago, intitucionFinanciera, numeroDeposito, valorDepositado} = {
            comprobante: e.comprobante,
            cuenta: e.cuenta,
            fechaPago: e.fechaPago,
            intitucionFinanciera: e.intitucionFinanciera.id,
            numeroDeposito: e.numeroDeposito,
            valorDepositado: e.valorDepositado,
          };
          list.push( item );
        });
        console.log('Items => ', list);
        let wrapper = {
          pagos: list,
          asesor: this.usuario,
          agencia: this.agencia,
          cedula: this.cedula.value,
          nombreCompleto:  this.nombreCliente.value,
          observacion: this.observacion.value,
          valorDepositado: this.valorDepositado.value,
          idBanco: this.datosMupi.institucionFinanciera
        }
        this.reg.iniciarProcesoRegistrarBloqueo( wrapper ).subscribe( (data: any) =>{
          console.log('Data.Entidad => ', data.entidad);
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
  private cargarCatalogos(){
    this.sof.consultarBancosCS().subscribe( data =>{
      this.catBanco = data.catalogo ? data.catalogo :  {nombre: 'No se cargo el catalogo. Error', id: 0};
    });
  }
  /********************************************* @FUNCIONALIDAD *********************    */
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorNumero = 'Ingreso solo numeros';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';

    if (pfield && pfield === "identificacion") {
      const input = this.formBusqueda.get("identificacion");
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("invalid-cedula")
            ? invalidIdentification
            : input.hasError("maxlength")
              ? errorLogitudExedida
              : input.hasError("minlength")
                ? errorInsuficiente
                : "";
    }
  }

  /********************************************* @COMPROBANTE *********************    */

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




  
  

}
