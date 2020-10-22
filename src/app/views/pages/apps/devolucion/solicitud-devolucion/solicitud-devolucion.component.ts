import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatStepper, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { ConsultaCliente } from '../../../../../core/model/softbank/ConsultaCliente';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Page } from '../../../../../core/model/page';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DocumentoHabilitanteService } from '../../../../../core/services/quski/documento-habilitante.service';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { TasacionService } from '../../../../../core/services/quski/tasacion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { diferenciaEnDias } from '../../../../../core/util/diferenciaEnDias';
import { TbQoDevolucion } from '../../../../../core/model/quski/TbQoDevolucion';
import { DevolucionService } from '../../../../../core/services/quski/devolucion.service';

@Component({
  selector: 'kt-solicitud-devolucion',
  templateUrl: './solicitud-devolucion.component.html',
  styleUrls: ['./solicitud-devolucion.component.scss']
})
export class SolicitudDevolucionComponent implements OnInit{
  public formCreditoNuevo: FormGroup = new FormGroup({});
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // datos operacion
  public codigoOperacion = new FormControl('');
  public proceso = new FormControl('');

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
 
  fechaUtil:diferenciaEnDias;
  fechaServer;
///operativa

joyasList  = [{"tipoOro": "18KILATES", 
"tipoJoya":"VARIOS", 
"estadoJoya":"BUEN ESTADOS",
"descripcion":"PesoBruto",
"tienesPiedras": "NO",
"detallePiedras":  "VARIOS",
"descuentoPeso": "0.00",
"pesoNeto": "11.30",
"valorAvaluo":  "311.20",
"fundaMadre" : "A0123",
"fundaActual": "A0123",
"ciudadTevcol": "Quito"
},
{"tipoOro": "18KILATES", 
"tipoJoya":"VARIOS", 
"estadoJoya":"BUEN ESTADOS",
"descripcion":"PesoBruto",
"tienesPiedras": "NO",
"detallePiedras":  "VARIOS",
"descuentoPeso": "0.00",
"pesoNeto": "11.30",
"valorAvaluo":  "311.20",
"fundaMadre" : "A0123",
"fundaActual": "A0123",
"ciudadTevcol": "Quito"
}
  
]
 
