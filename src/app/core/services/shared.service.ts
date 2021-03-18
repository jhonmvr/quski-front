import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaAprobadorWrapper } from '../interfaces/AlertaAprobadorWrapper';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isLoading = new BehaviorSubject<boolean>(false);
  alertaAprobador = new BehaviorSubject<Array<AlertaAprobadorWrapper>>(null);

  constructor(private modalService: NgbModal) { }

  show() {
      this.isLoading.next(true);
  }

  hide() {
      this.isLoading.next(false);
  }
  cargarDatos( items : Array<AlertaAprobadorWrapper> ){
    this.alertaAprobador.next( items );
  }
  borrarDtos(){
    this.alertaAprobador.next( null );
  }


}
