import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { VariablesCrediticiasService } from '../../../../../core/services/quski/variablesCrediticias.service';

@Component({
  selector: 'kt-tabla-variables-crediticias',
  templateUrl: './tabla-variables-crediticias.component.html',
  styleUrls: ['./tabla-variables-crediticias.component.scss']
})
export class TablaVariablesCrediticiasComponent implements OnInit {
  @Input() dataPopup: DataPopup;
  // TABLA DE VARIABLES CREDITICIAS
  displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
  dataSourceVariablesCrediticias = new MatTableDataSource<TbQoVariablesCrediticia>();
  public idCotizador   : number;
  public idNegociacion : number;
  constructor(
    private vaC: VariablesCrediticiasService,
  ) { }

  ngOnInit() {
    this.direccionDeFlujo(this.dataPopup);
  }
  /**
   * @author Jeroham cadenas - Developer twelve
   * @description Define si se busca la variable crediticia por negociacion o por cotizacion
   * @param data DataPopup
   */
  direccionDeFlujo( data : DataPopup ){
    if (data.isCotizacion && !data.isNegociacion ) {
      // this.idCotizador   = data.idBusqueda;
      // this.idNegociacion = null;
      this.iniciaBusquedaCotizacion( data.idBusqueda );
    } else {
      if ( data.isNegociacion && !data.isCotizacion ){   
        // this.idCotizador   = null;
        // this.idNegociacion = data.idBusqueda;
        this.iniciaBusquedaNegociacion( data.idBusqueda );
      } else {
        console.log("Error ----> Id de cotizacion no existe", data)  
      }
    }
  }
  iniciaBusquedaCotizacion( id : number ){
    if ( id != null ) {
      if ( id > 0 ) {
        this.vaC.variablesCrediticiabyIdCotizador( id ).subscribe( (data: any) =>{
          if (data.list) {
            this.dataSourceVariablesCrediticias.data = data.list;
            console.log("data que me esta devolviendo ---> ", this.dataSourceVariablesCrediticias.data);
          } else {
            console.log("Error ----> Id de cotizacion no existe", id);
          } 
        });
      } else {
        console.log("Error ----> id cotizador Incorrecto", id);
      }
    } else {
      console.log("Error ----> Ingrese id de cotizador", id);
    }
  }
  iniciaBusquedaNegociacion( id : number ){
    if ( id != null ) {
      if ( id > 0 ) {
        this.vaC.variablesCrediticiaByIdNegociacion( id ).subscribe( (data: any) =>{
          if (data) {
            data.forEach(element => {
            this.dataSourceVariablesCrediticias.data.push(element);
            });
          } else {
            console.log("Error ----> Id de cotizacion no existe", id);
          }
        });
      } else {
        console.log("Error ----> id cotizador Incorrecto",id);
      }
    } else {
      console.log("Error ----> Ingrese id de cotizador", id);
    }
  }
}

