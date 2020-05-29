import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Page } from '../../../../../core/model/page';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { TituloContratoService } from '../../../../../core/services/quski/titulo.contrato.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { SubheaderService } from '../../../../../core/_base/layout';
import { TbQoPrecioOro } from '../../../../../core/model/quski/TbQoPrecioOro';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';
import { TbQoVariableCrediticia } from '../../../../../core/model/quski/TbQoVariableCrediticia';
import { TipoOroEnum } from '../../../../../core/enum/TipoOroEnum';
import { GradoInteresEnum } from '../../../../../core/enum/GradoInteresEnum';
import { MotivoDesestimientoEnum } from '../../../../../core/enum/MotivoDesestimientoEnum';
import { TbCotizacion } from '../../../../../core/model/quski/TbCotizacion';
import { SolicitudAutorizacionDialogComponent } from '../../../../../../app/views/partials/custom/solicitud-autorizacion-dialog/solicitud-autorizacion-dialog.component';
import { ValidateCedula, ValidateCedulaNumber } from '../../../../../core/util/validate.util';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { CotizacionService } from '../../../../../core/services/quski/cotizacion.service';
import { User } from '../../cliente/gestion-cliente/gestion-cliente.component';
import { AuthDialogComponent } from '../../../../../views/partials/custom/auth-dialog/auth-dialog.component';
import { EstadoQuskiEnum } from '../../../../../core/enum/EstadoQuskiEnum';
import { TbMiCotizacion } from '../../../../../core/model/quski/TbMiCotizacion';
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
  public clienteAntiguo = new TbQoCliente();
  public cotizacion = new TbCotizacion();
  public listCotizaciones = [];
  date;
  // STREPPER
  isLinear = true;
  //ENUMS 
  listPublicidad = []; //= Object.keys(PulicidadEnum); 
  listGradosInteres = [];
  listMotivoDesestimiento = [];
  listEstado = Object.keys(EstadoQuskiEnum);
  //FORM CLIENTE
  public formCliente: FormGroup = new FormGroup({});
  public fpublicidad = new FormControl('', [Validators.required]);
  public identificacion = new FormControl('', [Validators.required, ValidateCedula, Validators.minLength(10), Validators.maxLength(10)]);
  public fechaNacimiento = new FormControl('', [Validators.required]);
  public nombresCompletos = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  public edad = new FormControl('', []);
  public nacionalidad = new FormControl('', [Validators.required]);
  public movil = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  public telefonoDomicilio = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  public correoElectronico = new FormControl('', [Validators.required, Validators.email]);
  public campania = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  //OPCIONES DE CREDITO
  public fgradoInteres = new FormControl('', [Validators.required]);
  public fmotivoDesestimiento = new FormControl('', [Validators.required]);

  public primerNombre = '';
  public segundoNombre = '';
  public primerApellido = '';
  public segundoApellido = '';

  //CALCULADORA VARIABLES
  public tipoIdentificacion = "C";

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
  dataSourceCotizacion: MatTableDataSource<TbCotizacion> = new MatTableDataSource<TbCotizacion>();

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  totalResults: number;
  pageSize = 5;
  currentPage;

  /**Obligatorio ordenamiento */
  @ViewChild('sort1', { static: true }) sort: MatSort;
  roomsFilter: any;


  /**
   * Constructor de la clase 
   * @param titulo 
   * @param clienteService 
   * @param sinNoticeService 
   * @param subheaderService 
   * @param sp 
   * @param cs 
   * @param dialog 
   * @param fb 
   */
  constructor(public titulo: TituloContratoService,
    private clienteService: ClienteService,
    private sinNoticeService: ReNoticeService,
    private subheaderService: SubheaderService,
    private sp: ParametroService,
    private cs: CotizacionService,
    public dialog: MatDialog, private fb: FormBuilder) {
    this.clienteService.setParameter();
    this.sp.setParameter();//siempre que usan un servicio deben usar set parametert
    //FORM CLIENTE
    this.formCliente.addControl("cedula", this.identificacion);
    this.formCliente.addControl("fechaNacimiento", this.fechaNacimiento);
    this.formCliente.addControl("nombresCompletos", this.nombresCompletos);
    this.formCliente.addControl("edad", this.edad);
    this.formCliente.addControl("nacionalidad", new FormControl('', Validators.required));
    this.formCliente.addControl("movil", this.movil);
    this.formCliente.addControl("telefonoDomicilio", this.telefonoDomicilio);
    this.formCliente.addControl("correoElectronico", this.correoElectronico);
    this.formCliente.addControl("campania", this.campania);
    this.formCliente.addControl("fpublicidad", this.fpublicidad);
    this.fb.group(this.formCliente);
    this.getPublicidades();
    this.getGradoInteres();
    this.getMotivoDesestimiento();
    this.sinNoticeService.setNotice(null);
  }
  /**
   * CARGA DESPUES DEL CONSTRUCTOR
   */
  ngOnInit() {
    this.date = new Date();
    this.titulo.setNotice("GESTION DE COTIZACION")
    this.loading = this.loadingSubject.asObservable();
    // Set title to page breadCrumbs
    this.subheaderService.setTitle('Cotización');
    this.initiateTablePaginator();
    //Se ejecuta cuando se hace click en el ordenamiento en el mattable
    this.sort.sortChange.subscribe(() => {
      console.log("sort changed ");
      this.initiateTablePaginator();
      //ABRE EL POPUP
      this.buscar()
    });

  }
  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }
  /**
   * Metodo que trae los motivos de desestimiento de la base de datos tabla parametros
   */
  getMotivoDesestimiento() {
    this.sp.findByNombreTipoOrdered("", "DESEST", "Y").subscribe((wrapper: any) => {
      //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        this.listMotivoDesestimiento = wrapper.entidades;
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
  /**
  * Metodo que trae los grados de interes de la base de datos tabla parametros
  */
  getGradoInteres() {
    this.sp.findByNombreTipoOrdered("", "GINT", "Y").subscribe((wrapper: any) => {
      //console.log("retornos "+ JSON.stringify(wrapper)  );
      if (wrapper && wrapper.entidades) {
        this.listGradosInteres = wrapper.entidades;
      }
    }, error => {
      if (error.error) {
        if (error.error.codError) {
          this.sinNoticeService.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice("Error al cargar grado de interes", 'error');
        }
      } else if (error.statusText && error.status == 401) {
        this.dialog.open(AuthDialogComponent, {
          data: {
            mensaje: "Error " + error.statusText + " - " + error.message
          }
        });
      } else {
        this.sinNoticeService.setNotice("Error al cargar grado de interes", 'error');
      }
    });
  }
  /**
    * Metodo que trae los tipos de publicidad de la base de datos tabla parametros
    */
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
  /**
   * Metodo que toma el valor del combo publicidad
   * @param event 
   */
  cambioSeleccion(event) {
    console.log("evento " + JSON.stringify(event.value));
    console.log("evento " + JSON.stringify(this.fpublicidad.value));
  }
  /**
   * Metodo que toma el valor del combo Grado de interes
   * @param event 
   */
  cambioSeleccionGradoInteres(event) {
    console.log("evento " + JSON.stringify(event.value));
    console.log("evento " + JSON.stringify(this.fgradoInteres.value));
  }
  /**
   * Metodo que toma el valor del combo Motivo Desestimiento
   * @param event 
   */
  cambioSeleccionMotivoDesestimiento(event) {
    console.log("evento " + JSON.stringify(event.value));
    console.log("evento " + JSON.stringify(this.fmotivoDesestimiento.value));
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
  /**
   * Metodo que realiza la accion del boton Guardar 
   */
  submit() {
    this.loadingSubject.next(true);

    const nombreCambiado = this.nombresCompletos.value;
    const cedula = this.identificacion.value;
    /**
     * Valores que tomo de la vista
     */
    console.log("NOMBRE CAMBISDO" + nombreCambiado);
    console.log("CEDULA" + cedula);
    console.log("FECHA DE NACIMINETO" + this.fechaNacimiento.value);
    console.log("NACIONALIDAD" + this.nacionalidad.value);
    console.log("MOVIL" + this.movil.value);
    console.log("PUBLICIDAD" + this.fpublicidad.value.valor);
    console.log("CORREO ELECTRONICO" + this.correoElectronico.value);
    console.log("Campania" + this.campania.value);
    /**
     * Separacion del nombre ya que viene el nombre completo
     */
    const fragmentoTexto = nombreCambiado.split(' ');
    console.log("el valor de nombre " + fragmentoTexto);
    this.primerNombre = fragmentoTexto[0];
    console.log("VALOR DEL PRIMER NOMBRE" + this.primerNombre);
    this.segundoNombre = fragmentoTexto[1];
    console.log("VALOR DEL SEGUNDO NOMBRE" + this.segundoNombre);
    this.primerApellido = fragmentoTexto[2];
    console.log("VALOR DEL PRIMER APELLIDO " + this.primerApellido);
    this.segundoApellido = fragmentoTexto[3];
    console.log("VALOR DEL SEGUNDO APELLIDO " + this.segundoApellido);
    /**
     * Seteo los valores de la vista DATOS CLIENTE en el objeto cliente 
     */
    this.cliente.cedulaCliente = this.identificacion.value;
    this.cliente.primerNombre = this.nombresCompletos.value;
    this.cliente.fechaNacimiento = this.fechaNacimiento.value;
    this.cliente.edad = this.edad.value;
    this.cliente.nacionalidad = this.nacionalidad.value;
    this.cliente.publicidad = this.fpublicidad.value.valor;
    this.cliente.email = this.correoElectronico.value;
    this.cliente.campania = this.campania.value;
    this.cliente.telefonoFijo = this.telefonoDomicilio.value;
    this.cliente.telefonoMovil = this.movil.value;
    this.cliente.estado = EstadoQuskiEnum.ACT;


    console.log("DATOS DE CLIENTE" + JSON.stringify(this.cliente));

    //TODO:cloudstudio calculadora crm  HAY QUE IMPLEMENTAR LOS OTROS SE CARGA AUTOMATICAMENTE LAS VARIABLES INTERNAS AGREGA JOYAS Y SE JA
    this.clienteService.findClienteByIdentificacion(this.cliente.cedulaCliente).subscribe((data: any) => {
      console.log("DATOS DE CLIENTE PREVIAMENTE REGISTRADO " + JSON.stringify(this.cliente));
      this.clienteAntiguo = data.entidad;

      this.cotizacion.estado = EstadoQuskiEnum.INA;
      this.cotizacionGuardar();

      this.sinNoticeService.setNotice("ACTUALIZACION CLIENTE EXITOSO", 'success');

    }, error => {
      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("ERROR AL REGISTRAR EL CLIENTE", 'error');
      }
    });


    /**
     * INICIA EL GUARDADO EN LA BASE DEL CLIENTE
     */
    if (this.cliente.cedulaCliente == this.clienteAntiguo.cedulaCliente) {
      console.log("INICIA EL SUBMIT*****");
      console.log("DATOS DE CLIENTE EN EL SUBMIT" + JSON.stringify(this.cliente));
      this.cliente.id = this.clienteAntiguo.id;
      this.clienteService.guardarCliente(this.cliente).subscribe((data: any) => {
        this.sinNoticeService.setNotice("REGISTRO EXITOSO", 'success');
        console.log("El valor de CLIENTE DEVUELTO ES " + JSON.stringify(data.entidad));
        /**
         * SETEO LOS VALORES ADICIONALES AL OBJETO 
         */
        this.cotizacion.estado = EstadoQuskiEnum.ACT;
        this.cotizacion.motivoDesestimiento = this.fmotivoDesestimiento.value.valor;
        this.cotizacion.gradoInteres = this.fgradoInteres.value.valor;
        this.cotizacion.tbQoCliente = data.entidad;
        console.log("DATOS DE COTIZACION EN EL SUBMIT" + JSON.stringify(this.cotizacion));
        this.cotizacionGuardar();

      }, error => {
        this.loadingSubject.next(false);
        if (JSON.stringify(error).indexOf("codError") > 0) {
          let b = error.error;
          this.sinNoticeService.setNotice(b.msgError, 'error');
        } else {
          this.sinNoticeService.setNotice("ERROR AL REGISTRAR EL CLIENTE", 'error');
        }
      });

    } else {




    }
    //return submit
  }
  //TODO: HACER LA VALIDACION DE CLIENTE PARA QUE INGRESE UNO SOLO actualizar busco el objeto actualizo el estado a ACT YLO QUE ENCUENTRE ACTUALIZA A ESTADO CANCELADO

  //TODO: 1 PROBAR QUE EL REST FUNCIONE COTIZADOR BYCLIENTE  
  //TODO: 2 CREAR EL METODO BUSCAR COTIZADOR CON ESE SERVICIO 
  //TODO: 3 VALIDAR QUE EXISTE LA COTIZACION Y SETEAR ESOS VALORES EN EL DATAMODEL COTIZADOR this.cotizador ACTUALIZAR LA COTIZACION SI LA BUSQUEDA EN EL COTIZADOR EXISTE  ACTUALIZAR EL ESTADO INACTIVO SI NO EXISTE CREA UNA NUEVA COTIZACION CUADNO ACTUALIZO LE PONGO EL ID QUE TRAJE DE LA BUSQUEDA Y CUANDO CREO NO LE PONES ID
  /**
   * Metodo que busca al cliente en los siguientes servicios
   * 1.- CloudStudio
   * 2.- Calculadora Quski
   * 3.- CRM
   * Trae la informacion y la setea en pantalla
   * 
   */
  buscarCliente() {
    this.loadingSubject.next(true);
    if (this.tipoIdentificacion != null) {
      /**
       * Busco en Calculadora Quski
       */
      this.clienteService.findClienteByCedulaQusqui(this.tipoIdentificacion = "C", this.identificacion.value).subscribe((dataCalculator: any) => {
        console.log('identificacion ', this.identificacion.value);
        console.log('identificacion ', this.tipoIdentificacion);
        this.loadingSubject.next(false);

        if (dataCalculator.entidad != null) {
          //Imprimo el objeto que viene de la consulta
          console.log('cliente quski ', dataCalculator.entidad);
          this.nombresCompletos.setValue(dataCalculator.entidad.datoscliente.nombrescompletos);
          this.fechaNacimiento.setValue(dataCalculator.entidad.datoscliente.fechanacimiento);
          this.edad.setValue(dataCalculator.entidad.datoscliente.edad);
          this.nacionalidad.setValue(dataCalculator.entidad.datoscliente.nacionalidad);
          this.movil.setValue(dataCalculator.entidad.datoscliente.telefonomovil);
          this.telefonoDomicilio.setValue(dataCalculator.entidad.datoscliente.telefonofijo);
          this.fpublicidad.setValue(dataCalculator.entidad.datoscliente.publicidad);
          this.correoElectronico.setValue(dataCalculator.entidad.datoscliente.correoelectronico);
          this.campania.setValue(dataCalculator.entidad.datoscliente.codigocampania);
          this.loadingSubject.next(true);
          this.sinNoticeService.setNotice("INFORMACION CARGADA CORRECTAMENTE", 'success');
        } else {
          /**
           * Busco en CRM
           */
          //TODO:LLAMAR AL SERVICIO DE CRM SATELITE ESPERAR QUE ESTE LA URL

        }
        if (this.nombresCompletos.value == null) {
          this.submit();
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
  }
  /**
   * Guarda la cotizacion en la base 
   */
  cotizacionGuardar() {
    this.cs.guardarCotizacion(this.cotizacion).subscribe((data: any) => {
      console.log("INGRESA A GUARDAR COTIZACIÓN");
      this.sinNoticeService.setNotice("REGISTRO EXITOSO COTIZACION", 'success');
      console.log("DATOS DE COTIZACION EN EL SUBMIT" + JSON.stringify(this.cotizacion));
      this.cotizacion = data.entidad;
    }, error => {

      this.loadingSubject.next(false);
      if (JSON.stringify(error).indexOf("codError") > 0) {
        let b = error.error;
        this.sinNoticeService.setNotice(b.msgError, 'error');
      } else {
        this.sinNoticeService.setNotice("ERROR AL REGISTRAR LA COTIZACION", 'error');
      }

    });
  }

  /**
   * Limpio los campos de la vista Cliente
   */
  limpiarCampos() {
    Object.keys(this.formCliente.controls).forEach((name) => {
      //console.log( "==limpiando " + name )
      let control = this.formCliente.controls[name];
      control.setErrors(null);
      control.setValue(null);
    });

  }


  /**
   * Propago los errores
   */
  getErrorMessage(pfield: string) {
    const errorRequerido = 'Ingresar valores';
    const errorNumero = 'Ingreso solo numeros';
    let maximo = "El maximo de caracteres es: ";
    const invalidIdentification = 'La identificacion no es valida';
    const errorLogitudExedida = 'La longitud sobrepasa el limite';
    const errorInsuficiente = 'La longitud es insuficiente';
    /**
     * Validaciones de cedula
     */
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
    /**
     * Validaciones de nombresCompletos
     */
    if (pfield && pfield === 'nombresCompletos') {
      const input = this.nombresCompletos;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion de fecha de nacimiento
     */
    if (pfield && pfield === 'fechaNacimiento') {
      const input = this.fechaNacimiento;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion para nacionalidad
     */
    if (pfield && pfield === 'nacionalidad') {
      const input = this.nacionalidad;
      return input.hasError('required') ? errorRequerido : '';
    }
    /**
     * Validacion de telefono domicilio
     */
    if (pfield && pfield === 'telefonoDomicilio') {
      const input = this.formCliente.get('telefonoDomicilio');
      console.log("telefonoDocimicilio", this.formCliente.get('telefonoDomicilio'))
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

  blurIdentificacion() {
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
      data: this.identificacion.value


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
