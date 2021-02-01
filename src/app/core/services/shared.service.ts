import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isLoading = new BehaviorSubject<boolean>(false);

  constructor(private modalService: NgbModal) { }

  show() {
      this.isLoading.next(true);
  }

  hide() {
      this.isLoading.next(false);
  }


}
