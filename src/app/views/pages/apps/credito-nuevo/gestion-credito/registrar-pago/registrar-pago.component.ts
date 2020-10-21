import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReNoticeService } from '../../../../../../core/services/re-notice.service';
import { RegistarPagoDialogComponent } from './registar-pago-dialog/registar-pago-dialog';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { SubheaderService } from '../../../../../../core/_base/layout/services/subheader.service';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { ClienteSoftbank } from '../../../../../../core/model/softbank/ClienteSoftbank';
import { BehaviorSubject } from 'rxjs';
import { TbQoRegistrarPago } from './../../../../../../core/model/quski/TbQoRegistrarPago';
import { TbQoClientePago } from './../../../../../../core/model/quski/TbQoClientePago';
import { Page } from '../../../../../../core/model/page';
import { environment } from './../..`/../../../../../../../environments/environment';
import { DataUpload } from './../../../../../../core/interfaces/data-upload';
import { ObjectStorageService } from './../../../../../../core/services/object-storage.service';
import { ReFileUploadService } from './../../../../../../core/services/re-file-upload.service';
import { UploadFileComponent } from '../../upload-file/upload-file.component';
import { HabilitanteWrapper } from './../../../../../../core/model/wrapper/habilitante-wrapper';
import { saveAs } from 'file-saver';
import { toPublicName } from '@angular/compiler/src/i18n/serializers/xmb';


/**
 * @title Dialog Overview
 */
