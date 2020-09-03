import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Page } from '../../../../../core/model/page';
import { TasacionService } from '../../../../../core/services/quski/tasacion.service';
import { HabilitanteComponent } from '../../../../partials/custom/habilitante/habilitante.component';
import { HabilitanteDialogComponent } from '../../../../partials/custom/habilitante/habilitante-dialog/habilitante-dialog.component';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { environment } from '../../../../../../environments/environment';
import { ObjectStorageService } from '../../../../../core/services/object-storage.service';
import { FundaService } from '../../../../../core/services/quski/funda.service';
import { OperacionCrear } from '../../../../../core/model/softbank/OperacionCrear';
import { DatosImpCom } from '../../../../../core/model/softbank/DatosImpCom';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { ConsultaOferta } from '../../../../../core/model/calculadora/consultaOferta';


@Component({
  selector: 'kt-generar-credito',
  templateUrl: './generar-credito.component.html',
  styleUrls: ['./generar-credito.component.scss'],
  
})


export class GenerarCreditoComponent implements OnInit {
  public formCreditoNuevo: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('');
  public situacion = new FormControl('');
  public cedulaCliente = new FormControl('');
  public nombresCompletos = new FormControl('');
 ///fecha
  public fechaCuota = new FormControl('');
  fechaUtil:diferenciaEnDias;
///operativa
  public tipoCuenta = new FormControl('');
  public numeroCuenta = new FormControl('');
  public tipoCliente = new FormControl('');
  public firmanteOperacion  = new FormControl('');
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
  consulta: ConsultaOferta;

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
  enableCodeudorButton;
  enableCodeudor = new BehaviorSubject<boolean>(false);
  enableApoderadoButton;
  enableApoderado = new BehaviorSubject<boolean>(false);
  enableTablaOfertaButton;
  enableTablaOferta = new BehaviorSubject<boolean>(false);
  
  /// src 
  srcJoya;
  srcFunda;
  srcTemporal;
  //TABLA
  displayedColumns = ['numeroPiezas', 'tipoOro',  'tipoJoya', 'estadoJoya', 'descripcion', 'pesoBruto',
  'tieneDescuento', 'descripcionDescuentos', 'descuentoPesoPiedra',  'descuentoSuelda',
   'pesoNeto', 'valorOro', 'valorAvaluo', 'valorComercial', 'valorRealizacion'];
 /**Obligatorio paginacion */
 p = new Page();
 dataSource
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
operacion = new OperacionCrear()

 @ViewChild(MatPaginator, { static: true }) 
 paginator: MatPaginator;
 totalResults: number;
 pageSize = 5;
 currentPage;
 proceso= "CREDITONUEVO"
 /**Obligatorio ordenamiento */
 @ViewChild('sort1', {static: true}) sort: MatSort;

  constructor(private cns: CreditoNegociacionService, private sinNoticeService: ReNoticeService, private tas: TasacionService,
    public dialog: MatDialog, private dhs: DocumentoHabilitanteService, private os: ObjectStorageService,
    private fs: FundaService, private css: SoftbankService, private es: ExcepcionService) { 
    
    
  }

