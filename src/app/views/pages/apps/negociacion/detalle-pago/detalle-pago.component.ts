import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TbQoClientePago } from '../../../../../../app/core/model/quski/TbQoClientePago';
import { ObjectStorageService } from '../../../../../../app/core/services/object-storage.service';
import { RegistrarPagoService } from '../../../../../../app/core/services/quski/registrarPago.service';
import { SoftbankService } from '../../../../../../app/core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../../app/core/services/re-notice.service';
import { ValidateDecimal } from '../../../../../../app/core/util/validator.decimal';
import { LayoutConfigService, SubheaderService } from '../../../../../../app/core/_base/layout';
import { ConfirmarAccionComponent } from '../../../../../../app/views/partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { environment } from '../../../../../../environments/environment';
import { saveAs } from 'file-saver';
import { TablaAmortizacionComponent } from './../../../../../../app/views/partials/custom/popups/tabla-amortizacion/tabla-amortizacion.component';

@Component({
  selector: 'kt-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.scss']
})
export class DetallePagoComponent implements OnInit {
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
  public codigoOperacionMupi = new FormControl('',[]);
  
  public observacionAprobador= new FormControl('', [Validators.maxLength(150)]);
 
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reg: RegistrarPagoService,
    private layoutSeervice: LayoutConfigService,
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
    this.formAprobarPago.addControl("observacionAprobador", this.observacionAprobador);
    this.formAprobarPago.addControl("codigoOperacionMupi", this.codigoOperacionMupi);
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
            let datosCabecera = {
              nombre: this.cliente.nombreCliente,
              cedula: this.cliente.cedula,
              numeroCredito: this.cliente.codigoOperacion,
              codigoBPM: this.cliente.codigo,
              monto: this.cliente.montoCredito,
              plazo: this.cliente.plazoCredito,
              tipoCredito: this.cliente.tipoCredito,
              numeroCuenta:this.cliente.numeroCuentaCliente,
              nombreAsesor: this.cliente.nombreAsesor
            };
            this.layoutSeervice.setDatosContrato(datosCabecera);
            this.nombreCliente.setValue(this.cliente.nombreCliente);
            this.cedula.setValue(this.cliente.cedula);
            this.consultaRubrosCS(this.cliente.codigoOperacion);
            this.codigoOperacion.setValue(this.cliente.codigoOperacion);
            this.tipoCredito.setValue(this.cliente.tipoCredito);
            this.valorPreCancelado.setValue(this.cliente.valorPrecancelado);
            this.tipoPagoProceso.setValue(this.cliente.tipoPagoProceso);
            this.valorDepositado.setValue(this.cliente.valorDepositado);
            this.observacion.setValue(this.cliente.observacion);
            this.observacionAprobador.setValue(this.cliente.observacionAprobador);
            this.codigoOperacionMupi.setValue(this.cliente.codigoCuentaMupi);
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

  descargarComprobante(row) {
    this.obj.findObjectById( this.obj.mongoDb,  environment.mongoHabilitanteCollection, row.idComprobante).subscribe((data:any)=>{
      let json = JSON.parse(atob(data.entidad));
      console.log('Data? =>',json);
      saveAs(this.obj.dataURItoBlob(json.fileBase64), json.name);   
    }) 
  }

  public mostrarTablaDeAmortizacion() {
    this.sof.consultaTablaAmortizacionOperacionAprobadaCS(this.codigoOperacion.value).subscribe(p => {
      const dialogRef = this.dialog.open(TablaAmortizacionComponent, {
        width: "800px",
        height: "auto",
        data: p.cuotas
      })
    });

  }
}