@Component({
  selector: 'kt-registrar-pago',
  templateUrl: './registrar-pago.component.html',
  styleUrls: ['./registrar-pago.component.scss']
})
export class RegistrarPagoComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  banderaGuardar = new BehaviorSubject<boolean>(false);
  banderaDescargar = new BehaviorSubject<boolean>(false);
  private uploadSubject = new BehaviorSubject<boolean>(false);
  public dataUpload: DataUpload;
  fileBase64: string;
  procesoSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  estadoOperacionSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  columnas = ['accion', 'institucionFinanciera', 'cuentas', 'fechaPago', 'numeroDeposito', 'valorPagado', 'subir', 'descargar'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceRubros: MatTableDataSource<any> = new MatTableDataSource<any>();
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
  /**
   * 
   * @param  sinNoticeService;
   * 
   */
  constructor(
    private css: SoftbankService,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private registrarPagoService: RegistrarPagoService,
    private noticeService: ReNoticeService,
    private upload: ReFileUploadService, private os: ObjectStorageService,
    public dialog: MatDialog) {
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

  submit() {


  }

  id;
  cargarPagos() {
    console.log("entra a popUp angregar pago")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(RegistarPagoDialogComponent, {
      width: "auto-max",
      height: "auto-max",
      data: idReferenciaHab
    });
    dialogRef.afterClosed().subscribe(r => {
    this.banderaGuardar.next(true);
      console.log("datos de salida popUp", r)
      let datos = this.dataSource.data;
      datos.push(r);

      console.log("dataSOurce", datos);
      if (r) {
        this.dataSource.data = datos;
      }
    });
  }
  deletFila(row) {
    let data = this.dataSource.data;
    console.log("esta es la fila q quiero borrar", row)
    data.splice(row, 1);
    this.dataSource = new MatTableDataSource<any>(data);
  };

  subirComprobante(j) {
    console.log("registro ",j)
    const dialogRef = this.dialog.open(UploadFileComponent, {
      width: "auto",
      height: "auto"
    });

    dialogRef.afterClosed().subscribe(r => {
      console.log("resultado del archivito q subi XD", r);
      if (r) {
        j.nombreArchivo = r.nombreArchivo;
        j.archivo = r.archivo;  
        this.sinNoticeService.setNotice("ARCHIVO CARGADO CORRECTAMENTE", "success");
        
    this.banderaGuardar.next(false);
      }
    });
  }

  descargarComprobante(j) {
    console.log("Archivo subido --->>>>> ", j);
    this.os.getObjectById( j.archivo,this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
      if (confirm("Realmente quiere descargar?")) {
        if( data && data.entidad ){
          let obj=JSON.parse( atob(data.entidad) );
          console.log("entra a retorno json " + JSON.stringify( obj ));
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
        console.log("================>error: " + JSON.stringify(error));
        this.sinNoticeService.setNotice("ERROR DESCARGA DE ARCHIVO HABILITANTE REGISTRADO", "error" );
      });
  }

  ngOnInit() {
    this.testoperacionConsultaCS();
    this.consultarClienteSoftbankCS();
    this.testconsultaRubrosCS();
    //falta el de rubros pre cancelacion
    this.subheaderService.setTitle("Registrar Pago");
    this.loading = this.loadingSubject.asObservable();
    // this.submit();
  }

  consultarClienteSoftbankCS() {
    let entidadConsultaCliente = new ClienteSoftbank();
    //let cedula = this.identificacion.value;
    //console.log(" "  + cedula)
    entidadConsultaCliente.identificacion = "1311066441";
    entidadConsultaCliente.idTipoIdentificacion = 1;

    this.css.consultarClienteSoftbankCS(entidadConsultaCliente).subscribe((data: any) => {
      if (data) {
        this.cedula.setValue(data.identificacion);
        this.nombreCliente.setValue(data.nombreCompleto);
        let cuentasBancaCliente = data.cuentasBancariasCliente[0];
        //console.log(" cuenta banco --->",cuentasBancaCliente.cuenta )
        this.codigoCuentaMupi.setValue("5248548563");
        this.tipoCredito.setValue("CUOTAS");
        //console.log("Consulta del cliente en Cloustudio --> " + JSON.stringify(data));
      } else {
        this.sinNoticeService.setNotice("No me trajo datos 'entidadConsultaCliente'", 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("Error no fue cacturado en 'consultarClienteCS' :(", 'error');

      }
    });
  }

  testoperacionConsultaCS() {
    let entidadConsultaOperacion = new ClienteSoftbank();
    entidadConsultaOperacion.identificacion = "1311066441";
    entidadConsultaOperacion.idTipoIdentificacion = 1;
    this.css.operacionConsultaCS(entidadConsultaOperacion).subscribe((data: any) => {
      if (data.operaciones[0]) {
        let codOpera = data.operaciones[0];
        this.codigoOperacion.setValue(codOpera.numeroOperacion);
        //console.log("Consulta de Operacion en Cloustudio --> " + JSON.stringify(data.operaciones[0]));
      } else {
        this.sinNoticeService.setNotice("No me trajo datos 'entidadConsultaOperacion'", 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("Error no fue cacturado en 'entidadConsultaOperacion' :(", 'error');

      }
    });
  }


  testconsultaRubrosCS() {
    let entidadConsultaRubros;
    entidadConsultaRubros = 2020001984;
    this.css.consultaRubrosCS(entidadConsultaRubros).subscribe((data: any) => {
      if (data) {
        let rubro = data.rubros;
        this.dataSourceRubros = new MatTableDataSource<any>(rubro.filter(e => e.estado == "ACTIVO"));
        //console.log("Consulta de Rubros en Cloustudio --> " + JSON.stringify(data));
      } else {
        this.sinNoticeService.setNotice("No me trajo datos 'entidadConsultaRubros'", 'error');
      }
    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("Error no fue cacturado en 'entidadConsultaRubros' :(", 'error');

      }
    })
  };

  guardar() {
    console.log("voy a guardar ")
    this.loadingSubject.next(true);
    if (this.formRegistrarPago.invalid) {
      this.loadingSubject.next(false);
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
      console.log(" >>> ", this.registrarPagoService);
      if(p.entidad && p.entidad.pagos){
        this.dataSource.data = p.entidad.pagos;
        this.banderaDescargar.next(true);
      }
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
    }, error => {
      this.loadingSubject.next(false);
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
