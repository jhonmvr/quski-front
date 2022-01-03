import { ConfirmarAccionComponent } from './../../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { RegistrarPagoService } from './../../../../../../core/services/quski/registrarPago.service';
import { ObjectStorageService } from './../../../../../../core/services/object-storage.service';
import { SoftbankService } from './../../../../../../core/services/quski/softbank.service';
import { TbQoClientePago } from './../../../../../../core/model/quski/TbQoClientePago';
import { ReNoticeService } from './../../../../../../core/services/re-notice.service';
import { environment } from './../..`/../../../../../../../environments/environment';
import { LayoutConfigService, SubheaderService } from './../../../../../../core/_base/layout';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
@Component({
  selector: 'kt-aprobar-bloqueo-fondos',
  templateUrl: './aprobar-bloqueo-fondos.component.html',
  styleUrls: ['./aprobar-bloqueo-fondos.component.scss']
})
export class AprobarBloqueoFondosComponent implements OnInit {
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

  public enviarRespuesta(aprobar){
    let mensaje = aprobar ? 
    "Aprobar el proceso de registro de bloqueo con el codigo: " + this.cliente.codigo:
    "Negar el proceso de registro de bloqueo con el codigo: " + this.cliente.codigo;
      const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
    dialogRef.afterClosed().subscribe(r => {
      if(r){
        let valor 
        this.reg.enviarRespuesta(this.cliente.id, false, aprobar, this.usuario, this.correoUsuario, valor).subscribe((data: any) => {
          if(data.entidad.estadoProceso){
            if(aprobar && data.entidad.estadoProceso == "APROBADO"){
              this.sinNoticeService.setNotice("PROCESO DE BLOQUEO DE FONDOS APROBADO CORRECTAMENTE", 'success');
              this.router.navigate(['aprobador']);
            } else if(!aprobar && data.entidad.estadoProceso == "RECHAZADO"){
              this.sinNoticeService.setNotice("PROCESO DE BLOQUEO DE FONDOS RECHAZADO CORRECTAMENTE", 'success')
              this.router.navigate(['aprobador']);
            } else{
              this.sinNoticeService.setNotice(" ERROR, PROCESO DE BLOQUEO DE FONDOS NO FUE ACTUALIZADO", 'error')
            }
          }else{
            this.sinNoticeService.setNotice(" ERROR PROCESO DE BLOQUEO DE FONDOS DESCONOCIDO", 'error');
          }
        }, error => {
          this.sinNoticeService.setNotice(error.error.msgError, 'error');
        });
      }else{
        this.sinNoticeService.setNotice('SE CANCELO LA ACCION','error');
      }
    });
  }
}
