import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup, PatternValidator, FormBuilder } from '@angular/forms';
import { Page } from '../../../../../core/model/page';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { TituloContratoService } from '../../../../../core/services/quski/titulo.contrato.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { merge, tap } from 'rxjs/operators';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { TbQoVariableCrediticia } from '../../../../../core/model/quski/TbQoVariableCrediticia';
import { PulicidadEnum } from '../../../../../core/enum/PublicidadEnum';
import { TipoOroEnum } from '../../../../../core/enum/TipoOroEnum';
import { GradoInteresEnum } from '../../../../../core/enum/GradoInteresEnum';
import { MotivoDesestimientoEnum } from '../../../../../core/enum/MotivoDesestimientoEnum';

import { DialogSolicitudDeAutorizacionComponent } from './dialog-solicitud-de-autorizacion/dialog-solicitud-de-autorizacion.component';
import { SolicitudAutorizacionDialogComponent } from '../../../../../../app/views/partials/custom/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ValidateCedula, ValidateCedulaNumber } from '../../../../../core/util/validate.util';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { constructor } from 'lodash';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { TbCotizacion } from '../../../../../core/model/quski/TbCotizacion';
import { User } from '../../cliente/gestion-cliente/gestion-cliente.component';





@Component({
  selector: 'kt-list-cotizar',
  templateUrl: './list-cotizar.component.html',
  styleUrls: ['./list-cotizar.component.scss']
})
export class ListCotizarComponent implements OnInit {
  //STANDARD VARIABLES
  public loading;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public lCreate;
  public fechaSeleccionada: any;
  public cliente = new TbQoCliente();
  date;
  // STREPPER
  isLinear = true;
  //ENUMS 
  listPublicidad = Object.keys(PulicidadEnum); 
  
  public formCliente: FormGroup = new FormGroup({});
  public fpublicidad = new FormControl('', []);
  public cedula = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public fechaNacimiento = new FormControl('', [Validators.required]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);

  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', [Validators.required]);

  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public correoElectronico = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public primerNombre = '';
  public segundoNombre = '';
  public primerApellido = '';
  public segundoApellido = '';

  gradoIntere = new FormControl('', []);
  aprobadoWebMupi = new FormControl('', []);
  apellidoCliente = new FormControl('', []);
  //OPCIONES PRECIO ORO
  precio = new FormControl('', []);
  precioEstimado = new FormControl('', []);
  pesoNetoEstimado = new FormControl('', []);

  //OPCIONES DE CREDITO
  plazo = new FormControl('', []);
  montoPreAprobado = new FormControl('', []);
  aRecibir = new FormControl('', []);
  totalCostosOperacion = new FormControl('', []);
  totalCostosNuevaOperacion = new FormControl('', []);
  costoCustodia = new FormControl('', []);
  costoTransporte = new FormControl('', []);
  costoCredito = new FormControl('', []);
  costoSeguro = new FormControl('', []);
  costoResguardo = new FormControl('', []);
  costoEstimado = new FormControl('', []);
  valorCuota = new FormControl('', []);


  displayedColumnsVarCredi = ['orden', 'variable', 'valor'];
  displayedColumnsPrecioOro = ['accion', 'tipoOro', 'precio', 'pesoNetoEstimado'];
  displayedColumnsCreditoNegociacion = ['plazo', 'montoPreAprobado', 'aRecibir', 'totalCostosOperacion', 'costoCustodia', 'costoTransporte', 'costoCredito', 'costoSeguro', 'costoResguardo', 'costoEstimado', 'valorCuota'];
  /**Obligatorio paginacion */
  p = new Page();

  //DATASOURCE
  dataSourceVarCredi: MatTableDataSource<TbQoVariableCrediticia> = new MatTableDataSource<TbQoVariableCrediticia>();
  dataSourcePrecioOro: MatTableDataSource<TbQoPrecioOro> = new MatTableDataSource<TbQoPrecioOro>();
  dataSourceCredito: MatTableDataSource<TbQoCreditoNegociacion> = new MatTableDataSource<TbQoCreditoNegociacion>();
  dataSourceCliente: MatTableDataSource<TbQoCliente> = new MatTableDataSource<TbQoCliente>();
  // ENUMERADORES
  publicidad = new Array();
  tipoOro = new Array();
  gradoInteres = new Array();
  motivoDesestimiento = new Array();



  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  roomsFilter: any;



