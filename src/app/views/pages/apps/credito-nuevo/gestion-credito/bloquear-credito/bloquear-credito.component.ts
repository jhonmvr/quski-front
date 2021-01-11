import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatDialog, MatTableDataSource } from '@angular/material';
import { DialogoBloquearCreditoComponent } from './dialogo-bloquear-credito/dialogo-bloquear-credito.component';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { SubheaderService } from './../../../../../../core/_base/layout';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { ClienteSoftbank } from './../../../../../../core/model/softbank/ClienteSoftbank';
import { TbQoClientePago } from './../../../../../../core/model/quski/TbQoClientePago';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { UploadFileComponent } from '../../upload-file/upload-file.component';
import { saveAs } from 'file-saver';
import { ReFileUploadService } from './../../../../../../core/services/re-file-upload.service';
import { ObjectStorageService } from './../../../../../../core/services/object-storage.service';
import { environment } from './../../../../../../../environments/environment';
@Component({
  selector: 'kt-bloquear-credito',
  templateUrl: './bloquear-credito.component.html',
  styleUrls: ['./bloquear-credito.component.scss']
})
export class BloquearCreditoComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  banderaGuardar = new BehaviorSubject<boolean>(false);
  banderaDescargar = new BehaviorSubject<boolean>(false);
  columnas = ['accion', 'institucionFinanciera', 'cuentas', 'fechaPago', 'numeroDeposito', 'valorPagado', 'subir', 'descargar'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceRubros: MatTableDataSource<any> = new MatTableDataSource<any>();
  totalResults: number;
  //p = new Page();
  @ViewChild('sort1', { static: true }) sort: DialogoBloquearCreditoComponent;
  id;
  public formBloqueoFondo: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public cedula = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public nombreCliente = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public codigoCuentaMupi = new FormControl('', [Validators.required, Validators.maxLength(13)]);
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
    private upload: ReFileUploadService, 
    private os: ObjectStorageService,
    public dialog: MatDialog
    ) {
    this.css.setParameter();
    this.registrarPagoService.setParameter();
    this.upload.setParameter();
    this.os.setParameter();
    this.formBloqueoFondo.addControl("identificacion", this.identificacion);
    this.formBloqueoFondo.addControl("nombresCliente", this.nombreCliente);
    this.formBloqueoFondo.addControl("cedula", this.cedula);
    this.formBloqueoFondo.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
    this.formBloqueoFondo.addControl("valorDepositado", this.valorDepositado);
    this.formBloqueoFondo.addControl("observacion", this.observacion);
  }
  ngOnInit() {
    this.css.setParameter();
    this.registrarPagoService.setParameter();
    this.upload.setParameter();
    this.os.setParameter();
    //falta el de rubros pre cancelacion
    this.subheaderService.setTitle("Bloqueo de Fondos");
    this.loading = this.loadingSubject.asObservable();
    // this.submit();
  }
  cargarPagos() {
    ////console.log("entra a popUp Aprobrar y Rechazar")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoBloquearCreditoComponent, {
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
  deletFila(row) {
    let data = this.dataSource.data;
    //console.log("esta es la fila q quiero borrar", row)
    data.splice(row, 1);
    this.dataSource = new MatTableDataSource<any>(data);
  };
  subirComprobante(j) {
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
  }
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




  consultarClienteSoftbankCS() {
    let entidadConsultaCliente = new ClienteSoftbank();
    let cedula = this.identificacion.value;
    //console.log(" " + cedula)
    entidadConsultaCliente.identificacion = cedula;
    entidadConsultaCliente.idTipoIdentificacion = 1;

    this.css.consultarClienteSoftbankCS(entidadConsultaCliente).subscribe((data: any) => {
      if (data) {
        this.cedula.setValue(data.identificacion);
        this.nombreCliente.setValue(data.nombreCompleto);
        let cuentasBancaCliente = data.cuentasBancariasCliente[0];
        //console.log(" cuentas cuentasBancariasCliente --->",cuentasBancaCliente )
        this.codigoCuentaMupi.setValue("5248548563");
        //console.log("Consulta del cliente en Cloustudio --> " + JSON.stringify(data));
      } else {
        this.sinNoticeService.setNotice("Error no fue cacturado en 'consultarClienteCS' :(", 'error');
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


  Enviar() {
    //console.log("voy a guarar ")
    this.loadingSubject.next(true);
    if (this.formBloqueoFondo.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS BLOQUEAR FONDOS", 'warning');
      return;
    }

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
    if (this.dataSource.data.length > 0) {
      registrarBloqueoFondoWrapper.bloqueos = this.dataSource.data;
    } else {
      registrarBloqueoFondoWrapper.bloqueos = null;
    }

    this.registrarPagoService.bloqueoFondosConRelaciones(registrarBloqueoFondoWrapper).subscribe((p:any) => {
      //console.log("Datos que se van a guardar >>> ", this.registrarPagoService);
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
      const input = this.formBloqueoFondo.get("cedula");
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

    if (pfield && pfield == "nombreCliente") {
      return this.nombreCliente.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "valorDepositado") {
      return this.valorDepositado.hasError('required') ? errorrequiredo : '';
    }
  }
}
