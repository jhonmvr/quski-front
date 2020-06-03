import { ClienteCRM } from './../../../../../core/model/quski/ClienteCRM';
import { TbQoCliente } from './../../../../../core/model/quski/TbQoCliente';
import { ValidateCedula, ValidateCedulaNumber } from '../../../../../core/util/validate.util';
import { SolicitudAutorizacionDialogComponent } from './../../../../partials/custom/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { YearMonthDay } from './../../../../../core/model/quski/YearMonthDay';
import { RelativeDateAdapter } from './../../../../../core/util/relative.dateadapter';
import { VercotizacionComponent } from './vercotizacion/vercotizacion.component';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from './../../../../partials/custom/auth-dialog/auth-dialog.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ParametroService } from './../../../../../core/services/quski/parametro.service';
import { ClienteService } from './../../../../../core/services/quski/cliente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'kt-cliente-negociacion',
  templateUrl: './cliente-negociacion.component.html',
  styleUrls: ['./cliente-negociacion.component.scss']
})

export class ClienteNegociacionComponent implements OnInit {

  public formDatosCliente: FormGroup = new FormGroup({});
  //ENUMS 
  listPublicidad = []; //= Object.keys(PulicidadEnum);
  // ENUMERADORES
  publicidad = new Array();
  public loading;

  // STANDARD VARIABLES
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public tipoIdentificacion = "C";
  
  ///// Instancias 
  clienteCRM: ClienteCRM;
  public idCliente: TbQoCliente;


  ///Validaciones formulario cliente 

  public formCliente: FormGroup = new FormGroup({});
  public fpublicidad = new FormControl( [Validators.required]);
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public fechaNacimiento = new FormControl();
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl();
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public correoElectronico = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl();
  
  public aprobacionMupi = new FormControl('', []);
  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  roomsFilter: any;
 ////CONSTRUCTOR DE LA CLASE 
  constructor(private sinNoticeService: ReNoticeService, 
    private cs: ClienteService, 
    private sp: ParametroService, 
    public dialog: MatDialog, 
    private fb: FormBuilder, 
    private noticeService: ReNoticeService, 
    private subheaderService: SubheaderService,) { 
      this.sp.setParameter();
      this.cs.setParameter();
      this.formCliente.addControl("identificacion", this.identificacion);
      this.formCliente.addControl("fechaNacimiento", this.fechaNacimiento);
      this.formCliente.addControl("nombresCompletos", this.nombresCompletos);
      this.formCliente.addControl("edad", this.edad);
      this.formCliente.addControl("nacionalidad", new FormControl('', Validators.required));
      this.formCliente.addControl("movil", this.movil);
      this.formCliente.addControl("telefonoDomicilio", this.telefonoDomicilio);
      this.formCliente.addControl("correoElectronico", this.correoElectronico);
      this.formCliente.addControl("campania", this.campania);
      this.formCliente.addControl("fpublicidad", this.fpublicidad);

      
  }
  

  ngOnInit() {
    this.getPublicidades();
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Negociación');
  }

///Validaciones de errores
getErrorMessage(pfield: string) {
  const errorRequerido = 'Ingresar valores';
  const errorNumero = 'Ingreso solo numeros';
  let maximo = "El maximo de caracteres es: ";
  const invalidIdentification = 'La identificacion no es valida';
  const errorLogitudExedida = 'La longitud sobrepasa el limite';
  const errorInsuficiente = 'La longitud es insuficiente';
  if (pfield && pfield === "identificacion") {
    const input = this.formCliente.get("identificacion");
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
 
  if (pfield && pfield === 'fechaNacimiento') {
    const input = this.fechaNacimiento;
    return input.hasError('required') ? errorRequerido : '';
  }
  
  if (pfield && pfield === 'nacionalidad') {
    const input = this.nacionalidad;
    return input.hasError('required') ? errorRequerido : '';
  }
  
  if (pfield && pfield === 'telefonoDomicilio') {
    const input = this.formCliente.get('telefonoDomicilio');
    return input.hasError('required')
      ? errorRequerido
      : input.hasError('pattern')
        ? errorNumero
        : input.hasError('maxlength')
          ? errorLogitudExedida
          : input.hasError('minlength')
            ? errorInsuficiente
            : '';
  }
 
  if (pfield && pfield == "correoElectronico") {

    return this.correoElectronico.hasError('required') ? errorRequerido : this.correoElectronico.hasError('email') ? 'E-mail no valido' : this.correoElectronico.hasError('maxlength') ? maximo
      + this.correoElectronico.errors.maxlength.requiredLength : '';

  }
 

  if (pfield && pfield === 'movil') {
    const input = this.movil;
    return input.hasError('required')
      ? errorRequerido
      : input.hasError('pattern')
        ? errorNumero
        : input.hasError('maxlength')
          ? errorLogitudExedida
          : input.hasError('minlength')
            ? errorInsuficiente
            : '';
  }
}

///Validar solo numeros
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}
  

  getPublicidades() {
    this.sp.findByNombreTipoOrdered("", "PUB", "Y").subscribe((wrapper: any) => {
      //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        this.listPublicidad = wrapper.entidades;
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice("Error al cargar parametros de publicidad", 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: "Error " + error.statusText + " - " + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice("Error al cargar publicidades", 'error');
      }
    });
  }

  ///Abre el PopuP para ver las cotizaciones 
  abrirPopupVerCotizacion() {

    console.log("Abre POPUP");
    const dialogRefGuardar = this.dialog.open(VercotizacionComponent, {
      width: '600px',
      height: 'auto',


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
     
      if (respuesta)
      console.log("Estoy aqui ");

    });


  }