  constructor(public titulo: TituloContratoService,
    private clienteService: ClienteService,
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private noticeService: ReNoticeService,
    private sp: ParametroService,
    private cs: CotizacionService,
    public dialog: MatDialog, private fb:FormBuilder) { 
    this.clienteService.setParameter();
    this.sp.setParameter();//siempre que usan un servicio deben usar set parametert
    //FORM CLIENTE
    this.formCliente.addControl("cedula", this.cedula);
    this.formCliente.addControl("fechaNacimiento", this.fechaNacimiento);
    this.formCliente.addControl("nombresCompletos", this.nombresCompletos);
    this.formCliente.addControl("edad", this.edad);
    this.formCliente.addControl("nacionalidad", new FormControl('', Validators.required  ) );
    this.formCliente.addControl("movil", this.movil);
    this.formCliente.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formCliente.addControl("correoElectronico", this.correoElectronico);
    this.formCliente.addControl("campania", this.campania);
    this.formCliente.addControl("fpublicidad", this.fpublicidad);
    this.fb.group( this.formCliente );

  }

  ngOnInit() {

    this.date = new Date();

    //agrego los enums de tipoOro
    this.tipoOro.push(TipoOroEnum[TipoOroEnum.QUILATE14]);
    this.tipoOro.push(TipoOroEnum[TipoOroEnum.QUILATE18]);
    //agrego los enums de gradoInteres
    this.gradoInteres.push(GradoInteresEnum[GradoInteresEnum.MUY_INTERESADO]);
    this.gradoInteres.push(GradoInteresEnum[GradoInteresEnum.INTERESADO]);
    this.gradoInteres.push(GradoInteresEnum[GradoInteresEnum.LO_VA_A_PENSAR]);
    this.gradoInteres.push(GradoInteresEnum[GradoInteresEnum.NO_LE_INTERESA]);
    //agrego los motivos de Desestimiento
    this.motivoDesestimiento.push(MotivoDesestimientoEnum[MotivoDesestimientoEnum.MUY_CARO]);
    this.motivoDesestimiento.push(MotivoDesestimientoEnum[MotivoDesestimientoEnum.NO_LE_DAN_EL_MONTO_QUE_NECESITA]);
    this.motivoDesestimiento.push(MotivoDesestimientoEnum[MotivoDesestimientoEnum.NO_LE_GUSTO_EL_PRODUCTO]);
    this.motivoDesestimiento.push(MotivoDesestimientoEnum[MotivoDesestimientoEnum.NO_LE_GUSTO_LA_ATENCION]);

    //this.titulo.setNotice("GESTION DE CLIENTES")
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Cotización');
    this.initiateTablePaginator();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      console.log("sort changed ");
      this.initiateTablePaginator();
      this.buscar()
    });

  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }


  getPublicidades( ){
    this.sp.findByNombreTipoOrdered(null,"PUB","Y").subscribe( wrapper:Parametro=>{

    } );
  }

  /**
   * Obligatorio Paginacion: Limpia paginacion previa y genera nueva
   */
  initiateTablePaginator(): void {
    this.dataSourceVarCredi = new MatTableDataSource();
    this.dataSourcePrecioOro = new MatTableDataSource();
    this.dataSourceCredito = new MatTableDataSource();
    this.dataSourceCliente = new MatTableDataSource();

    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
    this.totalResults = 0;
    this.dataSourceVarCredi.paginator = this.paginator;
    this.dataSourcePrecioOro.paginator = this.paginator;
    this.dataSourceCredito.paginator = this.paginator;
  }

  /**
  * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
  */
  getPaginacion(ordenarPor: string, tipoOrden: string, paginado: string, pagina): Page {
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
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', this.paginator.pageIndex)
    this.submit();
  }


  /**
  * Obligatorio Paginacion: Obtiene el objeto paginacion a utilizar
  */
  buscar() {
    this.initiateTablePaginator();
    this.p = this.getPaginacion(this.sort.active, this.sort.direction, 'Y', 0);
    //this.submit();
  }

  dividirCadena() {
    const nombreCambiado = this.nombresCompletos.value;
    const cedula = this.cedula.value;
    //const fechaNacimientoS=this.fechaSeleccionada.value;
    console.log("NOMBRE CAMBISDO" + nombreCambiado);
    console.log("CEDULA" + cedula);
    console.log("FECHA DE NACIMINETO" + this.fechaNacimiento.value);
    console.log("NACIONALIDAD" + this.nacionalidad.value);
    console.log("MOVIL" + this.movil.value);
    //console.log("TELEFONO DOMICILIO"+this.telefonoDomicilio.value);
    console.log("PUBLICIDAD" + this.fpublicidad.value);
    console.log("CORREO ELECTRONICO" + this.correoElectronico.value);
    console.log("Campania" + this.campania.value);

    const fragmentoTexto = nombreCambiado.split(' ');
    console.log("el valor de nombre " + fragmentoTexto);
    for (var index = 1; index <= fragmentoTexto.length; index++){
      switch (index) {
        case 0:
          this.primerNombre = fragmentoTexto[index];
          console.log("VALOR DEL PRIMER NOMBRE" + this.primerNombre);
        case 1:
          this.segundoNombre = fragmentoTexto[index];
          console.log("VALOR DEL SEGUNDO NOMBRE" + this.segundoNombre);
        case 2:
          this.primerApellido = fragmentoTexto[index];
          console.log("VALOR DEL PRIMER APELLIDO " + this.primerApellido);
        case 3:
          this.segundoApellido = fragmentoTexto[index];
          console.log("VALOR DEL SEGUNDO APELLIDO " + this.segundoApellido);
          break;

        default:
          break;
      }
    }
    

    this.cliente.cedulaCliente = this.cedula.value;
    this.cliente.primerNombre=this.nombresCompletos.value;
    this.cliente.fechaNacimiento = this.fechaNacimiento.value;
    this.cliente.edad=this.edad.value;
    this.cliente.nacionalidad=this.nacionalidad.value;

    this.cliente.publicidad = this.fpublicidad.value;
    this.cliente.email = this.correoElectronico.value;
    this.cliente.campania = this.campania.value;
    
    //return cadenaDividida;
  }

  _keyUp(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }


  submit() {
    if (this.formCliente.valid) {
      // this.cedula.value;


    }
    this.loadingSubject.next(true);
    this.dataSourceCliente = null;

    this.cs.findByIdCliente(this.cedula.value).subscribe((data: any) => {
      this.loadingSubject.next(false);
      if (data.list) {
        this.totalResults = data.totalResults;
        //this.dataSource.data = new MatTableDataSource<TbCotizacion>(data.list);
        //console.log("data>>>>>>>>>>>>>>>>>" + JSON.stringify( this.dataSource));
        console.log("data cotizacion ", data.list);
      } else {
        this.sinNoticeService.setNotice("NO SE ENCONTRAR REGISTROS", 'info');
      }
    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("ERROR AL CARGAR", 'error');
      }
    }
    );
  }
  limpiarCampos() {
    Object.keys(this.formCliente.controls).forEach((name) => {
      //console.log( "==limpiando " + name )
      let control = this.formCliente.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });

  }


  //Mensages
  getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorEmail = 'Correo Incorrecto';
    const errorNumero = 'Ingreso solo numeros';
    let maximo = "El maximo de caracteres es: ";
    const errorFormatoIngreso = 'Use el formato : 0.00';
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    let errorrequiredo = "Ingresar valores";

    if (pfield && pfield === "cedula") {
      const input = this.formCliente.get("cedula");
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


    //Validaciones de datos personales
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




    /*if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formCliente.get('telefonoDomicilio');
      console.log("telefonoDocimicilio",this.formCliente.get('telefonoDomicilio'))
      return input.hasError('required')
        ? errorRequerido
        : input.hasError('pattern')
          ? errorNumero
          : input.hasError('maxlength')
            ? errorLogitudExedida
            : input.hasError('minlength')
              ? errorInsuficiente
              : '';
    }*/

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

  blurIdentificacion(value: number) {
    const input = this.formCliente.get("identificacion");
    const celudaValida = ValidateCedulaNumber(input.value);
    if (celudaValida && celudaValida["cedulaIncorecta"] === true) {
      input.setErrors({ "invalid-identification": true });
    }
  }


  setPrecioOro() {

  }



  editarUsuario() {
    [{
      path: 'add/:id',

    }]

  }

  seleccionarEditar() {
    console.log(">>>INGRESA AL DIALOGO ><<<<<<");
    const dialogRefGuardar = this.dialog.open(SolicitudAutorizacionDialogComponent, {
      width: '600px',
      height: 'auto',
      data: this.cedula.value


    });

    dialogRefGuardar.afterClosed().subscribe((respuesta: any) => {
      console.log("envio de datos ");
      if (respuesta)
        this.submit();

    });



  }


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

  getDiffFechas(fecha: Date, format: string) {
    this.loadingSubject.next(true);
    const convertFechas = new RelativeDateAdapter();
    this.svcParametros
      .getDiffBetweenDateInicioActual(
        convertFechas.format(fecha, "input"),
        format
      )
      .subscribe(
        (rDiff: any) => {
          const diff: YearMonthDay = rDiff.entidad;
          this.edad.setValue(diff.year);
          console.log("La edad es " + this.edad.value);

          //this.edad.get("edad").setValue(diff.year);
          //Validacion para que la edad sea mayor a 18 años
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







}
