import { ConfirmarAccionComponent } from '../../../../partials/custom/popups/confirmar-accion/confirmar-accion.component';
import { ExcepcionRolService } from '../../../../../core/services/quski/excepcionRol.service';
import { TbQoExcepcionRol } from '../../../../../core/model/quski/TbQoExcepcionRol';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { environment } from '../../../../../../environments/environment';
import { SubheaderService } from '../../../../../core/_base/layout';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TbQoCompromisoPago } from '../../../../../core/model/quski/TbQoCompromisoPago';
import { CreditoNegociacionService } from '../../../../../core/services/quski/credito.negociacion.service';
import { TbQoProceso } from '../../../../../core/model/quski/TbQoProceso';

@Component({
  selector: 'kt-bandeja-compromiso',
  templateUrl: './bandeja-compromiso.component.html',
  styleUrls: ['./bandeja-compromiso.component.scss']
})
export class BandejaCompromisoComponent implements OnInit {
  //FILTRO DE BUSQUEDA
  public formBusqueda: FormGroup = new FormGroup({});
  public numeroOperacion = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
  usuario: string;
  //VARIABLES DE LA TABLA
  displayedColumns = ['accion','codigo','numeroOperacion','procesoCompromiso','usuarioSolicitud','nombreCliente'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private subheaderService: SubheaderService,
    private cre: CreditoNegociacionService,
    private pro: ProcesoService,
    private dialog: MatDialog,
    private router: Router,
    private sinNoticeService: ReNoticeService,
  ) {
    this.formBusqueda.addControl('numeroOperacion', this.numeroOperacion);
    this.cre.setParameter();
  }

  ngOnInit() {
    this.cre.setParameter();
    this.usuario = atob(localStorage.getItem(environment.userKey));
    this.busqueda();
    this.subheaderService.setTitle("BANDEJA COMPROMISOS DE PAGO");
  }

  public busqueda() {
    this.cre.findCompromisoByNumeroOperacionEstado(this.numeroOperacion.value, 'PENDIENTE_COMPROMISO').subscribe((data: any) => {
      if (data && data.entidad) {
        const wrap : {procesos: TbQoProceso[], compromisos: TbQoCompromisoPago[]} = data.entidad;
        let sources : {
          codigo : string ,
          numeroOperacion : string ,
          procesoCompromiso : string ,
          usuarioSolicitud : string ,
          nombreCliente : string ,
        }[] = new Array();
        if (wrap.procesos) {
          wrap.procesos.forEach(e => {
            const comp = wrap.compromisos.find((item) => item.id === e.idReferencia)
            let source = {
              codigo : comp.codigo,
              numeroOperacion : comp.numeroOperacion,
              procesoCompromiso : e.proceso.replace(/_/g, ' '),
              usuarioSolicitud : comp.usuarioSolicitud,
              nombreCliente : comp.nombreCliente
            } 
            sources.push(source)
          });
          console.log(sources);
          this.dataSource = new MatTableDataSource<any>(sources) ;
        }
      }
    });
  }
  public limpiarFiltros(){
    Object.keys(this.formBusqueda.controls).forEach((name) => {
      const control = this.formBusqueda.controls[name];
      control.reset();
      control.setErrors(null);
      control.setValue(null);
    });
    this.busqueda();
  }


  public abrirSolicitud(row){
    let mensaje = 'Resolver solicitud de compromiso de pago'
    const dialogRef = this.dialog.open(ConfirmarAccionComponent, {
        width: "800px",
        height: "auto",
        data: mensaje
      });
      dialogRef.afterClosed().subscribe(r => {
        if(r){
          if(row.numeroOperacion != null){
            if(row.procesoCompromiso == 'COMPROMISO PAGO'){
              this.router.navigate(['aprobador/compromiso-pago/create/approval/', row.numeroOperacion]);    
            }
            if(row.procesoCompromiso == 'CAMBIO COMPROMISO PAGO'){
              this.router.navigate(['aprobador/compromiso-pago/update/approval/', row.numeroOperacion]);    
            }
          } else{
            this.sinNoticeService.setNotice('ERROR, CONTACTE SOPORTE','error');
          }
        }else{
          this.sinNoticeService.setNotice('SE CANCELO LA ACCION','warning');
        }

      });
  }


  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
