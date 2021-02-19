
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatDialog, MatTableDataSource,  } from '@angular/material';
import { DialogoAprobarPagosComponent } from './dialogo-aprobar-pagos/dialogo-aprobar-pagos.component';
import { DialogoRechazarPagosComponent } from './dialogo-rechazar-pagos/dialogo-rechazar-pagos.component';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../..`/../../../../../../..//environments/environment';
import { ObjectStorageService } from './../../../../../../core/services/object-storage.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'kt-aprobar-pagos',
  templateUrl: './aprobar-pagos.component.html',
  styleUrls: ['./aprobar-pagos.component.scss']
})
export class AprobarPagosComponent implements OnInit {
  private usuario;
  private agencia;
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','descargarComprobante'];
  public displayedColumnsRubro = ['rubro','numeroCuota', 'proyectado', 'calculado', 'estado'];
  public dataSourceRubro = new MatTableDataSource<any>();
  
  private idCliente : string;
  private estado : string;
  private tipo : string;
  public formAprobarPago: FormGroup = new FormGroup({});
  public nombreCliente = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cedula = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public codigoOperacion = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public cuentaMupi = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public tipoCredito = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorPreCancelado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorDepositado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public observacion = new FormControl('', [Validators.maxLength(150)]);
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reg: RegistrarPagoService,
    private sof: SoftbankService,
    private sinNoticeService: ReNoticeService,
    public dialog: MatDialog
    ) {
    this.sof.setParameter();
    this.reg.setParameter();
    this.formAprobarPago.addControl("nombresCliente", this.nombreCliente);
    this.formAprobarPago.addControl("cedula", this.cedula);
    this.formAprobarPago.addControl("codigoOperacion", this.codigoOperacion);
    this.formAprobarPago.addControl("cuentaMupi", this.cuentaMupi);
    this.formAprobarPago.addControl("tipoCredito", this.tipoCredito);
    this.formAprobarPago.addControl("valorPreCancelado", this.valorPreCancelado);
    this.formAprobarPago.addControl("valorDepositado", this.valorDepositado);
    this.formAprobarPago.addControl("observacion", this.observacion);
  }
  ngOnInit() {
    this.reg.setParameter();
    this.sof.setParameter();
    this.consultaInicial();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.agencia = localStorage.getItem( 'idAgencia' );    
    this.formAprobarPago.disable();
  }
  private consultaInicial() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        let tipodb = "REGISTRO_PAGO";
        this.reg.clientePagoByIdCliente(data.params.id, tipodb).subscribe((data: any) => {
          if(data.entidades){
            this.dataSourceComprobante.data = data.entidades;
            let cliente = data.entidades[0].tbQoClientePago;
            this.nombreCliente.setValue(cliente.nombreCliente);
            this.cedula.setValue(cliente.cedula);
            this.consultaRubrosCS(cliente.codigoOperacion);
            this.codigoOperacion.setValue(cliente.codigoOperacion);
            this.cuentaMupi.setValue(cliente.codigoCuentaMupi);
            this.tipoCredito.setValue(cliente.tipoCredito);
            this.valorPreCancelado.setValue(cliente.valorPrecancelado);
            this.valorDepositado.setValue(cliente.valorDepositado);
            this.observacion.setValue(cliente.observacion);
            this.estado = cliente.estado;
            this.tipo = cliente.tipo;
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
  private consultaRubrosCS(numeroOperacion) {
    this.sof.consultaRubrosCS(numeroOperacion).subscribe((data: any) => {
      if (data) {
        this.dataSourceRubro = new MatTableDataSource<any>(data.rubros);
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
  }
  public enviarRespuesta(aprobar){

  }


  id;
  Aprobar() {
    //console.log("entra a popUp Aprobrar ")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoAprobarPagosComponent, {
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
    this.reg.aprobarPago(this.idCliente, this.estado, this.tipo, user ).subscribe(q => {
      //console.log(" >>> ", this.rp);

      this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
      this.router.navigate(['../../asesor/bandeja-principal', this.idCliente]);
    }, error => {
    });
  });
  }
  Rechazar() {
    //console.log("entra a popUp Rechazar")
    let idReferenciaHab = this.id;
    const dialogRef = this.dialog.open(DialogoRechazarPagosComponent, {
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
    this.reg.rechazarPago(this.idCliente, this.estado, this.tipo, user ).subscribe(p => {
      //console.log(" >>> ", this.rp);

      this.sinNoticeService.setNotice("CLIENTE GUARDADO CORRECTAMENTE", 'success');
      this.router.navigate(['../../asesor/bandeja-principal', this.idCliente]);
    }, error => {
    })
    });
  }

  descargarComprobante(j) {
    //this.os.getObjectById( j.archivo,this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
  }
}



