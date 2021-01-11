import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatStepper, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Page } from '../../../../../core/model/page';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';

@Component({
  selector: 'kt-cancelacion-solicitud-devolucion',
  templateUrl: './cancelacion-solicitud-devolucion.component.html',
  styleUrls: ['./cancelacion-solicitud-devolucion.component.scss']
})
export class CancelacionSolicitudDevolucionComponent implements OnInit{
  public formCreditoNuevo: FormGroup = new FormGroup({});
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // datos operacion
  public codigoOperacion = new FormControl('');
  public procesoDev = new FormControl('');
  disableCancelacionButton;
  disableCancelacion = new BehaviorSubject<boolean>(false);

  proceso= "DEVOLUCION"
 //datos cliente
 public cedulaCliente = new FormControl('');
 public nombresCompletos = new FormControl('');
 public nivelEducacion = new FormControl('');
 public genero = new FormControl('');
 public estadoCivil = new FormControl('');
 public separacionBienes = new FormControl('');
 public fechaNacimiento = new FormControl('');
 public nacionalidad = new FormControl('');
 public lugarNacimiento = new FormControl('');
 public edad = new FormControl('');

 //GESTION DEVOLUCION
 public tipoCliente = new FormControl('');
 public observaciones = new FormControl('');
 public agenciaEntrega = new FormControl('');
 public valorCustodia = new FormControl('');
 public cedulaHeredero = new FormControl('');
 public nombreHeredero = new FormControl('');
 idDevolucion
  fechaUtil:diferenciaEnDias;
  fechaServer;
///operativa

joyasList  = []
 list =[];
  //url=;objeto=ewogICAgIm5vbWJyZUNsaWVudGUiOiAiRGllZ28iLAogICAgImlkQ2xpZW50ZSI6ICIxMzExMDY2NDQyIiwKICAgICJudW1lcm9PcGVyYWNpb24iOiAiY29kLTEyIiwKICAgICJudW1lcm9PcGVyYWNpb25NYWRyZSIgOiAiIiwKICAgICJudW1lcm9PcGVyYWNpb25NdXBpIjogIiIsCiAgICAiZmVjaGFBcHJvYmFjaW9uIiA6ICIiLAogICAgImZlY2hhVmVuY2ltaWVudG8iOiAiIiwKICAgICJtb250b0ZpbmFuY2lhZG8iOiAiNzAwIiwKICAgICJhc2Vzb3IiOiAiSnVhbml0byIsCiAgICAiZXN0YWRvT3BlcmFjaW9uIjogICJDQU5DRUxBRE8iLAogICAgInRpcG9DcmVkaXRvIjogIiIsCiAgICAiY29kaWdvVGFibGFBbW9ydGl6YWNpb25RdXNraSI6IkEwMSIsCiAgICAiaW1wYWdvIjogIm5vIiwKICAgICJyZXRhbnF1ZW8iOiAibm8iLAogICAgImNvYmVydHVyYUluaWNpYWwiOiAiMTIwMCIsCiAgICAiY29iZXJ0dXJhQWN0dWFsIjogIjExMDAiLAogICAgImJsb3F1ZW8iOiIiLAogICAgImRpYXNNb3JhIjogIiIsCiAgICAiZXN0YWRvVWJpY2FjaW9uIjoiIiwKICAgICJlc3RhZG9Qcm9jZXNvIjoiIiwKICAgICJjb2RpZ29TZXJ2aWNpbyI6IiIsCiAgICAibWlncmFkbyI6ICIiCgp9
  ///
  //TOTALIZADOS
  totalPesoNeto;
  totalPesoBruto;
  totalValorAvaluo;
  
  //observables
  objetoCredito ={
    "fechaAprobacion": "",
    "fechaVencimiento": "",
    "monto": ""
  }

  enableHerederoButton;
  enableHeredero = new BehaviorSubject<boolean>(false);
 
  clienteSoftbank
  totalResults

  /// catalogos
  catalagoEstadosCiviles
  catalogoGenero
  catalogoLugarNacimiento
  catalogoEducacion
  catalogoPais
  catalogoTipoCliente
  catalogoAgencia
  tipoClienteList = ['DEUDOR', 'HEREDERO']
  /// src 
  listTablaHeredero = []
  parametroObjeto 

