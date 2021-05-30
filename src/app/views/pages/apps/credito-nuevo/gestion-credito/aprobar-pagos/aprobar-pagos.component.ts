import { ConfirmarAccionComponent } from './../../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { ObjectStorageService } from './../../../../../../core/services/object-storage.service';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { TbQoClientePago } from './../../../../../../core/model/quski/TbQoClientePago';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { environment } from './../..`/../../../../../../../environments/environment';
import { SubheaderService } from './../../../../../../core/_base/layout';
import { MatDialog, MatTableDataSource,  } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { ValidateDecimal } from './../../../../../../core/util/validator.decimal';


@Component({
  selector: 'kt-aprobar-pagos',
  templateUrl: './aprobar-pagos.component.html',
  styleUrls: ['./aprobar-pagos.component.scss']
})
export class AprobarPagosComponent implements OnInit {
  public usuario;
  public item: any;
  private catBanco: {id: number, nombre:string}[];
  public correoUsuario: string;
  public cliente: TbQoClientePago;
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','tipoPago','descargarComprobante'];
  public displayedColumnsRubro = ['rubro','numeroCuota', 'proyectado', 'calculado', 'estado'];
  public dataSourceRubro = new MatTableDataSource<any>();
  
  public formAprobarPago: FormGroup = new FormGroup({});
  public nombreCliente = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public cedula = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public codigoOperacion = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public cuentaMupi = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public tipoCredito = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorPreCancelado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public tipoPagoProceso = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public valorDepositadoAprobador = new FormControl('', [ValidateDecimal, Validators.required, Validators.maxLength(13)]);
  public valorDepositado = new FormControl('', [Validators.required, Validators.maxLength(13)]);
  public observacion = new FormControl('', [Validators.maxLength(150)]);
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reg: RegistrarPagoService,
    private obj: ObjectStorageService,
    private sof: SoftbankService,
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    public dialog: MatDialog
    ) {
      this.sof.setParameter();
      this.obj.setParameter();
      this.reg.setParameter();
    this.formAprobarPago.addControl("nombresCliente", this.nombreCliente);
    this.formAprobarPago.addControl("cedula", this.cedula);
    this.formAprobarPago.addControl("codigoOperacion", this.codigoOperacion);
    this.formAprobarPago.addControl("cuentaMupi", this.cuentaMupi);
    this.formAprobarPago.addControl("tipoCredito", this.tipoCredito);
    this.formAprobarPago.addControl("valorPreCancelado", this.valorPreCancelado);
    this.formAprobarPago.addControl("tipoPagoProceso", this.tipoPagoProceso);
    this.formAprobarPago.addControl("valorDepositado", this.valorDepositado);
    this.formAprobarPago.addControl("observacion", this.observacion);
  }
  ngOnInit() {
    this.obj.setParameter();
    this.reg.setParameter();
    this.sof.setParameter();
    this.cargarCatalogos();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.correoUsuario = localStorage.getItem( 'email' );
    this.formAprobarPago.disable();
  }
  private consultaInicial() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        this.item = data.params.id;
        this.reg.clientePagoByIdCliente(data.params.id).subscribe((data: any) => {
          if(data.entidades){
            this.dataSourceComprobante.data = data.entidades;
            this.dataSourceComprobante.data.forEach( e=>{
              e.institucionFinanciera = this.catBanco ? this.catBanco.find( x => x.id == e.institucionFinanciera ) ? this.catBanco.find( x => x.id == e.institucionFinanciera ) : { nombre: 'Error Catalogo' } : { nombre: 'Error Catalogo' };
            });
            this.cliente = data.entidades[0].tbQoClientePago;
            this.nombreCliente.setValue(this.cliente.nombreCliente);
            this.cedula.setValue(this.cliente.cedula);
            this.consultaRubrosCS(this.cliente.codigoOperacion);
            this.codigoOperacion.setValue(this.cliente.codigoOperacion);
            this.tipoCredito.setValue(this.cliente.tipoCredito);
            this.valorPreCancelado.setValue(this.cliente.valorPrecancelado);
            this.tipoPagoProceso.setValue(this.cliente.tipoPagoProceso);
            this.valorDepositado.setValue(this.cliente.valorDepositado);
            this.observacion.setValue(this.cliente.observacion);
            let banco = this.catBanco.find(x => x.id == this.cliente.codigoCuentaMupi);
            if(banco){
              this.cuentaMupi.setValue( banco.nombre );
            }
            this.subheaderService.setTitle( "Proceso: " + this.cliente.codigo );
          }
        }, error => {
          this.sinNoticeService.setNotice(error.error.msgError, 'error');
        })
      } else {
        this.sinNoticeService.setNotice("ID DE REFERNCIA NO ENCONTRADO", 'error');
      }
    });
  }
  private cargarCatalogos(){
    this.sof.consultarBancosCS().subscribe( data =>{
      this.catBanco = data.catalogo ? data.catalogo :  {nombre: 'No se cargo el catalogo. Error', id: 0};
      this.consultaInicial();
    });
  }
  private consultaRubrosCS(numeroOperacion) {
    this.sof.consultaRubrosCS(numeroOperacion).subscribe((data: any) => {
      if (data) {
        this.dataSourceRubro = new MatTableDataSource<any>(data.rubros);
      } else {
        this.sinNoticeService.setNotice("SIN RUBROS PARA ESTA OPERACION", 'warning');
      }
    }, error => {
      this.sinNoticeService.setNotice(error.error.msgError, 'error');
    });
  }
  public enviarRespuesta(aprobar){
    if(this.valorDepositadoAprobador.invalid){
      this.sinNoticeService.setNotice("INGRESE EL VALOR DEPOSITADO",'error');
    }
    let mensaje = aprobar ? 
    "Aprobar el proceso de registro de pago con el codigo: " + this.cliente.codigo:
    "Negar el proceso de registro de pago con el codigo: " + this.cliente.codigo;
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        
        this.reg.enviarRespuesta(this.cliente.id, true, aprobar, this.usuario, this.correoUsuario, this.valorDepositadoAprobador.value).subscribe((data: any) => {
          if(data.entidad.estadoProceso){
            if(aprobar && data.entidad.estadoProceso == "APROBADO"){
              this.sinNoticeService.setNotice("PROCESO DE PAGO APROBADO CORRECTAMENTE", 'success');
              this.router.navigate(['aprobador']);
            } else if(!aprobar && data.entidad.estadoProceso == "RECHAZADO"){
              this.sinNoticeService.setNotice("PROCESO DE PAGO RECHAZADO CORRECTAMENTE", 'success')
              this.router.navigate(['aprobador']);
            } else{
              this.sinNoticeService.setNotice(" ERROR, PROCESO DE PAGO NO FUE ACTUALIZADO", 'error')
            }
          }else{
            this.sinNoticeService.setNotice(" ERROR PROCESO DE PAGO DESCONOCIDO", 'error');
          }
        }, error => {
          this.sinNoticeService.setNotice(error.error.msgError, 'error');
        });
      }else{
        this.sinNoticeService.setNotice('SE CANCELO LA ACCION','error');
      }
    });
  }
  descargarComprobante(row) {
    this.obj.findObjectById( this.obj.mongoDb,  environment.mongoHabilitanteCollection, row.idComprobante).subscribe((data:any)=>{
      let json = JSON.parse(atob(data.entidad));
      console.log('Data? =>',json);
      saveAs(this.obj.dataURItoBlob(json.fileBase64), json.name);   
    }) 
  }
}



