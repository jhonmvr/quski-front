import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource } from '@angular/material';
import { DialogoBloqueoFondosComponent } from './dialogo-bloqueo-fondos/dialogo-bloqueo-fondos.component';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { SubheaderService } from './../../../../../../core/_base/layout';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { BloquearFondoService } from '../../../../../../core/services/quski/bloquearFondo.service';
import { ClienteSoftbank } from './../../../../../../core/model/softbank/ClienteSoftbank';

@Component({
  selector: 'kt-aprobar-bloqueo-fondos',
  templateUrl: './aprobar-bloqueo-fondos.component.html',
  styleUrls: ['./aprobar-bloqueo-fondos.component.scss']
})
export class AprobarBloqueoFondosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  columnas: string[] = ['accion', 'institucionFinanciera', 'cuentas', 'fechadePago', 'numerodeDeposito', 'valorpagado', 'descargar'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceRubros: MatTableDataSource<any> = new MatTableDataSource<any>();
  totalResults: number;
  //p = new Page();
  @ViewChild('sort1', { static: true }) sort: DialogoBloqueoFondosComponent;

  public formBloqueoFondo: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public cedula = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public nombreCliente = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public codigoCuentaMupi = new FormControl('', [Validators.required, Validators.maxLength(13)]);
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
    private bloquearFondoService: BloquearFondoService,
    public dialog: MatDialog
  ) {
    this.formBloqueoFondo.addControl("identificacion", this.identificacion);
    this.formBloqueoFondo.addControl("nombresCliente", this.nombreCliente);
    this.formBloqueoFondo.addControl("cedula", this.cedula);
    this.formBloqueoFondo.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
    this.formBloqueoFondo.addControl("valorPreCancelado", this.valorPreCancelado);
    this.formBloqueoFondo.addControl("valorDepositado", this.valorDepositado);
    this.formBloqueoFondo.addControl("observacion", this.observacion);
  }




  id;
  Popup() {
    console.log("entra a popUp angregar pago")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoBloqueoFondosComponent, {
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
  subirComponente() {
    if (confirm("Realmente quiere subir?")) {

    }
  }
  descargarComponente() {
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
        //console.log(" cuenta banco --->",cuentasBancaCliente.cuenta )
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


  aprobar() {
    console.log("voy a aprobar ")
    this.loadingSubject.next(true);
    if (this.formBloqueoFondo.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS BLOQUEAR FONDOS", 'warning');
      return;
    }
  }
    rechazar() {
      console.log("voy a rechazar ")
      this.loadingSubject.next(true);
      if (this.formBloqueoFondo.invalid) {
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS BLOQUEAR FONDOS", 'warning');
        return;
      }
    }
    /*
        this.bloqueoFondoService.crearBloqueoFondoConRelaciones( ).subscribe(p=>{
          
          this.loadingSubject.next(false);
          this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
        },error=>{
          this.loadingSubject.next(false);
        }
        )
       */

  
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
    if (pfield && pfield == "valorPreCancelado") {
      return this.valorPreCancelado.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "valorDepositado") {
      return this.valorDepositado.hasError('required') ? errorrequiredo : '';
    }
  }
}
