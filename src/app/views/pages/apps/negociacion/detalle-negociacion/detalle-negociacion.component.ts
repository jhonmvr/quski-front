import { ErrorCargaInicialComponent } from '../../../../partials/custom/popups/error-carga-inicial/error-carga-inicial.component';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { DetalleNegociacionWrapper } from '../../../../../core/model/wrapper/DetalleNegociacionWrapper';
import { ParametroService } from '../../../../../core/services/quski/parametro.service';
import { CatalogosWrapper } from '../../../../../core/model/wrapper/CatalogosWrapper';
import { RelativeDateAdapter } from '../../../../../core/util/relative.dateadapter';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { YearMonthDay } from '../../../../../core/model/quski/YearMonthDay';
import { SubheaderService } from '../../../../../core/_base/layout';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { TbQoCreditoNegociacion } from '../../../../../core/model/quski/TbQoCreditoNegociacion';

@Component({
  selector: 'kt-detalle-negociacion',
  templateUrl: './detalle-negociacion.component.html',
  styleUrls: ['./detalle-negociacion.component.scss']
})
export class DetalleNegociacionComponent implements OnInit {
  public loading;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public detalle: DetalleNegociacionWrapper;
  public catalogos: CatalogosWrapper;
  public formDisable: FormGroup = new FormGroup({});
  public nombre = new FormControl('',[])
  public cedula = new FormControl('',[])
  public fechaNacimiento = new FormControl('',[])
  public edad = new FormControl('',[])
  public nacionalidad = new FormControl('',[])
  public telefonoMovil = new FormControl('',[])
  public telefonoDomicilio = new FormControl('',[])
  public publicidad = new FormControl('',[])
  public correo = new FormControl('',[])
  public campania = new FormControl('',[])
  public aprobadoMupi = new FormControl('',[])
  dataSourceCreditoNegociacion = new MatTableDataSource<TbQoCreditoNegociacion>();
  displayedColumnsCreditoNegociacion = ['plazo','periodicidadPlazo','tipooferta','montoFinanciado','valorARecibir','cuota','totalGastosNuevaOperacion','costoCustodia', 'costoTransporte','costoTasacion','costoSeguro','costoFideicomiso','impuestoSolca'];
    constructor(
    private route: ActivatedRoute,
    private cre: CreditoNegociacionService,
    private sinNotSer: ReNoticeService,
    private par: ParametroService,
    private dialog: MatDialog,
    private subheaderService: SubheaderService,
    private router: Router
  ) {
    this.par.setParameter();
    this.cre.setParameter();
    this.formDisable.addControl('nombre', this.nombre);
    this.formDisable.addControl('cedula', this.cedula);
    this.formDisable.addControl('fechaNacimiento', this.fechaNacimiento);
    this.formDisable.addControl('edad', this.edad);
    this.formDisable.addControl('nacionalidad', this.nacionalidad);
    this.formDisable.addControl('telefonoMovil', this.telefonoMovil);
    this.formDisable.addControl('telefonoDomicilio', this.telefonoDomicilio);
    this.formDisable.addControl('publicidad', this.publicidad);
    this.formDisable.addControl('correo', this.correo);
    this.formDisable.addControl('campania', this.campania);
    this.formDisable.addControl('aprobadoMupi', this.aprobadoMupi);
  }

  ngOnInit() {
    this.par.setParameter();
    this.cre.setParameter();    
    this.formDisable.disable();
    this.loading = this.loadingSubject.asObservable();
    this.subheaderService.setTitle('Gestion credito');
    this.traerCreditoNegociacion();
  }
  private traerCreditoNegociacion() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id) {
        this.loadingSubject.next(true);
        this.cre.traerCreditoNegociacion(data.params.id).subscribe((data: any) => {
          //console.log('Credito --> ', data.entidad);
          if (!data.entidad.existeError) {
            this.detalle = data.entidad;
            this.setearValores( this.detalle );
          }else{
            this.salirDeGestion("Error al intentar cargar el credito: "+ data.entidad.mensaje);
          }
        });
      } else {
        this.sinNotSer.setNotice('ERROR AL CARGAR CREDITO', 'error');
      }
    });
  }
  private setearValores(ap: DetalleNegociacionWrapper) {
    this.nombre.setValue( ap.credito.tbQoNegociacion.tbQoCliente.nombreCompleto );
    this.cedula.setValue( ap.credito.tbQoNegociacion.tbQoCliente.cedulaCliente );
    this.fechaNacimiento.setValue( ap.credito.tbQoNegociacion.tbQoCliente.fechaNacimiento );
    this.cargarEdad();
    this.nacionalidad.setValue( ap.credito.tbQoNegociacion.tbQoCliente.nacionalidad );
    this.publicidad.setValue( ap.credito.tbQoNegociacion.tbQoCliente.publicidad );
    this.correo.setValue( ap.credito.tbQoNegociacion.tbQoCliente.email );
    this.campania.setValue( ap.credito.tbQoNegociacion.tbQoCliente.campania );
    this.aprobadoMupi.setValue( ap.credito.tbQoNegociacion.tbQoCliente.aprobacionMupi );
    !ap.telefonos ? null : ap.telefonos.forEach( e=>{
      if( e.tipoTelefono == 'CEL'){
        this.telefonoMovil.setValue( e.numero );
      }
      if(e.tipoTelefono == 'DOM'){
        this.telefonoDomicilio.setValue( e.numero );
      }
    }); 
    this.dataSourceCreditoNegociacion.data.push( ap.credito? ap.credito : null );
    this.sinNotSer.setNotice('Detalle de credito en proceso cargado', 'success');
    this.loadingSubject.next(false);
  }
  /** ********************************************* @FUNCIONALIDAD ********************* **/
  private salirDeGestion(dataMensaje: string, dataTitulo?: string) {
    this.loadingSubject.next(false);
      let pData = {
        mensaje: dataMensaje,
        titulo: dataTitulo ? dataTitulo : null
      }
      const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
        width: "800px",
        height: "auto",
        data: pData
      });
      dialogRef.afterClosed().subscribe(r => {
        this.router.navigate(['negociacion/']);
      });
  }
  regresar(){
    this.router.navigate(['negociacion/']);
  }
  public cargarEdad(){
    if(this.fechaNacimiento.valid){
      const fechaSeleccionada = new Date(this.fechaNacimiento.value);
      const convertFechas = new RelativeDateAdapter();
      this.par.getDiffBetweenDateInicioActual(convertFechas.format(fechaSeleccionada, "input"), "dd/MM/yyy").subscribe((rDiff: any) => {
        const diff: YearMonthDay = rDiff.entidad;
        this.edad.setValue( diff.year );
      });
    }
  }
}
