import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';
import { AuthDialogComponent } from '../../../app/views/partials/custom/auth-dialog/auth-dialog.component';
import { ReNoticeService } from '../services/re-notice.service';
import { MatDialog } from '@angular/material';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  count = 0;
  constructor(public loaderService: SharedService, private sinNoticeService: ReNoticeService, private dialog: MatDialog) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(JSON.stringify(req).indexOf("/api/") >= 0 || JSON.stringify(req).indexOf("oauth2/token") >= 0){
      req = req.clone({
        setHeaders: {
          Authorization: `${localStorage.getItem(environment.token_type)} ${localStorage.getItem(environment.access_token)}`
        }
      });
    }else{
      req = req.clone({
        setHeaders: {
          Authorization: `${localStorage.getItem(environment.token_type)} ${localStorage.getItem(environment.access_token)}`
        },
        setParams:{
          autorizacion:`${localStorage.getItem(environment.token_type)} ${localStorage.getItem(environment.access_token)}`
        }
      });
    }
  
    if (JSON.stringify(req).indexOf("listAlertaDeProcesosAprobado") < 0) {
      setTimeout(() => {
        this.loaderService.show();
      }, 0);
    }
    this.count++;

    return next.handle(req).pipe(tap(

      event => "",

      error => {
        //console.log("esto capturo cuando sale error bb========>",error);
        this.HandleError(error);
      }), finalize(() => {

        this.count--;

        if (this.count <= 0) {
         // this.count = 0;
          setTimeout(() => {
            this.loaderService.hide();
          }, 0);
        }
      })
    );
  }

  HandleError(error: any) {
    //debugger;
    //console.log("eror===>>>>",JSON.stringify(error))
    if (JSON.stringify(error).indexOf("codError") > 0) {
      let b = error.error;
      this.sinNoticeService.setNotice(b.msgError, 'error');
    } else if (error.error instanceof Blob) {
      this.sinNoticeService.setNotice("NO SE ENCUENTRA O NO EXISTE ", 'error');
    }
    else if (error instanceof HttpErrorResponse) {
      if (error.status != 200) {
        if (error.message) {
          this.sinNoticeService.setNotice(error.message, 'error');
        }
      }
    } else if (error.error instanceof ProgressEvent) {
      this.sinNoticeService.setNotice("NO SE PUEDE ACCEDER AL SERVICIO REVISE SU CONEXIÓN A INTERNET O VPN", 'error');
    }
    let errorMessage = '';
    if (error.status === 401) {
      errorMessage = 'Error: ' + error.statusText;
      this.dialog.open(AuthDialogComponent, {
        data: {
          mensaje: "Error " + error.statusText + " - " + error.message
        }
      });
    } else if (error.status === 403) {
      errorMessage = 'Error: ' + error.statusText;
      //this.securityService.resetPasswordRequired();
    } else if (error.status === 500) {
      errorMessage = 'Error: ' + error.statusText;
    } else {
      errorMessage = 'Error: ' +
        (error.error === undefined || error.error === null ? error :
          error.error.mensaje === undefined || error.error.mensaje === null ? error.message : error.error.mensaje);
    }

    return throwError(errorMessage);
  }

}
