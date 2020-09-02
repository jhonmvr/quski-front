import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { Page } from '../../../../../core/model/page';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { TasacionService } from '../../../../../core/services/quski/tasacion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { FundaService } from '../../../../../core/services/quski/funda.service';
import { BehaviorSubject } from 'rxjs';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';

@Component({
  selector: 'kt-gestion-credito',
  templateUrl: './gestion-credito.component.html',
  styleUrls: ['./gestion-credito.component.scss']
})
export class GestionCreditoComponent implements OnInit {
  public formCreditoNuevo: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('');
  public situacion = new FormControl('');
  public cedulaCliente = new FormControl('');
  public nombresCompletos = new FormControl('');
 ///fecha

///operativa
  public tipoCuenta = new FormControl('');
  public numeroCuenta = new FormControl('');
  public tipoCliente = new FormControl('');
  public firmadaOperacion  = new FormControl('');
  public identificacionApoderado = new FormControl('');
  public nombresCompletosApoderado = new FormControl('');
  public identificacionCodeudor = new FormControl('');
  public nombresCompletosCodeudor = new FormControl('');
  public fechaNacimientoCodeudor = new FormControl('');
  // credito
  public tipoCartera = new FormControl('');
  public descripcionProducto = new FormControl('');
  public destinoOperacion = new FormControl('');
  public estadoOperacion = new FormControl('');
  public tipoOperacion = new FormControl('');
  public plazo = new FormControl('');
  public fechaEfectiva = new FormControl('');
  public fechaVencimiento = new FormControl('');
  public montoFinanciado = new FormControl('');
  public valorDesembolso = new FormControl('');
  public totalInteres = new FormControl('');
  public cuotas = new FormControl('');
  public pagarCliente = new FormControl('');
  public riesgoTotalCliente = new FormControl('');
  public recibirCliente = new FormControl('');
  public netoCliente = new FormControl('');
  ///Monto
  public montoSolicitado = new FormControl('');

  // control funda
  public pesoFunda = new FormControl('');
  public numeroFunda = new FormControl('');
  public totalPesoNeto = new FormControl('');
  public totalPesoBruto = new FormControl('');
  public totalPesoBrutoFunda = new FormControl('');
  public totalValorRealizacion = new FormControl('');
  public totalValorAvaluo = new FormControl('');
  public totalValorComercial = new FormControl('');

  ///totalizado
  totalMonto 
  totalPesoN
  totalPesoB
  totalPBFunda
  totalValorR
  totalValorA
  totalValorC
  list=[]
  listaPrecios=[2.50, 5.00, 10.00]

  ///
  idCreditoNegociacion=96;
  tbCreditoNegociacion:TbQoCreditoNegociacion;
  edadCodeudor
  tbQoCliente;
  fechaServer;
  pesosFundas = ['']
  tiposCuentas = ['Cuenta de Ahorros']
  tiposClientes = ['DEUDOR', 'CODEUDOR', 'APODERADO']
  tiposCarteras =['']
  destinosOperaciones = ['']
  //observables
  enableDiaPagoButton;
  enableDiaPago = new BehaviorSubject<boolean>(false);

  //TABLA
  displayedColumns = ['numeroPiezas', 'tipoOro',  'tipoJoya', 'estadoJoya', 'descripcion', 'pesoBruto',
  'tieneDescuento', 'descripcionDescuentos', 'descuentoPesoPiedra',  'descuentoSuelda',
   'pesoNeto', 'valorOro', 'valorAvaluo', 'valorComercial', 'valorRealizacion'];

