import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    count = 0;
    constructor(public loaderService: SharedService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        setTimeout(() => {this.loaderService.show();}, 0);
        this.count++;
        req = req.clone({
			setHeaders: {
				Authorization: `relative ${localStorage.getItem('accessToken')}`
			}
        });
        //console.log("===>> interseptor=== ",JSON.stringify(req));
        return next.handle(req).pipe ( tap (

            event => "",

            error => ""

        ), finalize(() => {

            this.count--;

            if ( this.count == 0 ) setTimeout(() => {this.loaderService.hide();}, 0);
        })
    );
    }
}
