import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { SubheaderService } from '../../../../../core/_base/layout/services/subheader.service';
import { NegociacionWrapper } from '../../../../../core/model/wrapper/NegociacionWrapper';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { TrackingService } from '../../../../../core/services/quski/tracking.service';
import { ClienteService } from '../../../../../core/services/quski/cliente.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { TrackingUtil } from '../../../../../../../src/app/core/util/TrakingUtil';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { DataPopup } from '../../../../../core/model/wrapper/dataPopup';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { LayoutConfigService } from '../../../../../../../src/app/core/_base/layout';



@Component({
  selector: 'kt-excepciones-cliente',
  templateUrl: './excepciones-cliente.component.html',
  styleUrls: ['./excepciones-cliente.component.scss']
})
export class ExcepcionesClienteComponent extends TrackingUtil implements OnInit {
  public wr: NegociacionWrapper;
  public excepcion: TbQoExcepcion;


  public catActividadEconomica: Array<any>;
  public catPais: Array<any>;
  public catEducacion: Array<any>;
  public catGenero: Array<any>;
  public catEstadoCivil: Array<any>;
  public catTipoTelefono: Array<any>;
  public catDivision: Array<any>;

  // STANDARD VARIABLES
  public dataPopup: DataPopup;
  public mensaje: any;
  dataSourceTelefonosCliente = new MatTableDataSource<any>();

  public formDatosOperacion: FormGroup = new FormGroup({});
  public nombresCompletos = new FormControl('', []);
  public identificacion = new FormControl('', []);
  public nombreProceso = new FormControl('', []);
  // FORM DATOS CLIENTE
  public formDatosCliente: FormGroup = new FormGroup({});
  public identificacionC = new FormControl('', []);
  public aprobadoWebMupi = new FormControl('', []);
  public primerNombre = new FormControl('', []);
  public segundoNombre = new FormControl('', []);
  public apellidoPaterno = new FormControl('', []);
  public apellidoMaterno = new FormControl('', []);
  public cargaFamiliar = new FormControl('', []);
  public genero = new FormControl('', []);
  public estadoCivil = new FormControl('', []);
  public lugarDeNacimiento = new FormControl('', []);
  public fechaDeNacimiento = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public edad = new FormControl('', []);
  public nivelDeEducacion = new FormControl('', []);
  public actividadEconomica = new FormControl('', []);
  public ultimaFechaDeActualizacionDeCliente = new FormControl('', []);
  // FORM DATOS CONTACTO
  public formDatosContacto: FormGroup = new FormGroup({});
  public correo = new FormControl('', []);
  // FORM DATOS NEGOCIACION
  public formDatosNegociacion: FormGroup = new FormGroup({});
  public tipoProcesoNegociacion = new FormControl('', []);
  public ultimaFechaDeActualizacionNegociacion = new FormControl('', []);

  // FORM DATOS EXCEPCION
  public formDatosExcepcion: FormGroup = new FormGroup({});
  public observacionAsesor = new FormControl('', []);
  public observacionAprobador = new FormControl('', [Validators.required]);
  public usuarioAsesor = new FormControl('', []);



  constructor(
    private cre: CreditoNegociacionService,    
    private sof: SoftbankService,
    private cli: ClienteService,
    private pro: ProcesoService,
    private layouteService: LayoutConfigService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private exs: ExcepcionService,
    private router: Router,
    private subheaderService: SubheaderService,
    private sinNoticeService: ReNoticeService,
    public tra: TrackingService,

  ) {
    super(tra);
    this.cre.setParameter();
    this.cli.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();
    this.exs.setParameter();

    //FORM DATOS OPERACION
    this.formDatosOperacion.addControl("nombresCompletos", this.nombresCompletos);
    this.formDatosOperacion.addControl("identificacion", this.identificacion);
    this.formDatosOperacion.addControl("nombreProceso", this.nombreProceso);
    //FORM DATOS CLIENTE
    this.formDatosCliente.addControl("identificacionC", this.identificacionC);
    this.formDatosCliente.addControl("aprobadoWebMupi", this.aprobadoWebMupi);
    this.formDatosCliente.addControl("primerNombre", this.primerNombre);
    this.formDatosCliente.addControl("segundoNombre", this.segundoNombre);
    this.formDatosCliente.addControl("apellidoPaterno", this.apellidoPaterno);
    this.formDatosCliente.addControl("apellidoMaterno", this.apellidoMaterno);
    this.formDatosCliente.addControl("cargaFamiliar", this.cargaFamiliar);
    this.formDatosCliente.addControl("genero", this.genero);
    this.formDatosCliente.addControl("estadoCivil", this.estadoCivil);
    this.formDatosCliente.addControl("lugarDeNacimiento", this.lugarDeNacimiento);
    this.formDatosCliente.addControl("fechaDeNacimiento", this.fechaDeNacimiento);
    this.formDatosCliente.addControl("nacionalidad", this.nacionalidad);
    this.formDatosCliente.addControl("edad", this.edad);
    this.formDatosCliente.addControl("nivelDeEducacion", this.nivelDeEducacion);
    this.formDatosCliente.addControl("actividadEconomica", this.actividadEconomica);
    this.formDatosCliente.addControl("ultimaFechaDeActualizacionDeCliente", this.ultimaFechaDeActualizacionDeCliente);
    //FORM DATOS CONTACTO
    this.formDatosContacto.addControl("correo", this.correo);
    //FORM DATOS NEGOCIACION
    this.formDatosNegociacion.addControl("tipoProcesoNegociacion", this.tipoProcesoNegociacion);
    this.formDatosNegociacion.addControl("ultimaFechaDeActualizacionNegociacion", this.ultimaFechaDeActualizacionNegociacion);
    //FORM DATOS EXCEPCION
    this.formDatosExcepcion.addControl("observacionAsesor", this.observacionAsesor);

    this.formDatosExcepcion.addControl("observacionAprobador", this.observacionAprobador);
    this.formDatosExcepcion.addControl("usuarioAsesor", this.usuarioAsesor);

    //SECCIONES Y CAMPOS DE LECTURA
    this.formDatosOperacion.disable();
    this.formDatosCliente.disable();
    this.formDatosContacto.disable();
    this.formDatosNegociacion.disable();
    this.observacionAsesor.disable();
    this.usuarioAsesor.disable();
  }

