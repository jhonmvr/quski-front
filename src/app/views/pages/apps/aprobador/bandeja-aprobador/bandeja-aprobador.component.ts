import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { OperacionesAprobadorWrapper } from './../../../../../core/model/wrapper/OperacionesAprobadorWrapper';
import { ProcesoService } from './../../../../../core/services/quski/proceso.service';
import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from '../../../../partials/custom/auth-dialog/auth-dialog.component';
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
  public loading;
  public usuario: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public catAgencia : Array<Agencia>;
  public catProceso : Array<string>;
  
  /** ** @FORMULARIO ** */
  public formFiltro: FormGroup = new FormGroup({});
  public cedula   = new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]);
  public codigo   = new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]);
  public proceso  = new FormControl('');
  public agencia  = new FormControl('');

  /** ** @TABLA ** */
  dataSource = new MatTableDataSource<OperacionesAprobadorWrapper>();
  displayedColumns = ['accion', 'codigo', 'proceso', 'fechaSolicitud', 'cedulaCliente', 'nombreCliente', 'nombreAgencia', 'asesor', 'aprobador'];
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
    
  }

  ngOnInit() {
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey)).toUpperCase();
    this.cargarCatalogos();
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  private buscarOperaciones(wrapper: BusquedaAprobadorWrapper = null) {
    this.loadingSubject.next(true);
    if(wrapper == null){
      wrapper = new BusquedaAprobadorWrapper();
    }
    this.pro.buscarOperacionesAprobador(wrapper).subscribe( (data: any) =>{
      if( data.entidades != null ){
        console.log("Holis, soy la data -> ", data.entidades);
        let operaciones: OperacionesAprobadorWrapper[] = data.entidades;
        operaciones.forEach(e=>{
          this.catAgencia.forEach( c =>{
            if(e.idAgencia == c.id){
              e.nombreAgencia = c.nombre;
            }
          });
          e.proceso = e.proceso.replace("_"," ").replace("_"," ").replace("_"," ").replace("_"," ").replace("_"," ");
          e.nombreCliente = e.nombreCliente.replace("_"," ").replace("_"," ").replace("_"," ").replace("_"," ").replace("_"," ");
          if(e.aprobador == null || e.aprobador == "" || e.aprobador == "null"){
            e.aprobador = "Libre";
          }
        });
        this.dataSource.data = operaciones;
        this.loadingSubject.next(false);
      } else {
        this.loadingSubject.next(false);
        console.log("Me cai en la busqueda :c");
      }
    }, error => { this.capturaError(error); });
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
    this.loadingSubject.next(false);
  }
  private cargarCatalogos(){
    this.loadingSubject.next(true);
    this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
      if(!data.existeError){
        this.catAgencia = data.catalogo;
        this.pro.getProcesos().subscribe( (data: any) =>{
          if(data.entidades != null){
            this.catProceso = data.entidades;
            this.buscarOperaciones();
          } else{
            this.loadingSubject.next(false);
            this.proceso.disable();
            console.log("Me cai buscando Los estados de procesos :c ");
          }
        }, error => { this.capturaError(error) });
      } else {
        this.loadingSubject.next(false);
        this.agencia.disable();
        console.log("Me cai en la Cat de agencia :c");
      }
    }, error =>{ this.capturaError( error ) });
  }
  public limpiarFiltros(){
    Object.keys(this.formFiltro.controls).forEach((name) => {
      const control = this.formFiltro.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.buscarOperaciones();
  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BOTONES ** */
  public buscar(){
    if(this.formFiltro.valid){
      const w = new BusquedaAprobadorWrapper( );

      if(this.codigo.value != "" && this.codigo.value != null){
        w.codigo = this.codigo.value;
        w.codigo = w.codigo.toUpperCase();
        this.codigo.setValue(w.codigo);
        console.log("codigo --> ",w.codigo);
      }
      if(this.cedula.value != "" && this.cedula.value != null){
        console.log("cedula --> ", this.cedula.value);
        w.cedula = this.cedula.value;
      }
      if(this.agencia.value != "" && this.agencia.value != null){
        console.log("agencia --> ", this.agencia.value.id);
        w.idAgencia = this.agencia.value.id;
      }
      if(this.proceso.value != ""  && this.proceso.value != null){
        console.log("proceso --> ", this.proceso.value);
        w.proceso = this.proceso.value.replace(" ","_").replace(" ","_").replace(" ","_").replace(" ","_").replace(" ","_");
      }
      this.buscarOperaciones( w );
    } else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');

    }
  }
  public abrirSolicitud(row: OperacionesAprobadorWrapper ){
    let mensaje = row.aprobador == 'Libre'
      ? 'Tomar y gestionar la operacion '+row.codigo+'.' 
      : 'Tomar la operacion '+row.codigo+', que actualmente esta tomada por: '+ row.aprobador;

    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        console.log('result ---> ', r);
        if(r){
          if(row.id != null){
            if(row.proceso =="NUEVO"){
              this.limpiarFiltros();
              this.router.navigate(['fabrica/aprobacion-credito-nuevo/',row.id]);    
            }
            if(row.proceso =="RENOVACION"){
              this.sinNotSer.setNotice("APROBACION RENOVACION, SIN DESARROLLO","error");
              this.limpiarFiltros();
              this.router.navigate(['aprobador']);    
            }
            if(row.proceso =="COTIZACION"){
              this.sinNotSer.setNotice("APROBACION COTIZACION, SIN DESARROLLO","error");
              this.limpiarFiltros();
              this.router.navigate(['aprobador']);    
            }
            if(row.proceso =="PAGO"){
              this.sinNotSer.setNotice("APROBACION PAGO, SIN DESARROLLO","error");
              this.limpiarFiltros();
              this.router.navigate(['aprobador']);    
            }
            if(row.proceso =="DEVOLUCION"){
              this.sinNotSer.setNotice("APROBACION DEVOLUCION, SIN DESARROLLO","error");
              this.limpiarFiltros();
              this.router.navigate(['aprobador']);    
            }
            if(row.proceso =="VERIFICACION TELEFONICA"){
              this.sinNotSer.setNotice("APROBACION VERIFICACION TELEFONICA, SIN DESARROLLO","error");
              this.limpiarFiltros();
              this.router.navigate(['aprobador']);    
            }
          } else{
            this.sinNotSer.setNotice('ERROR DE BASE, CONTACTE SOPORTE','error');
          }
        }else{
          this.sinNotSer.setNotice('SE CANCELO LA ACCION','error');
        }

      });
  }
}
