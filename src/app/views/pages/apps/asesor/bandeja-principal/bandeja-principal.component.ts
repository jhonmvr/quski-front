import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { TbQoPrecioOro } from '../.././../../../../app/core/model/quski/TbQoPrecioOro';



@Component({
  selector: 'kt-bandeja-principal',
  templateUrl: './bandeja-principal.component.html',
  styleUrls: ['./bandeja-principal.component.scss']
})
export class BandejaPrincipalComponent implements OnInit {
  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public codigoOperacion = new FormControl('', []);
  public tipoDevolucion = new FormControl('', []);

  displayedColumnsDevoluciones = ['referencia', 'tipoOperacion', 'fechaCreacion', 'proceso', 'situacion', 'cliente', 'cedula', 'aprobador', 'respuestaAprobador'];

  constructor() {
    this.formBusqueda.addControl('cedula', this.identificacion);
    this.formBusqueda.addControl('codigoOperacion', this.codigoOperacion);
    this.formBusqueda.addControl(' tipoDevolucion', this.tipoDevolucion);
  }

  ngOnInit() {
  }

}