 /**Obligatorio paginacion */
 p = new Page();
 dataSource
 displayedColumnsOpt = new MatTableDataSource<any>();
 displayedColumnsOpcionesCredito = ['Accion', 'Plazo', 'TipoOperacion', 'PeriodicidadPlazo', 'TipoOferta', 'MontoPreAprobado', 'ValorCouta'
  , 'ARecibirCliente', 'APagarPorCliente', 'ValorAPagarNeto', 'ValoresCreditoAnterior', 'TotalCostosNuevaOpreacion'
  , 'CostoCustodia', 'FormaPagoCustodia', 'CostoTransporte', 'FormaPagoTransporte', 'CostoValoracion', 'FormaPagoValoracion', 'CostoTasacion',
   'FormaPagoTasacion', 'CostoSeguro', 'FormaPagoSeguro', 'CostoResguardo', 'FormaPagoResguardo', 'Solca', 'FormaPagoSolca', 'SaldoCapitaOpAnt'
   , 'SaldoInteresOpAnt', 'FormaPagoInteres', 'SaldoMoraOpAnt', 'FormaPagoMora', 'GastosDeCobranzaOpAnt', 'FormaPagoGastoCobranza', 'CustodiaVencidaOptAnt', 
   'FormaPagoCustodiaVencida', 'AbonoCapitaOpAnterior', 'FormaPagoAbonoCapital', 'MontoDesembolsoBallon', 'ProcentajeFlujoPlaneado'];
 //:MatTableDataSource<TbMiCliente>=new MatTableDataSource<TbMiCliente>();


 ///////////////////////Objeto Joyas para foto
 joyaFoto ={
   idRol:"1",
   proceso:"FUNDA",
   estadoOperacion:"",
   referencia:"50",
   tipoDocumento:"5",
   //documentoHabilitante:element.idDocumentoHabilitante
 }

 ////////////////Objeto Funda para foto


 @ViewChild(MatPaginator, { static: true }) 
 paginator: MatPaginator;
 totalResults: number;
 pageSize = 5;
 currentPage;
 proceso= "CREDITONUEVO"
 /**Obligatorio ordenamiento */
 @ViewChild('sort1', {static: true}) sort: MatSort;

  constructor(private cns: CreditoNegociacionService, private sinNoticeService: ReNoticeService, private tas: TasacionService,
    private dhs: DocumentoHabilitanteService, 
    private fs: FundaService, private css: SoftbankService) { 
    
    
  }

  ngOnInit() {
    this.setFechaSistema();
   
    this.buscar();
    this.cargarDatosOperacion()
    
    this.getJoyas();
    
  }

 /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSource = new MatTableDataSource();
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSource.paginator = this.paginator;
  }

     /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string,pagina): Page {
    const p = new Page();
    p.pageNumber = pagina;
    p.pageSize = this.paginator.pageSize;
    p.sortFields = ordenarPor;
    p.sortDirections = tipoOrden;
    p.isPaginated = paginado;
    //console.log("==>en buscas  getPaginacion " + JSON.stringify(this.p) );
    return p;
  }


     /**
   * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
   */
  paged() {
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',this.paginator.pageIndex)
    this.cargarDatosOperacion();
  }

  
   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
  buscar() {
    this.initiateTablePaginator();
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',0);
    this.cargarDatosOperacion();
  }

  cargarDatosOperacion(){
   this.cns.getCreditoNegociacionById(this.idCreditoNegociacion).subscribe((data:any)=>{
      if(data.entidad){
        this.tbCreditoNegociacion = data.entidad
        this.tbQoCliente = this.tbCreditoNegociacion.tbQoNegociacion.tbQoCliente
        console.log(this.tbQoCliente)
        console.log(this.tbCreditoNegociacion)
        this.codigoOperacion.setValue(data.entidad.tbQoNegociacion.codigoOperacion)
        this.cedulaCliente.setValue(data.entidad.tbQoNegociacion.tbQoCliente.cedulaCliente)
        this.nombresCompletos.setValue(data.entidad.tbQoNegociacion.tbQoCliente.apellidoPaterno.concat(" ",
         data.entidad.tbQoNegociacion.tbQoCliente.apellidoMaterno == null ? "" : data.entidad.tbQoNegociacion.tbQoCliente.apellidoMaterno, 
          " ", data.entidad.tbQoNegociacion.tbQoCliente.primerNombre
         ," ", data.entidad.tbQoNegociacion.tbQoCliente.segundoApellido== null ? "" : data.entidad.tbQoNegociacion.tbQoCliente.segundoApellido))
         this.situacion.setValue("APROBACIÓN Y AUTORIZACION DESEMBOLSO")
         this.tipoCuenta.setValue("CUENTA DE AHORROS")
 
        this.consultarClienteCS();
         if(data.entidad.tbQoNegociacion.tipoNegociacion === "CUOTAS"){
           console.log("deberia verse")
          this.enableDiaPago.next(true);
         }else{
          this.enableDiaPago.next(false);
         }
        

      }
    })

  }

  getParams(){

  }

  setFechaSistema(){
    this.cns.getSystemDate().subscribe((fechaSistema: any) => {
     this.fechaServer = new Date( fechaSistema.entidad);
     console.log(this.fechaServer) 
    })
  }



 getJoyas(){
   this.tas.getTasacionByIdCredito(this.p,this.idCreditoNegociacion).subscribe((data:any)=>{
     console.log("que pasa por la calle", data.list)
     this.totalResults = data.totalResults;
        this.dataSource = new MatTableDataSource<any>(data.list);
        this.calcular()
        /*   
       
        */
  
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'info');
   }, error=> {
    this.sinNoticeService.setNotice("ERROR CARGANDO LAS JOYAS", 'error');
   })
 }

 setTipoCliente(tipo){
   console.log(tipo)
   console.log(this.tiposClientes.find(p=>p==tipo))
  this.tipoCliente.setValue( this.tiposClientes.find(p=>p==tipo))
 }

 
