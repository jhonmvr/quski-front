import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ReNotice, TipoNotificacion } from '../interfaces/re-notice';


@Injectable({
  providedIn: 'root'
})
export class ReNoticeService {
    onNoticeChanged$: BehaviorSubject<ReNotice>;

    constructor() {
        this.onNoticeChanged$ = new BehaviorSubject(null);
    }
    
    setNotice(message: string, type?: TipoNotificacion) {
        const notice: ReNotice = {
            message: message,
            type: type
        };
        this.onNoticeChanged$.next(notice);
    }

}
