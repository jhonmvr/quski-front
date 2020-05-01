import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Page } from '../model/page';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';

import { Parametro } from '../model/Parametro';
import { Observable, of } from 'rxjs';
import { BaseWrapper } from '../model/basewrapper';
import { GenericBaseWrapper } from '../model/generic-basewrapper';
import { environment } from '../../../environments/environment';

export class BaseService {
  public headers: HttpHeaders;
  // public optionsOld: RequestOptions;
  public options;
  public services: any;
  public params: HttpParams;
  public http: HttpClient;
  // public httpOld:Http;
  public parametros: Array<Parametro>;

  public segRootContextUrl: string;
  public segResourcesUrl: string;
  public appRootContextUrl: string;
  public appResourcesUrl: string;
  public appWebSocketUrl: string;
  public menuServiceUrl: string;
  public userRolServiceUrl: string;

  public genericResourcesUrl: string;
  public mongoDb: string;
  public mongoAlertaColeccion: string;

  public keyUnencrypt: string;

  public idleStart: string;
  public idelTimeout: string;
  public versionFront: string;
  

  constructor() {
    this.params = new HttpParams();
    if (localStorage.getItem('reUser')) {
      const u = localStorage.getItem('reUser');
    this.headers= new HttpHeaders({ 'Content-Type': 'application/json' });
    if( localStorage.getItem( environment.authTokenKey ) ){
      this.headers=new HttpHeaders({ 
        'Authorization':environment.authprefix+ localStorage.getItem(environment.authTokenKey),
        'Content-Type': 'application/json' }
        );
    }

      this.options = {
          headers: this.headers,
      };
    }
  }

  public setParameter() {
           localStorage.setItem('setRE000', 'true');
           this.keyUnencrypt = atob( localStorage.getItem(environment.prefix +'RE011'));
           //Url de acceso al rootcontext de seguridad core-security-web
           this.segRootContextUrl = atob(localStorage.getItem( environment.prefix +  'RE001')).replace(this.keyUnencrypt, '');
           //Url de acceso al resources de seguridad core-security-web
           this.segResourcesUrl = atob(localStorage.getItem( environment.prefix + 'RE002')).replace(this.keyUnencrypt, '');
           //Full url para datos de usuario por rol core-security-web
           this.userRolServiceUrl = atob(localStorage.getItem( environment.prefix + 'RE003')).replace(this.keyUnencrypt, '');
           //Full url par datos del servicio core-security-web
           this.menuServiceUrl = atob(localStorage.getItem( environment.prefix + 'RE004')).replace(this.keyUnencrypt, '');
           //Path al rootcontext de la app 
           this.appRootContextUrl = atob(localStorage.getItem( environment.prefix + 'RE005')).replace(this.keyUnencrypt, '');
           //Path al resources de la app
           this.appResourcesUrl = atob(localStorage.getItem( environment.prefix + 'RE006')).replace(this.keyUnencrypt, '');
           //Full url al servidor de websocket generic-relative-core
           this.appWebSocketUrl = atob(localStorage.getItem( environment.prefix + 'RE007')).replace(this.keyUnencrypt, '');
           //Path contextroot generic-relative-core
           this.genericResourcesUrl = atob(localStorage.getItem( environment.prefix + 'RE008')).replace(this.keyUnencrypt, '');
           //object storage 
           this.mongoDb = atob(localStorage.getItem( environment.prefix + 'RE009')).replace(this.keyUnencrypt, '');
           this.mongoAlertaColeccion = atob(localStorage.getItem( environment.prefix + 'RE010')).replace(this.keyUnencrypt, '');
           //parametros quski
           
  }

   
  

  public getSystemDate() {
    this.options = { headers: this.headers };
    return this.http.get(
      this.appResourcesUrl + 'parametroRestController/getSystemDate',
      this.options
    );
  }