  ngOnInit() {
    this.setFechaSistema();
    this.enableDiaPagoButton = this.enableDiaPago.asObservable();
    this.enableDiaPago.next(false);
    this.enableCodeudorButton = this.enableCodeudor.asObservable();
    this.enableCodeudor.next(false);
    this.enableApoderadoButton = this.enableApoderado.asObservable();
    this.enableApoderado.next(false);
    this.enableTablaOfertaButton = this.enableTablaOferta.asObservable();
    this.enableTablaOferta.next(false);
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
        console.log("Pilas el data" , data.entidad)
        console.log(this.tbQoCliente)
        console.log(this.tbCreditoNegociacion.tbQoNegociacion)
        this.codigoOperacion.setValue(data.entidad.codigo)
        this.cedulaCliente.setValue(data.entidad.tbQoNegociacion.tbQoCliente.cedulaCliente)
        this.nombresCompletos.setValue(data.entidad.tbQoNegociacion.tbQoCliente.apellidoPaterno.concat(" ",
         data.entidad.tbQoNegociacion.tbQoCliente.apellidoMaterno == null ? "" : data.entidad.tbQoNegociacion.tbQoCliente.apellidoMaterno, 
          " ", data.entidad.tbQoNegociacion.tbQoCliente.primerNombre
         ," ", data.entidad.tbQoNegociacion.tbQoCliente.segundoNombre== null ? "" : data.entidad.tbQoNegociacion.tbQoCliente.segundoNombre))
         this.situacion.setValue(data.entidad.situacion == null ? "" : data.entidad.situacion)
         this.tipoCuenta.setValue("CUENTA DE AHORROS")
         this.validateEdadTipo();
         this.buscarExcepcionEdad();
        this.consultarClienteCS();
         if(data.entidad.tipo === "CUOTAS"){
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

  validacionFecha(){
      this.fechaUtil = new diferenciaEnDias(new Date(this.fechaCuota.value),new Date( this.fechaServer) )
      if(Math.abs(this.fechaUtil.obtenerDias())>=30 && Math.abs(this.fechaUtil.obtenerDias())<=45 ){
        console.log("Esta dentro del rango")

      }else{
        this.sinNoticeService.setNotice( "DEBE ESCOGER ENTRE 30 Y 45 DÍAS" , 'error');
      }

      console.log("los dias  de diferencia",this.fechaUtil.obtenerDias())
      
}
 getEdad(fechaValue){
  this.fechaUtil = new diferenciaEnDias(new Date(fechaValue),new Date( this.fechaServer) )
  return this.fechaUtil.obtenerDias()/365
 }

 validateEdadCodeudor(fechaCodeudor){
    let edadCodeudor=this.getEdad(fechaCodeudor)
   if(edadCodeudor>=65){
    this.sinNoticeService.setNotice( "El CODEUDOR DEBE SER MENOR DE 65 AÑOS" , 'error');
    
    return true;
  }else{
    return false;
  }
 }
  
validateEdadTipo(){
  let edadCliente = this.getEdad(this.tbQoCliente.fechaNacimiento)
  console.log(edadCliente)
  if(edadCliente>65){

    this.setTipoCliente("CODEUDOR")
    console.log("entra pero no hace nada")
    this.enableCodeudor.next(true);
  }else {
    this.setTipoCliente("DEUDOR")
    console.log("entra en Deudor pero no hace nada")
  }

}
 validateTipoCliente(valueTipoCliente){
   let edadCliente = this.getEdad(this.tbQoCliente.fechaNacimiento)
   console.log(edadCliente)
   console.log("=====> Execute Order 66", valueTipoCliente)

    if (valueTipoCliente.toUpperCase()==="APODERADO" ){
        this.enableApoderado.next(true)
        this.enableCodeudor.next(false);
    } else if (valueTipoCliente.toUpperCase()==="DEUDOR" ){
      this.enableApoderado.next(false)
      this.enableCodeudor.next(false);
  }else if (valueTipoCliente.toUpperCase()==="CODEUDOR" ){
    this.enableApoderado.next(false)
    this.enableCodeudor.next(true);
}
 }
 generarCreditos(){

 }

 getMontoSugerido(){
    this.enableTablaOferta.next(true)
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



 cargarFotoJoya(){
   this.loadArchivoCliente(this.joyaFoto.proceso, this.joyaFoto.estadoOperacion, this.joyaFoto.referencia, this.joyaFoto.tipoDocumento)
  
   this.srcJoya = this.srcTemporal
   console.log("srcJoya"+this.srcJoya)
  }

 cargarFotoFunda(){
  
  this.loadArchivoCliente(this.joyaFoto.proceso, this.joyaFoto.estadoOperacion, this.joyaFoto.referencia, 6)
  this.srcFunda= this.srcTemporal

}

 loadArchivoCliente(procesoS, estadoOperacionS, referenciaS,idTipoDocumentoS) {
  let envioModel={
    proceso:procesoS,
    estadoOperacion:estadoOperacionS,
    referencia:referenciaS,
    tipoDocumento:idTipoDocumentoS,
  };

  if (envioModel.referencia) {
    const dialogRef = this.dialog.open(HabilitanteDialogComponent, {
      width: "auto",
      height: "auto",
      data: envioModel
    });
 
    dialogRef.afterClosed().subscribe(r => {
      //console.log("===>>ertorno al cierre: " + JSON.stringify(r));
      if (r) {
        //console.log("===>>va a recargar: " );
        this.buscar();
        this.sinNoticeService.setNotice("ARCHIVO CARGADO CORRECTAMENTE","success");
        this.cargarFotoHabilitante();
        //this.validateContratoByHabilitante('false');
      }
      //this.submit();
    });
  } else {
    console.log("===>>errorrrr al cierre: ");
    this.sinNoticeService.setNotice("ERROR AL CARGAR NO EXISTE DOCUMENTO ASOCIADO","error");
  }
  
}
getPermiso(){
  return true
}
cargarFotoHabilitante(){
  this.dhs.getHabilitanteByReferenciaTipoDocumentoProceso(this.joyaFoto.tipoDocumento,this.joyaFoto.proceso,this.joyaFoto.referencia,
  ).subscribe((data:any)=>{
    
    console.log("===========>",data.entidad)
     
    this.os.getObjectById( data.entidad.objectId,this.os.mongoDb, environment.mongoHabilitanteCollection ).subscribe((data:any)=>{
    console.log("data  del objeto", data)
    this.srcTemporal = data.entidad
    console.log(this.srcTemporal)
  
    })
  })
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


generarCredito(){
  
  this.operacion.idTipoIdentificacion = 1;
  this.operacion.identificacion = this.tbQoCliente.cedulaCliente;
  this.operacion.nombreCliente =  this.tbQoCliente.primerNombre.concat(" ",
  this.tbQoCliente.apellidoMaterno == null ? "" : this.tbQoCliente.apellidoMaterno, 
   " ",this.tbQoCliente.apellidoPaterno," ",this.tbQoCliente.segundoApellido== null ? "" : this.tbQoCliente.segundoApellido)
  //this.operacion.fechaNacimientoCliente = this.tbQoCliente.fechaNacimiento
  console.log( new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()).toString())
  this.operacion.fechaEfectiva = diferenciaEnDias.convertirFechaAString(new Date())
 
  console.log(this.operacion.fechaEfectiva)
  this.operacion.codigoTablaAmortizacionQuski = "A107";
  this.operacion.codigoTipoCarteraQuski = "MO3";
  this.operacion.codigoTipoPrestamo = "001";
  //this.operacion.cupoPrestamo = 0.0;
  //this.operacion.montoSolicitado = Number(this.tbCreditoNegociacion.montoPreaprobado);
  this.operacion.pagoDia = 24;
  //this.operacion.datosCaptacion = null;
  //this.operacion.datosEmision = null;
  let datos = new DatosImpCom();
  datos.codigo = "L";
  //datos.formaPago = "C";
  //datos.tasa = 0.5;
  datos.valor = 0.0;
  this.operacion.datosImpCom.push( datos );
  //this.operacion.datosReferencia = null;
  //this.operacion.datosCuentaDebito = null;
  /////////////////



  this.css.operacionCrearCS( this.operacion ).subscribe( (data:any) =>{
    if (data) {
      console.log(data)
      console.log("data de operacionCrearCS ----->" + JSON.stringify(data));
    // this.tipoCartera = data.
     this.descripcionProducto.setValue(data.entidad.producto)
     console.log(data.entidad)
     
     this.destinoOperacion.setValue(data.entidad.producto)
     this.estadoOperacion.setValue(data.entidad.estado)
     this.tipoOperacion.setValue(data.entidad.estado)
     this.plazo.setValue(data.entidad.plazo)
     this.fechaEfectiva.setValue(this.operacion.fechaEfectiva);
     this.fechaVencimiento.setValue("");
     this.montoFinanciado.setValue(data.entidad.montoEntregar);
   //  valorDesembolso = new FormControl('');
     this.totalInteres.setValue(data.entidad.totalInteresVencimiento);
     this.cuotas.setValue(data.entidad.valorCuota);
  //   pagarCliente = new FormControl('');
   //  riesgoTotalCliente = new FormControl('');
 //    recibirCliente = new FormControl('');
 //    netoCliente = new FormControl('');
 
      console.log(" Funciona ----> operacionCrearCS")
    } else {
      this.sinNoticeService.setNotice("No me trajo data 'operacionCrearCS' :'(", 'error');
    }
  }, error=>{
    if (JSON.stringify(error).indexOf("codError") > 0){
      let b = error.error;
      this.sinNoticeService.setNotice(b.setmsgError,'error');
    } else {
      this.sinNoticeService.setNotice("No se pudo capturar el error :c", 'error');
    }
  });
}


generarCreditoMontoSugerido(){
  //this.operacion.montoSolicitado = this.montoSolicitado.value
  this.css.operacionCrearCS( this.operacion ).subscribe( data =>{
    if (data) {
      console.log("data de operacionCrearCS ----->" + JSON.stringify(data));
      
      console.log(" Funciona ----> operacionCrearCS")
    } else {
      this.sinNoticeService.setNotice("No me trajo data 'operacionCrearCS' :'(", 'error');
    }
  }, error=>{
    if (JSON.stringify(error).indexOf("codError") > 0){
      let b = error.error;
      this.sinNoticeService.setNotice(b.setmsgError,'error');
    } else {
      this.sinNoticeService.setNotice("No se pudo capturar el error :c", 'error');
    }
  });
}


  consultarClienteCS(){
  let entidadConsultaCliente  = new ConsultaCliente();
  entidadConsultaCliente.identificacion = this.tbQoCliente.cedulaCliente;
  entidadConsultaCliente.idTipoIdentificacion = 1;
  this.css.consultarClienteCS( entidadConsultaCliente ).subscribe( (data : any) => {
    if (data) {
      //console.log("consultarClienteCS --> Funciona");
      console.log("Pitufo", data.cuentasBancariasCliente[0].cuenta)
      console.log("Consulta del cliente en Cloustudio --> " + JSON.stringify(data) );
      this.numeroCuenta.setValue(data.cuentasBancariasCliente[0].cuenta== null ? "" : data.cuentasBancariasCliente[0].cuenta)
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
buscarExcepcionEdad(){
  console.log("Buscar excepcion",this.tbCreditoNegociacion.tbQoNegociacion.id)
  this.es.findByTipoExcepcionAndIdNegociacionAndCaracteristica("EXCEPCION_CLIENTE",
  this.tbCreditoNegociacion.tbQoNegociacion.id, "edad").subscribe((data:any)=>{
    if(data){
    console.log("se imprime",  data.list[0])
      if(data.list[0].estadoExcepcion){
        
      }
    }else{

    }
  })
}

anularFunda(){

}



}

 

