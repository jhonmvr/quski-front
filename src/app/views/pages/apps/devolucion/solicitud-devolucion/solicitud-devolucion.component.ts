import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ValidateCedula } from '../../../../../core/util/validate.util';

@Component({
  selector: 'kt-solicitud-devolucion',
  templateUrl: './solicitud-devolucion.component.html',
  styleUrls: ['./solicitud-devolucion.component.scss']
})
export class SolicitudDevolucionComponent implements OnInit{
  public heredero: FormGroup = new FormGroup({});
  public devolucionForm: FormGroup = new FormGroup({});
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // datos operacion
  public codigoOperacion = new FormControl('');
  public procesoDev = new FormControl('');



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
 public tipoCliente = new FormControl('', [Validators.required]);
 public observaciones = new FormControl('');
 public agenciaEntrega = new FormControl('', [Validators.required]);
 public valorCustodia = new FormControl('');
 public cedulaHeredero = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
 public nombreHeredero =  new FormControl('', [Validators.required]);
 
  fechaUtil:diferenciaEnDias;
  fechaServer;
///operativa

joyasList  = [{"tipoOro": "18KILATES", 
"tipoJoya":"VARIOS", 
"estadoJoya":"BUEN ESTADOS",
"descripcion":"ESA MISMA",
"pesoBruto":"12.00",
"tienePiedras": "NO",
"detallePiedras":  "VARIOS",
"descuentoPesoPiedra": "0.00",
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
"pesoBruto":"12.00",
"tienePiedras": "NO",
"detallePiedras":  "VARIOS",
"descuentoPesoPiedra": "0.00",
"pesoNeto": "11.30",
"valorAvaluo":  "311.20",
"fundaMadre" : "A0123",
"fundaActual": "A0123",
"ciudadTevcol": "Quito"
}
  
]
 
  //url=;objeto=ewogICAgIm5vbWJyZUNsaWVudGUiOiAiRGllZ28iLAogICAgImlkQ2xpZW50ZSI6ICIxMzExMDY2NDQyIiwKICAgICJudW1lcm9PcGVyYWNpb24iOiAiY29kLTEyIiwKICAgICJudW1lcm9PcGVyYWNpb25NYWRyZSIgOiAiIiwKICAgICJudW1lcm9PcGVyYWNpb25NdXBpIjogIiIsCiAgICAiZmVjaGFBcHJvYmFjaW9uIiA6ICIiLAogICAgImZlY2hhVmVuY2ltaWVudG8iOiAiIiwKICAgICJtb250b0ZpbmFuY2lhZG8iOiAiNzAwIiwKICAgICJhc2Vzb3IiOiAiSnVhbml0byIsCiAgICAiZXN0YWRvT3BlcmFjaW9uIjogICJDQU5DRUxBRE8iLAogICAgInRpcG9DcmVkaXRvIjogIiIsCiAgICAiY29kaWdvVGFibGFBbW9ydGl6YWNpb25RdXNraSI6IkEwMSIsCiAgICAiaW1wYWdvIjogIm5vIiwKICAgICJyZXRhbnF1ZW8iOiAibm8iLAogICAgImNvYmVydHVyYUluaWNpYWwiOiAiMTIwMCIsCiAgICAiY29iZXJ0dXJhQWN0dWFsIjogIjExMDAiLAogICAgImJsb3F1ZW8iOiIiLAogICAgImRpYXNNb3JhIjogIiIsCiAgICAiZXN0YWRvVWJpY2FjaW9uIjoiIiwKICAgICJlc3RhZG9Qcm9jZXNvIjoiIiwKICAgICJjb2RpZ29TZXJ2aWNpbyI6IiIsCiAgICAibWlncmFkbyI6ICIiCgp9
  ///
  

