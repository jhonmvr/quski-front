import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'kt-bandeja-excepciones',
  templateUrl: './bandeja-excepciones.component.html',
  styleUrls: ['./bandeja-excepciones.component.scss']
})
export class BandejaExcepcionesComponent implements OnInit {

  public formBusqueda: FormGroup = new FormGroup({});
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);


  displayedColumnsExcepciones = ['accion', 'tipoExcepcion', 'nombreCliente'];

  constructor() {
    this.formBusqueda.addControl('cedula', this.identificacion);

  }

  ngOnInit() {
  }

  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
