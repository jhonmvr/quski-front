import { ExcepcionRolService } from '../../../../../core/services/quski/excepcionRol.service';
import { TbQoExcepcionRol } from '../../../../../core/model/quski/TbQoExcepcionRol';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../environments/environment';
import { SubheaderService } from '../../../../../core/_base/layout';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
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
  displayedColumnsExcepciones = ['accion', 'tipoExcepcion', 'nombreCliente','identificacion'];
  dataSourceExcepcionRol = new MatTableDataSource<TbQoExcepcionRol>();
  private agregar = new Array<TbQoExcepcionRol>();

  constructor(
    private subheaderService: SubheaderService,
    private exr: ExcepcionRolService,
    private router: Router,
    private sinNoticeService: ReNoticeService,
  ) {
    this.formBusqueda.addControl('cedula', this.identificacion);
    this.exr.setParameter();
  }

  ngOnInit() {
    this.exr.setParameter();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    console.log('valor del usuario==> ', this.usuario);
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
        //console.log('DATASOURCE==> ', JSON.stringify(this.dataSourceExcepcionRol));
      }
    });
  }
  public find() {
    this.dataSourceExcepcionRol = null;
    this.exr.findByRolAndIdentificacion(this.usuario, this.identificacion.value).subscribe((data: any) => {
      let listRecuperados = new Array<TbQoExcepcionRol>();
      this.agregar = new Array<TbQoExcepcionRol>();
      listRecuperados = data.list;
      //console.log('LISTRECUPERADOS==> ', listRecuperados);
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

  public verExcepcion(element) {
    if (element.tipoExcepcion == 'EXCEPCION_CLIENTE') {
      this.router.navigate(['./excepciones/excepcion-cliente/', btoa(JSON.stringify(element))])
    } else if (element.tipoExcepcion == 'EXCEPCION_RIESGO') {
      this.router.navigate(['./excepciones/excepcion-riesgo/', btoa(JSON.stringify(element))]);
    } else if (element.tipoExcepcion == 'EXCEPCION_COBERTURA') {
      this.router.navigate(['./excepciones/excepcion-cobertura/', btoa(JSON.stringify(element))])
    }


  }


  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
