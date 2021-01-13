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

  // VARIABLES ANIDADAS
  @Input() dataPopup: DataPopup;
  @Output() entidades: EventEmitter<Array<TbQoTasacion>> = new EventEmitter<Array<TbQoTasacion>>();
  // ENTIDADES
  private entidadesTasaciones: Array<TbQoTasacion>;
  // TABLA DE VARIABLES CREDITICIAS
  public displayedColumnsTasacion = ['descripcion', 'descuentoPesoPiedra', 'descuentoSuelda'];
  public dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();
  constructor(
    private vaC: VariablesCrediticiasService,
    private cal: IntegracionService,
  ) { 
    this.vaC.setParameter();
    this.cal.setParameter();
  }

  ngOnInit() {
    this.vaC.setParameter();
    this.cal.setParameter();
    //console.log('DATAPOPUP TASACION===> ', this.dataPopup);
    this.direccionDeFlujo(this.dataPopup);

  }
  /**
   * @author Jeroham cadenas - Developer twelve
   * @description Define si se busca la variable crediticia por negociacion o por cotizacion
   * @param data DataPopup
   */
  private direccionDeFlujo(data: DataPopup) {

    if (data.isNegociacion) {
      //console.log('INGRESA AL IF isNegociacion ');
      //console.log('data==> direccionDeFlujo ', JSON.stringify(data));
      this.iniciaBusquedaNegociacion(data.idBusqueda);
    } else {
      if (data.isCalculadora) {
        this.iniciaBusquedaCalculadora(data.cedula);
      } else {
        //console.log("Error ----> NO HAY DATOS DE ENTRADA ", data)
      }
    }
  }



  private iniciaBusquedaCalculadora(cedula: string) {
    if (cedula != "") {
      const consulta = new PersonaConsulta();
      consulta.identificacion = cedula;
      this.cal.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {
        if (data.entidad.xmlVariablesInternas.variablesInternas.variable != null) {
          this.entidadesTasaciones = data.entidad.xmlVariablesInternas.variablesInternas.variable
          this.dataSourceTasacion.data = this.entidadesTasaciones;
          this.enviarAlPadre(this.entidadesTasaciones);
        } else {
          //console.log("Error ----> Id de cotizacion no existe", cedula);
        }
      });
    } else {
      //console.log("Error ----> Ingrese id de cotizador", cedula);
    }
  }


  private iniciaBusquedaNegociacion(id: number) {
    if (id != null) {
      if (id > 0) {
        this.vaC.variablesCrediticiaByIdNegociacion(id).subscribe((data: any) => {
          if (data) {
            this.entidadesTasaciones = data;
            this.dataSourceTasacion.data = this.entidadesTasaciones;
            this.enviarAlPadre(this.entidadesTasaciones);
          } else {
            //console.log("Error ----> Id de cotizacion no existe", id);
          }
        });
      } else {
        //console.log("Error ----> id cotizador Incorrecto", id);
      }
    } else {
      //console.log("Error ----> Ingrese id de cotizador", id);
    }
  }
  private enviarAlPadre(entidades: Array<TbQoTasacion>) {
    //console.log('Estoy enviando esto desde tasacion -----> ', entidades);
    this.entidades.emit(entidades);
  }
}

