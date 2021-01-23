import { TbQoTasacion } from './../../../../../core/model/quski/TbQoTasacion';
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { VariablesCrediticiasService } from '../../../../../core/services/quski/variablesCrediticias.service';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { PersonaConsulta } from '../../../../../core/model/calculadora/personaConsulta';
import { TasacionService } from '../../../../../core/services/quski/tasacion.service';
import { Page } from '../../../../../core/model/page';

@Component({
  selector: 'kt-tabla-tasacion',
  templateUrl: './tabla-tasacion.component.html',
  styleUrls: ['./tabla-tasacion.component.scss']
})
export class TablaTasacionComponent implements OnInit {
  public dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();
  public displayedColumnsTasacion = ['Total', 'NumeroPiezas', 'TipoOro','PesoBruto','PesoNeto', 'precioOro', 'ValorAvaluo', 'ValorRealizacion', 'valorComercial', 'DescuentoSuelda', 'TipoJoya', 'EstadoJoya', 'Descripcion', 'tienePiedras','DescuentoPesoPiedra', 'detallePiedras',];
  totalPesoN: any;
  totalDescgr: any;
  totalPesoB: any;
  totalValorR: number;
  totalValorA: number;
  totalValorC: number;
  totalValorO: number;
  totalNumeroJoya: number;
  @Input() data: Array<TbQoTasacion>;
  @Output() entidades: EventEmitter<Array<TbQoTasacion>> = new EventEmitter<Array<TbQoTasacion>>();
  constructor() {}

  ngOnInit() {
    this.inicioDeFlujo(this.data);

  }
  private inicioDeFlujo(data) {
    this.dataSourceTasacion.data = data
    this.calcular();
  }
  private calcular() {
    this.totalPesoN = 0;
    this.totalDescgr = 0;
    this.totalPesoB = 0;
    this.totalValorR = 0;
    this.totalValorA = 0;
    this.totalValorC = 0;
    this.totalValorO = 0;
    this.totalNumeroJoya = 0
    if (this.dataSourceTasacion.data) {
      this.dataSourceTasacion.data.forEach(element => {
        this.totalPesoN  = (Number(this.totalPesoN) + Number(element.pesoNeto)).toFixed(2);
        this.totalDescgr = (Number(this.totalDescgr) + Number(element.descuentoPesoPiedra)).toFixed(2);
        this.totalPesoB  = (Number(this.totalPesoB) + Number(element.pesoBruto)).toFixed(2);
        this.totalValorR = Number(this.totalValorR) + Number(element.valorRealizacion);
        this.totalValorA = Number(this.totalValorA) + Number(element.valorAvaluo);
        this.totalValorC = Number(this.totalValorC) + Number(element.valorComercial);
        this.totalValorO = Number(this.totalValorO) + Number(element.valorOro);
        this.totalNumeroJoya = Number(this.totalNumeroJoya) + Number(element.numeroPiezas);
      });
    }
  }
}

