import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { ExcepcionService } from '../../../../../core/services/quski/excepcion.service';
import { TbQoExcepcion } from '../../../../../core/model/quski/TbQoExcepcion';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kt-lista-excepciones',
  templateUrl: './lista-excepciones.component.html',
  styleUrls: ['./lista-excepciones.component.scss']
})
export class ListaExcepcionesComponent implements OnInit {
  public bloqueo : string = "";
  public isSalir: boolean = false;
  dataObservable:BehaviorSubject<string>=new BehaviorSubject<string>("");
  @Input() set idNegociacion( id :  string){
    this.dataObservable.next( id );
  }
  // TABLA EXCEPCIONES
  displayedColumns = ['tipoExcepcion','mensajeBre','idAsesor','observacionAsesor','idAprobador','observacionAprobador'];
  dataSource = new MatTableDataSource<TbQoExcepcion>();

  constructor(
    private exs: ExcepcionService,
    @Inject(MAT_DIALOG_DATA) private data: TbQoExcepcion[],
    public dialogRefGuardar: MatDialogRef<any>,
  ) { 
    this.exs.setParameter();
  }

  ngOnInit() {
    
    this.exs.setParameter();
    this.dataObservable.subscribe(id=>{
      if(id){

        this.exs.findByTipoExcepcionAndIdNegociacion(null,id).subscribe(data=>{
          this.dataSource = new MatTableDataSource<any>(data.list)
        });
      }
    });
   

  }
  salir(isFinalizar: boolean){
    this.dialogRefGuardar.close( isFinalizar );
  }
}
