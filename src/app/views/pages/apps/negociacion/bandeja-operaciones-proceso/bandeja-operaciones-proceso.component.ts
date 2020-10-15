import { ReasignarUsuarioComponent } from '../../../../partials/custom/popups/reasignar-usuario/reasignar-usuario.component';
import { OperacionesProcesoWrapper } from '../../../../../core/model/wrapper/OperacionesProcesoWrapper';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../../src/environments/environment';
import { ValidateCedula } from '../../../../../core/util/validate.util';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubheaderService } from '../../../../../core/_base/layout';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { WrapperBusqueda } from '../../../../../core/model/wrapper/WrapperBusqueda';
import { AuthDialogComponent } from '../../../../partials/custom/auth-dialog/auth-dialog.component';

@Component({
  selector: 'kt-bandeja-operaciones-proceso',
  templateUrl: './bandeja-operaciones-proceso.component.html',
  styleUrls: ['./bandeja-operaciones-proceso.component.scss']
})
/** ** @TODO: Agregar validacion de los campos ** */
export class BandejaOperacionesProcesoComponent implements OnInit {
  /** ** @VARIABLES ** */
  public loading;
  public usuario: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  /** ** @FORMULARIO ** */
  public formFiltro: FormGroup = new FormGroup({});
  public nombreCompleto = new FormControl('', [Validators.minLength(4), Validators.maxLength(403)]);
  public identificacion = new FormControl('', [ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public proceso = new FormControl('');
  public fechaCreacionDesde = new FormControl('');
  public fechaCreacionHasta = new FormControl('');
  public estado = new FormControl('');
  public actividad = new FormControl('');
  /** ** @TABLA ** */
  dataSource = new MatTableDataSource<OperacionesProcesoWrapper>();
  displayedColumns = ['Accion', 'codigoOperacion', 'nombreCliente', 'identificacion', 'montoPreAprobado', 'fechaCreacion', 'situacion', 'agencia', 'estado', 'proceso', 'asesor', 'aprobador'];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private sinNotSer: ReNoticeService,
    private pro: ProcesoService,
    private subheaderService: SubheaderService
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
    this.subheaderService.setTitle('NEGOCIACIÓN');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey))
    this.buscarOperaciones();
  }

  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BUSQUEDA ** */
  public buscarOperaciones(wrapper: WrapperBusqueda = null) {
    if(wrapper == null){
      wrapper = new WrapperBusqueda( this.usuario );
    }
    this.pro.buscarOperaciones(wrapper).subscribe( (data: any) =>{
      if( data.list != null ){
        // @TODO: Cargar cosas; 
      }
    }, error => { this.capturaError(error); });
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
  /** ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * @BOTONES ** */
  public buscar(){
    if(this.formFiltro.valid){
      const w = new WrapperBusqueda( this.usuario );
      w.estado = this.estado.value;
      w.actividad = this.actividad.value;
      w.fechaCreacionDesde = this.fechaCreacionDesde.value;
      w.fechaCreacionHasta = this.fechaCreacionHasta.value;
      w.identificacion = this.identificacion.value;
      w.nombreCompleto = this.nombreCompleto.value;
      w.proceso = this.proceso.value;
      this.buscarOperaciones( w );
    } else{
      this.sinNotSer.setNotice('COMPLETE LOS CAMPOS CORRECTAMENTE', 'error');

    }
  }
  public verDetalle(row: OperacionesProcesoWrapper ){
    if(row.idNegociacion != null){
      this.router.navigate(['negociacion/bandeja-operaciones']);    
    }
  }
  public verOperacion(row: OperacionesProcesoWrapper ){
    if(row.idNegociacion != null){
      this.router.navigate(['negociacion/gestion-negociacion/NEG/',row.idNegociacion]);    
    }
  }
  public reasignar(row: OperacionesProcesoWrapper ){
    const dialogRefGuardar = this.dialog.open(ReasignarUsuarioComponent, {
      width: '800px',
      height: 'auto',
      data: row
    });
    dialogRefGuardar.afterClosed().subscribe((result: true) => {
      if (result) {
        this.sinNotSer.setNotice('USUARIO REASIGNADO PARA '+ row.codigoOperacion, 'success');
        this.buscarOperaciones
      } else {
        this.sinNotSer.setNotice('SE CANCELÓ LA REASIGNACIÓN DE LA OPERACIÓN', 'error');
      }
    });
    
  }
}