  public setHeaderWithSegToken(token: string) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    });
  }

  /**
   * Metodo que setea los parametros de busqueda necesarios para la paguinacion
   * @param page: Page
   * @param page = page.pageNumber
   * @param pageSize = page.size  *
   * @returns this.params = new HttpParams();
   * @see mira un ejemplo en AgenciaListComponent
   * @author Jhon Romero
   */
  public setSearchParams(page: Page) {
    this.params = new HttpParams();
    this.params = this.params.set('page', '' + page.pageNumber);
    this.params = this.params.append('pageSize', '' + page.size);
    if (page.sortFields && page.sortFields !== '') {
      this.params = this.params.append('sortFields', page.sortFields);
    }
    if (page.sortDirections && page.sortDirections !== '') {
      this.params = this.params.append('sortDirections', page.sortDirections);
    }
    this.params = this.params.append('isPaginated', page.isPaginated);
  }

  public getAllPaginatedUrl(page: Page, url: string) {
    this.setSearchParams(page);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(url, this.options);
  }

  public findByPkurl(id: string, serviceUrl: string) {
    this.params = new HttpParams();
    this.params = this.params.set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findByParams(params: HttpParams, serviceUrl: string) {
    this.params = params;
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public manageurl(entidad, serviceUrl: string) {
    this.options = { headers: this.headers };
    const dataEnvio = { entidad: entidad };
    return this.http.post<any>(serviceUrl, dataEnvio, this.options);
  }

   public manageGenericUrl(generic, wrapper: BaseWrapper, serviceUrl: string) {
    console.log('==> manageGenericUrlxx ' + JSON.stringify(wrapper));
    console.log('==> url ' + serviceUrl);
    this.options = { headers: this.headers };
    return this.http.post<BaseWrapper>(serviceUrl, wrapper, this.options);
  }

  public generateToken(user: string, password: string) {
    
    // if (!localStorage.getItem(AppConfig.TOKEN_KEY)) {
    //   localStorage.removeItem(AppConfig.TOKEN_KEY);
    //   localStorage.removeItem(AppConfig.EXPIRATION_TOKEN_KEY);
    //   localStorage.removeItem(AppConfig.REFRESH_TOKEN_KEY);
    //   return this.getToken(user, password);
    // } else if (localStorage.getItem(AppConfig.EXPIRATION_TOKEN_KEY)) {
    //   return this.refreshToken();
    // }
  }

  private getToken(user: string, password: string) {
    // const headers = new Headers({
    //   'Content-Type': AppConfig.contentTypeToken,
    //   Authorization: 'Basic ' + this.segApiGwyCredential
    // });
    // const params = new HttpParams();
    // if (AppConfig.grantContentTypeToken == 'client_credentials') {
    //   params.set('grant_type', 'client_credentials');
    // } else {
    //   params.set('grant_type', 'password');
    //   if (user) {
    //     params.set('username', user);
    //   }
    //   if (password) {
    //     params.set('password', password);
    //   }
    // }
    // this.options = { headers: headers, params: params };
    // return this.http.post(this.segApiUrlToken, {}, this.options);
  }

  private refreshToken() {
    // if (localStorage.getItem(AppConfig.REFRESH_TOKEN_KEY)) {
    //   const headers = new Headers({
    //     'Content-Type': AppConfig.contentTypeToken,
    //     Authorization: this.segApiGwyCredential
    //   });
    //   this.params.set('grant_type', 'refresh_token');
    //   this.params.set(
    //     'refresh_token',
    //     localStorage.getItem(AppConfig.REFRESH_TOKEN_KEY)
    //   );
    //   this.options = { headers: headers };
    //   return this.http.post(this.segApiUrlToken, this.options).pipe(
    //     map(
    //       (response: Response) => {
    //         const entidad = response.json();
    //         return entidad;
    //       },
    //       error => {
    //         console.log(
    //           '==>despues de buscar usuario error  ' + JSON.stringify(error)
    //         );
    //         return error;
    //       }
    //     )
    //   );
    // }
  }

  public callGenericServiceAPIJSON(data, service, version) {
    // this.params = new HttpParams();
    // const headers = new Headers({
    //   'Content-Type': 'application/json',
    //   Accept: 'application/json',
    //   Authorization:
    //     AppConfig.authorizationPrefixApi +
    //     localStorage.getItem(AppConfig.TOKEN_KEY)
    // });
    // this.params.set('grant_type', 'client_credentials');
    // this.options = { headers: headers, params: this.params };
    // return this.http.post(
    //   this.segApiUrl + service + '/' + version,
    //   data,
    //   this.options
    // );
  }

  public callGenericServiceAPIJXML(data, service, version) {
    // this.params = new HttpParams();
    // const headers = new Headers({
    //   'Content-Type': 'text/xml',
    //   Accept: 'text/xml',
    //   Authorization:
    //     AppConfig.authorizationPrefixApi +
    //     localStorage.getItem(AppConfig.TOKEN_KEY)
    // });
    // this.params.set('grant_type', 'client_credentials');
    // this.options = { headers: headers, params: this.params };
    // return this.http.post(
    //   this.segApiUrlToken + service + '/' + version,
    //   data,
    //   this.options
    // );
  }

  findBytebyIdUrl(url: string, id: string, fileType: string) {
    console.log('findBytebyIdUrl');
    this.params = new HttpParams();
    this.params.set('id', id);
    this.params.set('fileType', fileType);
    this.options = {
      headers: this.headers,
      params: this.params,
      responseType: 'blob'
    };
    console.log('findBytebyIdUrl options ' + this.options);
    return this.http.get(
      url + '?id=' + id + '&codigo=' + fileType,
      this.options
    );
  }

  public notifyService(data) {
    // this.getTokenCore().subscribe(rData => {
    //   this.params = new HttpParams();
    //   const headers = new Headers({
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     Authorization: AppConfig.authorizationPrefixApi
    //   });
    //   this.options = { headers: headers, params: this.params };
    //   return this.http.post(
    //     this.apiUrlService +
    //       'ssagw/gestor-notificacion-rest/v1.0/notificationRestController/sendMessages',
    //       rData,
    //     this.options
    //   );
    // });
  }

  public notifyServiceSeguridad(data) {
    // this.getToken(null, null).subscribe(token => {
    //   this.envioNotificacion(data, token).subscribe(respuesta => {});
    // });
  }

  private envioNotificacion(data, token) {
    // const headersLoc = new Headers({
    //   'Content-Type': 'application/json',
    //   Accept: 'application/json',
    //   Authorization: AppConfig.authorizationPrefixApi + token.access_token
    // });
    // this.options = { headers: headersLoc };
    // return this.http.post(this.notapiUrlNotificacion, data, this.options);
  }

  private getTokenCore() {
    // const headers = new Headers({
    //   'Content-Type': AppConfig.contentTypeToken,
    //   Authorization: 'Basic ' + this.apiGwyCredential
    // });

    // const params = new HttpParams();
    // params.set('grant_type', 'client_credentials');
    // this.options = { headers: headers, params: params };
    // return this.http.post(this.apiUrlToken, {}, this.options);
  }
}
