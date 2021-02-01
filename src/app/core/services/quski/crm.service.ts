import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { ReNoticeService } from '../re-notice.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GuardarProspectoCRM } from '../../model/crm/guardarProspectoCRM';




import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
@Injectable({
  providedIn: "root"
})
export class CRMService extends BaseService {
  constructor(_http: HttpClient,
    private dialog: MatDialog, private ns: ReNoticeService) {
    super();
    this.http = _http;
    this.setParameter();

  }
  public findClienteByCedulaCRM(identificacion: string) {
    const serviceUrl = this.crmResourcesUrl + 'prospectoQuskiRestController/getProspectoByCedula';
    this.params = new HttpParams().set('ced', identificacion);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }

  // ---------------> // Guardado del prospectoo en el CRM
  public guardarProspectoCRM(crm: GuardarProspectoCRM) {
    let serviceUrl = this.crmResourcesUrl + "prospectoQuskiRestController/persistEntity";
    let wrapper = { entidad: crm };
    this.options = { headers: this.headers };
    return this.http.post(serviceUrl, wrapper, this.options).pipe(
      tap( // Log the result or error
        (data: any) => data,
        error => { /*this.HandleError(error, new ReNoticeService(),this.dialog);*/ }
      )
    );
  }
}