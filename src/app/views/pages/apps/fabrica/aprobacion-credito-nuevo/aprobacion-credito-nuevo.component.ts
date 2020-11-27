import { ProcesoEnum } from './../../../../../core/enum/ProcesoEnum';
import { TbQoCreditoNegociacion } from './../../../../../core/model/quski/TbQoCreditoNegociacion';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource, MatStepper } from '@angular/material';
import { TbQoPatrimonioCliente } from '../../../../../core/model/quski/TbQoPatrimonioCliente';
import { TbQoIngresoEgresoCliente } from '../../../../../core/model/quski/TbQoIngresoEgresoCliente';
import { TbReferencia } from '../../../../../core/model/quski/TbReferencia';
import { TbQoTasacion } from '../../../../../core/model/quski/TbQoTasacion';
import { TbQoVariablesCrediticia } from '../../../../../core/model/quski/TbQoVariablesCrediticia';
import { constructor } from 'lodash';
import { TbQoCliente } from '../../../../../core/model/quski/TbQoCliente';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { TbQoNegociacion } from '../../../../../core/model/quski/TbQoNegociacion';
import { AprobacionWrapper } from '../../../../../core/model/wrapper/AprobacionWrapper';
import { FormControl, FormGroup } from '@angular/forms';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../../../../../../../src/environments/environment';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from './../../../../../core/_base/layout/services/subheader.service';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';
import { TbQoDireccionCliente } from '../../../../../core/model/quski/TbQoDireccionCliente';
import { TbQoRiesgoAcumulado } from '../../../../../core/model/quski/TbQoRiesgoAcumulado';
import { throwIfEmpty } from 'rxjs/operators';
import { TbQoPatrimonio } from 'src/app/core/model/quski/TbQoPatrimonio';


@Component({
  selector: 'app-aprobacion-credito-nuevo',
  templateUrl: './aprobacion-credito-nuevo.component.html',
  styleUrls: ['./aprobacion-credito-nuevo.component.scss']
})
export class AprobacionCreditoNuevoComponent implements OnInit {
  // VARIABLES PUBLICAS  
  public loading;
  public usuario: string;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public crediW: AprobacionWrapper;

  /** @OPERACION */
  public codigoBpm = new FormControl('', []);
  public proceso = new FormControl('', []);
  public nombresCompletoCliente = new FormControl('', []);

  /** @DATOS_PERSONALES */
  public tipoIdentificacion = new FormControl('', []);
  public identificacion = new FormControl('', []);
  public aprobacionMupi = new FormControl('', []);
  public nombresCompletos = new FormControl('', []);
  public primerNombre = new FormControl('', []);
  public segundoNombre = new FormControl('', []);
  public apellidoPaterno = new FormControl('', []);
  public apellidoMaterno = new FormControl('', []);
  public separacionDeBienes = new FormControl('', []);
  public genero = new FormControl('', []);
  public estadoCivil = new FormControl('', []);
  public cargaFamiliar = new FormControl('', []);
  public nacionalidad = new FormControl('', []);
  public lugarDeNacimiento = new FormControl('', []);
  public edad = new FormControl('', []);
  public fechaNacimiento = new FormControl('', []);
  public nivelEducacion = new FormControl('', []);
  public actividadEconomica = new FormControl('', []);
  public fechaUltimaActualizazion = new FormControl('', []);
  public telefonoDomicilio = new FormControl('', []);
  public telefonoMovil = new FormControl('', []);
  public telefonoOficina = new FormControl('', []);
  public correo = new FormControl('', []);

  public direccionLegalDomicilio = new FormControl('', []);
  public direccionCorreoDomicilio = new FormControl('', []);
  public ubicacion = new FormControl('', []);
  public barrio = new FormControl('', []);
  public sector = new FormControl('', []);
  public callePrincipal = new FormControl('', []);
  public numeracion = new FormControl('', []);
  public calleSecundaria = new FormControl('', []);
  public referenciaUbicacion = new FormControl('', []);
  public tipoVivienda = new FormControl('', []);