getPermiso(){
  return true
}

calcular(){

  this.totalPesoN =0;
  this.totalPesoB =0;
  this.totalPBFunda = 0
  this.totalValorR = 0
  this.totalValorA = 0
  this.totalValorC = 0
  let ind = 0;
  if (this.dataSource.data) {
    //console.log("<<<<<<<<<<Data source >>>>>>>>>> "+ JSON.stringify(this.dataSourceContratos.data));
    this.list=[];
    this.dataSource.data.forEach(element => {
      
      ind = ind + 1;
      this.list.push(ind);
      
    
    this.totalPesoN = Number(this.totalPesoN) + Number(element.pesoNeto);
    this.totalPesoB = Number(this.totalPesoB) + Number(element.pesoBruto);
    
    this.totalValorR = Number(this.totalValorR) + Number(element.valorRealizacion);
    this.totalValorA = Number(this.totalValorA) + Number(element.valorAvaluo);
    this.totalValorC = Number(this.totalValorC) + Number(element.valorComercial);
    });
    
  }
}


getFunda(pesoFun){
 
  this.fs.reservarFunda(pesoFun).subscribe((data:any)=>{
    if(data.entidad){
      this.numeroFunda.setValue(data.entidad.codigo);
      this.totalPesoNeto.setValue(this.totalPesoN);
      this.totalPesoBruto.setValue(this.totalPesoB);
      this.totalPesoBrutoFunda.setValue(Number(this.totalPesoB)+ Number(data.entidad.peso));
      this.totalValorRealizacion.setValue(this.totalValorR);
      this.joyaFoto.referencia = data.entidad.id
      console.log(data)
    }else{
      this.sinNoticeService.setNotice("No se encontro fundas", 'warning');
    }
  
    //this.pesoFunda.setValue(this.totalPesoN);
  
  }
  ) 
}


  consultarClienteCS(){
  let entidadConsultaCliente  = new ConsultaCliente();
  entidadConsultaCliente.identificacion = this.tbQoCliente.cedulaCliente;
  entidadConsultaCliente.idTipoIdentificacion = 1;
  this.css.consultarClienteCS( entidadConsultaCliente ).subscribe( (data : any) => {
    if (data) {
      //console.log("consultarClienteCS --> Funciona");
      this.numeroCuenta.setValue(data.entidad.cuentasBancariasCliente.cuenta)
      console.log("Consulta del cliente en Cloustudio --> " + JSON.stringify(data) );
    } else {
      this.sinNoticeService.setNotice("No me trajo datos 'entidadConsultaCliente'", 'error');
    }

  }, error =>{
    if (JSON.stringify(error).indexOf("codError") > 0) {
      let b = error.error;
      this.sinNoticeService.setNotice(b.msgError, 'error');
    } else {
      this.sinNoticeService.setNotice("Error no fue cacturado en 'consultarClienteCS' :(", 'error');

    }
  });
}
}
