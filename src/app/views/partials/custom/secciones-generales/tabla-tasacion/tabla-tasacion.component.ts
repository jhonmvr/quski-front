import { SoftbankService } from './../../../../../core/services/quski/softbank.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TbQoTasacion } from './../../../../../core/model/quski/TbQoTasacion';
import { MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
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
  public catDivision: Array<any>;
  private dataObservable: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(null);
  @Input() set data( list :  Array<any>){
    this.dataObservable.next( list );
  }
  @Input() tipo: string; //[T: TbQoTasacion, G: GarantiasSoftbank, A: TbQoTasacionConAcciones];
  @Output() rowEdit: EventEmitter<TbQoTasacion> = new EventEmitter<TbQoTasacion>();
  @Output() rowDelete: EventEmitter<TbQoTasacion> = new EventEmitter<TbQoTasacion>();
  constructor(    
    private sof: SoftbankService,
    ) { 
      this.sof.setParameter();
    }
    
    ngOnInit() {
      this.cargarCats();
    }
    private inicioDeFlujo() {
      this.dataObservable.subscribe (p=>{
        this.error = this.tipo ? false : true;
        this.displayedColumnsTasacion = 
        this.tipo == 'G'       
        ? ['Total','NumeroPiezas','TipoOro','TipoJoya','EstadoJoya','Descripcion','PesoBruto','tienePiedras','detallePiedras','DescuentoPesoPiedra','DescuentoSuelda','PesoNeto','valorOro', 'ValorAvaluo','ValorRealizacion','valorComercial']
        : this.tipo == 'A' 
        ?     ['Accion','NumeroPiezas','TipoOro','TipoJoya','EstadoJoya','Descripcion','PesoBruto','tienePiedras','detallePiedras','DescuentoPesoPiedra','DescuentoSuelda','PesoNeto','valorOro','ValorAvaluo','ValorRealizacion','valorComercial']
        : this.tipo == 'T' 
        ? ['Total', 'NumeroPiezas','TipoOro','TipoJoya','EstadoJoya','Descripcion','PesoBruto','tienePiedras','detallePiedras','DescuentoPesoPiedra','DescuentoSuelda','PesoNeto','valorOro','ValorAvaluo','ValorRealizacion','valorComercial']
        : this.tipo == 'C' 
        ? ['Accion','TipoOro', 'valorOro', 'PesoBruto']
        : this.tipo == 'CD' 
        ? ['Total','TipoOro','valorOro', 'PesoBruto']
        : this.tipo == 'DV' 
        ? ['Total','NumeroPiezas','TipoOro','TipoJoya','EstadoJoya','Descripcion','PesoBruto','tienePiedras','detallePiedras','DescuentoPesoPiedra','DescuentoSuelda','PesoNeto','valorOro', 'ValorAvaluo',        'NumeroFundaMadre','NumeroFundaActual','CiudadTevcol']
        : [];
        this.dataSourceTasacion = new MatTableDataSource<any>(p);
        //this.formateo();
        this.calcular();
      });
    
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
                      this.sof.consultarDivicionPoliticaCS().subscribe((data: any) => {
                        if (!data.existeError) {
                          this.catDivision= !data.existeError ? data.catalogo : {nombre: 'Error al cargar catalogo'};
                          this.inicioDeFlujo();
                        }
                      }); 
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
  forTipoOro(e){
    let tipoOro = e.tipoOro;
    if(e.codigoTipoOro ){
      tipoOro = e.codigoTipoOro;
    }
    let x = this.catTipoOro.find(x => x.codigo == tipoOro);
    if(tipoOro && this.catTipoOro && x){
      
      return x.nombre;
    }else{
      return 'Error Catalogo' ;
    }
  }
  forTipoJoya(e){
    let tipoJoya = e.tipoJoya;
    if(e.codigoTipoJoya ){
      tipoJoya = e.codigoTipoJoya;
    }
    let x = this.catTipoJoya.find(x => x.codigo == tipoJoya);
    if(tipoJoya && this.catTipoJoya && x){
      return x.nombre;
    }else{
      return 'Error Catalogo' ;
    }
  }
  forEstadoJoya(e){
    let estadoJoya = e.estadoJoya;
    if(e.codigoEstadoJoya ){
      estadoJoya = e.codigoEstadoJoya;
    }
    let x = this.catEstadoJoya.find(x => x.codigo == estadoJoya);
    if(estadoJoya && this.catEstadoJoya && x){
      return x.nombre;
    }else{
      return 'Error Catalogo' ;
    }
  }
  forAgenciaCustodia(e){
    let agenciaCustodia = e.idAgenciaCustodia;
    let x = this.catAgencia.find(x => x.id == agenciaCustodia);
    if(agenciaCustodia && this.catAgencia && x){
      let idTecCol = x.idUbicacionTevcol;
      let m = this.catDivision.find(x => x.id == idTecCol);
      if(idTecCol && m){
        return m.nombre;
      }else{
        return 'Error Catalogo' ;
      }
    }else{
      return 'Error Catalogo' ;
    }
  }
  forDescuentoPesoPiedra(e){
    return e.descuentoPiedras ? e.descuentoPiedras : e.descuentoPesoPiedra ? e.desdescuentoPesoPiedra : 0;
  }
  forDescuentoSuelda(e){
    return e.descuentoSuelda  ? e.descuentoSuelda  : e.descuentoSuelda;
  }
  forDescripcion(e){
    return e.descripcion ? e.descripcion : e.descripcionJoya ? e.descripcionJoya : 'Sin descripcion';
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
        this.totalDescgr = (Number(this.totalDescgr) + Number(element.descuentoPiedras ? element.descuentoPiedras : element.descuentoPesoPiedra ? element.desdescuentoPesoPiedra : 0 )).toFixed(2);
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
  public editar(entidad: TbQoTasacion) {
    console.log( entidad );
    this.rowEdit.emit(entidad);
  }
  public eliminar(entidad: TbQoTasacion) {
    this.rowDelete.emit(entidad);
  }
 

}