  public direccionCorreoLaboral = new FormControl('', []);
  public direccionLegalLaboral = new FormControl('', []);
  public ubicacionLaboral= new FormControl('', []);
  public referenciaUbicacionLaboral= new FormControl('', []);
  public callePrincipalLaboral= new FormControl('', []);
  public numeracionLaboral= new FormControl('', []);
  public barrioLaboral= new FormControl('', []);
  public calleSecundariaLaboral= new FormControl('', []);
  public tipoViviendaLaboral= new FormControl('', []);
  public sectorLaboral= new FormControl('', []);
  public actividadEconomicaEmpresa = new FormControl('', []);
  public actividadEconomicaMupi = new FormControl('', []);
  public nombreEmpresa = new FormControl('', []);
  public origenIngresos = new FormControl('', []);
  public profesion = new FormControl('', []);
  public ocupacion = new FormControl('', []);
  public cargo = new FormControl('', []);
  public relacionDependencia = new FormControl('');

  displayedColumnsActivo = ['Activo', 'Avaluo'];
  displayedColumnsPasivo = ['Pasivo', 'Avaluo'];
  dataSourcePatrimonioActivo = new  MatTableDataSource<TbQoPatrimonio>();
  dataSourcePatrimonioPasivo = new  MatTableDataSource<TbQoPatrimonio>();
  displayedColumnsII = ['Is', 'Valor'];
  dataSourceIngresoEgreso = new MatTableDataSource<TbQoIngresoEgresoCliente>();
  displayedColumnsReferencia = ['N', 'nombresRef', 'apellidosRef', 'Parentesco', 'Direccion', 'TelefonoMovil', 'TelefonoFijo'];
  dataSourceReferencia = new MatTableDataSource<TbReferencia>();

  /** @DATOS_NEGOCIACION */
  public tipoProceso = new FormControl('', []);
  public displayedColumnsExcepciones = ['orden', 'variable', 'valor'];
  public dataSourceExcepciones = new MatTableDataSource<TbQoExcepcion>();
  dataSourceTasacion = new MatTableDataSource<TbQoTasacion>();
  displayedColumnsTasacion = ['NumeroPiezas', 'TipoOro', 'TipoJoya', 'EstadoJoya', 'Descripcion','PesoBruto', 'DescuentoPesoPiedra', 'DescuentoSuelda', 'PesoNeto', 'precioOro', 'ValorAvaluo', 'ValorAplicable', 'ValorRealizacion', 'tienePiedras', 'detallePiedras', 'ValorOro'];
  public numeroFunda = new FormControl('', []);
  public tipoFunda = new FormControl('', []);

  /** @CREDITO_NUEVO */
  public montoPreaprobado = new FormControl('', []);
  public montoSolicitado = new FormControl('', []);
  public montoDiferido = new FormControl('', []);
  public plazo = new FormControl('', []);
  public tipoOperacion = new FormControl('', []);
  public tipoOferta = new FormControl('', []);
  public costoCustodia = new FormControl('', []);
  public formaPagoCustodia = new FormControl('', []);
  public costoTransporte = new FormControl('', []);
  public formaPagoTransporte = new FormControl('', []);
  public costoValoracion = new FormControl('', []);
  public formaPagoValoracion = new FormControl('', []);
  public costoTasacion = new FormControl('', []);
  public formaPagoTasacion = new FormControl('', []);
  public costoResguardo = new FormControl('', []);
  public formaPagoResguardo = new FormControl('', []);
  public costoSeguro = new FormControl('', []);
  public formaPagoSeguro = new FormControl('', []);
  public solca = new FormControl('', []);
  public formaPagoSolca = new FormControl('', []);
  public montoDesembolsoBallon = new FormControl('', []);
  public aPagarCliente = new FormControl('', []);
  public riesgoTotalCliente = new FormControl('', []);
  public aRecibirCliente = new FormControl('', []);
  public totalCostoNuevaOperacion = new FormControl('', []);

  /** @INSTRUCCION_OPERATIVA */
  public tipoCuenta = new FormControl('', []);
  public numeroCuenta = new FormControl('', []);
  public firmaRegularizada = new FormControl('', []);
  public diaPagoFijo = new FormControl('', []);
  public firmadaOperacion = new FormControl('', []);
  public tipoCliente = new FormControl('', []);

