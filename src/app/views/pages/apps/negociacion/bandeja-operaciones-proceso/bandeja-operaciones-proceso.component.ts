import { ReasignarUsuarioComponent } from '../../../../partials/custom/popups/reasignar-usuario/reasignar-usuario.component';
import { OperacionesProcesoWrapper } from '../../../../../core/model/wrapper/OperacionesProcesoWrapper';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubheaderService } from '../../../../../core/_base/layout';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { WrapperBusqueda } from '../../../../../core/model/wrapper/WrapperBusqueda';
import { AuthDialogComponent } from '../../../../partials/custom/auth-dialog/auth-dialog.component';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';

export interface Agencia{
  id: number;
  nombre: string; 
  direccion: string;
  idResidencia: number; 
}

@Component({
  selector: 'kt-bandeja-operaciones-proceso',
  templateUrl: './bandeja-operaciones-proceso.component.html',
  styleUrls: ['./bandeja-operaciones-proceso.component.scss']
})
export class BandejaOperacionesProcesoComponent implements OnInit {
  /** ** @VARIABLES ** */
  public loading;
  public usuario: string;
  public rol: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private catAgencia : Array<Agencia>;
  public catProceso : Array<string>;
  public catEstadoProceso : Array<string>;
  public catActividad : Array<string>;
  




  /** ** @FORMULARIO ** */
  public formFiltro: FormGroup = new FormGroup({});
  public nombreCompleto = new FormControl('', [Validators.minLength(4), Validators.maxLength(403)]);
  public identificacion = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
  public proceso = new FormControl('');
  public fechaCreacionDesde = new FormControl('');
  public fechaCreacionHasta = new FormControl('');
  public estado = new FormControl('');
  public actividad = new FormControl('');
  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<OperacionesProcesoWrapper>();
  displayedColumns = ['Accion', 'codigoBpm', 'codigoOperacion', 'nombreCliente', 'cedulaCliente', 'montoPreaprobado', 'fechaCreacion', 'agencia', 'estadoProceso', 'proceso', 'asesor', 'usuarioEjecutor','actividad'];

  constructor(
    private pro: ProcesoService,
    private sof: SoftbankService,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService
  ) {
    /** ** @FORMULARIO ** */
    this.formFiltro.addControl("nombreCompleto", this.nombreCompleto);
    this.formFiltro.addControl("identificacion", this.identificacion);
    this.formFiltro.addControl("proceso", this.proceso);
    this.formFiltro.addControl("fechaCreacionDesde", this.fechaCreacionDesde);
    this.formFiltro.addControl("fechaCreacionHasta", this.fechaCreacionHasta);
    this.formFiltro.addControl("estado", this.estado);
    this.formFiltro.addControl("actividad", this.actividad);
  }

