import { PopupPagoComponent } from '../../../../../partials/custom/popups/popup-pago/popup-pago.component';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { SubheaderService } from '../../../../../../core/_base/layout/services/subheader.service';
import { ObjectStorageService } from './../../../../../../core/services/object-storage.service';
import { ReFileUploadService } from './../../../../../../core/services/re-file-upload.service';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { RegistarPagoDialogComponent } from './registar-pago-dialog/registar-pago-dialog';
import { ClienteService } from '../../../../../../core/services/quski/cliente.service';
import { TbQoClientePago } from './../../../../../../core/model/quski/TbQoClientePago';
import { ReNoticeService } from '../../../../../../core/services/re-notice.service';
import { DataUpload } from './../../../../../../core/interfaces/data-upload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource} from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../../../core/model/page';
import { ActivatedRoute } from '@angular/router';
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
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['accion', 'intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','descargarComprobante'];

  


  banderaGuardar = new BehaviorSubject<boolean>(false);
  banderaDescargar = new BehaviorSubject<boolean>(false);
  private uploadSubject = new BehaviorSubject<boolean>(false);
  public dataUpload: DataUpload;
  fileBase64: string;
  procesoSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  estadoOperacionSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  columnas = ['accion', 'institucionFinanciera', 'cuentas', 'fechaPago', 'numeroDeposito', 'valorPagado', 'subir', 'descargar'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  totalResults: number;
  p = new Page();

  columna: string[] = ['rubro', 'valor'];

  @ViewChild('sort1', { static: true }) sort: RegistarPagoDialogComponent;

  public formRegistrarPago: FormGroup = new FormGroup({});
  public nombreCliente = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cedula = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public codigoOperacion = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public codigoCuentaMupi = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public tipoCredito = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorPreCancelado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorDepositado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public observacion = new FormControl('', [Validators.maxLength(150)]);
  id;
  /**
   * 
   * @param  sinNoticeService;
   * 
   */
  constructor(
    private route: ActivatedRoute,
    private css: SoftbankService,
    private cli: ClienteService,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private registrarPagoService: RegistrarPagoService,
    private upload: ReFileUploadService, 
    private os: ObjectStorageService,
    public dialog: MatDialog) {
      this.css.setParameter();
      this.registrarPagoService.setParameter();
      this.upload.setParameter();
      this.os.setParameter();
      this.formRegistrarPago.addControl("nombresCliente", this.nombreCliente);
      this.formRegistrarPago.addControl("cedula", this.cedula);
      this.formRegistrarPago.addControl("codigoOperacion", this.codigoOperacion);
      this.formRegistrarPago.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
      this.formRegistrarPago.addControl("tipoCredito", this.tipoCredito);
      this.formRegistrarPago.addControl("valorPreCancelado", this.valorPreCancelado);
      this.formRegistrarPago.addControl("valorDepositado", this.valorDepositado);
      this.formRegistrarPago.addControl("observacion", this.observacion);
  }
  ngOnInit() {
    this.css.setParameter();
    this.registrarPagoService.setParameter();
    this.upload.setParameter();
    this.os.setParameter();
    this.iniciarBusqueda();
    this.subheaderService.setTitle("Registrar Pago");
  }
  private iniciarBusqueda(){
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.item) {
        let row = JSON.parse(atob(data.params.item));
        console.log('Mi row =>', row);
        this.cedula.setValue(row.identificacion);
        this.nombreCliente.setValue(row.nombreCliente);
        this.codigoOperacion.setValue( row.numeroOperacion );
        this.tipoCredito.setValue( row.tipoCredito );
        this.consultarCuentaMupi( row.identificacion);
        this.consultaRubros( row.numeroOperacion);
      }
    });
  }
  private consultarCuentaMupi( cedula ){
    this.cli.consultarCuentaMupi( cedula).subscribe( (dta: any) =>{
      if(dta.entidad){
        this.datosMupi = dta.entidad;
        this.codigoCuentaMupi.setValue(dta.entidad.numeroCuenta);

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
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("Error no fue cacturado en 'entidadConsultaRubros' :(", 'error');
      }
    })
  }
  public agregarComprobante(){
    this.loadComprobante.next(true);
    console.log('Datos mupi =>', this.datosMupi);
    const dialogRef = this.dialog.open(PopupPagoComponent, {
      width: "800px",
      height: "auto",
      data: { id : '1', banco: this.datosMupi.institucionFinanciera, numeroCuenta: this.datosMupi.numeroCuenta }
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.sinNoticeService.setNotice('ARCHIVO CARGADO CORRECTAMENTE','success');
        this.cargarComprobante(r);
      }else{
        this.sinNoticeService.setNotice('ERROR CARGANDO ARCHIVO','error');
      }
    });
  }
  private cargarComprobante(r) {
    const data = this.dataSourceComprobante.data;
    data.push(r);
    this.dataSourceComprobante = new MatTableDataSource<any>( data );
    this.loadComprobante.next(false);
  }
  public eliminarComprobante(row){
    const index = this.dataSourceComprobante.data.indexOf(row);
    this.dataSourceComprobante.data.splice(index, 1);
    const data = this.dataSourceComprobante.data;
    this.dataSourceComprobante.data = data;
  }  
  public descargarComprobante(row){
    saveAs(this.cli.dataURItoBlob(row.comprobante.fileBase64), row.comprobante.name);    
  }

























  cargarPagos() {
    //console.log("entra a popUp angregar pago")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(RegistarPagoDialogComponent, {
      width: "auto-max",
      height: "auto-max",
      data: idReferenciaHab
    });
    dialogRef.afterClosed().subscribe(r => {
    this.banderaGuardar.next(true);
      //console.log("datos de salida popUp", r)
      let datos = this.dataSource.data;
      datos.push(r);

      //console.log("dataSOurce", datos);
      if (r) {
        this.dataSource.data = datos;
      }
    });
  }


