import { SharedService } from '../../../../core/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'kt-alerta-tiempo-aprobador',
  templateUrl: './alerta-tiempo-aprobador.component.html',
  styleUrls: ['./alerta-tiempo-aprobador.component.scss']
})
export class AlertaTiempoAprobadorComponent implements OnInit {
  isLoading: Subject<boolean>;
  flat;
  
  constructor(private sharedService: SharedService) {
    this.isLoading =this.sharedService.isLoading;
    this.flat = this.isLoading.asObservable();
  }
  ngOnInit() {}
}