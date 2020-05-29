import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { ReNoticeService } from './../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from './../../../../partials/custom/auth-dialog/auth-dialog.component';
import { MatDialog } from '@angular/material';
import { ParametroService } from './../../../../../core/services/quski/parametro.service';
import { ClienteService } from './../../../../../core/services/quski/cliente.service';
import { OroService } from './../../../../../core/services/quski/oro.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-cliente-negociacion',
  templateUrl: './cliente-negociacion.component.html',
  styleUrls: ['./cliente-negociacion.component.scss']
})

export class ClienteNegociacionComponent implements OnInit {

  public formDatosCliente: FormGroup = new FormGroup({});
  constructor(private sinNoticeService: ReNoticeService,SubheaderService:SubheaderService, private cs:ClienteService,  private sp: ParametroService, public dialog: MatDialog, private fb:FormBuilder,private noticeService:ReNoticeService, private subheaderService: SubheaderService) { }
  //ENUMS 
  listPublicidad=[]; //= Object.keys(PulicidadEnum);
  // ENUMERADORES
  publicidad = new Array();
  public loading;

  ngOnInit() {
    this.getPublicidades();
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Negociación');
  }


  getErrorMessage(pfield: string) {
    const errorRequerido = "Ingresar valores";
    const errorEmail = "Correo Incorrecto";
    const errorNumero = "Ingreso solo numeros";
    const errorFormatoIngreso = "Use el formato : 0.00";
    const invalidIdentification = "La identificacion no es valida";
    const errorLogitudExedida = "La longitud sobrepasa el limite";
    const errorInsuficiente = "La longitud es insuficiente";
    const errorEdad = "Debe ser mayor de edad";


    if (pfield && pfield === "identificacion") {
      const input = this.formDatosCliente.get("identificacion");
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

    if (pfield && pfield === "telefonoFijo") {
      const input = this.formDatosCliente.get("telefonoFijo");
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("maxlength")
            ? errorLogitudExedida
            : input.hasError("minlength")
              ? errorInsuficiente
              : "";
    }

    if (pfield && pfield === "email") {
      const input = this.formDatosCliente.get("email");
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("email")
          ? errorEmail
          : input.hasError("maxlength")
            ? errorLogitudExedida
            : "";
    }

    if (pfield && pfield === "telefonoCelular") {
      const input = this.formDatosCliente.get("telefonoCelular");
      return input.hasError("required")
        ? errorRequerido
        : input.hasError("pattern")
          ? errorNumero
          : input.hasError("maxlength")
            ? errorLogitudExedida
            : input.hasError("minlength")
              ? errorInsuficiente
              : "";
    }
    if (pfield && pfield === "publicidad") {
      const input = this.formDatosCliente.get("publicidad");
      return input.hasError("required")
    }
    return "";
  }
   // STANDARD VARIABLES
   public loadingSubject = new BehaviorSubject<boolean>(false);
   

  ///Validaciones formulario cliente 
  
 
  public identificacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public nombresCompletos = new FormControl('', [Validators.required]);
  public fechaNacimiento = new FormControl('', [Validators.required]);
  public edad = new FormControl('', [Validators.required]);
  public nacionalidad = new FormControl('', [Validators.required]);
  public movil = new FormControl('', [Validators.required]);
  public telefonoDomicilio = new FormControl('', [Validators.required]);
  public fpublicidad = new FormControl('', [Validators.required]);
  public correoElectronico = new FormControl('', [Validators.required]);
  public campania = new FormControl('', [Validators.required]);
  public tipoIdentificacion="C" ;

  getPublicidades( ){
    this.sp.findByNombreTipoOrdered("","PUB","Y").subscribe( (wrapper:any)=>{
      //console.log("retornos "+ JSON.stringify(wrapper)  );
        if( wrapper && wrapper.entidades ){
          this.listPublicidad=wrapper.entidades;
        }
    },error => {
      if(  error.error ){
        if( error.error.codError ){
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
        } else {
          this.sinNoticeService.setNotice("Error al cargar parametros de publicidad"  , 'error');
        }
			} else if(  error.statusText && error.status==401 ){
				this.dialog.open(AuthDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
			} else {
				this.sinNoticeService.setNotice("Error al cargar publicidades", 'error');
			}
    } );
  }

  buscarCliente() {
    this.loadingSubject.next(true);
    this.cs.findClienteByCedulaQusqui(this.tipoIdentificacion = "C" ,this.identificacion.value).subscribe((data: any) => {
      console.log('identificacion ', this.identificacion.value);
      console.log('identificacion ', this.tipoIdentificacion);
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
        this.loadingSubject.next(true);
        this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
      } else {
        this.sinNoticeService.setNotice("Usuario no registrado en la calculadora Quski", 'error');
      }
    }, error => {
      this.loadingSubject.next(false);
      this.loadingSubject.next(false);
      if(  error.error ){
				this.noticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
			} else if(  error.statusText && error.status==401 ){
				this.dialog.open(AuthDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
			} else {
				this.noticeService.setNotice("Error al cargar el cliente", 'error');
			}
    }
    );
  }

}
