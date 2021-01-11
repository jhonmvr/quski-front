import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { SubheaderService } from './../../../../../../core/_base/layout';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { ClienteSoftbank } from './../../../../../../core/model/softbank/ClienteSoftbank';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogoAprobarBloqueoFondosComponent } from './dialogo-aprobar-bloqueo-fondos/dialogo-aprobar-bloqueo-fondos.component';
import { DialogoRechazarBloqueoFondosComponent } from './dialogo-rechazar-bloqueo-fondos/dialogo-rechazar-bloqueo-fondos.component';
import { ObjectStorageService } from './../../../../../../core/services/object-storage.service';
import { environment } from './../..`/../../../../../../../environments/environment';
import { saveAs } from 'file-saver';
@Component({
  selector: 'kt-aprobar-bloqueo-fondos',
  templateUrl: './aprobar-bloqueo-fondos.component.html',
  styleUrls: ['./aprobar-bloqueo-fondos.component.scss']
})
export class AprobarBloqueoFondosComponent implements OnInit {
  loading;
  loadingSubject = new BehaviorSubject<boolean>(false);
  columnas: string[] = ['institucionFinanciera', 'cuentas', 'fechaPago', 'numeroDeposito', 'valorPagado', 'descargar'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSourceRubros: MatTableDataSource<any> = new MatTableDataSource<any>();
  //totalResults: number;
  //p = new Page();
  //@ViewChild('sort1', { static: true }) sort: DialogoBloqueoFondosComponent;
  //private identificacion: string;
  private idCliente: string;
  private estado: string;
  private tipo: string;
  public formBloqueoFondo: FormGroup = new FormGroup({});
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
    private router: Router,
    private route: ActivatedRoute,
    private css: SoftbankService,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private rp: RegistrarPagoService,
    private os: ObjectStorageService,
    public dialog: MatDialog
  ) {
    this.os.setParameter();
    this.formBloqueoFondo.addControl("nombresCliente", this.nombreCliente);
    this.formBloqueoFondo.addControl("cedula", this.cedula);
    this.formBloqueoFondo.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
    this.formBloqueoFondo.addControl("valorPreCancelado", this.valorPreCancelado);
    this.formBloqueoFondo.addControl("valorDepositado", this.valorDepositado);
    this.formBloqueoFondo.addControl("observacion", this.observacion);
  }




  id;
  Aprobar() {
    //console.log("entra a popUp Aprobrar ")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoAprobarBloqueoFondosComponent, {
      width: "auto-max",
      height: "auto-max",
      data: idReferenciaHab
    });
    dialogRef.afterClosed().subscribe(a => {
      //console.log("datos de salida popUp", r)
      /*let wrapperRespuesta = new TbQoClientePago();
    
    wrapperRespuesta.observacion = this.observacion.value;*/
    if (this.tipo == "APROBADO"){
    }this.sinNoticeService.setNotice("CLIENTE YA ESTA GUARDADO", 'error');
      
  let user = localStorage.getItem(localStorage.key(2));
      this.rp.aprobarPago(this.idCliente, this.estado, this.tipo, user).subscribe(q => {
        //console.log(" >>> ", this.rp);

        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
        this.router.navigate(['../../asesor/bandeja-principal', this.idCliente]);
      }, error => {
        this.loadingSubject.next(false);
      })
    });
  }
  Rechazar() {
    //console.log("entra a popUp Rechazar")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoRechazarBloqueoFondosComponent, {
      width: "auto-max",
      height: "auto-max",
      data: idReferenciaHab
    });
    dialogRef.afterClosed().subscribe(r => {
      //console.log("datos de salida popUp", r)
      /*let wrapperRespuesta = new TbQoClientePago();
    
    wrapperRespuesta.observacion = this.observacion.value;*/

    if (this.tipo == "APROBADO"){
    }this.sinNoticeService.setNotice("CLIENTE YA ESTA GUARDADO", 'error');
      
  let user = localStorage.getItem(localStorage.key(2));
      this.rp.rechazarPago(this.idCliente, this.estado, this.tipo,user).subscribe(p => {
        //console.log(" >>> ", this.rp);

        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
        this.router.navigate(['../../asesor/bandeja-principal', this.idCliente]);
      }, error => {
        this.loadingSubject.next(false);
      })
    });
  }
  deletFila(row) {
    let data = this.dataSource.data;
    //console.log("esta es la fila q quiero borrar", row)
    data.splice(row, 1);
    this.dataSource = new MatTableDataSource<any>(data);
  };
  /*subirComponente() {
    if (confirm("Realmente quiere subir?")) {

    }
  }*/
  descargarComprobante(j) {
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

  ngOnInit() {
    this.subheaderService.setTitle("Bloqueo de Fondos");
    this.loading = this.loadingSubject.asObservable();
    this.ConsultarPagosId();
    //this.consultarClienteSoftbankCS();


  }

  /*consultarClienteSoftbankCS() {
    let entidadConsultaCliente = new ClienteSoftbank();
    entidadConsultaCliente.identificacion = this.identificacion;
    //console.log(" ---->>>>> ", entidadConsultaCliente.identificacion = this.identificacion);
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
  }*/

  ConsultarPagosId() {
    this.route.paramMap.subscribe((data: any) => {
      data.params.id;
      //console.log(" id = ? ", data.params.id)
      if (data.params.id) {
        this.idCliente = data.params.id;
        let tipodb = "BLOQUEO_FONDO";
        this.rp.clientePagoByIdCliente(this.idCliente, tipodb).subscribe((data: any) => {
          if (data) {
            let cliente = data.entidades[0].tbQoClientePago;
            this.nombreCliente.setValue(cliente.nombreCliente);
            this.cedula.setValue(cliente.cedula);
            this.codigoCuentaMupi.setValue(cliente.codigoCuentaMupi);
            //this.valorPreCancelado.setValue(cliente.valorPrecancelado);
            this.valorDepositado.setValue(cliente.valorDepositado);
            this.observacion.setValue(cliente.observacion);
            this.estado = cliente.estado;
            this.tipo = cliente.tipo;
            //console.log("Cliente: ----> ", this.estado);
            //console.log("Cliente: ----> ", this.tipo);
            //console.log("Consulta de pagos en clientePagoByIdCliente --> " + JSON.stringify(data));

            this.dataSource = new MatTableDataSource<any>(data.entidades);
          } else {
            this.sinNoticeService.setNotice("No me trajo datos 'clientePagoByIdCliente'", 'error');
          }
        }, error => {
          if (JSON.stringify(error).indexOf("codError") > 0) {
            let b = error.error;
            this.sinNoticeService.setNotice(b.msgError, 'error');
          } else {
            this.sinNoticeService.setNotice("Error no fue cacturado en 'clientePagoByIdCliente' :(", 'error');

          }
        })
      } else {

      }
    })
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
    if (pfield && pfield == "valorPreCancelado") {
      return this.valorPreCancelado.hasError('required') ? errorrequiredo : '';
    }
    if (pfield && pfield == "valorDepositado") {
      return this.valorDepositado.hasError('required') ? errorrequiredo : '';
    }
  }
}