  ngOnInit() {
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    //this.usuario = 'Jero';
    //this.rol = "SUPERVISOR"; 
    this.rol = "ASESOR";
    this.cargarCatalogosOperacionesAndEnums();
    this.cargarEnumBase();

  }

  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private buscarOperaciones(wrapper?: WrapperBusqueda) {
    this.loadingSubject.next(true);
    wrapper.asesor = this.rol != "SUPERVISOR" ? this.usuario : null;
    this.pro.buscarOperaciones(wrapper).subscribe( (data: any) =>{
      if( data.entidad != null && data.entidad.operaciones != null){
        let operaciones: OperacionesProcesoWrapper[] = data.entidad.operaciones;
        operaciones.forEach(e=>{
          if(e.idAgencia && this.catAgencia){
            this.catAgencia.forEach( c =>{
              if(e.idAgencia == c.id){
                e.agencia = c.nombre;
              }
            });
          }else{
            e.agencia = "Sin Agencia";
          }
          
          if(e.actividad ==" " || e.actividad =="null"){
            e.actividad = "Sin Tracking";
          }else{
            e.actividad = e.actividad.replace(/_/gi," ");
          }
          e.estadoProceso = e.estadoProceso.replace(/_/gi," ");
          e.nombreCliente = e.nombreCliente.replace(/_/gi," ");
          e.proceso = e.proceso.replace(/_/gi," ");
          if(e.montoPreaprobado == "0"){
            e.montoPreaprobado = "No Aplica";
          }
        });
        this.dataSource.data = operaciones;
        this.paginator.length = data.entidad.result;
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        this.paginator.length = 0;
        this.dataSource.data = null;
        console.log("Me cai en la busqueda :c");
      }
    }, error => {this.pro.HandleError(error,this.sinNotSer,this.dialog); });
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @FUNCIONALIDAD ** */
  public getErrorMessage(pfield: string) {
    const errorNumero = 'Ingresar solo numeros';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';

    if (pfield && pfield === 'nombreCompleto') {
      const input = this.nombreCompleto;
      return input.hasError("maxlength") ? errorLogitudExedida :
        input.hasError("minlength") ? errorInsuficiente :
          "";
    }

    if (pfield && pfield === "identificacion") {
      const input = this.formFiltro.get("identificacion");
      return input.hasError("pattern") ? errorNumero :
        input.hasError("invalid-identification") ? invalidIdentification :
          input.hasError("maxlength") ? errorLogitudExedida :
            input.hasError("minlength") ? errorInsuficiente :
              "";
    }
  }
  private capturaError(error: any) {
    if (error.error) {
      if (error.error.codError) {
        this.sinNotSer.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
      } else {
        this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
      }
    } else if (error.statusText && error.status == 401) {
      this.dialog.open(AuthDialogComponent, {
        data: {
          mensaje: "Error " + error.statusText + " - " + error.message
        }
      });
    } else {
      this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
    }
  }
  private cargarCatalogosOperacionesAndEnums(){
    this.loadingSubject.next(true);
    this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
      if(!data.existeError){
        this.catAgencia = data.catalogo;
        this.buscarOperaciones( new WrapperBusqueda() );
      } else {
        console.log("Me cai en la Cat de agencia :c");
      }
    }, error =>{this.pro.HandleError( error,this.sinNotSer,this.dialog ) });
  }
  private cargarEnumBase(){
    this.loadingSubject.next(true);
    this.pro.getEstadosProceso().subscribe( (dataEstado: any) =>{
      if(dataEstado.entidades != null){
        this.catEstadoProceso = dataEstado.entidades;
        this.pro.getProcesos().subscribe( (dataProceso: any) =>{
          if(dataProceso.entidades != null){
            this.catProceso = dataProceso.entidades;
            this.pro.getActividades().subscribe( (dataActividad: any) =>{
              if(dataActividad.entidades != null){
                this.catActividad = dataActividad.entidades;
                this.loadingSubject.next(false);
              }
            }, error =>{this.pro.HandleError( error,this.sinNotSer,this.dialog )});
          }else {
            console.log("Me cai en la busqueda de enums de procesos :c");
          }
        }, error => {this.pro.HandleError(error,this.sinNotSer,this.dialog) });
      } else{
        console.log("Me cai buscando Los estados de procesos :c ");
      }
    }, error => {this.pro.HandleError(error,this.sinNotSer,this.dialog) });
  }
  public limpiarFiltros(){
    Object.keys(this.formFiltro.controls).forEach((name) => {
      const control = this.formFiltro.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.buscarOperaciones(new WrapperBusqueda());
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
  public buscar( limite: number, pagina: number ){
    if(this.formFiltro.valid){
      let w;
      if(limite && pagina){
         w = new WrapperBusqueda(this.paginator.pageSize,this.paginator.pageIndex, null);
      }else{
         w = new WrapperBusqueda();
      }
      if(this.estado.value != "" && this.estado.value != null){
        console.log("estado -->", this.estado.value);
        w.estado = this.estado.value.replace(/ /gi,"_",);
      }
      if(this.actividad.value != "" && this.actividad.value!= null){
        console.log("actividad -->", this.actividad.value);
        w.actividad = this.actividad.value.replace(/ /gi,"_",);
      }
      if(this.fechaCreacionDesde.value != "" && this.fechaCreacionDesde.value!= null){
        console.log("fechaCreacionDesde -->", this.fechaCreacionDesde.value);
        w.fechaCreacionDesde = this.fechaCreacionDesde.value;
      }
      if(this.fechaCreacionHasta.value != "" && this.fechaCreacionHasta.value!= null){
        console.log("fechaCreacionHasta -->", this.fechaCreacionHasta.value);
        w.fechaCreacionHasta = this.fechaCreacionHasta.value;
      }
      if(this.identificacion.value != "" && this.identificacion.value!= null){
        console.log("identificacion -->", this.identificacion.value);
        w.identificacion = this.identificacion.value;
      }
      if(this.nombreCompleto.value != "" && this.nombreCompleto.value!= null){
        console.log("nombreCompleto -->", this.nombreCompleto.value);
        w.nombreCompleto = this.nombreCompleto.value;
      }
      if(this.proceso.value != ""  && this.proceso.value!= null){
        console.log("proceso -->", this.proceso.value);
        w.proceso = this.proceso.value.replace(/ /gi,"_",);
      }

      this.buscarOperaciones( w );
    } else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');

    }
  }
  public verDetalle(row: OperacionesProcesoWrapper ){
    if(row.id != null){
      this.sinNotSer.setNotice("HISTORIA DE VER DETALLE AUN NO EXISTE","error");
      console.log('Me fui jiji ->',row.id);
      this.limpiarFiltros();
      this.router.navigate(['negociacion/bandeja-operaciones']);    
    }
  }
  public verOperacion(row: OperacionesProcesoWrapper ){
    if(row.id != null){
      if(row.proceso == 'NUEVO'){
        console.log('Me fui jiji ->',row.id);
        this.router.navigate(['negociacion/gestion-negociacion/NEG/',row.id]);    
      }
      if(row.proceso == 'RENOVACION'){
        this.sinNotSer.setNotice("HISTORIA DE RENOVACION AUN NO EXISTE","error");
        console.log('Me fui jiji ->',row.id);
        this.limpiarFiltros();
        this.router.navigate(['negociacion/bandeja-operaciones']);
      }
      if(row.proceso == 'DEVOLUCION'){
        this.sinNotSer.setNotice("HISTORIA DE DEVOLUCION AUN NO EXISTE","error");
        console.log('Me fui jiji ->',row.id);
        this.limpiarFiltros();
        this.router.navigate(['negociacion/bandeja-operaciones']);
      }
    }
  }
  public reasignar(row: OperacionesProcesoWrapper ){
    const dialogRefGuardar = this.dialog.open(ReasignarUsuarioComponent, {
      width: '500px',
      height: 'auto',
      data: row
    });
    dialogRefGuardar.afterClosed().subscribe((result: true) => {
      if (result) {
        this.sinNotSer.setNotice('USUARIO REASIGNADO PARA '+ row.codigoOperacion, 'success');
        this.limpiarFiltros();
      } else {
        this.sinNotSer.setNotice('SE CANCELÓ LA REASIGNACIÓN DE LA OPERACIÓN', 'error');
      }
    });
    
  }
  public irNegociacion(){
    this.router.navigate(['negociacion/gestion-negociacion']);    
  }
}