  ngOnInit() {
    this.cre.setParameter();
    this.cli.setParameter();
    this.sof.setParameter();
    this.pro.setParameter();
    this.exs.setParameter();
    this.traerCatalogos();

  }
  private traerCatalogos() {
    this.sof.consultarDivicionPoliticaCS().subscribe((data1: any) => {
      this.catDivision = !data1.existeError ? data1.catalogo : { nombre: 'Error al cargar catalogo' };
      this.sof.consultarPaisCS().subscribe((data: any) => {
        this.catPais = !data.existeError ? data.catalogo : "Error al cargar catalogo";
        this.sof.consultarGeneroCS().subscribe((data: any) => {
          this.catGenero = !data.existeError ? data.catalogo : "Error al cargar catalogo";
          this.sof.consultarEstadosCivilesCS().subscribe((data: any) => {
            this.catEstadoCivil = !data.existeError ? data.catalogo : "Error al cargar catalogo";
            this.sof.consultarTipoTelefonoCS().subscribe(tipoTel => {
              this.catTipoTelefono = tipoTel.catalogo;
              this.sof.consultarActividadEconomicaCS().subscribe((data: any) => {
                this.catActividadEconomica = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                this.sof.consultarEducacionCS().subscribe( (data: any) =>{
                  this.catEducacion = !data.existeError ? data.catalogo : "Error al cargar catalogo";
                  this.busquedaNegociacion();
                });
              });
            })
          });
        });
      });
    });
  }
  public regresar() {
    this.router.navigate(['aprobador/bandeja-excepciones']);
  }
  private busquedaNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        let excepcionRol = JSON.parse(atob(data.params.id));
        this.observacionAsesor.setValue(excepcionRol.observacionAsesor);
        this.mensaje = excepcionRol.mensajeBre;
        this.pro.getCabecera(excepcionRol.idNegociacion,'NUEVO').subscribe(datosCabecera=>{
          this.layouteService.setDatosContrato(datosCabecera);
        });
        this.cre.traerCreditoNegociacion(excepcionRol.idNegociacion).subscribe((data: any) => {
          this.wr = data.entidad
          if (this.wr) {
            this.subheaderService.setTitle("EXCEPCION DE CLIENTE PARA: "+ this.wr.credito.codigo);

            this.guardarTraking(this.wr ? this.wr.proceso ? this.wr.proceso.proceso : null : null,
              this.wr ? this.wr.credito ? this.wr.credito.codigo : null : null, 
              ['Información Operación','Datos Del Cliente','Datos De contacto Del Cliente','Variables crediticias','Riesgo Acumulado','Excepción'], 
              0, 'EXCEPCION CLIENTE', this.wr ? this.wr.credito ? this.wr.credito.numeroOperacion : null : null )
              
            this.excepcion = data.entidad.excepciones.find(e => e.id == excepcionRol.id);
            this.usuarioAsesor.setValue(this.excepcion.idAsesor);
            this.nombresCompletos.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
            this.identificacion.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.cedulaCliente);
            this.identificacionC.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.cedulaCliente);
            this.aprobadoWebMupi.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi == 'S' ? 'Si' : 'No' )
            this.primerNombre.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.primerNombre);
            this.segundoNombre.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.segundoNombre);
            this.apellidoPaterno.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.apellidoPaterno);
            this.apellidoMaterno.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.apellidoMaterno);
            this.cargaFamiliar.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.cargasFamiliares);
            this.genero.setValue( this.catGenero.find( x => x.codigo == this.wr.credito.tbQoNegociacion.tbQoCliente.genero) ? 
              this.catGenero.find( x => x.codigo == this.wr.credito.tbQoNegociacion.tbQoCliente.genero).nombre : 'Error de catalogo');
            this.estadoCivil.setValue( this.catEstadoCivil.find( x=> x.codigo == this.wr.credito.tbQoNegociacion.tbQoCliente.estadoCivil) ?
              this.catEstadoCivil.find( x=> x.codigo == this.wr.credito.tbQoNegociacion.tbQoCliente.estadoCivil).nombre : 'Error de catalogo');

            let itemParroquia = this.cargarItem(this.catDivision, this.wr.credito.tbQoNegociacion.tbQoCliente.lugarNacimiento);
            let itemCanton = this.cargarItem(this.catDivision, itemParroquia.idPadre);
            let itemProvincia = this.cargarItem(this.catDivision, itemCanton.idPadre);
            this.lugarDeNacimiento.setValue( (itemParroquia ? itemParroquia.nombre : '' ) + (itemCanton ? ' / ' + itemCanton.nombre : '' ) + (itemProvincia ? ' / ' + itemProvincia.nombre : '') );
            this.nacionalidad.setValue(this.cargarItem(this.catPais, this.wr.credito.tbQoNegociacion.tbQoCliente.nacionalidad).nacionalidad );
            this.fechaDeNacimiento.setValue(new Date(this.wr.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento));
            this.edad.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.edad);
            this.nivelDeEducacion.setValue( this.catEducacion.find( x=> x.codigo == this.wr.credito.tbQoNegociacion.tbQoCliente.nivelEducacion) ?
              this.catEducacion.find( x=> x.codigo == this.wr.credito.tbQoNegociacion.tbQoCliente.nivelEducacion).nombre : 'Error de catalogo');
            this.actividadEconomica.setValue(this.catActividadEconomica.find(x=> x.id == this.wr.credito.tbQoNegociacion.tbQoCliente.actividadEconomica) ?
              this.catActividadEconomica.find(x=> x.id == this.wr.credito.tbQoNegociacion.tbQoCliente.actividadEconomica).nombre : 'Error de catalogo' );
            this.ultimaFechaDeActualizacionDeCliente.setValue(new Date(this.wr.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento));
            this.dataPopup = new DataPopup();
            this.dataPopup.cedula = this.wr.credito.tbQoNegociacion.tbQoCliente.cedulaCliente;
            this.dataPopup.isNegociacion = true;
            this.dataPopup.idBusqueda = this.wr.credito.tbQoNegociacion.id;
            if (this.wr.telefonos) {
              this.dataSourceTelefonosCliente = new MatTableDataSource<any>(this.wr.telefonos);
            }
            this.correo.setValue(this.wr.credito.tbQoNegociacion.tbQoCliente.email);
            this.nombreProceso.setValue(this.wr.proceso.proceso);
            this.ultimaFechaDeActualizacionNegociacion.setValue(new Date(this.wr.credito.tbQoNegociacion.fechaActualizacion));
          } else {
            this.sinNoticeService.setNotice('ERROR CARGANDO NEGOCIACION', 'error');
          }
        });
      }
    });
  }
  private cargarItem(catalogo, id) {
    if(catalogo){
      let item = catalogo.find(x => x.id == id);
      if (catalogo && item) {
        return item;
      }
    }
  }
  /******************************************** @EVENT   *********************************************************/
  aprobarExcepcion(aprueba) {
    if (this.observacionAprobador.invalid) {
      this.sinNoticeService.setNotice('COMPLETE CORRECTAMENTE EL LOS CAMPOS OBLIGATORIOS', 'warning');
      return;
    }
    let mensaje = aprueba ? "Aprobar excepcion de cliente para: " + this.wr.credito.tbQoNegociacion.tbQoCliente.nombreCompleto :
    "Negar excepcion de cliente para: " + this.wr.credito.tbQoNegociacion.tbQoCliente.nombreCompleto ;
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
      width: "800px",
      height: "auto",
      data: mensaje
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        this.exs.aprobarExcepcion(this.excepcion.id, this.observacionAprobador.value, aprueba).subscribe(p => {
          if (aprueba) {
            this.sinNoticeService.setNotice('EXCEPCION DE CLIENTE APROBADA', 'success');
          } else {
            this.sinNoticeService.setNotice('EXCEPCION DE CLIENTE NEGADA', 'success');
          }
          this.router.navigate(['../../aprobador/bandeja-excepciones']);
        });
      } else {
        this.sinNoticeService.setNotice('SE CANCELO LA ACCION', 'error');
      }
    });
  }
}
