import { ReasignarUsuarioComponent } from '../../../../partials/custom/popups/reasignar-usuario/reasignar-usuario.component';
import { OperacionesProcesoWrapper } from '../../../../../core/model/wrapper/OperacionesProcesoWrapper';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { WrapperBusqueda } from '../../../../../core/model/wrapper/WrapperBusqueda';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';

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
  public catAgencia : Array<Agencia>;
  public catProceso : Array<string>;
  public catEstadoProceso : Array<string>;
  public catActividad : Array<string>;
  public catRolReasignacion : Array<any>;
  public catRolAsesores : Array<any>;
  



  /** ** @FORMULARIO ** */
  public formFiltro: FormGroup = new FormGroup({});
  public nombreCompleto = new FormControl('', [Validators.minLength(4), Validators.maxLength(403)]);
  public identificacion = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
  public proceso = new FormControl('');
  public fechaCreacionDesde = new FormControl('');
  public fechaCreacionHasta = new FormControl('');
  public estado = new FormControl('');
  public actividad = new FormControl('');
  public codigoBpm = new FormControl('');
  public codigoSoft = new FormControl('');
  public agencia = new FormControl('');
  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<OperacionesProcesoWrapper>();
  displayedColumns = ['Accion', 'codigoBpm', 'codigoOperacion', 'nombreCliente', 'cedulaCliente', 'montoFinanciado', 'fechaCreacion', 'agencia', 'estadoProceso', 'proceso', 'asesor', 'usuarioEjecutor','actividad'];

  constructor(
    private pro: ProcesoService,
    private par: ParametroService,
    private sof: SoftbankService,
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService
  ) {
    this.pro.setParameter();
    this.sof.setParameter();
    /** ** @FORMULARIO ** */
    this.formFiltro.addControl("nombreCompleto", this.nombreCompleto);
    this.formFiltro.addControl("identificacion", this.identificacion);
    this.formFiltro.addControl("proceso", this.proceso);
    this.formFiltro.addControl("fechaCreacionDesde", this.fechaCreacionDesde);
    this.formFiltro.addControl("fechaCreacionHasta", this.fechaCreacionHasta);
    this.formFiltro.addControl("estado", this.estado);
    this.formFiltro.addControl("actividad", this.actividad);
    this.formFiltro.addControl("codigoBpm", this.codigoBpm);
    this.formFiltro.addControl("codigoSoft", this.codigoSoft);
    this.formFiltro.addControl("agencia", this.agencia);
  }

  ngOnInit() {
    this.pro.setParameter();
    this.sof.setParameter();
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.rol = localStorage.getItem( 're1001' );
    console.log( 'Rol => ', this.rol);
    this.cargarEnumBase();

  }

  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private buscarOperaciones(wrapper?: WrapperBusqueda) {
    wrapper.asesor = null;
    if( this.catRolAsesores ){
      this.catRolAsesores.forEach( e=>{
        if( this.rol == e.valor ){
          console.log( 'Rol => ', e.valor);
          wrapper.asesor = this.usuario; 
          return;
        }
      });
    }  
    this.pro.buscarOperaciones(wrapper).subscribe( (data: any) =>{
      if( data.entidad != null && data.entidad.operaciones != null){
        let operaciones: OperacionesProcesoWrapper[] = data.entidad.operaciones;
        operaciones.forEach(e=>{
          if(this.catAgencia){
            e.agencia = !e.idAgencia || e.idAgencia == 0 ? 'Sin Agencia' : this.catAgencia.find( a => a.id == e.idAgencia ) ? this.catAgencia.find( a => a.id == e.idAgencia ).nombre : 'Sin Agencia';
          }
          e.actividad = !e.actividad || e.actividad == ' ' || e.actividad.toUpperCase() == 'NULL' ? 'Sin Actividad' : e.actividad.replace(/_/gi," ");
          e.codigoOperacion = !e.codigoOperacion || e.codigoOperacion.toUpperCase() == 'NULL' ? "Sin Codigo Softbank": e.codigoOperacion;
          e.montoFinanciado = !e.montoFinanciado || e.montoFinanciado == '0' ? 'No Aplica' : '$'+e.montoFinanciado;
          e.estadoProceso = e.estadoProceso.replace(/_/gi," ");
          e.nombreCliente = e.nombreCliente.replace(/_/gi," ");
          e.proceso = e.proceso.replace(/_/gi," ");
          e.asesor = e.asesor && e.asesor != 'NULL' ? e.asesor : 'Sin Asesor';    
          e.usuarioEjecutor = e.usuarioEjecutor && e.usuarioEjecutor != 'NULL' ? e.usuarioEjecutor : 'Sin Usuario';  
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

    if (pfield && pfield === 'nombreCompleto') {
      const input = this.nombreCompleto;
      return input.hasError("maxlength") ? errorLogitudExedida :
        input.hasError("minlength") ? errorInsuficiente :
          "";
    }
    if (pfield && pfield === 'codigos') {
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
  private cargarCatalogosOperacionesAndEnums(){
    this.loadingSubject.next(true);
    this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
      if(!data.existeError){
        this.catAgencia = data.catalogo;
        this.buscarOperaciones( new WrapperBusqueda() );
      } else {
        //console.log("Me cai en la Cat de agencia :c");
      }
    });
  }
  public validarReasignacion( element ){
    if(element.estadoProceso != 'APROBADO' && element.estadoProceso != 'RECHAZADO' && element.estadoProceso != 'CANCELADO' && element.estadoProceso != 'CADUCADO'){
      if( element.asesor == this.usuario ){
        return true;
      }
      if( this.catRolReasignacion ){
        if( this.catRolReasignacion.find( x => x.valor == this.rol ) ){
          return true;
        }
      }
    }
    return false;
  }
  private cargarEnumBase(){
    this.par.findByTipo('PERFIL-ASESOR').subscribe( (data: any)=>{
      this.catRolAsesores = data.entidades ? data.entidades : null;
      this.par.findByTipo('PERFIL-REASIG').subscribe( (data: any) =>{
        this.catRolReasignacion = data.entidades ? data.entidades : null;
        this.pro.getEstadosProceso().subscribe( (dataEstado: any) =>{
          this.catEstadoProceso = dataEstado.entidades ? dataEstado.entidades : [];
          this.pro.getProcesos().subscribe( (dataProceso: any) =>{
            this.catProceso = dataProceso.entidades ? dataProceso.entidades : [];
            this.pro.getActividades().subscribe( (dataActividad: any) =>{
              this.catActividad = dataActividad.entidades ? dataActividad.entidades : [];
              this.cargarCatalogosOperacionesAndEnums();
            });
            });
        });
      });
    });
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
      if(limite || pagina){
         w = new WrapperBusqueda(this.paginator.pageSize,this.paginator.pageIndex, null);
      }else{
        this.paginator.pageIndex = 0; 
         w = new WrapperBusqueda(this.paginator.pageSize);
      }
      if(this.estado.value != "" && this.estado.value != null){
        w.estado = this.estado.value.replace(/ /gi,"_",);
      }      
      if(this.codigoBpm.value){
        w.codigoBpm = this.codigoBpm.value.replace(/ /gi,"",);
      }      
      if(this.codigoSoft.value){
        w.codigoSoft = this.codigoSoft.value.replace(/ /gi,"",);
      }
      if(this.actividad.value != "" && this.actividad.value!= null){
        w.actividad = this.actividad.value.replace(/ /gi,"_",);
      }
      if(this.fechaCreacionDesde.value != "" && this.fechaCreacionDesde.value!= null){
        w.fechaCreacionDesde = this.fechaCreacionDesde.value;
      }
      if(this.fechaCreacionHasta.value != "" && this.fechaCreacionHasta.value!= null){
        w.fechaCreacionHasta = this.fechaCreacionHasta.value;
      }
      if(this.identificacion.value != "" && this.identificacion.value!= null){
        w.identificacion = this.identificacion.value;
      }
      if(this.nombreCompleto.value != "" && this.nombreCompleto.value!= null){
        w.nombreCompleto = this.nombreCompleto.value;
      }
      if(this.proceso.value != ""  && this.proceso.value!= null){
        w.proceso = this.proceso.value.replace(/ /gi,"_",);
      }

      this.buscarOperaciones( w );
    } else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');

    }
  }
  public verDetalle(row: OperacionesProcesoWrapper ){
    if(row.id != null){
      if(row.proceso == 'NUEVO'){
        this.router.navigate(['negociacion/detalle-negociacion/', row.id]);       
      }else if(row.proceso == 'RENOVACION'){
        this.router.navigate(['negociacion/detalle-negociacion/', row.id]);      
      }else if(row.proceso == 'DEVOLUCION'){
        this.router.navigate(['devolucion/detalle-devolucion/',row.id]);
      }
   
    }
  }
  public cancelarDevolucion(row: OperacionesProcesoWrapper ){
    if(row.id != null){
        this.router.navigate(['devolucion/cancelacion-solicitud/', row.id]);       
    }
  }
  public verOperacion(row: OperacionesProcesoWrapper ){
    if(row.id != null){
      if(row.proceso == 'NUEVO'){
        this.router.navigate(['negociacion/gestion-negociacion/NEG/',row.id]);    
      }else if(row.proceso == 'RENOVACION'){
        this.router.navigate(['novacion/crear-novacion/NOV/', row.id]);
      }else if(row.proceso == 'DEVOLUCION' && row.estadoProceso == 'ARRIBADO'){
        this.router.navigate(['devolucion/entrega-recepcion/',row.id]);
      }else if(row.proceso == 'DEVOLUCION' && row.estadoProceso == 'CREADO' ){
        this.router.navigate(['devolucion/solicitud-devolucion/EDIT/',row.id]);
      }
    }
  }
  public reasignar(row: OperacionesProcesoWrapper ){
    const dialogRefGuardar = this.dialog.open(ReasignarUsuarioComponent, {
      width: '500px',
      maxHeight:'700px',
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
