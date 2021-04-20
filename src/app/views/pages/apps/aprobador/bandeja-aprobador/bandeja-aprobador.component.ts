import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { OperacionesAprobadorWrapper } from './../../../../../core/model/wrapper/OperacionesAprobadorWrapper';
import { ProcesoService } from './../../../../../core/services/quski/proceso.service';
import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { BusquedaAprobadorWrapper } from './../../../../../core/model/wrapper/BusquedaAprobadorWrapper';
import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';


export interface Agencia{
  id: number;
  nombre: string; 
  direccion: string;
  idResidencia: number; 
}

@Component({
  selector: 'kt-bandeja-aprobador',
  templateUrl: './bandeja-aprobador.component.html',
  styleUrls: ['./bandeja-aprobador.component.scss']
})
export class BandejaAprobadorComponent implements OnInit {
  /** ** @VARIABLES ** */
  public usuario: string;
  public catAgencia : Array<Agencia>;
  public catProceso : Array<string>;
  
  /** ** @FORMULARIO ** */
  public formFiltro: FormGroup = new FormGroup({});
  public cedula   = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
  public codigo   = new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]);
  public proceso  = new FormControl('');
  public agencia  = new FormControl('');

  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<OperacionesAprobadorWrapper>();
  displayedColumns = ['accion', 'codigoBpm', 'codigoOperacion', 'proceso', 'fechaSolicitud', 'cedulaCliente', 'nombreCliente', 'nombreAgencia', 'asesor', 'aprobador'];
  constructor(
    private pro: ProcesoService,
    private sof: SoftbankService,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService
  ) { 
    /** ** @FORMULARIO ** */
    this.formFiltro.addControl("cedula", this.cedula);
    this.formFiltro.addControl("codigo", this.codigo);
    this.formFiltro.addControl("proceso", this.proceso);
    this.formFiltro.addControl("agencia", this.agencia);
    this.pro.setParameter();
    this.sof.setParameter();
  }
  ngOnInit() {
    this.pro.setParameter();
    this.sof.setParameter();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.cargarCatalogos();
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private buscarOperaciones(wrapper?: BusquedaAprobadorWrapper) {
    this.pro.buscarOperacionesAprobador(wrapper).subscribe( (data: any) =>{
      if( data.entidad  && data.entidad.operaciones){
        let operaciones: OperacionesAprobadorWrapper[] = data.entidad.operaciones;
        operaciones.forEach(e=>{
          e.nombreAgencia = !e.idAgencia || e.idAgencia == 0 ? 'Sin Agencia' : this.catAgencia.find(a => a.id == e.idAgencia) ? this.catAgencia.find(a => a.id == e.idAgencia).nombre : 'Sin Agencia' ;  
          e.proceso = e.proceso.replace(/_/gi," ");
          e.nombreCliente = e.nombreCliente.replace(/_/gi," ");
          e.aprobador = e.aprobador ? e.aprobador.toUpperCase() == 'NULL' ? 'Libre' : e.aprobador : 'Libre';
          e.codigoOperacion = !e.codigoOperacion || e.codigoOperacion.toUpperCase() == 'NULL' ? 'Sin Codigo' : e.codigoOperacion;
          e.fechaSolicitud = e.fechaSolicitud;
        });
        this.dataSource.data = operaciones;
        this.paginator.length = data.entidad.result;
      } else {
        this.paginator.length = 0;
        this.dataSource.data = null;
      }
    });
  }
   /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @FUNCIONALIDAD ** */
   public getErrorMessage(pfield: string) {
    const errorNumero = 'Ingresar solo numeros';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';

    if (pfield && pfield === 'codigo') {
      const input = this.formFiltro.get("codigo");
      return input.hasError("maxlength") ? errorLogitudExedida :
        input.hasError("minlength") ? errorInsuficiente :
          "";
    }

    if (pfield && pfield === "cedula") {
      const input = this.formFiltro.get("cedula");
      return input.hasError("pattern") ? errorNumero :
        input.hasError("invalid-identification") ? invalidIdentification :
          input.hasError("maxlength") ? errorLogitudExedida :
            input.hasError("minlength") ? errorInsuficiente :
              "";
    }
  }
  private cargarCatalogos(){
    this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
      if(!data.existeError){
        this.catAgencia = data.catalogo;
        this.pro.getProcesos().subscribe( (data: any) =>{
          if(data.entidades != null){
            this.catProceso = data.entidades;
            this.buscarOperaciones( new BusquedaAprobadorWrapper() );
          } else{
            this.proceso.disable();
          }
        });
      } else {
        this.agencia.disable();
      }
    });
  }
  public limpiarFiltros(){
    Object.keys(this.formFiltro.controls).forEach((name) => {
      const control = this.formFiltro.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.buscarOperaciones(new BusquedaAprobadorWrapper() );
  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public paged() {
    this.buscar(this.paginator.pageSize, this.paginator.pageIndex);
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BOTONES ** */
  public buscar(limite: number, pagina: number ){
    if(this.formFiltro.valid){
      let w;
      if(limite || pagina){
         w = new BusquedaAprobadorWrapper(this.paginator.pageSize,this.paginator.pageIndex);
      }else{
        this.paginator.pageIndex = 0; 
         w = new BusquedaAprobadorWrapper(this.paginator.pageSize);
      }
      if(this.codigo.value != "" && this.codigo.value != null){
        w.codigo = this.codigo.value;
        w.codigo = w.codigo.toUpperCase();
        this.codigo.setValue(w.codigo);
      }
      if(this.cedula.value != "" && this.cedula.value != null){
        w.cedula = this.cedula.value;
      }
      if(this.agencia.value != "" && this.agencia.value != null){
        w.idAgencia = this.agencia.value.id;
      }
      if(this.proceso.value != ""  && this.proceso.value != null){
        w.proceso = this.proceso.value.replace(/ /gi,"_",);
      }
      this.buscarOperaciones( w );
    } else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');

    }
  }
  public abrirSolicitud(row: OperacionesAprobadorWrapper ){
    let mensaje = row.aprobador == 'Libre'
      ? 'Tomar y gestionar la operacion '+row.codigoBpm+'.' 
      : 'Tomar la operacion '+row.codigoBpm+', que actualmente esta tomada por: '+ row.aprobador;
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          if(row.id != null){
            this.pro.asignarAprobador( row.id, row.proceso.replace(/ /gi,"_",), this.usuario).subscribe( (data: any) =>{
              if(data.entidad){
                if(row.proceso =="NUEVO"){
                  this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['fabrica/aprobacion-credito-nuevo/',row.id]);    
                }
                if(row.proceso =="RENOVACION"){
                  this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['fabrica/aprobacion-novacion/',row.id]);    
                }
                if(row.proceso =="PAGO" && row.codigoBpm.includes('PAGO') ){
                  this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['credito-nuevo/gestion-credito/aprobar-pagos/',row.id]);
                }
                if(row.proceso =="PAGO" && row.codigoBpm.includes('BLOQ') ){
                  this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['credito-nuevo/gestion-credito/aprobar-bloqueo-fondos/',row.id]);  
                }
                if(row.proceso =="DEVOLUCION"){
                  this.pro.findByIdReferencia(row.id, row.proceso).subscribe( (dat:any) =>{
                    if(dat.entidad.estadoProceso == 'PENDIENTE_APROBACION_FIRMA'){
                      this.router.navigate(['devolucion/verificacion-firmas/', row.id]);
                      this.sinNotSer.setNotice("OPERACION DE VERIFICACION DE FIRMA ASIGNADA A: "+ data.entidad,"success");
                    }else{
                      this.router.navigate(['devolucion/aprobar-solicitud-devolucion/', row.id]);
                      this.sinNotSer.setNotice("OPERACION DE SOLICITUD DE DEVOLUCION ASIGNADA A: "+ data.entidad,"success");
                    }
                  });
                } 
                if(row.proceso =="CANCELACION DEVOLUCION"){
                  this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['devolucion/aprobacion-cancelacion-solicitud/', row.id]);
                }
                
                if(row.proceso =="VERIFICACION TELEFONICA"){
                  this.sinNotSer.setNotice("APROBACION VERIFICACION TELEFONICA, SIN DESARROLLO",'warning');
                  this.limpiarFiltros();
                  this.router.navigate(['aprobador']);    
                }
              }
            });
            
          } else{
            this.sinNotSer.setNotice('ERROR DE BASE, CONTACTE SOPORTE','error');
          }
        }else{
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','error');
        }

      });
  }

}