  //TABLA
  displayedColumnsJoyas = ['tipoOro', 'tipoJoya', 'estadoJoya', 'descripcion', 'pesoBruto',
  'tienePiedras','detallePiedras','descuentoPesoPiedra', 'pesoNeto', 
   'valorAvaluo', 'numeroFundaMadre',
   'numeroFundaActual', 'ciudadTevcol'];
  
  
  displayedColumnsHeredero = ['cedula', 'nombre']
  displayedColumnsCredito= ['fechaAprobacion','fechaVencimiento','monto']
 /**Obligatorio paginacion */
 p = new Page();
 dataSourceJoyas = new MatTableDataSource;
 dataSourceContrato = new MatTableDataSource;
 dataSourceHeredero =new MatTableDataSource;
 //:MatTableDataSource<TbMiCliente>=new MatTableDataSource<TbMiCliente>();

objetoDatos = 'ewogICAgIm5vbWJyZUNsaWVudGUiOiAiRGllZ28iLAogICAgImlkQ2xpZW50ZSI6ICIxMzExMDY2NDQyIiwKICAgICJudW1lcm9PcGVyYWNpb24iOiAiY29kLTEyIiwKICAgICJudW1lcm9PcGVyYWNpb25NYWRyZSIgOiAiIiwKICAgICJudW1lcm9PcGVyYWNpb25NdXBpIjogIiIsCiAgICAiZmVjaGFBcHJvYmFjaW9uIiA6ICIyMDIwLTEwLTEyIiwKICAgICJmZWNoYVZlbmNpbWllbnRvIjogIjIwMjAtMTEtMTAiLAogICAgIm1vbnRvRmluYW5jaWFkbyI6ICI3MDAiLAogICAgImFzZXNvciI6ICJKdWFuaXRvIiwKICAgICJlc3RhZG9PcGVyYWNpb24iOiAgIkNBTkNFTEFETyIsCiAgICAidGlwb0NyZWRpdG8iOiAiIiwKICAgICJjb2RpZ29UYWJsYUFtb3J0aXphY2lvblF1c2tpIjoiQTAxIiwKICAgICJpbXBhZ28iOiAibm8iLAogICAgInJldGFucXVlbyI6ICJubyIsCiAgICAiY29iZXJ0dXJhSW5pY2lhbCI6ICIxMjAwIiwKICAgICJjb2JlcnR1cmFBY3R1YWwiOiAiMTEwMCIsCiAgICAiYmxvcXVlbyI6IiIsCiAgICAiZGlhc01vcmEiOiAiIiwKICAgICJlc3RhZG9VYmljYWNpb24iOiIiLAogICAgImVzdGFkb1Byb2Nlc28iOiIiLAogICAgImNvZGlnb1NlcnZpY2lvIjoiIiwKICAgICJtaWdyYWRvIjogIiIKCn0='
datos
  // VARIABLES DE TRACKING
  public horaAsignacionCreacion: Date = null;
  public horaInicioCreacion: Date;
  public horaAtencionCreacion: Date;
  public horaFinalCreacion: Date = null;
  public procesoCreacion: string;
  public horaInicioDocumentosLegales: Date;
  public horaAsignacionDocumentosLegales: Date;
  public horaAtencionDocumentosLegales: Date;
  public horaFinalDocumentosLegales: Date;
  public actividad: string;
  public procesoDocumentosLegales: string;
  public catalago


 @ViewChild('paginator', { static: true })  paginator: MatPaginator;
 @ViewChild( 'stepper', { static: true })  stepper: MatStepper;
 /* documentos habilitantes
 totalResults: number;
 pageSize = 5;
 currentPage;
 proceso= "CREDITONUEVO"
 
 */
 /**Obligatorio ordenamiento */
 @ViewChild('sort1', {static: true}) sort: MatSort;
  

  constructor(
    private cns: CreditoNegociacionService, 
    private sinNoticeService: ReNoticeService, 
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private router: Router,
    private devService: DevolucionService) { 
      this.cns.setParameter();
      this.devService.setParameter();
  }

  ngOnInit() {
    this.cns.setParameter();
    this.devService.setParameter();
    this.getParametros();
    this.enableHerederoButton = this.enableHeredero.asObservable();
    this.enableHeredero.next(false);
    this.disableCancelacionButton = this.disableCancelacion.asObservable();
    this.disableCancelacion.next(true);
    this.setFechaSistema();
    this.datos = this.decodeObjetoDatos(this.objetoDatos);
    this.cargarDatos();
   this.validateExisteProcesoCancelacion();
    this.validateCancelacion();
    //console.log("el encode", )
    //console.log(typeof(this.catalagoEstadosCiviles))
    //console.log( this.catalagoEstadosCiviles)


   
    
  }

  
  ngAfterViewInit(){
   // this.buscar();
  }
 /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */


     /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */
 

  decodeObjetoDatos(entrada){
    
   // let array = new Array();
   // array.push(JSON.parse(decodeURIComponent(escape( atob(this.objetoDatos)))));
    return JSON.parse(atob(entrada))
   
  }


  encodeObjetos(entrada){
   
    return  btoa(unescape(encodeURIComponent(JSON.stringify(entrada))))
  }