  //url=;objeto=ewogICAgIm5vbWJyZUNsaWVudGUiOiAiRGllZ28iLAogICAgImlkQ2xpZW50ZSI6ICIxMzExMDY2NDQyIiwKICAgICJudW1lcm9PcGVyYWNpb24iOiAiY29kLTEyIiwKICAgICJudW1lcm9PcGVyYWNpb25NYWRyZSIgOiAiIiwKICAgICJudW1lcm9PcGVyYWNpb25NdXBpIjogIiIsCiAgICAiZmVjaGFBcHJvYmFjaW9uIiA6ICIiLAogICAgImZlY2hhVmVuY2ltaWVudG8iOiAiIiwKICAgICJtb250b0ZpbmFuY2lhZG8iOiAiNzAwIiwKICAgICJhc2Vzb3IiOiAiSnVhbml0byIsCiAgICAiZXN0YWRvT3BlcmFjaW9uIjogICJDQU5DRUxBRE8iLAogICAgInRpcG9DcmVkaXRvIjogIiIsCiAgICAiY29kaWdvVGFibGFBbW9ydGl6YWNpb25RdXNraSI6IkEwMSIsCiAgICAiaW1wYWdvIjogIm5vIiwKICAgICJyZXRhbnF1ZW8iOiAibm8iLAogICAgImNvYmVydHVyYUluaWNpYWwiOiAiMTIwMCIsCiAgICAiY29iZXJ0dXJhQWN0dWFsIjogIjExMDAiLAogICAgImJsb3F1ZW8iOiIiLAogICAgImRpYXNNb3JhIjogIiIsCiAgICAiZXN0YWRvVWJpY2FjaW9uIjoiIiwKICAgICJlc3RhZG9Qcm9jZXNvIjoiIiwKICAgICJjb2RpZ29TZXJ2aWNpbyI6IiIsCiAgICAibWlncmFkbyI6ICIiCgp9
  ///
  
  
  //observables
 

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
  idCreditoNegociacion= 96
  //TABLA
  displayedColumnsJoyas = ['tipoOro',  'tipoJoya', 'estadoJoya', 'descripcion', 'pesoBruto',
  ,'tienePiedras','detallePiedras','descuentoPesoPiedra', 'pesoNeto',  'valorAvaluo', 'numeroFundaMadre',
   'numeroFundaActual', 'ciudadTevcol'];
  
  
  displayedColumnsHeredero = ['cedula', 'nombre']
  displayedColumnsCredito= ['fechaAprobacion','fechaVencimiento','monto']
 /**Obligatorio paginacion */
 p = new Page();
 dataSourceJoyas = new MatTableDataSource;
 dataSourceContrato = new MatTableDataSource;
 dataSourceHeredero =new MatTableDataSource;
 //:MatTableDataSource<TbMiCliente>=new MatTableDataSource<TbMiCliente>();

objetoDatos = 'ewogICAgIm5vbWJyZUNsaWVudGUiOiAiRGllZ28iLAogICAgImlkQ2xpZW50ZSI6ICIxMzExMDY2NDQyIiwKICAgICJudW1lcm9PcGVyYWNpb24iOiAiY29kLTEyIiwKICAgICJudW1lcm9PcGVyYWNpb25NYWRyZSIgOiAiIiwKICAgICJudW1lcm9PcGVyYWNpb25NdXBpIjogIiIsCiAgICAiZmVjaGFBcHJvYmFjaW9uIiA6ICIiLAogICAgImZlY2hhVmVuY2ltaWVudG8iOiAiIiwKICAgICJtb250b0ZpbmFuY2lhZG8iOiAiNzAwIiwKICAgICJhc2Vzb3IiOiAiSnVhbml0byIsCiAgICAiZXN0YWRvT3BlcmFjaW9uIjogICJDQU5DRUxBRE8iLAogICAgInRpcG9DcmVkaXRvIjogIiIsCiAgICAiY29kaWdvVGFibGFBbW9ydGl6YWNpb25RdXNraSI6IkEwMSIsCiAgICAiaW1wYWdvIjogIm5vIiwKICAgICJyZXRhbnF1ZW8iOiAibm8iLAogICAgImNvYmVydHVyYUluaWNpYWwiOiAiMTIwMCIsCiAgICAiY29iZXJ0dXJhQWN0dWFsIjogIjExMDAiLAogICAgImJsb3F1ZW8iOiIiLAogICAgImRpYXNNb3JhIjogIiIsCiAgICAiZXN0YWRvVWJpY2FjaW9uIjoiIiwKICAgICJlc3RhZG9Qcm9jZXNvIjoiIiwKICAgICJjb2RpZ29TZXJ2aWNpbyI6IiIsCiAgICAibWlncmFkbyI6ICIiCgp9'
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
  

  constructor(private cns: CreditoNegociacionService, private sinNoticeService: ReNoticeService, private tas: TasacionService,
    public dialog: MatDialog, private dhs: DocumentoHabilitanteService,
    private css: SoftbankService, 
    private par: ParametroService, private route: ActivatedRoute,
    private router: Router,
    private devService: DevolucionService) { 
    
    
  }

