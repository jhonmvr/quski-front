import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TbQoTasacion } from './../../../../../core/model/quski/TbQoTasacion';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'kt-tabla-tasacion',
  templateUrl: './tabla-tasacion.component.html',
  styleUrls: ['./tabla-tasacion.component.scss']
})
export class TablaTasacionComponent implements OnInit {
  public error: boolean= false;
  public dataSourceTasacion = new MatTableDataSource<any>();
  public displayedColumnsTasacion = ['Total', 'NumeroPiezas', 'TipoOro','PesoBruto','PesoNeto', 'valorOro', 'ValorAvaluo', 'ValorRealizacion', 'valorComercial', 'DescuentoSuelda', 'TipoJoya', 'EstadoJoya', 'Descripcion', 'tienePiedras','DescuentoPesoPiedra', 'detallePiedras',];
  totalPesoN: any;
  totalDescgr: any;
  totalPesoB: any;
  totalValorR: number;
  totalValorA: number;
  totalValorC: number;
  totalValorO: number;
  totalNumeroJoya: number;
  public catTipoGarantia: Array<any>;
  public catTipoCobertura: Array<any>;
  public catAgencia: Array<any>;
  public catTipoJoya: Array<any>;
  public catEstadoJoya: Array<any>;
  public catTipoOro: Array<any>;
  public catEstadoProceso: Array<any>;
  public catEstadoUbicacion: Array<any>;
  @Input() data: Array<any>;
  @Input() tipo: string; //[T: TbQoTasacion, G: GarantiasSoftbank, A: TbQoTasacionConAcciones];
  @Output() entidades: EventEmitter<Array<TbQoTasacion>> = new EventEmitter<Array<TbQoTasacion>>();
  constructor(    
    private sof: SoftbankService,
  ) { 
    this.sof.setParameter();
  }

  ngOnInit() {
    this.cargarCats();
  }
  private inicioDeFlujo(data) {
    this.dataSourceTasacion.data = data;
    if(this.tipo == 'T'){
      this.formateo();
      this.calcular();
    }else if( this.tipo == 'G'){
      this.displayedColumnsTasacion = ['numeroGarantia','numeroExpediente','codigoTipoGarantia','Descripcion','tipoCobertura','valorComercial','ValorAvaluo','ValorRealizacion','valorOro','fechaAvaluo','idAgenciaRegistro','idAgenciaCustodia','referencia','TipoJoya','descripcionJoya','EstadoJoya','TipoOro','PesoBruto','tienePiedras','detallePiedras','DescuentoPesoPiedra','PesoNeto','codigoEstadoProceso','codigoEstadoUbicacion','numeroFundaMadre','numeroFundaJoya','NumeroPiezas','DescuentoSuelda'];
      this.formateo();
      this.calcular();
    }else if( this.tipo == 'A'){
      this.dataSourceTasacion.data = data

      this.calcular();
    }else{
      this.error = true;
    }
  }
  private cargarCats(){
    this.sof.consultarTipoJoyaCS().subscribe( (data: any) =>{
      this.catTipoGarantia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
      this.sof.consultarTipoCoberturaCS().subscribe( (data: any) =>{
        this.catTipoCobertura = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
        this.sof.consultarTipoCoberturaCS().subscribe( (data: any) =>{
          this.catTipoCobertura = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
          this.sof.consultarAgenciasCS().subscribe( (data: any) =>{
            this.catAgencia = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
            this.sof.consultarTipoJoyaCS().subscribe( (data: any) =>{
              this.catTipoJoya = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
              this.sof.consultarEstadoJoyaCS().subscribe( (data: any) =>{
                this.catEstadoJoya = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
                this.sof.consultarTipoOroCS().subscribe( (data: any) =>{
                  this.catTipoOro = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
                  this.sof.consultarEstadoProcesoCS().subscribe( (data: any) =>{
                    this.catEstadoProceso = !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
                    this.sof.consultarEstadoUbicacionCS().subscribe( (data: any) =>{
                      this.catEstadoUbicacion= !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
                      this.inicioDeFlujo(this.data);
                    });  
                  });
                });  
              });
            });     
          });
        });
      });
    });  
  }
  private formateo(){
    this.dataSourceTasacion.data.forEach(e=>{
      e.tipoOro = e.tipoOro ? 
                    this.catTipoOro ? 
                        this.catTipoOro.find(x => x.codigo == e.tipoOro) ?
                          this.catTipoOro.find(x => x.codigo == e.tipoOro).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.tipoJoya =  e.tipoJoya ?
                      this.catTipoJoya ?
                          this.catTipoJoya.find( x => x.codigo ) ?
                            this.catTipoJoya.find( x => x.codigo ).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.estadoJoya =  e.estadoJoya ?
                        this.catEstadoJoya ?
                            this.catEstadoJoya.find( x => x.codigo == e.tipoJoya) ?
                              this.catEstadoJoya.find( x => x.codigo == e.tipoJoya).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.codigoTipoGarantia =  e.codigoTipoGarantia ?
                                this.catTipoGarantia ?
                                  this.catTipoGarantia.find(x => x.codigo == e.codigoTipoGarantia) ? 
                                    this.catTipoGarantia.find(x => x.codigo == e.codigoTipoGarantia).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.tipoCobertura = e.tipoCobertura ? 
                          this.catTipoCobertura ?
                            this.catTipoCobertura.find(x => x.codigo == e.tipoCobertura ) ? 
                              this.catTipoCobertura.find(x => x.codigo == e.tipoCobertura).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.nombreAgenciaCustodia = e.nombreAgenciaCustodia ? 
                                  this.catAgencia ?
                                    this.catAgencia.find(x => x.id == e.idAgenciaCustodia) ?
                                      this.catAgencia.find(x => x.id == e.idAgenciaCustodia).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.nombreAgenciaRegistro = e.nombreAgenciaRegistro ?
                                  this.catAgencia ?
                                    this.catAgencia.find(x => x.id == e.idAgenciaRegistro) ?
                                      this.catAgencia.find(x => x.id == e.idAgenciaRegistro).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.codigoEstadoProceso = e.codigoEstadoProceso ?
                              this.catEstadoProceso ?
                                this.catEstadoProceso.find(x=> x.codigo == e.codigoEstadoProceso) ? 
                                  this.catEstadoProceso.find(x=> x.codigo == e.codigoEstadoProceso).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.codigoEstadoUbicacion = e.codigoEstadoUbicacion ?
                                  this.catEstadoUbicacion ?
                                    this.catEstadoUbicacion.find(x=> x.codigo == e.codigoEstadoUbicacion) ? 
                                      this.catEstadoUbicacion.find(x=> x.codigo == e.codigoEstadoUbicacion).nombre : 'Error Catalogo' : 'Error Catalogo' : 'Error Catalogo';
      e.descuentoPesoPiedra = e.descuentoPiedras ? e.descuentoPiedras : e.descuentoPesoPiedra;
      e.descuentoSuelda     = e.descuentoSuelda  ? e.descuentoSuelda  : e.descuentoSuelda;
    });
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
  /** ********************************************* @ACCIONES ********************* **/

 

}