  cargarDatos(){
    let listDatosCreditos = []
    this.devService.getDevolucion(this.idDevolucion).subscribe((data:any)=> {
      if(data.entidad){
        //console.log("Hello", data.entidad)
        this.codigoOperacion.setValue(data.entidad.codigoOperacion)
        this.procesoDev.setValue("DEVOLUCION")
        this.cedulaCliente.setValue(data.entidad.cedulaCliente)
        this.estadoCivil.setValue(data.entidad.estadoCivil)
        this.fechaNacimiento.setValue(data.entidad.fechaNacimiento)
        this.nacionalidad.setValue(data.entidad.nacionalidad)
        this.nivelEducacion.setValue(data.entidad.nivelEducacion)
        this.nombresCompletos.setValue(data.entidad.nombreCliente)
        this.observaciones.setValue(data.entidad.observaciones)
        this.tipoCliente.setValue(data.entidad.tipoCliente)
        this.agenciaEntrega.setValue(data.entidad.agenciaEntrega)
        this.genero.setValue(data.entidad.genero)
        this.separacionBienes.setValue(data.entidad.separacionBienes)
        this.validateHeredero();
        this.lugarNacimiento.setValue(data.entidad.lugarNacimiento)
        this.valorCustodia.setValue(data.entidad.valorCustodiaAprox.toFixed(2))
        this.joyasList=this.decodeObjetoDatos(data.entidad.codeDetalleGarantia)
        this.listTablaHeredero = this.decodeObjetoDatos(data.entidad.codeHerederos);
        listDatosCreditos.push(this.decodeObjetoDatos(data.entidad.codeDetalleCredito))
        this.dataSourceContrato = new MatTableDataSource<any>(listDatosCreditos)
        this.dataSourceJoyas =  new MatTableDataSource<any>(this.joyasList)
        this.dataSourceHeredero=new MatTableDataSource<any>(this.listTablaHeredero);
        this.edad.setValue(this.getEdad(data.entidad.fechaNacimiento).toFixed(0))

        this.calcularTotalizados();
      }
    })
  
  
  }



  encriptarDatos(objeto){
    return btoa(unescape(encodeURIComponent(objeto)))
  }

  getParametros(): void {
   
    this.route.paramMap.subscribe(
      (params: Params) => {
      
       
        this.idDevolucion = params.get('idDevolucion');
        //console.log("parametro", this.idDevolucion)
       
      },
      error => {
        this.sinNoticeService.setNotice('Ocurrio un error al obtener el codigo del contrato: ' + JSON.stringify(error), 'error');
      }
    );
  }


setFechaSistema(){
  this.cns.getSystemDate().subscribe((fechaSistema: any) => {
   this.fechaServer = new Date( fechaSistema.entidad);
   //console.log(this.fechaServer) 
  })
}
  
getEdad(fechaValue){
  this.fechaUtil = new diferenciaEnDias(new Date(fechaValue),new Date( this.fechaServer) )
  return this.fechaUtil.obtenerDias()/365
 }


 calcularTotalizados(){

  this.totalPesoNeto =0;
  this.totalPesoBruto =0;
 
  this.totalValorAvaluo = 0

  let ind = 0;
  if (this.dataSourceJoyas.data) {
    ////console.log("<<<<<<<<<<Data source >>>>>>>>>> "+ JSON.stringify(this.dataSourceContratos.data));
 
    this.joyasList.forEach(element => {
      


    this.totalPesoNeto = Number(this.totalPesoNeto) + Number(element.pesoNeto);
    this.totalPesoBruto = Number(this.totalPesoBruto) + Number(element.pesoBruto);
    this.totalValorAvaluo = Number(this.totalValorAvaluo) + Number(element.valorAvaluo);

    });
    
  }
}



/* ----------TRACKING-------*/






validateHeredero(){
  if (this.tipoCliente.value.toUpperCase()==="HEREDERO" ){
    this.enableHeredero.next(true)
    
} else if (this.tipoCliente.value.toUpperCase()==="DEUDOR" ){
  this.enableHeredero.next(false)
  
}
}


anularSolicitud(){
  this.devService.cancelacionSolicitud(this.idDevolucion).subscribe((data:any)=>{
    if(data.entidad){
      this.sinNoticeService.setNotice("Se ha registrado la solicitud de cancelacion", "success")
      this.disableCancelacion.next(false);
      //console.log("Exito")
      this.router.navigate(['negociacion/bandeja-operaciones'    ]);
     

    }else{
      this.sinNoticeService.setNotice("Error al registrar", "error")
      this.disableCancelacion.next(true);
    }

  })
}

  validateExisteProcesoCancelacion(){
    this.devService.existeCancelacionCancelacion(this.idDevolucion).subscribe((data:any)=>{
      if(data.entidad){
        //console.log("La validacion", data)
      
        this.sinNoticeService.setNotice("Ya existe un proceso de cancelación para la devolución", "warning")
        this.disableCancelacion.next(false);
      }else {
        //console.log("Deberia ser False")
        this.disableCancelacion.next(true);
      }
    })
  }

  /*Valida si la cancelacion cumple con los estados requeridos
  */
  validateCancelacion(){
 
      this.devService.validarCancelacionSolicitud(this.idDevolucion).subscribe((data:any)=>{
        if(data.entidad.bandera){
          //console.log("La validacion", data)
          this.disableCancelacion.next(true);
          
        }else {
          //console.log("Deberia ser False")
          this.sinNoticeService.setNotice( data.entidad.mensaje, "warning")
          this.disableCancelacion.next(false);
        }
      })

    
 
  }

} 
