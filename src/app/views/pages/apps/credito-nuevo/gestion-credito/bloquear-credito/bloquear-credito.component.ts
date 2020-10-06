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

@Component({
  selector: 'kt-bloquear-credito',
  templateUrl: './bloquear-credito.component.html',
  styleUrls: ['./bloquear-credito.component.scss']
})
export class BloquearCreditoComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  columnas = ['accion', 'institucionFinanciera', 'cuentas', 'fechaPago', 'numeroDeposito', 'valorPagado', 'subir', 'descargar'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceRubros: MatTableDataSource<any> = new MatTableDataSource<any>();
  totalResults: number;
  //p = new Page();
  @ViewChild('sort1', { static: true }) sort: DialogoBloquearCreditoComponent;

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
    public dialog: MatDialog
  ) {
    this.formBloqueoFondo.addControl("identificacion", this.identificacion);
    this.formBloqueoFondo.addControl("nombresCliente", this.nombreCliente);
    this.formBloqueoFondo.addControl("cedula", this.cedula);
    this.formBloqueoFondo.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
    this.formBloqueoFondo.addControl("valorDepositado", this.valorDepositado);
    this.formBloqueoFondo.addControl("observacion", this.observacion);
  }




  id;
  cargarPagos() {
    console.log("entra a popUp Aprobrar y Rechazar")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoBloquearCreditoComponent, {
      width: "auto-max",
      height: "auto-max",
      data: idReferenciaHab
    });
    dialogRef.afterClosed().subscribe(r => {
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
      }
    });
  }
  descargarComprobante() {
    if (confirm("Realmente quiere descargar?")) {

    }
  }

  ngOnInit() {
    //this.testoperacionConsultaCS();
    //falta el de rubros pre cancelacion
    this.subheaderService.setTitle("Bloqueo de Fondos");
    this.loading = this.loadingSubject.asObservable();
    // this.submit();
  }



  consultarClienteSoftbankCS() {
    let entidadConsultaCliente = new ClienteSoftbank();
    let cedula = this.identificacion.value;
    console.log(" " + cedula)
    entidadConsultaCliente.identificacion = cedula;
    entidadConsultaCliente.idTipoIdentificacion = 1;

    this.css.consultarClienteSoftbankCS(entidadConsultaCliente).subscribe((data: any) => {
      if (data) {
        this.cedula.setValue(data.identificacion);
        this.nombreCliente.setValue(data.nombreCompleto);
        let cuentasBancaCliente = data.cuentasBancariasCliente[0];
        console.log(" cuentas cuentasBancariasCliente --->",cuentasBancaCliente )
        this.codigoCuentaMupi.setValue("5248548563");
        console.log("Consulta del cliente en Cloustudio --> " + JSON.stringify(data));
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
    console.log("voy a guarar ")
    this.loadingSubject.next(true);
    if (this.formBloqueoFondo.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS BLOQUEAR FONDOS", 'warning');
      return;
    }

    let registrarBloqueoFondoWrapper = {
      cliente: {},
      bloqueos: []
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

    this.registrarPagoService.bloqueoFondosConRelaciones(registrarBloqueoFondoWrapper).subscribe(p => {
      console.log("Datos que se van a guardar >>> ", this.registrarPagoService);

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
