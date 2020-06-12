import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CreditoNegociacionService } from '../../../../core/services/quski/credito.negociacion.service';
import { TbQoCreditoNegociacion } from '../../../../core/model/quski/TbQoCreditoNegociacion';
import { TbQoCliente } from '../../../../core/model/quski/TbQoCliente';
import { diferenciaEnDias } from '../../../../core/util/diferenciaEnDias';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Page } from '../../../../core/model/page';






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

  ///
  idCreditoNegociacion=96;
  tbCreditoNegociacion:TbQoCreditoNegociacion;
  edadCodeudor
  tbQoCliente;
  fechaServer;
  tiposCuentas = ['Cuenta de Ahorros', 'Cuenta Corriente']
  tiposClientes = ['Deudor', 'Codeudor', 'Apoderado']

  //observables
  enableDiaPagoButton;
  enableDiaPago = new BehaviorSubject<boolean>(false);
  enableCodeudorButton;
  enableCodeudor = new BehaviorSubject<boolean>(false);
  enableApoderadoButton;
  enableApoderado = new BehaviorSubject<boolean>(false);

  //TABLA
  displayedColumns = ['numeroPiezas', 'tipoOro',  'tipoJoya', 'estadoJoya', 'descripcion', 'pesoBruto',
  'tieneDescuento', 'descripcionDescuentos', 'descuentoPesoPiedra',  'descuentoSuelda',
   'pesoNeto', 'valorOro', 'valorAvaluo', 'valorComercial', 'valorRealizacion'];
 /**Obligatorio paginacion */
 p = new Page();
 //dataSource:MatTableDataSource<TbMiCliente>=new MatTableDataSource<TbMiCliente>();
 @ViewChild(MatPaginator, { static: true }) 
 paginator: MatPaginator;
 totalResults: number;
 pageSize = 5;
 currentPage;

 /**Obligatorio ordenamiento */
 @ViewChild('sort1', {static: true}) sort: MatSort;

  constructor(private cns: CreditoNegociacionService, private sinNoticeService: ReNoticeService,) { 
    
    
  }

  ngOnInit() {
    this.setFechaSistema();
    this.enableDiaPagoButton = this.enableDiaPago.asObservable();
    this.enableDiaPago.next(false);
    this.enableCodeudorButton = this.enableCodeudor.asObservable();
    this.enableCodeudor.next(false);
    this.enableApoderadoButton = this.enableApoderado.asObservable();
    this.enableApoderado.next(false);
    this.cargarDatosOperacion()
    
  }

  cargarDatosOperacion(){
   this.cns.getCreditoNegociacionById(this.idCreditoNegociacion).subscribe((data:any)=>{
      if(data.entidad){
        this.tbCreditoNegociacion = data.entidad
        this.tbQoCliente = this.tbCreditoNegociacion.tbQoNegociacion.tbQoCliente
        console.log(this.tbQoCliente)
        console.log(this.tbCreditoNegociacion)
        this.codigoOperacion.setValue(data.entidad.codigoOperacion)
        this.cedulaCliente.setValue(data.entidad.tbQoNegociacion.tbQoCliente.cedulaCliente)
        this.nombresCompletos.setValue(data.entidad.tbQoNegociacion.tbQoCliente.apellidoPaterno.concat(" ",
         data.entidad.tbQoNegociacion.tbQoCliente.apellidoMaterno == null ? "" : data.entidad.tbQoNegociacion.tbQoCliente.apellidoMaterno, 
          " ", data.entidad.tbQoNegociacion.tbQoCliente.primerNombre
         ," ", data.entidad.tbQoNegociacion.tbQoCliente.segundoApellido== null ? "" : data.entidad.tbQoNegociacion.tbQoCliente.segundoApellido))
         this.situacion.setValue("APROBACIÓN Y AUTORIZACION DESEMBOLSO")
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
  
 validateTipoCliente(valueTipoCliente){
   let edadCliente = this.getEdad(this.tbQoCliente.fechaNacimiento)
   console.log(edadCliente)
   console.log("=====> Execute Order 66", valueTipoCliente)
   console.log("====> Hello there", this.tbQoCliente.edad )
   if(valueTipoCliente.toUpperCase() === "DEUDOR"){
    
    this.enableCodeudor.next(true);
    this.enableApoderado.next(false)
   } else if (valueTipoCliente.toUpperCase()==="APODERADO" ){
    if(edadCliente<=65){
      this.enableApoderado.next(true)
      this.enableCodeudor.next(false);
      
    }else{
      this.sinNoticeService.setNotice( "El CODEUDOR DEBE SER MENOR DE 65 AÑOS" , 'error');
    }

   }else{
    if(edadCliente<=65){
      this.enableCodeudor.next(false);
      this.enableApoderado.next(false);

    }else{
      this.sinNoticeService.setNotice( "El CODEUDOR DEBE SER MENOR DE 65 AÑOS" , 'error');
      this.enableCodeudor.next(false);
      this.enableApoderado.next(false);
    }
  
   }
 }
 generarCreditos(){

 }

 getMontoSugerido(){

 }
}