  ////Metodo de calculo de la fecha de nacimiento
  onChangeFechaNacimiento() {

    this.loadingSubject.next(true);
    console.log("VALOR DE LA FECHA" + this.fechaNacimiento.value);
    const fechaSeleccionada = new Date(
      this.fechaNacimiento.value
    );
    console.log("FECHA SELECCIONADA" + fechaSeleccionada);
    if (fechaSeleccionada) {
      this.getDiffFechas(fechaSeleccionada, "dd/MM/yyy");
    } else {
      this.sinNoticeService.setNotice(
        "El valor de la fecha es nulo",
        "warning"
      );
      this.loadingSubject.next(false);
    }
  }

/// Consulta de la edad me diante la fecha 
  getDiffFechas(fecha: Date, format: string) {
    this.loadingSubject.next(true);
    const convertFechas = new RelativeDateAdapter();
    this.sp
      .getDiffBetweenDateInicioActual(
        convertFechas.format(fecha, "input"),
        format
      )
      .subscribe(
        (rDiff: any) => {
          const diff: YearMonthDay = rDiff.entidad;
          this.edad.setValue(diff.year);
          console.log("La edad es " + this.edad.value);
          this.loadingSubject.next(false);
          const edad = this.edad.value;
          if (edad != undefined && edad != null && edad < 18) {
            this.edad
              .get("edad")
              .setErrors({ "server-error": "error" });
          }
          this.loadingSubject.next(false);
        },
        error => {
          if (JSON.stringify(error).indexOf("codError") > 0) {
            const b = error.error;
            this.sinNoticeService.setNotice(b.msgError, "error");
          } else {
            this.sinNoticeService.setNotice(
              "Error obtener diferencia de fechas",
              "error"
            );
            console.log(error);
          }
          this.loadingSubject.next(false);
        }
      );
  }
/**
 * Metodo buscar cliente wn primera instancia busca en CloudStudio luego en la Calculadora Quski
 * y  en CRM 
 * Si no existe pide que se suba la autorizacion de equifax.
 */
  buscarCliente() {
    this.loadingSubject.next(true);
    this.cs.findClienteByCedulaQusqui(this.tipoIdentificacion = "C", this.identificacion.value).subscribe((data: any) => {

      this.loadingSubject.next(false);
      if (data.entidad.datoscliente.nombrescompletos) {
        console.log('cliente quski ', data.entidad);
        this.nombresCompletos.setValue(data.entidad.datoscliente.nombrescompletos);
        this.fechaNacimiento.setValue(data.entidad.datoscliente.fechanacimiento);
        this.edad.setValue(data.entidad.datoscliente.edad);
        this.nacionalidad.setValue(data.entidad.datoscliente.nacionalidad);
        this.movil.setValue(data.entidad.datoscliente.telefonomovil);
        this.telefonoDomicilio.setValue(data.entidad.datoscliente.telefonofijo);
        this.fpublicidad.setValue(data.entidad.datoscliente.publicidad);
        this.correoElectronico.setValue(data.entidad.datoscliente.correoelectronico);
        this.campania.setValue(data.entidad.datoscliente.codigocampania);
        this.loadingSubject.next(false);
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE CALCULADORA QUSKI", 'success');
      } else {
        console.log('Estamos aqui');
        console.log('identificacion ', this.identificacion.value);
        this.loadingSubject.next(true);
        this.cs.findClienteByCedulaCRM(this.identificacion.value).subscribe((data: any) => {
          console.log('===>entra aca ');
          console.log('==>cliente CRM ', data.list);
          console.log('==>identificacion ', this.identificacion.value);
          this.loadingSubject.next(false);
          if (data.list) {
            this.loadingSubject.next(false);
            this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE DEL CRM", 'success');
          } else {
            this.sinNoticeService.setNotice("Usuario no registrado ", 'error');
            this.seleccionarEditar();
          }
        },
        );
      }
    },
    );
  }

///Abrir el POPUP de la solicitud de equifax
  seleccionarEditar() {

    console.log(">>>INGRESA AL DIALOGO ><<<<<<");
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: this.identificacion.value


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log("envio de datos ");
      if (respuesta)
      console.log("aqui");

    });



  }
  public cadena="";
  public cadena1;
  ////Registro del prospecto en el CRM////
  registrarProspecto(){
   
    if(this.identificacion.value!=""&&this.nombresCompletos.value!=""&&this.correoElectronico.value!=""){
   
    this.clienteCRM=new ClienteCRM();
    this.clienteCRM.firstName=this.nombresCompletos.value;
    this.clienteCRM.phoneHome=this.telefonoDomicilio.value;
    this.clienteCRM.phoneMobile=this.movil.value;
    this.clienteCRM.cedulaC=this.identificacion.value;
    this.clienteCRM.emailAddress=this.correoElectronico.value;
    this.cadena =this.correoElectronico.value;
    this.cadena1 = this.cadena.toUpperCase();
    this.clienteCRM.emailAddressCaps=this.cadena1;
    this.sinNoticeService.setNotice("REGISTRO CORRECTO DEL PROSPECTO", 'success');
    this.cs.guardarProspectoCRM(this.clienteCRM).subscribe((data: any) => {
    console.log("datos de envio: " + JSON.stringify(this.clienteCRM));
  }, error => {
    console.log("error al guardar el cliente en el CRM: " + error);
    console.log("------------manageurl errorsss : " + JSON.stringify(error));
    this.sinNoticeService.setNotice("NO SE PUEDE GUARDAR", 'error');
    //  this.loadingSubject.next(false);
  });
}  
  else{
    this.sinNoticeService.setNotice("DEBE COMPLETAR LA INFORMACION ", 'error');
  }

  }


}
