import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService extends BaseService {


  constructor(_http: HttpClient) {
    super();
    this.http = _http;
    this.setParameter();
  }


  public findPerfiles() {
    const serviceUrl =
      this.genericResourcesUrl + 'mongoRestController/findObjectsInCollection';
    this.params = new HttpParams().set('databaseName', this.databaseName);
    this.params = this.params.set('collectionName', "perfiles");
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  
  public actualizarUsuarioPerfiles(objectId, ObjectEncriptedWrapper) {
    const serviceUrl =
      this.genericResourcesUrl + 'mongoRestController/updateObjectBig';
    this.params = new HttpParams().set('databaseName', this.databaseName);
    this.params = this.params.set('collectionName', "perfiles");
    this.params = this.params.set('objectId', objectId);
  
    this.options = { headers: this.headers, params: this.params };
    return this.http.post(serviceUrl, ObjectEncriptedWrapper, this.options);
  }
}
