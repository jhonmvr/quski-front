import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TituloContratoService {
    onNoticeChanged$: BehaviorSubject<string>;

    constructor() {
        this.onNoticeChanged$ = new BehaviorSubject(null);
    }
    
    setNotice(message: string) {
     
        this.onNoticeChanged$.next(message);
    }

}
