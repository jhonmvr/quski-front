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
  procesoSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  estadoOperacionSubject:BehaviorSubject<string>=new BehaviorSubject<string>("");
  columnas = ['accion', 'institucionFinanciera', 'cuentas', 'fechadePago', 'numerodeDeposito', 'valorpagado', 'subir', 'descargar'];

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

    public dialog: MatDialog) {
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
  cargarPagos() {
    console.log("entra a popUp angregar pago")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(RegistarPagoDialogComponent, {
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
    console.log("voy a guarar ")
    this.loadingSubject.next(true);
    if (this.formRegistrarPago.invalid) {
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("LLENE CORRECTAMENTE LA SECCION DE DATOS REGISTRAR PAGOS", 'warning');
      return;
    }
    let registrarPagoWrapper = {
      pagos:[],
      cliente:{}
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
    cliente.tipo = ('REGISTRAR_PAGOS')
    registrarPagoWrapper.cliente = cliente;
    if (this.dataSource.data.length > 0) {

      this.dataSource.data.forEach(element => {
        let pagos = new TbQoRegistrarPago();
        pagos.institucionFinanciera = element.institucionFinanciera;
        pagos.cuentas = element.cuentas;
        pagos.fechaPago = element.fechadePago;
        pagos.numeroDeposito = element.numerodeDeposito;
        pagos.valorPagado = element.valorpagado
        registrarPagoWrapper.pagos.push(pagos);
        console.log(" registro >>>>", );
      });
      
    } else { 
      registrarPagoWrapper.pagos = null;
    }

    this.registrarPagoService.crearRegistrarPagoConRelaciones(registrarPagoWrapper).subscribe(p=>{
      
      this.loadingSubject.next(false);
      this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
    },error=>{
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
  /*getPermiso(tipo:string, permisos:Array<TbQoRegistrarPago> ):boolean{
    if( permisos && permisos.length>0 ){
      //console.log("===> getPermiso rol " + localStorage.getItem( environment.rolKey ) + " tipo: " +  tipo + " datos "+ JSON.stringify( permisos));
      let existPermisos=permisos.filter(p=>p.idPago === Number( localStorage.getItem( environment.rolKey ) ));
      //console.log("===> permisos filter " + JSON.stringify( existPermisos));
      if( existPermisos &&  existPermisos.length >0 ){
        
        if( tipo === "CARGA_ARC" &&  existPermisos[0].cargarFoto && existPermisos[0].cargarFoto===true  ){
          return true;
        }
        if( tipo === "DESCARGA_ARC" &&  existPermisos[0].descargarComprobante && existPermisos[0].descargarComprobante===true  ){
          return true;
        }
        
      }
      
    }
    return false;
  }
  @Input() set proceso(value: string) {
    this.procesoSubject.next(value);
}

get proceso():string {
  return this.procesoSubject.getValue();
}
@Input("estadoOperacion") set estadoOperacion(value: string) {
  this.estadoOperacionSubject.next(value);
}

get estadoOperacion():string {
return this.estadoOperacionSubject.getValue();
}
  loadArchivoCliente(j) {
    let envioModel={
      subirComponente:j.subirComponente,
      descargarComprobante:j.descargarComprobante
    };
  }
    
  */
}
