import { OperacionesProcesoWrapper } from '../../../../../core/model/wrapper/OperacionesProcesoWrapper';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { AuthDialogComponent } from '../../auth-dialog/auth-dialog.component';
import { ProcesoService } from '../../../../../core/services/quski/proceso.service';

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
  ) { }

  ngOnInit() {
    this.usuario = this.data.asesor;
    this.cargarListaAsesores();
  }
  private cargarListaAsesores(){
    this.sof.consultarAsesoresCS().subscribe( (data: any) =>{
      if(!data.existeError){
        this.catUsuarios = data.catalogo;
        this.dataSource.data = this.catUsuarios; 
      } else {
        console.log('Me cai we :c');
      }
    }, error =>{ this.capturaError( error ) });
  }
  public reasignar(row: Usuario){
    this.pro.reasignarOperacion( this.data.id, this.data.proceso, row.codigo ).subscribe( (data: any) =>{
      if(data.entidad){
        console.log('Si se pudo :) ->', data.entidad.asesor);
        this.dialogRefGuardar.close(true);
      }else{
        this.sinNotSer.setNotice('ERROR REASIGNANDO ASESOR, VUELVA A INTENTAR.', 'error');
      }
    });
  }
  private capturaError(error: any) {
    if (error.error) {
      if (error.error.codError) {
        this.sinNotSer.setNotice(error.error.codError + ' - ' + error.error.msgError, 'error');
      } else {
        this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
      }
    } else if (error.statusText && error.status == 401) {
      this.dialog.open(AuthDialogComponent, {
        data: {
          mensaje: "Error " + error.statusText + " - " + error.message
        }
      });
    } else {
      this.sinNotSer.setNotice("ERROR EN CORE INTERNO", 'error');
    }
  }

}
