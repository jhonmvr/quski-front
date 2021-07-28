import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

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
    .set("databaseName",databamongoDb ).set("collectionName",mongoColeccion);
    let optionsLoc = {
      headers: headersLoc,
      params:params
    };
    return this.http.post( this.genericResourcesUrl+ "mongoRestController/createObjectBigZ", {objectEncripted:objectEncripted},optionsLoc );
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
  findObjectById(databaseName:string, collectionName:string,objectId:string ) {
    this.setParameter();
    const serviceUrl = this.genericResourcesUrl + "mongoRestController/findObjectById";
    this.params = new HttpParams().set('databaseName', databaseName).set('collectionName', collectionName).set('objectId', objectId);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options).pipe(
      tap( 
        (data: any) => data,
        error => { }
      )
    );
  }


}
