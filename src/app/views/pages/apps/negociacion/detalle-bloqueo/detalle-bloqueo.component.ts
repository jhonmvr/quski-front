import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TbQoClientePago } from '../../../../../../app/core/model/quski/TbQoClientePago';
import { ObjectStorageService } from '../../../../../../app/core/services/object-storage.service';
import { RegistrarPagoService } from '../../../../../../app/core/services/quski/registrarPago.service';
import { SoftbankService } from '../../../../../../app/core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../../app/core/services/re-notice.service';
import { LayoutConfigService, SubheaderService } from '../../../../../../app/core/_base/layout';
import { environment } from '../../../../../../environments/environment';
import { saveAs } from 'file-saver';
import { ConfirmarAccionComponent } from '../../../../../../app/views/partials/custom/popups/confirmar-accion/confirmar-accion.component';


@Component({
  selector: 'kt-detalle-bloqueo',
  templateUrl: './detalle-bloqueo.component.html',
  styleUrls: ['./detalle-bloqueo.component.scss']
})
export class DetalleBloqueoComponent implements OnInit {
  public item: any;
  public cliente: TbQoClientePago;
  public dataSourceComprobante = new MatTableDataSource<any>();
  public displayedColumnsComprobante = ['intitucionFinanciera','cuenta','fechaPago','numeroDeDeposito','valorDepositado','descargarComprobante'];
  private catBanco: {id: number, nombre:string}[];
  public usuario;
  public correoUsuario: string;
  public formBloqueoFondo: FormGroup = new FormGroup({});
  public cedula = new FormControl('', []);
  public nombreCliente = new FormControl('', []);
  public codigoCuentaMupi = new FormControl('', []);
  public valorDepositado = new FormControl('', []);
  public observacion = new FormControl('', []);
  public observacionAprobador= new FormControl('', [Validators.maxLength(150)]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sof: SoftbankService,
    private layoutService: LayoutConfigService,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    private reg: RegistrarPagoService,
    private obj: ObjectStorageService,
    public dialog: MatDialog
  ) {
    this.sof.setParameter();
    this.reg.setParameter();
    this.obj.setParameter();
    this.formBloqueoFondo.addControl("nombresCliente", this.nombreCliente);
    this.formBloqueoFondo.addControl("cedula", this.cedula);
    this.formBloqueoFondo.addControl("codigoCuentaMupi", this.codigoCuentaMupi);
    this.formBloqueoFondo.addControl("valorDepositado", this.valorDepositado);
    this.formBloqueoFondo.addControl("observacion", this.observacion);
    this.formBloqueoFondo.addControl("observacionAprobador", this.observacionAprobador);
  }
  ngOnInit() {
    this.reg.setParameter();
    this.obj.setParameter();
    this.cargarCatalogos();
    this.consultaInicial();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.correoUsuario = localStorage.getItem( 'email' );
    this.formBloqueoFondo.disable();
  }
  
  private consultaInicial() {
    this.route.paramMap.subscribe((data: any) => {
      data.params.id;
      if (data.params.id) {
        this.item = data.params.id;        
        this.reg.clientePagoByIdCliente(this.item ).subscribe((data: any) => {
          if (data.entidades) {
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
            this.layoutService.setDatosContrato(datosCabecera);
            this.nombreCliente.setValue(this.cliente.nombreCliente);
            this.cedula.setValue(this.cliente.cedula);
            let banco = this.catBanco.find(x => x.id == this.cliente.codigoCuentaMupi);
            if(banco){
              this.codigoCuentaMupi.setValue( banco.nombre );
            }
            this.valorDepositado.setValue(this.cliente.valorDepositado);
            this.observacion.setValue(this.cliente.observacion);
            this.observacionAprobador.setValue(this.cliente.observacionAprobador);
            this.subheaderService.setTitle( "Proceso: " + this.cliente.codigo );
          } else {
            this.sinNoticeService.setNotice("No me trajo datos 'clientePagoByIdCliente'", 'error');
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

