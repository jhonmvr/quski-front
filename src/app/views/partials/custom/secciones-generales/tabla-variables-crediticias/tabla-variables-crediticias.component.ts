import { VariablesCrediticiasService } from '../../../../../core/services/quski/variablesCrediticias.service';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { IntegracionService } from '../../../../../core/services/quski/integracion.service';
import { PersonaConsulta } from '../../../../../core/model/calculadora/personaConsulta';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-tabla-variables-crediticias',
  templateUrl: './tabla-variables-crediticias.component.html',
  styleUrls: ['./tabla-variables-crediticias.component.scss']
})
export class TablaVariablesCrediticiasComponent implements OnInit {
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading;
  private baseSuject: BehaviorSubject<Array<TbQoVariablesCrediticia>> = new BehaviorSubject<Array<TbQoVariablesCrediticia>>(null);
  // VARIABLES ANIDADAS
  @Input() dataPopup: DataPopup;
  @Input() set base( list : Array<TbQoVariablesCrediticia>){
    this.baseSuject.next( list );
  }
  @Output() entidades: EventEmitter<Array<TbQoVariablesCrediticia>> = new EventEmitter<Array<TbQoVariablesCrediticia>>();
  // ENTIDADES
  private entidadesVariablesCrediticias: Array<TbQoVariablesCrediticia>;
  // TABLA DE VARIABLES CREDITICIAS
  public displayedColumnsVariablesCrediticias = ['orden', 'variable', 'valor'];
  public dataSourceVariablesCrediticias = new MatTableDataSource<TbQoVariablesCrediticia>();
  constructor(
    private vaC: VariablesCrediticiasService,
    private cal: IntegracionService,
  ) { 
    this.vaC.setParameter();
    this.cal.setParameter();
  }

  ngOnInit() {
    
    this.cal.setParameter();
    this.vaC.setParameter();
    this.loading = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.baseSuject.subscribe( data =>{
      if(data){

        this.dataSourceVariablesCrediticias.data = data.sort((r,n)=>{return r.orden - n.orden});
      }
      this.loadingSubject.next(false);
    }, error => {
      this.loadingSubject.next(false);
    });
    if( this.dataPopup != null){
      this.direccionDeFlujo(this.dataPopup);
    }
  }
  /**
   * @author Jeroham cadenas - Developer twelve
   * @description Define si se busca la variable crediticia por negociacion o por cotizacion
   * @param data DataPopup
   */
  private direccionDeFlujo(data: DataPopup) {
    //console.log('INICIA CAMBIO DIRECCION ');
    if (data.isCotizacion) {

      this.iniciaBusquedaCotizacion(data.idBusqueda);
    } else {
      if (data.isNegociacion) {
        this.iniciaBusquedaNegociacion(data.idBusqueda);
        //console.log('INGRESA AL IF isNegociacion ');
      } else {
        if (data.isCalculadora) {
          this.iniciaBusquedaCalculadora(data.cedula);
        } else {
          //console.log("Error ----> NO HAY DATOS DE ENTRADA ", data)
        }
      }
    }
  }
  private iniciaBusquedaCotizacion(id: number) {
    if (id != null) {
      if (id > 0) {
        this.vaC.variablesCrediticiabyIdCotizador(id).subscribe((data: any) => {
          if (data.list) {
            this.entidadesVariablesCrediticias = data.list;
            this.dataSourceVariablesCrediticias.data = this.entidadesVariablesCrediticias;
            this.enviarAlPadre(this.entidadesVariablesCrediticias);
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
  private iniciaBusquedaCalculadora(cedula: string) {
    if (cedula != "") {
      const consulta = new PersonaConsulta();
      consulta.identificacion = cedula;
      this.cal.getInformacionPersonaCalculadora(consulta).subscribe((data: any) => {
        if (data.entidad.xmlVariablesInternas.variablesInternas.variable != null) {
          this.entidadesVariablesCrediticias = data.entidad.xmlVariablesInternas.variablesInternas.variable
          this.dataSourceVariablesCrediticias.data = this.entidadesVariablesCrediticias;
          this.enviarAlPadre(this.entidadesVariablesCrediticias);
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
            this.entidadesVariablesCrediticias = data;
            this.dataSourceVariablesCrediticias.data = this.entidadesVariablesCrediticias;
            this.enviarAlPadre(this.entidadesVariablesCrediticias);
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
  private enviarAlPadre(entidades: Array<TbQoVariablesCrediticia>) {
    this.entidades.emit(entidades);
  }
}