  ////////VARIABLES HABILITANTES
  idDevolucion
  procesoHabilitante = 'DEVOLUCION'
  estadoOperacion = 'SOLICITUD'
  
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

objetoDatos = 'ewogICAgIm5vbWJyZUNsaWVudGUiOiAiRGllZ28gSmF2aWVyIFNlcnJhbm8gQXJldmFsbyIsCiAgICAiaWRDbGllbnRlIjogIjE3MDY1ODc3MjAiLAogICAgIm51bWVyb09wZXJhY2lvbiI6ICJjb2QtMTciLAogICAgIm51bWVyb09wZXJhY2lvbk1hZHJlIiA6ICJjb2QtMTAiLAogICAgIm51bWVyb09wZXJhY2lvbk11cGkiOiAiIiwKICAgICJmZWNoYUFwcm9iYWNpb24iIDogIjIwMjAtMTAtMTIiLAogICAgImZlY2hhVmVuY2ltaWVudG8iOiAiMjAyMC0xMS0xMCIsCiAgICAibW9udG9GaW5hbmNpYWRvIjogIjg1MCIsCiAgICAiYXNlc29yIjogIkp1YW5pdG8iLAogICAgImVzdGFkb09wZXJhY2lvbiI6ICAiQ0FOQ0VMQURPIiwKICAgICJ0aXBvQ3JlZGl0byI6ICIiLAogICAgImNvZGlnb1RhYmxhQW1vcnRpemFjaW9uUXVza2kiOiJBMDEiLAogICAgImltcGFnbyI6ICJubyIsCiAgICAicmV0YW5xdWVvIjogIm5vIiwKICAgICJjb2JlcnR1cmFJbmljaWFsIjogIjEyMDAiLAogICAgImNvYmVydHVyYUFjdHVhbCI6ICIxMTAwIiwKICAgICJibG9xdWVvIjoiIiwKICAgICJkaWFzTW9yYSI6ICIiLAogICAgImVzdGFkb1ViaWNhY2lvbiI6IiIsCiAgICAiZXN0YWRvUHJvY2VzbyI6IiIsCiAgICAiY29kaWdvU2VydmljaW8iOiIiLAogICAgIm1pZ3JhZG8iOiAiIgp9'
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
  totalPesoNeto
  totalPesoBruto
  totalValorAvaluo 

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
    private css: SoftbankService, 
    private route: ActivatedRoute,
    private router: Router,
    private devService: DevolucionService) { 
      this.cns.setParameter();
      this.css.setParameter();
      this.devService.setParameter();
      this.heredero.addControl("cedulaHeredero", this.cedulaHeredero);
      this.heredero.addControl("nombreHeredero", this.nombreHeredero);
      this.devolucionForm.addControl("tipoCliente", this.tipoCliente);
      this.devolucionForm.addControl("observaciones", this.observaciones);
      this.devolucionForm.addControl("agenciaEntrega", this.agenciaEntrega);
      this.devolucionForm.addControl("valorCustodia", this.valorCustodia);
    
  }

  ngOnInit() {
    this.cns.setParameter();
    this.css.setParameter();
    this.devService.setParameter();
    this.enableHerederoButton = this.enableHeredero.asObservable();
    this.enableHeredero.next(false);
    this.setFechaSistema();

    
    this.datos = this.decodeObjetoDatos(this.objetoDatos);
  
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
    this.consultarClienteCS();
    this.objetoCredito.fechaAprobacion = this.datos.fechaAprobacion
    this.objetoCredito.fechaVencimiento = this.datos.fechaVencimiento
    this.objetoCredito.monto = this.datos.montoFinanciado
    listDatosCreditos.push(this.objetoCredito)
    //console.log(listDatosCreditos)
    this.dataSourceContrato = new MatTableDataSource<any>(listDatosCreditos)
    this.dataSourceJoyas =  new MatTableDataSource<any>(this.joyasList)
    //console.log("datasource Credito"  , this.objetoCredito)
    //console.log(this.datos.nombreCliente)
    this.procesoDev.setValue("DEVOLUCION")
    this.nombresCompletos.setValue(this.datos.nombreCliente)
    this.codigoOperacion.setValue(this.datos.numeroOperacion)

    this .cedulaCliente.setValue(this.datos.idCliente)
  }


  consultarClienteCS(){
    let entidadConsultaCliente = new ConsultaCliente();
    
    ////console.log(" "  + cedula)
    entidadConsultaCliente.identificacion = this.datos.idCliente;
    entidadConsultaCliente.idTipoIdentificacion = 1;

    this.css.consultarClienteCS(entidadConsultaCliente).subscribe((data: any) => {
      if (data) {
      //console.log(data) 
      //console.log(data.codigoEstadoCivil)
      this.nivelEducacion.setValue(this.buscarEnCatalogo(this.catalogoEducacion, data.codigoEducacion).nombre)
      this.genero.setValue(this.buscarEnCatalogo(this.catalogoGenero, data.codigoSexo).nombre)
      this.estadoCivil.setValue(this.buscarEnCatalogo(this.catalagoEstadosCiviles, data.codigoEstadoCivil).nombre)
      this.fechaNacimiento.setValue(data.fechaNacimiento)
      this.nacionalidad.setValue(this.catalogoPais.find(p=>p.id==data.idPais).nombre)
      console.log("fecha nacimiento", data.fechaNacimiento)
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
    if (this.devolucionForm.invalid) {
      this.sinNoticeService.setNotice('Llene los datos requeridos', 'warning');
      return;
    } 
    let tbQoDevolucion = new TbQoDevolucion()
    tbQoDevolucion.codigo =  "";
    tbQoDevolucion.asesor = "Asesor quemado"
    tbQoDevolucion.idAgencia = localStorage.getItem("idResidenciaAgencia") == null ? "" : localStorage.getItem("idResidenciaAgencia")
    tbQoDevolucion.nombreAgenciaSolicitud = "quemada"
    tbQoDevolucion.aprobador = "";
    tbQoDevolucion.nombreCliente= this.nombresCompletos.value
    tbQoDevolucion.cedulaCliente = this.cedulaCliente.value
    tbQoDevolucion.codigoOperacion =   this.codigoOperacion.value == null ? "" : this.codigoOperacion.value
    tbQoDevolucion.nivelEducacion = this.nivelEducacion.value
    tbQoDevolucion.estadoCivil = this.estadoCivil.value
    tbQoDevolucion.separacionBienes = this.separacionBienes.value
    tbQoDevolucion.estado = 'ACT'
    tbQoDevolucion.fechaNacimiento = this.fechaNacimiento.value
    tbQoDevolucion.nacionalidad = this.nacionalidad.value
    tbQoDevolucion.genero = this.genero.value
    tbQoDevolucion.lugarNacimiento = this.lugarNacimiento.value
    tbQoDevolucion.tipoCliente = this.tipoCliente.value
    tbQoDevolucion.observaciones = this.observaciones.value
    tbQoDevolucion.agenciaEntrega = this.agenciaEntrega.value.nombre
    tbQoDevolucion.codigoOperacionMadre = this.datos.numeroOperacionMadre == null ? "" : this.datos.numeroOperacionMadre
    tbQoDevolucion.fundaMadre = "QUEMADA-13"
    tbQoDevolucion.fundaActual = "ACTQUE-14"
    //console.log(this.agenciaEntrega.value)
    tbQoDevolucion.agenciaEntregaId  = this.agenciaEntrega.value.id
    //console.log(this.encodeObjetos(this.joyasList))
    //console.log("XD", this.decodeObjetoDatos(this.encodeObjetos(this.joyasList)));
    tbQoDevolucion.valorCustodiaAprox = 12.00
    tbQoDevolucion.codeHerederos = this.encodeObjetos({"heredero":this.listTablaHeredero})
    tbQoDevolucion.codeDetalleCredito = this.encodeObjetos(this.objetoCredito)
    tbQoDevolucion.codeDetalleGarantia = this.encodeObjetos(this.joyasList)
    tbQoDevolucion.pesoBruto = this.totalPesoBruto
    tbQoDevolucion.valorAvaluo = this.totalValorAvaluo
    this.devService.registrarDevolucion(tbQoDevolucion, "juan").subscribe((data:any)=>{
      if(data.entidad){
        this.sinNoticeService.setNotice(
          "Guardado correctamente",
          "success"
        );

        console.log(data.entidad.id)
        this.idDevolucion = data.entidad.id
        this.stepper.selectedIndex = 5;
      //  this.router.navigate(['negociacion/bandeja-operaciones'    ]);
      } else {
        this.sinNoticeService.setNotice(
          "Ocurrio un error al guardar",
          "warning"
        );
        ////console.log(rWClient);
      }
      
    })
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



 getJoyas(){
  this.totalResults = this.joyasList.length;
  //console.log( this.joyasList)
  this.dataSourceJoyas = new MatTableDataSource<any>(this.joyasList);
  this.calcular()
  //console.log(this.totalValorAvaluo)
 }


 


calcular(){

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


consultaGeneroCS(){
  this.css.consultarGeneroCS().subscribe((data:any)=>{
    ////console.log("me trajo data de catalogos de GENERO ----->" + JSON.stringify(data))
    if (!data.existeError) {

      //this.listNombreGenero = data.catalogo;
      //console.log(" GENERO -----> " , data )
      this.catalogoGenero=data.catalogo

    } else {
      ////console.log("No me trajo data de catalogos de GENERO ----->" + JSON.stringify(data));
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
    ////console.log("Consulta de catalogos de estado civil ----->" + JSON.stringify(data));
    if (!data.existeError) {
      //this.listNombreEstadoCivil = data.catalogo;
      //console.log(data)
      this.catalagoEstadosCiviles = data.catalogo
      
      
    } else {
      ////console.log("No me trajo data de catalogos de ESTADO CIVIL ----->" + JSON.stringify(data));
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
      //console.log(data)
      this.catalogoPais = data.catalogo
    }
  })
}

consultarLugaresCS(){
  
    this.css.consultarDivicionPoliticaConsolidadaCS().subscribe((data:any)=>{
      if(!data.existeError){
        //console.log(data)
        this.catalogoLugarNacimiento = data.divisionPoliticaConsolidado
      }
    })

}


consultarTipoCliente(){
  this.css.consultarTipoClienteCS().subscribe((data:any)=>{
    if(!data.existeError){
      //console.log(data)
      this.catalogoTipoCliente = data.catalogo
    }
  })
}


consultarAgencia(){
  this.css.consultarAgenciasCS().subscribe((data:any)=>{
    if(!data.existeError){
      //console.log(data)
      this.catalogoAgencia = data.catalogo
    }
  })
}

validateHeredero(event){
  if (this.tipoCliente.value.toUpperCase()==="HEREDERO" ){
    this.enableHeredero.next(true)
    
} else if (this.tipoCliente.value.toUpperCase()==="DEUDOR" ){
  this.enableHeredero.next(false)
  
}
}

agregarEnTabla(){
  if (this.cedulaHeredero.invalid) {
    this.sinNoticeService.setNotice('INGRESE UN NUMERO DE CEDULA VALIDO', 'warning');
    return;
  }  
  if (this.nombreHeredero.invalid) {
    this.sinNoticeService.setNotice('INGRESE NOMBRE DEL HEREDERO', 'warning');
    return;
  } 
  let objetoHeredero = { cedula:"", nombre:""}
  if(this.cedulaHeredero.value && this.nombreHeredero.value){
    objetoHeredero.cedula= this.cedulaHeredero.value  
    objetoHeredero.nombre= this.nombreHeredero.value
    this.listTablaHeredero.push(objetoHeredero)
    this.dataSourceHeredero=new MatTableDataSource<any>(this.listTablaHeredero);
    //console.log(this.listTablaHeredero)
  }else{
    this.sinNoticeService.setNotice("Debe agregar el nombre del heredero", 'error');
  }
 
}
public getErrorMessage(pfield: string) { //@TODO: Revisar campos 
  const errorRequerido = 'Ingresar valores';
  const errorNumero = 'Ingresar solo numeros'; 
  const maximo = "El maximo de caracteres es: ";
  const invalidIdentification = 'La identificacion no es valida';
  const errorLogitudExedida = 'La longitud sobrepasa el limite';
  const errorInsuficiente = 'La longitud es insuficiente';
  if (pfield && pfield === "cedulaHeredero") {
    const input = this.cedulaHeredero.value 
    return input.hasError("required")
      ? errorRequerido
      : input.hasError("pattern")
        ? errorNumero
        : input.hasError("invalid-identification")
          ? invalidIdentification
          : input.hasError("maxlength")
            ? errorLogitudExedida
            : input.hasError("minlength")
              ? errorInsuficiente
              : "";
  }
  if (pfield && pfield === 'nombresCompletos') {
    const input = this.nombresCompletos;
    return input.hasError('required') ? errorRequerido : '';
  }

  if (pfield && pfield === 'nombreHerederos') {
    const input = this.nombreHeredero;
    return input.hasError('required') ? errorRequerido : '';
  }


}



} 