  /** @OPERACION_NUEVA */
  public tipoCartera = new FormControl('', []);
  public numeroOperacion = new FormControl('', []);
  public descripcionProducto = new FormControl('', []);
  public destinoOperacion = new FormControl('', []);
  public estadoOperacion = new FormControl('', []);
  public tipoOperacionNueva = new FormControl('', []);
  public plazoNueva = new FormControl('', []);
  public fechaVencimiento = new FormControl('', []);
  public fechaEfectiva = new FormControl('', []);
  public valorDesembolso = new FormControl('', []);
  public montoFinanciado = new FormControl('', []);
  public cuota = new FormControl('', []);
  public totalInteres = new FormControl('', []);
  public fechaTrabajoGad = new FormControl('', []);
  public capitalInteres = new FormControl('', []);

  /** @RESULTADO_OPERACION */
  public formResultadoOperacion: FormGroup = new FormGroup({});
  public motivoDevolucion = new FormControl('', []);
  public codigoCash = new FormControl('', []);
  public observacionAprobador = new FormControl('', []);

  constructor(
    private cne: CreditoNegociacionService,
    private sinNotSer: ReNoticeService,
    private route: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService
  ) {}

  ngOnInit() {
    this.subheaderService.setTitle('Aprobación De Credito');
    this.loading = this.loadingSubject.asObservable();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.traerCreditoNegociacion();
  }