  ngOnInit() {
    this.enableHerederoButton = this.enableHeredero.asObservable();
    this.enableHeredero.next(false);
    this.setFechaSistema();
    
    this.decodeObjetoDatos();
  
    this.consultarEstadosCivilesCS();
    this.consultarEducacionCS();
    this.consultaGeneroCS();
    this.consultarLugaresCS();
    this.consultarPaisCS();
    this.consultarTipoCliente();
    this.consultarAgencia();
    this.getParametros();
    this.cargarDatos();
    this.getJoyas();

    console.log(typeof(this.catalagoEstadosCiviles))
    console.log( this.catalagoEstadosCiviles)

   
   
    
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
 

  decodeObjetoDatos(){
    
   // let array = new Array();
   // array.push(JSON.parse(decodeURIComponent(escape( atob(this.objetoDatos)))));
    this.datos = JSON.parse(atob(this.objetoDatos))
    console.log(this.datos)
    console.log(typeof(this.datos))
  
   this.nombresCompletos.setValue(this.datos.nombreCliente)
   this.codigoOperacion.setValue(this.datos.numeroOperacion)
  }
  cargarDatos(){
   
    this.consultarClienteCS();
    
    console.log(this.datos.nombreCliente)
    this.nombresCompletos.setValue(this.datos.nombreCliente)
    this.codigoOperacion.setValue(this.datos.numeroOperacion)
    this.proceso.setValue(this.datos.proceso)
    this .cedulaCliente.setValue(this.datos.idCliente)
  }


  consultarClienteCS(){
    let entidadConsultaCliente = new ConsultaCliente();
    
    //console.log(" "  + cedula)
    entidadConsultaCliente.identificacion = this.datos.idCliente;
    entidadConsultaCliente.idTipoIdentificacion = 1;

    this.css.consultarClienteCS(entidadConsultaCliente).subscribe((data: any) => {
      if (data) {
      console.log(data) 
      console.log(data.codigoEstadoCivil)
      this.nivelEducacion.setValue(this.buscarEnCatalogo(this.catalogoEducacion, data.codigoEducacion).nombre)
      this.genero.setValue(this.buscarEnCatalogo(this.catalogoGenero, data.codigoSexo).nombre)
      this.estadoCivil.setValue(this.buscarEnCatalogo(this.catalagoEstadosCiviles, data.codigoEstadoCivil).nombre)
      this.fechaNacimiento.setValue(data.fechaNacimiento)
      this.nacionalidad.setValue(this.catalogoPais.find(p=>p.id==data.idPais).nombre)
      this.edad.setValue(Math.floor(this.getEdad(data.fechaNacimiento)))
      //this.lugarNacimiento.setValue(this.catalogoPais.find(p=>p.idDivisionNivelBajo==data.idPais).nombre)

      } else {
        this.sinNoticeService.setNotice("No me trajo datos 'entidadConsultaCliente'", 'error');
      }

    }, error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("Error no fue cacturado en 'consultarClienteCS' :(", 'error');

      }
    });
  }

  buscarEnCatalogo(nombreCatalogo, codigoObjeto){
    return nombreCatalogo.find(p=>p.codigo==codigoObjeto)

  }

  encriptarDatos(objeto){
    return btoa(unescape(encodeURIComponent(objeto)))
  }

  getParametros(): void {
   
    this.route.paramMap.subscribe(
      (params: Params) => {
      
       
        this.parametroObjeto = params.get('objeto');
     
       
      },
      error => {
        this.sinNoticeService.setNotice('Ocurrio un error al obtener el codigo del contrato: ' + JSON.stringify(error), 'error');
      }
    );
  }

  registrarDevolucion(){
    let tbQoDevolucion: TbQoDevolucion
    tbQoDevolucion.codigo = this.codigoOperacion.value
    tbQoDevolucion.asesor = "Asesor quemado"
    tbQoDevolucion.aprobador = ""
    tbQoDevolucion.nombreCliente= this.nombresCompletos.value
    tbQoDevolucion.cedulaCliente = this.cedulaCliente.value
    tbQoDevolucion.codigoOperacion = this.codigoOperacion.value
    tbQoDevolucion.nivelEducacion = this.nivelEducacion.value
    tbQoDevolucion.separacionBienes = this.separacionBienes.value
    tbQoDevolucion.estado = 'PENDIENTE_APROBACION'
    tbQoDevolucion.fechaNacimiento = this.fechaNacimiento.value
    tbQoDevolucion.nacionalidad = this.nacionalidad.value
    tbQoDevolucion.lugarNacimiento = this.lugarNacimiento.value
    tbQoDevolucion.tipoCliente = this.tipoCliente.value
    tbQoDevolucion.observaciones = this.observaciones.value
    tbQoDevolucion.agenciaEntrega = this.agenciaEntrega.value
    tbQoDevolucion.valorCustodia = this.valorCustodia.value
    tbQoDevolucion.codeDetalleCredito = this.valorCustodia.value
    tbQoDevolucion.codeDetalleGarantia = this.observaciones.value
    
    this.devService.guardarDevolucion(tbQoDevolucion).subscribe((data:any)=>{
      if(data.entidad){
        this.sinNoticeService.setNotice(
          "Guardado correctamente",
          "success"
        );
       // this.router.navigate(["/midas-oro/cliente/list-cliente"]);
      } else {
        this.sinNoticeService.setNotice(
          "Ocurrio un error al guardar",
          "warning"
        );
        //console.log(rWClient);
      }
      
    })
  }

     /**
   * Obligatorio Paginacion: Ejecuta la busqueda cuando se ejecuta los botones del paginador
   */

   /*
  paged() {
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',this.paginator.pageIndex)
    this.cargarDatosOperacion();
  }*/

  
   /**
   * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
   */

   /*
  buscar() {
    this.initiateTablePaginator();
    this.p=this.getPaginacion(this.sort.active, this.sort.direction, 'Y',0);
    this.cargarDatosOperacion();
  }*/
