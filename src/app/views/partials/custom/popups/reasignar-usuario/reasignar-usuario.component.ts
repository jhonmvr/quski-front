import { OperacionesProcesoWrapper } from '../../../../../core/model/wrapper/OperacionesProcesoWrapper';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';
import { ConfirmarAccionComponent } from '../confirmar-accion/confirmar-accion.component';

export interface Usuario{
  codigo:  string
  nombre:  string 
  correo:  string
}
@Component({
  selector: 'kt-reasignar-usuario',
  templateUrl: './reasignar-usuario.component.html',
  styleUrls: ['./reasignar-usuario.component.scss']
})

export class ReasignarUsuarioComponent implements OnInit {
  /** ** @VARIABLES ** */
  private catUsuarios : Array<Usuario>;
  public usuario : string;

  /** ** @TABLA ** */
  displayedColumns = ['usuario','nombre','reasignar'];
  dataSource = new MatTableDataSource<Usuario>();
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: OperacionesProcesoWrapper,
    public sof: SoftbankService,
    public pro: ProcesoService,
    private dialog: MatDialog,
    public neg: NegociacionService,
    public dialogRefGuardar: MatDialogRef<any>,
    private sinNotSer: ReNoticeService,
  ) { 
    this.sof.setParameter();
    this.pro.setParameter();
    this.neg.setParameter();
  }

  ngOnInit() {
    this.sof.setParameter();
    this.pro.setParameter();
    this.neg.setParameter();
    this.usuario = this.data.asesor;
    this.cargarListaAsesores();
  }
  private cargarListaAsesores(){
    this.sof.consultarAsesoresCS().subscribe( (data: any) =>{
      if(!data.existeError){
        this.catUsuarios = data.catalogo;
        this.dataSource.data = this.catUsuarios; 
      } else {
        //console.log('Me cai we :c');
      }
    });
  }
  public reasignar(row: Usuario){
    const mensaje = "Reasignarle la operacion al usuario, " + row.nombre;
    const dialogRefGuardar = this.dialog.open(ConfirmarAccionComponent, {
      width: '800px',
      height: 'auto',
      data: mensaje
    });
    dialogRefGuardar.afterClosed().subscribe((result: true) => {
      if (result) {
        this.pro.reasignarOperacion( this.data.id, this.data.proceso, row.codigo ).subscribe( (data: any) =>{
          if(data.entidad){
            //console.log('Si se pudo :) ->', data.entidad.asesor);
            this.dialogRefGuardar.close(true);
          }else{
            this.sinNotSer.setNotice('ERROR REASIGNANDO ASESOR, VUELVA A INTENTAR.', 'error');
          }
        });
      }
    });
    
  }
  

}
