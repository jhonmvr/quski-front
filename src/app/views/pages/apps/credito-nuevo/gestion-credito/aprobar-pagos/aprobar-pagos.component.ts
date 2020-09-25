
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatDialog, MatTableDataSource } from '@angular/material';
import { DialogoAprobarPagosComponent } from './dialogo-aprobar-pagos/dialogo-aprobar-pagos.component';
import { BehaviorSubject } from 'rxjs';
import { Page } from './../../../../../../core/model/page';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { SubheaderService } from './../../../../../../core/_base/layout';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { ClienteSoftbank } from './../../../../../../core/model/softbank/ClienteSoftbank';

@Component({
  selector: 'kt-aprobar-pagos',
  templateUrl: './aprobar-pagos.component.html',
  styleUrls: ['./aprobar-pagos.component.scss']
})
export class AprobarPagosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  columnas = ['accion', 'institucionFinanciera', 'cuentas', 'fechadePago', 'numerodeDeposito', 'valorpagado', 'descargar'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceRubros: MatTableDataSource<any> = new MatTableDataSource<any>();
  totalResults: number;
  p = new Page();

  columna: string[] = ['rubro', 'valor'];

  @ViewChild('sort1', { static: true }) sort: DialogoAprobarPagosComponent;

  public formAprobarPago: FormGroup = new FormGroup({});
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

    public dialog: MatDialog) {
    this.formAprobarPago.addControl("nombresCliente", this.nombreCliente);
    this.formAprobarPago.addControl("cedula", this.cedula);
    this.formAprobarPago.addControl("codigoOperacion", this.codigoOperacion);
    this.formAprobarPago.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
    this.formAprobarPago.addControl("tipoCredito", this.tipoCredito);
    this.formAprobarPago.addControl("valorPreCancelado", this.valorPreCancelado);
    this.formAprobarPago.addControl("valorDepositado", this.valorDepositado);
    this.formAprobarPago.addControl("observacion", this.observacion);
  }

  submit() {

    /*this.loadingSubject.next(true);
    this.dataSource = null;
    this.registrarPagoService.findAllRegistrarPago(this.p).subscribe((data: any) => {
    this.loadingSubject.next(false);
    console.log("====> datos: " + JSON.stringify( data ));
    if (data.list) {            
      this.totalResults = data.totalResults;
      //.dataSource = new MatTableDataSource<TbQoRegistrarPago>(data.list);
      
      for (let i = 0; i < this.dataSource.data.length; i++) {
        
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
      }} else {
        this.sinNoticeService.setNotice("NO SE ENCONTRARON REGISTROS", 'info');
      }
    }, error => {
      this.loadingSubject.next(false);
      if(  error.error ){
				this.noticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
			} else if(  error.statusText && error.status==401 ){
				this.dialog.open(RegistarPagoDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
			} else {
				this.noticeService.setNotice("Error al cargar las notificaciones o alertas", 'error');
			}
    }                                                                                                                                                                 
    );*/
  }

  id;
  PopUp() {
    console.log("entra a popUp Aprobrar y Rechazar")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoAprobarPagosComponent, {
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
    this.testoperacionConsultaCS();
    this.consultarClienteSoftbankCS();
    this.testconsultaRubrosCS();
    //falta el de rubros pre cancelacion
    this.subheaderService.setTitle("Aprobar Pagos");
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
      const input = this.formAprobarPago.get("cedula");
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
