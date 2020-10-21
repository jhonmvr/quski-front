import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TbQoPatrimonioCliente } from '../../../../../core/model/quski/TbQoPatrimonioCliente';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';

@Component({
  selector: 'app-aprobacion-credito-nuevo',
  templateUrl: './aprobacion-credito-nuevo.component.html',
  styleUrls: ['./aprobacion-credito-nuevo.component.scss']
})
export class AprobacionCreditoNuevoComponent implements OnInit {

  // TABLA DE PATRIMONIO ACTIVO
  displayedColumnsPatrimonio = ['Accion', 'Activo', 'Avaluo', 'Pasivo', 'Ifis', 'Infocorp'];
  dataSourcePatrimonio = new MatTableDataSource<TbQoPatrimonioCliente>();

  // TABLA DE INGRESO EGRESO
  displayedColumnsII = ['Accion', 'Ingreso', 'Egreso'];
  dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();


  // TABLA DE REFERENCIAS PERSONALES
  displayedColumnsReferencia = ['Accion', 'N', 'NombresCompletos', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSourceReferencia = new MatTableDataSource<TbReferencia>();

  // TABLA TASACION
  displayedColumnsTasacion = ['NumeroPiezas', 'TipoOro', 'TipoJoya', 'Estado', 'Descripcion', 'PesoBruto', 'DescuentoPiedra', 'DescuentoSuelda', 'PesoNeto', 'ValorAvaluo', 'ValorComercial', 'ValorRealizacion', 'ValorOro'];
  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();

  constructor() { }

  ngOnInit() {
  }

}
