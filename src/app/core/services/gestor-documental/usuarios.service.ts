import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends BaseService {


  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }


  public findUsuarios() {
    const serviceUrl =
      this.genericResourcesUrl + 'mongoRestController/findObjectsInCollection';
    this.params = new HttpParams().set('databaseName', this.databaseName);
    this.params = this.params.set('collectionName', "usuarios");
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }


  public findByParams(entidades){
    const serviceUrl =
      this.genericResourcesUrl + 'mongoRestController/findObjectsByParam';
    this.params = new HttpParams().set('databaseName', this.databaseName);
    this.params = this.params.set('collectionName', "estructura-archivos");
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, entidades ,this.options);
  }

}