  private traerCreditoNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        this.loadingSubject.next(true);
        this.cne.traerCreditoNegociacionExistente(data.params.id).subscribe((data: any) => {
          console.log('Credito --> ', data);
          if (!data.entidad.existeError) {
            this.crediW = data.entidad;
            this.setearValores(this.crediW);
          }else{
            this.loadingSubject.next(false);
            this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO: '+ data.entidad.mensaje, 'error');
          }
        });
      } else {
        this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO', 'error');
      }
    });
  }
  private setearValores(ap: AprobacionWrapper) {
    //SETEO INFORMACION OPERACION 
    this.codigoBpm.setValue(ap.credito.codigo);
    this.proceso.setValue(ap.proceso.proceso);
    this.nombresCompletoCliente.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    // SETEO DE DATOS DE CONTACTO CLIENTE 
    this.tipoIdentificacion.setValue(""); // Todo: cargar catalogo;
    this.identificacion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.cedulaCliente);
    this.aprobacionMupi.setValue(ap.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi);
    this.nombresCompletos.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto);
    this.primerNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.primerNombre);
    this.segundoNombre.setValue(ap.credito.tbQoNegociacion.tbQoCliente.segundoNombre);
    this.apellidoPaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoPaterno);
    this.apellidoMaterno.setValue(ap.credito.tbQoNegociacion.tbQoCliente.apellidoMaterno);
    this.separacionDeBienes.setValue(ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes ? ap.credito.tbQoNegociacion.tbQoCliente.separacionBienes : 'NO APLICA' );
    this.genero.setValue(ap.credito.tbQoNegociacion.tbQoCliente.genero);
    this.estadoCivil.setValue(ap.credito.tbQoNegociacion.tbQoCliente.estadoCivil);
    this.cargaFamiliar.setValue(ap.credito.tbQoNegociacion.tbQoCliente.cargasFamiliares);
    this.nacionalidad.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nacionalidad);
    this.lugarDeNacimiento.setValue(ap.credito.tbQoNegociacion.tbQoCliente.lugarNacimiento);
    this.edad.setValue(ap.credito.tbQoNegociacion.tbQoCliente.edad);
    this.fechaNacimiento.setValue(ap.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento);
    this.nivelEducacion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.nivelEducacion);
    this.actividadEconomica.setValue(ap.credito.tbQoNegociacion.tbQoCliente.actividadEconomica);
    this.fechaUltimaActualizazion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.fechaActualizacion);
    //DATOS CONTACTO CLIENTE 
    this.correo.setValue(ap.credito.tbQoNegociacion.tbQoCliente.email);
    //DIRECCION DOMICILIO Y LABORAL
    ap.direcciones.forEach(e => {
      if (e.tipoDireccion == 'DOM') {
        this.direccionLegalDomicilio.setValue(e.direccionLegal);
        this.direccionCorreoDomicilio.setValue(e.direccionEnvioCorrespondencia);
        //this.ubicacion.setValue(e.ubicacion);
        this.callePrincipal.setValue(e.callePrincipal);
        this.numeracion.setValue(e.numeracion);
        this.callePrincipal.setValue(e.callePrincipal);
        this.referenciaUbicacion.setValue(e.referenciaUbicacion);
        this.barrio.setValue(e.barrio);
        this.sector.setValue(e.sector);
      }
      if(e.tipoDireccion == 'OFI' ){
        this.direccionLegalLaboral.setValue(e.direccionLegal);
        this.direccionCorreoLaboral.setValue(e.direccionEnvioCorrespondencia);
        //this.ubicacion.setValue(e.ubicacion);
        this.callePrincipalLaboral.setValue(e.callePrincipal);
        this.numeracionLaboral.setValue(e.numeracion);
        this.callePrincipalLaboral.setValue(e.callePrincipal);
        this.referenciaUbicacionLaboral.setValue(e.referenciaUbicacion);
        this.barrioLaboral.setValue(e.barrio);
        this.sectorLaboral.setValue(e.sector);
      } 
    });
    //DATOS ECONOMICOS DEL CLIENTE
    this.origenIngresos.setValue(ap.credito.tbQoNegociacion.tbQoCliente);
    this.actividadEconomica.setValue(ap.credito.tbQoNegociacion.tbQoCliente.actividadEconomica);
    this.profesion.setValue(ap.credito.tbQoNegociacion.tbQoCliente.profesion);
    /** @TABLAS */
    this.dataSourcePatrimonioActivo.data = ap.patrimonios;
    this.dataSourcePatrimonioPasivo.data = ap.patrimonios;
    this.dataSourceIngresoEgreso.data = ap.ingresosEgresos;
    this.dataSourceReferencia.data = ap.referencias;
    this.dataSourceTasacion.data = ap.joyas;
    //DATOS CREDITO NUEVO 
    this.montoPreaprobado.setValue( ap.credito.montoSolicitado);
    this.montoSolicitado.setValue( ap.credito.montoSolicitado);
    this.montoDiferido.setValue( ap.credito.montoDiferido);
    this.plazo.setValue( ap.credito.plazoCredito);
    this.tipoOperacion.setValue( ap.credito.tipo);
    this.tipoOferta.setValue( ap.credito.tipo);
    this.costoCustodia.setValue( ap.credito.costoCustodia);
    this.formaPagoCustodia.setValue( ap.credito.formaPagoCustodia);
    this.costoTransporte.setValue( ap.credito.costoTransporte);
    this.formaPagoTransporte.setValue( ap.credito.formaPagoTransporte);
    this.costoValoracion.setValue( ap.credito.costoValoracion);
    this.formaPagoValoracion.setValue( ap.credito.formaPagoValoracion);
    this.costoTasacion.setValue( ap.credito.costoTasacion);
    this.formaPagoTasacion.setValue( ap.credito.formaPagoTasador);
    this.costoResguardo.setValue( ap.credito);
    this.formaPagoResguardo.setValue( ap.credito);
    this.costoSeguro.setValue( ap.credito.costoSeguro);
    this.formaPagoSeguro.setValue( ap.credito.formaPagoSeguro);
    this.solca.setValue( ap.credito.impuestoSolca);
    this.formaPagoSolca.setValue( ap.credito.formaPagoImpuestoSolca);
    this.montoDesembolsoBallon.setValue( ap.credito.montoDesembolso);
    this.aPagarCliente.setValue( ap.credito.aPagarCliente);
    this.riesgoTotalCliente.setValue( ap.credito.riesgoTotalCliente);
    this.aRecibirCliente.setValue( ap.credito.aRecibirCliente);
    this.totalCostoNuevaOperacion.setValue( ap.credito.totalCostoNuevaOperacion);
    this.loadingSubject.next(false);
  }
}