import { OperacionesProcesoWrapper } from '../../../../../core/model/wrapper/OperacionesProcesoWrapper';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { SoftbankService } from '../../../../../core/services/quski/softbank.service';
import { NegociacionService } from '../../../../../core/services/quski/negociacion.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';

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
  /** ** @TABLA ** */
  displayedColumns = ['usuario','reasignar'];
  dataSource = new MatTableDataSource<Usuario>();
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: OperacionesProcesoWrapper,
    public sof: SoftbankService,
    public neg: NegociacionService,
    public dialogRefGuardar: MatDialogRef<any>,
    private sinNotSer: ReNoticeService,
  ) { }

  ngOnInit() {
    this.cargarListaAsesores();
  }
  private cargarListaAsesores(){
    this.sof.consultarAsesoresCS().subscribe( (data: any) =>{
      if(!data.existeError){
        data.catalogo.forEach(e => {
          let usuario: Usuario;
          usuario = { codigo: e.codigo, nombre: e.nombre, correo: e.correo};
          this.dataSource.data.push( usuario );      
        });
      }
    });
  }
  public reasignar(row: Usuario){
    this.neg.reasignar( this.data.idNegociacion, row.codigo ).subscribe( (data: any) =>{
      if(data.entidad != null && data.entidad.idAsesor == "row.codigo"){
        this.dialogRefGuardar.close();
      }else{
        this.sinNotSer.setNotice('ERROR REASIGNANDO ASESOR, VUELVA A INTENTAR.', 'error');
      }
    });
  }

}