/*   subirComprobante(j) {
    //console.log("registro ",j)
    const dialogRef = this.dialog.open(UploadFileComponent, {
      width: "auto",
      height: "auto"
    });

    dialogRef.afterClosed().subscribe(r => {
      //console.log("resultado del archivito q subi XD", r);
      if (r) {
        j.nombreArchivo = r.nombreArchivo;
        j.archivo = r.archivo;  
        this.sinNoticeService.setNotice("ARCHIVO CARGADO CORRECTAMENTE", "success");
        
    this.banderaGuardar.next(false);
      }
    });
  } */
/* 
  descargarComprobante(j) {
    //console.log("Archivo subido --->>>>> ", j);
    this.os.getObjectById( j.archivo,this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
      if (confirm("Realmente quiere descargar?")) {
        if( data && data.entidad ){
          let obj=JSON.parse( atob(data.entidad) );
          //console.log("entra a retorno json " + JSON.stringify( obj ));
          const byteCharacters = atob(obj.fileBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: j});
          saveAs(blob , obj.name);
        }else {
          this.sinNoticeService.setNotice("NO SE ENCONTRO REGISTRO PARA DESCARGA", "error" );
        }
      }
      },
      error => {
        //console.log("================>error: " + JSON.stringify(error));
        this.sinNoticeService.setNotice("ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO", "error" );
      });
  }
 */

  guardar() {
    //console.log("voy a guardar ")
    if (this.formRegistrarPago.invalid) {
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS REGISTRAR PAGOS", 'warning');
      return;
    }

    let registrarPagoWrapper = {
      cliente: {},
      pagos: {}
    }

    let cliente = new TbQoClientePago();
    cliente.nombreCliente = this.nombreCliente.value;
    cliente.cedula = this.cedula.value;
    cliente.codigoCuentaMupi = this.codigoCuentaMupi.value;
    cliente.codigoOperacion = this.codigoOperacion.value;
    cliente.tipoCredito = this.tipoCredito.value;
    cliente.valorPrecancelado = this.valorPreCancelado.value;
    cliente.valorDepositado = this.valorDepositado.value;
    cliente.observacion = this.observacion.value;
    cliente.tipo = ('REGISTRO_PAGO');
    registrarPagoWrapper.cliente = cliente;
    if (this.dataSource.data.length > 0) {
      registrarPagoWrapper.pagos = this.dataSource.data;
    } else {
      registrarPagoWrapper.pagos = null;
    }

    this.registrarPagoService.crearRegistrarPagoConRelaciones(registrarPagoWrapper).subscribe((p:any) => {
      //console.log(" >>> ", this.registrarPagoService);
      if(p.entidad && p.entidad.pagos){
        this.dataSource.data = p.entidad.pagos;
        this.banderaDescargar.next(true);
      }
      this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
    }, error => {
    }
    )

  }

  /**
 * 
 * @param pfield 
 * @description MENSAJES DE ERRORES.
 */
  getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorEmail = 'Correo Incorrecto';
    const errorNumero = 'Ingreso solo numeros';
    const errorFormatoIngreso = 'Use el formato : 0.00';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    let errorrequiredo = "Ingresar valores";

    if (pfield && pfield === "cedula") {
      const input = this.formRegistrarPago.get("cedula");
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
    if (pfield && pfield == "cedula") {
      return this.cedula.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "codigoCuentaMupi") {
      return this.codigoCuentaMupi.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "codigoOperacion") {
      return this.codigoOperacion.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "nombreCliente") {
      return this.nombreCliente.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "tipoCredito") {
      return this.tipoCredito.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "valorPreCancelado") {
      return this.valorPreCancelado.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "valorDepositado") {
      return this.valorDepositado.hasError('required') ? errorrequiredo : '';
    }
  }
}
