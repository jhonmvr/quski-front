import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { ExcepcionRolService } from '../../../../../core/services/quski/excepcionRol.service';
import { TbQoExcepcionRol } from '../../../../../core/model/quski/TbQoExcepcionRol';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../environments/environment';
import { SubheaderService } from '../../../../../core/_base/layout';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-bandeja-excepciones',
  templateUrl: './bandeja-excepciones.component.html',
  styleUrls: ['./bandeja-excepciones.component.scss']
})
export class BandejaExcepcionesComponent implements OnInit {
  //FILTRO DE BUSQUEDA
  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  usuario: string;
  //VARIABLES DE LA TABLA
  displayedColumnsExcepciones = ['accion', 'tipoExcepcion', 'nombreCliente','identificacion','observacionAsesor'];
  dataSourceExcepcionRol = new MatTableDataSource<TbQoExcepcionRol>();
  private agregar = new Array<TbQoExcepcionRol>();

  constructor(
    private subheaderService: SubheaderService,
    private exr: ExcepcionRolService,
    private pro: ProcesoService,
    private dialog: MatDialog,
    private router: Router,
    private sinNoticeService: ReNoticeService,
  ) {
    this.formBusqueda.addControl('cedula', this.identificacion);
    this.exr.setParameter();
  }

  ngOnInit() {
    this.exr.setParameter();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.busquedaExcepciones(this.usuario);
    this.dataSourceExcepcionRol = null;
    this.subheaderService.setTitle("BANDEJA DE EXCEPCIONES");
  }
  /**
   * @description Método que realiza la búsqueda de la excepcion por medio del rol que se recupera en en OnInit
   * @author Kléber Guerra  - Relative Engine
   * @date 2020-09-30
   * @private
   * @param {string} rol
   * @memberof BandejaExcepcionesComponent
   */
  private busquedaExcepciones(rol: string) {
    this.exr.findByRolAndIdentificacion(rol, null).subscribe((data: any) => {
      if (data && data.list) {
        this.dataSourceExcepcionRol = data.list;
      }
    });
  }
  public limpiarFiltros(){
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.busquedaExcepciones(this.usuario);
  }
  public find() {
    this.dataSourceExcepcionRol = null;
    this.exr.findByRolAndIdentificacion(this.usuario, this.identificacion.value).subscribe((data: any) => {
      let listRecuperados = new Array<TbQoExcepcionRol>();
      this.agregar = new Array<TbQoExcepcionRol>();
      listRecuperados = data.list;
      if (listRecuperados) {
        this.dataSourceExcepcionRol = null;
        for (let index = 0; index < listRecuperados.length; index++) {
          if (this.identificacion.value === listRecuperados[index].identificacion) {
            let encontrados = new TbQoExcepcionRol();
            //console.log('INGRESA AL IF');
            encontrados = listRecuperados[index];
            this.agregar.push(encontrados);
          }
        }
      } else {
        this.sinNoticeService.setNotice('NO EXISTE ESA CEDULA', 'error');
      }
      this.dataSourceExcepcionRol = new MatTableDataSource(this.agregar);
    });

  }

  public traerExcepciones() {
    if (this.identificacion.value == "") {
      this.busquedaExcepciones(this.usuario);
    } else {
      this.find();
    }

  }
  public abrirSolicitud(row ){
    let mensaje = 'Tomar y gestionar la excepcion como: '+this.usuario;
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          if(row.id != null){
            this.pro.asignarAprobadorExcepcion( row.idNegociacion, this.usuario).subscribe( (data: any) =>{
              if(data.entidad){
                if (row.tipoExcepcion == 'EXCEPCION_CLIENTE') {
                  this.sinNoticeService.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['./excepciones/excepcion-cliente/', btoa(JSON.stringify(row))])
                } else if (row.tipoExcepcion == 'EXCEPCION_RIESGO') {
                  this.sinNoticeService.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['./excepciones/excepcion-riesgo/', btoa(JSON.stringify(row))]);
                } else if (row.tipoExcepcion == 'EXCEPCION_COBERTURA') {
                  this.sinNoticeService.setNotice("OPERACION ASIGNADA A: "+data.entidad,"success");
                  this.router.navigate(['./excepciones/excepcion-cobertura/', btoa(JSON.stringify(row))])
                }
              }
            });
          } else{
            this.sinNoticeService.setNotice('ERROR DE BASE, CONTACTE SOPORTE','error');
          }
        }else{
          this.sinNoticeService.setNotice('SE CANCELO LA ACCION','warning');
        }

      });
  }


  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
