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
  public codigo   = new FormControl('', [Validators.maxLength(11)]);
  public proceso  = new FormControl('');
  public agencia  = new FormControl('');

  /** ** @TABLA ** */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<OperacionesAprobadorWrapper>();
  displayedColumns = ['accion', 'codigoBpm', 'codigoOperacion', 'proceso', 'fechaSolicitud', 'cedulaCliente', 'nombreCliente', 'nombreAgencia', 'asesor', 'aprobador','aciertos'];
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

        this.dataSource = new MatTableDataSource<any>(data.entidad.operaciones);
        this.paginator.length = data.entidad.result;
      } else {
        this.paginator.length = 0;
        this.dataSource.data = null;
      }
    });
  }

  getNombreAgencia(idAgencia){
    if(this.catAgencia && this.catAgencia.length >0){
       const age = this.catAgencia.find(p=>p.id ==idAgencia);
       return age?age.nombre:'SIN AGENCIA'
    }

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
        w.idAgencia = this.agencia.value;
      }
      if(this.proceso.value != ""  && this.proceso.value!= null){
        w.proceso = this.proceso.value.map( p=> {return p?p.replace(/ /gi,"_",):0 }) ;
      }
      this.buscarOperaciones( w );
    } else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');

    }
  }

  abrirSolicitud(row){
    this.pro.asignarAprobadorValidate( row.idReferencia, row.proceso, this.usuario, row.id).subscribe( (data: any) =>{
      if(data.entidad != this.usuario){
        let mensaje;
        mensaje = 'Tomar y gestionar la operacion '+row.codigoBpm+'. Que actualmente esta tomada por: '+ data.entidad;
        const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
          width: "800px",
          height: "auto",
          data: mensaje
        });
        dialogRef.afterClosed().subscribe(r => {
          if(r){

              this.asignar(row);

          }else{
            this.sinNotSer.setNotice('NO SE ASIGNO LA OPERACION','info');
          }

        });
      }else if(data.entidad == this.usuario){
        if(row.proceso =="NUEVO"){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/aprobacion-credito-nuevo/',row.idReferencia]);
        }
        if(row.proceso =="RENOVACION"){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/aprobacion-novacion/',row.idReferencia]);
        }
        if(row.proceso =="PAGO" && row.codigo.includes('PAGO') ){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/gestion-credito/aprobar-pagos/',row.idReferencia]);
        }
        if(row.proceso =="PAGO" && row.codigo.includes('BLOQ') ){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/gestion-credito/aprobar-bloqueo-fondos/',row.idReferencia]);
        }
        if(row.proceso =="DEVOLUCION"){
          this.pro.findByIdReferencia(row.idReferencia, row.proceso).subscribe( (dat:any) =>{
            if(dat.entidad.estadoProceso == 'PENDIENTE_APROBACION_FIRMA'){
              this.router.navigate(['devolucion/verificacion-firmas/', row.idReferencia]);
              this.sinNotSer.setNotice("OPERACION DE VERIFICACION DE FIRMA ASIGNADA A: "+ data.entidad,"success");
            }else{
              this.router.navigate(['devolucion/aprobar-solicitud-devolucion/', row.idReferencia]);
              this.sinNotSer.setNotice("OPERACION DE SOLICITUD DE DEVOLUCION ASIGNADA A: "+ data.entidad,"success");
            }
          });
        }
        if(row.proceso =="CANCELACION_DEVOLUCION"){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['devolucion/aprobacion-cancelacion-solicitud/', row.id]);
        }

        if(row.proceso =="VERIFICACION_TELEFONICA"){
          this.sinNotSer.setNotice("APROBACION VERIFICACION TELEFONICA, SIN DESARROLLO",'warning');
          this.limpiarFiltros();
          this.router.navigate(['aprobador']);
        }
      }
    });
  }

  asignar(row){
    this.pro.asignarAprobador( row.idReferencia, row.proceso, this.usuario, row.id).subscribe( (data: any) =>{
      if(data.entidad){
        if(row.proceso =="NUEVO"){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/aprobacion-credito-nuevo/',row.idReferencia]);
        }
        if(row.proceso =="RENOVACION"){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/aprobacion-novacion/',row.idReferencia]);
        }
        if(row.proceso =="PAGO" && row.codigo.includes('PAGO') ){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/gestion-credito/aprobar-pagos/',row.idReferencia]);
        }
        if(row.proceso =="PAGO" && row.codigo.includes('BLOQ') ){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['aprobador/gestion-credito/aprobar-bloqueo-fondos/',row.idReferencia]);
        }
        if(row.proceso =="DEVOLUCION"){
          this.pro.findByIdReferencia(row.idReferencia, row.proceso).subscribe( (dat:any) =>{
            if(dat.entidad.estadoProceso == 'PENDIENTE_APROBACION_FIRMA'){
              this.router.navigate(['devolucion/verificacion-firmas/', row.idReferencia]);
              this.sinNotSer.setNotice("OPERACION DE VERIFICACION DE FIRMA ASIGNADA A: "+ data.entidad,"success");
            }else{
              this.router.navigate(['devolucion/aprobar-solicitud-devolucion/', row.idReferencia]);
              this.sinNotSer.setNotice("OPERACION DE SOLICITUD DE DEVOLUCION ASIGNADA A: "+ data.entidad,"success");
            }
          });
        }
        if(row.proceso =="CANCELACION_DEVOLUCION"){
          this.sinNotSer.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
          this.router.navigate(['devolucion/aprobacion-cancelacion-solicitud/', row.id]);
        }

        if(row.proceso =="VERIFICACION_TELEFONICA"){
          this.sinNotSer.setNotice("APROBACION VERIFICACION TELEFONICA, SIN DESARROLLO",'warning');
          this.limpiarFiltros();
          this.router.navigate(['aprobador']);
        }
      }
    });
  }
  allSelecAgencias(all) {
    if (all.selected) {
      this.agencia
        .patchValue([...this.catAgencia.map(item => item.id), 0]);
    } else {
      this.agencia.patchValue([]);
    }
  }
  allSelecProcesos(all) {
    if (all.selected) {
      this.proceso
        .patchValue([...this.catProceso.map(item => item), 0]);
    } else {
      this.proceso.patchValue([]);
    }
  }

}
