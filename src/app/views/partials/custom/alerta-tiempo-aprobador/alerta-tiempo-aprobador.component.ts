import { SharedService } from '../../../../core/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorCargaInicialComponent } from '../popups/error-carga-inicial/error-carga-inicial.component';

@Component({
  selector: 'kt-alerta-tiempo-aprobador',
  templateUrl: './alerta-tiempo-aprobador.component.html',
  styleUrls: ['./alerta-tiempo-aprobador.component.scss']
})
export class AlertaTiempoAprobadorComponent implements OnInit {
  isLoading: Subject<boolean>;
  flat;
  
  constructor(private sharedService: SharedService,
    private dialog: MatDialog,
    ) {
      
  }
  ngOnInit() {
    let mensaje = "EL TIEMPO DE APROBACION A SUPERADO EL TIEMPO ESTABLESIDO";
  const dialogRef = this.dialog.open(ErrorCargaInicialComponent, {
    width: "800px",
    height: "auto",
    data: {mensaje:mensaje, titulo:'ALERTA TIEMPO TRANSCURRIDO'}
  });
  dialogRef.afterClosed().subscribe(r => {
    if(r){
      console.log("==========>>>> cierror pop ");
    }else{
     
    }
  });}
}