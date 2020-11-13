import { Injectable } from '@angular/core';
import{BaseService} from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { tap } from 'rxjs/operators';
import { ReNoticeService } from './re-notice.service';

@Injectable({
  providedIn: 'root'
})
export class ReFileUploadService extends BaseService {

    constructor(_http: HttpClient,
    private dialog: MatDialog) { 
        super();
        this.http=_http;
        this.setParameter();
    }
    
    
    
    public uploadFile(serviceUrl, data){
      this.headers=new HttpHeaders({ 'Content-Type': 'application/json' });
      
      this.options = { headers: this.headers};

        return this.http.post(serviceUrl, data,this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { this.HandleError(error, new ReNoticeService(),this.dialog); }
      )
    );
    }

    /*public uploadFileWithParams(serviceUrl,actor, hash, data){
      let params = new URLSearchParams();
      params.append("actor", actor);
      params.append("hash", hash);
      this.options = { headers: this.headers};
      return this.http.post(serviceUrl, 
              data
              ,this.options).pipe(
                      map((response: Response) => {
                let entidad = response.json();
                return entidad;
            },
          error => {
            //console.log("==>despues de buscar usuario error  " + JSON.stringify(error));
            return error;
          }));
  }*/
}
