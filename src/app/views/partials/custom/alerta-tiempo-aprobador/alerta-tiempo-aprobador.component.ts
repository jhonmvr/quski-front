import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'kt-alerta-tiempo-aprobador',
  templateUrl: './alerta-tiempo-aprobador.component.html',
  styleUrls: ['./alerta-tiempo-aprobador.component.scss']
})
export class AlertaTiempoAprobadorComponent implements OnInit {
  isLoading: Subject<boolean> ;
  flat;
  
  constructor(private sharedService: SharedService) {
    this.isLoading =this.sharedService.isLoading;
    this.flat = this.isLoading.asObservable();
  }

  ngOnInit() {
    this.consultaDeTiempo(); 
  }
  consultaDeTiempo(){
    
  }


}
