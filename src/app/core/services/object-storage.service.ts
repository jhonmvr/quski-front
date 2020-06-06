import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObjectStorageService extends BaseService {

  constructor( _http:HttpClient  ) { 
      super();
      this.http=_http;      
  }

  createObject(objectEncripted :string, databamongoDb:string,mongoColeccion:string ){ 
    const headersLoc= new HttpHeaders({'Authorization':environment.authprefix+ localStorage.getItem(environment.authTokenKey), 
    'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set("databaseName",databamongoDb ).set("collectionName",mongoColeccion).set( "objectEncripted", objectEncripted);
    let optionsLoc = {
      headers: headersLoc,
      params:params
    };
    return this.http.get( this.genericResourcesUrl+ "mongoRestController/createObject",optionsLoc );
  }

  getObjectById(objectId:string, databamongoDb:string,mongoColeccion:string ){ 
    const headersLoc= new HttpHeaders({'Authorization':environment.authprefix+ localStorage.getItem(environment.authTokenKey), 
    'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set("databaseName",databamongoDb )
    .set("collectionName",mongoColeccion)
    .set( "objectId", objectId);
    let optionsLoc = {
      headers: headersLoc,
      params:params
    };
    return this.http.get( this.genericResourcesUrl+ "mongoRestController/findObjectById",optionsLoc );
  }


}