/*
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
*/
/*
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
      
}*/


setFechaSistema(){
  this.cns.getSystemDate().subscribe((fechaSistema: any) => {
   this.fechaServer = new Date( fechaSistema.entidad);
   console.log(this.fechaServer) 
  })
}
  
getEdad(fechaValue){
  this.fechaUtil = new diferenciaEnDias(new Date(fechaValue),new Date( this.fechaServer) )
  return this.fechaUtil.obtenerDias()/365
 }



 getJoyas(){
  this.dataSourceJoyas = new MatTableDataSource<any>(this.joyasList);
   this.tas.getTasacionByIdCredito(this.p,this.idCreditoNegociacion).subscribe((data:any)=>{
     console.log("que pasa por la calle", data.list)
     
     this.totalResults = data.totalResults;
      
        //this.calcular()
       
       
  
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'info');
   }, error=> {
    this.sinNoticeService.setNotice("ERROR CARGANDO LAS JOYAS", 'error');
   })
 }


 

/*
calcular(){

  this.totalPesoN =0;
  this.totalPesoB =0;
  this.totalPBFunda = 0
  this.totalValorR = 0
  this.totalValorA = 0
  this.totalValorC = 0
  this.totalNumeroJoya = 0
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
    this.totalNumeroJoya = Number(this.totalNumeroJoya) + Number(element.numeroPiezas)
    });
    
  }
}

*/

/* ----------TRACKING-------*/




consultaGeneroCS(){
  this.css.consultarGeneroCS().subscribe((data:any)=>{
    //console.log("me trajo data de catalogos de GENERO ----->" + JSON.stringify(data))
    if (!data.existeError) {

      //this.listNombreGenero = data.catalogo;
      console.log(" GENERO -----> " , data )
      this.catalogoGenero=data.catalogo

    } else {
      //console.log("No me trajo data de catalogos de GENERO ----->" + JSON.stringify(data));
    } error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.setmsgError, 'error');
      } else {
        this.sinNoticeService.setNotice("No se pudo capturar el error :c", 'error');
      }
    }
  });
}

consultarEstadosCivilesCS(){
  this.css.consultarEstadosCivilesCS().subscribe((data: any)=> {
    //console.log("Consulta de catalogos de estado civil ----->" + JSON.stringify(data));
    if (!data.existeError) {
      //this.listNombreEstadoCivil = data.catalogo;
      console.log(data)
      this.catalagoEstadosCiviles = data.catalogo
      
      
    } else {
      //console.log("No me trajo data de catalogos de ESTADO CIVIL ----->" + JSON.stringify(data));
    } error => {
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.setmsgError, 'error');
      } else {
        this.sinNoticeService.setNotice("No se pudo capturar el error :c", 'error');
      }
    }
  });
}
consultarEducacionCS(){
  this.css.consultarEducacionCS().subscribe((data:any)=> {
    if(!data.existeError){
      this.catalogoEducacion = data.catalogo
    }
  })
}

consultarPaisCS(){
  this.css.consultarPaisCS().subscribe((data:any)=> {
    if(!data.existeError){
      console.log(data)
      this.catalogoPais = data.catalogo
    }
  })
}

consultarLugaresCS(){
  
    this.css.consultarDivicionPoliticaConsolidadaCS().subscribe((data:any)=>{
      if(!data.existeError){
        console.log(data)
        this.catalogoLugarNacimiento = data.divisionPoliticaConsolidado
      }
    })

}


consultarTipoCliente(){
  this.css.consultarTipoClienteCS().subscribe((data:any)=>{
    if(!data.existeError){
      console.log(data)
      this.catalogoTipoCliente = data.catalogo
    }
  })
}


consultarAgencia(){
  this.css.consultarAgenciasCS().subscribe((data:any)=>{
    if(!data.existeError){
      console.log(data)
      this.catalogoAgencia = data.catalogo
    }
  })
}

validateHeredero(){
  if (this.tipoCliente.value.toUpperCase()==="HEREDERO" ){
    this.enableHeredero.next(true)
    
} else if (this.tipoCliente.value.toUpperCase()==="DEUDOR" ){
  this.enableHeredero.next(false)
  
}
}

agregarEnTabla(){
  this.listTablaHeredero.push([{ cedula :this.cedulaHeredero.value, nombre: this.nombreHeredero.value}])
  this.dataSourceHeredero=new MatTableDataSource<any>(this.listTablaHeredero);
  console.log(this.listTablaHeredero)
}
} 