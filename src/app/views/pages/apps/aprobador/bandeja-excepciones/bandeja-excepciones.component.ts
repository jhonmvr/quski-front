import { ExcepcionRolWrapper } from './../../../../../core/model/wrapper/ExcepcionRolWrapper';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ExcepcionRolService } from '../../../../../core/services/quski/excepcionRol.service';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { TbQoExcepcionRol } from '../../../../../core/model/quski/TbQoExcepcionRol';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-bandeja-excepciones',
  templateUrl: './bandeja-excepciones.component.html',
  styleUrls: ['./bandeja-excepciones.component.scss']
})
export class BandejaExcepcionesComponent implements OnInit {

  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  // STANDARD VARIABLES
  private loadingSubject = new BehaviorSubject<boolean>(false);
  usuario: string;

  displayedColumnsExcepciones = ['accion', 'tipoExcepcion', 'nombreCliente'];
  dataSourceExcepcionRol = new MatTableDataSource<TbQoExcepcionRol>();

  entidadCotizador: any;




  constructor(
    private exr: ExcepcionRolService,
    private router: Router,
  ) {
    this.formBusqueda.addControl('cedula', this.identificacion);

  }

  ngOnInit() {
    this.usuario = atob(localStorage.getItem(environment.userKey));
    console.log('valor del usuario==> ', this.usuario);
    this.busquedaExcepciones(this.usuario);
  }

  private busquedaExcepciones(rol: string) {
    this.loadingSubject.next(true);
    this.exr.findByRolAndIdentificacion(rol, null).subscribe((data: any) => {
      if (data && data.list) {

        this.dataSourceExcepcionRol = data.list;
        console.log('DATASOURCE==> ', JSON.stringify(this.dataSourceExcepcionRol));

      } else {

      }
      this.loadingSubject.next(false);

    });
  }
  public find() {
    this.loadingSubject.next(true);
    this.exr.findByRolAndIdentificacion(this.usuario, this.identificacion.value).subscribe((data: any) => {
      if (data && data.list) {

        this.dataSourceExcepcionRol = data.list;
        console.log('DATASOURCE find==> ', JSON.stringify(this.dataSourceExcepcionRol));

      } else {

      }
      this.loadingSubject.next(false);

    });

  }

  public verExcepcion(element) {
    this.loadingSubject.next(true);
    console.log('ELEMENT===> ', element);

    if (element.tipoExcepcion == 'EXCEPCION_CLIENTE') {
      console.log('ingresa a EXCEPCION_CLIENTE====> ', element.idNegociacion);
      this.router.navigate(['./excepciones/excepcion-cliente/', element.idNegociacion]);

    } else if (element.tipoExcepcion == 'EXCEPCION_RIESGO') {
      console.log('ingresa a EXCEPCION_RIESGO');
      this.router.navigate(['./excepciones/excepcion-riesgo/', element.idNegociacion]);


    } else if (element.tipoExcepcion == 'EXCEPCION_COBERTURA') {
      console.log('ingresa a EXCEPCION_COBERTURA');
      this.router.navigate(['./excepciones/excepcion-cobertura/', element.idNegociacion]);

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
